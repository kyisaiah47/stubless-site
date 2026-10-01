import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import { SimpleFooter, SimpleHeader } from '@/components/site-view/SimpleHome';

/* The site publishes one page. A wrong address gets the product's own header and footer, with
 * the view controls, and the ways back, in either view. */
export default function NotFound() {
  return (
    <>
      <SimpleHeader />
      <main className="sv-shell sv-page">
        <header className="sv-page-heading">
          <span className="sv-label">NOT FOUND</span>
          <h1>There is no page at that address.</h1>
          <p>This site has one page. The Action&rsquo;s usage, inputs and exit codes are in its repository.</p>
        </header>
        <nav className="sv-links sv-links-top" aria-label="Ways back">
          <Link href="/">The stubless page ↗</Link>
          <a href={`${PRODUCT.repo}#usage`}>Usage on GitHub ↗</a>
          <a href="https://rulestack.thecompound.tech">RuleStack ↗</a>
        </nav>
      </main>
      <SimpleFooter />
    </>
  );
}
