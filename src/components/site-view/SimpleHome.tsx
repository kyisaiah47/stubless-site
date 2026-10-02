'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EXITS, PRODUCT } from '@/lib/product';
import { RUN } from '@/lib/run';
import Disclosure from './Disclosure';
import ThemedSelect from './ThemedSelect';
import ViewControls from './ViewControls';
import { useDraft } from './SiteViewProvider';

/* The README's Usage block, byte for byte apart from the threshold value the reader picks. */
const workflow = (threshold: number) => `name: rulestack
on: [push, pull_request]
jobs:
  score:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kyisaiah47/stubless@v1
        with:
          threshold: '${threshold}'`;

/* The same four thresholds the Console bar offers. */
export const THRESHOLDS = [60, 70, 80, 90] as const;

/* The captured run of stubless's own repository, read back from RuleStack by the real binary. */
const OWN = RUN.repos.find((row) => row.repo === 'kyisaiah47/stubless');
const OWN_FILE = OWN?.files[0];

const NAV = [
  { href: '#example', label: 'What you get' },
  { href: '#exits', label: 'Exit codes' },
  { href: `${PRODUCT.repo}#usage`, label: 'Usage on GitHub ↗' },
  { href: 'https://rulestack.thecompound.tech', label: 'RuleStack ↗' },
];

export function SimpleHeader() {
  return (
    <header className="sv-nav">
      <div className="sv-shell sv-nav-in">
        <Link className="sv-brand" href="/">
          <img src="/icon.svg" alt="" width={22} height={22} />
          stubless
        </Link>
        <nav aria-label="Main navigation">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SimpleFooter() {
  return (
    <footer className="sv-footer">
      <div className="sv-shell sv-footer-in">
        <div>
          <span className="sv-credit">
            Built by <img src="/brand/compound-labs.svg" alt="Compound Labs" width={18} height={18} /> · © 2026
            stubless. A Compound Labs product.
          </span>
          <nav aria-label="Footer">
            <a href={PRODUCT.repo}>Repository ↗</a>
            <a href={`${PRODUCT.repo}#inputs`}>Inputs ↗</a>
            <a href="https://rulestack.thecompound.tech">RuleStack ↗</a>
            <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a>
          </nav>
        </div>
        <ViewControls />
      </div>
    </footer>
  );
}

function CopyWorkflow() {
  const [threshold, setThreshold] = useDraft<number>('threshold', 60);
  const [state, setState] = useState<'idle' | 'copied' | 'refused'>('idle');
  const text = workflow(threshold);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('refused');
    }
  }
  return (
    <>
      <ThemedSelect
        label="Fail the job below"
        options={THRESHOLDS.map((t) => ({ value: String(t), label: `${t} out of 100${t === 60 ? ' (the default)' : ''}` }))}
        value={String(threshold)}
        onChange={(v) => {
          setThreshold(Number(v));
          setState('idle');
        }}
      />
      <pre className="sv-yaml" aria-label=".github/workflows/rulestack.yml">
        <code>{text}</code>
      </pre>
      <button type="button" className="sv-primary" onClick={copy}>
        {state === 'copied' ? 'Copied. Save the workflow as .github/workflows/rulestack.yml' : 'Copy the workflow'}
      </button>
      <p className="sv-terms" role="status" aria-live="polite">
        {state === 'refused'
          ? 'This browser blocked the clipboard. Select the workflow above and copy it manually.'
          : `MIT licence. No runtime dependencies. Node 18 or later.`}
      </p>
    </>
  );
}

