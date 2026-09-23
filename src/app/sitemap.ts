import type { MetadataRoute } from 'next';
import { PRODUCT, ROUTES } from '@/lib/product';
export default function sitemap(): MetadataRoute.Sitemap { return ROUTES.map((route) => ({ url: `${PRODUCT.host}${route}`, lastModified: new Date('2026-09-23') })); }
