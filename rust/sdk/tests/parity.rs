use compose_core::{
    CallOptions, Endpoint, EndpointConfig, HttpClient, HttpRequest, HttpResponse, MemoryScope,
    PaymentMode, SdkConfig, API_URL, CHANNELS_URL, CONNECTORS_URL,
};
use compose_sdk::{channels, inference, manowar, memory, x402, ComposeSdk};
use serde_json::json;
use std::cell::RefCell;
use std::collections::BTreeMap;
use std::fs;
use std::path::Path;
use std::rc::Rc;

#[test]
fn facade_uses_canonical_endpoint_defaults() {
    let sdk = ComposeSdk::default();
    assert_eq!(sdk.endpoints().api, "https://api.compose.market");
    assert_eq!(sdk.endpoints().channels, "https://services.compose.market");
    assert_eq!(sdk.endpoints().connectors, CONNECTORS_URL);

    let request = sdk.inference().prepare(inference::responses_create());
    assert_eq!(request.method, "POST");
    assert_eq!(request.path, "/v1/responses");
    assert_eq!(request.url, "https://api.compose.market/v1/responses");
}

#[test]
fn inference_execution_is_responses_only() {
    let banned = [
        "/v1/chat",
        "/v1/embeddings",
        "/v1/images",
        "/v1/audio",
        "/v1/videos",
        "/api/inference",
    ];

    for operation in inference::all() {
        for banned_path in banned {
            assert!(
                !operation.path.contains(banned_path),
                "legacy inference route leaked into Rust: {:?}",
                operation
            );
        }
    }

    let executions: Vec<_> = inference::all()
        .iter()
        .filter(|operation| {
            operation.method == "POST"
                && operation.path.starts_with("/v1/")
                && !operation.path.starts_with("/v1/models")
                && !operation.path.starts_with("/v1/modalities")
                && !operation.path.contains("/cancel")
        })
        .map(|operation| operation.path)
        .collect();

    assert_eq!(executions, ["/v1/responses"]);
}

#[test]
fn public_routes_exclude_product_local_surface() {
    for operation in all_operations() {
        assert!(
            !operation.path.contains("/mesh/") && operation.path != "/mesh",
            "product-local route leaked into Rust SDK: {:?}",
            operation
        );
    }
}

#[test]
fn connectors_are_direct_worker_routes() {
    let config = EndpointConfig::default();
    for operation in manowar::all() {
        if operation.path.starts_with("/mcps") || operation.path.starts_with("/onchain") {
            assert_eq!(operation.endpoint, Endpoint::Connectors);
            let request = compose_core::prepare(operation, &config);
            assert!(request
                .url
                .starts_with("https://connectors.compose.market/"));
            assert!(!request.url.contains("/api/mcps"));
            assert!(!request.url.contains("/api/onchain"));
            assert!(!request.url.contains("/onchain/plugins"));
        }
    }
}

#[test]
fn agent_stream_prepare_substitutes_path_params() {
    let sdk = ComposeSdk::new(SdkConfig {
        key: Some("compose-jwt-agent".to_string()),
        user_address: Some("0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD".to_string()),
        chain_id: Some(43113),
        ..SdkConfig::default()
    });

    let request = sdk
        .manowar()
        .prepare_json_with_path(
            manowar::stream_create(),
            &[("walletAddress", "0xAgent/needs encoding")],
            json!({
                "message": "hi",
                "threadId": "thread_1",
                "userAddress": "0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD",
            }),
            CallOptions::default(),
        )
        .expect("agent stream request should prepare");

    assert_eq!(request.method, "POST");
    assert_eq!(request.path, "/agent/0xAgent%2Fneeds%20encoding/stream");
    assert_eq!(
        request.url,
        "https://api.compose.market/agent/0xAgent%2Fneeds%20encoding/stream"
    );
    assert_eq!(
        request.headers.get("authorization").map(String::as_str),
        Some("Bearer compose-jwt-agent")
    );
}

