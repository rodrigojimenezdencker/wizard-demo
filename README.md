# Studio onboarding wizard (demo)

A multi-step onboarding form in React + TypeScript (Vite, no UI libraries). Personal demo project, not client work.

- 4 steps (studio details, plan, optional data, review) with a progress indicator
- Per-step validation with accessible errors (labels, `aria-invalid`, `role="alert"`)
- Progress and answers persist in `localStorage`, so a reload keeps your place
- Responsive down to ~390px

## Limits

No backend; "Finish" only shows a confirmation screen. Checked visually in headless Chromium; not tested with a screen reader.

## Run

    npm install
    npm run dev
