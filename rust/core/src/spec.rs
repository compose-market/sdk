use std::collections::BTreeSet;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

pub struct Generation<'a> {
    pub module: &'a str,
    pub spec: &'a str,
}

#[derive(Clone, Debug)]
struct Parsed {
    path: String,
    method: String,
    operation: String,
    tag: String,
}

#[derive(Clone, Debug)]
struct Pending {
    path: String,
    method: String,
    operation: Option<String>,
    tag: Option<String>,
    tags_open: bool,
}

pub fn generate(generation: Generation<'_>) {
    let manifest = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR"));
    let spec = manifest.join(generation.spec);
    println!("cargo:rerun-if-changed={}", spec.display());
    let source = fs::read_to_string(&spec).expect("openapi spec must be readable");
    let operations = parse(&source);
    let routes = render(generation.module, &operations);
    let wire = render_wire(generation.module, &source);
    let out_dir = PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR"));
    fs::write(out_dir.join("routes.rs"), routes).expect("routes.rs must be writable");
    fs::write(out_dir.join("wire.rs"), wire).expect("wire.rs must be writable");
}

fn parse(source: &str) -> Vec<Parsed> {
    let mut operations = Vec::new();
    let mut in_paths = false;
    let mut path = None::<String>;
    let mut pending = None::<Pending>;

    for line in source.lines() {
        let trimmed = line.trim();
        if trimmed == "paths:" {
            in_paths = true;
            continue;
        }
        if trimmed == "components:" {
            flush(&mut pending, &mut operations);
            break;
        }
        if !in_paths {
            continue;
        }

        if let Some(next_path) = path_key(line) {
            flush(&mut pending, &mut operations);
            path = Some(next_path);
            continue;
        }

        if let Some(method) = method_key(line) {
            flush(&mut pending, &mut operations);
            let path = path.clone().expect("method must be nested under a path");
            pending = Some(Pending {
                path,
                method,
                operation: None,
                tag: None,
                tags_open: false,
            });
            continue;
        }

        let Some(current) = pending.as_mut() else {
            continue;
        };

        if let Some(operation) = field(trimmed, "operationId:") {
            current.operation = Some(operation.to_string());
            current.tags_open = false;
            continue;
        }

        if let Some(tags) = inline_tags(trimmed) {
            current.tag = tags.into_iter().next();
            current.tags_open = false;
            continue;
        }

        if trimmed == "tags:" {
            current.tags_open = true;
            continue;
        }

        if current.tags_open {
            if let Some(tag) = list_item(trimmed) {
                current.tag = Some(tag.to_string());
                continue;
            }
            if indentation(line) <= 6 {
                current.tags_open = false;
            }
        }
    }

    flush(&mut pending, &mut operations);
    operations
}

fn flush(pending: &mut Option<Pending>, operations: &mut Vec<Parsed>) {
    let Some(current) = pending.take() else {
        return;
    };
    let Some(operation) = current.operation else {
        return;
    };
    operations.push(Parsed {
        path: current.path,
        method: current.method.to_uppercase(),
        operation,
        tag: current.tag.unwrap_or_else(|| "default".to_string()),
    });
}

fn path_key(line: &str) -> Option<String> {
    if indentation(line) != 2 {
        return None;
    }

    let trimmed = line.trim();
    if !trimmed.ends_with(':') {
        return None;
    }

    let raw = trimmed.trim_end_matches(':').trim();
    if let Some(quoted) = raw
        .strip_prefix('"')
        .and_then(|value| value.strip_suffix('"'))
    {
        return Some(quoted.to_string());
    }
    if raw.starts_with('/') {
        return Some(raw.to_string());
    }
    None
}

fn method_key(line: &str) -> Option<String> {
    if indentation(line) != 4 {
        return None;
    }
    let trimmed = line.trim();
    let method = trimmed.strip_suffix(':')?;
    match method {
        "get" | "post" | "put" | "patch" | "delete" => Some(method.to_string()),
        _ => None,
    }
}

fn field<'a>(line: &'a str, name: &str) -> Option<&'a str> {
    line.strip_prefix(name)
        .map(str::trim)
        .filter(|value| !value.is_empty())
}

fn inline_tags(line: &str) -> Option<Vec<String>> {
    let tags = field(line, "tags:")?;
    let inner = tags.strip_prefix('[')?.strip_suffix(']')?;
    Some(
        inner
            .split(',')
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(|value| value.trim_matches('"').to_string())
            .collect(),
    )
}

fn list_item(line: &str) -> Option<&str> {
    line.strip_prefix("- ")
        .map(str::trim)
        .filter(|value| !value.is_empty())
}

