# @compose-market/sdk

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *@compose-market/sdk* API.

[![Built by Speakeasy](https://img.shields.io/badge/Built_by-SPEAKEASY-374151?style=for-the-badge&labelColor=f3f4f6)](https://www.speakeasy.com/?utm_source=@compose-market/sdk&utm_campaign=typescript)
[![License: MIT](https://img.shields.io/badge/LICENSE_//_MIT-3b5bdb?style=for-the-badge&labelColor=eff6ff)](https://opensource.org/licenses/MIT)


<br /><br />
> [!IMPORTANT]
> This SDK is not yet ready for production use. To complete setup please follow the steps outlined in your [workspace](https://app.speakeasy.com/org/compose-market/compose-market). Delete this section before > publishing to a package manager.

<!-- Start Summary [summary] -->
## Summary

Compose x402: x402 settlement, Compose Keys, sessions, payments, and facilitator contracts.

Canonical contract for Compose x402 settlement, reusable Compose Keys, session state, payments, and facilitator operations.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@compose-market/sdk](#compose-marketsdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Authentication](#authentication)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET>
```

> [!NOTE]
> This package is published as an ES Module (ESM) only. For applications using
> CommonJS, use `await import()` to import and use this package.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name             | Type | Scheme      |
| ---------------- | ---- | ----------- |
| `composeKeyAuth` | http | HTTP Bearer |

To authenticate with the API the `composeKeyAuth` parameter must be set when initializing the SDK client instance. For example:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck();

  console.log(result);
}

run();

```

### Per-Operation Security Schemes

Some operations in this SDK require the security scheme to be specified at the request level. For example:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.payments.paymentsPrepare({}, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      service: "<value>",
      action: "<value>",
      resource: "<value>",
      maxAmountWei: "1000000",
    },
  });

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [ComposeKeys](docs/sdks/composekeys/README.md)

* [sessionGetActive](docs/sdks/composekeys/README.md#sessiongetactive)
* [sessionEventsSubscribe](docs/sdks/composekeys/README.md#sessioneventssubscribe)
* [composeKeysCreate](docs/sdks/composekeys/README.md#composekeyscreate)
* [composeKeysList](docs/sdks/composekeys/README.md#composekeyslist)
* [composeKeysGet](docs/sdks/composekeys/README.md#composekeysget)
* [composeKeysRevoke](docs/sdks/composekeys/README.md#composekeysrevoke)

### [Health](docs/sdks/health/README.md)

* [healthCheck](docs/sdks/health/README.md#healthcheck)

### [Payments](docs/sdks/payments/README.md)

* [paymentsPrepare](docs/sdks/payments/README.md#paymentsprepare)
* [paymentsSettle](docs/sdks/payments/README.md#paymentssettle)
* [paymentsAbort](docs/sdks/payments/README.md#paymentsabort)
* [paymentsModelMeter](docs/sdks/payments/README.md#paymentsmodelmeter)

### [X402](docs/sdks/x402/README.md)

* [x402Supported](docs/sdks/x402/README.md#x402supported)
* [x402ChainsList](docs/sdks/x402/README.md#x402chainslist)
* [x402PaymentVerify](docs/sdks/x402/README.md#x402paymentverify)
* [x402PaymentSettle](docs/sdks/x402/README.md#x402paymentsettle)

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`composeKeysComposeKeysCreate`](docs/sdks/composekeys/README.md#composekeyscreate)
- [`composeKeysComposeKeysGet`](docs/sdks/composekeys/README.md#composekeysget)
- [`composeKeysComposeKeysList`](docs/sdks/composekeys/README.md#composekeyslist)
- [`composeKeysComposeKeysRevoke`](docs/sdks/composekeys/README.md#composekeysrevoke)
- [`composeKeysSessionEventsSubscribe`](docs/sdks/composekeys/README.md#sessioneventssubscribe)
- [`composeKeysSessionGetActive`](docs/sdks/composekeys/README.md#sessiongetactive)
- [`healthHealthCheck`](docs/sdks/health/README.md#healthcheck)
- [`paymentsPaymentsAbort`](docs/sdks/payments/README.md#paymentsabort)
- [`paymentsPaymentsModelMeter`](docs/sdks/payments/README.md#paymentsmodelmeter)
- [`paymentsPaymentsPrepare`](docs/sdks/payments/README.md#paymentsprepare)
- [`paymentsPaymentsSettle`](docs/sdks/payments/README.md#paymentssettle)
- [`x402X402ChainsList`](docs/sdks/x402/README.md#x402chainslist)
- [`x402X402PaymentSettle`](docs/sdks/x402/README.md#x402paymentsettle)
- [`x402X402PaymentVerify`](docs/sdks/x402/README.md#x402paymentverify)
- [`x402X402Supported`](docs/sdks/x402/README.md#x402supported)

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck();

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`ComposeMarketError`](./src/models/errors/compose-market-error.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { ComposeMarket } from "@compose-market/sdk";
import * as errors from "@compose-market/sdk/models/errors";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  try {
    const result = await composeMarket.x402.x402PaymentVerify({
      x402Version: 2,
      paymentPayload: {
        x402Version: 2,
        accepted: {
          scheme: "exact",
          network: "eip155:43113",
          amount: "1000000",
          asset: "0x1111111111111111111111111111111111111111",
          payTo: "0x1111111111111111111111111111111111111111",
          maxTimeoutSeconds: 57667,
        },
        payload: "<value>",
      },
      paymentRequirements: {
        scheme: "exact",
        network: "eip155:43113",
        amount: "1000000",
        asset: "0x1111111111111111111111111111111111111111",
        payTo: "0x1111111111111111111111111111111111111111",
        maxTimeoutSeconds: 167169,
      },
    });

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.ComposeMarketError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.ErrorEnvelope) {
        console.log(error.data$.error); // models.ErrorT
        console.log(error.data$.rawResponse); // Response
      }
    }
  }
}

run();

```

### Error Classes
**Primary error:**
* [`ComposeMarketError`](./src/models/errors/compose-market-error.ts): The base class for HTTP error responses.

<details><summary>Less common errors (9)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/http-client-errors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/http-client-errors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/http-client-errors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/http-client-errors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/http-client-errors.ts): Unrecognised or unexpected error.


**Inherit from [`ComposeMarketError`](./src/models/errors/compose-market-error.ts)**:
* [`ErrorEnvelope`](./src/models/errors/error-envelope.ts): Applicable to 11 of 15 methods.*
* [`LegacyError`](./src/models/errors/legacy-error.ts): Compose error response. Applicable to 10 of 15 methods.*
* [`PaymentRequiredError`](./src/models/errors/payment-required-error.ts): x402 payment challenge. Status code `402`. Applicable to 1 of 15 methods.*
* [`ResponseValidationError`](./src/models/errors/response-validation-error.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Name

You can override the default server globally by passing a server name to the `server: keyof typeof ServerList` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the names associated with the available servers:

| Name    | Server                       | Description                     |
| ------- | ---------------------------- | ------------------------------- |
| `x402`  | `https://api.compose.market` | Production x402 endpoint        |
| `local` | `http://127.0.0.1:3000`      | Local x402 development endpoint |

#### Example

```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  server: "x402",
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck();

  console.log(result);
}

run();

```

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  serverURL: "https://api.compose.market",
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.healthCheck();

  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to:
- route requests through a proxy server using [undici](https://www.npmjs.com/package/undici)'s ProxyAgent
- use the `"beforeRequest"` hook to add a custom header and a timeout to requests
- use the `"requestError"` hook to log errors

```typescript
import { ComposeMarket } from "@compose-market/sdk";
import { ProxyAgent } from "undici";
import { HTTPClient } from "@compose-market/sdk/lib/http";

const dispatcher = new ProxyAgent("http://proxy.example.com:8080");

const httpClient = new HTTPClient({
  // 'fetcher' takes a function that has the same signature as native 'fetch'.
  fetcher: (input, init) =>
    // 'dispatcher' is specific to undici and not part of the standard Fetch API.
    fetch(input, { ...init, dispatcher } as RequestInit),
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new ComposeMarket({ httpClient: httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { ComposeMarket } from "@compose-market/sdk";

const sdk = new ComposeMarket({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://www.speakeasy.com/?utm_source=@compose-market/sdk&utm_campaign=typescript)
