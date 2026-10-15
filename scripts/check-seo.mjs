import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const SITE = "https://themexicoreview.com";
const issues = [];
const files = [];
function walk(dir = "") {
  for (const x of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if ([".git", "node_modules", ".vercel"].includes(x.name)) continue;
    const p = path.posix.join(dir, x.name);
    if (x.isDirectory()) walk(p); else files.push(p);
  }
}
walk();
const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const pageFiles = files.filter((p) => p.endsWith("index.html"));
const indexable = new Set();
const fail = (p, reason) => issues.push(p + ": " + reason);
function attr(html, key, kind = "name") {
  const m = html.match(new RegExp('<meta ' + kind + '="' + key + '" content="([^"]*)"', "i"));
  return m?.[1] ?? "";
}
for (const p of pageFiles) {
  const html = read(p);
  const en = p.startsWith("en/");
  const locale = en ? "en-US" : "es-MX";
  const canonical = SITE + "/" + p.replace(/index\.html$/, "");
  const partner = p.replace(/^en\//, "").replace(/index\.html$/, "");
  const es = SITE + "/" + partner;
  const eng = SITE + "/en/" + partner;
  if (!html.includes('<html lang="' + locale + '">')) fail(p, "wrong HTML language");
  if ([...html.matchAll(/<h1(?:\s|>)/g)].length !== 1) fail(p, "expected one H1");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "";
  if (title.length < 15 || title.length > 90) fail(p, "title length");
  if (title.endsWith(" | The Mexico Review | The Mexico Review")) fail(p, "duplicate brand");
  if (attr(html, "description").length < 40) fail(p, "meta description");
  if (!attr(html, "robots").includes("max-image-preview:large")) fail(p, "image preview directive");
  if (!html.includes('rel="canonical" href="' + canonical + '"')) fail(p, "self-referencing canonical");
  const esFile = partner + "index.html";
  const enFile = "en/" + partner + "index.html";
  // Some research profiles currently exist in English only. Never declare nonexistent translations.
  if (exists(esFile) && exists(enFile)) {
    for (const [localeCode, url] of [["es-MX", es], ["en-US", eng], ["x-default", es]]) {
      if (!html.includes('hreflang="' + localeCode + '" href="' + url + '"')) fail(p, "hreflang " + localeCode);
    }
  } else if (html.includes('hreflang="es-MX"') || html.includes('hreflang="en-US"')) {
    fail(p, "unpaired page must not advertise nonexistent localized counterpart");
  }
  for (const k of ["og:title", "og:description", "og:image", "og:url", "og:locale", "og:locale:alternate"]) {
    if (!attr(html, k, "property")) fail(p, "missing " + k);
  }
  for (const k of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!attr(html, k)) fail(p, "missing " + k);
  }
  if (attr(html, "og:url", "property") !== canonical) fail(p, "OG URL mismatch");
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (scripts.length !== 1) fail(p, "expected one JSON-LD script");
  else {
    try {
      const doc = JSON.parse(scripts[0][1]);
      const nodes = doc["@graph"] || [];
      if (doc["@context"] !== "https://schema.org") fail(p, "schema context");
      for (const typ of ["Organization", "WebSite", "WebPage"]) {
        if (!nodes.some((n) => n["@type"] === typ)) fail(p, "schema node " + typ);
      }
      const page = nodes.find((n) => n["@type"] === "WebPage");
      if (!page || page.url !== canonical || page.inLanguage !== locale) fail(p, "schema URL or language");
      if (p !== "index.html" && p !== "en/index.html" && !nodes.some((n) => n["@type"] === "BreadcrumbList")) fail(p, "breadcrumb schema");
      if (["cancun", "mexico-city", "los-cabos"].some((city) => p === city + "/index.html" || p === "en/" + city + "/index.html") && !nodes.some((n) => n["@type"] === "TouristDestination")) fail(p, "destination schema");
      if (nodes.some((n) => ["Review", "AggregateRating"].includes(n["@type"]))) fail(p, "unverified rating data");
    } catch (err) { fail(p, "invalid JSON-LD: " + err.message); }
  }
  // Make sure root-relative image and stylesheet references point to files in this repository.
  for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    const asset=m[1].split("?")[0].slice(1);
    if (!exists(asset)) fail(p, "missing local asset " + m[1]);
  }
  if (!attr(html, "robots").startsWith("noindex")) indexable.add(canonical);
  for (const m of html.matchAll(/\bhref="(\/[^"]*)"/g)) {
    const [raw, anchor] = m[1].split("#");
    const route = raw.split("?")[0];
    const target = route === "/" ? "index.html" : route.endsWith("/") ? route.slice(1) + "index.html" : route.slice(1);
    if (route && !exists(target)) fail(p, "broken internal link " + m[1]);
    else if (anchor && route && exists(target) && !read(target).includes('id="' + anchor + '"')) fail(p, "missing fragment " + m[1]);
  }
}
const listed = new Set([...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const u of indexable) if (!listed.has(u)) fail("sitemap.xml", "missing " + u);
for (const u of listed) if (!indexable.has(u)) fail("sitemap.xml", "unexpected/noindex " + u);
if (!read("robots.txt").includes("OAI-SearchBot")) fail("robots.txt", "AI search user agent");
if (!read("robots.txt").includes(SITE + "/sitemap.xml")) fail("robots.txt", "sitemap reference");
if (!exists("llms.txt")) fail("llms.txt", "optional navigation file");
if (issues.length) {
  for (const i of issues) console.error("ERROR " + i);
  console.error(issues.length + " technical SEO issues found.");
  process.exitCode = 1;
} else {
  console.log("SEO check passed: " + pageFiles.length + " pages, " + indexable.size + " indexable URLs.");
}
