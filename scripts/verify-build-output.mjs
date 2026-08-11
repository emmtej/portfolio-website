import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? findHtmlFiles(target)
        : Promise.resolve(entry.name.endsWith(".html") ? [target] : []);
    }),
  );
  return files.flat();
}

function countMainContentIds(html) {
  const matches = html.match(/id="main-content"/g);
  return matches ? matches.length : 0;
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`(?:^|\\s)${escapedName}="([^"]*)"`))?.[1] ?? null;
}

function hasBooleanAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escapedName}(?:\\s|>)`).test(tag);
}

function getForms(html) {
  return html.match(/<form\b[^>]*>[\s\S]*?<\/form>/g) ?? [];
}

function getOpeningTag(form) {
  return form.match(/^<form\b[^>]*>/)?.[0] ?? "";
}

function getNamedControls(form) {
  return [...form.matchAll(/<(?:input|textarea|select)\b[^>]*>/g)].map(
    ([tag]) => ({
      tag,
      name: getAttribute(tag, "name"),
    }),
  );
}

function getScripts(html) {
  return [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(
    (match) => {
      const fullTag = match[0];
      return {
        content: fullTag.replace(/^<script\b[^>]*>|<\/script>$/g, ""),
        index: match.index,
        openingTag: fullTag.match(/^<script\b[^>]*>/)?.[0] ?? "",
      };
    },
  );
}

function verifyThemeInitializer(html, file) {
  const headStart = html.indexOf("<head>");
  const headEnd = html.indexOf("</head>");
  const bodyStart = html.indexOf("<body");
  assert.ok(headStart >= 0 && headEnd > headStart, `${file} must contain a head element`);
  assert.ok(bodyStart > headEnd, `${file} head must precede body`);

  const themeScripts = getScripts(html).filter(({ content }) =>
    content.includes('localStorage.getItem("theme")'),
  );
  assert.equal(themeScripts.length, 1, `${file} must contain one theme initializer`);

  const themeScript = themeScripts[0];
  assert.ok(
    themeScript.index > headStart && themeScript.index < headEnd,
    `${file} theme initializer must be inside head`,
  );
  for (const attribute of ["type", "src"]) {
    assert.equal(
      getAttribute(themeScript.openingTag, attribute),
      null,
      `${file} theme initializer must not have ${attribute}`,
    );
  }
  for (const attribute of ["async", "defer"]) {
    assert.equal(
      hasBooleanAttribute(themeScript.openingTag, attribute),
      false,
      `${file} theme initializer must not be ${attribute}`,
    );
  }

  const stylesheetIndex = html.indexOf('<link rel="stylesheet"', headStart);
  assert.ok(stylesheetIndex > headStart, `${file} must contain a stylesheet in head`);
  assert.ok(
    themeScript.index < stylesheetIndex && themeScript.index < bodyStart,
    `${file} theme initializer must execute before stylesheets and body content`,
  );

  const hash = `'sha256-${createHash("sha256")
    .update(themeScript.content)
    .digest("base64")}'`;
  return hash;
}

function verifyNetlifyContactForm(html, file) {
  const forms = getForms(html);
  const blueprintForms = forms.filter((form) => {
    const openingTag = getOpeningTag(form);
    return (
      getAttribute(openingTag, "data-netlify") === "true" &&
      hasBooleanAttribute(openingTag, "hidden")
    );
  });
  const interactiveForms = forms.filter(
    (form) =>
      getAttribute(getOpeningTag(form), "data-contact-form") === "interactive",
  );

  assert.equal(blueprintForms.length, 1, `${file} must contain one hidden Netlify blueprint`);
  assert.equal(interactiveForms.length, 1, `${file} must contain one interactive contact form`);

  const blueprint = blueprintForms[0];
  const interactive = interactiveForms[0];
  const blueprintTag = getOpeningTag(blueprint);
  const interactiveTag = getOpeningTag(interactive);
  const formName = getAttribute(blueprintTag, "name");
  const honeypotName = getAttribute(blueprintTag, "data-netlify-honeypot");

  assert.equal(formName, "contact", `${file} blueprint must use the contact form name`);
  assert.equal(honeypotName, "bot-field", `${file} blueprint must declare bot-field`);
  assert.equal(getAttribute(interactiveTag, "name"), formName, `${file} form names must match`);
  assert.equal(
    getAttribute(interactiveTag, "netlify-honeypot"),
    honeypotName,
    `${file} honeypot declarations must match`,
  );

  const blueprintFields = getNamedControls(blueprint)
    .map(({ name }) => name)
    .filter(Boolean)
    .sort();
  assert.deepEqual(
    blueprintFields,
    ["bot-field", "email", "message", "name"],
    `${file} blueprint fields must match the contact payload`,
  );

  const interactiveControls = getNamedControls(interactive);
  const interactiveFields = new Set(interactiveControls.map(({ name }) => name));
  for (const field of [...blueprintFields, "form-name"]) {
    assert.ok(interactiveFields.has(field), `${file} interactive form must contain ${field}`);
  }

  const formNameControl = interactiveControls.find(({ name }) => name === "form-name");
  assert.equal(
    formNameControl ? getAttribute(formNameControl.tag, "value") : null,
    formName,
    `${file} hidden form-name value must match the blueprint name`,
  );
}

const layoutPageFiles = [
  "dist/404.html",
  "dist/audio/index.html",
  "dist/contact/index.html",
  "dist/development/index.html",
  "dist/index.html",
  "dist/it/404/index.html",
  "dist/it/audio/index.html",
  "dist/it/contact/index.html",
  "dist/it/development/index.html",
  "dist/it/index.html",
];
const redirectPageFiles = [
  "dist/about/index.html",
  "dist/it/about/index.html",
];

const distHtmlFiles = (await findHtmlFiles(dist)).map((file) =>
  path.relative(root, file),
);
assert.deepEqual(
  distHtmlFiles.toSorted(),
  [...layoutPageFiles, ...redirectPageFiles].toSorted(),
  "Every generated HTML file must be classified as a layout page or redirect",
);

const themeScriptHashes = new Set();
for (const file of layoutPageFiles) {
  const html = await read(file);
  const count = countMainContentIds(html);
  assert.equal(
    count,
    1,
    `${file} must contain exactly one id="main-content" (found ${count})`,
  );
  themeScriptHashes.add(verifyThemeInitializer(html, file));
}

for (const file of redirectPageFiles) {
  const html = await read(file);
  assert.equal(countMainContentIds(html), 0, `${file} redirect must not contain main-content`);
  assertIncludes(html, '<meta http-equiv="refresh"', file);
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

for (const file of ["dist/contact/index.html", "dist/it/contact/index.html"]) {
  verifyNetlifyContactForm(await read(file), file);
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
for (const hash of themeScriptHashes) {
  assertIncludes(generatedHeaders, hash, "dist/_headers theme initializer CSP");
}
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

console.log(
  "Verified landmarks, metadata, routing, Netlify Forms, strict CSP, headers, and pre-activation media privacy.",
);
