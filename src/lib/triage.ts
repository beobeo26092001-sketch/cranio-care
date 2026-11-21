// Deterministic triage rules for flat-head assessments.
//
// Given a baby's age and the computed indices, decide the next step.
// The rules are deliberately plain and ordered — no ML, no hidden state —
// so a clinician can read exactly why a case was routed the way it was:
// every result carries the list of reasons that fired.
//
// This is a screening aid for workflow routing (who needs review, and how
// soon). It does NOT diagnose and does NOT decide treatment; the treating
// clinician does.

import { classifyCephalicIndex, classifyCvai } from "./measurements";

export type TriageAction =
  | "monitor_repositioning" // home repositioning, routine review
  | "schedule_follow_up" // re-measure in a few weeks
  | "specialist_consult" // clinician review before any helmet decision
  | "helmet_evaluation"; // book a helmet-therapy evaluation

const ACTION_PRIORITY: Record<TriageAction, number> = {
  monitor_repositioning: 0,
  schedule_follow_up: 1,
  specialist_consult: 2,
  helmet_evaluation: 3,
};

const REVIEW_WEEKS: Record<TriageAction, number> = {
  monitor_repositioning: 8,
  schedule_follow_up: 4,
  specialist_consult: 2,
  helmet_evaluation: 2,
};

export interface TriageInput {
  ageMonths: number;
  cephalicIndex: number;
  cvai: number;
}

export interface TriageResult {
  action: TriageAction;
  /** Human-readable trace of every rule that contributed. */
  reasons: string[];
  /** Suggested timeframe for the next review, in weeks. */
  reviewInWeeks: number;
}

export function triageAssessment(input: TriageInput): TriageResult {
  const { ageMonths } = input;
  if (!Number.isFinite(ageMonths) || ageMonths < 0) {
    throw new RangeError(`ageMonths must be a non-negative number, got ${ageMonths}`);
  }

  const cvaiLevel = classifyCvai(input.cvai);
  const cephalicClass = classifyCephalicIndex(input.cephalicIndex);

  let action: TriageAction = "monitor_repositioning";
  const reasons: string[] = [];
  const raise = (next: TriageAction, reason: string) => {
    reasons.push(reason);
    if (ACTION_PRIORITY[next] > ACTION_PRIORITY[action]) action = next;
  };

  // --- asymmetry rules (plagiocephaly) ---
  if (cvaiLevel >= 4) {
    raise(
      "helmet_evaluation",
      `CVAI ${input.cvai}% is level ${cvaiLevel}: severe vault asymmetry`
    );
  } else if (cvaiLevel === 3) {
    raise(
      "helmet_evaluation",
      `CVAI ${input.cvai}% is level 3: moderate-severe vault asymmetry`
    );
  } else if (cvaiLevel === 2) {
    raise(
      "schedule_follow_up",
      `CVAI ${input.cvai}% is level 2: mild asymmetry, re-measure soon`
    );
  }

  // --- head-shape rules (brachycephaly / dolichocephaly) ---
  if (cephalicClass === "severe_brachycephaly" || cephalicClass === "moderate_brachycephaly") {
    raise("helmet_evaluation", `Cephalic index ${input.cephalicIndex} is ${cephalicClass}`);
  } else if (cephalicClass === "mild_brachycephaly" || cephalicClass === "dolichocephaly") {
    raise(
      "schedule_follow_up",
      `Cephalic index ${input.cephalicIndex} is ${cephalicClass}, outside the normal band`
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      `CI ${input.cephalicIndex} and CVAI ${input.cvai}% are within screening bands: ` +
        "repositioning guidance and routine monitoring"
    );
  }

  // --- age guards: helmet therapy has a practical window ---
  // Typical start is around 4 months, once neck control allows it, and
  // effectiveness drops as the rapid-growth period ends. Outside the
  // window the case goes to a clinician instead of straight to booking.
  if (action === "helmet_evaluation" && ageMonths < 3) {
    action = "specialist_consult";
    reasons.push(
      `Age ${ageMonths} months is below the typical helmet start (~4 months): ` +
        "specialist review and repositioning first"
    );
  }
  if (action === "helmet_evaluation" && ageMonths > 18) {
    action = "specialist_consult";
    reasons.push(
      `Age ${ageMonths} months is beyond the typical helmet-therapy window: ` +
        "specialist review before any decision"
    );
  }

  return { action, reasons, reviewInWeeks: REVIEW_WEEKS[action] };
}
