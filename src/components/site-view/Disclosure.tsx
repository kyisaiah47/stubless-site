'use client';

import { useId, useState, type ReactNode } from 'react';

/* One animated disclosure. The collapsed body is inert, so nothing inside it takes focus. */
export default function Disclosure({
  title,
  children,
  initialOpen = false,
}: {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const id = useId();
  return (
    <div className="sv-disclosure">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {title}
        <span aria-hidden="true">{open ? '-' : '+'}</span>
      </button>
      <div id={id} className="sv-reveal" data-open={open} inert={!open}>
        <div>
          <div className="sv-answer">{children}</div>
        </div>
      </div>
    </div>
  );
}
