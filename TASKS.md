# Build plan

Incremental tasks, roughly in order. Each task should land as its own PR
with a short summary and manual test notes.

## Phase 1 — Foundation
- [x] Repository scaffold, spec, database schema (`0001_init.sql`)
- [ ] Supabase project wiring: run migrations, create `scans` storage bucket
- [ ] Auth: email login, profile creation on first sign-in, role assignment
- [ ] App shell: layout, navigation (Dashboard / Patients / Appointments)

## Phase 2 — Core clinical workflow
- [ ] Patient registry: create/list/search patients, patient detail page
- [ ] Assessments: add measurement form (circumference, CI, CVAI),
      assessment history table on the patient page
- [ ] Progress chart: CI and CVAI across visits (line chart)
- [ ] Scans: upload scan file to Storage, attach metadata to a visit

## Phase 3 — Production & scheduling
- [ ] Helmets: status pipeline board (designed → in production → fitted →
      delivered → adjusted), status change history
- [ ] Appointments: calendar list, create/reschedule/cancel, visit notes

## Phase 4 — Hardening
- [ ] Per-role RLS policies (replace the starter "authenticated" policies)
- [ ] Input validation and audit fields (created_by / updated_at triggers)
- [ ] Backup/export: patient timeline PDF export for the medical record
- [ ] Deployment: Vercel + production Supabase, environment checklist
