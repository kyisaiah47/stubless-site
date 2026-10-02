/* THE DEPLOY GATE. A deploy that ships nothing must not exit 0.
 *
 * stubless is now part of ShipProbe. Every path on this host answers 308 with the matching ShipProbe
 * page, so each route is checked for the status AND the Location it points to. A static asset
 * path is in the list because asset requests reach the redirect only through run_worker_first.
 */
const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('verify-cf: no base url given');
  process.exit(1);
}

const SHIPPROBE = 'https://shipprobe.thecompound.tech';
const ROUTES = [
  ['/', 308, SHIPPROBE + '/agents-md'],
  ['/robots.txt', 308, SHIPPROBE + '/robots.txt'],
  ['/sitemap.xml', 308, SHIPPROBE + '/sitemap.xml'],
  ['/llms.txt', 308, SHIPPROBE + '/llms.txt'],
  ['/favicon.ico', 308, SHIPPROBE + '/agents-md'],
];

async function tryOnce(path, want, location) {
  try {
    const res = await fetch(base + path, { redirect: 'manual' });
    return res.status === want && res.headers.get('location') === location;
  } catch {
    return false;
  }
}

async function checkRoute(path, want, location) {
  for (let i = 0; i < 6; i++) {
    if (await tryOnce(path, want, location)) return true;
    await new Promise((r) => setTimeout(r, 2500));
  }
  return false;
}

let failed = 0;
for (const [path, want, location] of ROUTES) {
  const ok = await checkRoute(path, want, location);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${base}${path} (want ${want} to ${location})`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`verify-cf: ${failed} route(s) did not answer as expected`);
  process.exit(1);
}
console.log('verify-cf: all routes answered as expected');
