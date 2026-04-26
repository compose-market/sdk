# Agents

## Overview

### Available Operations

* [agentsChatCreate](#agentschatcreate)
* [agentsStreamCreate](#agentsstreamcreate)
* [agentsResponsesCreate](#agentsresponsescreate)
* [agentsRunsStateGet](#agentsrunsstateget)

## agentsChatCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="agents_chat_create" method="post" path="/agent/{walletAddress}/chat" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.agents.agentsChatCreate({
    walletAddress: "<value>",
    body: {
      message: "<value>",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { agentsAgentsChatCreate } from "@compose-market/sdk/funcs/agents-agents-chat-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await agentsAgentsChatCreate(composeMarket, {
    walletAddress: "<value>",
    body: {
      message: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("agentsAgentsChatCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AgentsChatCreateRequest](../../models/operations/agents-chat-create-request.md)                                                                                    | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.AgentsChatCreateResponse](../../models/operations/agents-chat-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorResponse             | 404                              | application/json                 |
| errors.ErrorResponse             | 503                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## agentsStreamCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="agents_stream_create" method="post" path="/agent/{walletAddress}/stream" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.agents.agentsStreamCreate({
    walletAddress: "<value>",
    body: {
      message: "<value>",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { agentsAgentsStreamCreate } from "@compose-market/sdk/funcs/agents-agents-stream-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await agentsAgentsStreamCreate(composeMarket, {
    walletAddress: "<value>",
    body: {
      message: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("agentsAgentsStreamCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AgentsStreamCreateRequest](../../models/operations/agents-stream-create-request.md)                                                                                | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.AgentsStreamCreateResponse](../../models/operations/agents-stream-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorResponse             | 404                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## agentsResponsesCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="agents_responses_create" method="post" path="/agent/{walletAddress}/responses" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.agents.agentsResponsesCreate({
    walletAddress: "<value>",
    body: {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { agentsAgentsResponsesCreate } from "@compose-market/sdk/funcs/agents-agents-responses-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await agentsAgentsResponsesCreate(composeMarket, {
    walletAddress: "<value>",
    body: {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("agentsAgentsResponsesCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AgentsResponsesCreateRequest](../../models/operations/agents-responses-create-request.md)                                                                          | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.AgentsResponsesCreateResponse](../../models/operations/agents-responses-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## agentsRunsStateGet

### Example Usage

<!-- UsageSnippet language="typescript" operationID="agents_runs_state_get" method="get" path="/agent/{walletAddress}/runs/{runId}/state" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.agents.agentsRunsStateGet({
    walletAddress: "<value>",
    runId: "<id>",
    threadId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { agentsAgentsRunsStateGet } from "@compose-market/sdk/funcs/agents-agents-runs-state-get.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await agentsAgentsRunsStateGet(composeMarket, {
    walletAddress: "<value>",
    runId: "<id>",
    threadId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("agentsAgentsRunsStateGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AgentsRunsStateGetRequest](../../models/operations/agents-runs-state-get-request.md)                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.AgentsRunsStateGetResponse](../../models/operations/agents-runs-state-get-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorResponse             | 404                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |