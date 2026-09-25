import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import { PRODUCT } from '@/lib/product';
import './globals.css';

const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'] });
export const metadata: Metadata = {
  title: 'stubless, the RuleStack score gate',
  description: "Score a repository's agent instructions, then fail the job below its threshold.",
  metadataBase: new URL(PRODUCT.host),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'stubless, the RuleStack score gate',
    description: "Score a repository's agent instructions, then fail the job below its threshold.",
    images: [{ url: '/icon.svg', alt: 'stubless, the RuleStack score gate' }],
  },
  twitter: {
    card: 'summary',
    title: 'stubless, the RuleStack score gate',
    description: "Score a repository's agent instructions, then fail the job below its threshold.",
    images: ['/icon.svg'],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: PRODUCT.name, url: PRODUCT.host, publisher: { '@type': 'Organization', '@id': 'https://thecompound.tech/#organization', name: 'Compound Labs', url: 'https://thecompound.tech' } }; return <html lang="en" className={mono.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><SmoothScroll />{children}</body></html>; }
