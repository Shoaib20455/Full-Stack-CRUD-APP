# Project Explanation & File Structure

## 🎯 Project Overview

A full-stack CRUD application for task/todo management with multi-tenant data isolation. Users can create, read, update, and delete tasks securely. Each user can only see and manage their own tasks through Clerk Authentication.

**Key Characteristics:**
- Built with Next.js (App Router) + Prisma ORM + Neon PostgreSQL
- Payload CMS integration for admin dashboard
- Server-side security with Clerk auth checks
- Parallel routes for responsive sidebar analytics
- Type-safe with auto-generated TypeScript types

---

## 📁 Complete File Structure

```plaintext
Full Stack CRUD APP/
│
├── src/
│   ├── app/
│   │   ├── actions.ts                      # Server Actions (CREATE, READ, UPDATE, DELETE with auth checks)
│   │   ├── page.tsx                        # Landing page (login/redirect logic)
│   │   ├── middleware.ts                   # Clerk route protection
│   │   │
│   │   ├── (app)/                          # Route Group for authenticated app routes
│   │   │   ├── layout.tsx                  # Main layout with grid (children + @stats slots)
│   │   │   ├── page.tsx                    # Dashboard - todo list & CRUD interface
│   │   │   │
│   │   │   ├── @stats/                     # Parallel Route Slot for analytics
│   │   │   │   ├── page.tsx                # Shows completed/pending task counts
│   │   │   │   ├── default.tsx             # Fallback for nested routes (returns null)
│   │   │   │   ├── db-info/                # Reserved for expansion
│   │   │   │   └── quick-view/             # Reserved for expansion
│   │   │   │
│   │   │   ├── todo/[id]/                  # Dynamic route for individual todo
│   │   │   │   └── page.tsx                # Detail page - displays single todo info
│   │   │   │
│   │   │   ├── BuyOurServices/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css                 # Global Tailwind styles
│   │   │   └── test.css
│   │   │
│   │   └── (payload)/                      # Route Group for Payload CMS
│   │       ├── layout.tsx                  # Payload root layout
│   │       ├── custom.scss                 # Admin panel styles
│   │       └── admin/
│   │           ├── [[...segments]]/        # Catch-all for admin routes
│   │           │   ├── page.tsx            # Admin dashboard (auto-generated)
│   │           │   └── not-found.tsx
│   │           └── importMap.js            # Component mapping
│   │
│   ├── collections/                        # Payload CMS Collection Configs
│   │   ├── Users.ts                        # Auth users (Payload built-in)
│   │   ├── Media.ts                        # File uploads collection
│   │   ├── Todos.ts                        # Todo collection with fields & relations
│   │   └── Categories.ts                   # Category collection (for organizing todos)
│   │
│   ├── components/                         # React Components
│   │   ├── Hero.tsx                        # Main CRUD interface
│   │   ├── Navbar.tsx                      # Sticky navigation bar
│   │   ├── BuyOurServices.tsx              # Service section
│   │   ├── ModeToggle.tsx                  # Dark/Light theme toggle
│   │   ├── theme-provider.tsx              # Theme context wrapper
│   │   └── ui/
│   │       └── button.tsx                  # Shadcn UI button component
│   │
│   ├── lib/
│   │   ├── db.ts                           # Prisma Client singleton
│   │   └── utils.ts                        # Utility functions
│   │
│   ├── payload.config.ts                   # Payload CMS configuration (collections, db, editor)
│   ├── payload-types.ts                    # ⚠️ AUTO-GENERATED - don't edit
│   └── proxy.ts                            # Payload proxy setup
│
├── prisma/
│   └── schema.prisma                       # Database schema (Todo, Category models with relations)
│
├── public/                                 # Static assets
│
├── Configuration Files
│   ├── next.config.ts                      # Next.js config
│   ├── tsconfig.json                       # TypeScript config
│   ├── tailwind.config.ts                  # Tailwind CSS config
│   ├── postcss.config.mjs                  # PostCSS config
│   ├── eslint.config.mjs                   # ESLint rules
│   ├── components.json                     # Shadcn UI registry
│   ├── drizzle.config.ts                   # Drizzle ORM config (alternative)
│   └── package.json                        # Dependencies & scripts
│
└── Documentation
    ├── README.md                           # Quick setup guide
    ├── PROJECT_EXP.md                      # This file
    ├── AGENTS.md                           # AI agent rules
    └── CLAUDE.md                           # Claude AI instructions
```