#[test]
fn route_matrix_matches_public_contract() {
    assert!(inference::all()
        .iter()
        .all(|operation| operation.endpoint == Endpoint::Api));
    assert!(x402::all()
        .iter()
        .all(|operation| operation.endpoint == Endpoint::Api));
    assert!(memory::all()
        .iter()
        .all(|operation| operation.endpoint == Endpoint::Api));
    assert!(channels::all()
        .iter()
        .all(|operation| operation.endpoint == Endpoint::Channels));

    for operation in manowar::all() {
        match operation.path {
            path if path.starts_with("/mcps") || path.starts_with("/onchain") => {
                assert_eq!(operation.endpoint, Endpoint::Connectors);
            }
            _ => assert_eq!(operation.endpoint, Endpoint::Api),
        }
    }
}

#[test]
fn generated_wire_clients_exist_for_each_openapi_spec() {
    let _ = inference::wire::Client::new(API_URL);
    let _ = x402::wire::Client::new(API_URL);
    let _ = memory::wire::Client::new(API_URL);
    let _ = manowar::wire::Client::new(API_URL);
    let _ = manowar::wire::Client::new(CONNECTORS_URL);
    let _ = channels::wire::Client::new(CHANNELS_URL);
}

#[test]
fn channels_wire_contract_exposes_global_local_scope_split() {
    use channels::wire::types;

    assert_eq!(types::ChannelScope::Global.to_string(), "global");
    assert_eq!(types::ChannelScope::Local.to_string(), "local");

    let link: types::ChannelLinkRequest = serde_json::from_value(json!({
        "agentWallet": "0x0000000000000000000000000000000000000002",
        "scope": "local",
        "haiId": "hai_channel_1"
    }))
    .expect("link request must deserialize local scope");
    assert_eq!(link.scope, Some(types::ChannelScope::Local));
    assert_eq!(link.hai_id.as_deref(), Some("hai_channel_1"));
    let link_json = serde_json::to_value(&link).expect("link request must serialize");
    assert_eq!(link_json["scope"], "local");
    assert_eq!(link_json["haiId"], "hai_channel_1");

    let response: types::ChannelLinkResponse = serde_json::from_value(json!({
        "code": "code",
        "channel": "telegram",
        "userAddress": "0x1111111111111111111111111111111111111111",
        "agentWallet": "0x0000000000000000000000000000000000000002",
        "scope": "local",
        "haiId": "hai_channel_1",
        "createdAt": 1,
        "expiresAt": 2
    }))
    .expect("link response must deserialize local scope");
    assert_eq!(response.scope, types::ChannelScope::Local);
    assert_eq!(response.hai_id.as_deref(), Some("hai_channel_1"));
    assert!(serde_json::from_value::<types::ChannelLinkResponse>(json!({
        "code": "code",
        "channel": "telegram",
        "userAddress": "0x1111111111111111111111111111111111111111",
        "agentWallet": "0x0000000000000000000000000000000000000002",
        "createdAt": 1,
        "expiresAt": 2
    }))
    .is_err());

    let route: types::ChannelRoute = serde_json::from_value(json!({
        "id": "telegram:local:hai_channel_1:0x1111111111111111111111111111111111111111:0x0000000000000000000000000000000000000002:account:thread",
        "channel": "telegram",
        "userAddress": "0x1111111111111111111111111111111111111111",
        "agentWallet": "0x0000000000000000000000000000000000000002",
        "scope": "local",
        "haiId": "hai_channel_1",
        "accountId": "account",
        "threadId": "thread",
        "createdAt": 1,
        "updatedAt": 2
    }))
    .expect("channel route must deserialize local scope");
    assert_eq!(route.scope, types::ChannelScope::Local);
    assert_eq!(route.hai_id.as_deref(), Some("hai_channel_1"));

    let _status = channels::wire::Client::new(CHANNELS_URL)
        .status()
        .channel(types::ChannelName::Telegram)
        .user_address("0x1111111111111111111111111111111111111111")
        .agent_wallet("0x0000000000000000000000000000000000000002")
        .scope(types::ChannelScope::Local)
        .hai_id("hai_channel_1");
}

