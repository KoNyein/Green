import { describe, expect, it } from "vitest";
import { nextTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  it("toggles between light and dark themes", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });
});
