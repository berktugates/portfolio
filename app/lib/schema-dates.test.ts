import assert from "node:assert/strict";
import test from "node:test";
import { toSchemaDateTime } from "./schema-dates";

test("toSchemaDateTime expands date-only to noon UTC", () => {
  assert.equal(toSchemaDateTime("2026-10-20"), "2026-10-20T12:00:00.000Z");
});

test("toSchemaDateTime normalizes full datetimes to UTC ISO", () => {
  assert.equal(toSchemaDateTime("2026-10-20T15:00:00+03:00"), "2026-10-20T12:00:00.000Z");
  assert.equal(toSchemaDateTime("2026-10-20T12:00:00.000Z"), "2026-10-20T12:00:00.000Z");
});

test("toSchemaDateTime falls back for missing or invalid input", () => {
  assert.equal(toSchemaDateTime(undefined, "2026-10-19"), "2026-10-19T12:00:00.000Z");
  assert.equal(toSchemaDateTime("nope", "2026-10-19"), "2026-10-19T12:00:00.000Z");
});
