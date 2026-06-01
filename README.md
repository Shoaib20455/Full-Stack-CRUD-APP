# 🚀 Next.js + Neon DB Task Manager (With Clerk Auth)

A secure, full-stack production-ready CRUD application built with Next.js (App Router), Prisma ORM, Neon PostgreSQL, and Clerk Authentication. This project showcases dynamic route protection and data isolation based on individual user accounts.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma
- **CMS:** Payload CMS (Headless, Self-Hosted)
- **Auth:** Clerk Authentication + Payload Built-in User Management
- **Rich Text Editor:** Lexical Editor (via Payload)
- **Styling:** Tailwind CSS + Shadcn UI token-based theme synchronization

---

## 📦 Payload CMS Integration

This project integrates **Payload CMS**, a modern, self-hosted headless CMS built on Node.js and React. It provides a powerful admin dashboard for managing content and data collections without needing external services.

### Key Payload CMS Features:
- **Collections Management:** Fully typed collections for Users, Media, and Todos
- **Admin Dashboard:** Auto-generated admin interface accessible at `/admin`
- **Built-in Authentication:** User collection with authentication enabled
- **File Management:** Media collection with upload capabilities
- **REST & GraphQL APIs:** Automatic API endpoints for all collections
- **TypeScript Support:** Auto-generated types in `payload-types.ts`
- **Rich Text Editing:** Lexical editor for content creation
- **Database Native:** Integrated with PostgreSQL for data persistence

### Collections Overview:
1. **Users** - Payload admin user management with email-based authentication
2. **Media** - File and image uploads with required alt text
3. **Todos** - Task collection with title, userId, completion status, and timestamps

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) or yarn
- Git

---

## 🚀 Getting Started & Local Setup

Follow these step-by-step instructions to get a local copy up and running:

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

Create a `.env` file in the root directory of your project and populate it with your environment keys from Neon DB, Clerk dashboards, and Payload CMS configuration:

```env
# Database connection string from Neon Console
DATABASE_URL="postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication Keys (From Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payload CMS Configuration
PAYLOAD_SECRET=your-secure-random-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000  # Change to your production URL in deployment
```

> **Note:** `PAYLOAD_SECRET` should be a strong, random string. Generate one using: `openssl rand -hex 32`

### 4. Sync the Database Schema

Generate the Prisma client and Payload types, then push your data models directly to your Neon cloud database:

