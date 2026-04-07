# Peptide Daily — Watercolor Brand System

---

## Part 1: Watercolor Logo Concept

### 1.1 Base Concept

The Peptide Daily logo is a watercolor rendering of a peptide bottle silhouette, tilted at approximately 28 degrees counterclockwise from vertical (leaning to the upper-left). The style is a wet-on-wet watercolor wash on clean white paper — soft edges, visible pigment variation, subtle granulation texture, and intentional white space.

The bottle silhouette consists of five anatomical parts: a flat-topped cap with subtle grip ridges, a narrow cylindrical neck, tapered shoulders (bezier-curved transition from neck to body), a wide rounded-rectangle body, and implied label/measurement details rendered only through color density variation — never as hard lines.

### 1.2 Visual Details

**Tilt and angle.** The bottle leans 28 degrees counterclockwise. This angle was chosen because it creates dynamic energy (suggesting progress, forward motion) without tipping so far that the bottle looks like it's falling. At this angle the cap points roughly toward 11 o'clock. The silhouette's center of mass sits at approximately 48% from left and 50% from top of the square canvas.

**Cap and label indication.** The cap is distinguished from the body purely through a subtle shift in color density — the cap area holds slightly less pigment (lighter wash), creating a natural visual break. There are no hard internal lines. The "label area" on the body is suggested by a zone of slightly lighter wash in the upper body (where paper shows through more), surrounded by denser pigment — as if the watercolorist lifted the brush slightly over the label zone. Measurement marks at the bottom of the body are implied by faint horizontal pigment pooling, not drawn lines.

**Watercolor effects.** The wash exhibits three key watercolor behaviors:

- Wet-edge darkening: pigment concentrates at the silhouette boundary, creating a visible darker outline that's 2-4x the density of the interior wash. This is the single most important effect — it defines the shape.
- Vertical gradient: lighter at the top (cap/neck — more paper showing through), progressively deeper toward the base (pigment settled by gravity). The top reads as a pale teal; the bottom as a deep teal-navy.
- Soft bleed/halo: beyond the hard silhouette boundary, a very faint wash extends 15-25px outward (at 1024px canvas size), creating the "paint spread on wet paper" effect. This halo is most visible at the bottom and right side of the bottle.

**Favicon/small-size legibility.** The silhouette reads clearly even at 16x16px because: the bottle is the only element on a white field (maximum contrast), the wet-edge darkening creates a natural "outline" without needing a drawn border, and the diagonal tilt makes the shape distinctive even when very small (distinguishable from a generic rectangle).

### 1.3 Color Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Teal (primary wash) | #1FADC7 | (31, 173, 199) | Main watercolor fill — light, luminous |
| Deep Teal (pooling) | #146B99 | (20, 107, 153) | Edge darkening, bottom pooling |
| Navy (accent dark) | #0D4778 | (13, 71, 120) | Defining edge stroke, darkest marks |
| Warm Amber (temperature) | #D18547 | (209, 133, 71) | Subtle warm shift at base (5% opacity) |

**How the colors behave.** The teal wash is applied at 40-50% opacity, meaning the white paper is always glowing through — this is what creates the luminous, airy quality that distinguishes watercolor from flat digital color. The deep teal appears only at the edges (wet-edge effect) and at the bottom third (gravity pooling). Navy appears only in the thinnest defining outline (1-2px at full size). The warm amber is barely perceptible — it creates a subtle color temperature shift at the bottom-right of the bottle that makes the piece feel hand-painted rather than algorithmically generated.

**Color concentration pattern.** Color is most dense at the bottom-center of the body, where three effects overlap: the gradient's deepest point, edge pooling from left and right boundaries, and gravity settling. Color is lightest at the upper-center of the body (the "label" zone) where the paper shows through most. The cap is medium-light. The bleed halo is at 6-10% opacity of the primary teal.

### 1.4 Wordmark Integration

