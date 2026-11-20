import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // شغّل ملفات Playwright فقط، واترك اختبارات node:test مستقلة
  testMatch: "**/*.spec.js",

  fullyParallel: false,
  timeout: 60000,

  // فصل ملفات نتائج الاختبار عن تقرير HTML
  outputDir: "./playwright-artifacts",

  reporter: [
    ["list"],
    ["html", {
      outputFolder: "./playwright-report",
      open: "never"
    }],
    ["json", {
      outputFile: "./playwright-report.json"
    }]
  ],

  use: {
    baseURL: "https://convaudit.com",
    headless: true,
    browserName: "chromium",
    viewport: { width: 1365, height: 900 }
  }
});
