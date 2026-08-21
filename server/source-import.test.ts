import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("source strain import report", () => {
  it("records the 2,000 unique source-approved rows without attaching COA approval", () => {
    const report = JSON.parse(fs.readFileSync(new URL("../docs/strain-import-report.json", import.meta.url), "utf8"));
    expect(report.importedUniqueRows).toBe(2000);
    expect(report.publicationDefault).toBe("unpublished");
    expect(report.verificationDefault).toBe("unreviewed; no COA attached");
    expect(report.duplicateSlugs).toBe(0);
  });
});
