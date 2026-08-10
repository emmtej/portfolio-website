import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const primaryOrigin = "https://www.emmanueltejeda.com";

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function assertIncludes(content, expected, file) {
  assert.ok(content.includes(expected), `${file} must contain ${expected}`);
}

function assertExcludes(content, unexpected, file) {
  assert.ok(!content.includes(unexpected), `${file} must not contain ${unexpected}`);
}

const sitemapIndex = await readFile(path.join(dist, "sitemap-index.xml"), "utf8");
assertIncludes(sitemapIndex, `${primaryOrigin}/sitemap-0.xml`, "dist/sitemap-index.xml");

const sitemap = await readFile(path.join(dist, "sitemap-0.xml"), "utf8");
for (const pathName of ["/about/", "/it/about/", "/404/", "/it/404/"]) {
  assertExcludes(sitemap, `<loc>${primaryOrigin}${pathName}</loc>`, "dist/sitemap-0.xml");
}

const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
assertIncludes(
  robots,
  `Sitemap: ${primaryOrigin}/sitemap-index.xml`,
  "dist/robots.txt",
);
assertExcludes(robots, "/sitemap.xml", "dist/robots.txt");

const pages = [
  ["dist/index.html", "/", "/", "/it/"],
  ["dist/audio/index.html", "/audio/", "/audio/", "/it/audio/"],
  ["dist/contact/index.html", "/contact/", "/contact/", "/it/contact/"],
  ["dist/development/index.html", "/development/", "/development/", "/it/development/"],
  ["dist/it/index.html", "/it/", "/", "/it/"],
  ["dist/it/audio/index.html", "/it/audio/", "/audio/", "/it/audio/"],
  ["dist/it/contact/index.html", "/it/contact/", "/contact/", "/it/contact/"],
  ["dist/it/development/index.html", "/it/development/", "/development/", "/it/development/"],
];

for (const [file, canonicalPath, englishPath, italianPath] of pages) {
  const html = await read(file);
  const canonical = `${primaryOrigin}${canonicalPath}`;
  assertIncludes(html, `<link rel="canonical" href="${canonical}">`, file);
  assertIncludes(html, `<meta property="og:url" content="${canonical}">`, file);
  assertIncludes(html, `<meta property="twitter:url" content="${canonical}">`, file);
  assertIncludes(html, `<meta property="og:image" content="${primaryOrigin}/og-image.png">`, file);
  assertIncludes(html, `<meta property="twitter:image" content="${primaryOrigin}/og-image.png">`, file);
  assertIncludes(html, `hreflang="en" href="${primaryOrigin}${englishPath}"`, file);
  assertIncludes(html, `hreflang="it" href="${primaryOrigin}${italianPath}"`, file);
  assertIncludes(html, `hreflang="x-default" href="${primaryOrigin}${englishPath}"`, file);
  assertExcludes(html, "https://emmanueltejeda.com", file);
}

const errorPages = [
  ["dist/404.html", "en", 'href="/it/" aria-label="Toggle language"'],
  ["dist/it/404/index.html", "it", 'href="/" aria-label="Cambia lingua"'],
];

for (const [file, language, switchMarkup] of errorPages) {
  const html = await read(file);
  assertIncludes(html, `<html lang="${language}">`, file);
  assertIncludes(html, '<meta name="robots" content="noindex,follow">', file);
  assertIncludes(html, switchMarkup, file);
  for (const metadata of [
    '<link rel="canonical"',
    'rel="alternate"',
    'property="og:url"',
    'property="twitter:url"',
  ]) {
    assertExcludes(html, metadata, file);
  }
}

const netlify = await read("netlify.toml");
for (const rule of [
  'from = "/about"\n  to = "/"\n  status = 301\n  force = true',
  'from = "/it/about"\n  to = "/it/"\n  status = 301\n  force = true',
  'from = "/it/*"\n  to = "/it/404/"\n  status = 404',
]) {
  assertIncludes(netlify, rule, "netlify.toml");
}

assertIncludes(
  netlify,
  'Referrer-Policy = "strict-origin-when-cross-origin"',
  "netlify.toml",
);
assertIncludes(
  netlify,
  'Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(), usb=()"',
  "netlify.toml",
);
assertExcludes(netlify, 'Content-Security-Policy =', "netlify.toml");

const generatedHeaders = await readFile(path.join(dist, "_headers"), "utf8");
for (const directive of [
  "default-src 'self'",
  "script-src 'self' 'sha256-",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
]) {
  assertIncludes(generatedHeaders, directive, "dist/_headers");
}
for (const unsafeScope of [
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https:",
  "img-src 'self' data: https:",
  "https://www.youtube.com/iframe_api",
  "https://s.ytimg.com",
]) {
  assertExcludes(generatedHeaders, unsafeScope, "dist/_headers");
}

const audioHtml = await read("dist/audio/index.html");
assertExcludes(audioHtml, "img.youtube.com", "dist/audio/index.html");
assertExcludes(audioHtml, "ytimg.com", "dist/audio/index.html");

const builtAssets = await readdir(path.join(dist, "_astro"));
for (const asset of builtAssets.filter((file) => file.endsWith(".js"))) {
  const source = await readFile(path.join(dist, "_astro", asset), "utf8");
  assertExcludes(source, "img.youtube.com", `dist/_astro/${asset}`);
  assertExcludes(source, "www.youtube.com/iframe_api", `dist/_astro/${asset}`);
  assertExcludes(source, "s.ytimg.com", `dist/_astro/${asset}`);
}

console.log("Verified metadata, routing, strict CSP, headers, and pre-activation media privacy.");
