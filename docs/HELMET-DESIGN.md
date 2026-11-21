# Helmet Design Pipeline

The core of CranioCare: turning a 3D scan of an infant's head into a
production-ready custom helmet design for flat head syndrome
(plagiocephaly / brachycephaly).

## Pipeline steps

1. **Scan intake**
   - Import the head scan (STL/OBJ) from the 3D scanner (e.g. Artec EVA).
   - Mesh cleanup: remove artifacts, fill holes, smooth noise — without
     altering the clinically relevant shape.

2. **Alignment & measurements**
   - Align the mesh to the anatomical reference plane.
   - Extract head length, width and diagonals automatically:
     - Cephalic Index (CI) = width / length × 100
     - CVAI from the difference of the two diagonals
   - Cross-check against the manual assessment recorded for the visit.

3. **Target shape generation**
   - Generate the corrected head shape the treatment aims for, based on
     age norms and the goals the clinician sets for this patient
     (target CI/CVAI, correction direction).
   - The clinician reviews and adjusts the target shape — the system
     proposes, the doctor decides.

4. **Shell design**
   - Inner surface = target shape plus growth room (offset), so the
     helmet guides growth instead of just holding the current shape.
   - Set wall thickness, trim line (forehead / ears / neck clearance),
     ventilation holes, and closure strap placement.
   - Contact areas over flattened regions get relief; prominent regions
     get gentle contact — per the correction plan.

5. **Review & versioning**
   - Every design is stored as a version linked to its scan and patient
     (`designs` table — planned migration: patient_id, scan_id, version,
     parameters jsonb, status draft / in_review / approved / exported,
     stl_path).
   - Only an approved version can be exported.

6. **Export & production**
   - Export a watertight STL for 3D printing (or milling).
   - The linked helmet order moves into the production pipeline
     (see the `helmets` table statuses).

## Design parameters (per version)

| Parameter        | Meaning                                             |
|------------------|-----------------------------------------------------|
| target_ci        | Cephalic index the design aims for                  |
| target_cvai      | CVAI the design aims for                            |
| growth_room_mm   | Offset between target shape and inner shell surface |
| wall_thickness_mm| Shell thickness                                     |
| trim_style       | Trim line template (standard / high / low)          |
| vent_pattern     | Ventilation hole pattern                            |

## Safety note

CranioCare is a design aid. Final clinical decisions — whether a helmet is
indicated, the correction goals, and design approval — always belong to
the treating clinician.
