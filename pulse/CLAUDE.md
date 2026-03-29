@AGENTS.md
# Web Application Architecture Guidelines

> This document defines the architecture, conventions, and non-negotiable rules every AI agent and developer must follow when building or modifying this codebase.

---

## 1. Project Structure

```
src/
├── app/                        # Next.js App Router pages & layouts
│   ├── (auth)/                 # Route groups (no URL segment)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles (Tailwind directives only)
│
├── components/
│   ├── common/                 # ✅ Shared, reusable across the entire app
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavItem.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Input/
│   │   └── ...
│   │
│   └── [feature]/              # ✅ Feature-specific components
│       ├── dashboard/
│       │   ├── StatsCard.tsx
│       │   └── RecentActivity.tsx
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       └── ...
│
├── hooks/                      # Custom React hooks
│   ├── queries/                # React Query hooks (data fetching)
│   │   ├── useUsers.ts
│   │   └── usePosts.ts
│   ├── mutations/              # React Query hooks (data mutations)
│   │   ├── useCreateUser.ts
│   │   └── useUpdatePost.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
│
├── lib/                        # Utilities, helpers, configs
│   ├── utils.ts
│   ├── constants.ts
│   └── prisma.ts               # Prisma client singleton
│
├── services/                   # Raw API fetch functions (no hooks here)
│   ├── users.service.ts
│   └── auth.service.ts
│
├── store/                      # Global UI state only (Zustand / Redux Toolkit)
│   └── uiStore.ts
│
├── types/                      # TypeScript type definitions
│   └── index.ts
│
├── styles/                     # Additional style utilities if needed
│
└── prisma/                     # Prisma schema and migrations (project root level)
    ├── schema.prisma
    └── migrations/
```

---

## 2. Component Placement Rules

### `components/common/` — Shared Components
Place a component here if it is:
- Used in **2 or more** unrelated features or pages
- A foundational UI element (buttons, inputs, modals, cards, layout wrappers)
- Part of the global layout (Navbar, Footer, Sidebar)

**Examples:** `Navbar`, `Footer`, `Button`, `Input`, `Modal`, `Avatar`, `Spinner`, `Badge`, `Tooltip`

### `components/[feature]/` — Feature-Specific Components
Place a component here if it is:
- Only used within **one feature or page**
- Tightly coupled to specific business logic or data

**Examples:** `dashboard/StatsCard`, `auth/LoginForm`, `billing/PricingTable`

### Rule of Promotion
> If a feature component is reused in a second unrelated feature, **move it to `common/` immediately** and update all imports.

---

## 3. File Length Limit

- **Hard maximum: 200 lines per file.**
- If a file is approaching or exceeding 200 lines:
  - Split large components into smaller sub-components
  - Extract logic into a custom hook (`hooks/`)
  - Move constants or static data into `lib/constants.ts`
  - Separate types into `types/`
- The only exception is auto-generated files or configuration files that cannot be split (e.g., `tailwind.config.ts`).

---

## 4. Styling — Tailwind CSS

- **Tailwind CSS is the only styling method allowed.** No inline `style={{}}` objects, no CSS modules, no styled-components.
- All `globals.css` should contain only Tailwind's directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Use `cn()` (from `clsx` + `tailwind-merge`) for conditional class merging:
  ```ts
  // lib/utils.ts
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- Avoid arbitrary values (e.g., `w-[347px]`) unless absolutely necessary. Always prefer design tokens.

---

## 5. Brand Colors — Tailwind Config

All brand colors **must** be defined in `tailwind.config.ts`. Never hardcode hex values inside components.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   "#YOUR_PRIMARY",    // e.g. main CTA color
          secondary: "#YOUR_SECONDARY",  // e.g. accents
          dark:      "#YOUR_DARK",       // e.g. text / backgrounds
          light:     "#YOUR_LIGHT",      // e.g. backgrounds / borders
          muted:     "#YOUR_MUTED",      // e.g. subtle text
        },
      },
      fontFamily: {
        sans: ["Your Font", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Usage in components:**
```tsx
<button className="bg-brand-primary hover:bg-brand-secondary text-white">
  Click me
