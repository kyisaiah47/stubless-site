'use client';

import type { ReactNode } from 'react';
import { useSiteView } from './SiteViewProvider';

/** Renders exactly one of the two views, so no route mounts two copies of a control. */
export default function PageViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView?: ReactNode }) {
  return useSiteView()?.view === 'simple' && simpleView !== undefined ? <>{simpleView}</> : <>{consoleView}</>;
}

/** The footer twin of PageViews: the Console footer stays a server component. */
export function FooterViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView: ReactNode }) {
  return useSiteView()?.view === 'simple' ? <>{simpleView}</> : <>{consoleView}</>;
}
