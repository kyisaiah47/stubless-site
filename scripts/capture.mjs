#!/usr/bin/env node
/* THE CONSOLE'S DATA. Runs the real stubless binary against real repositories, against the live
 * RuleStack, and freezes what came back into src/lib/run.ts.
 *
 *   npm run capture
 *
 * ⛔ IT RUNS THE PROGRAM. It does not re-implement the gate, re-score anything, or compose a
 * sentence the gate did not print. The binary is ~/CompoundLabs/packages/stubless/bin/stubless.mjs,
 * unmodified, invoked the way the action invokes it: every input in the environment.
 *
 * ⛔ IT WRITES A MODULE, NOT A DATA FILE. The Worker has no filesystem, so a page that read a
 * .json off disk at request time would render empty in production and correct in dev. Measured
 * on shelfcite, 2026-09-19.
 *
 * ⛔ THE SET IS FIXED BEFORE THE RUN AND NOTHING IS DROPPED FOR ITS SCORE. The subjects are the
 * repositories in the Compound Labs "Dev tools" family, read from
 * compound-ops/roster/app-families.json, plus the packages this action ships beside. A
 * repository that came back with no instruction file stays in the table: that answer is exit 1
 * and it is the finding this action exists to make.
 *
 * ⛔ STDERR IS MERGED. A first cut that took stdout alone on the sibling package came back with
 * 29 of 44 lines and none of the violations, and reported a clean run.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HOME = os.homedir();
const BIN = path.join(HOME, 'CompoundLabs/packages/stubless/bin/stubless.mjs');
const FAMILIES = path.join(HOME, 'CompoundLabs/compound-ops/roster/app-families.json');
const ESTATE = path.join(HOME, 'CompoundLabs');
const API = 'https://rulestack.thecompound.tech';

if (!fs.existsSync(BIN)) throw new Error(`the stubless binary is not at ${BIN}`);

/** slug -> the directory on this machine, which is the slug or the slug plus -site. */
function dirFor(slug) {
  for (const c of [slug, `${slug}-site`, path.join('packages', slug)]) {
    const d = path.join(ESTATE, c);
    if (fs.existsSync(path.join(d, '.git'))) return d;
  }
  return null;
}

function remoteOf(dir) {
  try {
    const url = execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
    const m = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/.exec(url);
    return m ? `${m[1]}/${m[2]}` : null;
  } catch {
    return null;
  }
}

const dev = JSON.parse(fs.readFileSync(FAMILIES, 'utf8')).families.dev.apps;
const pkgs = fs.readdirSync(path.join(ESTATE, 'packages')).map((n) => `packages/${n}`);

const subjects = [];
for (const slug of [...dev, ...pkgs]) {
  const dir = slug.startsWith('packages/') ? path.join(ESTATE, slug) : dirFor(slug);
  if (!dir || !fs.existsSync(path.join(dir, '.git'))) continue;
  const repo = remoteOf(dir);
  if (!repo) continue;
  if (subjects.some((s) => s.repo === repo)) continue;
  subjects.push({ repo, dir, family: slug.startsWith('packages/') ? 'package' : 'dev' });
}

/* The descriptor, read once so the page can say what the recogniser recognised on the day. The
 * gate reads it again per run; this copy is for the rail, never for the scoring. */
const desc = await fetch(`${API}/api/score`).then((r) => r.json());

const rows = [];
let firstStdout = null;
let firstStdoutRepo = null;

