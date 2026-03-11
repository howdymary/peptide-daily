# PeptidePal — UX & Trust Design Notes

Reference guide for the trust-building design patterns, component library, and onboarding system.

---

## Design Principles

1. **Transparent provenance** — Users should always know where a number comes from and how it was calculated.
2. **Calm professionalism** — Medical/research context demands restraint. No hype, no dark patterns.
3. **Graceful uncertainty** — When data is absent or limited, say so clearly rather than hiding it.
4. **Progressive disclosure** — Surface the most important signal first; let curious users dig deeper.

---

## Trust Signal Architecture

The site uses a layered trust system to communicate data quality:

```
Layer 1 — Grade badge    (Finnrick's own A–E classification)
Layer 2 — Trust badge    (derived: lab-tested / high-confidence / limited-data / no-rating)
Layer 3 — Trust Score    (PeptidePal's 0–100 composite metric)
Layer 4 — Data freshness (when were prices / lab tests last updated)
```

Each layer is **clearly labelled as to its origin**: Finnrick's data is always attributed to Finnrick; PeptidePal's derived metrics are clearly labelled as such.

---

## Component Library: Trust UI

All components live in `src/components/ui/`.

### `InfoBanner` (`info-banner.tsx`)

Dismissible, accessible alert banners with four variants:

| Variant | Color | Use case |
|---------|-------|----------|
| `info` | Sky blue | Neutral announcements, freshness notices |
| `success` | Green | Confirmations, import success |
| `warning` | Amber | Medical disclaimer, data caveats |
| `error` | Red | Service unavailable, scraping failure |

```tsx
// Pre-built variants
<MedicalDisclaimer />
<DataFreshnessNotice lastUpdated={price.updatedAt} />

// Custom
<InfoBanner variant="info" dismissible icon="🔬">
  New Finnrick lab data for 3 vendors is available.
</InfoBanner>
```

**Accessibility**: Uses `role="alert"` for error/warning, `role="status"` for info/success.
**Dismissal**: Stored in React state only — re-appears on page reload. Use `OnboardingTip` for persistent dismissal.

---

### `TrustBadge` (`trust-badge.tsx`)

Small pill chips that communicate provenance at a glance.

| Type | Label | When to use |
|------|-------|-------------|
| `lab-tested` | 🔬 Lab-tested | Has ≥1 Finnrick test |
| `grade` | ✓ Grade A | Has specific Finnrick grade |
| `high-confidence` | ⭐ High confidence | Trust Score ≥ 80 |
| `limited-data` | ⚠ Limited data | < 3 tests |
| `no-rating` | – No rating yet | No Finnrick data |
| `user-reviews` | 💬 User reviews | Only user data, no lab data |
| `new-data` | 🆕 New lab data | Finnrick published results in past 7 days |

```tsx
// Automatic derivation
<TrustBadge
  type={deriveTrustBadge({
    hasLabData: allGrades.length > 0,
    grade: topGrade,
    trustScore: peptide.trustScore?.overall,
    testCount: totalTests,
    hasNewData: isWithinDays(latestTestDate, 7),
  })}
  grade={topGrade ?? undefined}
/>

// Direct
<TrustBadge type="no-rating" />
```

Each badge has a `title` tooltip with plain-language explanation of what it means.

---

### `OnboardingTip` (`onboarding-tip.tsx`)

Collapsible explainer blocks that teach users how to interpret data. Dismissal state is stored in `localStorage` so they don't re-appear once closed.

```tsx
// Pre-built tips
<GradeScaleTip />      // Explains A–E Finnrick grade scale
<TrustScoreTip />      // Explains the 0–100 Trust Score formula
<CatalogGuideTip />    // How to use filters and sort in the catalog

// Custom tip
<OnboardingTip id="vendor-table-v1" title="Reading this table">
  <p>The <strong>Avg Score</strong> column shows Finnrick's 0–10 numeric score…</p>
</OnboardingTip>
```

**Persistence**: Each tip has a unique `id` (include a version suffix like `-v1` so you can re-show it if content significantly changes).
**`persistent` prop**: Set to `true` for tips that should always be visible (e.g., legal notices).

---

### `DataFreshnessBar` (`data-freshness.tsx`)

Shows when data was last updated with a coloured freshness indicator.

```tsx
<DataFreshnessBar
  lastUpdated={price.updatedAt}
  refreshIntervalMinutes={15}
  label="Prices"
/>

// Compact dot for table cells
<FreshnessDot lastUpdated={price.updatedAt} refreshIntervalMinutes={15} />
```

- Green dot = fresh (within 2× the refresh interval)
- Amber dot + "(may be stale)" = stale

