# DreamAyla

AI dream analysis MVP built with Next.js App Router, TypeScript, Prisma, Supabase Auth integration points, OpenAI, and Stripe integration points.

## Start

1. Copy `.env.example` to `.env.local` and add service credentials.
2. Run `npm install`, `npm run prisma:generate`, then `npm run dev`.
3. Apply the Prisma schema to a PostgreSQL database with `npx prisma db push` (or use migrations before production).

When `OPENAI_API_KEY` is absent, Dream Parser returns a clearly bounded local fallback so the question/report flow remains usable in development.

## Safety

Interpretations are framed as reflective possibilities, never medical diagnosis or prediction. Saved content must be protected by Supabase session ownership checks in every persistence route.
