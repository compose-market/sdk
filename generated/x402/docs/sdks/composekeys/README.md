# ComposeKeys

## Overview

### Available Operations

* [sessionGetActive](#sessiongetactive)
* [sessionEventsSubscribe](#sessioneventssubscribe)
* [composeKeysCreate](#composekeyscreate)
* [composeKeysList](#composekeyslist)
* [composeKeysGet](#composekeysget)
* [composeKeysRevoke](#composekeysrevoke)

## sessionGetActive

### Example Usage

<!-- UsageSnippet language="typescript" operationID="session_get_active" method="get" path="/api/session" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.sessionGetActive({
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 114146,
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { composeKeysSessionGetActive } from "@compose-market/sdk/funcs/compose-keys-session-get-active.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysSessionGetActive(composeMarket, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 114146,
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysSessionGetActive failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.SessionGetActiveRequest](../../models/operations/session-get-active-request.md)                                                                                    | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.SessionGetActiveResponse](../../models/operations/session-get-active-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## sessionEventsSubscribe

### Example Usage

<!-- UsageSnippet language="typescript" operationID="session_events_subscribe" method="get" path="/api/session/events" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.sessionEventsSubscribe({
    userAddress: "0x1111111111111111111111111111111111111111",
    chainId: 247611,
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { composeKeysSessionEventsSubscribe } from "@compose-market/sdk/funcs/compose-keys-session-events-subscribe.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysSessionEventsSubscribe(composeMarket, {
    userAddress: "0x1111111111111111111111111111111111111111",
    chainId: 247611,
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysSessionEventsSubscribe failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.SessionEventsSubscribeRequest](../../models/operations/session-events-subscribe-request.md)                                                                        | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.SessionEventsSubscribeResponse](../../models/operations/session-events-subscribe-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## composeKeysCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="compose_keys_create" method="post" path="/api/keys" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.composeKeysCreate({
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 347416,
    body: {
      budgetLimit: "1000000",
      expiresAt: 907140,
      purpose: "session",
      chainId: 626379,
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
import { composeKeysComposeKeysCreate } from "@compose-market/sdk/funcs/compose-keys-compose-keys-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysComposeKeysCreate(composeMarket, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 347416,
    body: {
      budgetLimit: "1000000",
      expiresAt: 907140,
      purpose: "session",
      chainId: 626379,
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysComposeKeysCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ComposeKeysCreateRequest](../../models/operations/compose-keys-create-request.md)                                                                                  | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ComposeKeysCreateResponse](../../models/operations/compose-keys-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400, 402                         | application/json                 |
| errors.LegacyError               | 400, 402                         | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## composeKeysList

### Example Usage

<!-- UsageSnippet language="typescript" operationID="compose_keys_list" method="get" path="/api/keys" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.composeKeysList({
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 452665,
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { composeKeysComposeKeysList } from "@compose-market/sdk/funcs/compose-keys-compose-keys-list.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysComposeKeysList(composeMarket, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xChainId: 452665,
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysComposeKeysList failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ComposeKeysListRequest](../../models/operations/compose-keys-list-request.md)                                                                                      | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ComposeKeysListResponse](../../models/operations/compose-keys-list-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## composeKeysGet

### Example Usage

<!-- UsageSnippet language="typescript" operationID="compose_keys_get" method="get" path="/api/keys/{keyId}" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.composeKeysGet({
    keyId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { composeKeysComposeKeysGet } from "@compose-market/sdk/funcs/compose-keys-compose-keys-get.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysComposeKeysGet(composeMarket, {
    keyId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysComposeKeysGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ComposeKeysGetRequest](../../models/operations/compose-keys-get-request.md)                                                                                        | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ComposeKeysGetResponse](../../models/operations/compose-keys-get-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 401, 404                         | application/json                 |
| errors.LegacyError               | 401, 404                         | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## composeKeysRevoke

### Example Usage

<!-- UsageSnippet language="typescript" operationID="compose_keys_revoke" method="delete" path="/api/keys/{keyId}" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.composeKeys.composeKeysRevoke({
    keyId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { composeKeysComposeKeysRevoke } from "@compose-market/sdk/funcs/compose-keys-compose-keys-revoke.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await composeKeysComposeKeysRevoke(composeMarket, {
    keyId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("composeKeysComposeKeysRevoke failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ComposeKeysRevokeRequest](../../models/operations/compose-keys-revoke-request.md)                                                                                  | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.ComposeKeysRevokeResponse](../../models/operations/compose-keys-revoke-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 401                              | application/json                 |
| errors.LegacyError               | 401                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |