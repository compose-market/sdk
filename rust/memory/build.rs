fn main() {
    compose_core::spec::generate(compose_core::spec::Generation {
        module: "memory",
        spec: "spec.yaml",
    });
}
