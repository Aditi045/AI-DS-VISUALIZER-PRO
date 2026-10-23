<<<<<<< HEAD
# AI-DS VISUALIZER PRO

**Learn DSA. Ask AI. Execute. Visualize. Master.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://ai-ds-visualizer-pro.vercel.app/dashboard)
[![GitHub Repository](https://img.shields.io/badge/Source%20Code-GitHub-181717?logo=github)](https://github.com/SairajAgawane/AI--DS-Visualizer-Pro)

## Live Demo

Try the deployed application here:

**[Open AI-DS Visualizer Pro](https://ai-ds-visualizer-pro.vercel.app/dashboard)**

AI-DS Visualizer Pro is an interactive DSA learning workspace. Natural-language commands are converted into a small, validated operation language, executed by real Python data-structure implementations, and returned as step events for the React visualizer.

## What works

- Stack, queue, linked list, BST, heap, and graph execution
- Safe local natural-language parser (no API key required for the demo)
- Strict Pydantic validation and structured errors such as Stack Underflow
- State snapshots, event history, operation complexity, and step controls
- Animated React visualizers for linear, tree, and graph structures
- Built-in DSA tutor with context-aware explanations
- Challenges, sorting/searching algorithm endpoints, safe code pattern analysis, and educational code generation
- SQLite operation history, progress, XP, and achievements endpoints
- SQLite email/password accounts and optional Google Identity sign-in
- Optional AI provider boundary can be added without exposing keys to the frontend
- Authenticated Program Editor for user-entered C, C++, Java, and Python programs
- Isolated subprocess execution with a five-second timeout, output limits, sanitized environment, and common dangerous-operation checks
- Program output, compiler/runtime errors, line diagnostics, execution timeline, speed controls, and supported-operation visualization

## Supported data-structure chapters

The playground currently includes:

| Chapter | Programs and algorithms |
| --- | --- |
| Array | Create, traverse, insert, delete, update, search |
| Stack | Push, pop, peek, display, array implementation, linked-list implementation |
| Queue | Enqueue, dequeue, front, rear, display |
| Circular Queue | Enqueue, dequeue, front, rear, circular wrap-around |
| Linked List | Create, insert at beginning/end/position, delete, search, traverse |
| Doubly Linked List | Create, insert, delete, forward/backward traversal, search |
| Binary Tree | Create, insert, inorder, preorder, postorder, level order |
| Binary Search Tree | Insert, search, delete, inorder, preorder, postorder |
| Heap | Create, insert, heapify, extract max/min, heap sort |
| Graph | Create, add vertex, add edge, BFS, DFS, display |
| Searching | Linear search, binary search |
| Sorting | Bubble, selection, insertion, merge, quick sort |
| Hash Table | Create, insert, search, delete, collision handling |
| Recursion | Factorial, Fibonacci, recursive sum, recursive binary search |

## Supported programming languages

The authenticated Program Editor supports **C, C++, Java, and Python**. C, C++, and Java require the corresponding compiler or JDK to be installed on the backend host. Programs run with a bounded timeout and output limit, and compiler/runtime errors are returned to the editor with diagnostics.

## Architecture

`Login → Program Editor → language executor → output/errors + detected steps → timeline/visualizer`

The natural-language DSA path still uses the allowlisted operation engine. The Program Editor uses a separate subprocess runner in a temporary directory. It never receives application secrets in its environment. A production deployment should run this runner inside a container or OS-level sandbox as well.

The AI/parser layer can only produce allowlisted structured operations. It never executes pasted Python, JavaScript, shell, or model-generated code.

## Run locally

### Backend

Requires Python 3.11+.

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

Requires Node.js 20+.

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend uses `VITE_API_URL` when set, otherwise `http://localhost:8000`.

## Authentication configuration

Email/password signup works locally after the backend starts. To enable Google sign-in:

1. Create a Google OAuth Web Client ID in Google Cloud Console.
2. Add the same client ID to `backend/.env` as `GOOGLE_CLIENT_ID` and `frontend/.env` as `VITE_GOOGLE_CLIENT_ID`.
3. Add `http://localhost:5173` to the OAuth client’s authorized JavaScript origins.
4. Set a private `AUTH_SECRET` in `backend/.env`.

Copy `backend/.env.example` as a starting point. Never commit `.env` or expose `GOOGLE_CLIENT_ID` from the backend secret configuration; the frontend client ID is public by Google design, while the signed app token secret remains backend-only.

## Example commands

- `Create a stack and push 10, 20 and 30.`
- `Pop the top element.`
- `Create a queue and enqueue 1, 2, 3.`
- `Create linked list 10 20 30 and reverse the list.`
- `Create a binary search tree using 50,30,70,20,40,60,80.`
- `Create graph. Connect Pune to Mumbai with weight 2.`

## API highlights

- `GET /api/health`
- `POST /api/ai/parse`
- `POST /api/execute/`
- `POST /api/chat/`
- `POST /api/challenge/`
- `GET|DELETE /api/history`
- `GET /api/progress`, `GET /api/achievements`
- `POST /api/algorithm/run`
- `POST /api/code/analyze`, `POST /api/code/generate`

## Tests and verification

```powershell
cd backend
pytest -q
cd ../frontend
npm run build
```

The frontend production build is currently passing. If Python is not on PATH, install Python 3.11+ and rerun the backend commands.

## GitHub and Vercel deployment

This repository is a two-service application:

- `frontend/` is a Vite React app and can be deployed to Vercel.
- `backend/` is a FastAPI service that must run on a Python-capable host. It executes Python, C, C++, and Java programs in subprocesses, so it is not a static Vercel frontend function.

### Vercel settings

When importing this repository into Vercel, set **Root Directory** to `frontend`.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`frontend/vercel.json` provides the SPA fallback so direct refreshes of `/playground`, `/playground/array`, and other client routes resolve to the React app.

### Environment variables

Frontend (`frontend/.env` locally; Vercel Preview and Production settings):

```text
VITE_API_URL=https://YOUR_BACKEND_DOMAIN
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

`VITE_API_URL` must be the public HTTPS URL of the deployed FastAPI backend. Do not leave it as localhost in Vercel.

Backend (`backend/.env` on the backend host):

```text
DATABASE_URL=YOUR_POSTGRES_CONNECTION_STRING
AUTH_SECRET=YOUR_LONG_RANDOM_SECRET
CORS_ORIGINS=https://YOUR_VERCEL_DOMAIN,https://YOUR_CUSTOM_DOMAIN
GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
AI_PROVIDER=local
AI_API_KEY=
AI_MODEL=
```

For local development, use the values in `backend/.env.example` and `frontend/.env.example`. Never commit `.env` files, database passwords, service-account files, or private keys. Because a database password was previously used during local setup, rotate that password before publishing the repository.

### GitHub commands

Run these from the project root after reviewing `git status`:

```powershell
git init
git add .
git commit -m "Prepare project for production deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

### Vercel process

1. Sign in to Vercel with GitHub.
2. Import the repository.
3. Set Root Directory to `frontend`.
4. Add the frontend environment variables above for Preview and Production.
5. Deploy the frontend.
6. Deploy the FastAPI backend separately and add its public URL as `VITE_API_URL`.
7. Set backend `CORS_ORIGINS` to the Vercel domain.
8. Add the Vercel domain to Google OAuth authorized JavaScript origins if Google login is enabled.
9. Test login, chapter routes, execution, console output, and the `/api/health` endpoint.

### Program Editor

After login, select **Program Editor** in the sidebar. Choose C, C++, Java, or Python, load or paste a program, choose Very Slow through Very Fast, and click **Run Program**. The editor shows stdout, compiler/runtime errors, recognized data-structure steps, and play/pause/previous/next/reset controls.

`POST /api/program/run` executes Python directly and compiles C/C++/Java when the corresponding local toolchain is installed. Java requires `javac` and `java` on PATH. Arbitrary code that cannot be safely mapped to a supported data structure still displays normal program output without a fabricated visualization.

## Current limitations and roadmap

- The local Copilot is a deterministic educational tutor; provider-backed AI is optional.
- Arbitrary code is not given a fabricated visualization when supported operations cannot be recognized safely.
- Google sign-in requires OAuth client configuration.
- The subprocess runner should receive an additional container or OS-level sandbox for untrusted multi-user production workloads.

Planned improvements include stronger isolated execution, richer provider-backed AI explanations, expanded challenge and quiz flows, and additional advanced data structures such as AVL trees.
#   A I - D S - V I S U A L I Z E R - P R O  
 
=======
# AI-DS-VISUALIZER-PRO
>>>>>>> dee278b3234f1cd2577144d62d094588c3d3b1fd
