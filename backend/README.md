# TEKMA submissions API

This Express API stores website enquiries in PostgreSQL, saves opportunity documents in a private Supabase Storage bucket, and emails every accepted submission to `COMPANY_EMAIL` (default: `info@tekmaglobalpartners.com.ng`).

## Setup

1. Copy `.env.example` to `.env` and replace every placeholder.
2. Create a **private** Supabase Storage bucket named by `SUPABASE_STORAGE_BUCKET`.
3. Run `npm install`, `npm run prisma:generate`, and `npm run prisma:migrate` from this directory.
4. Start the service with `npm run dev`.
5. Set the front-end `VITE_API_URL` to this API's public URL.

The Resend account must verify the domain used by `EMAIL_FROM`. All website submissions are delivered to `COMPANY_EMAIL`.
