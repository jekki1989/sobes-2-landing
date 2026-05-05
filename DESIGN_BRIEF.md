# Design Brief (for Claude Design)

## Goal

Edit and iterate on the StageOne landing page design while preserving its existing section logic and interactions.

## Entry point

- Main page: `src/views/Landing.vue`
- Section modules: `src/components/landing/*.vue`
- Shared section scaffolding and effects: `src/components/landing/shared/*.vue`

## Visual direction

Keep a clean light palette based on:

- White: `#ffffff`
- Blue: `#2a3fe0` and `#1f30b5`
- Gray text: `#2b2f44`, `#5a5f78`
- Product Hunt badge accent only: `#e85a6b` on `#fff5f5`

Avoid neon/purple/orange-heavy gradients for the section themes.

## Constraints

- Preserve current section order and IDs (`hero`, `pain`, `demo`, `pipeline`, `modes`, `avatar-lab`, `audience`, `roi`, `compare`, `security`, `pricing`, `faq`).
- Preserve core interactivity (sliders, toggles, compare drag, counters, tabs, stage switching).
- Keep responsive behavior for desktop and mobile.
- Keep semantic structure and existing content intent.

## Routing notes

This export includes simple stubs for `/login` and `/register` so all CTA links are valid in standalone mode.
