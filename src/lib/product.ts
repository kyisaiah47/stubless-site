export const PRODUCT = {
  name: 'stubless',
  slug: 'stubless',
  version: '0.1.0',
  host: 'https://stubless.thecompound.tech',
  repo: 'https://github.com/kyisaiah47/stubless',
  accent: '#6FB8F9',
  accentHover: '#82CBFF',
  title: 'Score a repository\'s agent instructions, then fail below the threshold.',
  lede: 'A GitHub Action asks RuleStack to score the agent-instruction files it recognises, prints the per-capability breakdown, and fails the workflow below a threshold.',
  standing: 'GITHUB ACTION, RULESTACK SCORE GATE',
  readOn: '2026-09-24',
} as const;

export const SOURCES = [
  { id: 'purpose', quote: "A GitHub Action that scores this repository's `AGENTS.md`, `CLAUDE.md` and the rest of the agent-instruction family against RuleStack", cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#readme', read_at: '2026-09-24' },
  { id: 'output', quote: 'prints the per-capability breakdown as a job summary with annotations on the lines RuleStack flags, and fails the job below a threshold.', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#what-it-looks-like', read_at: '2026-09-24' },
  { id: 'stub', quote: 'A stub agent config is a file that always parses and teaches nothing: no build command, no test command, no stated boundary.', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#readme', read_at: '2026-09-24' },
  { id: 'strongest', quote: "The repository score is the strongest recognised file, the same number RuleStack's own badge reports.", cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#inputs', read_at: '2026-09-24' },
  { id: 'threshold', quote: 'threshold | 60 | Fail below this.', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#inputs', read_at: '2026-09-24' },
  { id: 'per-file', quote: 'Optional second gate: every recognised file must clear this too, not only the strongest one.', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#inputs', read_at: '2026-09-24' },
  { id: 'timeout', quote: 'Seconds per RuleStack request before the run becomes exit 2.', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#inputs', read_at: '2026-09-24' },
  { id: 'exit0', quote: 'every recognised file is at or above the threshold', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#exit-codes', read_at: '2026-09-24' },
  { id: 'exit1', quote: 'a file scores below it, or the repository has no recognised agent instruction file at all', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#exit-codes', read_at: '2026-09-24' },
  { id: 'exit2', quote: 'the gate could not run. Not a pass, and it never collapses into 0', cite: 'README.md', url: 'https://github.com/kyisaiah47/stubless#exit-codes', read_at: '2026-09-24' },
  { id: 'deps', quote: '"dependencies": {}', cite: 'package.json', url: 'https://github.com/kyisaiah47/stubless/blob/main/package.json', read_at: '2026-09-24' },
  { id: 'node', quote: '"node": ">=18"', cite: 'package.json', url: 'https://github.com/kyisaiah47/stubless/blob/main/package.json', read_at: '2026-09-24' },
  { id: 'api', quote: 'api: RuleStack base URL. Only change this to point at a local RuleStack.', cite: 'action.yml', url: 'https://github.com/kyisaiah47/stubless/blob/main/action.yml', read_at: '2026-09-24' },
  { id: 'recogniser', quote: 'The recogniser lives in RuleStack, not here', cite: 'src/score-gate.mjs', url: 'https://github.com/kyisaiah47/stubless/blob/main/src/score-gate.mjs', read_at: '2026-09-24' },
  { id: 'no-pass', quote: 'the gate could not run, which is NOT a pass and never collapses into 0', cite: 'src/score-gate.mjs', url: 'https://github.com/kyisaiah47/stubless/blob/main/src/score-gate.mjs', read_at: '2026-09-24' },
  { id: 'github', quote: "GitHub Action: score a repository's AGENTS.md/CLAUDE.md against RuleStack and fail the job below the threshold.", cite: 'GitHub repository metadata', url: 'https://github.com/kyisaiah47/stubless', read_at: '2026-09-24' },
  { id: 'license', quote: 'MIT', cite: 'package.json', url: 'https://github.com/kyisaiah47/stubless/blob/main/package.json', read_at: '2026-09-24' },
] as const;

export const EXITS = [
  { code: '0', label: 'AT OR ABOVE', text: 'Every recognised file clears the threshold.', ink: 'pass' },
  { code: '1', label: 'BELOW THRESHOLD', text: 'A file scores below the threshold, or no instruction file is recognised.', ink: 'fail' },
  { code: '2', label: 'COULD NOT CHECK', text: 'The gate could not run. This is not a pass.', ink: 'caution' },
] as const;

export const ROUTES = ['/'] as const;