**Typography.** The wordmark uses a clean, geometric sans-serif: Inter (already in the product's design system) or Instrument Sans (available in the brand font library). Weight: Regular (400) for "Daily", Medium (500) for "Peptide". Letter-spacing: -0.01em on both words. This creates a subtle hierarchy where "Peptide" anchors and "Daily" flows.

**Horizontal lockup (primary).** Icon on the left, wordmark on the right. The icon occupies a square that is 75% of the total lockup height. "Peptide" sits on the upper baseline, "Daily" on the lower baseline, with the two words vertically centered against the icon. The gap between icon and text is equal to 40% of the icon width. "Peptide" is rendered in navy (#0D2D52). "Daily" is rendered in teal (#0D8598). This color split echoes the watercolor's own gradient from dark to light.

**Stacked lockup (secondary).** Icon centered above, "Peptide Daily" as a single line centered below. The text sits at 60% of the icon width. Same color treatment: "Peptide" in navy, "Daily" in teal, separated by a space.

**Clear space.** Minimum clear space around the lockup equals the cap width of the bottle icon on all sides. No other graphic elements may intrude into this zone.

### 1.5 Variants

**Icon-only.** The watercolor bottle on white, used for app icons, favicons, and social avatars. At sizes below 64px, the defining outline should be slightly heavier (relatively) to maintain legibility.

**Monochrome/single-color.** The watercolor wash is mapped entirely to brand navy (#0C4A6E). All tonal variation (light wash, edge pooling, gradients) is preserved as different values of navy on white. This version works for single-color print, fax headers, and embossing. It is the most "dramatic" variant — the navy creates a bold, confident mark.

**Dark mode.** On dark backgrounds (#0C0E18 or similar), the bottle's watercolor wash is shifted to light teal-cyan tones (approximately #B4E4F0 for the body, brighter cyan at the edges). The bleed halo becomes a visible soft glow, which actually enhances the watercolor quality on dark grounds. The defining edge becomes lighter than the interior, reversing the light-mode relationship.

**On light neutral backgrounds.** For use on off-white or light gray surfaces (#F8FAFC, the product's existing `--background`), the primary white-background version works without modification. The slight vignette at the logo's edges provides enough separation.

---

## Part 2: Watercolor Visual System & Brand Voice

### 2.1 Visual Language Beyond the Logo

Watercolor is used as a system of accents, atmospheres, and transitions — never as full-bleed texture. The principle: watercolor occupies no more than 20% of any given layout's visual area. The remaining 80% is clean white space, structured typography, and sharp data visualization. This ratio keeps the brand from looking messy, juvenile, or "arts and crafts."

**Background washes.** Subtle teal washes (3-8% opacity) can appear behind section headers, hero areas, or card groups. These washes should be organic in shape — not rectangles — with soft, irregular edges. They function like colored paper behind a display, creating gentle zones without hard borders. Maximum wash size: 60% of viewport width, positioned asymmetrically (never centered).

**Accent shapes.** Small watercolor "blobs" can accompany data callouts, pull quotes, or feature highlights. These shapes echo the bottle silhouette's rounded proportions: capsule shapes, soft ovals, or gently irregular circles. They use the primary teal at 10-15% opacity and are always positioned partially behind content (z-index below text), never floating freely.

**Overlays for data.** Behind charts, comparison cards, or data tables, a very faint (2-4% opacity) watercolor gradient can run along the bottom or left edge. This creates depth without interfering with data readability. The gradient should always flow in the same direction as the bottle's tilt (upper-left to lower-right).

**What to avoid.** Never use watercolor washes at more than 15% opacity behind text content. Never use more than two wash shapes on a single screen/page. Never place washes with hard rectangular crops — always let edges bleed naturally to transparent. Never use watercolor texture as a repeating pattern or tile.

### 2.2 Image System for Content

**Social posts (Instagram, Pinterest, TikTok covers).** Each post has a persistent white border (5% of width on all sides) with the Peptide Daily wordmark small in the bottom-right corner. Content sits centered within. A single watercolor wash accent (teal capsule shape or bottle-echo blob) sits behind the main text at 10% opacity. Headlines use Inter Medium in navy.

**Blog headers.** Full-width images with a watercolor wash gradient running from left to right behind the title text. The wash is strongest at the left edge (15% opacity) and fades to transparent by the center. Title text sits in the right 60% of the header. A small bottle icon watermark sits in the lower-left corner at 8% opacity.

**Educational graphics and comparison tables.** Watercolor is used as cell/row highlighting: instead of solid-color alternating rows, every other row has a faint teal wash (3% opacity) with slightly irregular top and bottom edges. Column headers can sit on a soft watercolor band (8% opacity). Grade badges (A-E) can have watercolor-style circular backgrounds instead of flat fills.

**Reusable motifs.** Three recurring watercolor elements form the motif library: (1) the "capsule" — a horizontal oval wash used behind text callouts, (2) the "drop" — a vertical oval wash used behind single data points or icons, (3) the "field" — a large, very faint rectangular-ish wash used as section background. All three use the primary teal at varying opacities.

### 2.3 "Instantly Shareable" Aesthetics

**Thumb-stopping qualities.** Each visual has: high contrast between clean white space and the vivid teal watercolor accent, a single bold headline (max 8 words), and the bottle icon as a subtle watermark. The watercolor element itself is the thumb-stopper — it's unusual in the health/data space, where competitors use flat gradients, stock photography, or generic medical imagery. Watercolor signals "curated, human, trustworthy" in a feed dominated by clinical sterility.

**Screenshot-friendly design.** Every visual is designed to be legible when screenshotted and shared in messaging apps. This means: no information lives in the outer 10% of any image (safe zone for chat bubble cropping), text is large enough to read at 50% size, and the brand is identifiable even if the logo is cropped (the teal watercolor wash IS the brand signal).

**Framing.** All social assets use a persistent 5% white border. The Peptide Daily logo (horizontal lockup, small) sits in the bottom-right corner within the border zone. This border creates visual breathing room and ensures the content doesn't bleed into platform UI elements.

**Aspect ratios and layout adaptation.**

- 1:1 (Instagram feed, Twitter): Bottle icon centered at 30% of canvas width. Headline below. Watercolor wash behind headline.
- 4:5 (Instagram portrait): Same as 1:1 but with more vertical white space above headline. Caption area at bottom.
- 9:16 (Stories, TikTok, Reels): Bottle icon at top-third. Headline in middle-third with watercolor wash. Call-to-action or data in bottom-third.
- 16:9 (Blog headers, YouTube thumbnails): Horizontal lockup logo in bottom-right. Content left-aligned. Watercolor wash along left edge.

### 2.4 Brand Voice Alignment

The watercolor style maps to the voice in three ways:

**Calm, evidence-driven.** Watercolor's inherent softness communicates "we're not shouting at you." The cool teal palette signals clinical trust without the coldness of pure white and gray. Data is presented clearly against clean backgrounds; watercolor stays in the background, supporting rather than competing.

**Human and approachable.** The hand-painted texture signals "a person curated this for you" — the opposite of algorithmic sterility. The slight imperfections (pigment granulation, edge variation) are intentional markers of humanity. This is the visual equivalent of a calm, knowledgeable friend explaining something complex.

**Not woo.** The restraint is critical. By keeping watercolor to small accents on large white fields, the brand avoids the "wellness Instagram" aesthetic of full-bleed floral watercolors and pastel gradients. The navy typography and structured data layouts anchor everything in credibility.

**Example taglines and microcopy.**

- "Peptides, made clear." — Primary tagline. Three words. The visual of "clarity" maps directly to the transparent watercolor washes and clean white space.
- "Daily clarity for complex molecules." — Secondary. "Clarity" recurs as the brand promise.
- "Trusted sources. Transparent data." — Trust messaging. The transparency of watercolor literally embodies data transparency.
- "See what's inside." — For vendor comparison features. Double meaning: see inside the bottle (ingredients), see inside the market (pricing/quality).
- "Your daily dose of clarity." — Newsletter/email signup CTA.

---

## Part 3: Practical Guidelines & Example Assets

### 3.1 Implementation Guidelines — Style Guide for Designers

**Do's:**

- Use the official watercolor assets from the `/brand` folder as starting points — don't recreate from scratch
- Keep watercolor opacity between 3-15% for background accents
- Use the teal-to-navy gradient direction consistently (lighter upper-left, deeper lower-right)
- Maintain the 80/20 rule: 80% clean white/structured layout, 20% watercolor accent
- Let watercolor edges bleed naturally to transparent — never hard-crop them
- Use the bottle silhouette's rounded proportions as inspiration for accent shapes
- Test all visuals at 50% scale to ensure text remains legible when screenshotted

**Don'ts:**

- Don't over-saturate watercolor washes (max 15% opacity on backgrounds)
- Don't add heavy outlines or borders to watercolor elements
- Don't use watercolor texture as a repeating tile or full-bleed background
- Don't combine watercolor with other illustration styles (line art, flat vector, 3D)
- Don't use the watercolor bottle on busy or photographic backgrounds
- Don't add drop shadows to watercolor elements (they already have natural depth)
- Don't use more than 2 watercolor accent shapes on any single screen/page
- Don't use warm colors in the watercolor wash (keep to the teal-navy spectrum; amber accent is for the logo only)

**Digital watercolor technique (for designers in Figma/Illustrator/Procreate).**

In Figma: Use the official watercolor PNGs as image fills with adjustable opacity. For custom washes, create a shape, apply a radial gradient from teal to transparent, add inner shadow (teal, spread -10, blur 20) for edge darkening, and add a noise fill at 3% for granulation. Set blend mode to Multiply.

In Procreate: Use the "Wet Wash" or "Wet Glazes" brush from the built-in Watercolor set. Paint a single stroke on a separate layer. Set layer opacity to 30-50%. Add a second layer with a finer brush for edge detail. Flatten and export. The key is single confident strokes — overworking kills the watercolor quality.

In Illustrator: Place the official watercolor PNGs. For vector approximations, use a shape with a Gaussian blur (15-25px), overlaid with a smaller, sharper copy of the same shape at 60% opacity for edge contrast. Add a grain texture effect (Effect > Texture > Grain, intensity 5, contrast 10).

**Ensuring consistency.** Color ratios: in any watercolor accent, the teal primary should account for 70% of the color area, deep teal for 25%, and navy for 5% (edge only). Texture density: granulation noise should be subtle enough that it's invisible at distances beyond arm's length from the screen. When in doubt about opacity: go lighter.

### 3.2 Example Use Cases

**Example 1: Website hero section.** A full-width white banner. The bottle icon (watercolor, 200px wide) sits at the left side, offset 15% from the left edge. To the right of it: "Compare peptide prices and quality" in Inter Medium, 48px, navy. Below: "Transparent lab data from independent testing" in Inter Regular, 20px, muted gray. Behind the headline text, a soft teal watercolor wash (8% opacity, organic capsule shape) extends 400px wide. A "Browse Peptides" CTA button sits below in solid teal (#0D9488) with white text. The overall impression: scientific calm, not a sales page.

**Example 2: Social carousel cover (1:1).** White background with 5% border. Center: the text "BPC-157 Price Guide" in Inter Medium, 36px, navy. Behind the text: a horizontal watercolor capsule wash (12% opacity, teal). Bottom-left: "Updated March 2026" in Inter Regular, 14px, muted gray. Bottom-right: Peptide Daily horizontal lockup, small. The watercolor capsule is the only color element — everything else is typography on white.

**Example 3: Price comparison card.** A white card (border-radius 12px, subtle shadow). Card header: "BPC-157 5mg" in Inter Medium, 20px, navy, with a small watercolor dot (8px circle, teal, 20% opacity) before the name. Below: a comparison table with vendor names, prices, and Finnrick grades. Every other row has a faint teal wash (3% opacity) instead of solid gray alternation. The "Best Price" badge uses a watercolor-style background (teal wash, 15% opacity, rounded) instead of a flat fill. Footer: "Data from Finnrick.com" in 12px muted text.

**Example 4: "Peptide of the Day" social tile (4:5).** White background, 5% border. Top third: the watercolor bottle icon (150px) centered. Middle third: the peptide name in Inter Medium, 28px, navy. Below: 2-3 key data points (category, typical dosage range, number of vendors) in Inter Regular, 16px, each preceded by a tiny watercolor dot. A single horizontal watercolor wash (8% opacity, 60% width, centered) sits behind the data points. Bottom: "peptidedaily.com" and logo lockup, small.

**Example 5: Newsletter header.** 600px wide email header. Left side: watercolor bottle icon (80px). Right side: "Peptide Daily" wordmark in navy + teal. Below: a full-width thin line in teal (1px, 30% opacity). Below that: a subtle watercolor wash gradient (3% opacity) fading from left to right across the full width. This wash establishes the brand immediately and transitions into the clean white content area below.

---

## Appendix: File Inventory

| File | Description | Size |
|------|-------------|------|
| `logo-watercolor-primary.png` | Primary watercolor bottle on white | 1024x1024 |
| `logo-watercolor-favicon.png` | Icon for favicons and small displays | 512x512 |
| `logo-watercolor-dark.png` | Watercolor bottle on dark background | 1024x1024 |
| `logo-watercolor-mono.png` | Single-color navy version | 1024x1024 |
| `logo-lockup-horizontal.png` | Icon + "Peptide Daily" wordmark, horizontal | 2400x700 |
| `logo-lockup-stacked.png` | Icon above "Peptide Daily" wordmark | 900x1300 |
| `design-philosophy.md` | The "Liquid Clarity" design philosophy | — |
| `peptide-daily-brand-guide.md` | This document | — |
