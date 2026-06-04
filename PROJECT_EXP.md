# Project Explanation & File Structure

## 🎯 Project Overview

A full-stack CRUD application for task/todo management with multi-tenant data isolation, advanced filtering, and URL-based state persistence. Users can create, read, update, and delete tasks securely while organizing them with categories. Each user can only see and manage their own tasks through Clerk Authentication.

**Key Characteristics:**
- Built with Next.js (App Router) + Prisma ORM + Neon PostgreSQL
- **Database Relations**: Todo-to-Category relationship with relational filtering
- **Search & Filter API**: RESTful endpoint with text search and category-based filtering
- **URL Query State**: Client-side state management via query parameters for persistent filtering
- **Page Optimization**: Pagination with 5 tasks per page for improved performance
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
│   │   │   ├── page.tsx                    # Dashboard - accepts search & category URL params
│   │   │   ├── actions.ts                  # Server actions for CRUD operations
│   │   │   ├── favicon.ico                 # App favicon
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
│   │   │   │   └── page.tsx                # Service showcase page
│   │   │   │
│   │   │   ├── globals.css                 # Global Tailwind styles
│   │   │   └── test.css                    # Test styles
│   │   │
│   │   ├── api/                            # API Routes (Search & Filter)
│   │   │   ├── todos/
│   │   │   │   └── route.ts                # 🚀 GET: Search & filter todos by title & category
│   │   │   └── graphql/
│   │   │       └── route.ts                # GraphQL endpoint
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
│   │   ├── Hero.tsx                        # Main CRUD interface + filtered todo display
│   │   ├── SearchInput.tsx                 # 🚀 Client component for URL query state management
│   │   ├── Navbar.tsx                      # Sticky navigation bar
│   │   ├── BuyOurServices.tsx              # Service section
│   │   ├── ModeToggle.tsx                  # Dark/Light theme toggle
│   │   ├── theme-provider.tsx              # Theme context wrapper
│   │   └── ui/
│   │       └── button.tsx                  # Shadcn UI button component
│   │
│   ├── lib/
│   │   ├── db.ts                           # Prisma Client singleton
│   │   ├── utils.ts                        # Utility functions
│   │   └── data/
│   │       └── todos.ts                    # 🎯 Data access layer (Prisma queries)
│   │
│   ├── payload.config.ts                   # Payload CMS configuration (collections, db, editor)
│   ├── payload-types.ts                    # ⚠️ AUTO-GENERATED - don't edit
│   └── proxy.ts                            # Payload proxy setup
│
├── prisma/
│   └── schema.prisma                       # Database schema (Todo + Category with FK relations)
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

## 🚀 Major Features & Upgrades

### 1. **Database Relations** 📊
The project now features a **one-to-many relationship** between Todos and Categories:

**Database Schema (Prisma):**
```prisma
model Todo {
  id        Int      @id @default(autoincrement()) 
  userId    String   @map("user_id")               
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at") 
  updatedAt DateTime @updatedAt @map("updated_at")
  
  categoryId Int?      @map("category_id") // Foreign key
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  
  @@map("todo") 
}

model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  slug      String   @unique // Used in URL queries
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  todos     Todo[]
  
  @@map("category") 
}
```

**Key Benefits:**
- Each todo can be organized under a category
- Enforced data integrity with foreign key constraints
- Cascading delete/null on category removal (`onDelete: SetNull`)
- Category slug enables clean URL-based filtering

---

### 2. **Search & Filter API** 🔍
A dedicated REST API endpoint for searching and filtering todos:

**Endpoint:** `GET /api/todos`

**Query Parameters:**
- `search` - Text search within todo titles (case-insensitive)
- `category` - Filter by category slug

**Example Requests:**
```
/api/todos?search=meeting
/api/todos?category=urgent
/api/todos?search=project&category=critical
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Review project proposal",
      "completed": false,
      "categoryId": 2,
      "category": {
        "name": "Urgent",
        "slug": "urgent"
      }
    }
  ]
}
```

**Implementation Details:**
- Server-side filtering with Prisma dynamic where clauses
- Case-insensitive text search using `contains` + `insensitive` mode
- Relationship-based filtering via category slug matching
- Ordered by creation date (newest first)

---

### 3. **Frontend URL Query State** 🌐
URL parameters are used to persist filter state in the browser, enabling:
- Shareable filtered views
- Browser history navigation
- Bookmark-able filter combinations

