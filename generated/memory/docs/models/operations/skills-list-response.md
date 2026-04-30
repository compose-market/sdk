# SkillsListResponse

## Example Usage

```typescript
import { SkillsListResponse } from "@compose-market/sdk/models/operations";

let value: SkillsListResponse = {
  contentType: "<value>",
  statusCode: 692607,
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `contentType`                                                                  | *string*                                                                       | :heavy_check_mark:                                                             | HTTP response content type for this operation                                  |
| `statusCode`                                                                   | *number*                                                                       | :heavy_check_mark:                                                             | HTTP response status code for this operation                                   |
| `rawResponse`                                                                  | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)          | :heavy_check_mark:                                                             | Raw HTTP response; suitable for custom response parsing                        |
| `learnedSkillListResponse`                                                     | [models.LearnedSkillListResponse](../../models/learned-skill-list-response.md) | :heavy_minus_sign:                                                             | Learned memory skills.                                                         |