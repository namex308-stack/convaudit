import { test, expect } from "@playwright/test";
import fs from "node:fs";

const file = "test-results/tool-urls.json";

if (!fs.existsSync(file)) {
  throw new Error("Run scripts/discover-tools.mjs first.");
}

const urls = JSON.parse(fs.readFileSync(file, "utf8"));

if (!Array.isArray(urls) || urls.length === 0) {
  throw new Error("No tool URLs found. Check sitemap and route discovery.");
}

for (const url of urls) {
  test(`Tool page loads: ${url}`, async ({ page }) => {
    const pageErrors = [];
    const failedRequests = [];

    page.on("pageerror", error => {
      pageErrors.push(error.message);
    });

    page.on("requestfailed", request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    });

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded"
    });

    expect(response, "Page returned no response").not.toBeNull();
    expect(response.status(), `HTTP error: ${url}`).toBeLessThan(400);

    await expect(page.locator("body")).not.toBeEmpty();

    const title = await page.title();
    expect(title.trim().length, "Missing page title").toBeGreaterThan(0);

    expect(
      pageErrors,
      `JavaScript errors on ${url}`
    ).toEqual([]);

    console.log(JSON.stringify({
      url,
      status: response.status(),
      title,
      pageErrors,
      failedRequests
    }));
  });
}
