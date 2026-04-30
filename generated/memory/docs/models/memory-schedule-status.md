# MemoryScheduleStatus

## Example Usage

```typescript
import { MemoryScheduleStatus } from "@compose-market/sdk/models";

let value: MemoryScheduleStatus = {
  scheduleId: "<id>",
  paused: false,
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `scheduleId`       | *string*           | :heavy_check_mark: | N/A                |
| `paused`           | *boolean*          | :heavy_check_mark: | N/A                |
| `lastRunAt`        | *number*           | :heavy_minus_sign: | N/A                |
| `nextRunAt`        | *number*           | :heavy_minus_sign: | N/A                |
| `note`             | *string*           | :heavy_minus_sign: | N/A                |