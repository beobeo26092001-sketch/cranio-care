import { describe, expect, it } from "vitest";
import {
  ageInMonths,
  cephalicIndex,
  classifyCephalicIndex,
  classifyCvai,
  computeMeasurements,
  cranialDiagonalDifference,
  cranialVaultAsymmetryIndex,
  estimateHeadCircumferenceMm,
} from "./measurements";

describe("cephalicIndex", () => {
  it("computes width/length as a percentage", () => {
    expect(cephalicIndex(130, 160)).toBe(81.25);
    expect(cephalicIndex(150, 150)).toBe(100);
  });

  it("rejects implausible input", () => {
    expect(() => cephalicIndex(0, 160)).toThrow(RangeError);
    expect(() => cephalicIndex(130, -5)).toThrow(RangeError);
    expect(() => cephalicIndex(13, 160)).toThrow(RangeError); // cm typed as mm
  });
});

describe("cranialVaultAsymmetryIndex", () => {
  it("is 0 for equal diagonals", () => {
    expect(cranialVaultAsymmetryIndex(145, 145)).toBe(0);
  });

  it("divides the difference by the SHORTER diagonal", () => {
    // |152 - 140| / 140 = 8.57%
    expect(cranialVaultAsymmetryIndex(152, 140)).toBe(8.57);
    expect(cranialVaultAsymmetryIndex(140, 152)).toBe(8.57); // order-free
  });

  it("diagonal difference is in mm", () => {
    expect(cranialDiagonalDifference(152, 140)).toBe(12);
  });
});

describe("estimateHeadCircumferenceMm", () => {
  it("approximates the ellipse perimeter", () => {
    // length 160, width 130 -> ~456.8mm
    expect(estimateHeadCircumferenceMm(160, 130)).toBeCloseTo(456.8, 0);
  });
});

describe("classification bands", () => {
  it("classifies cephalic index", () => {
    expect(classifyCephalicIndex(73)).toBe("dolichocephaly");
    expect(classifyCephalicIndex(85)).toBe("normal");
    expect(classifyCephalicIndex(92)).toBe("mild_brachycephaly");
    expect(classifyCephalicIndex(95)).toBe("moderate_brachycephaly");
    expect(classifyCephalicIndex(99)).toBe("severe_brachycephaly");
  });

  it("classifies CVAI levels at the band edges", () => {
    expect(classifyCvai(3.4)).toBe(1);
    expect(classifyCvai(3.5)).toBe(2);
    expect(classifyCvai(6.25)).toBe(3);
    expect(classifyCvai(8.75)).toBe(4);
    expect(classifyCvai(11)).toBe(5);
  });
});

describe("computeMeasurements", () => {
  it("returns the full derived picture for one assessment", () => {
    const result = computeMeasurements({
      headLengthMm: 160,
      headWidthMm: 130,
      diagonalAMm: 152,
      diagonalBMm: 140,
    });
    expect(result.cephalicIndex).toBe(81.25);
    expect(result.cephalicClass).toBe("normal");
    expect(result.cvai).toBe(8.57);
    expect(result.cvaiLevel).toBe(3);
    expect(result.diagonalDifferenceMm).toBe(12);
  });
});

describe("ageInMonths", () => {
  it("counts whole months", () => {
    const dob = new Date(2026, 0, 15);
    expect(ageInMonths(dob, new Date(2026, 6, 14))).toBe(5);
    expect(ageInMonths(dob, new Date(2026, 6, 15))).toBe(6);
  });
});