fn indentation(line: &str) -> usize {
    line.chars()
        .take_while(|character| *character == ' ')
        .count()
}

fn render(module: &str, operations: &[Parsed]) -> String {
    let mut names = BTreeSet::new();
    let mut routes = String::new();
    let mut functions = String::new();

    for operation in operations {
        routes.push_str(&format!(
            "    Operation::new(\"{}\", \"{}\", \"{}\", \"{}\", \"{}\", Endpoint::{}),\n",
            escape(module),
            escape(&operation.tag),
            escape(&operation.operation),
            escape(&operation.method),
            escape(&operation.path),
            endpoint(module, &operation.path),
        ));

        let mut name = sanitize(&operation.operation);
        if !names.insert(name.clone()) {
            let base = name.clone();
            let mut suffix = 2;
            loop {
                name = format!("{base}_{suffix}");
                if names.insert(name.clone()) {
                    break;
                }
                suffix += 1;
            }
        }

        functions.push_str(&format!(
            "\npub fn {name}() -> &'static Operation {{\n    operation(\"{}\").expect(\"generated operation exists\")\n}}\n",
            escape(&operation.operation),
        ));
    }

    format!(
        "use compose_core::{{prepare as core_prepare, prepare_call as core_prepare_call, prepare_call_with_path as core_prepare_call_with_path, prepare_json as core_prepare_json, prepare_json_with_path as core_prepare_json_with_path, prepare_with_path as core_prepare_with_path, CallOptions, Endpoint, EndpointConfig, JsonValue, Operation, PreparedRequest, SdkConfig}};\n\n\
         pub const OPERATIONS: &[Operation] = &[\n{routes}];\n\n\
         #[derive(Clone, Debug, Eq, PartialEq)]\n\
         pub struct Client {{\n    config: SdkConfig,\n}}\n\n\
         impl Client {{\n    pub fn new(config: SdkConfig) -> Self {{\n        Self {{ config }}\n    }}\n\n    pub fn from_endpoints(endpoints: EndpointConfig) -> Self {{\n        Self {{ config: SdkConfig {{ endpoints, ..SdkConfig::default() }} }}\n    }}\n\n    pub fn config(&self) -> &SdkConfig {{\n        &self.config\n    }}\n\n    pub fn endpoints(&self) -> &EndpointConfig {{\n        &self.config.endpoints\n    }}\n\n    pub fn prepare(&self, operation: &'static Operation) -> PreparedRequest {{\n        core_prepare(operation, &self.config.endpoints)\n    }}\n\n    pub fn prepare_with_path(&self, operation: &'static Operation, path_params: &[(&str, &str)]) -> PreparedRequest {{\n        core_prepare_with_path(operation, &self.config.endpoints, path_params)\n    }}\n\n    pub fn prepare_call(&self, operation: &'static Operation, options: CallOptions) -> Result<PreparedRequest, compose_core::SdkError> {{\n        core_prepare_call(operation, &self.config, options)\n    }}\n\n    pub fn prepare_call_with_path(&self, operation: &'static Operation, path_params: &[(&str, &str)], options: CallOptions) -> Result<PreparedRequest, compose_core::SdkError> {{\n        core_prepare_call_with_path(operation, &self.config, path_params, options)\n    }}\n\n    pub fn prepare_json(&self, operation: &'static Operation, body: JsonValue, options: CallOptions) -> Result<PreparedRequest, compose_core::SdkError> {{\n        core_prepare_json(operation, &self.config, body, options)\n    }}\n\n    pub fn prepare_json_with_path(&self, operation: &'static Operation, path_params: &[(&str, &str)], body: JsonValue, options: CallOptions) -> Result<PreparedRequest, compose_core::SdkError> {{\n        core_prepare_json_with_path(operation, &self.config, path_params, body, options)\n    }}\n}}\n\n\
         pub fn all() -> &'static [Operation] {{\n    OPERATIONS\n}}\n\n\
         pub fn operation(id: &str) -> Option<&'static Operation> {{\n    OPERATIONS.iter().find(|operation| operation.operation == id)\n}}\n\
         {functions}",
    )
}

fn render_wire(module: &str, source: &str) -> String {
    let value: serde_yaml::Value =
        serde_yaml::from_str(source).expect("openapi spec yaml must parse");
    let normalized = normalize_openapi(value);
    let json = serde_json::to_value(normalized).expect("normalized openapi must convert to json");
    let spec: openapiv3::OpenAPI =
        serde_json::from_value(json).expect("normalized openapi must parse as openapi 3.0");

    let mut settings = progenitor::GenerationSettings::default();
    settings.with_interface(progenitor::InterfaceStyle::Builder);
    let mut generator = progenitor::Generator::new(&settings);
    let tokens = generator
        .generate_tokens(&spec)
        .unwrap_or_else(|error| panic!("{module} openapi must generate rust wire client: {error}"));
    let ast = syn::parse2(tokens).expect("generated rust wire tokens must parse");
    prettyplease::unparse(&ast)
}

