// Dompet Prasetyo — hand-in program for the best household budget site bounty.
// Node 22, standard library only. It copies this repository's app/ and
// screenshots/ into the output directory and writes /output/dossier.json with
// the vendored make.fun library, exactly as the gate re-derives it.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Validate the dossier figures before handing anything in -------------
// The site's claim: 44 November transactions, 9 categories totalling
// Rp 6.600.000 spent, + Rp 1.500.000 saved + Rp 400.000 buffer = Rp 8.500.000
// take-home. If the figures in app/data.js ever drift, refuse loudly instead
// of submitting a site whose own numbers do not add up.
const dataSource = readFileSync(join(here, 'app', 'data.js'), 'utf8');
// Count only inside the TRANSACTIONS array (BILLS also has `amount:` fields).
const txBlock = dataSource.match(/export const TRANSACTIONS = \[([\s\S]*?)\n\];/);
if (!txBlock) throw new Error('dossier check: TRANSACTIONS array not found in app/data.js');
const amounts = [...txBlock[1].matchAll(/amount:\s*(\d+)/g)].map((m) => Number(m[1]));
if (amounts.length !== 44) {
  throw new Error(`dossier check: expected 44 transaction amounts in app/data.js, found ${amounts.length}`);
}
const spent = amounts.reduce((sum, n) => sum + n, 0);
const expectedSpent = 6600000;
if (spent !== expectedSpent) {
  throw new Error(`dossier check: transactions sum to ${spent}, expected ${expectedSpent}`);
}
const incomeMatch = dataSource.match(/income:\s*(\d+)/);
const savedMatch = dataSource.match(/saved:\s*(\d+)/);
const bufferMatch = dataSource.match(/buffer:\s*(\d+)/);
const income = Number(incomeMatch?.[1]);
const saved = Number(savedMatch?.[1]);
const buffer = Number(bufferMatch?.[1]);
if (spent + saved + buffer !== income) {
  throw new Error(
    `dossier check: spent ${spent} + saved ${saved} + buffer ${buffer} != income ${income}`,
  );
}

// --- Hand the site in ----------------------------------------------------
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

const shots = existsSync(join(here, 'screenshots'))
  ? readdirSync(join(here, 'screenshots')).filter((f) => !f.startsWith('.'))
  : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`dossier check: expected 3 or 4 screenshots, found ${shots.length}`);
}
// Screenshots must each fit the gate's 256 KiB cap and be real renders.
for (const shot of shots) {
  const { size } = statSync(join(here, 'screenshots', shot));
  if (size > 262144) {
    throw new Error(`dossier check: screenshot ${shot} is ${size} bytes, over the 256 KiB cap`);
  }
  if (!/\.(png|jpe?g)$/i.test(shot)) {
    throw new Error(`dossier check: screenshot ${shot} is not a PNG or JPEG`);
  }
}

// The scorer's own caps (from the kit's rules): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(
  `Dompet Prasetyo handed in: ${shots.length} screenshots, ` +
    `44 transactions totalling Rp ${spent.toLocaleString('id-ID')}, ` +
    `income Rp ${income.toLocaleString('id-ID')} reconciles.`,
);
