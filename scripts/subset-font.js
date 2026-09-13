#!/usr/bin/env node
// Scan src/ for all characters, generate subset font via pyftsubset
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import wawoff2 from "wawoff2";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function scanDir(dir) {
  let chars = new Set();
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (
      f.isDirectory() &&
      !["node_modules", "dist", ".astro", ".git"].includes(f.name)
    ) {
      chars = new Set([...chars, ...scanDir(full)]);
    } else if (/\.(md|mdx|astro|html|css|ts|json)$/.test(f.name)) {
      const content = fs.readFileSync(full, "utf-8");
      for (const c of content) chars.add(c);
    }
  }
  return chars;
}

console.log("Scanning src/ for characters...");
const chars = scanDir("src");

const filtered = new Set(
  [...chars].filter((c) => {
    const code = c.codePointAt(0);
    return (
      (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified
      (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
      (code >= 0x3000 && code <= 0x303f) || // CJK Symbols
      (code >= 0xff00 && code <= 0xffef) || // Fullwidth
      (code >= 0x0020 && code <= 0x007e) || // Basic Latin
      (code >= 0x00a0 && code <= 0x00ff) || // Latin-1 Supplement
      (code >= 0x2000 && code <= 0x206f) || // General Punctuation
      (code >= 0x2010 && code <= 0x2027) || // Dash/Quotes
      (code >= 0x2030 && code <= 0x205e) || // Vertical forms
      (code >= 0x2100 && code <= 0x214f) || // Letterlike
      (code >= 0x2190 && code <= 0x21ff) || // Arrows
      (code >= 0x2200 && code <= 0x22ff) || // Math
      (code >= 0x2500 && code <= 0x257f) || // Box Drawing
      (code >= 0x2580 && code <= 0x259f) || // Block Elements
      (code >= 0x25a0 && code <= 0x25ff) || // Geometric Shapes
      (code >= 0x3001 && code <= 0x3003) || // CJK punctuation
      (code >= 0xfe30 && code <= 0xfe4f) || // CJK Compatibility
      code === 0x2028 ||
      code === 0x2029
    );
  })
);

// Write charset for pyftsubset
const charset = [...filtered]
  .sort()
  .map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"));
const charsetPath = path.join(__dirname, "..", "charset.txt");
fs.writeFileSync(charsetPath, charset.join("\n"));
console.log(`Found ${filtered.size} characters to subset.`);

// Run pyftsubset
const srcTtf = path.join(__dirname, "..", "src/assets/fonts/LXGWWenKaiMono-Regular.ttf");
const outTtf = path.join(__dirname, "..", "src/assets/fonts/LXGWWenKaiMono-Regular.subset.ttf");

if (!fs.existsSync(srcTtf)) {
  console.error("Source TTF not found:", srcTtf);
  process.exit(1);
}

console.log("Running pyftsubset...");
execSync(
  `pyftsubset "${srcTtf}" --unicodes-file="${charsetPath}" --output-file="${outTtf}" --layout-features='*'`,
  { stdio: "inherit" }
);

// Convert to woff2
console.log("Converting to WOFF2...");
const ttfBuf = fs.readFileSync(outTtf);
const output = await wawoff2.compress(new Uint8Array(ttfBuf));
const outWoff2 = path.join(__dirname, "..", "src/assets/fonts/LXGWWenKaiMono-Regular.woff2");
fs.writeFileSync(outWoff2, Buffer.from(output));

// Copy to public/fonts/ for static serving
const publicWoff2 = path.join(__dirname, "..", "public/fonts/lxgw-wenkai-mono.woff2");
fs.mkdirSync(path.dirname(publicWoff2), { recursive: true });
fs.copyFileSync(outWoff2, publicWoff2);

const woff2Size = fs.statSync(outWoff2).size;
const ttfSize = fs.statSync(outTtf).size;
console.log(`Subset TTF: ${(ttfSize / 1024).toFixed(1)}KB -> WOFF2: ${(woff2Size / 1024).toFixed(1)}KB`);
console.log("Done!");
