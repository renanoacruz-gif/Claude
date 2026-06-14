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

This project uses PostgreSQL. Follow these steps to deploy:

1. **Fork or clone** this repository to your GitHub account.

2. **Create a free PostgreSQL database** using one of these services:
   - [Neon](https://neon.tech) — serverless PostgreSQL with a generous free tier
   - [Supabase](https://supabase.com) — open-source Firebase alternative with PostgreSQL

3. **Copy your connection string** from your database provider. It will look like:
   ```
   postgresql://user:password@host:5432/dbname?sslmode=require
   ```

4. **Deploy to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and import your repository.
   - In the **Environment Variables** section, add:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
     ```
   - Click **Deploy**.

5. **Run database migrations** after the first deploy:
   ```bash
   npx prisma migrate deploy
   ```

6. **(Optional) Seed the database:**
   ```bash
   npx prisma db seed
   ```

The `postinstall` script automatically runs `prisma generate` during each Vercel build.
