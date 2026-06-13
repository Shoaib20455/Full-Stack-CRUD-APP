# 🚀 Next.js Task Manager

A full-stack CRUD application for managing tasks with advanced search, filtering, and pagination. Built with Next.js, PostgreSQL, and Prisma with multi-tenant data isolation.

---

## 🛠️ Technologies

| Category | Stack |
|----------|-------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, Shadcn UI |
| **Backend** | Next.js Server Actions, API Routes |
| **Database** | Neon PostgreSQL, Prisma ORM |
| **Authentication** | Clerk (Multi-tenant) |
| **CMS** | Payload CMS (Admin Dashboard) |
| **Language** | TypeScript |

---

## ✨ Features

✅ **Full CRUD Operations** - Create, read, update, delete tasks  
✅ **Multi-Tenant Isolation** - Each user sees only their own tasks  
✅ **Database Relations** - Todo-to-Category one-to-many relationships  
✅ **Search & Filter API** - Text search + category filtering via `/api/todos`  
✅ **URL Query State** - Persistent filtering (`?search=X&category=Y&page=Z`)  
✅ **Pagination** - 5 tasks per page for optimized performance  
✅ **Data Access Layer** - Separated query logic in `lib/data/todos.ts` for reusability  
✅ **FormData Server Actions** - Native form submission to server actions  
✅ **Admin Dashboard** - Payload CMS for collection management  
✅ **Type Safety** - Full TypeScript + auto-generated types  

---

## ⌨️ Keyboard Shortcuts

Currently no keyboard shortcuts implemented. Add custom shortcuts for:
- `Ctrl + K` or `Cmd + K` - Quick task search
- `Ctrl + N` or `Cmd + N` - New task
- `Esc` - Close modals/dropdowns

---

## 🏗️ How It Was Built

**Architecture Decisions:**

1. **Next.js App Router** - For file-based routing and server components
2. **Server Actions** - For secure CRUD operations with built-in auth checks
3. **FormData API** - Server actions accept native FormData from HTML forms
4. **Prisma ORM** - For type-safe database queries and relations
5. **Data Access Layer** - Separated query logic in `lib/data/` for reusability
6. **URL-based State** - Query parameters (`searchParams`) instead of context for filtering
7. **Pagination** - Prisma `take` + `skip` for chunked data loading
8. **Payload CMS** - Separate admin panel with GraphQL + REST APIs

**Data Flow:**
```
HTML Form (native FormData)
    ↓
Server Action (createTodo)
    ↓
Data Access Layer (lib/data/todos.ts)
    ↓
Prisma ORM Query
    ↓
PostgreSQL Database
    ↓
revalidatePath() → UI Re-renders
```

**Component Flow:**
```
SearchInput (client) → Updates URL params
                    ↓
page.tsx (server) → Reads searchParams
                    ↓
Hero.tsx (server) → Imports data layer functions
                    ↓
getFilteredTodos() → Builds Prisma query
                    ↓
Database → Returns paginated filtered results
```

**Key Implementation:**
- **Data Access**: `getFilteredTodos()` and `getCategories()` in `lib/data/todos.ts`
- **FormData**: `createTodo(formData: FormData)` extracts fields using `.get()`
- **Relations**: Todo ↔ Category via foreign key (optional)
- **Filtering**: Dynamic Prisma where clauses (search + category)
- **Pagination**: Calculate `skip = (page - 1) * 5`
- **Security**: Clerk auth + userId filtering on every query

---

## 🚀 Quick Start

### 1. Install & Setup

```bash
git clone <repo-url> && cd <project>
npm install
```

### 2. Environment Variables

Create `.env.local`:
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PAYLOAD_SECRET=random-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Database & Types

```bash
npx payload generate:types
npx prisma db push
npx prisma generate
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📍 Access Points

| URL | Purpose |
|-----|---------|
| [localhost:3000](http://localhost:3000) | Main dashboard |
| [localhost:3000/admin](http://localhost:3000/admin) | Admin panel |
| [localhost:3000/api/todos](http://localhost:3000/api/todos) | Search API |

---

## 📖 More Details

See [PROJECT_EXP.md](PROJECT_EXP.md) for detailed file structure, architecture, and feature explanations.
