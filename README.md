# sobes-2

Standalone copy of the current StageOne landing page, prepared for sharing with Claude Design as a separate project.

## What's inside

- `src/views/Landing.vue` — main landing composition (hero + all dynamic sections).
- `src/components/landing/*` — all section modules and shared UI blocks.
- `src/router/index.js` — minimal routes for `/`, `/login`, `/register`.
- `src/views/LoginStub.vue` and `src/views/RegisterStub.vue` — simple placeholder pages so links work.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Claude Design handoff

Use these files as the primary context:

1. `src/views/Landing.vue`
2. `src/components/landing/`
3. `DESIGN_BRIEF.md`

If Claude Design asks for project entrypoint, point to `src/views/Landing.vue`.
