import { describe, expect, it } from "vitest";
import { triageAssessment } from "./triage";

describe("triageAssessment", () => {
  it("routes severe asymmetry to a helmet evaluation", () => {
    const result = triageAssessment({ ageMonths: 6, cephalicIndex: 84, cvai: 9.5 });
    expect(result.action).toBe("helmet_evaluation");
    expect(result.reasons.join(" ")).toMatch(/level 4/);
  });

  it("routes level-3 CVAI to a helmet evaluation", () => {
    const result = triageAssessment({ ageMonths: 8, cephalicIndex: 85, cvai: 7.1 });
    expect(result.action).toBe("helmet_evaluation");
  });

  it("routes moderate brachycephaly to a helmet evaluation", () => {
    const result = triageAssessment({ ageMonths: 7, cephalicIndex: 95, cvai: 2.0 });
    expect(result.action).toBe("helmet_evaluation");
  });

  it("schedules a follow-up for mild findings", () => {
    const result = triageAssessment({ ageMonths: 5, cephalicIndex: 82, cvai: 4.2 });
    expect(result.action).toBe("schedule_follow_up");
    expect(result.reviewInWeeks).toBe(4);
  });

  it("monitors when everything is within bands", () => {
    const result = triageAssessment({ ageMonths: 4, cephalicIndex: 83, cvai: 1.8 });
    expect(result.action).toBe("monitor_repositioning");
    expect(result.reviewInWeeks).toBe(8);
  });

  it("downgrades to a consult below the typical helmet start age", () => {
    const result = triageAssessment({ ageMonths: 2, cephalicIndex: 95, cvai: 7.0 });
    expect(result.action).toBe("specialist_consult");
    expect(result.reasons.join(" ")).toMatch(/below the typical helmet start/);
  });

  it("downgrades to a consult beyond the typical helmet window", () => {
    const result = triageAssessment({ ageMonths: 20, cephalicIndex: 88, cvai: 10.2 });
    expect(result.action).toBe("specialist_consult");
    expect(result.reasons.join(" ")).toMatch(/beyond the typical helmet-therapy window/);
  });

  it("always explains itself", () => {
    const result = triageAssessment({ ageMonths: 6, cephalicIndex: 99, cvai: 12 });
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
