import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

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

function decodeHtmlAttribute(value) {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&");
}

const scriptHashes = new Set();
for (const file of await findHtmlFiles(dist)) {
  const html = await readFile(file, "utf8");
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attributes, content] = script;
    if (/(?:^|\s)src\s*=/i.test(attributes)) {
      continue;
    }

    scriptHashes.add(
      `'sha256-${createHash("sha256").update(content).digest("base64")}'`,
    );
  }

  const match = html.match(
    /<meta\s+http-equiv="content-security-policy"\s+content="([^"]+)">/i,
  );
  if (!match) {
    assert.match(
      html,
      /<meta\s+http-equiv="refresh"/i,
      `${path.relative(root, file)} must contain CSP metadata or be a redirect fallback`,
    );
    continue;
  }

  const content = decodeHtmlAttribute(match[1]);
  const scriptDirective = content
    .split(";")
    .find((directive) => directive.trimStart().startsWith("script-src "));
  assert.ok(scriptDirective, `${path.relative(root, file)} must contain script-src`);
  for (const hash of scriptDirective.match(/'sha(?:256|384|512)-[^']+'/g) ?? []) {
    scriptHashes.add(hash);
  }
}

assert.ok(scriptHashes.size > 0, "Astro build must emit at least one script hash");

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scriptHashes].sort().join(" ")}`,
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
].join("; ") + ";";

await writeFile(
  path.join(dist, "_headers"),
  `/*\n  Content-Security-Policy: ${csp}\n`,
  "utf8",
);

console.log(`Generated Netlify CSP with ${scriptHashes.size} emitted script hashes.`);
