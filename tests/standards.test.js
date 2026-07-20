import test from "node:test";
import assert from "node:assert/strict";
import { getStandards } from "../src/standards.js";

test("Grade 8 includes content and historical practice standards", () => {
  const codes = getStandards("Grade 8", "U.S. History").map(([code]) => code);
  assert.ok(codes.includes("CA HSS 8.1"));
  assert.ok(codes.includes("CA HSS 6-8 HI"));
});

test("Grade 12 Economics uses economics content", () => {
  const standards = getStandards("Grade 12", "Economics");
  assert.deepEqual(standards[0], ["CA HSS 12.1", "Common economic terms and concepts"]);
  assert.equal(standards.filter(([code]) => code.startsWith("CA HSS 12.")).length, 6);
});

