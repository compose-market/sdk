# LearnedSkillListResponse

## Example Usage

```typescript
import { LearnedSkillListResponse } from "@compose-market/sdk/models";

let value: LearnedSkillListResponse = {
  skills: [
    {
      skillId: "<id>",
      name: "<value>",
      description: "upright perfectly nor prudent before yowza",
      category: "<value>",
      successRate: 617.12,
      usageCount: 875886,
      creator: "<value>",
      agents: [
        "<value 1>",
        "<value 2>",
        "<value 3>",
      ],
      createdAt: 444102,
    },
  ],
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `skills`                                            | [models.LearnedSkill](../models/learned-skill.md)[] | :heavy_check_mark:                                  | N/A                                                 |