#[cfg(feature = "codegen")]
pub mod spec;

use std::collections::BTreeMap;

pub const API_URL: &str = "https://api.compose.market";
pub const CHANNELS_URL: &str = "https://services.compose.market";
pub const CONNECTORS_URL: &str = "https://connectors.compose.market";

pub type JsonValue = serde_json::Value;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Endpoint {
    Api,
    Channels,
    Connectors,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EndpointConfig {
    pub api: String,
    pub channels: String,
    pub connectors: String,
}

impl Default for EndpointConfig {
    fn default() -> Self {
        Self {
            api: API_URL.to_string(),
            channels: CHANNELS_URL.to_string(),
            connectors: CONNECTORS_URL.to_string(),
        }
    }
}

impl EndpointConfig {
    pub fn base(&self, endpoint: Endpoint) -> &str {
        match endpoint {
            Endpoint::Api => &self.api,
            Endpoint::Channels => &self.channels,
            Endpoint::Connectors => &self.connectors,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SdkConfig {
    pub endpoints: EndpointConfig,
    pub key: Option<String>,
    pub user_address: Option<String>,
    pub chain_id: Option<u64>,
    pub user_agent: String,
    pub default_headers: BTreeMap<String, String>,
}

impl Default for SdkConfig {
    fn default() -> Self {
        Self {
            endpoints: EndpointConfig::default(),
            key: None,
            user_address: None,
            chain_id: None,
            user_agent: format!("@compose-market/sdk/{}", env!("CARGO_PKG_VERSION")),
            default_headers: BTreeMap::new(),
        }
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Operation {
    pub module: &'static str,
    pub tag: &'static str,
    pub operation: &'static str,
    pub method: &'static str,
    pub path: &'static str,
    pub endpoint: Endpoint,
}

impl Operation {
    pub const fn new(
        module: &'static str,
        tag: &'static str,
        operation: &'static str,
        method: &'static str,
        path: &'static str,
        endpoint: Endpoint,
    ) -> Self {
        Self {
            module,
            tag,
            operation,
            method,
            path,
            endpoint,
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PreparedRequest {
    pub method: &'static str,
    pub path: String,
    pub url: String,
    pub endpoint: Endpoint,
    pub headers: BTreeMap<String, String>,
    pub body: Option<String>,
}

pub fn prepare(operation: &'static Operation, endpoints: &EndpointConfig) -> PreparedRequest {
    prepare_with_path(operation, endpoints, &[])
}

pub fn prepare_with_path(
    operation: &'static Operation,
    endpoints: &EndpointConfig,
    path_params: &[(&str, &str)],
) -> PreparedRequest {
    let base = endpoints.base(operation.endpoint).trim_end_matches('/');
    let operation_path = substitute_path_params(operation.path, path_params);
    let url = format!("{base}/{}", operation_path.trim_start_matches('/'));
    PreparedRequest {
        method: operation.method,
        path: operation_path,
        url,
        endpoint: operation.endpoint,
        headers: BTreeMap::new(),
        body: None,
    }
}

pub fn prepare_call(
    operation: &'static Operation,
    config: &SdkConfig,
    options: CallOptions,
) -> Result<PreparedRequest, SdkError> {
    prepare_call_with_path(operation, config, &[], options)
}

pub fn prepare_call_with_path(
    operation: &'static Operation,
    config: &SdkConfig,
    path_params: &[(&str, &str)],
    options: CallOptions,
) -> Result<PreparedRequest, SdkError> {
    let mut request = prepare_with_path(operation, &config.endpoints, path_params);
    request.headers = build_headers(config, &options, false)?;
    Ok(request)
}

pub fn prepare_json(
    operation: &'static Operation,
    config: &SdkConfig,
    body: JsonValue,
    options: CallOptions,
) -> Result<PreparedRequest, SdkError> {
    prepare_json_with_path(operation, config, &[], body, options)
}

pub fn prepare_json_with_path(
    operation: &'static Operation,
    config: &SdkConfig,
    path_params: &[(&str, &str)],
    body: JsonValue,
    options: CallOptions,
) -> Result<PreparedRequest, SdkError> {
    let mut request = prepare_with_path(operation, &config.endpoints, path_params);
    request.headers = build_headers(config, &options, true)?;
    request.body = Some(serde_json::to_string(&body).map_err(|error| {
        SdkError::InvalidRequest(format!("request body must serialize as JSON: {error}"))
    })?);
    Ok(request)
}

fn substitute_path_params(path: &str, path_params: &[(&str, &str)]) -> String {
    let mut output = path.to_string();
    for (key, value) in path_params {
        let placeholder = format!("{{{key}}}");
        output = output.replace(&placeholder, &percent_encode_path_segment(value));
    }
    output
}

fn percent_encode_path_segment(value: &str) -> String {
    let mut output = String::new();
    for byte in value.as_bytes() {
        match *byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' => {
                output.push(*byte as char)
            }
            byte => output.push_str(&format!("%{byte:02X}")),
        }
    }
    output
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HttpRequest {
    pub method: &'static str,
    pub path: String,
    pub url: String,
    pub endpoint: Endpoint,
    pub headers: BTreeMap<String, String>,
    pub body: Option<String>,
}

impl From<PreparedRequest> for HttpRequest {
    fn from(request: PreparedRequest) -> Self {
        Self {
            method: request.method,
            path: request.path,
            url: request.url,
            endpoint: request.endpoint,
            headers: request.headers,
            body: request.body,
        }
    }
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct HttpResponse {
    pub status: u16,
    pub headers: BTreeMap<String, String>,
    pub body: Option<String>,
}

pub trait Transport {
    fn send(&mut self, request: HttpRequest) -> Result<HttpResponse, SdkError>;
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct X402SignInput {
    pub payment_required: JsonValue,
    pub payment_required_header: Option<String>,
    pub method: &'static str,
    pub path: String,
    pub url: String,
    pub body: Option<String>,
    pub user_address: Option<String>,
    pub chain_id: Option<u64>,
    pub max_amount_wei: Option<String>,
}

pub type X402Signer = dyn Fn(X402SignInput) -> Result<String, SdkError>;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct JsonCompletion {
    pub data: JsonValue,
    pub response: HttpResponse,
    pub receipt: JsonValue,
    pub request_id: Option<String>,
    pub budget_remaining: Option<String>,
    pub session_invalid_reason: Option<String>,
}

pub struct HttpClient<T> {
    config: SdkConfig,
    transport: T,
    x402_signer: Option<Box<X402Signer>>,
}

impl<T: Transport> HttpClient<T> {
    pub fn new(config: SdkConfig, transport: T) -> Self {
        Self {
            config,
            transport,
            x402_signer: None,
        }
    }

    pub fn with_x402_signer(
        mut self,
        signer: impl Fn(X402SignInput) -> Result<String, SdkError> + 'static,
    ) -> Self {
        self.x402_signer = Some(Box::new(signer));
        self
    }

    pub fn config(&self) -> &SdkConfig {
        &self.config
    }

    pub fn execute_json(
        &mut self,
        operation: &'static Operation,
        body: JsonValue,
        options: CallOptions,
    ) -> Result<JsonCompletion, SdkError> {
        let prepared = prepare_json(operation, &self.config, body, options.clone())?;
        let mut request: HttpRequest = prepared.into();
        let mut response = self.transport.send(request.clone())?;

        if options.payment_mode == PaymentMode::Auto
            && request.headers.contains_key("authorization")
            && self.x402_signer.is_some()
            && is_invalid_key_response(&response)
        {
            request.headers.remove("authorization");
            request.headers.remove("payment-signature");
            response = self.transport.send(request.clone())?;
        }

        if response.status == 402 && options.payment_mode != PaymentMode::Key {
            if let Some(signer) = &self.x402_signer {
                let payment_required_header = get_header(&response.headers, "payment-required")
                    .or_else(|| get_header(&response.headers, "PAYMENT-REQUIRED"))
                    .map(str::to_string);
                let payment_required = extract_payment_required(
                    response.body.as_deref(),
                    payment_required_header.as_deref(),
                )?;
                let signature = signer(X402SignInput {
                    payment_required,
                    payment_required_header,
                    method: request.method,
                    path: request.path.clone(),
                    url: request.url.clone(),
                    body: request.body.clone(),
                    user_address: get_header(&request.headers, "x-session-user-address")
                        .map(str::to_string),
                    chain_id: get_header(&request.headers, "x-chain-id")
                        .and_then(|value| value.parse::<u64>().ok()),
                    max_amount_wei: get_header(&request.headers, "x-x402-max-amount-wei")
                        .map(str::to_string),
                })?;

                request.headers.remove("authorization");
                request
                    .headers
                    .insert("payment-signature".to_string(), signature);
                response = self.transport.send(request)?;
            }
        }

        if response.status >= 400 {
            return Err(SdkError::HttpStatus {
                status: response.status,
                body: response.body.clone(),
            });
        }

        let data = match response.body.as_deref() {
            Some(body) if !body.trim().is_empty() => serde_json::from_str(body)
                .map_err(|error| SdkError::InvalidJson(error.to_string()))?,
            _ => JsonValue::Null,
        };

        Ok(JsonCompletion {
            receipt: parse_header_json(&response.headers, "x-receipt"),
            request_id: get_header(&response.headers, "x-request-id").map(str::to_string),
            budget_remaining: get_header(&response.headers, "x-session-budget-remaining")
                .map(str::to_string),
            session_invalid_reason: get_header(&response.headers, "x-session-invalid")
                .map(str::to_string),
            data,
            response,
        })
    }
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub enum PaymentMode {
    #[default]
    Auto,
    Key,
    X402,
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub enum KeyOverride {
    #[default]
    Inherit,
    Use(String),
    Suppress,
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct CallOptions {
    pub payment_mode: PaymentMode,
    pub key: KeyOverride,
    pub user_address: Option<String>,
    pub chain_id: Option<u64>,
    pub payment_signature: Option<String>,
    pub x402_max_amount_wei: Option<String>,
    pub idempotency_key: Option<String>,
    pub run_id: Option<String>,
    pub request_id: Option<String>,
    pub extra_headers: BTreeMap<String, String>,
}

pub fn build_headers(
    config: &SdkConfig,
    options: &CallOptions,
    json_body: bool,
) -> Result<BTreeMap<String, String>, SdkError> {
    let mut headers = BTreeMap::new();
    for (key, value) in &config.default_headers {
        if !value.is_empty() {
            headers.insert(normalize_header_name(key), value.clone());
        }
    }

    if json_body {
        headers.insert("content-type".to_string(), "application/json".to_string());
    }

    if let Some(key) = resolve_key(config, options) {
        headers.insert("authorization".to_string(), format!("Bearer {key}"));
    }

    if let Some(user_address) = options
        .user_address
        .as_ref()
        .or(config.user_address.as_ref())
    {
        headers.insert(
            "x-session-user-address".to_string(),
            normalize_user_address(user_address)?,
        );
    }

    if let Some(chain_id) = options.chain_id.or(config.chain_id) {
        if chain_id == 0 {
            return Err(SdkError::InvalidChainId);
        }
        headers.insert("x-chain-id".to_string(), chain_id.to_string());
    }

    if let Some(payment_signature) = &options.payment_signature {
        if !payment_signature.is_empty() {
            headers.insert("payment-signature".to_string(), payment_signature.clone());
        }
    }

    if let Some(amount) = &options.x402_max_amount_wei {
        headers.insert(
            "x-x402-max-amount-wei".to_string(),
            normalize_atomic_amount(amount, "x402MaxAmountWei")?,
        );
    }

    if let Some(idempotency_key) = &options.idempotency_key {
        if !idempotency_key.is_empty() {
            headers.insert("x-idempotency-key".to_string(), idempotency_key.clone());
        }
    }

    if let Some(run_id) = &options.run_id {
        if !run_id.is_empty() {
            headers.insert("x-run-id".to_string(), run_id.clone());
        }
    }

    if let Some(request_id) = &options.request_id {
        if !request_id.is_empty() {
            headers.insert("x-request-id".to_string(), request_id.clone());
        }
    }

    for (key, value) in &options.extra_headers {
        if !value.is_empty() {
            headers.insert(normalize_header_name(key), value.clone());
        }
    }

    headers
        .entry("user-agent".to_string())
        .or_insert_with(|| config.user_agent.clone());

    Ok(headers)
}

fn resolve_key<'a>(config: &'a SdkConfig, options: &'a CallOptions) -> Option<&'a str> {
    if options.payment_mode == PaymentMode::X402 {
        return None;
    }
    match &options.key {
        KeyOverride::Inherit => config.key.as_deref(),
        KeyOverride::Use(key) => Some(key.as_str()),
        KeyOverride::Suppress => None,
    }
}

fn normalize_header_name(value: &str) -> String {
    value.trim().to_ascii_lowercase()
}

fn normalize_user_address(value: &str) -> Result<String, SdkError> {
    let trimmed = value.trim().to_ascii_lowercase();
    let valid = trimmed.len() == 42
        && trimmed.starts_with("0x")
        && trimmed[2..]
            .chars()
            .all(|character| character.is_ascii_hexdigit());
    if !valid {
        return Err(SdkError::InvalidUserAddress);
    }
    Ok(trimmed)
}

fn normalize_atomic_amount(value: &str, field: &'static str) -> Result<String, SdkError> {
    let trimmed = value.trim();
    if trimmed.is_empty() || !trimmed.chars().all(|character| character.is_ascii_digit()) {
        return Err(SdkError::InvalidAmount(field));
    }

    let normalized = trimmed.trim_start_matches('0');
    if normalized.is_empty() {
        return Err(SdkError::InvalidAmount(field));
    }
    Ok(normalized.to_string())
}

fn get_header<'a>(headers: &'a BTreeMap<String, String>, name: &str) -> Option<&'a str> {
    headers
        .get(&name.to_ascii_lowercase())
        .or_else(|| headers.get(name))
        .map(String::as_str)
}

fn parse_header_json(headers: &BTreeMap<String, String>, name: &str) -> JsonValue {
    get_header(headers, name)
        .and_then(|value| serde_json::from_str(value).ok())
        .unwrap_or(JsonValue::Null)
}

fn extract_payment_required(
    body: Option<&str>,
    header: Option<&str>,
) -> Result<JsonValue, SdkError> {
    if let Some(header) = header.filter(|value| !value.is_empty()) {
        let bytes = decode_base64_url(header)?;
        let value: JsonValue = serde_json::from_slice(&bytes)
            .map_err(|error| SdkError::InvalidPaymentRequired(error.to_string()))?;
        if is_payment_required(&value) {
            return Ok(value);
        }
    }

    if let Some(body) = body.filter(|value| !value.trim().is_empty()) {
        if let Ok(value) = serde_json::from_str::<JsonValue>(body) {
            if is_payment_required(&value) {
                return Ok(value);
            }
        }
    }

    Err(SdkError::InvalidPaymentRequired(
        "missing x402 payment challenge".to_string(),
    ))
}

fn is_payment_required(value: &JsonValue) -> bool {
    value
        .get("x402Version")
        .and_then(JsonValue::as_u64)
        .is_some_and(|version| version == 2)
        && value.get("accepts").and_then(JsonValue::as_array).is_some()
}

fn is_invalid_key_response(response: &HttpResponse) -> bool {
    matches!(response.status, 401 | 403)
        && response
            .body
            .as_deref()
            .and_then(error_code)
            .is_some_and(|code| matches!(code.as_str(), "invalid_key" | "authentication_error"))
}

fn error_code(body: &str) -> Option<String> {
    let value = serde_json::from_str::<JsonValue>(body).ok()?;
    value
        .get("error")
        .and_then(|error| error.get("code"))
        .and_then(JsonValue::as_str)
        .or_else(|| value.get("code").and_then(JsonValue::as_str))
        .map(str::to_string)
}

fn decode_base64_url(value: &str) -> Result<Vec<u8>, SdkError> {
    let mut buffer = 0u32;
    let mut bits = 0u8;
    let mut output = Vec::new();

    for character in value.chars() {
        if character == '=' {
            break;
        }
        let Some(sextet) = base64_url_value(character) else {
            return Err(SdkError::InvalidPaymentRequired(format!(
                "invalid base64-url character: {character}"
            )));
        };
        buffer = (buffer << 6) | u32::from(sextet);
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            output.push(((buffer >> bits) & 0xff) as u8);
        }
    }

    Ok(output)
}

fn base64_url_value(character: char) -> Option<u8> {
    match character {
        'A'..='Z' => Some(character as u8 - b'A'),
        'a'..='z' => Some(character as u8 - b'a' + 26),
        '0'..='9' => Some(character as u8 - b'0' + 52),
        '-' => Some(62),
        '_' => Some(63),
        _ => None,
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MemoryScope {
    Global,
    Local { hai_id: String },
}

impl MemoryScope {
    pub fn global() -> Self {
        Self::Global
    }

    pub fn local(hai_id: impl Into<String>) -> Result<Self, SdkError> {
        let hai_id = hai_id.into();
        if hai_id.trim().is_empty() {
            return Err(SdkError::MissingHaiId);
        }
        Ok(Self::Local { hai_id })
    }

    pub fn scope(&self) -> &'static str {
        match self {
            Self::Global => "global",
            Self::Local { .. } => "local",
        }
    }

    pub fn hai_id(&self) -> Option<&str> {
        match self {
            Self::Global => None,
            Self::Local { hai_id } => Some(hai_id),
        }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SdkError {
    MissingHaiId,
    HttpStatus { status: u16, body: Option<String> },
    InvalidAmount(&'static str),
    InvalidChainId,
    InvalidJson(String),
    InvalidPaymentRequired(String),
    InvalidRequest(String),
    InvalidUserAddress,
    OperationNotFound(String),
    Transport(String),
}

impl std::fmt::Display for SdkError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::MissingHaiId => formatter.write_str("local memory scope requires hai_id"),
            Self::HttpStatus { status, body } => {
                write!(formatter, "HTTP request failed with status {status}")?;
                if let Some(body) = body {
                    write!(formatter, ": {body}")?;
                }
                Ok(())
            }
            Self::InvalidAmount(field) => {
                write!(formatter, "{field} must be a positive integer string")
            }
            Self::InvalidChainId => formatter.write_str("chain_id must be a positive integer"),
            Self::InvalidJson(message) => write!(formatter, "invalid JSON response: {message}"),
            Self::InvalidPaymentRequired(message) => {
                write!(formatter, "invalid PAYMENT-REQUIRED challenge: {message}")
            }
            Self::InvalidRequest(message) => formatter.write_str(message),
            Self::InvalidUserAddress => {
                formatter.write_str("user_address must be a valid 0x-prefixed EVM address")
            }
            Self::OperationNotFound(operation) => {
                write!(formatter, "operation not found: {operation}")
            }
            Self::Transport(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for SdkError {}

pub mod config {
    pub use crate::{Endpoint, EndpointConfig, SdkConfig, API_URL, CHANNELS_URL, CONNECTORS_URL};
}

pub mod routing {
    pub use crate::{
        prepare, prepare_call, prepare_call_with_path, prepare_json, prepare_json_with_path,
        prepare_with_path, Endpoint, Operation, PreparedRequest,
    };
}

pub mod auth {
    #[derive(Clone, Debug, Default, Eq, PartialEq)]
    pub struct AuthHeaders {
        pub compose_key: Option<String>,
        pub user_address: Option<String>,
        pub chain_id: Option<u64>,
    }
}

pub mod payment {
    pub use crate::{CallOptions, KeyOverride, PaymentMode};

    #[derive(Clone, Debug, Default, Eq, PartialEq)]
    pub struct RetryPlan {
        pub max_amount_wei: Option<String>,
        pub idempotency_key: Option<String>,
        pub suppress_compose_key: bool,
    }
}

pub mod stream {
    use std::collections::BTreeMap;

    use crate::{JsonValue, SdkError};

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct Frame {
        pub event: Option<String>,
        pub data: String,
        pub id: Option<String>,
        pub retry: Option<u64>,
    }

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub enum ModelEvent {
        Start {
            response_id: Option<String>,
            model: Option<String>,
        },
        TextDelta {
            response_id: Option<String>,
            delta: String,
        },
        TextDone {
            response_id: Option<String>,
            text: String,
        },
        ReasoningDelta {
            response_id: Option<String>,
            delta: String,
        },
        ToolDelta {
            response_id: Option<String>,
            tool_call_id: String,
            name: Option<String>,
            arguments: Option<String>,
        },
        ToolDone {
            response_id: Option<String>,
            tool_call_id: String,
            name: Option<String>,
            arguments: Option<String>,
        },
        Done {
            response_id: Option<String>,
            model: Option<String>,
            finish_reason: Option<String>,
            usage: Option<JsonValue>,
        },
        Error {
            response_id: Option<String>,
            message: String,
        },
    }

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct ToolCall {
        pub id: String,
        pub name: String,
        pub arguments: String,
    }

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct ResponsesStreamFinal {
        pub events: Vec<ModelEvent>,
        pub response: JsonValue,
        pub tool_calls: Vec<ToolCall>,
        pub receipt: JsonValue,
        pub request_id: Option<String>,
        pub reasoning: String,
    }

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct RunToolCall {
        pub tool_name: String,
        pub display_name: Option<String>,
        pub target_kind: Option<String>,
        pub target: Option<String>,
        pub summary: Option<String>,
        pub failed: bool,
        pub error: Option<String>,
    }

    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct RunStreamFinal {
        pub text: String,
        pub tool_calls: Vec<RunToolCall>,
        pub receipt: JsonValue,
        pub request_id: Option<String>,
    }

    #[derive(Clone, Debug, Default)]
    struct ResponseState {
        id: Option<String>,
        model: Option<String>,
        status: Option<String>,
        usage: Option<JsonValue>,
        finish_reason: Option<String>,
    }

    #[derive(Clone, Debug, Default)]
    struct ModelState {
        text: String,
        reasoning: String,
        tools: BTreeMap<String, ToolCall>,
        responses: BTreeMap<String, ResponseState>,
    }

    pub fn parse(input: &str) -> Vec<Frame> {
        let mut frames = Vec::new();
        let mut event = "message".to_string();
        let mut data = Vec::new();
        let mut id = None::<String>;
        let mut retry = None::<u64>;

        for line in input.lines() {
            if line.is_empty() {
                if !data.is_empty() {
                    frames.push(Frame {
                        event: Some(event.clone()),
                        data: data.join("\n"),
                        id: id.clone(),
                        retry,
                    });
                    event = "message".to_string();
                    data.clear();
                    id = None;
                    retry = None;
                }
                continue;
            }

            if line.starts_with(':') {
                continue;
            }

            let (field, mut value) = line
                .split_once(':')
                .map_or((line, ""), |(field, value)| (field, value));
            if let Some(stripped) = value.strip_prefix(' ') {
                value = stripped;
            }

            match field {
                "event" => event = if value.is_empty() { "message" } else { value }.to_string(),
                "data" => data.push(value.to_string()),
                "id" => id = Some(value.to_string()),
                "retry" => {
                    if let Ok(parsed) = value.parse::<u64>() {
                        retry = Some(parsed);
                    }
                }
                _ => {}
            }
        }

        if !data.is_empty() {
            frames.push(Frame {
                event: Some(event),
                data: data.join("\n"),
                id,
                retry,
            });
        }

        frames
    }

    pub fn finalize_responses(
        input: &str,
        model_hint: &str,
        request_id: Option<&str>,
    ) -> Result<ResponsesStreamFinal, SdkError> {
        let mut state = ModelState::default();
        let mut events = Vec::new();
        let mut receipt = JsonValue::Null;

        for frame in parse(input) {
            let event_name = frame.event.as_deref().unwrap_or("message");
            if event_name == "receipt" {
                if let Ok(value) = serde_json::from_str::<JsonValue>(&frame.data) {
                    receipt = value;
                }
                continue;
            }

            if frame.data == "[DONE]" || frame.data.trim().is_empty() {
                continue;
            }

            if let Some(event) = decode_model_event(&frame)? {
                reduce_model_state(&mut state, &event);
                events.push(event);
            }
        }

        Ok(ResponsesStreamFinal {
            response: build_response(&state, model_hint),
            tool_calls: state.tools.values().cloned().collect(),
            receipt,
            request_id: request_id.map(str::to_string),
            reasoning: state.reasoning,
            events,
        })
    }

    pub fn finalize_run(input: &str, request_id: Option<&str>) -> Result<RunStreamFinal, SdkError> {
        let mut text = String::new();
        let mut tool_calls = Vec::new();
        let mut receipt = JsonValue::Null;

        for frame in parse(input) {
            let event_name = frame.event.as_deref().unwrap_or("message");
            if event_name == "receipt" {
                if let Ok(value) = serde_json::from_str::<JsonValue>(&frame.data) {
                    receipt = value;
                }
                continue;
            }

            if frame.data == "[DONE]" || frame.data.trim().is_empty() {
                continue;
            }

            let raw = match serde_json::from_str::<JsonValue>(&frame.data) {
                Ok(value) => value,
                Err(_) if event_name == "message" => {
                    text.push_str(&frame.data);
                    continue;
                }
                Err(_) => serde_json::json!({ "type": event_name, "message": frame.data }),
            };

            if let Some(delta) = chat_choice_text_delta(&raw) {
                text.push_str(&delta);
                continue;
            }

            let Some(record) = raw.as_object() else {
                continue;
            };
            let event_type = string(record.get("type"))
                .or_else(|| string(record.get("eventName")))
                .or_else(|| string(record.get("event")))
                .unwrap_or_default();

            match event_type.as_str() {
                "response.output_text.delta" | "response.text.delta" | "text-delta" => {
                    if let Some(delta) = string(record.get("delta"))
                        .or_else(|| string(record.get("text")))
                        .or_else(|| string(record.get("content")))
                    {
                        text.push_str(&delta);
                    }
                }
                "response.output_item.completed" => {
                    let item = record.get("item").and_then(JsonValue::as_object);
                    if item.and_then(|item| string(item.get("type"))).as_deref()
                        == Some("output_text")
                        && text.is_empty()
                    {
                        if let Some(done_text) = item.and_then(|item| string(item.get("text"))) {
                            text = done_text;
                        }
                    }
                }
                "activity.message" => {
                    if let Some(delta) = string(record.get("delta")) {
                        text = delta;
                    } else if let Some(output) = record
                        .get("payload")
                        .and_then(JsonValue::as_object)
                        .and_then(|payload| payload.get("output"))
                    {
                        text = output
                            .as_str()
                            .map(str::to_string)
                            .unwrap_or_else(|| output.to_string());
                    }
                }
                "activity.run" => {
                    if text.is_empty() {
                        if let Some(output) = record
                            .get("payload")
                            .and_then(JsonValue::as_object)
                            .and_then(|payload| payload.get("output"))
                        {
                            text = output
                                .as_str()
                                .map(str::to_string)
                                .unwrap_or_else(|| output.to_string());
                        }
                    }
                }
                "tool_end" | "tool-end" | "activity.tool" => {
                    let status = string(record.get("status"));
                    let is_end = event_type == "tool_end"
                        || event_type == "tool-end"
                        || status.as_deref().is_some_and(|status| status != "running");
                    if is_end {
                        tool_calls.push(run_tool_call(record));
                    }
                }
                _ => {}
            }
        }

        Ok(RunStreamFinal {
            text,
            tool_calls,
            receipt,
            request_id: request_id.map(str::to_string),
        })
    }

    fn decode_model_event(frame: &Frame) -> Result<Option<ModelEvent>, SdkError> {
        let event_name = frame.event.as_deref().unwrap_or("message");
        let mut raw = match serde_json::from_str::<JsonValue>(&frame.data) {
            Ok(value) => value,
            Err(_) if event_name == "message" => {
                return Ok(Some(ModelEvent::TextDelta {
                    response_id: None,
                    delta: frame.data.clone(),
                }));
            }
            Err(_) => serde_json::json!({ "type": event_name, "message": frame.data }),
        };

        if event_name != "message" {
            if let Some(object) = raw.as_object_mut() {
                object
                    .entry("type")
                    .or_insert_with(|| JsonValue::String(event_name.to_string()));
            }
        }

        let Some(record) = raw.as_object() else {
            return Ok(None);
        };
        let event_type = string(record.get("type"))
            .or_else(|| string(record.get("eventName")))
            .or_else(|| string(record.get("event")))
            .unwrap_or_default();
        let response_id = response_id(record);
        let model = string(record.get("model")).or_else(|| {
            record
                .get("response")
                .and_then(|response| string(response.get("model")))
        });

        match event_type.as_str() {
            "response.created" => Ok(Some(ModelEvent::Start { response_id, model })),
            "response.output_text.delta" | "response.text.delta" | "text-delta" => {
                let delta = string(record.get("delta"))
                    .or_else(|| string(record.get("text")))
                    .or_else(|| string(record.get("content")))
                    .unwrap_or_default();
                if delta.is_empty() {
                    Ok(None)
                } else {
                    Ok(Some(ModelEvent::TextDelta { response_id, delta }))
                }
            }
            "response.reasoning.delta"
            | "response.reasoning_text.delta"
            | "response.reasoning_summary_text.delta"
            | "reasoning-delta"
            | "reasoning_delta"
            | "thinking" => {
                let delta = string(record.get("delta"))
                    .or_else(|| string(record.get("text")))
                    .or_else(|| string(record.get("thinking")))
                    .or_else(|| string(record.get("content")))
                    .unwrap_or_default();
                if delta.is_empty() {
                    Ok(None)
                } else {
                    Ok(Some(ModelEvent::ReasoningDelta { response_id, delta }))
                }
            }
            "response.tool_call.delta" | "tool-call-delta" | "tool_args_delta" => {
                let delta = record.get("delta").and_then(JsonValue::as_object);
                let tool_call_id = delta
                    .and_then(|delta| string(delta.get("id")))
                    .or_else(|| string(record.get("id")))
                    .unwrap_or_else(|| {
                        let index = record.get("index").and_then(JsonValue::as_u64).unwrap_or(0);
                        format!("tool:{index}")
                    });
                Ok(Some(ModelEvent::ToolDelta {
                    response_id,
                    tool_call_id,
                    name: delta
                        .and_then(|delta| string(delta.get("name")))
                        .or_else(|| string(record.get("toolName"))),
                    arguments: delta
                        .and_then(|delta| string(delta.get("arguments")))
                        .or_else(|| string(record.get("argumentsDelta")))
                        .or_else(|| string(record.get("argsDelta"))),
                }))
            }
            "response.tool_call" | "tool-call" => {
                let call = record
                    .get("tool_call")
                    .and_then(JsonValue::as_object)
                    .unwrap_or(record);
                let tool_call_id = string(call.get("id")).unwrap_or_else(|| "tool".to_string());
                Ok(Some(ModelEvent::ToolDone {
                    response_id,
                    tool_call_id,
                    name: string(call.get("name")),
                    arguments: string(call.get("arguments")),
                }))
            }
            "response.output_item.completed" => {
                let item = record.get("item").and_then(JsonValue::as_object);
                if item.and_then(|item| string(item.get("type"))).as_deref() == Some("output_text")
                {
                    let text = item
                        .and_then(|item| string(item.get("text")))
                        .unwrap_or_default();
                    if text.is_empty() {
                        Ok(None)
                    } else {
                        Ok(Some(ModelEvent::TextDone { response_id, text }))
                    }
                } else {
                    Ok(None)
                }
            }
            "response.completed" | "done" | "finish" => Ok(Some(ModelEvent::Done {
                response_id,
                model,
                finish_reason: string(record.get("finish_reason"))
                    .or_else(|| string(record.get("finishReason"))),
                usage: record.get("usage").cloned(),
            })),
            "response.error" | "compose.error" | "error" => {
                let error = record
                    .get("error")
                    .and_then(JsonValue::as_object)
                    .unwrap_or(record);
                Ok(Some(ModelEvent::Error {
                    response_id,
                    message: string(error.get("message"))
                        .or_else(|| string(record.get("message")))
                        .or_else(|| string(record.get("content")))
                        .unwrap_or_else(|| "Model stream failed".to_string()),
                }))
            }
            _ => Ok(None),
        }
    }

    fn reduce_model_state(state: &mut ModelState, event: &ModelEvent) {
        match event {
            ModelEvent::Start { response_id, model } => {
                let Some(response_id) = response_id else {
                    return;
                };
                let response = state.responses.entry(response_id.clone()).or_default();
                response.id = Some(response_id.clone());
                response.model = model.clone().or_else(|| response.model.clone());
                response.status = Some("running".to_string());
            }
            ModelEvent::TextDelta { delta, .. } => state.text.push_str(delta),
            ModelEvent::TextDone { text, .. } if state.text.is_empty() => {
                state.text = text.clone();
            }
            ModelEvent::TextDone { .. } => {}
            ModelEvent::ReasoningDelta { delta, .. } => state.reasoning.push_str(delta),
            ModelEvent::ToolDelta {
                tool_call_id,
                name,
                arguments,
                ..
            } => {
                let tool = state.tools.entry(tool_call_id.clone()).or_insert(ToolCall {
                    id: tool_call_id.clone(),
                    name: String::new(),
                    arguments: String::new(),
                });
                if let Some(name) = name.as_ref().filter(|name| !name.is_empty()) {
                    tool.name = name.clone();
                }
                if let Some(arguments) = arguments {
                    tool.arguments.push_str(arguments);
                }
            }
            ModelEvent::ToolDone {
                tool_call_id,
                name,
                arguments,
                ..
            } => {
                let tool = state.tools.entry(tool_call_id.clone()).or_insert(ToolCall {
                    id: tool_call_id.clone(),
                    name: String::new(),
                    arguments: String::new(),
                });
                if let Some(name) = name.as_ref().filter(|name| !name.is_empty()) {
                    tool.name = name.clone();
                }
                if let Some(arguments) = arguments {
                    tool.arguments = arguments.clone();
                }
            }
            ModelEvent::Done {
                response_id,
                model,
                finish_reason,
                usage,
            } => {
                let key = response_id
                    .clone()
                    .unwrap_or_else(|| "response".to_string());
                let response = state.responses.entry(key.clone()).or_default();
                response.id = response_id.clone().or(Some(key));
                response.model = model.clone().or_else(|| response.model.clone());
                response.status = Some("completed".to_string());
                response.finish_reason = finish_reason.clone();
                response.usage = usage.clone();
            }
            ModelEvent::Error { response_id, .. } => {
                let key = response_id
                    .clone()
                    .unwrap_or_else(|| "response".to_string());
                let response = state.responses.entry(key.clone()).or_default();
                response.id = response_id.clone().or(Some(key));
                response.status = Some("failed".to_string());
            }
        }
    }

    fn build_response(state: &ModelState, model_hint: &str) -> JsonValue {
        let response = state.responses.values().next();
        let mut output = Vec::new();
        if !state.text.is_empty() {
            output.push(serde_json::json!({
                "type": "output_text",
                "role": "assistant",
                "text": state.text,
            }));
        }

        let mut object = serde_json::Map::new();
        object.insert(
            "id".to_string(),
            JsonValue::String(
                response
                    .and_then(|response| response.id.clone())
                    .unwrap_or_else(|| "response".to_string()),
            ),
        );
        object.insert(
            "object".to_string(),
            JsonValue::String("response".to_string()),
        );
        object.insert("created_at".to_string(), JsonValue::Number(0.into()));
        object.insert(
            "status".to_string(),
            JsonValue::String(
                response
                    .and_then(|response| response.status.clone())
                    .unwrap_or_else(|| "in_progress".to_string()),
            ),
        );
        object.insert(
            "model".to_string(),
            JsonValue::String(
                response
                    .and_then(|response| response.model.clone())
                    .unwrap_or_else(|| model_hint.to_string()),
            ),
        );
        object.insert("output".to_string(), JsonValue::Array(output));
        if let Some(usage) = response.and_then(|response| response.usage.clone()) {
            if usage
                .get("input_tokens")
                .and_then(JsonValue::as_i64)
                .is_some()
                && usage
                    .get("output_tokens")
                    .and_then(JsonValue::as_i64)
                    .is_some()
                && usage
                    .get("total_tokens")
                    .and_then(JsonValue::as_i64)
                    .is_some()
            {
                object.insert("usage".to_string(), usage);
            }
        }

        JsonValue::Object(object)
    }

    fn response_id(record: &serde_json::Map<String, JsonValue>) -> Option<String> {
        string(record.get("response_id"))
            .or_else(|| string(record.get("responseId")))
            .or_else(|| {
                record
                    .get("response")
                    .and_then(|response| string(response.get("id")))
            })
    }

    fn string(value: Option<&JsonValue>) -> Option<String> {
        value
            .and_then(JsonValue::as_str)
            .filter(|value| !value.is_empty())
            .map(str::to_string)
    }

    fn chat_choice_text_delta(raw: &JsonValue) -> Option<String> {
        raw.get("choices")
            .and_then(JsonValue::as_array)
            .and_then(|choices| choices.first())
            .and_then(|choice| choice.get("delta"))
            .and_then(|delta| delta.get("content"))
            .and_then(JsonValue::as_str)
            .filter(|value| !value.is_empty())
            .map(str::to_string)
    }

    fn run_tool_call(record: &serde_json::Map<String, JsonValue>) -> RunToolCall {
        let payload = record.get("payload").and_then(JsonValue::as_object);
        let target = record.get("target").and_then(JsonValue::as_object);
        let error = string(record.get("error"))
            .or_else(|| payload.and_then(|payload| string(payload.get("error"))));
        let summary = string(record.get("message"))
            .or_else(|| string(record.get("content")))
            .or_else(|| payload.and_then(|payload| string(payload.get("message"))))
            .or_else(|| target.and_then(|target| string(target.get("summary"))));
        let tool_name = string(record.get("toolName"))
            .or_else(|| string(record.get("name")))
            .or_else(|| target.and_then(|target| string(target.get("name"))))
            .unwrap_or_else(|| "tool".to_string());

        RunToolCall {
            tool_name,
            display_name: target.and_then(|target| string(target.get("name"))),
            target_kind: target.and_then(|target| string(target.get("kind"))),
            target: target.and_then(|target| string(target.get("target"))),
            summary,
            failed: record
                .get("failed")
                .and_then(JsonValue::as_bool)
                .unwrap_or(false)
                || record
                    .get("status")
                    .and_then(JsonValue::as_str)
                    .is_some_and(|status| status == "failed")
                || error.is_some(),
            error,
        }
    }
}

pub mod receipt {
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct Receipt {
        pub id: String,
        pub amount: String,
    }
}

pub mod budget {
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub struct Budget {
        pub remaining: Option<String>,
        pub invalid_reason: Option<String>,
    }
}

pub mod events {
    #[derive(Clone, Debug, Eq, PartialEq)]
    pub enum Event {
        Receipt(String),
        Budget(String),
        Session(String),
    }
}

pub mod storage {
    pub trait Storage {
        fn get(&self, key: &str) -> Option<String>;
        fn set(&mut self, key: &str, value: String);
        fn remove(&mut self, key: &str);
    }
}

pub mod error {
    pub use crate::SdkError;
}

pub mod types {
    pub use crate::{Endpoint, EndpointConfig, MemoryScope, Operation, PreparedRequest};
}
