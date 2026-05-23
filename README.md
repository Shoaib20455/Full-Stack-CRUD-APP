# 🚀 Next.js + Neon DB Task Manager (With Clerk Auth)

A secure, full-stack production-ready CRUD application built with Next.js (App Router), Prisma ORM, Neon PostgreSQL, and Clerk Authentication. This project showcases dynamic route protection and data isolation based on individual user accounts.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma
- **Auth:** Clerk Authentication
- **Styling:** Tailwind CSS + Shadcn UI token-based theme synchronization

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

Create a `.env` file in the root directory of your project and populate it with your environment keys from Neon DB and Clerk dashboards:

```env
# Database connection string from Neon Console
DATABASE_URL="postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Clerk Authentication Keys (From Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. Sync the Database Schema

Generate the Prisma client and push your data models directly to your Neon cloud database:

```bash
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
│   │   └── todo/
│   │       └── [id]/
│   │           └── page.tsx        # Dynamic Task Detail Page
│   ├── components/
│   │   ├── Hero.tsx                # Main UI with interactive CRUD + clickable task links
│   │   └── Navbar.tsx              # Global sticky navbar synced with Shadcn UI parameters
│   └── lib/
│       └── db.ts                   # Singleton Prisma Client instance
├── prisma/
│   └── schema.prisma               # Database architecture and model specs
└── .env                            # Local environment keys (Secret)
```

---

## 🔧 Future Maintenance Commands

If you modify the database models inside `prisma/schema.prisma` in the future, always run:

```bash
npx prisma db push
npx prisma generate
```

> **Note:** If VS Code displays type errors after a database change, press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac) and choose **"TypeScript: Restart TS Server"**.
