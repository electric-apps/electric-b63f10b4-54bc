# Todo App

A reactive, real-time todo list built with Electric SQL and TanStack DB. Todos sync instantly across all connected browser tabs and clients.

## Features

- Add new todos with a text input
- Mark todos as complete / incomplete with a checkbox
- Delete individual todos
- Filter by: All, Active, or Completed
- Clear all completed todos at once
- Real-time sync across browser tabs via Electric SQL
- Optimistic mutations for instant UI feedback

## Tech Stack

- **Electric SQL** — Postgres-to-client sync via shapes
- **TanStack DB** — Reactive collections and optimistic mutations
- **Drizzle ORM** — Schema definitions and migrations
- **TanStack Start** — React meta-framework with SSR
- **Radix UI Themes** — Component library

## Getting Started

```bash
pnpm install
pnpm dev:start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Stop dev server
pnpm dev:stop
```

## License

MIT