</button>
```

---

## 6. User Experience — Non-Negotiable

UX is never a trade-off. The following must always be implemented:

### Loading States
Every async action must have a visible loading indicator.
```tsx
{isLoading ? <Spinner /> : <Content />}
```

### Error States
Every data fetch or form submission must handle and display errors gracefully. Never leave the user staring at a blank screen.

### Empty States
If a list or data set can be empty, render a meaningful empty state with a call-to-action.

### Feedback on Actions
- Form submissions → show success/error toast or inline message
- Destructive actions (delete, logout) → require confirmation
- Buttons → disable while loading to prevent double submission

### Accessibility (a11y) Baseline
- All images must have descriptive `alt` text
- Interactive elements must be keyboard-navigable
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>`, etc.)
- Ensure sufficient color contrast (minimum WCAG AA)
- Use `aria-*` attributes where semantic HTML is insufficient

### Responsive Design
- Mobile-first approach. Start with base (mobile) styles and scale up using `sm:`, `md:`, `lg:`, `xl:` breakpoints.
- Test every UI at 375px (mobile), 768px (tablet), and 1280px (desktop) minimum.

---

## 7. Next.js Best Practices

### Server vs. Client Components
- Default to **Server Components**. Only add `"use client"` when the component needs:
  - Browser APIs (`window`, `localStorage`)
  - React hooks (`useState`, `useEffect`, `useRef`)
  - Event listeners
- Keep `"use client"` components as small and as close to the leaf of the tree as possible.

### Routing & Layouts
- Use **Route Groups** `(groupName)/` to organise routes without affecting the URL.
- Use **Layouts** to share UI across pages at the same level (e.g., auth layout, dashboard layout).
- Use **`loading.tsx`** and **`error.tsx`** files per route segment for built-in Suspense and error boundaries.

### Metadata
Every page must export a `metadata` object or `generateMetadata` function:
```ts
export const metadata = {
  title: "Page Title | App Name",
  description: "Clear, concise description for SEO.",
};
```

### Environment Variables
- Server-only secrets: `MY_SECRET_KEY` (no prefix)
- Client-safe variables: `NEXT_PUBLIC_API_URL` (must be prefixed with `NEXT_PUBLIC_`)
- Never expose server secrets to the client.

### Images
- Always use Next.js `<Image />` from `next/image` instead of `<img>`.
- Define allowed external domains in `next.config.ts`.

### Fonts
- Use `next/font` to load fonts. Never use `<link>` tags in the `<head>`.
```ts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

### Performance
- Use `next/dynamic` for heavy components or third-party libraries that don't need SSR:
  ```ts
  const HeavyChart = dynamic(() => import("@/components/common/Chart"), {
    ssr: false,
    loading: () => <Spinner />,
  });
  ```
- Avoid large `useEffect` chains for data fetching — prefer Server Components.

### API Routes
- Place all API handlers in `app/api/[route]/route.ts`.
- Validate all incoming request bodies before processing.
- Always return consistent response shapes:
  ```ts
  // Success
  return NextResponse.json({ data: result }, { status: 200 });

  // Error
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  ```

---

## 8. API Calls — Hooks & React Query

### Core Rule
**Never call an API directly inside a component.** All data fetching and mutations must go through a custom hook. React Query is the preferred tool for all server-state management.

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Service function** | `services/` | Raw `fetch` / Prisma call. No React. Returns typed data. |
| **Query / Mutation hook** | `hooks/queries/` or `hooks/mutations/` | Wraps the service in `useQuery` or `useMutation`. |
| **Component** | `components/` | Calls the hook. Handles UI states only. |

### Setup — QueryClientProvider

Wrap the app once in the root layout:
```tsx
// app/providers.tsx  ("use client")
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

### Query Hook Pattern (fetching data)
```ts
// hooks/queries/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users.service";
import type { User } from "@/types";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}
```

```tsx
// Component usage
const { data: users, isLoading, isError } = useUsers();
```

### Mutation Hook Pattern (create / update / delete)
```ts
// hooks/mutations/useCreateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/users.service";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch the users list automatically
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

```tsx
// Component usage
const { mutate: addUser, isPending } = useCreateUser();
<button disabled={isPending} onClick={() => addUser({ name: "Alice" })}>
  {isPending ? "Saving..." : "Add User"}
