# MemoryScheduleListResponse

## Example Usage

```typescript
import { MemoryScheduleListResponse } from "@compose-market/sdk/models";

let value: MemoryScheduleListResponse = {
  schedules: [
    {
      scheduleId: "<id>",
      paused: false,
    },
  ],
};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `schedules`                                                          | [models.MemoryScheduleStatus](../models/memory-schedule-status.md)[] | :heavy_check_mark:                                                   | N/A                                                                  |