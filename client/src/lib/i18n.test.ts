import { describe, expect, it } from "vitest";
import { getLanguageCopy, LANGUAGE_KEY, readStoredLanguage, translations } from "./i18n";

describe("Gwave language dictionary", () => {
  it("contains matching English and Myanmar keys for the global UI", () => {
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.my).sort());
    expect(translations.en.help).toBe("Help & User Guide");
    expect(translations.my.help).toContain("အကူအညီ");
    expect(translations.en.confirmAge).toContain("21");
    expect(translations.my.confirmAge).toContain("၂၁");
  });

  it("reads the persisted language and safely falls back to English", () => {
    expect(readStoredLanguage({ getItem: key => key === LANGUAGE_KEY ? "my" : null })).toBe("my");
    expect(readStoredLanguage({ getItem: () => "fr" })).toBe("en");
    expect(readStoredLanguage(undefined)).toBe("en");
  });

  it("uses the same provider lookup contract for representative workflow labels", () => {
    expect(getLanguageCopy("en", "help")).toBe("Help & User Guide");
    expect(getLanguageCopy("my", "help")).toContain("အကူအညီ");
    expect(getLanguageCopy("my", "dashboardAuthRequired")).toContain("dashboard");
    expect(getLanguageCopy("en", "roadmap")).toBe("Roadmap & Trust");
  });

  it("provides translated coverage for the primary workflows", () => {
    for (const key of ["ageRequired", "searchHelp", "operations", "coaVerification", "footerDescription", "discordCommunity", "signInContinue", "dashboardAuthRequired", "roadmap"] as const) {
      expect(translations.en[key].length).toBeGreaterThan(0);
      expect(translations.my[key].length).toBeGreaterThan(0);
    }
  });
});