fn normalize_openapi(mut value: serde_yaml::Value) -> serde_yaml::Value {
    if let serde_yaml::Value::Mapping(root) = &mut value {
        root.insert(
            serde_yaml::Value::String("openapi".to_string()),
            serde_yaml::Value::String("3.0.3".to_string()),
        );
        root.remove(serde_yaml::Value::String("jsonSchemaDialect".to_string()));
    }
    let root = value.clone();
    inline_property_refs(&root, &mut value);
    normalize_schema_value(&mut value);
    value
}

fn inline_property_refs(root: &serde_yaml::Value, value: &mut serde_yaml::Value) {
    match value {
        serde_yaml::Value::Mapping(map) => {
            let ref_key = serde_yaml::Value::String("$ref".to_string());
            if let Some(serde_yaml::Value::String(reference)) = map.get(&ref_key) {
                if let Some(replacement) = resolve_property_ref(root, reference) {
                    *value = replacement;
                    inline_property_refs(root, value);
                    return;
                }
            }

            for value in map.values_mut() {
                inline_property_refs(root, value);
            }
        }
        serde_yaml::Value::Sequence(values) => {
            for value in values {
                inline_property_refs(root, value);
            }
        }
        _ => {}
    }
}

fn resolve_property_ref(root: &serde_yaml::Value, reference: &str) -> Option<serde_yaml::Value> {
    let path = reference.strip_prefix("#/components/schemas/")?;
    let (schema, property) = path.split_once("/properties/")?;
    let mut current = root;
    for segment in ["components", "schemas", schema, "properties", property] {
        let map = match current {
            serde_yaml::Value::Mapping(map) => map,
            _ => return None,
        };
        current = map.get(serde_yaml::Value::String(unescape_pointer(segment)))?;
    }
    Some(current.clone())
}

fn unescape_pointer(segment: &str) -> String {
    segment.replace("~1", "/").replace("~0", "~")
}

fn normalize_schema_value(value: &mut serde_yaml::Value) {
    match value {
        serde_yaml::Value::Mapping(map) => {
            normalize_exclusive_bound(map, "exclusiveMinimum", "minimum");
            normalize_exclusive_bound(map, "exclusiveMaximum", "maximum");
            normalize_type_union(map);
            normalize_null_type(map);
            normalize_null_union_branch(map, "oneOf");
            normalize_null_union_branch(map, "anyOf");

            if let Some(constant) = map.remove(serde_yaml::Value::String("const".to_string())) {
                if !map.contains_key(serde_yaml::Value::String("enum".to_string())) {
                    map.insert(
                        serde_yaml::Value::String("enum".to_string()),
                        serde_yaml::Value::Sequence(vec![constant.clone()]),
                    );
                }
                if !map.contains_key(serde_yaml::Value::String("type".to_string())) {
                    if let Some(kind) = infer_json_type(&constant) {
                        map.insert(
                            serde_yaml::Value::String("type".to_string()),
                            serde_yaml::Value::String(kind.to_string()),
                        );
                    }
                }
            }

            for value in map.values_mut() {
                normalize_schema_value(value);
            }
        }
        serde_yaml::Value::Sequence(values) => {
            for value in values {
                normalize_schema_value(value);
            }
        }
        _ => {}
    }
}

fn normalize_exclusive_bound(map: &mut serde_yaml::Mapping, exclusive: &str, inclusive: &str) {
    let exclusive_key = serde_yaml::Value::String(exclusive.to_string());
    let Some(value) = map.get(&exclusive_key).cloned() else {
        return;
    };
    if matches!(value, serde_yaml::Value::Bool(_)) {
        return;
    }
    map.insert(serde_yaml::Value::String(inclusive.to_string()), value);
    map.insert(exclusive_key, serde_yaml::Value::Bool(true));
}

fn normalize_null_type(map: &mut serde_yaml::Mapping) {
    let key = serde_yaml::Value::String("type".to_string());
    if map.get(&key) != Some(&serde_yaml::Value::String("null".to_string())) {
        return;
    }
    map.remove(&key);
    map.insert(
        serde_yaml::Value::String("nullable".to_string()),
        serde_yaml::Value::Bool(true),
    );
}

