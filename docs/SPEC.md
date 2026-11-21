# CranioCare — Product Specification

## 1. Problem

Clinics fitting custom cranial orthosis helmets for infants currently track
cases in spreadsheets and paper files:

- Measurements from different visits are hard to compare, so treatment
  progress (cephalic index / CVAI over time) is not visible at a glance.
- 3D scan files live on individual computers with no link to the patient
  record.
- Helmet production status is tracked by phone calls between clinic and lab.

## 2. Users and roles

| Role       | Permissions                                              |
|------------|----------------------------------------------------------|
| Admin      | Full access, user management                             |
| Doctor     | Patients, assessments, appointments, helmet sign-off     |
| Technician | Scans, helmet production statuses, appointments         |
| Staff      | Patient intake, appointment scheduling                   |

Access is enforced with Supabase Auth + Postgres Row Level Security.

## 3. Data model (summary)

- **patients** — demographics, guardian contacts, intake date
- **assessments** — per-visit measurements: head circumference (mm),
  cephalic index (CI), cranial vault asymmetry index (CVAI), diagnosis, notes
- **scans** — 3D scan sessions: date, scanner model, file reference in
  Supabase Storage, linked assessment
- **helmets** — one row per helmet: order date, size, production status
  pipeline, delivery date
- **appointments** — follow-up visits: schedule, type, status, notes
- **profiles** — app users mapped to Supabase Auth, with role

Full DDL: `supabase/migrations/0001_init.sql`.

## 4. Key workflows

1. **Intake:** staff creates a patient, records guardian contacts.
2. **First assessment:** doctor records measurements and diagnosis; a 3D
   scan is taken and attached to the record.
3. **Helmet order:** a helmet row is created; the lab advances its status
   as production progresses.
4. **Fitting & delivery:** fitting appointment, adjustments logged.
5. **Follow-ups:** repeat assessments; the patient page charts CI/CVAI
   across visits so progress is visible.

## 5. Non-goals (v1)

- No payment/billing module.
- No public parent-facing portal (planned for v2).
- No automated diagnosis — measurements support the doctor, not replace
  clinical judgement.
