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

## 🔒 Security & Data Isolation Architecture

This project is built with strict multi-tenant data privacy:

- **Authentication Gateway:** Users must log in via Clerk to interact with the database.
- **Server-Level Validation:** Every CRUD interaction in `src/app/actions.ts` runs a server-side session check via `auth()` before processing.
- **No Cross-Data Contamination:** Every item written to the `Todo` table is stamped with a unique `userId`. SQL operations filter results using `where: { userId }`, preventing users from reading, updating, or deleting another user's data even if database record IDs are exposed.

---

## 📂 Project Structure Highlights

```plaintext
├── src/
│   ├── app/
│   │   ├── actions.ts       # Secure Server Actions (CRUD Operations)
│   │   ├── page.tsx         # Main entry point with dynamic login/dashboard checks
│   │   └── middleware.ts    # Clerk routing rules & route protectors
│   ├── components/
│   │   ├── Hero.tsx         # The main UI containing interactive CRUD components
│   │   └── Navbar.tsx       # Global sticky navbar synced with Shadcn UI parameters
│   └── lib/
│       └── db.ts            # Singleton Prisma Client instance
├── prisma/
│   └── schema.prisma        # Database architecture and model specs
└── .env                     # Local environment keys (Secret)
```

---

## 🔧 Future Maintenance Commands

If you modify the database models inside `prisma/schema.prisma` in the future, always run:

```bash
npx prisma db push
npx prisma generate
```

> **Note:** If VS Code displays type errors after a database change, press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac) and choose **"TypeScript: Restart TS Server"**.