function ExampleRun() {
  const [threshold] = useDraft<number>('threshold', 60);
  if (!OWN_FILE) return null;
  const passes = OWN_FILE.quality >= threshold;
  return (
    <div className="sv-card sv-result">
      <div className="sv-step">
        <span>EXAMPLE RESULT</span>
        <span>Captured from RuleStack on {RUN.scoredAt.slice(0, 10)}</span>
      </div>
      <h3>
        {OWN_FILE.path} scored {OWN_FILE.quality} out of 100, so the job {passes ? 'passes' : 'fails'} at a threshold
        of {threshold}.
      </h3>
      <p>
        The repository score is the strongest recognised file, and RuleStack’s own badge reports the same number. This run found {OWN?.files.length} file and exited {OWN?.exit}.
      </p>
      <Disclosure title={`See where ${OWN_FILE.path} earned its points`}>
        <dl className="sv-record">
          {OWN_FILE.capabilities.map((c) => (
            <div key={c.key}>
              <dt>{c.label}</dt>
              <dd>
                {c.points} of {c.max} points
                <span className="sv-extra">{c.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Disclosure>
      <p className="sv-note">
        This is stubless’s own repository, scored by RuleStack and shown as an example. It is not a score for your repository.
      </p>
    </div>
  );
}

export default function SimpleHome() {
  return (
    <>
      <SimpleHeader />
      <main className="sv-shell sv-home">
        <section className="sv-hero">
          <div className="sv-pitch">
            <span className="sv-label">{PRODUCT.standing}</span>
            <h1>Fail the job when your agent instructions teach nothing.</h1>
            <p>
              A stub agent config is a file that always parses and teaches nothing. It has no build command, no test command and no stated boundary. stubless scores AGENTS.md, CLAUDE.md and the rest with RuleStack, then fails the job below a threshold.
            </p>
            <div className="sv-qualifier">
              The recogniser lives in RuleStack, not here. If RuleStack cannot be reached, the job exits 2 and never exits 0.
            </div>
          </div>
          <div className="sv-card sv-action">
            <div className="sv-step">
              <span>01 / ADD THE WORKFLOW</span>
              <span>FREE</span>
            </div>
            <h2>Add one workflow file.</h2>
            <p>The job runs on every push and pull request. It prints the breakdown as a job summary.</p>
            <CopyWorkflow />
          </div>
        </section>

        <section className="sv-section" id="example">
          <div className="sv-section-intro">
            <div>
              <span className="sv-label">02 / WHAT YOU&rsquo;LL GET</span>
              <h2>A score you can read in the job summary.</h2>
            </div>
            <p>Each file gets a score out of 100 and the points it earned for each capability.</p>
          </div>
          <ExampleRun />
        </section>

        <section className="sv-section" id="exits">
          <div className="sv-section-intro">
            <div>
              <span className="sv-label">03 / WHAT IT COSTS</span>
              <h2>You pay nothing. stubless is free and MIT licensed.</h2>
            </div>
            <p>You need no account and no key. The job calls RuleStack’s public score endpoint.</p>
          </div>
          <div className="sv-plans">
            <div className="sv-card sv-plan">
              <h3>The three exit codes</h3>
              <p>A job that could not check is never reported as a pass.</p>
              <ul>
                {EXITS.map((e) => (
                  <li key={e.code}>
                    Exit {e.code}: {e.text}
                  </li>
                ))}
              </ul>
              <a className="sv-primary" href={`${PRODUCT.repo}#exit-codes`}>
                Read the exit codes on GitHub
              </a>
            </div>
            <div className="sv-card sv-plan">
              <h3>The inputs</h3>
              <p>
                You set them under <code>with:</code> in the workflow.
              </p>
              <ul>
                <li>threshold, default 60: fail below this</li>
                <li>per-file-threshold is unset by default. Every recognised file must clear this too.</li>
                <li>timeout defaults to 60 seconds. The request deadline causes exit 2.</li>
              </ul>
              <a className="sv-primary" href={`${PRODUCT.repo}#inputs`}>
                Read every input on GitHub
              </a>
            </div>
          </div>
        </section>

        <nav className="sv-links" aria-label="Next steps">
          <a href={`${PRODUCT.repo}#usage`}>Usage on GitHub ↗</a>
          <a href="https://rulestack.thecompound.tech">See how RuleStack scores a file ↗</a>
          <a href={PRODUCT.repo}>Read the source ↗</a>
        </nav>
      </main>
      <SimpleFooter />
    </>
  );
}
