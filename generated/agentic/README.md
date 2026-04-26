# @compose-market/sdk

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *@compose-market/sdk* API.

[![Built by Speakeasy](https://img.shields.io/badge/Built_by-SPEAKEASY-374151?style=for-the-badge&labelColor=f3f4f6)](https://www.speakeasy.com/?utm_source=@compose-market/sdk&utm_campaign=typescript)
[![License: MIT](https://img.shields.io/badge/LICENSE_//_MIT-3b5bdb?style=for-the-badge&labelColor=eff6ff)](https://opensource.org/licenses/MIT)


<br /><br />
> [!IMPORTANT]
> This SDK is not yet ready for production use. To complete setup please follow the steps outlined in your [workspace](https://app.speakeasy.com/org/compose-market/compose-market). Delete this section before > publishing to a package manager.

<!-- Start Summary [summary] -->
## Summary

Compose Agentic: Agent, workflow, memory, workspace, tool, MCP, and mesh execution contracts.

Canonical contract for Compose agentic loops: agents, workflows, memory,
workspace indexing, MCP/GOAT tool execution, and mesh-local execution helpers.
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
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name                | Type | Scheme      |
| ------------------- | ---- | ----------- |
| `runtimeBearerAuth` | http | HTTP Bearer |

To authenticate with the API the `runtimeBearerAuth` parameter must be set when initializing the SDK client instance. For example:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [Agents](docs/sdks/agents/README.md)

* [agentsChatCreate](docs/sdks/agents/README.md#agentschatcreate)
* [agentsStreamCreate](docs/sdks/agents/README.md#agentsstreamcreate)
* [agentsResponsesCreate](docs/sdks/agents/README.md#agentsresponsescreate)
* [agentsRunsStateGet](docs/sdks/agents/README.md#agentsrunsstateget)

### [Health](docs/sdks/health/README.md)

* [runtimeHealthCheck](docs/sdks/health/README.md#runtimehealthcheck)
* [runtimeStatusGet](docs/sdks/health/README.md#runtimestatusget)

### [Memory](docs/sdks/memory/README.md)

* [memoryAdd](docs/sdks/memory/README.md#memoryadd)
* [memorySearch](docs/sdks/memory/README.md#memorysearch)
* [memoryList](docs/sdks/memory/README.md#memorylist)
* [memoryVectorSearch](docs/sdks/memory/README.md#memoryvectorsearch)
* [memoryVectorIndex](docs/sdks/memory/README.md#memoryvectorindex)
* [memoryTranscriptStore](docs/sdks/memory/README.md#memorytranscriptstore)
* [memoryTranscriptGet](docs/sdks/memory/README.md#memorytranscriptget)
* [memoryRerank](docs/sdks/memory/README.md#memoryrerank)
* [memoryLayersSearch](docs/sdks/memory/README.md#memorylayerssearch)
* [memoryStatsGet](docs/sdks/memory/README.md#memorystatsget)

### [Mesh](docs/sdks/mesh/README.md)

* [meshToolsExecute](docs/sdks/mesh/README.md#meshtoolsexecute)
* [meshMemoryExecute](docs/sdks/mesh/README.md#meshmemoryexecute)
* [meshHaiRegister](docs/sdks/mesh/README.md#meshhairegister)
* [meshReputationSummaryGet](docs/sdks/mesh/README.md#meshreputationsummaryget)
* [meshSynapseAnchor](docs/sdks/mesh/README.md#meshsynapseanchor)
* [meshFilecoinPin](docs/sdks/mesh/README.md#meshfilecoinpin)
* [meshConclaveRun](docs/sdks/mesh/README.md#meshconclaverun)

### [Tools](docs/sdks/tools/README.md)

* [toolsGoatStatus](docs/sdks/tools/README.md#toolsgoatstatus)
* [toolsGoatPluginsList](docs/sdks/tools/README.md#toolsgoatpluginslist)
* [toolsGoatList](docs/sdks/tools/README.md#toolsgoatlist)
* [toolsGoatPluginGet](docs/sdks/tools/README.md#toolsgoatpluginget)
* [toolsGoatToolGet](docs/sdks/tools/README.md#toolsgoattoolget)
* [toolsGoatToolExecute](docs/sdks/tools/README.md#toolsgoattoolexecute)
* [toolsMcpInspect](docs/sdks/tools/README.md#toolsmcpinspect)
* [toolsMcpSpawn](docs/sdks/tools/README.md#toolsmcpspawn)
* [toolsMcpToolsList](docs/sdks/tools/README.md#toolsmcptoolslist)
* [toolsMcpToolExecute](docs/sdks/tools/README.md#toolsmcptoolexecute)
* [toolsRuntimeExecute](docs/sdks/tools/README.md#toolsruntimeexecute)

### [Workflows](docs/sdks/workflows/README.md)

* [workflowsExecute](docs/sdks/workflows/README.md#workflowsexecute)
* [workflowsPricesGet](docs/sdks/workflows/README.md#workflowspricesget)
* [workflowsChatStream](docs/sdks/workflows/README.md#workflowschatstream)
* [workflowsStop](docs/sdks/workflows/README.md#workflowsstop)
* [workflowsRunsStateGet](docs/sdks/workflows/README.md#workflowsrunsstateget)
* [workflowsRunsApprovalSignal](docs/sdks/workflows/README.md#workflowsrunsapprovalsignal)
* [workflowsRunAlias](docs/sdks/workflows/README.md#workflowsrunalias)

### [Workspace](docs/sdks/workspace/README.md)

* [workspaceIndex](docs/sdks/workspace/README.md#workspaceindex)
* [workspaceSearch](docs/sdks/workspace/README.md#workspacesearch)

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

- [`agentsAgentsChatCreate`](docs/sdks/agents/README.md#agentschatcreate)
- [`agentsAgentsResponsesCreate`](docs/sdks/agents/README.md#agentsresponsescreate)
- [`agentsAgentsRunsStateGet`](docs/sdks/agents/README.md#agentsrunsstateget)
- [`agentsAgentsStreamCreate`](docs/sdks/agents/README.md#agentsstreamcreate)
- [`healthRuntimeHealthCheck`](docs/sdks/health/README.md#runtimehealthcheck)
- [`healthRuntimeStatusGet`](docs/sdks/health/README.md#runtimestatusget)
- [`memoryMemoryAdd`](docs/sdks/memory/README.md#memoryadd)
- [`memoryMemoryLayersSearch`](docs/sdks/memory/README.md#memorylayerssearch)
- [`memoryMemoryList`](docs/sdks/memory/README.md#memorylist)
- [`memoryMemoryRerank`](docs/sdks/memory/README.md#memoryrerank)
- [`memoryMemorySearch`](docs/sdks/memory/README.md#memorysearch)
- [`memoryMemoryStatsGet`](docs/sdks/memory/README.md#memorystatsget)
- [`memoryMemoryTranscriptGet`](docs/sdks/memory/README.md#memorytranscriptget)
- [`memoryMemoryTranscriptStore`](docs/sdks/memory/README.md#memorytranscriptstore)
- [`memoryMemoryVectorIndex`](docs/sdks/memory/README.md#memoryvectorindex)
- [`memoryMemoryVectorSearch`](docs/sdks/memory/README.md#memoryvectorsearch)
- [`meshMeshConclaveRun`](docs/sdks/mesh/README.md#meshconclaverun)
- [`meshMeshFilecoinPin`](docs/sdks/mesh/README.md#meshfilecoinpin)
- [`meshMeshHaiRegister`](docs/sdks/mesh/README.md#meshhairegister)
- [`meshMeshMemoryExecute`](docs/sdks/mesh/README.md#meshmemoryexecute)
- [`meshMeshReputationSummaryGet`](docs/sdks/mesh/README.md#meshreputationsummaryget)
- [`meshMeshSynapseAnchor`](docs/sdks/mesh/README.md#meshsynapseanchor)
- [`meshMeshToolsExecute`](docs/sdks/mesh/README.md#meshtoolsexecute)
- [`toolsToolsGoatList`](docs/sdks/tools/README.md#toolsgoatlist)
- [`toolsToolsGoatPluginGet`](docs/sdks/tools/README.md#toolsgoatpluginget)
- [`toolsToolsGoatPluginsList`](docs/sdks/tools/README.md#toolsgoatpluginslist)
- [`toolsToolsGoatStatus`](docs/sdks/tools/README.md#toolsgoatstatus)
- [`toolsToolsGoatToolExecute`](docs/sdks/tools/README.md#toolsgoattoolexecute)
- [`toolsToolsGoatToolGet`](docs/sdks/tools/README.md#toolsgoattoolget)
- [`toolsToolsMcpInspect`](docs/sdks/tools/README.md#toolsmcpinspect)
- [`toolsToolsMcpSpawn`](docs/sdks/tools/README.md#toolsmcpspawn)
- [`toolsToolsMcpToolExecute`](docs/sdks/tools/README.md#toolsmcptoolexecute)
- [`toolsToolsMcpToolsList`](docs/sdks/tools/README.md#toolsmcptoolslist)
- [`toolsToolsRuntimeExecute`](docs/sdks/tools/README.md#toolsruntimeexecute)
- [`workflowsWorkflowsChatStream`](docs/sdks/workflows/README.md#workflowschatstream)
- [`workflowsWorkflowsExecute`](docs/sdks/workflows/README.md#workflowsexecute)
- [`workflowsWorkflowsPricesGet`](docs/sdks/workflows/README.md#workflowspricesget)
- [`workflowsWorkflowsRunAlias`](docs/sdks/workflows/README.md#workflowsrunalias)
- [`workflowsWorkflowsRunsApprovalSignal`](docs/sdks/workflows/README.md#workflowsrunsapprovalsignal)
- [`workflowsWorkflowsRunsStateGet`](docs/sdks/workflows/README.md#workflowsrunsstateget)
- [`workflowsWorkflowsStop`](docs/sdks/workflows/README.md#workflowsstop)
- [`workspaceWorkspaceIndex`](docs/sdks/workspace/README.md#workspaceindex)
- [`workspaceWorkspaceSearch`](docs/sdks/workspace/README.md#workspacesearch)

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck({
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
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

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
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  try {
    const result = await composeMarket.agents.agentsChatCreate({
      walletAddress: "<value>",
      body: {
        message: "<value>",
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
      if (error instanceof errors.ErrorResponse) {
        console.log(error.data$.error); // models.ErrorT
        console.log(error.data$.code); // string
        console.log(error.data$.message); // string
        console.log(error.data$.timestamp); // string
        console.log(error.data$.additionalProperties); // { [k: string]: any }
      }
    }
  }
}

run();

```

### Error Classes
**Primary error:**
* [`ComposeMarketError`](./src/models/errors/compose-market-error.ts): The base class for HTTP error responses.

<details><summary>Less common errors (7)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/http-client-errors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/http-client-errors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/http-client-errors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/http-client-errors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/http-client-errors.ts): Unrecognised or unexpected error.


**Inherit from [`ComposeMarketError`](./src/models/errors/compose-market-error.ts)**:
* [`ErrorResponse`](./src/models/errors/error-response.ts): Runtime error response. Applicable to 7 of 43 methods.*
* [`ResponseValidationError`](./src/models/errors/response-validation-error.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Name

You can override the default server globally by passing a server name to the `server: keyof typeof ServerList` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the names associated with the available servers:

| Name      | Server                           | Description                        |
| --------- | -------------------------------- | ---------------------------------- |
| `agentic` | `https://runtime.compose.market` | Production agentic endpoint        |
| `local`   | `http://127.0.0.1:8787`          | Local agentic development endpoint |

#### Example

```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  server: "agentic",
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

  console.log(result);
}

run();

```

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  serverURL: "https://runtime.compose.market",
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

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
