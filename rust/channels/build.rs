fn main() {
    compose_core::spec::generate(compose_core::spec::Generation {
        module: "channels",
        spec: "spec.yaml",
    });
}
