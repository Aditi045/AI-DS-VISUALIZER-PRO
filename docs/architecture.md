# Architecture

## Runtime pipeline

1. React accepts natural language, chat, and visual controls.
2. `POST /api/ai/parse` converts text to an allowlisted operation schema.
3. `app.ai.validator` validates data-structure names, operation names, and parameters.
4. `SessionManager` owns the live data-structure instances; the engine is the source of truth.
5. The execution router emits one event per operation with a state snapshot and complexity metadata.
6. React visualizers render those snapshots and support step navigation.
7. SQLite stores successful commands for history and progress.

## Safety boundary

The application never calls `exec`, `eval`, a shell, or a user-provided code interpreter. Code-to-visualization only recognizes explicitly supported patterns such as `stack.push(10)` and returns safe operations. Provider/API keys, if configured later, remain backend-only.

## Backend modules

- `data_structures/`: manual implementations and serialization helpers
- `algorithms/`: searching, sorting, traversal, and complexity metadata
- `ai/`: parser, schemas, validator, and session manager
- `api/`: HTTP contracts for execution, learning, chat, challenge, and history
- `models/`: SQLAlchemy persistence models

## Frontend modules

- `App.tsx`: responsive learning workspace, command flow, tutor, history, and step controls
- `visualizers/`: Framer Motion and React Flow renderers
- `services/`, `hooks/`, and `types/`: extension points for further decomposition

## Persistence

SQLite is used for local development. `operation_history` records the session, command, structure, operation JSON, and timestamp. Progress and achievement endpoints derive transparent metrics from that history.
