'use client';

/* THE VIEW AUTHORITY. Console is the default for a clean visitor. A valid `?view=` beats the
 * saved choice, and an explicit choice is saved. Drafts (the search query) live in memory here,
 * above both views, so a typed query survives a switch and a route change. Only the two
 * preferences are written to storage.
 *
 * ⛔ THE VIEW FOLLOWS THE BODY. PageViews registers a route's Simple body here while it is
 * mounted. `view`, which FooterViews and `data-view` read, is Simple only when the visitor chose
 * Simple AND the mounted route has a Simple body. The saved choice (`chosen`) is kept, so the next
 * route with a Simple body opens in Simple. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Welcome from './Welcome';
import './site-view.css';

export type SiteView = 'console' | 'simple';
export const VIEW_KEY = 'stubless:view';
export const WELCOME_OFF_KEY = 'stubless:welcome-off';
export const WELCOME_EVENT = 'stubless:welcome';

type ViewCtx = {
  /** The view this route renders: Simple only when it was chosen and the route has a Simple body. */
  view: SiteView;
  /** The visitor's saved choice, which can be Simple on a Console-only route. */
  chosen: SiteView;
  /** Whether the mounted route has a Simple body. */
  hasSimple: boolean;
  /** Called by PageViews while it holds a Simple body. Returns the unregister. */
  registerSimple: () => () => void;
  choose: (view: SiteView) => void;
  welcome: () => void;
};
const ViewContext = createContext<ViewCtx | null>(null);
export function useSiteView() {
  return useContext(ViewContext);
}

type DraftCtx = { drafts: Record<string, unknown>; set: (key: string, value: unknown) => void };
const DraftContext = createContext<DraftCtx | null>(null);

/** One shared in-memory value per key. Falls back to local state outside the provider. */
export function useDraft<T>(key: string, initial: T): [T, (value: T) => void] {
  const ctx = useContext(DraftContext);
  const [local, setLocal] = useState<T>(initial);
  const shared = ctx?.set;
  const setter = useCallback((v: T) => (shared ? shared(key, v) : setLocal(v)), [shared, key]);
  if (!ctx) return [local, setter];
  const value = (key in ctx.drafts ? ctx.drafts[key] : initial) as T;
  return [value, setter];
}

export default function SiteViewProvider({ children }: { children: ReactNode }) {
  const [chosen, setView] = useState<SiteView>('console');
  /* A count, not a flag: an old page's unregister and a new page's register can land in either
   * order on a route change. */
  const [simpleBodies, setSimpleBodies] = useState(0);
  const registerSimple = useCallback(() => {
    setSimpleBodies((n) => n + 1);
    return () => setSimpleBodies((n) => Math.max(0, n - 1));
  }, []);
  const hasSimple = simpleBodies > 0;
  const view: SiteView = chosen === 'simple' && hasSimple ? 'simple' : 'console';
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const path = usePathname();

  const choose = useCallback((next: SiteView) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
    const url = new URL(window.location.href);
    if (url.searchParams.has('view')) {
      url.searchParams.set('view', next);
      window.history.replaceState(window.history.state, '', url.href);
    }
  }, []);

  /* The saved choice and the URL exist only in the browser, so they are read after hydration.
   * Setting state here is the point of this effect. */
  useEffect(() => {
    const explicit = new URLSearchParams(window.location.search).get('view');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (explicit === 'simple' || explicit === 'console') choose(explicit);
    else {
      try {
        setView(localStorage.getItem(VIEW_KEY) === 'simple' ? 'simple' : 'console');
      } catch {}
    }
  }, [path, choose]);

  const set = useCallback((key: string, value: unknown) => setDrafts((d) => ({ ...d, [key]: value })), []);
  const viewValue = useMemo(
    () => ({ view, chosen, hasSimple, registerSimple, choose, welcome: () => window.dispatchEvent(new Event(WELCOME_EVENT)) }),
    [view, chosen, hasSimple, registerSimple, choose],
  );
  const draftValue = useMemo(() => ({ drafts, set }), [drafts, set]);

  return (
    <ViewContext.Provider value={viewValue}>
      <DraftContext.Provider value={draftValue}>
        <div className="site-surface" data-view={view}>
          {children}
        </div>
        <Welcome />
      </DraftContext.Provider>
    </ViewContext.Provider>
  );
}
