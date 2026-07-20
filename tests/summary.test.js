import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const builderHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const summaryHtml = await readFile(new URL("../summary.html", import.meta.url), "utf8");
const printCss = await readFile(new URL("../styles/print.css", import.meta.url), "utf8");

test("builder exposes a printable summary action", () => {
  assert.match(builderHtml, /id="summary-link"[^>]*href="summary\.html"/);
});

test("summary provides print and recovery actions", () => {
  assert.match(summaryHtml, /id="print-button"[^>]*>Print \/ Save as PDF</);
  assert.match(summaryHtml, /id="summary-error"[^>]*role="alert"/);
  assert.match(summaryHtml, /href="index\.html"/);
});

test("print stylesheet defines print media and letter output", () => {
  assert.match(printCss, /@media print/);
  assert.match(printCss, /@page\{size:letter/);
  assert.match(printCss, /break-inside:avoid/);
});
