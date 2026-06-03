# 🚀 Next.js + Neon DB Task Manager

A full-stack CRUD application built with Next.js, Prisma ORM, Neon PostgreSQL, and Clerk Authentication. Features advanced search & filtering with URL-based state persistence and relational database design.

---

## 🌟 Key Features

✅ **Full CRUD Operations** - Create, read, update, delete tasks securely  
✅ **Multi-Tenant Isolation** - Each user sees only their own tasks (Clerk Auth)  
✅ **Database Relations** - Todo-to-Category one-to-many relationships  
✅ **Search & Filter API** - `/api/todos` endpoint with text search and category filtering  
✅ **URL Query State** - Persistent filtering via URL parameters (`?search=X&category=Y`)  
✅ **Admin Dashboard** - Payload CMS for managing collections  
✅ **Type Safety** - Full TypeScript + auto-generated types  

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS + Shadcn UI
- **Backend**: Next.js Server Actions + API Routes
- **Database**: Neon PostgreSQL + Prisma ORM
- **CMS**: Payload CMS (Admin dashboard)
- **Authentication**: Clerk (User login & multi-tenant)
- **Language**: TypeScript

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- npm or yarn
- Git

---

## 🚀 Setup & Run

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PAYLOAD_SECRET=your-secure-random-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### 4. Sync Database & Generate Types

```bash
npx payload generate:types
npx prisma db push
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Features Overview

### Database Relations
Todos are organized with Categories through a one-to-many relationship:
```prisma
Todo has categoryId? → Category (one category per todo, optional)
Category has todos[] → Todo (one category can have many todos)
```

### Search & Filter API
**Endpoint:** `GET /api/todos`

**Query Parameters:**
- `search` - Search in todo titles (case-insensitive)
- `category` - Filter by category slug

**Examples:**
```
/api/todos?search=meeting
/api/todos?category=urgent
/api/todos?search=project&category=critical
```

### URL Query State
Filter state is persisted in the URL using query parameters. Users can:
- Share filtered views with others
- Use browser back/forward to navigate filter history
- Bookmark filtered results

**Example URLs:**
- `http://localhost:3000/?search=bugs` - Tasks with "bugs" in title
- `http://localhost:3000/?category=urgent` - Urgent tasks only
- `http://localhost:3000/?search=fix&category=critical` - Filtered by both

---

## 📍 Access Points

| Endpoint | Purpose |
|----------|---------|
| [http://localhost:3000](http://localhost:3000) | Main app dashboard |
| [http://localhost:3000/admin](http://localhost:3000/admin) | Payload CMS admin panel |
| [http://localhost:3000/api/todos](http://localhost:3000/api/todos) | Search & filter API (GET) |
| [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) | GraphQL endpoint |

---

## 🔄 Architecture

### Server Components (async)
- **page.tsx** - Receives URL `searchParams`, passes to Hero
- **Hero.tsx** - Fetches and filters todos based on search params
- **SearchInput.tsx** (client) - Manages URL query state with `useRouter`

### Database Layer
```
Client → SearchInput (URL updates) 
       → page.tsx (reads searchParams)
       → Hero.tsx (filters with Prisma)
       → Database (returns filtered todos)
```

### Data Models
**Todo:**
- `id`, `userId`, `title`, `completed`, `createdAt`, `updatedAt`
- `categoryId` (optional, FK to Category)

**Category:**
- `id`, `name`, `slug`, `createdAt`, `updatedAt`
- `todos[]` (relationship to many Todos)

---

## 🔒 Security

✅ **Authentication**: Clerk middleware protects routes  
✅ **Authorization**: Every query filters by current user's ID  
✅ **Data Isolation**: Users can only access their own todos  
✅ **Server Actions**: CRUD operations run on server with auth checks  

---

## 📖 Documentation

For detailed project structure and feature explanations, see [PROJECT_EXP.md](PROJECT_EXP.md).
