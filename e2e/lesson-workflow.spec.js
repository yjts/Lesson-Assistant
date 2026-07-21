import { expect, test } from "@playwright/test";

test("teacher edits survive save, reload, and printable summary", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Topic", { exact: true }).fill("Constitutional Convention");
  await page.getByLabel("Power skill", { exact: true }).selectOption("Argumentation");
  await page.getByRole("button", { name: "Generate lesson direction" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Generated Constitutional Convention" })).toBeVisible();
  await page.getByRole("textbox", { name: "Edit inquiry question" }).fill("Which constitutional compromise was most consequential?");
  await page.getByRole("textbox", { name: "Teacher notes", exact: true }).fill("Prepare a comparison chart and printed excerpts.");
  await expect(page.getByText("Teacher edits not yet saved.")).toBeVisible();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText(/Saved “Constitutional Convention — Grade 8”/)).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Load", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Edit inquiry question" })).toHaveText("Which constitutional compromise was most consequential?");
  await expect(page.getByRole("textbox", { name: "Teacher notes", exact: true })).toHaveValue("Prepare a comparison chart and printed excerpts.");
  await page.getByRole("link", { name: "Open printable summary" }).click();
  await expect(page.getByRole("heading", { name: "Which constitutional compromise was most consequential?" })).toBeVisible();
  await expect(page.getByText("Prepare a comparison chart and printed excerpts.")).toBeVisible();
});

test("phone layout contains page overflow while preserving table scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const widths = await page.evaluate(() => ({
    pageClient: document.documentElement.clientWidth,
    pageScroll: document.documentElement.scrollWidth,
    tableClient: document.querySelector(".table-scroll").clientWidth,
    tableScroll: document.querySelector(".table-scroll").scrollWidth
  }));
  expect(widths.pageScroll).toBe(widths.pageClient);
  expect(widths.tableScroll).toBeGreaterThan(widths.tableClient);
});

test("content-free diagnostics can be viewed and cleared", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("lesson-assistant:diagnostics:v1", JSON.stringify([
    { code: "draft-save-failed", occurredAt: "2026-07-21T10:00:00.000Z", appVersion: "test" }
  ])));
  await page.reload();
  await page.getByText("Support diagnostics", { exact: true }).click();
  await expect(page.getByText(/draft-save-failed · app test/)).toBeVisible();
  await page.getByRole("button", { name: "Clear diagnostics" }).click();
  await expect(page.getByText("No diagnostic events recorded.")).toBeVisible();
  await expect(page.getByText("Local diagnostics cleared.")).toBeVisible();
});
