# Project guidance

Vue 3 / Vite / Hash Router, bilingual Chinese and English. Use Node24, npm ci, npm test -- --run, npm run build. No separate lint toolchain. Cloudflare Pages production tracks main; .github/workflows/mobile-checks.yml verifies tests and build.

## Architecture

Original personality flow remains /test and /result with 60/93 questions, src/composables/useTest.js and original storage keys. Keep its scoring and result compatibility. Detailed reports use editorial scenes plus dimension interpretations; src/data/reportVersions/r1.json is the immutable dictionary for shared snapshots.

/profile selects public fields; /p/:payload reads a versioned Base64URL JSON snapshot without writing assessment storage; /compare accepts manual types or same-site snapshots. Shared scores are opt-in and no compatibility percentage is calculated. Keep full URLs <=2000 characters, names <=20 Unicode characters, and never encode answers.

/explore lists three scene quizzes; /quiz/:testId and its /result implement independent drafts and latest results. src/data/testRegistry.js records definitions and scoring/report adapters. src/data/scenes/v1.js stays immutable after release. Forward/reverse six-item axes normalize to0–100;45–55 retains the middle.

New production dependencies, APIs, databases and analytics are outside the current scope. Images use existing html2canvas/QRCode. PosterExporter previews the exact content and QR target; default is home and snapshot destinations require preview. Changed inputs invalidate prior images and approved destinations.

Every new UI/content field needs zh and en. User device feedback is separate from desktop Chromium checks. Do not mark unperformed mobile/WeChat/network/participant tests or unresolved source permissions as passed. Status and rollback records are in docs/CONTENT_SOCIAL_RELEASE.md.
