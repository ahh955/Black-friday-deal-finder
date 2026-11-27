// DealHound entry for black-friday-deal-finder-01 (Node 22, standard library only).
//
// The site lives in app/ next to this file: plain static files a browser opens
// with no build step and no network request. This program hands it in: it
// copies app/ and screenshots/ into the grader's output directory and writes
// dossier.json there with the vendored make.fun library, so the judge can read
// the screenshots and an outline of the source.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The hand-in is deterministic: every byte written comes from files in this
// repository, and nothing here reads the clock, rolls dice, or touches the
// network, so two runs write identical bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
// The grader provides /output; anywhere else MAKEFUN_OUTPUT_DIR stands in.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

// The whole site, as it stands in the repository.
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

// The screenshots of the site running, if the folder is present.
const shotsDir = join(repoRoot, 'screenshots');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier the judge reads: screenshots, the first load's files and
// bytes, and the source outline. The caps mirror the gate's own limits so a
// hand-in that passes here is shaped the way the scorer expects.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
