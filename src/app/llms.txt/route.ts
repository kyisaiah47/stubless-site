import { PRODUCT, SOURCES } from '@/lib/product';
export function GET() { return new Response(`# ${PRODUCT.name}\n\n${PRODUCT.title}\n\n${PRODUCT.lede}\n\nRepository: ${PRODUCT.repo}\nHost: ${PRODUCT.host}\n\n## Sources\n${SOURCES.map((source) => `- ${source.cite}: ${source.url}`).join('\n')}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } }); }
