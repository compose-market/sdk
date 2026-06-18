# @compose-market/sdk

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *@compose-market/sdk* API.

[![Built by Speakeasy](https://img.shields.io/badge/Built_by-SPEAKEASY-374151?style=for-the-badge&labelColor=f3f4f6)](https://www.speakeasy.com/?utm_source=@compose-market/sdk&utm_campaign=typescript)
[![License: MIT](https://img.shields.io/badge/LICENSE_//_MIT-3b5bdb?style=for-the-badge&labelColor=eff6ff)](https://opensource.org/licenses/MIT)


<br /><br />
> [!IMPORTANT]
> This SDK is not yet ready for production use. To complete setup please follow the steps outlined in your [workspace](https://app.speakeasy.com/org/compose-market/compose-market). Delete this section before > publishing to a package manager.

<!-- Start Summary [summary] -->
## Summary

Compose Memory: Agent-first memory loop and low-level memory primitives.

Standalone Compose Memory contract. This SDK surface is intentionally
independent from agent/workflow execution so any external application or
autonomous agent can integrate compact pre-turn recall, post-turn memory
persistence, explicit durable memory, vector recall, transcripts, layered
search, and stats without adopting the rest of the manowar SDK.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@compose-market/sdk](#compose-marketsdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
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

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  });

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [Memory](docs/sdks/memory/README.md)

* [contextAssemble](docs/sdks/memory/README.md#contextassemble) - Assemble compact pre-turn memory context.
* [turnRecord](docs/sdks/memory/README.md#turnrecord) - Persist the completed turn.
* [remember](docs/sdks/memory/README.md#remember) - Save an explicit durable fact or preference.
* [loop](docs/sdks/memory/README.md#loop) - Single endpoint for the agent memory loop.
* [loopsList](docs/sdks/memory/README.md#loopslist) - List compact agent-first memory loop manifests.
* [loopsGet](docs/sdks/memory/README.md#loopsget) - Fetch one compact memory loop manifest.
* [patternsList](docs/sdks/memory/README.md#patternslist) - List learned procedural memory patterns.
* [patternsGet](docs/sdks/memory/README.md#patternsget) - Fetch one procedural memory pattern.
* [patternsValidate](docs/sdks/memory/README.md#patternsvalidate) - Validate a procedural memory pattern before promotion.
* [patternsPromote](docs/sdks/memory/README.md#patternspromote) - Promote a validated procedural pattern into a learned skill.
* [skillsList](docs/sdks/memory/README.md#skillslist) - List learned memory skills.
* [skillsGet](docs/sdks/memory/README.md#skillsget) - Fetch one learned memory skill.
* [graphAdd](docs/sdks/memory/README.md#graphadd) - Add graph memory through the configured graph provider.
* [graphSearch](docs/sdks/memory/README.md#graphsearch) - Search graph memory through the configured graph provider.
* [list](docs/sdks/memory/README.md#list) - List memories for an agent wallet.
* [vectorSearch](docs/sdks/memory/README.md#vectorsearch) - Search vector memory.
* [vectorIndex](docs/sdks/memory/README.md#vectorindex) - Index a memory vector.
* [transcriptStore](docs/sdks/memory/README.md#transcriptstore) - Store a session transcript.
* [transcriptGet](docs/sdks/memory/README.md#transcriptget) - Fetch a transcript by session or thread id.
* [transcriptsIndex](docs/sdks/memory/README.md#transcriptsindex) - Store, index, and optionally update working memory from a transcript.
* [sessionsWorkingGet](docs/sdks/memory/README.md#sessionsworkingget) - Fetch hot working memory for a session.
* [sessionsWorkingUpdate](docs/sdks/memory/README.md#sessionsworkingupdate) - Update hot working memory for a session.
* [sessionsCompress](docs/sdks/memory/README.md#sessionscompress) - Compress a long transcript into durable archive memory.
* [archivesSync](docs/sdks/memory/README.md#archivessync) - Sync a memory archive to durable external storage.
* [schedulesList](docs/sdks/memory/README.md#scheduleslist) - List Temporal memory schedule status.
* [schedulesCreate](docs/sdks/memory/README.md#schedulescreate) - Create or replace memory maintenance schedules.
* [schedulesDelete](docs/sdks/memory/README.md#schedulesdelete) - Delete memory maintenance schedules.
* [schedulesPause](docs/sdks/memory/README.md#schedulespause) - Pause one memory maintenance schedule.
* [schedulesResume](docs/sdks/memory/README.md#schedulesresume) - Resume one memory maintenance schedule.
* [schedulesTrigger](docs/sdks/memory/README.md#schedulestrigger) - Trigger one memory maintenance schedule immediately.
* [rerank](docs/sdks/memory/README.md#rerank) - Rerank candidate memory documents.
* [layersSearch](docs/sdks/memory/README.md#layerssearch) - Search all memory layers.
* [statsGet](docs/sdks/memory/README.md#statsget) - Get memory statistics for an agent wallet.
* [itemsSearch](docs/sdks/memory/README.md#itemssearch) - Search productized memory items across layers.
* [itemsGet](docs/sdks/memory/README.md#itemsget) - Fetch one durable memory item.
* [itemsUpdate](docs/sdks/memory/README.md#itemsupdate) - Update one durable memory item.
* [itemsDelete](docs/sdks/memory/README.md#itemsdelete) - Delete or soft-delete one durable memory item.
* [conflictsResolve](docs/sdks/memory/README.md#conflictsresolve) - Resolve a memory conflict.
* [jobsCreate](docs/sdks/memory/README.md#jobscreate) - Run a memory maintenance job.
* [jobsGet](docs/sdks/memory/README.md#jobsget) - Fetch a memory maintenance job.
* [evalsRun](docs/sdks/memory/README.md#evalsrun) - Run a memory retrieval evaluation.

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

- [`memoryArchivesSync`](docs/sdks/memory/README.md#archivessync) - Sync a memory archive to durable external storage.
- [`memoryConflictsResolve`](docs/sdks/memory/README.md#conflictsresolve) - Resolve a memory conflict.
- [`memoryContextAssemble`](docs/sdks/memory/README.md#contextassemble) - Assemble compact pre-turn memory context.
- [`memoryEvalsRun`](docs/sdks/memory/README.md#evalsrun) - Run a memory retrieval evaluation.
- [`memoryGraphAdd`](docs/sdks/memory/README.md#graphadd) - Add graph memory through the configured graph provider.
- [`memoryGraphSearch`](docs/sdks/memory/README.md#graphsearch) - Search graph memory through the configured graph provider.
- [`memoryItemsDelete`](docs/sdks/memory/README.md#itemsdelete) - Delete or soft-delete one durable memory item.
- [`memoryItemsGet`](docs/sdks/memory/README.md#itemsget) - Fetch one durable memory item.
- [`memoryItemsSearch`](docs/sdks/memory/README.md#itemssearch) - Search productized memory items across layers.
- [`memoryItemsUpdate`](docs/sdks/memory/README.md#itemsupdate) - Update one durable memory item.
- [`memoryJobsCreate`](docs/sdks/memory/README.md#jobscreate) - Run a memory maintenance job.
- [`memoryJobsGet`](docs/sdks/memory/README.md#jobsget) - Fetch a memory maintenance job.
- [`memoryLayersSearch`](docs/sdks/memory/README.md#layerssearch) - Search all memory layers.
- [`memoryList`](docs/sdks/memory/README.md#list) - List memories for an agent wallet.
- [`memoryLoop`](docs/sdks/memory/README.md#loop) - Single endpoint for the agent memory loop.
- [`memoryPatternsGet`](docs/sdks/memory/README.md#patternsget) - Fetch one procedural memory pattern.
- [`memoryPatternsList`](docs/sdks/memory/README.md#patternslist) - List learned procedural memory patterns.
- [`memoryPatternsPromote`](docs/sdks/memory/README.md#patternspromote) - Promote a validated procedural pattern into a learned skill.
- [`memoryPatternsValidate`](docs/sdks/memory/README.md#patternsvalidate) - Validate a procedural memory pattern before promotion.
- [`memoryRemember`](docs/sdks/memory/README.md#remember) - Save an explicit durable fact or preference.
- [`memoryRerank`](docs/sdks/memory/README.md#rerank) - Rerank candidate memory documents.
- [`memorySchedulesCreate`](docs/sdks/memory/README.md#schedulescreate) - Create or replace memory maintenance schedules.
- [`memorySchedulesDelete`](docs/sdks/memory/README.md#schedulesdelete) - Delete memory maintenance schedules.
- [`memorySchedulesList`](docs/sdks/memory/README.md#scheduleslist) - List Temporal memory schedule status.
- [`memorySchedulesPause`](docs/sdks/memory/README.md#schedulespause) - Pause one memory maintenance schedule.
- [`memorySchedulesResume`](docs/sdks/memory/README.md#schedulesresume) - Resume one memory maintenance schedule.
- [`memorySchedulesTrigger`](docs/sdks/memory/README.md#schedulestrigger) - Trigger one memory maintenance schedule immediately.
- [`memorySessionsCompress`](docs/sdks/memory/README.md#sessionscompress) - Compress a long transcript into durable archive memory.
- [`memorySessionsWorkingGet`](docs/sdks/memory/README.md#sessionsworkingget) - Fetch hot working memory for a session.
- [`memorySessionsWorkingUpdate`](docs/sdks/memory/README.md#sessionsworkingupdate) - Update hot working memory for a session.
- [`memorySkillsGet`](docs/sdks/memory/README.md#skillsget) - Fetch one learned memory skill.
- [`memorySkillsList`](docs/sdks/memory/README.md#skillslist) - List learned memory skills.
- [`memoryStatsGet`](docs/sdks/memory/README.md#statsget) - Get memory statistics for an agent wallet.
- [`memoryTranscriptGet`](docs/sdks/memory/README.md#transcriptget) - Fetch a transcript by session or thread id.
- [`memoryTranscriptsIndex`](docs/sdks/memory/README.md#transcriptsindex) - Store, index, and optionally update working memory from a transcript.
- [`memoryTranscriptStore`](docs/sdks/memory/README.md#transcriptstore) - Store a session transcript.
- [`memoryTurnRecord`](docs/sdks/memory/README.md#turnrecord) - Persist the completed turn.
- [`memoryVectorIndex`](docs/sdks/memory/README.md#vectorindex) - Index a memory vector.
- [`memoryVectorSearch`](docs/sdks/memory/README.md#vectorsearch) - Search vector memory.
- [`memoryLoopsGet`](docs/sdks/memory/README.md#loopsget) - Fetch one compact memory loop manifest.
- [`memoryLoopsList`](docs/sdks/memory/README.md#loopslist) - List compact agent-first memory loop manifests.

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  }, {
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
});

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  });

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

const composeMarket = new ComposeMarket();

async function run() {
  try {
    const result = await composeMarket.memory.contextAssemble({
      agentWallet: "<value>",
      query: "<value>",
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
        console.log(error.data$.additionalProperties); // { [k: string]: any }
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

<details><summary>Less common errors (7)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/http-client-errors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/http-client-errors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/http-client-errors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/http-client-errors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/http-client-errors.ts): Unrecognised or unexpected error.


**Inherit from [`ComposeMarketError`](./src/models/errors/compose-market-error.ts)**:
* [`ErrorResponse`](./src/models/errors/error-response.ts): Memory error response. Applicable to 18 of 41 methods.*
* [`ResponseValidationError`](./src/models/errors/response-validation-error.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Name

You can override the default server globally by passing a server name to the `server: keyof typeof ServerList` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the names associated with the available servers:

| Name          | Server                           | Description                        |
| ------------- | -------------------------------- | ---------------------------------- |
| `compose-api` | `https://api.compose.market`     | Public Compose API gateway         |
| `runtime`     | `https://runtime.compose.market` | Runtime service                    |
| `local`       | `http://127.0.0.1:8787`          | Local runtime development endpoint |

#### Example

```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  server: "compose-api",
});

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  });

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
});

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  });

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
