import { describe, expect, it } from "vitest";
import { sanitizePublicStrainRecord, sanitizePublicStrainText } from "./gwave-public";

describe("public strain record safety", () => {
  it("removes raw URLs while preserving the surrounding record text", () => {
    expect(sanitizePublicStrainText("Imported source: https://github.com/example/strains\nClassification: hybrid")).toBe("Imported Source: source reference withheld\nClassification: hybrid");
  });

  it("sanitizes every public strain narrative and source label", () => {
    const publicRecord = sanitizePublicStrainRecord({
      verifiedFacts: "Facts https://example.test/facts",
      supplierDescription: "Supplier description",
      educationalNote: "Education https://example.test/education",
      legalNotice: "Legal notice",
      cannabinoidSource: "Imported from https://example.test/source",
      effectSource: null,
      slug: "signal-strain",
    });

    expect(JSON.stringify(publicRecord)).not.toMatch(/https?:\/\//i);
    expect(publicRecord.verifiedFacts).toContain("Facts");
    expect(publicRecord.educationalNote).toContain("Education");
    expect(publicRecord.cannabinoidSource).toContain("source reference withheld");
    expect(publicRecord.slug).toBe("signal-strain");
  });
});