```bash
# Generate fresh TypeScript types for your Payload CMS
npx payload generate:types

# Push schema structure to Neon Postgres
npx prisma db push

# Generate fresh TypeScript types for your Prisma Client
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Accessing Payload CMS Admin Dashboard

Once the development server is running, navigate to:

- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **REST API:** Available at `/api/*` endpoints
- **GraphQL API:** Available at `/api/graphql`

The admin dashboard provides:
- User management with role-based access
- Media library for file uploads
- Todo collection management with full CRUD operations
- Rich text editing with Lexical editor
- Real-time sync with your PostgreSQL database

---

## ✨ Features

### Full CRUD Operations
- **Create:** Add new tasks via the input form on the dashboard.
- **Read:** View all your personal tasks, fetched securely from the database.
- **Update:** Toggle a task's completion status with a single click.
- **Delete:** Remove tasks permanently with the delete button.

### Dynamic Task Detail Pages
Clicking on any task title navigates to a dedicated detail page at `/todo/[id]`. This page displays:
- Task title and completion status badge.
- The unique Task ID from the database.
- The timestamp of when the task was created.
- The owner's Clerk identity (userId) for transparency.

A **Back to Dashboard** button is included on every detail page for easy navigation. If a task ID does not exist or does not belong to the logged-in user, Next.js automatically renders a `404 Not Found` page.

---

## 🔒 Security & Data Isolation Architecture

This project is built with strict multi-tenant data privacy:

- **Authentication Gateway:** Users must log in via Clerk to interact with the database.
- **Server-Level Validation:** Every CRUD interaction in `src/app/actions.ts` runs a server-side session check via `auth()` before processing.
- **No Cross-Data Contamination:** Every item written to the `Todo` table is stamped with a unique `userId`. SQL operations filter results using `where: { userId }`, preventing users from reading, updating, or deleting another user's data even if database record IDs are exposed.
- **Secure Single Record Fetching:** The `getTodoById(id)` server action validates both the task `id` and the logged-in `userId` simultaneously, so no user can access another user's task detail page by guessing a URL.

---

## 📂 Project Structure Highlights

```plaintext
├── src/
│   ├── app/
│   │   ├── actions.ts              # Secure Server Actions (CRUD + getTodoById)
│   │   ├── page.tsx                # Main entry point with dynamic login/dashboard checks
│   │   ├── middleware.ts           # Clerk routing rules & route protectors
│   │   ├── (app)/                  # User-facing application routes
│   │   │   ├── layout.tsx          # Main app layout
│   │   │   ├── page.tsx            # Dashboard with task management
│   │   │   └── todo/
│   │   │       └── [id]/
│   │   │           └── page.tsx    # Dynamic Task Detail Page
│   │   └── (payload)/              # Payload CMS Admin Interface (Auto-generated)
│   │       ├── layout.tsx          # Payload RootLayout wrapper
│   │       ├── custom.scss         # Admin panel custom styling
│   │       └── admin/
│   │           └── [[...segments]]/
│   │               ├── page.tsx    # Admin dashboard page
│   │               └── importMap.js # Payload component mapping
│   ├── collections/
│   │   ├── Users.ts                # Payload Users collection with auth
│   │   ├── Media.ts                # Payload Media collection with uploads
│   │   └── Todos.ts                # Payload Todos collection config
│   ├── components/
│   │   ├── Hero.tsx                # Main UI with interactive CRUD
│   │   └── Navbar.tsx              # Global sticky navbar
│   ├── lib/
│   │   └── db.ts                   # Singleton Prisma Client instance
│   ├── payload.config.ts           # Payload CMS configuration
│   └── payload-types.ts            # Auto-generated Payload types (DO NOT EDIT)
├── prisma/
│   └── schema.prisma               # Database architecture and model specs
├── drizzle.config.ts               # Drizzle ORM configuration
├── next.config.ts                  # Next.js configuration
├── components.json                 # Shadcn UI configuration
└── .env                            # Local environment keys (Secret)
```

### Payload CMS Key Files:

- **`src/payload.config.ts`** - Main Payload configuration file that defines:
  - Collections (Users, Media, Todos)
  - PostgreSQL database adapter
  - Lexical editor for rich text
  - Admin panel user and settings
  - TypeScript type generation settings

- **`src/collections/`** - Collection definitions:
  - Each file exports a `CollectionConfig` object
  - Defines fields, validation, timestamps, and database behavior
  - Payload automatically generates REST/GraphQL endpoints

- **`src/payload-types.ts`** - Auto-generated TypeScript types:
  - Regenerate with: `npx payload generate:types`
  - Do NOT edit manually
  - Contains types for all collections and queries

---

## 🔧 Future Maintenance Commands

If you modify the database models inside `prisma/schema.prisma` in the future, always run:

```bash
npx prisma db push
npx prisma generate
```

> **Note:** If VS Code displays type errors after a database change, press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac) and choose **"TypeScript: Restart TS Server"**.

---

## 🎯 Working with Payload CMS

### Creating and Modifying Collections

To create a new Payload collection:

1. Create a new file in `src/collections/YourCollection.ts`
2. Export a `CollectionConfig` object with field definitions:

```typescript
import { CollectionConfig } from 'payload'

export const YourCollection: CollectionConfig = {
  slug: 'your-collection',
  admin: {
    useAsTitle: 'name', // Field to display as title in admin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
```

3. Import the collection in `src/payload.config.ts` and add it to the `collections` array
4. Generate types: `npx payload generate:types`

### Accessing Payload Data

**Via Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

**Via REST API:**
```bash
# Get all todos
curl http://localhost:3000/api/todos

# Get a specific todo
curl http://localhost:3000/api/todos/[id]

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"New Todo","userId":"user123","completed":false}'

# Update a todo
curl -X PATCH http://localhost:3000/api/todos/[id] \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/[id]
```

**Via GraphQL API:** [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)

### Collections Schema

#### Users
- Built-in Payload authentication collection
- Field: `email` (required)
- Used for admin dashboard login
- Authentication disabled by default for API

#### Media
- File upload collection
- Field: `alt` (required - alt text for images)
- Auto-generated: `url`, `filename`, `mimeType`, `width`, `height`
- Public read access enabled

#### Todos
- Task management collection
- **title** (text, required) - Task title
- **userId** (text, required) - Link to task owner
- **completed** (checkbox, default: false) - Task status
- **createdAt** / **updatedAt** (auto-generated timestamps)

---

## 🔐 Payload CMS Security

- **Admin Authentication:** Protected by Payload's built-in user management
- **Environment Variables:** `PAYLOAD_SECRET` should be a strong, random value
- **Access Control:** Collections support field-level and document-level access control
- **Database Security:** Integrated with your Neon PostgreSQL with encrypted connections

---