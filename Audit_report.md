# Performance Audit

## 🔴 Critical — Fix Now

| # | Issue | File | Why |
|---|-------|------|-----|
| 1 | Missing index on userId | `prisma/schema.prisma:9` | Every query filters by `userId` with a full table scan. Add `@@index([userId])` to the Todo model. |
| 2 | getTodoStats fetches ALL todos just to count | `src/lib/data/todos.ts:59-63` | Uses `findMany` + JS filter instead of two parallel `db.todo.count()` queries. With 10K todos this fetches 10K rows for 2 numbers. |
| 3 | Categories cache never invalidated | `src/lib/data/todos.ts:17` | `revalidateCategories()` exists but is never called. When admin creates categories via Payload, they never appear until server restart. |

---

## 🟠 High Priority

| # | Issue | File | Fix |
|---|-------|------|-----|
| 4 | ~21 MB dead dependencies | `package.json:14-16, 24-25` | Remove `drizzle-orm`, `drizzle-kit`, `@neondatabase/auth`, `@neondatabase/auth-ui`, `@neondatabase/serverless`, `graphql`. Move `shadcn` to devDeps. |
| 5 | lucide-react full bundle (~29 MB) | `package.json:26` | Tree-shake is automatic with ESM, but verify unused icons aren't bundled. Import only what you use. |
| 6 | Clerk middleware runs on Payload routes | `src/proxy.ts:9-17` | Exclude `/admin`, `/api/graphql` from the matcher to avoid redundant auth checks. |
| 7 | getTodoById not cached | `src/app/(app)/actions.ts:70` | Detail page hits DB on every visit. Add `"use cache"` with `cacheTag('todos-${userId}')`. |

---

## 🟡 Medium Priority

| # | Issue | File | Fix |
|---|-------|------|-----|
| 8 | Missing error.tsx and loading.tsx | `src/app/(app)/` | Any unhandled error crashes to white screen. Add error boundaries. |
| 9 | Redundant Sprout import | `src/components/Navbar.tsx:4` | Imported but never used — dead code bytes. |
| 10 | BuyOurServices.tsx uses client hook unnecessarily | `src/components/BuyOurServices.tsx:1` | Could be a server component using `auth()` from `@clerk/nextjs/server` — middleware already protects this route. |
| 11 | No @db.VarChar length on userId/title | `prisma/schema.prisma:11-12` | Add `@db.VarChar(255)` for storage efficiency and index performance. |
| 12 | Missing partial index on [userId, completed] | `prisma/schema.prisma:13` | `getTodoStats` filters on `completed` — a composite index speeds it up. |

---

## 🟢 Low Priority

| # | Issue | File | Fix |
|---|-------|------|-----|
| 13 | No font display property | `src/app/(app)/layout.tsx:10-18` | Defaults to `swap` (FOUT). Use `display: 'optional'` for zero layout shift. |
| 14 | Skip/take pagination is O(n) for deep pages | `src/lib/data/todos.ts:28` | OFFSET pagination gets slower on page 100+. For 5 items/page it's fine unless you have 500+ pages. |
| 15 | GraphQL Playground exposed | `src/app/(payload)/api/graphql-playground/route.ts` | Remove or guard in production — exposes schema. |
| 16 | Duplicate auth() calls per page load | `page.tsx:10` + `TodoListInner.tsx:28` + `StatsPage:7` | Call once and pass down — each call does a lookup. |

---

## ⚡ Quick Wins — Do Right Now

**1. Add indexes to `prisma/schema.prisma`:**

```prisma
@@index([userId])
@@index([userId, completed])
```

**2. Fix `getTodoStats`:**

```ts
const [totalCount, completedCount] = await Promise.all([
  db.todo.count({ where: { userId } }),
  db.todo.count({ where: { userId, completed: true } })
]);
```

**3.** Clean up `package.json` — remove unused deps and run `npm prune`

**4.** Wire `revalidateCategories` — call it from a Payload CMS hook on Categories collection, or from a manual admin action

**5.** Add `error.tsx` and `loading.tsx` files for basic UX resilience

---

*Build · Big Pickle · 3m 28s*