#[test]
fn rust_core_does_not_expose_runtime_endpoint_config() {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("..");
    let core = fs::read_to_string(root.join("core/src/lib.rs")).expect("core source exists");
    let spec = fs::read_to_string(root.join("core/src/spec.rs")).expect("spec source exists");

    assert!(!core.contains("RUNTIME_URL"));
    assert!(!core.contains("Endpoint::Runtime"));
    assert!(!core.contains("pub runtime:"));
    assert!(!spec.contains("=> \"Runtime\""));
}

#[test]
fn responses_prepare_matches_ts_header_contract_and_x402_suppression() {
    let sdk = ComposeSdk::new(SdkConfig {
        key: Some("compose-jwt-abc".to_string()),
        user_address: Some("0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD".to_string()),
        chain_id: Some(43113),
        ..SdkConfig::default()
    });

    let request = sdk
        .inference()
        .prepare_json(
            inference::responses_create(),
            json!({
                "model": "gpt-4.1-mini",
                "input": "hi",
                "stream": false,
            }),
            CallOptions {
                x402_max_amount_wei: Some("001000000".to_string()),
                idempotency_key: Some("idem_abc123".to_string()),
                run_id: Some("run_123".to_string()),
                ..CallOptions::default()
            },
        )
        .expect("responses request should prepare");

    assert_eq!(request.method, "POST");
    assert_eq!(request.path, "/v1/responses");
    assert_eq!(request.url, "https://api.compose.market/v1/responses");
    assert_eq!(
        request.headers.get("authorization").map(String::as_str),
        Some("Bearer compose-jwt-abc")
    );
    assert_eq!(
        request
            .headers
            .get("x-session-user-address")
            .map(String::as_str),
        Some("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")
    );
    assert_eq!(
        request.headers.get("x-chain-id").map(String::as_str),
        Some("43113")
    );
    assert_eq!(
        request
            .headers
            .get("x-x402-max-amount-wei")
            .map(String::as_str),
        Some("1000000")
    );
    assert_eq!(
        request.headers.get("x-idempotency-key").map(String::as_str),
        Some("idem_abc123")
    );
    assert_eq!(
        request.headers.get("x-run-id").map(String::as_str),
        Some("run_123")
    );
    assert!(request.headers.contains_key("user-agent"));
    assert_eq!(
        serde_json::from_str::<serde_json::Value>(request.body.as_deref().expect("json body"))
            .expect("body is json"),
        json!({
            "model": "gpt-4.1-mini",
            "input": "hi",
            "stream": false,
        })
    );

    let x402 = sdk
        .inference()
        .prepare_json(
            inference::responses_create(),
            json!({ "model": "gpt-4.1-mini", "input": "hi", "stream": false }),
            CallOptions {
                payment_mode: PaymentMode::X402,
                payment_signature: Some("already-signed".to_string()),
                x402_max_amount_wei: Some("1000000".to_string()),
                ..CallOptions::default()
            },
        )
        .expect("x402 request should prepare");

    assert_eq!(x402.headers.get("authorization"), None);
    assert_eq!(
        x402.headers.get("payment-signature").map(String::as_str),
        Some("already-signed")
    );
}

#[test]
fn non_json_prepare_matches_ts_header_contract_without_content_type() {
    let sdk = ComposeSdk::new(SdkConfig {
        key: Some("compose-jwt-session".to_string()),
        user_address: Some("0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD".to_string()),
        chain_id: Some(43113),
        ..SdkConfig::default()
    });

    let request = sdk
        .x402()
        .prepare_call(x402::session_get_active(), CallOptions::default())
        .expect("session request should prepare");

    assert_eq!(request.method, "GET");
    assert_eq!(request.path, "/api/session");
    assert_eq!(request.url, "https://api.compose.market/api/session");
    assert_eq!(
        request.headers.get("authorization").map(String::as_str),
        Some("Bearer compose-jwt-session")
    );
    assert_eq!(request.headers.get("content-type"), None);
    assert_eq!(
        request
            .headers
            .get("x-session-user-address")
            .map(String::as_str),
        Some("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")
    );
    assert_eq!(
        request.headers.get("x-chain-id").map(String::as_str),
        Some("43113")
    );
}

