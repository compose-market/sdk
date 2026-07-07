pub use compose_channels as channels;
pub use compose_core as core;
pub use compose_inference as inference;
pub use compose_manowar as manowar;
pub use compose_memory as memory;
pub use compose_tools as tools;
pub use compose_x402 as x402;

pub use compose_core::{
    CallOptions, Endpoint, EndpointConfig, KeyOverride, MemoryScope, Operation, PaymentMode,
    PreparedRequest, SdkConfig,
};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ComposeSdk {
    config: SdkConfig,
}

impl Default for ComposeSdk {
    fn default() -> Self {
        Self::new(SdkConfig::default())
    }
}

impl ComposeSdk {
    pub fn new(config: SdkConfig) -> Self {
        Self { config }
    }

    pub fn from_endpoints(endpoints: EndpointConfig) -> Self {
        Self::new(SdkConfig {
            endpoints,
            ..SdkConfig::default()
        })
    }

    pub fn config(&self) -> &SdkConfig {
        &self.config
    }

    pub fn endpoints(&self) -> &EndpointConfig {
        &self.config.endpoints
    }

    pub fn inference(&self) -> inference::Client {
        inference::Client::new(self.config.clone())
    }

    pub fn x402(&self) -> x402::Client {
        x402::Client::new(self.config.clone())
    }

    pub fn memory(&self) -> memory::Client {
        memory::Client::new(self.config.clone())
    }

    pub fn manowar(&self) -> manowar::Client {
        manowar::Client::new(self.config.clone())
    }

    pub fn channels(&self) -> channels::Client {
        channels::Client::new(self.config.clone())
    }
}