Updates every 60 seconds via `setInterval` so the label stays accurate without a page reload.

---

## Medical Disclaimer Strategy

Medical disclaimers appear in three places:

1. **Footer** (on every page) — persistent, small text
2. **Homepage** — info band at the bottom of the page
3. **Peptide detail** and **Vendor detail** — `MedicalDisclaimer` component after the main data

**Tone guidelines**:
- Use calm, factual language. Avoid alarming phrasing.
- Distinguish between "research chemical not approved for human use" vs "approved medication" (e.g., FDA-approved semaglutide products exist; we track compounded/research versions).
- Never use phrasing that implies safety or efficacy.

---

## Onboarding Flow

| Page | Tip shown | ID |
|------|-----------|-----|
| `/peptides` | How to compare peptides | `catalog-guide-v1` |
| `/peptides/[slug]` | How to read Finnrick grades | `grade-scale-v1` |
| `/peptides/[slug]` | What is the Trust Score? | `trust-score-v1` |
| `/vendors/[slug]` | (none yet — could add) | — |
| `/about` | Methodology reference (always visible) | — |

Tips are dismissed per-user in `localStorage`. To reset all tips (useful in development):
```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith('pp_tip_dismissed:'))
  .forEach(k => localStorage.removeItem(k));
```

---

## Distinguishing Data Sources

A core UX principle: users must always be able to trace a number back to its origin.

| Element | Attribution |
|---------|-------------|
| Grade badge (A–E) | "Finnrick rating" label, links to finnrick.com |
| Trust Score | "PeptidePal's metric" — explicitly not Finnrick's |
| Prices | "Updated every 15 min" freshness indicator |
| User reviews | Star rating with review count |
| News articles | Source name + external link + excerpt only (no full republishing) |

---

## Visual Language

### Color palette (from CSS tokens)
- `--brand-navy` (`#0f2942`) — primary brand, hero backgrounds
- `--brand-teal` (`#0d9488`) — CTAs, grade A badges, success states
- `--brand-sky` (`#38bdf8`) — info highlights, eyebrow labels
- `--success` — green for prices, positive indicators
- `--warning` — amber for medical disclaimer, limited-data badge
- `--danger` — red for grade E, error states
- `--muted` — secondary text throughout

### Grade colors (consistent across all components)
| Grade | Background | Text |
|-------|-----------|------|
| A | `--grade-a-bg` | `--grade-a-text` |
| B | `--grade-b-bg` | `--grade-b-text` |
| C | `--grade-c-bg` | `--grade-c-text` |
| D | `--grade-d-bg` | `--grade-d-text` |
| E | `--grade-e-bg` | `--grade-e-text` |

### Typography
- Font: Inter (Google Fonts, loaded via CSS `@import`)
- Headings: `font-bold` + appropriate size (`text-2xl` → `text-5xl`)
- Body: `text-sm` or `text-base`, `leading-relaxed`
- Muted text: `style={{ color: "var(--muted)" }}`

---

## Accessibility Checklist

- ✅ Semantic HTML (`<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`)
- ✅ All interactive elements have accessible labels (`aria-label`, `aria-describedby`, `sr-only`)
- ✅ Tooltips use `role="tooltip"` and `aria-describedby`
- ✅ InfoBanner uses `role="alert"` for errors/warnings, `role="status"` for info
- ✅ Color is not the sole differentiator (badges include text labels, not just colors)
- ✅ Focus rings on all interactive elements (`focus-visible:ring-2`)
- ✅ Skip-to-content not yet implemented — add if SEO/accessibility audit requires it
- ⚠️ Contrast: verify `--muted` text (#94a3b8) against white background passes WCAG AA (4.5:1)

---

## Extending the Trust System

### Adding a new trust signal
1. Add a new type to `TrustBadgeType` in `trust-badge.tsx`
2. Add entry to `BADGE_META` with label, icon, colors, and tooltip text
3. Update `deriveTrustBadge()` logic if the new signal should be auto-derived

### Adding a new onboarding tip
1. Create a named export in `onboarding-tip.tsx`:
   ```tsx
   export function MyNewTip({ className = "" }: { className?: string }) {
     return (
       <OnboardingTip id="my-tip-v1" title="My tip title" className={className}>
         <p>Explanation text…</p>
       </OnboardingTip>
     );
   }
   ```
2. Import and add it to the relevant page.
3. Use a versioned ID so existing dismissed state doesn't suppress the new content.

### Adding a new disclaimer
Use `InfoBanner` with `variant="warning"` and `persistent={true}` if it must always be visible:
```tsx
<InfoBanner variant="warning" persistent title="Regulatory notice">
  This product is for research use only and not intended for human consumption.
</InfoBanner>
```
