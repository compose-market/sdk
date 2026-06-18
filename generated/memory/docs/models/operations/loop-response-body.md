# LoopResponseBody

Agent memory loop response.


## Supported Types

### `models.AgentMemoryContextResponse`

```typescript
const value: models.AgentMemoryContextResponse = {
  loop: {
    v: "compose.agent_memory_loop.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  contextId: "<id>",
  prompt: "<value>",
  items: [],
  totals: {
    "key": 668253,
    "key1": 146180,
    "key2": 768052,
  },
  contextUsage: {
    characters: 309378,
    rawCharacters: 905274,
    savedCharactersVsRaw: 949747,
    items: 318444,
  },
  omitted: {
    "key": 720422,
    "key1": 791118,
    "key2": 444852,
  },
};
```

### `models.AgentMemoryRecordTurnResponse`

```typescript
const value: models.AgentMemoryRecordTurnResponse = {
  loop: {
    v: "compose.agent_memory_loop.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  success: true,
  sessionId: "<id>",
  threadId: "<id>",
  turnId: "<id>",
  stored: {
    transcript: false,
    working: false,
    vector: false,
  },
};
```

### `models.AgentMemoryRememberResponse`

```typescript
const value: models.AgentMemoryRememberResponse = {
  loop: {
    v: "compose.agent_memory_loop.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  success: true,
  graphSaved: false,
  vectorSaved: false,
};
```

