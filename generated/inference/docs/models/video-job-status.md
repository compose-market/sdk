# VideoJobStatus

## Example Usage

```typescript
import { VideoJobStatus } from "@compose-market/sdk/models";

let value: VideoJobStatus = {
  id: "<id>",
  object: "video.generation",
  status: "completed",
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `id`                                                                | *string*                                                            | :heavy_check_mark:                                                  | N/A                                                                 |
| `object`                                                            | *"video.generation"*                                                | :heavy_check_mark:                                                  | N/A                                                                 |
| `status`                                                            | [models.VideoJobStatusStatus](../models/video-job-status-status.md) | :heavy_check_mark:                                                  | N/A                                                                 |
| `url`                                                               | *string*                                                            | :heavy_minus_sign:                                                  | N/A                                                                 |
| `error`                                                             | *string*                                                            | :heavy_minus_sign:                                                  | N/A                                                                 |
| `progress`                                                          | *number*                                                            | :heavy_minus_sign:                                                  | N/A                                                                 |
| `additionalProperties`                                              | Record<string, *any*>                                               | :heavy_minus_sign:                                                  | N/A                                                                 |