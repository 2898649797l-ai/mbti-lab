# Repository instructions

## Project status and cross-device handoff

- Read `PROJECT_STATUS.md` and `CLAUDE.md` before working. `PROJECT_STATUS.md` is the canonical current project and progress record; historical release documents remain evidence, not a substitute for the current state.
- Every change to project code, content, tests, dependencies, configuration, workflows, or other documentation MUST include a meaningful update to `PROJECT_STATUS.md` in the same commit or pull request. Record the date, behavior or architecture changes, actual validation, remaining work, and a change/handoff entry. A date-only edit is insufficient.
- Before ending work or moving devices, commit and push the implementation and its status record together within the user's authorized scope. If work is incomplete, record the branch/PR, changed areas, concrete blocker, and next action. Never claim upload, merge, deployment, tests or real-device checks succeeded without evidence.
- Treat existing uncommitted changes as user work and preserve them. Check the working tree and remote state before updating; never use a hard reset or overwrite files to solve a handoff.
- Never put credentials, account sessions, personal assessment answers or results into this public repository. Browser storage does not synchronize through Git.

## Implementation constraints

- Vue 3, Vite, Hash Router; Node24. Use the lockfile with `npm ci`. Relevant validation: `npm test -- --run`, `npm run build`, and `git diff --check`. No separate lint toolchain.
- Mobile first, 320–430px coverage and 480px centered desktop shell. Every new UI/content field needs Chinese and English.
- Preserve original 60/93-question scoring and `{ type, percents }` result compatibility. Independent scene quiz drafts/results must stay isolated by test ID.
- Published `src/data/reportVersions/r1.json` and `src/data/scenes/v1.js` are versioned compatibility contracts. Create a new version for changed published content and keep old dictionaries available.
- No new production dependencies, backend APIs, databases, accounts, payments or analytics without a new user instruction. Follow snapshot field consent, preview and QR destination rules described in `PROJECT_STATUS.md`.
- Distinguish automated tests, desktop narrow-screen checks, user feedback, production browser checks and real phone/WeChat checks. Preserve paused or unresolved acceptance/source-permission items until there is evidence of completion or a new user decision.
