'use client';

import { useMemo, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { Icon } from './Icon';
import { EXITS, PRODUCT, SOURCES } from '@/lib/product';
import { RUN } from '@/lib/run';
import FAMILY from '@/lib/app-family.json';

const thresholds = [60, 70, 80, 90] as const;
const stubless = RUN.repos.find((row) => row.repo === 'kyisaiah47/stubless');
const scoredFile = stubless?.files[0];
const formats = RUN.formats;

export default function Console() {
  const [threshold, setThreshold] = useState(60);
  const [strip, setStrip] = useState(false);
  const [openSource, setOpenSource] = useState<string | null>(null);
  const score = scoredFile?.quality ?? 0;
  const passes = score >= threshold;
  const status = useMemo(() => (passes ? EXITS[0] : EXITS[1]), [passes]);

  return <>
    <div className="source-line">RULESTACK API READ {RUN.scoredAt.slice(0, 10)} · PACKAGE {PRODUCT.version} · EVERY FIGURE BELOW CAME FROM THE PACKAGE OR THE CAPTURED RUN</div>
    <header className="masthead">
      <a className="brand" href={PRODUCT.repo}><img className="mk" src="/icon.svg" alt="" width={24} height={24} /><span>{PRODUCT.name}</span></a>
      <button className="app-switch" aria-expanded={strip} aria-label="Open app switcher" onClick={() => setStrip(!strip)}><Icon name="caret-up-down" size={14} /></button>
      <span className="standing">{PRODUCT.standing}</span>
      <nav><a className="active" href="#console"><Icon name="terminal-window" /> Console</a><a href={PRODUCT.repo}><Icon name="github-logo" /> Repository</a><a href="#method"><Icon name="file-text" /> Method</a></nav>
      <span className="live"><i /> RE-READ {PRODUCT.readOn}</span>
      <a className="action" href={`${PRODUCT.repo}#usage`}><Icon name="arrow-square-out" /> Read usage</a>
    </header>
    {strip && <div className="app-strip"><span>COMPOUND LABS / {FAMILY.label.toUpperCase()}</span>{FAMILY.apps.map((app) => <a key={app.slug} href={app.url} className={app.slug === 'stubless-site' ? 'selected' : undefined}><img src={app.logo} alt="" width={14} height={14} />{app.name}</a>)}</div>}
    <div className="folio"><span><NumberFlow value={formats.length} /> recognised formats</span><span><NumberFlow value={RUN.repos.length} /> repositories in capture</span><span><NumberFlow value={SOURCES.length} /> source rows</span><span><NumberFlow value={score} /> strongest score</span><span>0 runtime dependencies</span></div>
    <section className="head-band" id="console"><div><p className="eyebrow">THE JOB THAT FAILS</p><h1>Score the repository instructions, then fail the job below <NumberFlow value={threshold} />.</h1><p className="lede">{PRODUCT.lede}</p></div><div className="facts"><Fact label="PACKAGE" value={`stubless ${PRODUCT.version}`} /><Fact label="SCORE" value={`${score} / 100`} /><Fact label="NODE" value="≥ 18" /><Fact label="LICENSE" value="MIT" /></div></section>
    <section className="control-bar"><div className="control-row"><span className="gutter">THRESHOLD</span>{thresholds.map((value) => <button key={value} className={threshold === value ? 'chip pressed' : 'chip'} onClick={() => setThreshold(value)}><Icon name="gauge" size={14} /> {value} <small>fail below</small></button>)}</div><div className="control-note"><Icon name="lightning" /> Changing the threshold re-reads the score, verdict and exit state.</div></section>
    <div className="frame"><aside className="rail rail-left"><RailHeading icon="file-text" text="FORMATS READ" />{formats.map((format) => <div className="file-row" key={format.kind}><Icon name="file-text" /><span>{format.filename}<small>{format.name}</small></span><b>{format.format === scoredFile?.format ? <NumberFlow value={1} /> : '0'}</b></div>)}<RailHeading icon="list-numbers" text="EXIT CODES" />{EXITS.map((item) => <div className="exit-mini" key={item.code}><span className={`dot ${item.ink}`} /><b>{item.code}</b><span>{item.label}</span></div>)}</aside>
      <main className="track">
        <section className="band"><SectionHead eyebrow="ASSERTED" title="What the package says this job checks" time="README.md · 24 SEPT 2026" /><p className="band-copy">{PRODUCT.lede}</p><div className="table-wrap"><table><thead><tr><th>INPUT</th><th>DEFAULT</th><th>MEANING</th><th>READ FROM</th></tr></thead><tbody><tr><td>threshold</td><td>60</td><td>Fail below this.</td><td>README.md</td></tr><tr><td>per-file-threshold</td><td>unset</td><td>Every recognised file must clear this too.</td><td>README.md</td></tr><tr><td>workspace</td><td>checkout root</td><td>Directory to walk.</td><td>README.md</td></tr><tr><td>timeout</td><td>60 seconds</td><td>Request deadline before exit 2.</td><td>README.md</td></tr></tbody></table><span className="scroll-note">SCROLL FOR MORE</span></div></section>
        <section className="band"><SectionHead eyebrow="CAPTURED RUN" title="The repository score is the strongest recognised file" time={RUN.scoredAt.slice(0, 10)} /><div className="score-line"><div><strong><NumberFlow value={score} /></strong><span>/ 100 strongest file</span></div><div className="meter"><i style={{ width: `${score}%` }} /></div><span className={`status ${status.ink}`}>{status.label} <NumberFlow value={threshold} /></span></div><div className="table-wrap"><table><thead><tr><th>FILE</th><th>FORMAT</th><th>SCORE</th><th>STATE AT <NumberFlow value={threshold} /></th></tr></thead><tbody><tr><td><Icon name="file-text" /> {scoredFile?.path ?? 'No file returned'}</td><td>{scoredFile?.formatName ?? 'not scored'}</td><td><NumberFlow value={score} /> / 100</td><td className={passes ? 'good' : 'bad'}>{passes ? 'clears threshold' : 'below threshold'}</td></tr></tbody></table></div></section>
        <section className="band" id="method"><SectionHead eyebrow="THE BOUNDARY" title="RuleStack owns the recogniser" time={`LIVE API · ${RUN.recogniserReadAt}`} /><div className="boundary-grid"><Boundary icon="broadcast" text="The recogniser lives in RuleStack, not here. stubless reads its formats from GET /api/score on every run." /><Boundary icon="prohibit" text="The gate could not run is not a pass. It never collapses exit 2 into 0." /><Boundary icon="seal-check" text="The repository score is the strongest recognised file, the same number RuleStack's own badge reports." /></div></section>
        <section className="band source-band"><SectionHead eyebrow="SOURCE REGISTER" title="Every claim on this page has a line to read" time={`${SOURCES.length} ROWS`} /><div className="source-list">{SOURCES.map((source) => <a href={source.url} key={source.id} onClick={() => setOpenSource(openSource === source.id ? null : source.id)}><span>{source.cite} · {source.read_at}</span><q>{source.quote}</q>{openSource === source.id && <small className="source-open">{source.url}</small>}</a>)}</div></section>
      </main>
      <aside className="rail rail-right"><RailHeading icon="clock" text="THE RUN" /><RunRow label="PACKAGE" value={PRODUCT.version} /><RunRow label="API" value="RuleStack" /><RunRow label="FORMATS" value={formats.length} /><RunRow label="DEPENDENCIES" value="0" /><RailHeading icon="warning-circle" text="THREE STATES" />{EXITS.map((item) => <div className="state-row" key={item.code}><span className={`state-mark ${item.ink}`}>{item.code}</span><p><b>{item.label}</b>{item.text}</p></div>)}<RailHeading icon="arrow-square-out" text="WHERE THIS WAS READ" /><a className="rail-link" href={PRODUCT.repo}>github.com/kyisaiah47/stubless</a><a className="rail-link" href="https://rulestack.thecompound.tech">rulestack.thecompound.tech</a></aside>
    </div>
    <footer><div><span>Built by</span><img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} /></div><span>© 2026 stubless. A Compound Labs product.</span><a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a></footer>
  </>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><b>{value}</b></div>; }
function RunRow({ label, value }: { label: string; value: string | number }) { return <div className="run-row"><span>{label}</span><b>{value}</b></div>; }
function Boundary({ icon, text }: { icon: string; text: string }) { return <div><Icon name={icon} size={20} /><p>{text}</p></div>; }
function SectionHead({ eyebrow, title, time }: { eyebrow: string; title: string; time: string }) { return <div className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><time>{time}</time></div>; }
function RailHeading({ icon, text }: { icon: string; text: string }) { return <h3 className="rail-heading"><Icon name={icon} size={14} /> {text}</h3>; }
