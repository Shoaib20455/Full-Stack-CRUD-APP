# 🚀 Next.js + Neon DB Task Manager

A full-stack CRUD application built with Next.js, Prisma ORM, Neon PostgreSQL, and Clerk Authentication.

---

## 🛠️ Tech Stack

- Next.js (App Router)
- Neon PostgreSQL
- Prisma ORM
- Payload CMS
- Clerk Authentication
- Tailwind CSS + Shadcn UI

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

## 📍 Access Points

- **App:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **GraphQL:** [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)
