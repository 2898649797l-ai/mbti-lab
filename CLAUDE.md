# Project guidance

Read `AGENTS.md` and `PROJECT_STATUS.md` first. `PROJECT_STATUS.md` is the canonical project state and cross-device handoff record. Every change to code, content, tests, dependencies, configuration, workflows or other documentation must meaningfully update it in the same commit or PR: date, changed behavior, actual validation, remaining work and a handoff/change entry. Update it before ending work or switching devices; preserve user changes and never record unperformed checks as passed. The CI documentation check detects a missing update but does not write the record for you.

Vue 3 / Vite / Hash Router, bilingual Chinese and English. Use Node24, npm ci, npm test -- --run, npm run build. No separate lint toolchain. Cloudflare Pages production tracks main; .github/workflows/mobile-checks.yml verifies tests and build.

## Architecture

Original personality flow remains /test and /result with 60/93 questions, src/composables/useTest.js and original storage keys. Keep its scoring and result compatibility. Active reports use src/data/reportContentR2.js plus dimension interpretations; src/data/reportVersions/r1.json and r2.json are immutable shared dictionaries. New snapshots use r2 while old r1 links retain their text. Freeze a new version for further published content changes.

/profile selects public fields; /p/:payload reads a versioned Base64URL JSON snapshot without writing assessment storage; /compare accepts manual types or same-site snapshots. Shared scores are opt-in and no compatibility percentage is calculated. Keep full URLs <=2000 characters, names <=20 Unicode characters, and never encode answers.

/explore lists three scene quizzes; /quiz/:testId and its /result implement independent drafts and latest results. All questionnaires advance after 280ms with locked feedback, and cancel pending timers on route changes or unmount. /me lists local drafts first and the latest result per test, dated entries before undated old results. src/data/testRegistry.js records definitions and scoring/report adapters. src/data/scenes/v1.js stays immutable after release. Forward/reverse six-item axes normalize to0–100;45–55 retains the middle.

New production dependencies, APIs, databases and analytics are outside the current scope. ShareSheet / PosterExporter and SocialPoster are the shared image flow/template for personality, public profile, pair and scene results, using existing html2canvas/QRCode. PosterExporter previews the exact content and QR target; default is home and all snapshot destinations (including supplied links) require preview. Changed inputs invalidate prior images and approved destinations. Report pages use a contents/share dock, questionnaire pages hide navigation, and main pages use test/explore/results tabs.

Every new UI/content field needs zh and en. User device feedback is separate from desktop Chromium checks. Do not mark unperformed mobile/WeChat/network/participant tests or unresolved source permissions as passed. Status and rollback records are in docs/CONTENT_SOCIAL_RELEASE.md.