**How It Works:**

**SearchInput Component** (`src/components/SearchInput.tsx`):
```typescript
"use client";
export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleSearch = (text: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (text) params.set("search", text);
    else params.delete("search");
    router.push(`?${params.toString()}`);
  };
  
  const handleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    router.push(`?${params.toString()}`);
  };
}
```

**Page Component** (`src/app/(app)/page.tsx`):
```typescript
interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { userId } = await auth();
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const categorySlug = resolvedParams?.category || "";
  
  // Pass to Hero component for rendering filtered results
  return <Hero searchParams={searchParams} />;
}
```

**Example URLs:**
- `/?search=meeting` - Show todos with "meeting" in title
- `/?category=urgent` - Show urgent category todos
- `/?search=bug&category=critical` - Combined filters

**Benefits:**
- ✅ State persists on page reload
- ✅ Filters can be shared via URL
- ✅ Browser back/forward button works correctly
- ✅ Deep linking to filtered views
- ✅ Clean, readable query parameter structure

---

### 4. **Page Optimization (Pagination)** ⚡
Tasks are displayed with pagination to optimize performance and reduce initial load time:

**Implementation:**
```typescript
// Hero.tsx - Page and limit from URL params
const page = Number(resolvedParams?.page) || 1;  // Default page 1
const limit = 5;                                   // 5 tasks per page
const skip = (page - 1) * limit;                  // Offset calculation

// Prisma query with pagination
const todos = await db.todo.findMany({
  where: whereClause,
  take: limit,  // Fetch only 5 tasks
  skip: skip,   // Skip based on page number
  include: { category: { select: { name: true, slug: true } } },
  orderBy: { createdAt: "desc" }
});
```

**How It Works:**
- **Page Parameter**: URL query param `?page=1` determines which page to display
- **Limit**: Fixed at 5 tasks per page for consistent UX
- **Skip Calculation**: `(page - 1) * 5` skips previous pages' tasks
- **Efficient Loading**: Only fetches data needed for current page

**Benefits:**
- ✅ Reduces initial render time
- ✅ Lower database load
- ✅ Better user experience with faster page loads
- ✅ Improved memory usage
- ✅ Scales well with large datasets

**Example URLs:**
- `/?page=1` - First 5 tasks
- `/?page=2` - Tasks 6-10
- `/?search=bug&page=1` - Filtered tasks, page 1
- `/?category=urgent&page=2` - Category filtered, page 2

---

```
┌─────────────────────────────────────┐
│   SearchInput (Client Component)    │  ← Manages URL params
└──────────────────┬──────────────────┘
                   │
                   ├─→ router.push(`?search=X&category=Y`)
                   │
┌──────────────────▼──────────────────┐
│    page.tsx (Server Component)      │  ← Reads URL params
│  ↓ searchParams: Promise<...>       │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│    Hero.tsx (Server Component)      │  ← Filters & displays todos
│  ↓ Prisma query with where clause   │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│    Database (PostgreSQL/Neon)       │
│  ← Returns filtered todos with       │
│    category relationships            │
└─────────────────────────────────────┘
```

### 5. **Data Access Layer Separation** 🏗️
Prisma queries have been extracted into a dedicated data access layer (`lib/data/todos.ts`) for better code organization and reusability:

**File:** `src/lib/data/todos.ts`
```typescript
// Data access layer - all Prisma queries live here
export async function getCategories() {
  return await db.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getFilteredTodos({ search, categorySlug, page = 1, limit = 5 }: GetTodosArgs) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access attempt.");
  
  // Build where clause with filters
  const whereClause: Prisma.TodoWhereInput = {
    userId: userId  // 🛡️ Multi-tenant isolation
  };
  
  if (search) whereClause.title = { contains: search, mode: "insensitive" };
  if (categorySlug) whereClause.category = { slug: categorySlug };
  
  // Fetch with pagination
  return await db.todo.findMany({
    where: whereClause,
    take: limit,
    skip: (page - 1) * limit,
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });
}
```

**Benefits:**
- ✅ **Separation of Concerns** - Queries isolated from components
- ✅ **Reusability** - Same functions used across multiple components
- ✅ **Testability** - Easy to unit test without mocking components
- ✅ **Type Safety** - Interface-based parameters with TypeScript
- ✅ **Maintainability** - Single place to modify query logic

