#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ToolCall {
    pub id: String,
    pub name: String,
    pub arguments: String,
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct ToolAccumulator {
    calls: Vec<ToolCall>,
}

impl ToolAccumulator {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn apply_delta(&mut self, id: &str, name: Option<&str>, arguments: Option<&str>) {
        if let Some(call) = self.calls.iter_mut().find(|call| call.id == id) {
            if let Some(name) = name {
                if !name.is_empty() {
                    call.name = name.to_string();
                }
            }
            if let Some(arguments) = arguments {
                call.arguments.push_str(arguments);
            }
            return;
        }

        self.calls.push(ToolCall {
            id: id.to_string(),
            name: name.unwrap_or_default().to_string(),
            arguments: arguments.unwrap_or_default().to_string(),
        });
    }

    pub fn calls(&self) -> &[ToolCall] {
        &self.calls
    }
}

#[cfg(test)]
mod tests {
    use super::ToolAccumulator;

    #[test]
    fn accumulates_split_arguments() {
        let mut accumulator = ToolAccumulator::new();
        accumulator.apply_delta("tc_1", Some("search"), Some("{\"q\":"));
        accumulator.apply_delta("tc_1", None, Some("\"kittens\"}"));

        assert_eq!(accumulator.calls()[0].arguments, "{\"q\":\"kittens\"}");
    }
}
