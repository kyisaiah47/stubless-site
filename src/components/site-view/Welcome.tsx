'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteView, WELCOME_EVENT, WELCOME_OFF_KEY, type SiteView } from './SiteViewProvider';

/* Start here. Opens on `/` for a visitor who has not turned it off, unless `?welcome=0`.
 * Closing or choosing a view does not turn it off; only the checkbox does. The footer's
 * Start here reopens it either way. The illustration is invented and says so. */
export default function Welcome() {
  const mode = useSiteView();
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [off, setOff] = useState(false);
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    const d = dialog.current;
    if (d && !d.open) {
      previous.current = document.activeElement as HTMLElement;
      d.showModal();
    }
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    if (timer.current) clearTimeout(timer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => {
      dialog.current?.close();
      const back = previous.current;
      if (back?.isConnected && back !== document.body) back.focus();
      else document.querySelector<HTMLElement>('.sv-action button, .sv-nav a, .brand')?.focus({ preventScroll: true });
    }, reduced ? 0 : 220);
  }, []);

  useEffect(() => {
    let disabled = false;
    try {
      disabled = localStorage.getItem(WELCOME_OFF_KEY) === '1';
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after hydration
    setOff(disabled);
    if (path === '/' && !disabled && new URLSearchParams(window.location.search).get('welcome') !== '0') show();
    window.addEventListener(WELCOME_EVENT, show);
    return () => {
      window.removeEventListener(WELCOME_EVENT, show);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [path, show]);

  function select(view: SiteView) {
    mode?.choose(view);
    close();
  }

  return (
    <dialog
      ref={dialog}
      className="sv-welcome"
      data-visible={visible}
      aria-labelledby="sv-welcome-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        const controls = [
          ...e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]'),
        ];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
    >
      <header className="sv-welcome-top">
        <span className="sv-brand">
          <img src="/icon.svg" alt="" width={18} height={18} />
          stubless <small>/ START HERE</small>
        </span>
        <button type="button" aria-label="Close welcome" onClick={close} autoFocus>
          ×
        </button>
      </header>
      <div className="sv-welcome-intro">
        <span className="sv-label">GITHUB ACTION, RULESTACK SCORE GATE</span>
        <h2 id="sv-welcome-title">Check whether your AGENTS.md teaches an agent anything.</h2>
        <p>
          stubless is a GitHub Action. It asks RuleStack to score the agent instruction files in your repository, prints where each file earned its points and fails the job below a threshold you set.
        </p>
      </div>
      <section className="sv-illustration" aria-label="Illustrative job summary">
        <div>
          <span>ONE PUSH. ONE SCORE YOU CAN READ.</span>
          <span>ILLUSTRATION</span>
        </div>
        <p>You push a repository whose CLAUDE.md has no build or test command.</p>
        <p className="sv-illustration-answer">
          CLAUDE.md scored 41 out of 100, below the threshold of 60, so the job failed. Runnable
          commands earned 0 of 20.
          <strong>INVENTED EXAMPLE</strong>
        </p>
        <p>Read the score and the verdict first. Open the breakdown when you want the detail.</p>
      </section>
      <section className="sv-welcome-choose">
        <div>
          <h3>Choose how to explore.</h3>
          <p>You can switch anytime.</p>
        </div>
        <div className="sv-choices">
          <button type="button" onClick={() => select('console')}>
            <span>
              <b>Console</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>See more at once.</strong>
            <span>A compact layout with more data and controls on screen.</span>
          </button>
          <button type="button" onClick={() => select('simple')}>
            <span>
              <b>Simple</b>
              <span aria-hidden="true">↗</span>
            </span>
            <strong>Start with the essentials.</strong>
            <span>A roomier overview with details you can open as you go.</span>
          </button>
        </div>
      </section>
      <footer>
        <label>
          <input
            type="checkbox"
            checked={off}
            onChange={(e) => {
              const value = e.target.checked;
              setOff(value);
              try {
                if (value) localStorage.setItem(WELCOME_OFF_KEY, '1');
                else localStorage.removeItem(WELCOME_OFF_KEY);
              } catch {}
            }}
          />
          Do not open this when I come back
        </label>
      </footer>
    </dialog>
  );
}
