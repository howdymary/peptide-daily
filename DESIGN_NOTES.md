# Peptide Daily — Design Notes

## Brand & Positioning

Peptide Daily is positioned as a **consumer health / evidence-driven product** — closer to
Function Health or Levels Health than a supplement storefront. The visual language
emphasizes trust, scientific rigor, transparency, and safety.

### Core Design Principles

1. **Transparency over persuasion** — always make data provenance explicit. Finnrick
   grades are clearly labeled as third-party, independent data. Trust Scores are explicitly
   Peptide Daily's derived metric.

2. **Evidence first** — lab data (Finnrick) is the primary signal in all price
   comparisons. Price is important, but quality evidence leads.

3. **No medical framing** — copy is neutral and informational. No "benefits" language,
   no efficacy claims. Disclaimers appear in the footer, on detail pages, and on the About page.

4. **Accessible information hierarchy** — the most important information (price, lab grade,
   trust score) is immediately visible on every card and table row. Details are progressive
   (expandable test results).

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--brand-navy` | `#0c4a6e` | Primary brand, headers, CTAs |
| `--brand-sky` | `#0ea5e9` | Accent, links, focus rings |
| `--brand-teal` | `#0d9488` | Secondary accent, positive data viz |
| `--background` | `#f8fafc` | Page background (light cool gray) |
| `--surface` | `#ffffff` | Card backgrounds |
| `--surface-raised` | `#f1f5f9` | Table headers, filter bars |
| `--foreground` | `#0f172a` | Primary text |
| `--muted` | `#64748b` | Secondary text, labels |
| `--success` | `#059669` | Prices, in-stock status |
| `--warning` | `#d97706` | Pre-order, caution states |
| `--danger` | `#dc2626` | Out-of-stock, error states |

### Grade Color Tokens

Each Finnrick grade (A–E) has its own `--grade-X-{bg,text,border}` token trio, used
consistently in `GradeBadge` and the About page scale reference.

### Typography

- **Font**: Inter (Google Fonts), system-ui fallback
- **Scale**: Tailwind defaults (text-xs through text-4xl)
- **Letter spacing**: `-0.02em` on headings for clean clinical feel
- **Line height**: 1.6 for body, 1.25 for headings

### Spacing

Tailwind's default 4px base. Standard card padding: `p-5` (20px). Section gaps: `gap-4`
or `gap-6`. Page vertical rhythm: `py-8` or `py-10` on containers.

---

## Information Architecture

### Pages

| Path | Description |
|---|---|
| `/` | Home — hero search, category grid, featured peptides, how it works |
| `/peptides` | Catalog — filterable/sortable grid of all peptides |
| `/peptides/[slug]` | Peptide detail — vendor comparison table, lab data, reviews |
| `/vendors` | Vendor listing — all vendors with Finnrick grade summary |
| `/vendors/[slug]` | Vendor detail — full Finnrick ratings, test history, peptide list |
| `/about` | How It Works — methodology, grade scale, Trust Score, disclaimers |
| `/auth/signin` | Sign In |
| `/auth/signup` | Create Account |
| `/admin` | Review moderation (admin only) |

### Navigation

Top nav: Home → Browse Peptides → Vendors → How It Works → Sign In / Get Started.

Footer: Popular peptides quicklinks, resources, data & legal, disclaimer banner.

---

## Key Components

### `GradeBadge` (`src/components/finnrick/grade-badge.tsx`)
Displays Finnrick's A–E letter grade with color coding. Two modes:
- `compact` — small letter-only badge for card headers and table cells
- Full — letter + label + score + test count, for detail views

**Colors**: use CSS variable tokens (`--grade-a-text`, etc.) so dark mode works correctly.

### `TrustScoreBar` (`src/components/finnrick/trust-score-bar.tsx`)
Progress bar (0–100) with score label. Colors: green ≥80, emerald ≥60, amber ≥40, red <40.
`size` prop: `sm` (table use) vs `md` (detail hero).

### `PriceTable` (`src/components/peptides/price-table.tsx`)
Sortable (price / trust / grade) vendor comparison table. Features:
- `BestPriceBadge` on lowest-price row
- Finnrick grade links to finnrick.com
- Expandable test results (`TestResultsTable`) per vendor when data exists
- `InfoIcon` tooltips explain Finnrick and Trust Score columns

