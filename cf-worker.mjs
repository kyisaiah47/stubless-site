// Worker entry. stubless is now part of ShipProbe, so every path on this host answers 308 with the
// matching ShipProbe page: the crawl files go to the same file on ShipProbe's host, and every other
// path, static assets included, goes to /agents-md, the page for `shipprobe agents-md`. assets.run_worker_first in
// wrangler.jsonc sends asset paths through this handler too. The Next app is still built and its
// Durable Object classes are still exported, because wrangler.jsonc binds them. Nothing else is
// exported: the Workers runtime reads every named export as an entrypoint and refuses a constant.
import { default as handler } from "./.open-next/worker.js";

const SHIPPROBE = "https://shipprobe.thecompound.tech";
const PAGE = "/agents-md";
const SAME_PATH = new Set(["/llms.txt", "/robots.txt", "/sitemap.xml"]);

function shipprobeUrl(requestUrl) {
  const { pathname } = new URL(requestUrl);
  return SHIPPROBE + (SAME_PATH.has(pathname) ? pathname : PAGE);
}

export default {
  ...handler,
  async fetch(request) {
    return Response.redirect(shipprobeUrl(request.url), 308);
  },
};

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
