# API quick reference

All endpoints return JSON. Errors use `success: false` with a stable `error` code and a user-safe `message`.

## Parse and execute

`POST /api/ai/parse`

```json
{"command":"Create a stack and push 10, 20 and 30."}
```

`POST /api/execute/`

```json
{"session_id":"demo-session","data_structure":"stack","operations":[{"type":"push","value":10}]}
```

The response contains `events`, `state`, `results`, `complexity`, and `explanation`.

## Learning endpoints

- `POST /api/chat/`: `{message, context_ds, context_state, complexity}`
- `POST /api/challenge/`: `{topic, difficulty}`
- `POST /api/algorithm/run`: `{algorithm, values, target}`
- `POST /api/code/analyze`: `{code}`; recognizes safe supported patterns only
- `POST /api/code/generate`: `{language, state}`; returns educational code

## Progress

- `GET /api/history?session_id=demo-session`
- `DELETE /api/history?session_id=demo-session`
- `GET /api/progress?session_id=demo-session`
- `GET /api/achievements?session_id=demo-session`
