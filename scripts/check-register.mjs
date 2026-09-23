#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const failures = [];
const check = (name, ok, detail) => (ok ? console.log(`  ok    ${name} ${detail}`) : failures.push(`${name} ${detail}`));
const files = fs.readdirSync(path.join(root, 'src'), { recursive: true }).filter((f) => typeof f === 'string' && fs.statSync(path.join(root, 'src', f)).isFile()).map((f) => `src/${f}`);
const all = files.map((f) => read(f)).join('\n');
check('no em dashes', !/[\u2014\u2013\u2015\u2212]/u.test(all), 'copy and code use hyphens only');
check('accent', all.includes('#6FB8F9') && all.includes('#82CBFF'), 'declared accent and hover are present');
check('accent homes', !/status[^\n]*#6FB8F9/i.test(all), 'status selectors do not use the accent');
check('sources', /export const SOURCES/.test(read('src/lib/product.ts')) && (read('src/lib/product.ts').match(/read_at:/g) || []).length >= 8, 'claims carry source rows');
check('source rendering', /SOURCES\.slice/.test(read('src/components/Console.tsx')), 'source rows render on the page');
check('number flow', /NumberFlow/.test(read('src/components/Console.tsx')), 'changed figures use number flow');
check('lenis', /allowNestedScroll: true/.test(read('src/components/SmoothScroll.tsx')) && /prefers-reduced-motion/.test(read('src/components/SmoothScroll.tsx')), 'nested scroll and reduced motion are handled');
check('credit', /@id.*thecompound\.tech\/#organization/.test(read('src/app/layout.tsx')) && /Built by/.test(read('src/components/Console.tsx')) && /hello@thecompound\.tech/.test(read('src/components/Console.tsx')), 'publisher, mark, copyright and contact are present');
check('single source', (all.match(/https:\/\/stubless\.thecompound\.tech/g) || []).length <= 1, 'host is declared once');
check('no paid key', !/ANTHROPIC_API_KEY|OPENAI_API_KEY|api\.openai\.com|api\.anthropic\.com/.test(all), 'no paid inference key is referenced');
check('no full column picture', !/img\s*\{[^}]*width:\s*100%/.test(read('src/app/globals.css')), 'pictures stay marks');
check('registered package', /version: '0\.1\.0'/.test(read('src/lib/product.ts')) && /stubless/.test(read('src/lib/product.ts')), 'product vocabulary is centralised');
for (const f of failures) console.log(`  FAIL  ${f}`);
console.log(`\n${12 - failures.length} clause(s) held, ${failures.length} refused`);
process.exit(failures.length ? 1 : 0);
