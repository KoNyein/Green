import { describe, expect, it } from "vitest";
import { canTransitionCoa, canTransitionOrder, canTransitionPost, isAllowedSlipUpload, matchesStrainProfileFilters } from "./gwave-workflows";

describe("Gwave workflow safeguards", () => {
  it("allows only the declared order progression", () => {
    expect(canTransitionOrder("payment_pending", "payment_under_review")).toBe(true);
    expect(canTransitionOrder("payment_pending", "shipped")).toBe(false);
    expect(canTransitionOrder("completed", "packing")).toBe(false);
  });

  it("enforces the editorial approval sequence", () => {
    expect(canTransitionPost("draft", "review")).toBe(true);
    expect(canTransitionPost("review", "published")).toBe(false);
    expect(canTransitionPost("approved", "published")).toBe(true);
  });

  it("enforces COA review before public approval", () => {
    expect(canTransitionCoa("draft", "review")).toBe(true);
    expect(canTransitionCoa("draft", "approved")).toBe(false);
    expect(canTransitionCoa("review", "approved")).toBe(true);
    expect(canTransitionCoa("approved", "draft")).toBe(false);
  });

  it("accepts only bounded image uploads for payment slips", () => {
    expect(isAllowedSlipUpload("image/png", 1024)).toBe(true);
    expect(isAllowedSlipUpload("application/pdf", 1024)).toBe(false);
    expect(isAllowedSlipUpload("image/jpeg", 6 * 1024 * 1024)).toBe(false);
  });

  it("filters THC and CBD ranges only when a cannabinoid source exists", () => {
    const sourced = { thcMinPercent: "18.50", thcMaxPercent: "23.00", cbdMinPercent: "0.10", cbdMaxPercent: "0.50", cannabinoidSource: "Supplier COA / 2026-08", profileReviewedAt: new Date() };
    expect(matchesStrainProfileFilters(sourced, { thcMin: 20, thcMax: 25 })).toBe(true);
    expect(matchesStrainProfileFilters(sourced, { thcMin: 24 })).toBe(false);
    expect(matchesStrainProfileFilters({ ...sourced, cannabinoidSource: null }, { cbdMin: 0.2 })).toBe(false);
  });

  it("filters effect tags only when an effect source exists", () => {
    const sourced = { effectTags: ["uplifting", "creative"], effectSource: "Supplier sensory profile / 2026-08", profileReviewedAt: new Date() };
    expect(matchesStrainProfileFilters(sourced, { effect: "creative" })).toBe(true);
    expect(matchesStrainProfileFilters(sourced, { effect: "calming" })).toBe(false);
    expect(matchesStrainProfileFilters({ ...sourced, effectSource: null }, { effect: "creative" })).toBe(false);
  });
});
