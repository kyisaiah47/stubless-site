import type { MetadataRoute } from 'next';
import { PRODUCT } from '@/lib/product';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: `${PRODUCT.host}/sitemap.xml` }; }
