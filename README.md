This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.








# Approval Workflow Engine

A digital multi-step approval system built with Next.js 14, Prisma, MySQL, NextAuth, and Nodemailer.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL 8 + Prisma ORM
- **Auth**: NextAuth.js (Credentials Provider)
- **Email**: Nodemailer (Mailtrap for dev)

---

## Folder Structure

```
approval-workflow-engine/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (test users)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── approvals/
│   │   │   │   ├── route.ts           # POST, GET
│   │   │   │   └── [id]/route.ts      # GET, PATCH
│   │   │   └── auth/[...nextauth]/
│   │   │       └── route.ts           # NextAuth handler
│   │   ├── approvals/
│   │   │   ├── page.tsx               # List page
│   │   │   ├── new/page.tsx           # Create page
│   │   │   └── [id]/page.tsx          # Detail + action page
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── StepTracker.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       └── Providers.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── mail.ts            # Nodemailer + templates
│   │   └── response.ts        # Standard API response helpers
│   ├── types/
│   │   ├── index.ts           # Shared TypeScript types
│   │   └── next-auth.d.ts     # NextAuth type augmentation
│   └── middleware.ts          # Route protection
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/gaurav-17-codes/approval-workflow-engine.git
cd approval-workflow-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/approval_workflow_db"
NEXTAUTH_SECRET="any-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT=587
MAIL_USER="your-mailtrap-username"
MAIL_PASS="your-mailtrap-password"
MAIL_FROM="noreply@approvalengine.com"
MAIL_FROM_NAME="Approval Engine"
```

### 4. Create the MySQL database

```sql
CREATE DATABASE approval_workflow_db;
```

### 5. Push schema to database

```bash
npm run db:push
```

### 6. Seed test users

```bash
npm run db:seed
```

This creates:

| Role      | Email                   | Password     |
|-----------|-------------------------|--------------|
| TEACHER   | teacher@school.edu      | teacher123   |
| HOD       | hod@school.edu          | hod123       |
| PRINCIPAL | principal@school.edu    | principal123 |
| ADMIN     | admin@school.edu        | admin123     |

### 7. Run the development server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## API Endpoints

### `POST /api/approvals`
Create a new approval request (TEACHER only).

**Request body:**
```json
{
  "title": "Leave request for conference",
  "category": "LEAVE",
  "description": "Attending national science conference on 15th March",
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "...", "title": "...", "status": "PENDING", "steps": [...] },
  "message": "Approval request created successfully."
}
```

---

### `GET /api/approvals`
List requests. Teachers see only their own. HOD/Principal see all.

**Query params (optional):** `?status=PENDING&category=LEAVE`

---

### `GET /api/approvals/[id]`
Get a single request with all steps.

---

### `PATCH /api/approvals/[id]`
Approve or reject the active step (HOD or PRINCIPAL only).

**Request body:**
```json
{
  "action": "approve",
  "comment": "Approved. Please proceed."
}
```

`action` must be `"approve"` or `"reject"`.

---

## Workflow Logic

```
Teacher submits request
  → Step 1 (HOD) becomes ACTIVE
  → Email sent to HOD

HOD approves
  → Step 1 → APPROVED
  → Step 2 (Principal) becomes ACTIVE
  → Email sent to Principal

Principal approves
  → Step 2 → APPROVED
  → Request → APPROVED
  → Email sent to Teacher (fully approved)

Any step rejects
  → That step → REJECTED
  → Request → REJECTED
  → Email sent to Teacher (rejected with reason)
```

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run db:push      # Sync schema to DB
npm run db:seed      # Seed test users
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run build        # Production build
```

---

## Team Notes

- Never commit `.env` — share it privately (WhatsApp, email, etc.)
- Always run `npm run db:push` after pulling schema changes
- Run `npm install` after pulling `package.json` changes
- The `.env.example` file is safe to commit — it has no real credentials