#[test]
fn responses_execute_retries_payment_required_with_x402_signature() {
    let seen = Rc::new(RefCell::new(Vec::<HttpRequest>::new()));
    let transport = RecordingTransport {
        seen: seen.clone(),
        responses: vec![
            HttpResponse {
                status: 402,
                headers: [(
                    "payment-required".to_string(),
                    encode_payment_required(json!({
                        "x402Version": 2,
                        "resource": {
                            "url": "https://api.compose.market/v1/responses",
                            "description": "test",
                            "mimeType": "application/json"
                        },
                        "accepts": [{
                            "scheme": "upto",
                            "network": "eip155:43113",
                            "amount": "1000000",
                            "asset": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                            "payTo": "0xMerchant",
                            "maxTimeoutSeconds": 300
                        }]
                    })),
                )]
                .into(),
                body: Some(r#"{"error":"Payment required"}"#.to_string()),
            },
            HttpResponse {
                status: 200,
                headers: [
                    ("x-request-id".to_string(), "req_123".to_string()),
                    (
                        "x-session-budget-remaining".to_string(),
                        "990000".to_string(),
                    ),
                    (
                        "x-session-invalid".to_string(),
                        "budget_exhausted".to_string(),
                    ),
                    (
                        "x-receipt".to_string(),
                        r#"{"id":"rcpt_1","amount":"1000000"}"#.to_string(),
                    ),
                ]
                .into(),
                body: Some(r#"{"id":"resp_1","object":"response"}"#.to_string()),
            },
        ],
    };
    let mut client = HttpClient::new(
        SdkConfig {
            key: Some("compose-jwt-abc".to_string()),
            user_address: Some("0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD".to_string()),
            chain_id: Some(43113),
            ..SdkConfig::default()
        },
        transport,
    )
    .with_x402_signer(|input| {
        assert_eq!(input.method, "POST");
        assert_eq!(input.path, "/v1/responses");
        assert_eq!(input.url, "https://api.compose.market/v1/responses");
        assert_eq!(input.max_amount_wei.as_deref(), Some("1000000"));
        assert_eq!(
            input.user_address.as_deref(),
            Some("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")
        );
        assert_eq!(input.chain_id, Some(43113));
        assert_eq!(
            input.payment_required["resource"]["url"],
            "https://api.compose.market/v1/responses"
        );
        Ok("signed-x402-payload".to_string())
    });

    let completion = client
        .execute_json(
            inference::responses_create(),
            json!({ "model": "gpt-4.1-mini", "input": "hi", "stream": false }),
            CallOptions {
                x402_max_amount_wei: Some("1000000".to_string()),
                idempotency_key: Some("idem_abc123".to_string()),
                ..CallOptions::default()
            },
        )
        .expect("x402 retry should succeed");

    assert_eq!(completion.data["id"], "resp_1");
    assert_eq!(completion.request_id.as_deref(), Some("req_123"));
    assert_eq!(completion.budget_remaining.as_deref(), Some("990000"));
    assert_eq!(
        completion.session_invalid_reason.as_deref(),
        Some("budget_exhausted")
    );
    assert_eq!(completion.receipt["id"], "rcpt_1");

    let seen = seen.borrow();
    assert_eq!(seen.len(), 2);
    assert_eq!(
        seen[0].headers.get("authorization").map(String::as_str),
        Some("Bearer compose-jwt-abc")
    );
    assert_eq!(
        seen[0].headers.get("x-idempotency-key").map(String::as_str),
        Some("idem_abc123")
    );
    assert_eq!(seen[1].headers.get("authorization"), None);
    assert_eq!(
        seen[1].headers.get("payment-signature").map(String::as_str),
        Some("signed-x402-payload")
    );
    assert_eq!(
        seen[1]
            .headers
            .get("x-x402-max-amount-wei")
            .map(String::as_str),
        Some("1000000")
    );
    assert_eq!(
        seen[1]
            .headers
            .get("x-session-user-address")
            .map(String::as_str),
        Some("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd")
    );
}

#[test]
fn responses_execute_suppresses_invalid_key_before_x402_retry() {
    let seen = Rc::new(RefCell::new(Vec::<HttpRequest>::new()));
    let transport = RecordingTransport {
        seen: seen.clone(),
        responses: vec![
            HttpResponse {
                status: 401,
                headers: BTreeMap::new(),
                body: Some(
                    r#"{"error":{"code":"invalid_key","message":"Compose Key expired"}}"#
                        .to_string(),
                ),
            },
            HttpResponse {
                status: 402,
                headers: [(
                    "payment-required".to_string(),
                    encode_payment_required(json!({
                        "x402Version": 2,
                        "resource": {
                            "url": "https://api.compose.market/v1/responses",
                            "description": "test",
                            "mimeType": "application/json"
                        },
                        "accepts": [{
                            "scheme": "upto",
                            "network": "eip155:43113",
                            "amount": "1000000",
                            "asset": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                            "payTo": "0xMerchant",
                            "maxTimeoutSeconds": 300
                        }]
                    })),
                )]
                .into(),
                body: Some(r#"{"error":"Payment required"}"#.to_string()),
            },
            HttpResponse {
                status: 200,
                headers: BTreeMap::new(),
                body: Some(r#"{"id":"resp_after_invalid_key","object":"response"}"#.to_string()),
            },
        ],
    };
    let mut client = HttpClient::new(
        SdkConfig {
            key: Some("compose-expired".to_string()),
            user_address: Some("0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD".to_string()),
            chain_id: Some(43113),
            ..SdkConfig::default()
        },
        transport,
    )
    .with_x402_signer(|input| {
        assert_eq!(input.path, "/v1/responses");
        Ok("signed-after-invalid-key".to_string())
    });

    let completion = client
        .execute_json(
            inference::responses_create(),
            json!({ "model": "gpt-4.1-mini", "input": "hi", "stream": false }),
            CallOptions {
                x402_max_amount_wei: Some("1000000".to_string()),
                ..CallOptions::default()
            },
        )
        .expect("invalid key should fall back to raw x402");

    assert_eq!(completion.data["id"], "resp_after_invalid_key");
    let seen = seen.borrow();
    assert_eq!(seen.len(), 3);
    assert_eq!(
        seen[0].headers.get("authorization").map(String::as_str),
        Some("Bearer compose-expired")
    );
    assert_eq!(seen[1].headers.get("authorization"), None);
    assert_eq!(seen[1].headers.get("payment-signature"), None);
    assert_eq!(seen[2].headers.get("authorization"), None);
    assert_eq!(
        seen[2].headers.get("payment-signature").map(String::as_str),
        Some("signed-after-invalid-key")
    );
}

#[test]
fn responses_stream_finalization_is_core_owned() {
    let stream = [
        sse_json(
            None,
            json!({
                "type": "response.created",
                "response_id": "resp_stream",
                "model": "gpt-4.1-mini"
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.output_text.delta",
                "response_id": "resp_stream",
                "delta": "Hello"
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.output_text.delta",
                "response_id": "resp_stream",
                "delta": ", world!"
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.reasoning.delta",
                "response_id": "resp_stream",
                "delta": "let me think..."
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.tool_call.delta",
                "response_id": "resp_stream",
                "delta": {
                    "id": "tc_1",
                    "name": "search",
                    "arguments": "{\"q\":"
                }
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.tool_call.delta",
                "response_id": "resp_stream",
                "delta": {
                    "id": "tc_1",
                    "arguments": "\"kittens\"}"
                }
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "response.completed",
                "response_id": "resp_stream",
                "model": "gpt-4.1-mini",
                "finish_reason": "stop",
                "usage": { "input_tokens": 10, "output_tokens": 20, "total_tokens": 30 }
            }),
        ),
        sse_json(
            Some("receipt"),
            json!({
                "user": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                "runId": "run_stream_test",
                "duration": "12s",
                "bills": [{
                    "agent": "Test Agent",
                    "agentWallet": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "depth": 0,
                    "model": "gpt-4.1-mini",
                    "tokens": { "input": 10, "output": 20 },
                    "tools": ["models_call"],
                    "total": "0.012345 USDC",
                    "duration": "12s"
                }]
            }),
        ),
        "data: [DONE]\n\n".to_string(),
    ]
    .join("");

    let final_result =
        compose_core::stream::finalize_responses(&stream, "gpt-4.1-mini", Some("req_stream_test"))
            .expect("stream finalization should succeed");

    assert_eq!(
        final_result
            .events
            .iter()
            .filter_map(|event| match event {
                compose_core::stream::ModelEvent::TextDelta { delta, .. } => Some(delta.as_str()),
                _ => None,
            })
            .collect::<String>(),
        "Hello, world!"
    );
    assert_eq!(final_result.reasoning, "let me think...");
    assert_eq!(
        final_result.tool_calls,
        [compose_core::stream::ToolCall {
            id: "tc_1".to_string(),
            name: "search".to_string(),
            arguments: "{\"q\":\"kittens\"}".to_string(),
        }]
    );
    assert_eq!(final_result.request_id.as_deref(), Some("req_stream_test"));
    assert_eq!(final_result.response["id"], "resp_stream");
    assert_eq!(final_result.response["status"], "completed");
    assert_eq!(final_result.response["model"], "gpt-4.1-mini");
    assert_eq!(final_result.response["output"][0]["text"], "Hello, world!");
    assert_eq!(final_result.response["usage"]["input_tokens"], 10);
    assert_eq!(final_result.receipt["runId"], "run_stream_test");
    assert_eq!(final_result.receipt["bills"][0]["agent"], "Test Agent");
    assert_eq!(final_result.receipt["bills"][0]["tokens"]["input"], 10);
}

#[test]
fn agent_stream_finalization_is_core_owned() {
    let stream = [
        sse_json(
            None,
            json!({
                "type": "thinking_start",
                "message": "Planning approach..."
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "tool_start",
                "toolName": "web_search",
                "content": "query: cats"
            }),
        ),
        sse_json(
            None,
            json!({
                "type": "tool_end",
                "toolName": "web_search",
                "message": "3 results"
            }),
        ),
        sse_json(
            None,
            json!({
                "choices": [{ "delta": { "content": "Here are" } }]
            }),
        ),
        sse_json(
            None,
            json!({
                "choices": [{ "delta": { "content": " the results." } }]
            }),
        ),
        sse_json(None, json!({ "type": "done" })),
        sse_json(
            Some("receipt"),
            json!({
                "user": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                "runId": "run_agent_receipt",
                "duration": "1s",
                "bills": []
            }),
        ),
        "data: [DONE]\n\n".to_string(),
    ]
    .join("");

    let final_result = compose_core::stream::finalize_run(&stream, Some("req_agent_1"))
        .expect("agent stream finalization should succeed");

    assert_eq!(final_result.text, "Here are the results.");
    assert_eq!(final_result.request_id.as_deref(), Some("req_agent_1"));
    assert_eq!(final_result.receipt["runId"], "run_agent_receipt");
    assert_eq!(final_result.tool_calls.len(), 1);
    assert_eq!(final_result.tool_calls[0].tool_name, "web_search");
    assert_eq!(
        final_result.tool_calls[0].summary.as_deref(),
        Some("3 results")
    );
    assert!(!final_result.tool_calls[0].failed);
}

#[test]
fn sse_parser_matches_core_frame_semantics() {
    let frames = compose_core::stream::parse(
        ": ignored comment\nid: frame-1\nretry: 2500\ndata: hello\ndata: world\n\nevent: receipt\ndata: {\"runId\":\"run_1\"}",
    );

    assert_eq!(frames.len(), 2);
    assert_eq!(frames[0].event.as_deref(), Some("message"));
    assert_eq!(frames[0].id.as_deref(), Some("frame-1"));
    assert_eq!(frames[0].retry, Some(2500));
    assert_eq!(frames[0].data, "hello\nworld");
    assert_eq!(frames[1].event.as_deref(), Some("receipt"));
    assert_eq!(frames[1].id, None);
    assert_eq!(frames[1].retry, None);
    assert_eq!(frames[1].data, "{\"runId\":\"run_1\"}");
}

#[test]
fn memory_scope_is_scope_not_mode() {
    let global = MemoryScope::global();
    assert_eq!(global.scope(), "global");
    assert_eq!(global.hai_id(), None);

    let local = MemoryScope::local("hai_123").expect("hai_id is present");
    assert_eq!(local.scope(), "local");
    assert_eq!(local.hai_id(), Some("hai_123"));
    assert!(MemoryScope::local("").is_err());
}

#[test]
fn generated_memory_wire_preserves_state_machine_fields() {
    let stored = compose_memory::wire::types::AgentMemoryRecordTurnResponseStored {
        transcript: true,
        working: true,
        vector: true,
        graph: false,
    };
    assert!(!stored.graph);

    let local = compose_memory::wire::types::AgentMemoryRememberRequestScope::Local;
    assert_eq!(local.to_string(), "local");
    assert!("workspace"
        .parse::<compose_memory::wire::types::AgentMemoryRememberRequestScope>()
        .is_err());
}

#[test]
fn generated_names_do_not_repeat_namespaces() {
    for operation in all_operations() {
        let doubled = format!("{}_{}", operation.tag, operation.tag);
        assert!(
            !operation.operation.contains(&doubled),
            "duplicate namespace leaked into operation id: {:?}",
            operation
        );
    }
}

#[test]
fn rust_internal_paths_are_one_word() {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("sdk has workspace parent");
    assert_one_word_paths(root);
}

#[test]
fn crate_package_names_follow_compose_module_priority() {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("sdk has workspace parent");
    for (module, package) in [
        ("core", "compose-market-core"),
        ("inference", "compose-inference"),
        ("x402", "compose-x402"),
        ("memory", "compose-memory"),
        ("manowar", "compose-manowar"),
        ("channels", "compose-channels"),
        ("tools", "compose-tools"),
        ("sdk", "compose-sdk"),
    ] {
        assert!(
            is_one_word(module),
            "local Rust module directory must be one word: {module}"
        );
        let manifest = fs::read_to_string(root.join(module).join("Cargo.toml"))
            .unwrap_or_else(|error| panic!("{module} Cargo.toml must be readable: {error}"));
        assert!(
            manifest
                .lines()
                .any(|line| line.trim() == format!("name = \"{package}\"")),
            "{module} crate package name must use compose-${{module}} priority, falling back to compose-market-${{module}} only for real registry collisions"
        );
    }
}

#[test]
fn crate_versions_use_restored_workspace_version() {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("sdk has workspace parent");
    let expected_version = env!("CARGO_PKG_VERSION");
    let workspace = fs::read_to_string(root.join("Cargo.toml")).expect("workspace manifest exists");
    let workspace_package = workspace
        .split("[workspace.package]")
        .nth(1)
        .and_then(|section| section.split("\n[").next())
        .expect("workspace package section exists");
    assert!(
        workspace_package.lines().any(|line| {
            line.trim() == format!("version = \"{expected_version}\"")
        }),
        "Rust SDK workspace package version must be {expected_version}"
    );

    for module in [
        "core",
        "inference",
        "x402",
        "memory",
        "manowar",
        "channels",
        "tools",
        "sdk",
    ] {
        let manifest = fs::read_to_string(root.join(module).join("Cargo.toml"))
            .unwrap_or_else(|error| panic!("{module} Cargo.toml must be readable: {error}"));
        assert!(
            manifest
                .lines()
                .any(|line| line.trim() == "version.workspace = true"),
            "{module} crate package version must inherit the workspace version"
        );
    }
}

#[test]
fn generated_crates_bundle_local_openapi_specs_for_publish() {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("sdk has workspace parent");
    for crate_name in ["inference", "x402", "memory", "manowar", "channels"] {
        let crate_root = root.join(crate_name);
        assert!(
            crate_root.join("spec.yaml").exists(),
            "{crate_name} must bundle spec.yaml for crates.io builds"
        );
        let build = fs::read_to_string(crate_root.join("build.rs")).expect("build.rs exists");
        assert!(
            build.contains("spec: \"spec.yaml\""),
            "{crate_name} build.rs must use its bundled spec.yaml"
        );
        assert!(
            !build.contains("../../shared/specs"),
            "{crate_name} build.rs must not depend on workspace-only shared specs"
        );
    }
}

fn all_operations() -> Vec<&'static compose_core::Operation> {
    inference::all()
        .iter()
        .chain(x402::all())
        .chain(memory::all())
        .chain(manowar::all())
        .chain(channels::all())
        .collect()
}

fn assert_one_word_paths(path: &Path) {
    let entries = fs::read_dir(path).expect("workspace path must be readable");
    for entry in entries {
        let entry = entry.expect("directory entry must be readable");
        let path = entry.path();
        let name = entry.file_name();
        let name = name.to_string_lossy();

        if name == "target" || name.starts_with('.') {
            continue;
        }

        if path.is_dir() {
            assert!(
                is_one_word(&name),
                "Rust internal directory is not one-word: {}",
                path.display()
            );
            assert_one_word_paths(&path);
            continue;
        }

        if path.extension().and_then(|extension| extension.to_str()) == Some("rs") {
            let stem = path
                .file_stem()
                .and_then(|stem| stem.to_str())
                .expect("Rust file has a stem");
            assert!(
                is_one_word(stem),
                "Rust internal file is not one-word: {}",
                path.display()
            );
        }
    }
}

fn is_one_word(value: &str) -> bool {
    value
        .chars()
        .all(|character| character.is_ascii_alphanumeric())
}

#[derive(Clone, Debug)]
struct RecordingTransport {
    seen: Rc<RefCell<Vec<HttpRequest>>>,
    responses: Vec<HttpResponse>,
}

impl compose_core::Transport for RecordingTransport {
    fn send(&mut self, request: HttpRequest) -> Result<HttpResponse, compose_core::SdkError> {
        self.seen.borrow_mut().push(request);
        if self.responses.is_empty() {
            return Err(compose_core::SdkError::Transport(
                "no mock response queued".to_string(),
            ));
        }
        Ok(self.responses.remove(0))
    }
}

fn encode_payment_required(value: serde_json::Value) -> String {
    let bytes = serde_json::to_vec(&value).expect("payment required serializes");
    base64_url(&bytes)
}

fn base64_url(bytes: &[u8]) -> String {
    const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let mut out = String::new();
    let mut index = 0;
    while index < bytes.len() {
        let a = bytes[index];
        let b = bytes.get(index + 1).copied();
        let c = bytes.get(index + 2).copied();

        out.push(TABLE[(a >> 2) as usize] as char);
        out.push(TABLE[(((a & 0b0000_0011) << 4) | b.unwrap_or(0) >> 4) as usize] as char);
        if let Some(b) = b {
            out.push(TABLE[(((b & 0b0000_1111) << 2) | c.unwrap_or(0) >> 6) as usize] as char);
        }
        if let Some(c) = c {
            out.push(TABLE[(c & 0b0011_1111) as usize] as char);
        }

        index += 3;
    }
    out
}

fn sse_json(event: Option<&str>, value: serde_json::Value) -> String {
    let mut frame = String::new();
    if let Some(event) = event {
        frame.push_str("event: ");
        frame.push_str(event);
        frame.push('\n');
    }
    frame.push_str("data: ");
    frame.push_str(&serde_json::to_string(&value).expect("sse json serializes"));
    frame.push_str("\n\n");
    frame
}
