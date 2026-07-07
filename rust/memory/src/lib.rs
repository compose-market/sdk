include!(concat!(env!("OUT_DIR"), "/routes.rs"));

pub mod wire {
    include!(concat!(env!("OUT_DIR"), "/wire.rs"));
}

#[cfg(test)]
mod tests {
    #[test]
    fn generated_routes_are_present() {
        assert!(!super::all().is_empty());
    }
}
