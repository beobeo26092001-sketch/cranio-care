// Head measurement math for cranial orthosis assessment.
//
// Pure functions, no I/O: the same code runs in the web app, in unit
// tests, and later in the 3D-scan pipeline when measurements are
// extracted automatically from a mesh instead of typed in by hand.
//
// All lengths are millimetres. Indices are percentages.

const round2 = (n: number): number => Math.round(n * 100) / 100;

function assertMeasurement(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive finite number, got ${value}`);
  }
  // Infant head dimensions live far inside this window; anything outside
  // is a data-entry error (e.g. centimetres typed into a mm field).
  if (value < 30 || value > 400) {
    throw new RangeError(`${name}=${value}mm is outside the plausible range 30-400mm`);
  }
}

export interface HeadMeasurementsInput {
  /** Glabella to opisthocranion (front-back). */
  headLengthMm: number;
  /** Euryon to euryon (side-side, widest point). */
  headWidthMm: number;
  /** Frontozygomatic point to contralateral occiput, side A. */
  diagonalAMm: number;
  /** Frontozygomatic point to contralateral occiput, side B. */
  diagonalBMm: number;
}

/**
 * Cephalic Index (CI) = head width / head length * 100.
 * ~100 means a round head; low values are long/narrow, high values
 * are short/wide (brachycephaly).
 */
export function cephalicIndex(headWidthMm: number, headLengthMm: number): number {
  assertMeasurement(headWidthMm, "headWidthMm");
  assertMeasurement(headLengthMm, "headLengthMm");
  return round2((headWidthMm / headLengthMm) * 100);
}

/** Absolute difference between the two cranial diagonals, in mm. */
export function cranialDiagonalDifference(diagonalAMm: number, diagonalBMm: number): number {
  assertMeasurement(diagonalAMm, "diagonalAMm");
  assertMeasurement(diagonalBMm, "diagonalBMm");
  return round2(Math.abs(diagonalAMm - diagonalBMm));
}

/**
 * Cranial Vault Asymmetry Index (CVAI) =
 * |diagonalA - diagonalB| / shorter diagonal * 100.
 * 0% is a perfectly symmetric vault.
 */
export function cranialVaultAsymmetryIndex(diagonalAMm: number, diagonalBMm: number): number {
  assertMeasurement(diagonalAMm, "diagonalAMm");
  assertMeasurement(diagonalBMm, "diagonalBMm");
  const shorter = Math.min(diagonalAMm, diagonalBMm);
  return round2((Math.abs(diagonalAMm - diagonalBMm) / shorter) * 100);
}

/**
 * Head circumference estimate from length/width, treating the axial
 * cross-section as an ellipse (Ramanujan's perimeter approximation).
 * An estimate only — a tape measurement always wins when available.
 */
export function estimateHeadCircumferenceMm(headLengthMm: number, headWidthMm: number): number {
  assertMeasurement(headLengthMm, "headLengthMm");
  assertMeasurement(headWidthMm, "headWidthMm");
  const a = headLengthMm / 2;
  const b = headWidthMm / 2;
  const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  return round2(perimeter);
}

// ---------------------------------------------------------------------------
// Classification bands.
//
// These are SCREENING bands commonly used in cranial-orthosis practice to
// structure a first look at the numbers. They are configuration, not law:
// published cut-offs vary slightly by source and by age, and the treating
// clinician's judgement always prevails over a band.
// ---------------------------------------------------------------------------

export type CephalicClass =
  | "dolichocephaly"
  | "normal"
  | "mild_brachycephaly"
  | "moderate_brachycephaly"
  | "severe_brachycephaly";

export function classifyCephalicIndex(ci: number): CephalicClass {
  if (!Number.isFinite(ci) || ci <= 0) {
    throw new RangeError(`cephalic index must be a positive number, got ${ci}`);
  }
  if (ci < 76) return "dolichocephaly";
  if (ci <= 91) return "normal";
  if (ci <= 94) return "mild_brachycephaly";
  if (ci <= 97) return "moderate_brachycephaly";
  return "severe_brachycephaly";
}

/** CVAI severity levels 1 (symmetric) to 5 (very severe asymmetry). */
export type CvaiLevel = 1 | 2 | 3 | 4 | 5;

export function classifyCvai(cvai: number): CvaiLevel {
  if (!Number.isFinite(cvai) || cvai < 0) {
    throw new RangeError(`CVAI must be a non-negative number, got ${cvai}`);
  }
  if (cvai < 3.5) return 1;
  if (cvai < 6.25) return 2;
  if (cvai < 8.75) return 3;
  if (cvai < 11) return 4;
  return 5;
}

export interface ComputedMeasurements {
  cephalicIndex: number;
  cephalicClass: CephalicClass;
  cvai: number;
  cvaiLevel: CvaiLevel;
  diagonalDifferenceMm: number;
  estimatedCircumferenceMm: number;
}

/** Compute every derived value for one assessment in a single call. */
export function computeMeasurements(input: HeadMeasurementsInput): ComputedMeasurements {
  const ci = cephalicIndex(input.headWidthMm, input.headLengthMm);
  const cvai = cranialVaultAsymmetryIndex(input.diagonalAMm, input.diagonalBMm);
  return {
    cephalicIndex: ci,
    cephalicClass: classifyCephalicIndex(ci),
    cvai,
    cvaiLevel: classifyCvai(cvai),
    diagonalDifferenceMm: cranialDiagonalDifference(input.diagonalAMm, input.diagonalBMm),
    estimatedCircumferenceMm: estimateHeadCircumferenceMm(input.headLengthMm, input.headWidthMm),
  };
}

/** Whole months between a date of birth and a reference date. */
export function ageInMonths(dateOfBirth: Date, at: Date): number {
  let months =
    (at.getFullYear() - dateOfBirth.getFullYear()) * 12 +
    (at.getMonth() - dateOfBirth.getMonth());
  if (at.getDate() < dateOfBirth.getDate()) months -= 1;
  return Math.max(0, months);
  }
