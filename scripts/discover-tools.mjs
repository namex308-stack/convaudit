import fs from "node:fs/promises";

const BASE = "https://convaudit.com";
const SITEMAP = `${BASE}/sitemap.xml`;

const response = await fetch(SITEMAP);

if (!response.ok) {
  throw new Error(`Sitemap HTTP ${response.status}`);
}

const xml = await response.text();

const urls = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)]
  .map(match => match[1].replaceAll("&amp;", "&"))
  .filter(url => {
    try {
      const parsed = new URL(url);
      return parsed.origin === BASE;
    } catch {
      return false;
    }
  });

const tools = urls.filter(url => {
  const path = new URL(url).pathname;
  return /\/tools?\//i.test(path);
});

await fs.writeFile(
  "test-results/tool-urls.json",
  JSON.stringify(tools, null, 2)
);

console.log(`Total sitemap URLs: ${urls.length}`);
console.log(`Tool URLs discovered: ${tools.length}`);
console.log(tools.join("\n"));

if (tools.length === 0) {
  console.log("No tool URLs matched. Route discovery needs adjustment.");
}
