"use client";

const PAGE_TITLE =
  "The Peptide Buyer's Checklist — Free Download | Peptide Daily";
const PAGE_DESCRIPTION =
  "Everything to verify before purchasing peptides online. Free printable checklist from Peptide Daily.";

/* ── Checklist data ─────────────────────────────────────────────────────── */

interface ChecklistItem {
  text: string;
}

interface ChecklistSection {
  title: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

const SECTIONS: ChecklistSection[] = [
  {
    title: "Before You Buy — Vendor Verification",
    icon: (
      <svg
        className="checklist-section-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    items: [
      { text: "Does the vendor publish Certificates of Analysis (COAs)?" },
      { text: "Are COAs from an independent, third-party lab?" },
      { text: "Can you verify the lab is ISO-accredited?" },
      { text: "Does the vendor have a verifiable business address?" },
      { text: "How long has the vendor been operating?" },
    ],
  },
  {
    title: "Product Quality Checks",
    icon: (
      <svg
        className="checklist-section-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
    items: [
      {
        text: "Is purity percentage listed (and is it realistic, not always exactly 99.9%)?",
      },
      { text: "Is endotoxin testing included in the COA?" },
      { text: "Are batch numbers visible and cross-referenceable?" },
      {
        text: 'Is the product labeled "Research Use Only" (compliance signal)?',
      },
    ],
  },
  {
    title: "Pricing & Policies",
    icon: (
      <svg
        className="checklist-section-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    items: [
      { text: "Is pricing transparent with no hidden checkout fees?" },
      { text: "How does the price compare to market averages?" },
      { text: "Is there a refund or reship policy?" },
      { text: "What is the minimum order requirement?" },
    ],
  },
  {
    title: "Shipping & Handling",
    icon: (
      <svg
        className="checklist-section-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193l-2.254-3.073A2.25 2.25 0 0014.466 4.5H8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25"
        />
      </svg>
    ),
    items: [
      { text: "What shipping method is used (cold chain if needed)?" },
      { text: "Are peptides shipped lyophilized (powder form)?" },
      { text: "Is packaging tamper-evident?" },
      { text: "What is the typical delivery timeframe?" },
    ],
  },
  {
    title: "After Purchase",
    icon: (
      <svg
        className="checklist-section-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    items: [
      { text: "Inspect packaging integrity on arrival" },
      { text: "Check temperature indicators if included" },
      { text: "Verify batch number matches COA" },
      { text: "Store according to product specifications" },
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export default function ChecklistPage() {
  return (
    <>
      {/* Head metadata for client component */}
      <title>{PAGE_TITLE}</title>
      <meta name="description" content={PAGE_DESCRIPTION} />

      <style>{`
        /* ── Print-optimized styles ──────────────────────────────────── */
        .checklist-page {
          --cl-navy: #1B2A4A;
          --cl-teal: #0D6E6E;
          --cl-teal-light: #E6F5F5;
          --cl-accent: #E8A838;
          --cl-border: #CBD5E0;
          --cl-bg: #F7FAFC;
          --cl-surface: #ffffff;
          --cl-text: #2D3748;
          --cl-text-muted: #4A5568;
        }

        .checklist-page {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          color: var(--cl-text);
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        /* Brand header */
        .checklist-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid var(--cl-teal);
        }

        .checklist-brand {
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--cl-navy);
          letter-spacing: -0.02em;
        }

        .checklist-brand-dot {
          color: var(--cl-teal);
        }

        .checklist-title {
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--cl-navy);
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .checklist-subtitle {
          font-size: 1.05rem;
          color: var(--cl-text-muted);
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Section styles */
        .checklist-section {
          margin-bottom: 1.75rem;
          border: 1px solid var(--cl-border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--cl-surface);
        }

        .checklist-section-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1.25rem;
          background: var(--cl-navy);
          color: #ffffff;
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
        }

        .checklist-section-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          color: var(--cl-accent);
        }

        .checklist-items {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #EDF2F7;
          line-height: 1.55;
          font-size: 0.95rem;
        }

        .checklist-item:last-child {
          border-bottom: none;
        }

        .checklist-checkbox {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
          margin-top: 0.1rem;
          border: 2px solid var(--cl-teal);
          border-radius: 4px;
          background: transparent;
        }

        .checklist-item-text {
          flex: 1;
        }

        /* Vendor notes area */
        .checklist-notes {
          margin-top: 2rem;
          padding: 1.25rem;
          border: 2px dashed var(--cl-border);
          border-radius: 12px;
          min-height: 100px;
        }

        .checklist-notes-label {
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--cl-text-muted);
          margin-bottom: 0.5rem;
        }

        .checklist-notes-lines {
          border-bottom: 1px solid #EDF2F7;
          height: 2rem;
        }

        /* Footer */
        .checklist-footer {
          margin-top: 2rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 2px solid var(--cl-border);
        }

        .checklist-tagline {
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-weight: 600;
          font-size: 1rem;
          color: var(--cl-navy);
          margin-bottom: 0.75rem;
        }

        .checklist-tagline-url {
          color: var(--cl-teal);
        }

        .checklist-disclaimer {
          font-size: 0.8rem;
          color: var(--cl-text-muted);
          line-height: 1.6;
          max-width: 600px;
          margin: 0.75rem auto 0;
          padding: 0.75rem 1rem;
          background: var(--cl-bg);
          border-radius: 8px;
          border: 1px solid var(--cl-border);
        }

        /* Print button */
        .checklist-print-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.75rem 2rem;
          background: var(--cl-teal);
          color: #ffffff;
          font-family: "Outfit", "Inter", system-ui, sans-serif;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .checklist-print-btn:hover {
          background: #0A5858;
        }

        .checklist-print-btn svg {
          width: 1.125rem;
          height: 1.125rem;
        }

        /* ── Print media ────────────────────────────────────────────── */
        @media print {
          /* Hide site chrome and non-printable elements */
          header, footer, nav,
          .checklist-print-btn {
            display: none !important;
          }

          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .checklist-page {
            padding: 0;
            max-width: 100%;
          }

          .checklist-section {
            break-inside: avoid;
            page-break-inside: avoid;
            border-color: #999;
          }

          .checklist-section-header {
            background: #1B2A4A !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .checklist-section-icon {
            color: #E8A838 !important;
          }

          .checklist-checkbox {
            border-color: #333 !important;
          }

          .checklist-header {
            border-bottom-color: #333;
          }

          .checklist-footer {
            border-top-color: #999;
          }

          .checklist-notes {
            border-color: #999;
          }

          @page {
            margin: 1.5cm;
            size: letter portrait;
          }
        }
      `}</style>

      <div className="checklist-page">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="checklist-header">
          <div className="checklist-brand">
            Peptide<span className="checklist-brand-dot">Daily</span>
          </div>
          <h1 className="checklist-title">The Peptide Buyer&#39;s Checklist</h1>
          <p className="checklist-subtitle">
            Everything to verify before purchasing peptides online. Print this
            page and check off each item as you evaluate vendors.
          </p>
        </div>

        {/* ── Sections ────────────────────────────────────────────── */}
        {SECTIONS.map((section) => (
          <div key={section.title} className="checklist-section">
            <div className="checklist-section-header">
              {section.icon}
              {section.title}
            </div>
            <ul className="checklist-items">
              {section.items.map((item) => (
                <li key={item.text} className="checklist-item">
                  <div className="checklist-checkbox" aria-hidden="true" />
                  <span className="checklist-item-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Notes area ──────────────────────────────────────────── */}
        <div className="checklist-notes">
          <div className="checklist-notes-label">
            Notes — Vendor name: ___________________________
          </div>
          <div className="checklist-notes-lines" />
          <div className="checklist-notes-lines" />
          <div className="checklist-notes-lines" />
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="checklist-footer">
          <div className="checklist-tagline">
            <span className="checklist-tagline-url">peptidedaily.com</span>
            {" "}&#8212; We compare. You decide.
          </div>

          <div className="checklist-disclaimer">
            <strong>Medical Disclaimer:</strong> This checklist is provided for
            informational and educational purposes only. It is not medical
            advice and does not constitute an endorsement of any vendor or
            product. Peptides referenced on Peptide Daily are intended for
            research use only. Always consult a qualified healthcare
            professional before making any decisions related to your health.
          </div>

          {/* Print button — hidden in print */}
          <button
            type="button"
            className="checklist-print-btn"
            onClick={() => window.print()}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
              />
            </svg>
            Print this checklist
          </button>
        </div>
      </div>
    </>
  );
}