</button>
```

### Service Function Pattern
Service functions are plain async functions — no React, no hooks.
```ts
// services/users.service.ts
import type { User, CreateUserInput } from "@/types";

export async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}
```

### Query Key Conventions
Use consistent, hierarchical query keys:
```ts
["users"]                        // all users
["users", userId]                // single user
["users", userId, "posts"]       // posts belonging to a user
```

### Rules Summary
- ✅ Always use `useQuery` for GET operations
- ✅ Always use `useMutation` for POST / PUT / PATCH / DELETE
- ✅ Always invalidate related query keys after a successful mutation
- ✅ Always handle `isLoading` / `isPending` and `isError` states in the component
- ❌ Never use `useEffect` + `fetch` for data fetching
- ❌ Never store server data in `useState` — that's React Query's job

---

## 9. Database — Prisma & PostgreSQL

### Overview
- **Prisma** is the only ORM. No raw SQL strings in application code.
- **PostgreSQL** is the only supported database.
- All database access happens **server-side only** — in API routes, Server Components, or Server Actions.
- Never import Prisma into a Client Component or expose it to the browser.

### Prisma Client Singleton
Instantiate Prisma once to avoid connection exhaustion in development:
```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Always import from `@/lib/prisma`, never `new PrismaClient()` directly.

### Schema Conventions (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  body      String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
```

**Schema rules:**
- Always use `cuid()` or `uuid()` for primary keys — never auto-increment integers exposed publicly
- Always include `createdAt` and `updatedAt` on every model
- Use `@updatedAt` on the `updatedAt` field so Prisma manages it automatically
- Relation field names must be descriptive (`authorId`, not just `userId`)

### Environment Variables
```env
# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
```

Never commit `.env` to version control. Always add it to `.gitignore`.

### Using Prisma in API Routes
```ts
// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }, // never expose passwords or secrets
  });
  return NextResponse.json({ data: users });
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  return NextResponse.json({ data: user }, { status: 201 });
}
```

### Migration Workflow
```bash
# After editing schema.prisma:
npx prisma migrate dev --name describe_your_change

# Apply migrations in production:
npx prisma migrate deploy

# Regenerate the Prisma client after schema changes:
npx prisma generate

# Inspect your database visually:
npx prisma studio
```

### Rules Summary
- ✅ Always use the singleton from `@/lib/prisma`
- ✅ Always use `select` or `include` — never return entire rows blindly
- ✅ Always validate request bodies before passing to Prisma
- ✅ Always run `prisma generate` after any schema change
- ✅ Never call Prisma from Client Components or hooks that run in the browser
- ❌ Never write raw SQL unless using `prisma.$queryRaw` for a specific unavoidable case
- ❌ Never commit migration files without testing them locally first

---

## 10. TypeScript Rules

- **Strict mode is always on.** No `any` types allowed.
- Define all props with explicit interfaces or types:
  ```ts
  interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
    isLoading?: boolean;
  }
  ```
- Co-locate component-specific types at the top of the file. Shared types go in `types/`.

---

## 11. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfileCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuthStore.ts` |
| Utilities / Helpers | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS classes | Tailwind only | `className="flex items-center"` |
| API routes | kebab-case | `/api/user-profile` |
| Folders | kebab-case | `components/common/date-picker/` |

---

## 12. Component Structure Template

Every component file should follow this structure:

```tsx
// 1. Imports
import { cn } from "@/lib/utils";

// 2. Types
interface Props {
  title: string;
  className?: string;
}

// 3. Component
export default function ExampleCard({ title, className }: Props) {
  // 4. Hooks & state (if "use client")

  // 5. Derived values / handlers

  // 6. Render
  return (
    <div className={cn("rounded-lg bg-white p-4 shadow-sm", className)}>
      <h2 className="text-brand-dark text-lg font-semibold">{title}</h2>
    </div>
  );
}
```

---

> **Remember:** Clean architecture is not about perfection on day one — it's about making the codebase easy to understand, extend, and hand off. Follow these rules consistently and the project will scale gracefully.
