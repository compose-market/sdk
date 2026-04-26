# Inference

## Overview

### Available Operations

* [inferenceChatCompletionsCreate](#inferencechatcompletionscreate)
* [inferenceResponsesCreate](#inferenceresponsescreate)
* [inferenceResponsesGet](#inferenceresponsesget)
* [inferenceResponsesInputItemsList](#inferenceresponsesinputitemslist)
* [inferenceResponsesCancel](#inferenceresponsescancel)
* [inferenceEmbeddingsCreate](#inferenceembeddingscreate)
* [inferenceImagesGenerate](#inferenceimagesgenerate)
* [inferenceImagesEdit](#inferenceimagesedit)
* [inferenceAudioSpeechCreate](#inferenceaudiospeechcreate)
* [inferenceAudioTranscriptionsCreate](#inferenceaudiotranscriptionscreate)
* [inferenceAudioTranscriptionsCreateMultipart](#inferenceaudiotranscriptionscreatemultipart)
* [inferenceVideosGenerate](#inferencevideosgenerate)
* [inferenceVideosGet](#inferencevideosget)
* [inferenceVideosStream](#inferencevideosstream)
* [inferenceLegacyCreate](#inferencelegacycreate)

## inferenceChatCompletionsCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_chat_completions_create" method="post" path="/v1/chat/completions" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceChatCompletionsCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Golf",
      messages: [
        {
          role: "assistant",
          content: [],
        },
      ],
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
import { inferenceInferenceChatCompletionsCreate } from "@compose-market/sdk/funcs/inference-inference-chat-completions-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceChatCompletionsCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Golf",
      messages: [
        {
          role: "assistant",
          content: [],
        },
      ],
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceChatCompletionsCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceChatCompletionsCreateRequest](../../models/operations/inference-chat-completions-create-request.md)                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceChatCompletionsCreateSecurity](../../models/operations/inference-chat-completions-create-security.md)                                                     | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceChatCompletionsCreateResponse](../../models/operations/inference-chat-completions-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceResponsesCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_responses_create" method="post" path="/v1/responses" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceResponsesCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Charger",
      input: "<value>",
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
import { inferenceInferenceResponsesCreate } from "@compose-market/sdk/funcs/inference-inference-responses-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceResponsesCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Charger",
      input: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceResponsesCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceResponsesCreateRequest](../../models/operations/inference-responses-create-request.md)                                                                    | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceResponsesCreateSecurity](../../models/operations/inference-responses-create-security.md)                                                                  | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceResponsesCreateResponse](../../models/operations/inference-responses-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceResponsesGet

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_responses_get" method="get" path="/v1/responses/{responseId}" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.inference.inferenceResponsesGet({
    responseId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceResponsesGet } from "@compose-market/sdk/funcs/inference-inference-responses-get.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await inferenceInferenceResponsesGet(composeMarket, {
    responseId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceResponsesGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceResponsesGetRequest](../../models/operations/inference-responses-get-request.md)                                                                          | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceResponsesGetResponse](../../models/operations/inference-responses-get-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 404                              | application/json                 |
| errors.LegacyError               | 404                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceResponsesInputItemsList

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_responses_input_items_list" method="get" path="/v1/responses/{responseId}/input_items" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.inference.inferenceResponsesInputItemsList({
    responseId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceResponsesInputItemsList } from "@compose-market/sdk/funcs/inference-inference-responses-input-items-list.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await inferenceInferenceResponsesInputItemsList(composeMarket, {
    responseId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceResponsesInputItemsList failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceResponsesInputItemsListRequest](../../models/operations/inference-responses-input-items-list-request.md)                                                  | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceResponsesInputItemsListResponse](../../models/operations/inference-responses-input-items-list-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceResponsesCancel

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_responses_cancel" method="post" path="/v1/responses/{responseId}/cancel" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.inference.inferenceResponsesCancel({
    responseId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceResponsesCancel } from "@compose-market/sdk/funcs/inference-inference-responses-cancel.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await inferenceInferenceResponsesCancel(composeMarket, {
    responseId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceResponsesCancel failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceResponsesCancelRequest](../../models/operations/inference-responses-cancel-request.md)                                                                    | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceResponsesCancelResponse](../../models/operations/inference-responses-cancel-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceEmbeddingsCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_embeddings_create" method="post" path="/v1/embeddings" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceEmbeddingsCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Golf",
      input: "<value>",
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
import { inferenceInferenceEmbeddingsCreate } from "@compose-market/sdk/funcs/inference-inference-embeddings-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceEmbeddingsCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Golf",
      input: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceEmbeddingsCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceEmbeddingsCreateRequest](../../models/operations/inference-embeddings-create-request.md)                                                                  | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceEmbeddingsCreateSecurity](../../models/operations/inference-embeddings-create-security.md)                                                                | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceEmbeddingsCreateResponse](../../models/operations/inference-embeddings-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceImagesGenerate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_images_generate" method="post" path="/v1/images/generations" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceImagesGenerate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "ATS",
      prompt: "<value>",
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
import { inferenceInferenceImagesGenerate } from "@compose-market/sdk/funcs/inference-inference-images-generate.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceImagesGenerate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "ATS",
      prompt: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceImagesGenerate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceImagesGenerateRequest](../../models/operations/inference-images-generate-request.md)                                                                      | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceImagesGenerateSecurity](../../models/operations/inference-images-generate-security.md)                                                                    | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceImagesGenerateResponse](../../models/operations/inference-images-generate-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceImagesEdit

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_images_edit" method="post" path="/v1/images/edits" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceImagesEdit({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Aventador",
      prompt: "<value>",
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
import { inferenceInferenceImagesEdit } from "@compose-market/sdk/funcs/inference-inference-images-edit.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceImagesEdit(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Aventador",
      prompt: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceImagesEdit failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceImagesEditRequest](../../models/operations/inference-images-edit-request.md)                                                                              | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceImagesEditSecurity](../../models/operations/inference-images-edit-security.md)                                                                            | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceImagesEditResponse](../../models/operations/inference-images-edit-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceAudioSpeechCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_audio_speech_create" method="post" path="/v1/audio/speech" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceAudioSpeechCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Focus",
      input: "<value>",
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
import { inferenceInferenceAudioSpeechCreate } from "@compose-market/sdk/funcs/inference-inference-audio-speech-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceAudioSpeechCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "Focus",
      input: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceAudioSpeechCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceAudioSpeechCreateRequest](../../models/operations/inference-audio-speech-create-request.md)                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceAudioSpeechCreateSecurity](../../models/operations/inference-audio-speech-create-security.md)                                                             | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceAudioSpeechCreateResponse](../../models/operations/inference-audio-speech-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceAudioTranscriptionsCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_audio_transcriptions_create" method="post" path="/v1/audio/transcriptions" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceAudioTranscriptionsCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "V90",
      file: "<value>",
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
import { inferenceInferenceAudioTranscriptionsCreate } from "@compose-market/sdk/funcs/inference-inference-audio-transcriptions-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceAudioTranscriptionsCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "V90",
      file: "<value>",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceAudioTranscriptionsCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceAudioTranscriptionsCreateRequest](../../models/operations/inference-audio-transcriptions-create-request.md)                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceAudioTranscriptionsCreateSecurity](../../models/operations/inference-audio-transcriptions-create-security.md)                                             | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceAudioTranscriptionsCreateResponse](../../models/operations/inference-audio-transcriptions-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceAudioTranscriptionsCreateMultipart

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_audio_transcriptions_create_multipart" method="post" path="/v1/audio/transcriptions" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";
import { openAsBlob } from "node:fs";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceAudioTranscriptionsCreateMultipart({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "V90",
      file: await openAsBlob("example.file"),
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
import { inferenceInferenceAudioTranscriptionsCreateMultipart } from "@compose-market/sdk/funcs/inference-inference-audio-transcriptions-create-multipart.js";
import { openAsBlob } from "node:fs";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceAudioTranscriptionsCreateMultipart(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "V90",
      file: await openAsBlob("example.file"),
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceAudioTranscriptionsCreateMultipart failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceAudioTranscriptionsCreateMultipartRequest](../../models/operations/inference-audio-transcriptions-create-multipart-request.md)                            | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceAudioTranscriptionsCreateMultipartSecurity](../../models/operations/inference-audio-transcriptions-create-multipart-security.md)                          | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceAudioTranscriptionsCreateMultipartResponse](../../models/operations/inference-audio-transcriptions-create-multipart-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceVideosGenerate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_videos_generate" method="post" path="/v1/videos/generations" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceVideosGenerate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "El Camino",
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
import { inferenceInferenceVideosGenerate } from "@compose-market/sdk/funcs/inference-inference-videos-generate.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceVideosGenerate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      model: "El Camino",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceVideosGenerate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceVideosGenerateRequest](../../models/operations/inference-videos-generate-request.md)                                                                      | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceVideosGenerateSecurity](../../models/operations/inference-videos-generate-security.md)                                                                    | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceVideosGenerateResponse](../../models/operations/inference-videos-generate-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceVideosGet

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_videos_get" method="get" path="/v1/videos/{videoId}" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.inference.inferenceVideosGet({
    videoId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceVideosGet } from "@compose-market/sdk/funcs/inference-inference-videos-get.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await inferenceInferenceVideosGet(composeMarket, {
    videoId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceVideosGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceVideosGetRequest](../../models/operations/inference-videos-get-request.md)                                                                                | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceVideosGetResponse](../../models/operations/inference-videos-get-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceVideosStream

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_videos_stream" method="get" path="/v1/videos/{videoId}/stream" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.inference.inferenceVideosStream({
    videoId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceVideosStream } from "@compose-market/sdk/funcs/inference-inference-videos-stream.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await inferenceInferenceVideosStream(composeMarket, {
    videoId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceVideosStream failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.InferenceVideosStreamRequest](../../models/operations/inference-videos-stream-request.md)                                                                          | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceVideosStreamResponse](../../models/operations/inference-videos-stream-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## inferenceLegacyCreate

### Example Usage

<!-- UsageSnippet language="typescript" operationID="inference_legacy_create" method="post" path="/api/inference" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.inference.inferenceLegacyCreate({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    "key": "<value>",
    "key1": "<value>",
    "key2": "<value>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { inferenceInferenceLegacyCreate } from "@compose-market/sdk/funcs/inference-inference-legacy-create.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await inferenceInferenceLegacyCreate(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    "key": "<value>",
    "key1": "<value>",
    "key2": "<value>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("inferenceInferenceLegacyCreate failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [{ [k: string]: any }](../../models/.md)                                                                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.InferenceLegacyCreateSecurity](../../models/operations/inference-legacy-create-security.md)                                                                        | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.InferenceLegacyCreateResponse](../../models/operations/inference-legacy-create-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |