# Peptide Daily — Frontend Design Notes

## 1. Visual & UX Principles

### Editorial, not SaaS
The site is modelled after content-rich consumer brands like The Points Guy — a hub that
leads with editorial content (news, guides) and layers in data (prices, lab grades) rather
than leading with a dashboard of numbers. Every page should feel like a trusted publication
before it feels like a tool.

### Warm, print-inspired palette
- Cold, flat "SaaS blue" (`#f8fafc` backgrounds, `#0ea5e9` accents) is replaced with a
  warm palette anchored in deep navy and warm off-white.
- **Page background**: `#f7f6f2` — a subtle warm ivory, not cold white.
- **Section alt background**: `#eeebe6` — slightly deeper warm for visual section breaks.
- **Primary brand**: `#0f2744` — deep editorial navy for structure, headings, logo.
- **Interactive accent**: `#0570b0` — a mid-depth editorial blue (not sky SaaS blue);
  passes WCAG AA (5:1 contrast on white) for all text uses.
- **Editorial gold**: `#c8860a` — decorative only; used for section labels, accent bars on
  hero cards, footer section headers. Never used as body text color.

### Typography pairing
- **DM Serif Display** (Google Font, 400 regular + italic): editorial display serif for hero
  headlines, section titles, and the site wordmark. Creates a strong magazine-like impression.
- **Inter** (Google Font, 300–700): all body text, UI labels, data cells, badges.
- Font variables are set in CSS: `var(--font-display)` and `var(--font-body)`.

### Section rhythm
Every major section uses the `.section-label` CSS utility: a small-caps gold label with a
ruled line extending to the right. This creates a consistent visual rhythm across the page
and clearly separates editorial intent from data.

```css
/* Usage */
<div class="section-label">Top Stories</div>
/* On dark backgrounds: */
<div class="section-label-light">Peptide Finder</div>
```

### Hierarchy of trust
The layout reinforces the three-layer data model:
1. **Finnrick** — third-party lab testing (always attributed, never modified)
2. **Community reviews** — clearly marked as subjective
3. **Trust Score** — Peptide Daily's own derived metric, always clearly labelled as such

---

## 2. Design Tokens (globals.css)

All tokens live in `:root` in `src/app/globals.css`. Dark mode overrides follow in
`@media (prefers-color-scheme: dark)`.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--brand-navy` | `#0f2744` | Logo, headings, nav, hero bg, footer bg |
| `--brand-navy-light` | `#183a56` | Hover states on dark bg |
| `--brand-gold` | `#c8860a` | Section labels, accent bars — decorative only |
| `--brand-gold-light` | `#fef3c7` | Badge backgrounds for gold labels |
| `--brand-teal` | `#0d9488` | Trust/science indicators, step 1 accent |
| `--background` | `#f7f6f2` | Page background |
| `--surface` | `#ffffff` | Card backgrounds, main content areas |
| `--surface-raised` | `#eeebe6` | Alt section backgrounds, sidebar widgets |
| `--foreground` | `#0f2744` | Primary text |
| `--foreground-secondary` | `#374151` | Secondary text |
| `--muted` | `#6b7080` | Body/meta text |
| `--muted-light` | `#9ca3b0` | Timestamps, separators |
| `--border` | `#ddd8d0` | Warm card borders |
| `--border-strong` | `#c5bfb6` | Stronger dividers |
| `--accent` | `#0570b0` | Links, interactive elements, focus rings |
| `--accent-hover` | `#045090` | Hover on accent elements |
| `--success` | `#059669` | Best price indicators, positive states |
| `--brand-sky` | `#0ea5e9` | Retained for Finnrick badge context only |

### Typography tokens

| Token | Value |
|---|---|
| `--font-display` | `'DM Serif Display', Georgia, serif` |
| `--font-body` | `'Inter', system-ui, sans-serif` |

### Shadow scale

| Token | Use |
|---|---|
| `--card-shadow` | Default card resting state |
| `--card-shadow-md` | Hero/featured cards resting state |
| `--card-shadow-hover` | All cards on hover (applied via JS in components) |

---

## 3. Key Components

### Layout primitives

**`Header`** (`src/components/layout/header.tsx`)
- Sticky, two-layer: ticker bar (dark navy, attribution text) + main nav bar (white, blurred).
- Logo: `PD` badge + "Peptide Daily" in DM Serif Display.
- Active nav item: indicated by a gold underline strip, not a box.
- Mobile: hamburger toggles a vertical drawer.

**`Footer`** (`src/components/layout/footer.tsx`)
- Dark navy background — creates a strong visual terminus.
- 4-column grid (brand + disclaimer | popular peptides | resources | data & legal).
- Section headers in gold uppercase tracking.
- Inline medical disclaimer box in the brand column.

### Article cards (`src/components/home/article-card.tsx`)

Four variants, selected via the `variant` prop:

| Variant | Use | Notes |
|---|---|---|
| `hero` | Left slot in asymmetric editorial grid | DM Serif Display title, gold accent bar, large excerpt |
| `featured` | Right stacked slots in editorial grid | Smaller title (Inter bold), teal accent line |
| `default` | News feed grid | Compact, no excerpt line height emphasis |
| `compact` | Sidebar list style | Color pip + two-line title, no card border |

All interactive cards use JS `onMouseEnter`/`onMouseLeave` for hover lift + shadow, not
CSS-only, to ensure the correct shadow token is applied.

### Peptide snapshot card (`src/components/home/peptide-snapshot-card.tsx`)

- Category accent bar at top (color mapped per category: GLP-1 blue, Recovery teal, etc.)
- Accepts `dark` prop for rendering on the navy Peptide Finder strip.
- Shows: name, category, Finnrick grade badge, best price, trust score bar, vendor count,
  mini 3-vendor price comparison table.

### Guide card (`src/components/home/guide-card.tsx`)

Two modes:
- **Full card** (`compact={false}`): category accent bar, pill, title, excerpt, reading time.
  Used in the full guides grid section.
- **Compact** (`compact={true}`): list-style with color pip, title, category/time metadata.
  Used in the sidebar.

### Section labels

Use the `.section-label` CSS class on a `<div>` wrapping the label text. The `::after`
pseudo-element automatically adds a ruled line to the right. On dark backgrounds, use
`.section-label-light` instead.

```tsx
<div className="section-label">Top Stories</div>
<div className="section-label-light">Peptide Finder</div>
```

---

## 4. Homepage Layout

The homepage (`src/app/page.tsx`) is structured as a server component with five visual zones:

```
┌─────────────────────────────────────────────────────────┐
│  HERO — dark navy, DM Serif headline, search bar        │
├─────────────────────────────────────────────────────────┤
│  TOP STORIES — editorial asymmetric grid               │
│  [  HERO CARD (3fr)  ] │ [featured] │                  │
│                        │ [featured] │                  │
├─────────────────────────────────────────────────────────┤
│  PEPTIDE FINDER — dark navy strip, 4-col grid           │
├─────────────────────────────────────────────────────────┤
│  LATEST NEWS           │  SIDEBAR                       │
│  [tag-filtered feed]   │  Learn (compact guides)        │
│                        │  Browse by Category            │
├─────────────────────────────────────────────────────────┤
│  GUIDES — 3-col grid (surface-raised bg)                │
├─────────────────────────────────────────────────────────┤
│  METHODOLOGY — 3 steps with colored top borders         │
├─────────────────────────────────────────────────────────┤
│  MEDICAL DISCLAIMER — info-bg banner                    │
├─────────────────────────────────────────────────────────┤
│  CTA — dark navy, DM Serif headline, gold CTA button    │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Extending the Design System

### Adding a new page

1. Use `<div className="section-label">Section Title</div>` for all section headers.
2. Use `display-heading` class on large titles that should use DM Serif Display.
3. Reach for `var(--surface-raised)` for alternate section backgrounds.
4. Page backgrounds should be `var(--background)` (warm ivory), not white.
5. Cards use `.card` base class or the shared card pattern: `border border-[var(--card-border)] bg-[var(--surface)] rounded-xl` with `box-shadow: var(--card-shadow)`.

### Adding a new component

1. Never use raw hex values — always use CSS custom properties.
2. For interactive hover states, follow the JS pattern in existing cards (`onMouseEnter` /
   `onMouseLeave` on the anchor/link element) to ensure proper shadow token usage.
3. For category-coded color (like peptide cards), extend the `CATEGORY_ACCENT` map in
   `peptide-snapshot-card.tsx` rather than hardcoding colors.
4. Badge variants for grades, availability, and trust live in `src/components/ui/badge.tsx`
   and `src/components/ui/trust-badge.tsx` — use those rather than creating new one-offs.

### Dark sections

The Peptide Finder strip and hero use `var(--brand-navy)` backgrounds. Components that
render on dark backgrounds should accept a `dark?: boolean` prop and switch their text and
border colors accordingly (see `PeptideSnapshotCard` for the pattern).

### New fonts

If you add a new typeface, add it to the `@import` URL in `globals.css`, define a new
`--font-*` token, and apply it via `style={{ fontFamily: "var(--font-*)" }}` rather than
Tailwind classes (since Tailwind is not configured with a custom `fontFamily` key).