**Hero Component Usage:**
```typescript
import { getCategories, getFilteredTodos } from '@/lib/data/todos';

const categories = await getCategories();
const todos = await getFilteredTodos({ search, categorySlug, page, limit });
```

---

### 6. **Server Actions with FormData** 📝
Server actions now accept FormData directly from HTML forms, following Web standards:

**File:** `src/app/(app)/actions.ts`
```typescript
// 🎯 Accepts FormData directly - Web API standard
export async function createTodo(formData: FormData) {
  // Native extraction using FormData API
  const title = formData.get("title") as string;
  const catIdRaw = formData.get("categoryId") as string;
  const categoryId = catIdRaw ? Number(catIdRaw) : null;

  if (!title || !title.trim()) return;
  
  const userId = await getRequiredSession();
  await db.todo.create({
    data: { 
      title: title.trim(),
      userId,
      categoryId
    },
  });
  
  revalidatePath("/");
}
```

**HTML Form Usage:**
```tsx
<form action={createTodo} className="flex gap-2">
  <input name="title" placeholder="Write a new task..." required />
  <select name="categoryId">
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>{cat.name}</option>
    ))}
  </select>
  <button type="submit">Add Task</button>
</form>
```

**Benefits:**
- ✅ **Web Standards** - Uses native FormData API
- ✅ **Progressive Enhancement** - Works even with JavaScript disabled
- ✅ **File Upload Ready** - FormData can include file inputs
- ✅ **Type Safe** - FormData.get() returns typed values
- ✅ **No Manual Parsing** - Browser handles serialization

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
1. User enters title and selects category in Hero component form
2. Form submits with `action={createTodo}` → sends FormData to server action
3. `createTodo(formData)` extracts: `title = formData.get("title")`, `categoryId = formData.get("categoryId")`
4. Server action: checks auth via Clerk → validates input → calls Prisma create
5. Database inserts todo with `userId`, `title`, and optional `categoryId`
6. `revalidatePath("/")` refreshes UI automatically
7. New todo appears in filtered list

### Fetching & Filtering Todos
1. Hero component imports `getFilteredTodos` from `lib/data/todos.ts`
2. Calls `getFilteredTodos({ search, categorySlug, page, limit })`
3. Data access function:
   - Checks user auth via `await auth()`
   - Builds Prisma where clause with filters (search, category)
   - Applies pagination (`skip`, `take`)
   - Returns filtered todos with category relationships
4. Hero renders the paginated todo list
5. User clicks pagination or changes search/category
6. URL params update → page re-renders → new query executes

### Viewing Todo Details
1. User clicks todo title → navigates to `/app/todo/{id}`
2. Page calls `getTodoById(id)` from actions
3. Server verifies `where: { id, userId }` (security check)
4. 404 if todo doesn't exist or doesn't belong to user
5. `@stats` slot renders `default.tsx` (hides sidebar)

### Updating Todo Status
1. User clicks checkbox to toggle completed status
2. Calls `toggleTodo(id, completed)` server action
3. Server verifies user owns todo (`where: { id, userId }`) → updates in DB
4. Cache invalidated → UI refreshes

---

## 🚀 Development Keys

**File Purposes:**
- `lib/data/todos.ts` - 🎯 Data access layer (getFilteredTodos, getCategories)
- `actions.ts` - All database operations with FormData + auth checks
- `Hero.tsx` - Component that calls data layer and renders todos
- `layout.tsx` - Grid layout positioning children + stats
- `@stats/` - Independent sidebar analytics
- `collections/` - Payload CMS data model configs
- `prisma/schema.prisma` - Database table definitions
- `payload.config.ts` - Payload CMS setup & admin config
- `middleware.ts` - Route protection logic

**Key Concepts:**
- **Data Access Layer** - Separated Prisma queries in `lib/data/` for reusability
- **FormData API** - Server actions accept native FormData from HTML forms
- **Server Actions** - Backend functions that run on server, called from client
- **Parallel Routes** - Multiple slots (`@children`, `@stats`) render independently
- **Route Groups** - `(app)` and `(payload)` organize routes without URL changes
- **Type Safety** - Types auto-generated from Prisma schema and Payload collections
- **Data Isolation** - Every query filters by `userId` - users see only their data
