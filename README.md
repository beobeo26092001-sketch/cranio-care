# CranioCare — Custom Helmet Design for Infants with Flat Head Syndrome

A design and case-management platform for custom cranial orthosis helmets
for infants with flat head syndrome (positional plagiocephaly and
brachycephaly).

From a 3D scan of the baby's head, CranioCare helps clinicians design a
made-to-measure corrective helmet: it generates the corrected target head
shape, the helmet shell with growth room, trim lines and ventilation, and
exports the design for 3D printing. Around that design core it manages the
whole treatment — assessments, design versions, production, fittings, and
follow-up appointments.

## Why this exists

Flat head syndrome is treated with a custom helmet worn ~23 hours a day
during the rapid head-growth window in the first year of life. Today every
helmet design is manual CAD work per baby, and case data (scans,
measurements, design versions, production status) is scattered across
spreadsheets, paper files, and individual computers. CranioCare turns the
scan → design → production → follow-up chain into one digital workflow.

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript
- **Backend:** Supabase — Postgres database, Auth, Storage (3D scan and
  design files), Row Level Security
- **3D pipeline:** mesh processing (STL/OBJ), measurement extraction,
  target-shape generation, shell offsetting, STL export
- **Deployment:** Vercel (web) + Supabase hosted project

## Repository layout

```
docs/         Product spec, data model, helmet design pipeline
supabase/     SQL migrations (schema, RLS) and seed notes
src/          Next.js application source
  app/        Routes (dashboard, patients, appointments)
  lib/        Supabase client and shared helpers
```

## Core modules (build plan)

1. **Patient registry** — intake form, guardian contacts, patient timeline
2. **Assessments** — head measurements (circumference, CI, CVAI), diagnosis,
   progress charts across visits
3. **3D scan records** — scan sessions, mesh files in Storage, linked visits
4. **Helmet design** — the core module: scan → corrected target shape →
   helmet shell design (growth room, trim line, ventilation) → STL export.
   See `docs/HELMET-DESIGN.md`
5. **Helmet production** — order status pipeline
   (designed → in production → fitted → delivered → adjusted)
6. **Appointments** — follow-up scheduling and visit notes
7. **Roles & access** — admin / doctor / technician via Supabase Auth + RLS

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
specifications, and starter code. All patient records and scan files live
in the clinic's private Supabase project.
