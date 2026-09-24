/* THE DEPLOY GATE. A deploy that ships nothing must not exit 0.
 *
 * Copied from deferless-site's verify-cf.mjs. ROUTES trimmed to what this repo actually serves:
 * stubless-site has no src/app/robots.ts, sitemap.ts or llms.txt route, only the one page.
 */
const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('verify-cf: no base url given');
  process.exit(1);
}

const ROUTES = [
  ['/', 200],
];

async function tryOnce(path, want) {
  try {
    const res = await fetch(base + path, { redirect: 'manual' });
    return res.status === want;
  } catch {
    return false;
  }
}

async function checkRoute(path, want) {
  for (let i = 0; i < 6; i++) {
    if (await tryOnce(path, want)) return true;
    await new Promise((r) => setTimeout(r, 2500));
  }
  return false;
}

let failed = 0;
for (const [path, want] of ROUTES) {
  const ok = await checkRoute(path, want);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${base}${path} (want ${want})`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`verify-cf: ${failed} route(s) did not answer as expected`);
  process.exit(1);
}
console.log('verify-cf: all routes answered as expected');