---

## 🔄 Parallel Routes (@stats Slot)

The `@stats` folder is a **parallel route** - it renders independently alongside main content in the same layout.

```typescript
// layout.tsx receives both children and stats
export default function RootLayout({ children, stats }) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">{children}</div>  {/* Main content */}
      {stats}                                          {/* Stats sidebar */}
    </main>
  );
}
```

**Behavior:**
- Route `/app` → Shows `@stats/page.tsx` (analytics sidebar visible)
- Route `/app/todo/1` → Shows `@stats/default.tsx` (returns null, sidebar hidden)

---

## 🗄️ Database Models

### Todo Model (Prisma)
```prisma
model Todo {
  id        Int       @id @default(autoincrement())
  userId    String                          // Clerk user ID (for data isolation)
  title     String                          // Task title
  completed Boolean   @default(false)       // Task status
  categoryId Int?                           // FK to Category
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  category  Category? @relation(...)        // Many-to-one: Many todos, one category
  @@map("todo")                             // PostgreSQL table name
}
```

### Category Model (Prisma)
```prisma
model Category {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  todos Todo[]                              // One-to-many: One category, many todos
  @@map("category")
}
```

### Payload Collections
- **Todos** - Maps to Prisma Todo model, REST API at `/api/todos`
- **Categories** - Maps to Prisma Category model
- **Users** - Payload's built-in auth collection (admin login)
- **Media** - File upload collection

---

## 🔒 Security Model

### Multi-Tenant Data Isolation
Every database query filters by current user's ID:

```typescript
// ✅ Server Action: Only return current user's todos
export async function getTodos() {
  const { userId } = await auth();  // Get Clerk user ID
  if (!userId) return [];
  
  return db.todo.findMany({
    where: { userId }  // Filter: WHERE userId = current_user_id
  });
}
```

### Authentication Flow
1. User logs in via Clerk (handled in layout with ClerkProvider)
2. Middleware checks auth status and redirects accordingly
3. Every server action calls `auth()` to verify user
4. Database query includes `where: { userId }` filter
5. User can only access/modify their own data

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | UI & page routing |
| **Styling** | Tailwind CSS + Shadcn UI | Component styles |
| **Backend** | Next.js Server Actions | Secure CRUD operations |
| **ORM** | Prisma | Database access layer |
| **CMS** | Payload CMS | Admin dashboard + collections |
| **Database** | Neon PostgreSQL | Data persistence |
| **Auth** | Clerk | User authentication |
| **Types** | TypeScript | Type safety |

---

## 📊 How It Works

### Creating a Todo
1. User enters title in Hero component
2. Component calls `createTodo()` server action
3. Server action: checks auth → validates input → inserts to DB with userId
4. Payload stores to PostgreSQL via Prisma
5. `revalidatePath()` refreshes UI
6. New todo appears in list

### Viewing Todo Details
1. User clicks todo title → navigates to `/app/todo/{id}`
2. Page fetches that specific todo by ID
3. Database query includes `where: { id, userId }` (security check)
4. 404 if todo doesn't exist or doesn't belong to user
5. `@stats` slot renders `default.tsx` (hides sidebar)

### Updating Todo Status
1. User clicks checkbox to toggle completed status
2. Calls `toggleTodo(id, completed)` server action
3. Server verifies user owns todo → updates in DB
4. Cache invalidated → UI refreshes

---

## 🚀 Development Keys

**File Purposes:**
- `actions.ts` - All database operations with auth checks
- `layout.tsx` - Grid layout positioning children + stats
- `@stats/` - Independent sidebar analytics
- `collections/` - Payload CMS data model configs
- `prisma/schema.prisma` - Database table definitions
- `payload.config.ts` - Payload CMS setup & admin config
- `middleware.ts` - Route protection logic

**Key Concepts:**
- **Server Actions** - Backend functions that run on server, called from client
- **Parallel Routes** - Multiple slots (`@children`, `@stats`) render independently
- **Route Groups** - `(app)` and `(payload)` organize routes without URL changes
- **Type Safety** - Types auto-generated from Prisma schema and Payload collections
- **Data Isolation** - Every query filters by `userId` - users see only their data
