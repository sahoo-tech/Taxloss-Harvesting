import { useState, useRef, useEffect } from "react";

const HOW_IT_WORKS_TEXT = `Tax-loss harvesting is the process of selling assets at a loss to offset capital gains, thereby reducing your overall tax liability. By strategically selecting holdings that have declined in value, you can realise losses that counterbalance your gains.

Select the assets you wish to harvest from the Holdings table below. The "After Harvesting" card will update in real-time to show your new capital gains position and estimated tax savings.`;

const DISCLAIMERS = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
  "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
  "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
  "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.",
];

/* ─── How it Works Popover ─────────────────────────────── */
function HowItWorksPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span className="hiw-wrapper" ref={ref}>
      <button
        className="hiw-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        id="how-it-works-btn"
      >
        How it works?
      </button>

      {open && (
        <div className="hiw-popover fade-in" role="tooltip" aria-label="How tax-loss harvesting works">
          <div className="hiw-popover-arrow" />
          <h3 className="hiw-title">How Tax-Loss Harvesting Works</h3>
          {HOW_IT_WORKS_TEXT.split("\n\n").map((para, i) => (
            <p key={i} className="hiw-para">{para}</p>
          ))}
        </div>
      )}
    </span>
  );
}

/* ─── Important Notes Accordion ────────────────────────── */
function ImportantNotes() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`notes-accordion ${open ? "notes-open" : ""}`}>
      <button
        className="notes-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        id="important-notes-btn"
      >
        <span className="notes-trigger-left">
          <span className="notes-icon">ℹ️</span>
          <span className="notes-trigger-label">Important Notes &amp; Disclaimers</span>
        </span>
        <span className={`notes-chevron ${open ? "rotated" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <div className="notes-body" aria-hidden={!open}>
        <ul className="notes-list">
          {DISCLAIMERS.map((item, i) => (
            <li key={i} className="notes-item">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { HowItWorksPopover, ImportantNotes };
