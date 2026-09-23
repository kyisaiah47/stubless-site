import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { launchSafe } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';
const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const puppeteer = require('puppeteer-core');
const root = resolve(new URL('..', import.meta.url).pathname); const out = resolve(root, 'review'); const base = process.argv[2] ?? 'http://localhost:3307';
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
const browser = await launchSafe(puppeteer, { headless: true }); const views = [{ id: 'default', action: null }, { id: 'threshold-80', action: async (p) => p.$$eval('.chip', (bs) => bs[2].click()) }, { id: 'app-strip', action: async (p) => p.click('.app-switch') }]; const ledger = [];
for (const view of views) { const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 }); const res = await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 }); await page.evaluate(() => document.fonts.ready); if (view.action) { await view.action(page); await new Promise((r) => setTimeout(r, 300)); } const total = await page.evaluate(() => document.documentElement.scrollHeight); const tiles = Math.ceil(total / 900); for (let i = 0; i < tiles; i++) { await page.evaluate((y) => window.scrollTo(0, y), i * 900); await page.screenshot({ path: resolve(out, `${view.id}-${String(i + 1).padStart(2, '0')}.png`) }); } const box = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth })); ledger.push({ id: view.id, status: res?.status(), total, tiles, ...box }); await page.close(); }
writeFileSync(resolve(out, 'ledger.json'), JSON.stringify({ vw: 1440, views: ledger }, null, 2)); await browser.close(); console.log(JSON.stringify(ledger, null, 2));
