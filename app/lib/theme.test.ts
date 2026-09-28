import assert from "node:assert/strict";
import test from "node:test";
import { parseThemePreference } from "./theme";

test("parseThemePreference accepts light and dark", () => {
  assert.equal(parseThemePreference("light"), "light");
  assert.equal(parseThemePreference("dark"), "dark");
});

test("parseThemePreference falls back to system", () => {
  assert.equal(parseThemePreference(null), "system");
  assert.equal(parseThemePreference(""), "system");
  assert.equal(parseThemePreference("auto"), "system");
});
