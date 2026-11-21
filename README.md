# CranioCare — Pediatric Cranial Orthosis Management System

A web platform for clinics that provide custom cranial orthosis helmets
(plagiocephaly / brachycephaly treatment) for infants.

The system manages the full treatment journey: patient intake, head-shape
assessment, 3D scan records, helmet production tracking, and follow-up
appointments — replacing spreadsheets and paper files.

## Why this exists

Our clinic fits custom cranial helmets for babies with positional head-shape
deformities. Each case involves 3D head scans, repeated measurements
(cephalic index, CVAI), a made-to-measure helmet, and months of follow-ups.
Today all of this is tracked manually. CranioCare digitizes the workflow so
doctors and technicians share one source of truth per patient.

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript
- **Backend:** Supabase — Postgres database, Auth, Storage (3D scan files),
  Row Level Security
- **Deployment:** Vercel (web) + Supabase hosted project

## Repository layout

```
docs/         Product spec and data model notes
supabase/     SQL migrations (schema, RLS) and seed notes
src/          Next.js application source
  app/        Routes (dashboard, patients, appointments)
  lib/        Supabase client and shared helpers
```

## Core modules (build plan)

1. **Patient registry** — intake form, guardian contacts, patient timeline
2. **Assessments** — head measurements (circumference, CI, CVAI), diagnosis,
   progress charts across visits
3. **3D scan records** — upload/scan metadata, links to scan files in Storage
4. **Helmet production** — order status pipeline
   (designed → in production → fitted → delivered → adjusted)
5. **Appointments** — follow-up scheduling and visit notes
6. **Roles & access** — admin / doctor / technician via Supabase Auth + RLS

See `docs/SPEC.md` for the detailed specification and `TASKS.md` for the
step-by-step build plan.

## Status

Project scaffold: database schema and spec are defined; application modules
are being built out incrementally.

## Getting started

```bash
# 1. Create a Supabase project and run the migrations in supabase/migrations/
# 2. Copy .env.example to .env.local and fill in your Supabase keys
npm install
npm run dev
```

## Data & privacy

This repository contains **no real patient data** — only the schema,
specifications, and starter code. All patient records live in the clinic's
private Supabase project.