for (const s of subjects) {
  const env = {
    ...process.env,
    STUBLESS_WORKSPACE: s.dir,
    STUBLESS_REPO: s.repo,
    STUBLESS_API: API,
    STUBLESS_THRESHOLD: '60',
    STUBLESS_BADGE: 'true',
    RUNNER_TEMP: fs.mkdtempSync(path.join(os.tmpdir(), 'stubless-')),
  };
  delete env.GITHUB_STEP_SUMMARY;
  delete env.GITHUB_OUTPUT;
  delete env.STUBLESS_PER_FILE_THRESHOLD;

  let out = '';
  let code = 0;
  try {
    out = execFileSync(process.execPath, [BIN, 'gate'], { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    code = e.status ?? 2;
    out = `${e.stdout || ''}${e.stderr || ''}`;
  }
  /* A crash of the harness itself is not a score. Refuse rather than write a row that says the
   * repository is clean because nothing ran. */
  if (code === 2) throw new Error(`stubless exited 2 on ${s.repo}. Nothing was scored.\n${out}`);

  const report = path.join(env.RUNNER_TEMP, 'stubless-report.json');
  const files = fs.existsSync(report) ? JSON.parse(fs.readFileSync(report, 'utf8')).files : [];

  rows.push({
    repo: s.repo,
    set: s.family,
    exit: code,
    files: files.map((f) => ({
      path: f.path,
      format: f.format,
      formatName: f.formatName,
      quality: f.quality,
      rawPoints: f.rawPoints,
      cappedAt100: !!f.cappedAt100,
      words: f.metrics.words,
      headings: f.metrics.headings,
      commands: f.metrics.commands,
      codeBlocks: f.metrics.codeBlocks,
      tags: f.metrics.sectionTags,
      capabilities: f.capabilities.map((c) => ({ key: c.key, label: c.label, points: c.points, max: c.max, detail: c.detail })),
      reasons: [...f.reasons, ...f.publishable.reasons].map((r) => ({ text: r.text, line: r.line ?? null, located: !!r.located })),
    })),
  });

  if (firstStdout === null && files.length) {
    firstStdout = out;
    firstStdoutRepo = s.repo;
  }
  process.stdout.write(`  ${s.repo.padEnd(34)} exit ${code}  ${files.length} file(s)  ${files.map((f) => f.quality).join(',') || 'none'}\n`);
}

if (!rows.length) throw new Error('no repository was scored. Refusing to write an empty capture.');
if (firstStdout === null) throw new Error('every repository came back with no file. Refusing to write a capture with no output in it.');

/* The whole job summary for one repository, byte for byte as the gate printed it. The gate
 * writes it to GITHUB_STEP_SUMMARY on a runner and to stdout everywhere else, which is why the
 * two environment variables above are deleted rather than inherited. */
const SUMMARY = firstStdout.replace(/\n+$/, '');

const banded = desc.recogniser.formats.map((f) => ({
  kind: f.kind,
  format: f.format,
  name: f.name,
  filename: f.filename,
}));

const body =
  `/* GENERATED by scripts/capture.mjs. Do not edit: run \`npm run capture\`.\n` +
  ` *\n` +
  ` * Every number here came back from ${API}/api/score, reached by the real stubless binary\n` +
  ` * at packages/stubless/bin/stubless.mjs. Nothing in this file was typed by hand and nothing\n` +
  ` * in it was scored anywhere but RuleStack.\n` +
  ` */\n\n` +
  `export const RUN = ${JSON.stringify(
    {
      scoredAt: new Date().toISOString(),
      api: API,
      endpoint: desc.endpoint,
      recogniserReadAt: desc.recogniser.readAt,
      recogniserSource: desc.recogniser.source,
      limits: desc.limits,
      formats: banded,
      summaryRepo: firstStdoutRepo,
      repos: rows,
    },
    null,
    1,
  )} as const;\n\n` +
  `/** The job summary the gate printed for ${firstStdoutRepo}, byte for byte. */\n` +
  `export const SUMMARY = ${JSON.stringify(SUMMARY)};\n`;

fs.writeFileSync(path.join(ROOT, 'src/lib/run.ts'), body);
process.stdout.write(`\nwrote src/lib/run.ts: ${rows.length} repositories, ${rows.reduce((n, r) => n + r.files.length, 0)} file(s)\n`);
