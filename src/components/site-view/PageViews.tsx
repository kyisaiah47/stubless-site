'use client';

import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { useSiteView } from './SiteViewProvider';

/* Layout effect in the browser so the provider's view flips in the same frame as the body. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Renders exactly one of the two views, so no route mounts two copies of a control. A route body
 *  that passes a `simpleView` registers it, which is what lets the provider report Simple. */
export default function PageViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView?: ReactNode }) {
  const ctx = useSiteView();
  const has = simpleView !== undefined;
  const register = ctx?.registerSimple;
  useIsoLayoutEffect(() => {
    if (!has || !register) return;
    return register();
  }, [has, register]);
  return ctx?.chosen === 'simple' && has ? <>{simpleView}</> : <>{consoleView}</>;
}

/** The footer twin of PageViews: the Console footer stays a server component. It follows the route
 *  body and never registers a Simple body of its own. */
export function FooterViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView: ReactNode }) {
  return useSiteView()?.view === 'simple' ? <>{simpleView}</> : <>{consoleView}</>;
}