### `PeptideCard` (`src/components/peptides/peptide-card.tsx`)
Card for catalog grid. Anatomy: name + grade badge (top) / description / divider /
price + trust bar + stars + vendor count (bottom). Flex column with flex-1 spacer.

### `SearchFilters` (`src/components/peptides/search-filters.tsx`)
Client component. URL-driven via `useSearchParams` / `router.push`. Controls:
search, sort, lab grade, availability, price range. "Clear all" button appears when
any filter is active.

### `Tooltip` + `InfoIcon` (`src/components/ui/tooltip.tsx`)
Accessible tooltip (role="tooltip", aria-describedby). `InfoIcon` — small circular
button that wraps `Tooltip` for column header use.

### `Badge` (`src/components/ui/badge.tsx`)
Variants: success / warning / danger / neutral / info / brand. Sizes: sm / md.
Uses CSS variable tokens for colors, consistent with design system.

### `Footer` (`src/components/layout/footer.tsx`)
Medical disclaimer banner (info-bg) at top of footer. Navigation grid (popular peptides,
resources, data & legal). Bottom bar with copyright and Finnrick attribution.

---

## Primary User Flows

### Flow 1: "Compare vendors for a peptide"
1. Home search bar → `/peptides?search=bpc-157`
2. Catalog card → `/peptides/bpc-157`
3. Vendor comparison table — sort by Trust, check Finnrick grades, expand lab tests
4. Click "View →" to go to vendor's product page

### Flow 2: "Understand vendor safety"
1. Nav → Vendors → `/vendors`
2. Click vendor card → `/vendors/peptide-partners`
3. See aggregated Finnrick grades per peptide, expand individual test results
4. Navigate to specific peptide for cross-vendor comparison

### Flow 3: "Browse by use-case"
1. Home page category grid → click "Recovery & Repair"
2. Lands on `/peptides?search=bpc-157` (or similar pre-filtered URL)
3. Filter by Finnrick grade "A" to narrow to highest quality
4. Sort by price to find best value

---

## Extending the Platform

### Adding a new peptide
Database only — add via Prisma seed or admin. The API and UI handle new entries
automatically. Assign `category` to one of the existing values for proper categorization.

### Adding a new vendor
1. Add `Vendor` record in the database
2. Add `VendorMapping` linking to Finnrick slug and scraping config
3. Implement `VendorFetcher` in `src/lib/vendors/` following existing pattern
4. Register in the vendor refresh worker

### Adding a new rating source (beyond Finnrick)
1. Define a new set of CSS variable tokens for grade colors in `globals.css`
2. Create a `RatingBadge` component analogous to `GradeBadge`
3. Add a `XxxScore` column to `PriceTable`
4. Update `PeptideDetail` and API routes to include the new data
5. Document provenance clearly — never conflate third-party data with Peptide Daily's own metrics

### Dark mode
All color tokens have dark mode overrides in the `@media (prefers-color-scheme: dark)` block
in `globals.css`. No Tailwind `dark:` prefixes needed — use CSS variables exclusively.

---

## Production Concerns

### Performance
- Peptide and vendor listing use server-side pagination (page/pageSize params)
- Redis caching on all list and detail API routes (5–10 min TTL)
- FeaturedPeptides on the home page uses Next.js `revalidate: 300` ISR

### Error states
All pages have explicit loading skeletons, error states with retry, and empty states.
Missing Finnrick data shows `GradeBadgeEmpty` / `TrustScoreBarEmpty` — never blank UI.

### Accessibility
- Semantic HTML throughout (h1–h3, nav, section, dl, table)
- All interactive elements have `aria-label` where text is non-descriptive
- Tooltips use `role="tooltip"` and `aria-describedby`
- Focus rings via `:focus-visible` with 2px accent outline
- Color contrast: all body text meets WCAG AA against their respective backgrounds

### Security
- No client-side secrets; all vendor scraping and Finnrick import runs server-side
- Rate limiting on all public API routes via `withRateLimit()`
- Review content sanitized with `sanitize-html` before storage
- No hard-coded API keys; all config via `.env`