fn normalize_null_union_branch(map: &mut serde_yaml::Mapping, union_key: &str) {
    let key = serde_yaml::Value::String(union_key.to_string());
    let Some(serde_yaml::Value::Sequence(values)) = map.get_mut(&key) else {
        return;
    };
    let before = values.len();
    values.retain(|value| !is_null_schema(value));
    if values.len() != before {
        map.insert(
            serde_yaml::Value::String("nullable".to_string()),
            serde_yaml::Value::Bool(true),
        );
    }
}

fn is_null_schema(value: &serde_yaml::Value) -> bool {
    let serde_yaml::Value::Mapping(map) = value else {
        return false;
    };
    map.get(serde_yaml::Value::String("type".to_string()))
        == Some(&serde_yaml::Value::String("null".to_string()))
}

fn normalize_type_union(map: &mut serde_yaml::Mapping) {
    let key = serde_yaml::Value::String("type".to_string());
    let Some(serde_yaml::Value::Sequence(types)) = map.get(&key).cloned() else {
        return;
    };

    let mut nullable = false;
    let mut concrete = Vec::new();
    for value in types {
        match value {
            serde_yaml::Value::String(kind) if kind == "null" => nullable = true,
            serde_yaml::Value::String(kind) => {
                let mut schema = serde_yaml::Mapping::new();
                schema.insert(
                    serde_yaml::Value::String("type".to_string()),
                    serde_yaml::Value::String(kind),
                );
                concrete.push(serde_yaml::Value::Mapping(schema));
            }
            other => {
                let mut schema = serde_yaml::Mapping::new();
                schema.insert(key.clone(), other);
                concrete.push(serde_yaml::Value::Mapping(schema));
            }
        }
    }

    if nullable {
        map.insert(
            serde_yaml::Value::String("nullable".to_string()),
            serde_yaml::Value::Bool(true),
        );
    }

    match concrete.as_slice() {
        [] => {
            map.remove(&key);
        }
        [schema] => {
            if let serde_yaml::Value::Mapping(schema_map) = schema {
                if let Some(kind) = schema_map.get(&key).cloned() {
                    map.insert(key, kind);
                } else {
                    map.remove(&key);
                    map.insert(
                        serde_yaml::Value::String("oneOf".to_string()),
                        serde_yaml::Value::Sequence(vec![schema.clone()]),
                    );
                }
            }
        }
        _ => {
            map.remove(&key);
            map.insert(
                serde_yaml::Value::String("oneOf".to_string()),
                serde_yaml::Value::Sequence(concrete),
            );
        }
    }
}

fn infer_json_type(value: &serde_yaml::Value) -> Option<&'static str> {
    match value {
        serde_yaml::Value::Bool(_) => Some("boolean"),
        serde_yaml::Value::Number(number) if number.as_i64().is_some() => Some("integer"),
        serde_yaml::Value::Number(_) => Some("number"),
        serde_yaml::Value::String(_) => Some("string"),
        _ => None,
    }
}

fn endpoint(module: &str, path: &str) -> &'static str {
    match module {
        "channels" => "Channels",
        "manowar" if path.starts_with("/mcps") || path.starts_with("/onchain") => "Connectors",
        _ => "Api",
    }
}

fn escape(value: &str) -> String {
    value.replace('\\', "\\\\").replace('"', "\\\"")
}

fn sanitize(value: &str) -> String {
    let mut output = String::new();
    for character in value.chars() {
        if character.is_ascii_alphanumeric() {
            output.push(character.to_ascii_lowercase());
        } else {
            output.push('_');
        }
    }
    while output.contains("__") {
        output = output.replace("__", "_");
    }
    output = output.trim_matches('_').to_string();
    if output.is_empty()
        || output
            .chars()
            .next()
            .is_some_and(|character| character.is_ascii_digit())
    {
        output = format!("op_{output}");
    }
    if is_reserved(&output) {
        output = format!("op_{output}");
    }
    output
}

fn is_reserved(value: &str) -> bool {
    matches!(
        value,
        "as" | "async"
            | "await"
            | "break"
            | "const"
            | "continue"
            | "crate"
            | "else"
            | "enum"
            | "extern"
            | "false"
            | "fn"
            | "for"
            | "if"
            | "impl"
            | "in"
            | "let"
            | "loop"
            | "match"
            | "mod"
            | "move"
            | "mut"
            | "pub"
            | "ref"
            | "return"
            | "self"
            | "static"
            | "struct"
            | "super"
            | "trait"
            | "true"
            | "type"
            | "unsafe"
            | "use"
            | "where"
            | "while"
            | "yield"
    )
}

#[allow(dead_code)]
fn normalize(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}
