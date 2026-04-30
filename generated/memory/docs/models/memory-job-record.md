# MemoryJobRecord

## Example Usage

```typescript
import { MemoryJobRecord } from "@compose-market/sdk/models";

let value: MemoryJobRecord = {
  jobId: "<id>",
  type: "cleanup",
  execution: "temporal",
  status: "failed",
  createdAt: 765691,
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `jobId`                                                                     | *string*                                                                    | :heavy_check_mark:                                                          | N/A                                                                         |
| `type`                                                                      | [models.MemoryJobRecordType](../models/memory-job-record-type.md)           | :heavy_check_mark:                                                          | N/A                                                                         |
| `execution`                                                                 | [models.MemoryJobRecordExecution](../models/memory-job-record-execution.md) | :heavy_check_mark:                                                          | N/A                                                                         |
| `status`                                                                    | [models.MemoryJobRecordStatus](../models/memory-job-record-status.md)       | :heavy_check_mark:                                                          | N/A                                                                         |
| `agentWallet`                                                               | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |
| `temporalWorkflowId`                                                        | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |
| `temporalRunId`                                                             | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |
| `data`                                                                      | *any*                                                                       | :heavy_minus_sign:                                                          | N/A                                                                         |
| `error`                                                                     | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |
| `createdAt`                                                                 | *number*                                                                    | :heavy_check_mark:                                                          | N/A                                                                         |
| `completedAt`                                                               | *number*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |