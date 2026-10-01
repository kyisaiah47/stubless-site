# stubless: Welcome and Simple view review

Batch 08. Governing spec: `compound-ops/standards/SIMPLE-VIEW-BLUEPRINT.md` and `simple-view-ref/AGENT-BRIEF.md`. Closest pilot: deferless-site (a package page whose first action is something the reader copies). Nothing here is deployed by this change.

## Truth map (blueprint 2.A)

Read on 2026-10-01: `src/lib/product.ts`, `src/lib/run.ts`, `src/components/Console.tsx`, `src/app/**`, `scripts/check-register.mjs`, `FACTS.json`, and the package README at `github.com/kyisaiah47/stubless` (fetched raw).

| Field | Fact | Source |
| --- | --- | --- |
| Primary user | A maintainer whose repository carries AGENTS.md, CLAUDE.md or another agent instruction file. | README |
| Problem | A stub agent config always parses and teaches nothing, and nothing else in a repository checks it. | README, `SOURCES.stub` |
| Input | A GitHub Actions workflow step `uses: kyisaiah47/stubless@v1` with optional `threshold`, `per-file-threshold`, `badge`, `workspace`, `api`, `timeout`. | README Usage and Inputs |
| Action | The job asks RuleStack's `POST /api/score` to score each recognised file. | `run.ts`, README |
| Output | A job summary with a per-capability breakdown, annotations on flagged lines, and an exit code. | README, `SUMMARY` in `run.ts` |
| Free / paid boundary | Free, MIT licence, no runtime dependencies. No account and no key input. | `SOURCES.license`, `SOURCES.deps`, README Inputs |
| Timing | On every push and pull request in the README's workflow. | README Usage |
| Limits | The repository score is the strongest recognised file. The recogniser lives in RuleStack. | `SOURCES.strongest`, `SOURCES.recogniser` |
| Failure states | Exit 1 below the threshold or no recognised file; exit 2 when the gate could not run, never collapsed into 0. | `EXITS` |
| Recovery | No custom 404 existed. Added `not-found.tsx` with the product header, footer and view controls. | `src/app` |

## How the input differs from CiteRank

There is no form and no request from this site. The first action is a workflow file the reader copies. The Simple action card has a themed listbox for the threshold (the Console's four values), shows the README's workflow with that value, and copies it. The example is the captured RuleStack run of stubless's own AGENTS.md from `run.ts`, with the per-capability points behind a disclosure. The cost section says it is free and MIT licensed and lists the exit codes and inputs from `product.ts` and the README.

## Shared state

- `SiteViewProvider` owns `stubless:view` and `stubless:welcome-off` and an in-memory draft map.
- The threshold is one shared draft (`threshold`): the Simple listbox, the Simple example sentence and the Console threshold chips all read and write it.
- The site has no middleware and no crawl guard, so `?view=` and `?welcome=0` need no exemption.

## Route inventory (blueprint 2.E)

| Route | Class | Simple treatment |
| --- | --- | --- |
| `/` | Curated | Outcome hero, workflow action card, example run with disclosure, free section, next-step links. |
| not found | Curated, recovery | New page in both views: the product header and footer with view controls, and three links back. |
| `/llms.txt`, robots, sitemap | Not pages | Unchanged. |

Console is unchanged apart from the view controls in its footer and the threshold reading the shared draft.

## Verification receipt (2026-10-01)

- `npx tsc --noEmit`: pass. `npx eslint src`: 0 errors, 6 warnings (`<img>` for marks). Two `react-hooks/set-state-in-effect` lines are disabled with the reason: the saved view and the welcome preference are only readable after hydration. `npm run check`: 12 of 12 clauses held. `npm run build`: pass.
- Browser run with bundled Chromium and the safe-chrome guard against `next dev` on :3307: 17 of 17 checks pass. No request leaves the site; nothing was mocked because nothing writes.
- Checked: clean visitor gets Console; welcome opens on `/`; Escape, backdrop and close; footer Start here reopens; Simple choice persists across reload; `?view=simple&welcome=0` works and switching keeps other parameters; the example disclosure starts inert and opens; one Simple header, footer and main on `/` and the 404; no horizontal overflow at 390; the welcome fits at 390.
- Not verified: the clipboard write in a real browser session (headless Chromium was not given clipboard permission).
- Screenshots: `compound-ops/standards/simple-view-ref/review/stubless-site-*.png`.
