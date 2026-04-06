# Pulse Standup Bot

An AI-powered standup assistant built with Vite, React, TanStack Router, and Tambo.

It guides users through the classic standup flow and can render structured UI components such as:
- `StandupQuestionStepper` for question-by-question progress
- `StandupSummaryCard` for final summary output with copy actions

![Pulse Bot](/public/daily-standup.png)

## Quickstart

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp example.env.local .env.local
```

3. Add your API key in `.env.local`:
```bash
VITE_TAMBO_API_KEY=your_api_key_here
# Optional:
# VITE_TAMBO_URL=https://api.tambo.co
```

You can also run:
```bash
npm run init
```
This uses `npx tambo init` to help with setup.

4. Start the app:
```bash
npm run dev
```

Open `http://localhost:5173`.

## Available Routes

- `/` Home page with setup checklist and links to demos
- `/chat` Main threaded chat experience powered by `TamboProvider`
- `/interactables` Side-by-side chat + settings demo layout

## Project Structure

```text
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── chat.tsx
│   └── interactables.tsx
├── components/
│   ├── StandupQuestionStepper.tsx
│   ├── StandupSummaryCard.tsx
│   ├── tambo/
│   │   ├── message-thread-full.tsx
│   │   └── ...
│   └── ui/card-data.tsx
├── lib/
│   ├── tambo.ts
│   ├── thread-hooks.ts
│   └── use-anonymous-user-key.ts
└── services/population-stats.ts
```

## Scripts

- `npm run dev` Start local dev server
- `npm run build` Type-check and build production bundle
- `npm run preview` Preview production build
- `npm run lint` Run ESLint
- `npm run lint:fix` Run ESLint with auto-fixes
- `npm run init` Run `tambo init`

## How Tambo Is Wired

Core registration lives in `src/lib/tambo.ts`:
- `components`: UI components the model can render
- `tools`: callable functions with Zod input/output schemas

The provider setup lives in:
- `src/routes/chat.tsx`
- `src/routes/interactables.tsx`

Both routes pass:
- `apiKey` from `VITE_TAMBO_API_KEY`
- `userKey` via `useAnonymousUserKey()`
- registered `components` and `tools`

## Extending the Bot

1. Add a new component and Zod schema.
2. Register it in `src/lib/tambo.ts` `components`.
3. Add or update tools in `src/lib/tambo.ts` `tools`.
4. Test the interaction in `/chat` or `/interactables`.

See Tambo docs for details:
- https://docs.tambo.co
- https://docs.tambo.co/concepts/registering-components
- https://docs.tambo.co/concepts/tools
