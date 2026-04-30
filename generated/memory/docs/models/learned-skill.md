# LearnedSkill

## Example Usage

```typescript
import { LearnedSkill } from "@compose-market/sdk/models";

let value: LearnedSkill = {
  skillId: "<id>",
  name: "<value>",
  description: "if bracelet er boohoo maintainer yippee",
  category: "<value>",
  successRate: 197,
  usageCount: 982134,
  creator: "<value>",
  agents: [
    "<value 1>",
    "<value 2>",
  ],
  createdAt: 377321,
};
```

## Fields

| Field                 | Type                  | Required              | Description           |
| --------------------- | --------------------- | --------------------- | --------------------- |
| `skillId`             | *string*              | :heavy_check_mark:    | N/A                   |
| `name`                | *string*              | :heavy_check_mark:    | N/A                   |
| `description`         | *string*              | :heavy_check_mark:    | N/A                   |
| `category`            | *string*              | :heavy_check_mark:    | N/A                   |
| `trigger`             | Record<string, *any*> | :heavy_minus_sign:    | N/A                   |
| `spawnConfig`         | Record<string, *any*> | :heavy_minus_sign:    | N/A                   |
| `successRate`         | *number*              | :heavy_check_mark:    | N/A                   |
| `usageCount`          | *number*              | :heavy_check_mark:    | N/A                   |
| `creator`             | *string*              | :heavy_check_mark:    | N/A                   |
| `agents`              | *string*[]            | :heavy_check_mark:    | N/A                   |
| `tags`                | *string*[]            | :heavy_minus_sign:    | N/A                   |
| `createdAt`           | *number*              | :heavy_check_mark:    | N/A                   |
| `updatedAt`           | *number*              | :heavy_minus_sign:    | N/A                   |