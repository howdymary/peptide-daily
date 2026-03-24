import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Content Templates",
  robots: { index: false, follow: false },
};

/* ── Shared slide primitives ──────────────────────────────────────────── */

const NAVY = "#1B2A4A";
const TEAL = "#0D6E6E";
const TEAL_LIGHT = "#1A8F8F";
const AMBER = "#E8A838";
const WHITE = "#ffffff";
const SLATE = "#F7FAFC";
const LIGHT_GRAY = "#EDF2F7";

const slideBase: React.CSSProperties = {
  width: 1080,
  height: 1080,
  position: "relative",
  fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)',
  overflow: "hidden",
  flexShrink: 0,
};

function Watermark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 28,
        right: 32,
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: "0.02em",
        color: dark ? "rgba(255,255,255,0.35)" : "rgba(27,42,74,0.25)",
      }}
    >
      peptidedaily.com
    </span>
  );
}

function SlideNumber({
  current,
  total,
  dark = false,
}: {
  current: number;
  total: number;
  dark?: boolean;
}) {
  return (
    <span
      style={{
        position: "absolute",
        bottom: 28,
        left: 32,
        fontSize: 16,
        fontWeight: 600,
        color: dark ? "rgba(255,255,255,0.3)" : "rgba(27,42,74,0.2)",
        letterSpacing: "0.05em",
      }}
    >
      {current}/{total}
    </span>
  );
}

function TitleSlide({
  title,
  subtitle,
  slideNum,
  totalSlides,
  icon,
}: {
  title: string;
  subtitle: string;
  slideNum: number;
  totalSlides: number;
  icon: string;
}) {
  return (
    <div style={{ ...slideBase, background: NAVY, color: WHITE }}>
      {/* Decorative accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${TEAL}, ${AMBER})`,
        }}
      />
      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: AMBER,
          }}
        >
          Peptide Daily Guide
        </span>
        <span
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
      {/* Icon */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          width: 100,
          height: 100,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${TEAL}, ${TEAL_LIGHT})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
        }}
      >
        {icon}
      </div>
      {/* Title */}
      <div style={{ position: "absolute", top: 340, left: 80, right: 80 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
            color: WHITE,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            marginTop: 28,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          {subtitle}
        </p>
      </div>
      {/* Bottom branding */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: TEAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
            color: WHITE,
          }}
        >
          PD
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          peptidedaily.com
        </span>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 68,
          right: 80,
          fontSize: 15,
          fontWeight: 500,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.05em",
        }}
      >
        Swipe &rarr;
      </span>
      <SlideNumber current={slideNum} total={totalSlides} dark />
    </div>
  );
}

function CTASlide({
  heading,
  subtext,
  slideNum,
  totalSlides,
}: {
  heading: string;
  subtext: string;
  slideNum: number;
  totalSlides: number;
}) {
  return (
    <div style={{ ...slideBase, background: NAVY, color: WHITE }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${TEAL}, ${AMBER})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: TEAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 32,
            color: WHITE,
            marginBottom: 40,
          }}
        >
          PD
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            margin: 0,
            color: WHITE,
            letterSpacing: "-0.02em",
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.55)",
            marginTop: 24,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          {subtext}
        </p>
        <div
          style={{
            marginTop: 48,
            padding: "18px 56px",
            borderRadius: 14,
            background: AMBER,
            color: NAVY,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.01em",
          }}
        >
          peptidedaily.com
        </div>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.35)",
            marginTop: 20,
          }}
        >
          Free price comparisons &middot; Lab-verified ratings &middot; No
          affiliate bias
        </p>
      </div>
      <SlideNumber current={slideNum} total={totalSlides} dark />
      <Watermark dark />
    </div>
  );
}

function ContentSlide({
  slideNum,
  totalSlides,
  children,
}: {
  slideNum: number;
  totalSlides: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...slideBase, background: WHITE, color: NAVY }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, ${TEAL}, ${AMBER})`,
        }}
      />
      <div style={{ padding: 72, height: "100%", position: "relative" }}>
        {children}
      </div>
      <SlideNumber current={slideNum} total={totalSlides} />
      <Watermark />
    </div>
  );
}

function NumberBadge({
  num,
  color = TEAL,
}: {
  num: number | string;
  color?: string;
}) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: color,
        color: WHITE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 24,
        flexShrink: 0,
      }}
    >
      {num}
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#E6F5F5",
          border: `2px solid ${TEAL}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <span style={{ color: TEAL, fontSize: 20, fontWeight: 700 }}>
          &#10003;
        </span>
      </div>
      <span
        style={{
          fontSize: 28,
          fontWeight: 500,
          lineHeight: 1.4,
          color: NAVY,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function RedFlagItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "#FDF2F2",
          border: "2px solid #c23030",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          fontSize: 22,
        }}
      >
        <span style={{ fontSize: 22 }}>&#9873;</span>
      </div>
      <span
        style={{
          fontSize: 28,
          fontWeight: 500,
          lineHeight: 1.4,
          color: NAVY,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function SectionTitle({
  text,
  accent = TEAL,
}: {
  text: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          width: 48,
          height: 4,
          borderRadius: 2,
          background: accent,
          marginBottom: 18,
        }}
      />
      <h3
        style={{
          fontFamily: 'var(--font-display, "Outfit", sans-serif)',
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.15,
          margin: 0,
          color: NAVY,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </h3>
    </div>
  );
}

/* ── Carousel wrapper ─────────────────────────────────────────────────── */

function CarouselPreview({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 80 }}>
      <h2
        style={{
          fontFamily: 'var(--font-display, "Outfit", sans-serif)',
          fontSize: 24,
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "var(--muted)",
          marginBottom: 20,
        }}
      >
        ID: {id} &middot; Each card is 1080&times;1080px &middot; Screenshot
        individually for carousel posts
      </p>
      <div
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          paddingBottom: 16,
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function SocialContentPage() {
  return (
    <div style={{ padding: "40px 48px 120px", background: "var(--background)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <header style={{ marginBottom: 60 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: TEAL,
              marginBottom: 8,
            }}
          >
            Internal Tool
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: 36,
              fontWeight: 700,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Social Content Templates
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--muted)",
              marginTop: 8,
              maxWidth: 700,
            }}
          >
            Screenshot each slide at 1080&times;1080px for Instagram/TikTok
            carousel posts. Scroll horizontally to see all slides in each
            guide.
          </p>
        </header>

        {/* ── Guide 1: How to Read a Peptide Vendor's COA ──────────────── */}
        <CarouselPreview
          id="guide-01-coa"
          title='Guide 01 — "How to Read a Peptide Vendor&#39;s COA"'
        >
          <TitleSlide
            icon="&#128269;"
            title="How to Read a Peptide Vendor's COA"
            subtitle="6 things to look for on every Certificate of Analysis before you buy."
            slideNum={1}
            totalSlides={6}
          />

          <ContentSlide slideNum={2} totalSlides={6}>
            <SectionTitle text="What Is a COA?" />
            <p
              style={{
                fontSize: 28,
                lineHeight: 1.6,
                color: NAVY,
                maxWidth: 900,
              }}
            >
              A{" "}
              <strong style={{ color: TEAL }}>
                Certificate of Analysis (COA)
              </strong>{" "}
              is a document from a third-party lab that verifies the identity,
              purity, and composition of a peptide product.
            </p>
            <div
              style={{
                marginTop: 48,
                padding: 32,
                borderRadius: 16,
                background: LIGHT_GRAY,
                border: "1px solid #CBD5E0",
              }}
            >
              <p style={{ fontSize: 22, color: "#4A5568", margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: NAVY }}>Why it matters:</strong> Without
                a valid COA, you have no way to confirm what you are purchasing
                matches what is advertised.
              </p>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={3} totalSlides={6}>
            <SectionTitle text="Key Sections to Check" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              {[
                ["Peptide Identity", "Confirm the peptide name and sequence match your order."],
                ["Purity %", "Look for HPLC purity of 98% or higher for research-grade peptides."],
                ["Lab Name & Date", "A legitimate COA names the testing lab and has a recent date."],
              ].map(([label, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <NumberBadge num={i + 1} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 22, color: "#4A5568", margin: "6px 0 0", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={4} totalSlides={6}>
            <SectionTitle text="More Sections to Check" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              {[
                ["Mass Spec Data", "Mass spectrometry confirms molecular weight matches the target peptide."],
                ["Endotoxin Levels", "Should be below 0.5 EU/mg for injectable-grade peptides."],
                ["Batch/Lot Number", "Every COA should tie to a specific lot so results are traceable."],
              ].map(([label, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <NumberBadge num={i + 4} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 22, color: "#4A5568", margin: "6px 0 0", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={5} totalSlides={6}>
            <SectionTitle text="Red Flags on a COA" accent="#c23030" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {[
                "No third-party lab name listed",
                "Purity below 95% with no explanation",
                "Date is more than 12 months old",
                "Generic template with no batch-specific data",
                "COA is just a screenshot or blurry image",
              ].map((text, i) => (
                <RedFlagItem key={i} text={text} />
              ))}
            </div>
          </ContentSlide>

          <CTASlide
            heading="Compare Lab-Verified Vendors"
            subtext="Peptide Daily cross-references COA data with independent Finnrick lab testing to rate vendor quality."
            slideNum={6}
            totalSlides={6}
          />
        </CarouselPreview>

        {/* ── Guide 2: Beginner's Checklist Before Buying ──────────────── */}
        <CarouselPreview
          id="guide-02-checklist"
          title='Guide 02 — "Beginner&#39;s Checklist Before Buying Peptides"'
        >
          <TitleSlide
            icon="&#9745;"
            title="Beginner's Checklist Before Buying Peptides"
            subtitle="7 things to verify before placing your first order."
            slideNum={1}
            totalSlides={7}
          />

          <ContentSlide slideNum={2} totalSlides={7}>
            <SectionTitle text="Research the Vendor" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <CheckItem text="Does the vendor publish third-party COAs for every product?" />
              <CheckItem text="Is there an established online presence with real customer reviews?" />
              <CheckItem text="Do they have a physical business address listed?" />
            </div>
            <div
              style={{
                marginTop: 48,
                padding: 28,
                borderRadius: 14,
                background: "#E6F5F5",
                borderLeft: `5px solid ${TEAL}`,
              }}
            >
              <p style={{ fontSize: 21, margin: 0, color: NAVY, lineHeight: 1.5 }}>
                <strong>Pro tip:</strong> Check Peptide Daily's vendor ratings
                for Finnrick lab-verified scores before purchasing.
              </p>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={3} totalSlides={7}>
            <SectionTitle text="Verify Product Quality" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <CheckItem text="Request or download the COA for your specific batch" />
              <CheckItem text="Confirm purity is 98%+ via HPLC testing" />
              <CheckItem text="Check that the peptide sequence matches published research" />
            </div>
          </ContentSlide>

          <ContentSlide slideNum={4} totalSlides={7}>
            <SectionTitle text="Understand Pricing" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <CheckItem text="Compare price per milligram, not just per vial" />
              <CheckItem text="Factor in shipping costs and delivery time" />
              <CheckItem text="Be suspicious of prices far below market average" />
            </div>
            <div
              style={{
                marginTop: 48,
                padding: 28,
                borderRadius: 14,
                background: "#FFF8E7",
                borderLeft: `5px solid ${AMBER}`,
              }}
            >
              <p style={{ fontSize: 21, margin: 0, color: NAVY, lineHeight: 1.5 }}>
                <strong>Remember:</strong> Cheapest is rarely best.
                Suspiciously low prices often mean lower purity or no real
                testing.
              </p>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={5} totalSlides={7}>
            <SectionTitle text="Payment & Shipping" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <CheckItem text="Vendor offers secure payment options" />
              <CheckItem text="Peptides are shipped with cold packs when required" />
              <CheckItem text="Package is discreet with proper labeling" />
            </div>
          </ContentSlide>

          <ContentSlide slideNum={6} totalSlides={7}>
            <SectionTitle text="Storage Prep" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <CheckItem text="You have bacteriostatic water for reconstitution" />
              <CheckItem text="Your refrigerator or freezer space is ready" />
              <CheckItem text="You have sterile syringes and alcohol swabs" />
              <CheckItem text="You understand the reconstitution process" />
            </div>
          </ContentSlide>

          <CTASlide
            heading="Ready to Compare?"
            subtext="Use Peptide Daily to find lab-verified vendors at the best prices, all in one place."
            slideNum={7}
            totalSlides={7}
          />
        </CarouselPreview>

        {/* ── Guide 3: 5 Red Flags in Peptide Marketing ────────────────── */}
        <CarouselPreview
          id="guide-03-red-flags"
          title='Guide 03 — "5 Red Flags in Peptide Marketing"'
        >
          <TitleSlide
            icon="&#9888;"
            title="5 Red Flags in Peptide Marketing"
            subtitle="Misleading claims to watch out for when browsing peptide vendors."
            slideNum={1}
            totalSlides={6}
          />

          <ContentSlide slideNum={2} totalSlides={6}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 36 }}>
              <NumberBadge num={1} color="#c23030" />
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                    fontSize: 36,
                    fontWeight: 700,
                    margin: 0,
                    color: NAVY,
                  }}
                >
                  &ldquo;Pharmaceutical Grade&rdquo;
                </h3>
              </div>
            </div>
            <p style={{ fontSize: 26, lineHeight: 1.6, color: "#4A5568", maxWidth: 860 }}>
              Research peptide vendors are <strong style={{ color: NAVY }}>not pharmacies</strong>.
              This term implies FDA-level manufacturing standards that research
              chemical companies do not meet. Legitimate vendors say
              &ldquo;research grade&rdquo; instead.
            </p>
            <div
              style={{
                marginTop: 48,
                padding: 28,
                borderRadius: 14,
                background: "#FDF2F2",
                borderLeft: "5px solid #c23030",
              }}
            >
              <p style={{ fontSize: 21, margin: 0, color: NAVY, lineHeight: 1.5 }}>
                <strong>What to look for instead:</strong> Vendors who specify
                exact purity percentages with lab verification, not vague
                quality claims.
              </p>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={3} totalSlides={6}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 36 }}>
              <NumberBadge num={2} color="#c23030" />
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                    fontSize: 36,
                    fontWeight: 700,
                    margin: 0,
                    color: NAVY,
                  }}
                >
                  Before/After Photos
                </h3>
              </div>
            </div>
            <p style={{ fontSize: 26, lineHeight: 1.6, color: "#4A5568", maxWidth: 860 }}>
              Peptide vendors using <strong style={{ color: NAVY }}>customer transformation photos</strong> are
              making implied health claims, which is both legally questionable and scientifically misleading
              for research chemicals.
            </p>
            <div
              style={{
                marginTop: 48,
                padding: 28,
                borderRadius: 14,
                background: "#FDF2F2",
                borderLeft: "5px solid #c23030",
              }}
            >
              <p style={{ fontSize: 21, margin: 0, color: NAVY, lineHeight: 1.5 }}>
                <strong>What to look for instead:</strong> Vendors who reference
                published research studies and link to PubMed literature.
              </p>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={4} totalSlides={6}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 36 }}>
              <NumberBadge num={3} color="#c23030" />
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                    fontSize: 36,
                    fontWeight: 700,
                    margin: 0,
                    color: NAVY,
                  }}
                >
                  &ldquo;99.9% Pure&rdquo; With No COA
                </h3>
              </div>
            </div>
            <p style={{ fontSize: 26, lineHeight: 1.6, color: "#4A5568", maxWidth: 860 }}>
              Claiming extremely high purity without providing a downloadable,
              batch-specific Certificate of Analysis is a major warning sign.{" "}
              <strong style={{ color: NAVY }}>No COA = no proof.</strong>
            </p>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 20,
              }}
            >
              <div style={{ flex: 1, padding: 24, borderRadius: 14, background: "#FDF2F2", textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#c23030", margin: 0 }}>BAD</p>
                <p style={{ fontSize: 20, color: "#4A5568", margin: "8px 0 0" }}>&ldquo;99.9% purity guaranteed&rdquo;</p>
              </div>
              <div style={{ flex: 1, padding: 24, borderRadius: 14, background: "#E6F5F5", textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: TEAL, margin: 0 }}>GOOD</p>
                <p style={{ fontSize: 20, color: "#4A5568", margin: "8px 0 0" }}>&ldquo;98.3% purity (HPLC) &mdash; COA attached&rdquo;</p>
              </div>
            </div>
          </ContentSlide>

          <ContentSlide slideNum={5} totalSlides={6}>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 16 }}>
                  <NumberBadge num={4} color="#c23030" />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display, "Outfit", sans-serif)', fontSize: 32, fontWeight: 700, margin: 0, color: NAVY }}>
                      Aggressive Dosing Advice
                    </h3>
                    <p style={{ fontSize: 22, color: "#4A5568", margin: "8px 0 0", lineHeight: 1.45 }}>
                      Vendors providing specific dosing protocols are acting as
                      unqualified medical advisors. Research vendors should defer
                      to published literature.
                    </p>
                  </div>
                </div>
              </div>
              <div
                style={{ height: 1, background: "#CBD5E0" }}
              />
              <div>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 16 }}>
                  <NumberBadge num={5} color="#c23030" />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display, "Outfit", sans-serif)', fontSize: 32, fontWeight: 700, margin: 0, color: NAVY }}>
                      Fake Urgency &amp; Scarcity
                    </h3>
                    <p style={{ fontSize: 22, color: "#4A5568", margin: "8px 0 0", lineHeight: 1.45 }}>
                      Countdown timers, &ldquo;only 3 left!&rdquo; banners, and
                      flash-sale pressure tactics are retail manipulation
                      techniques, not signs of a serious research supplier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ContentSlide>

          <CTASlide
            heading="Cut Through the Noise"
            subtext="Peptide Daily rates vendors on lab data, not marketing. See how your vendor stacks up."
            slideNum={6}
            totalSlides={6}
          />
        </CarouselPreview>

        {/* ── Guide 4: How Peptide Pricing Actually Works ───────────────── */}
        <CarouselPreview
          id="guide-04-pricing"
          title='Guide 04 — "How Peptide Pricing Actually Works"'
        >
          <TitleSlide
            icon="&#128176;"
            title="How Peptide Pricing Actually Works"
            subtitle="Understanding what drives cost so you can spot fair deals vs. rip-offs."
            slideNum={1}
            totalSlides={5}
          />

          <ContentSlide slideNum={2} totalSlides={5}>
            <SectionTitle text="The Cost Breakdown" />
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                ["Raw Synthesis", "40-55%", "Amino acid chains are built via solid-phase synthesis. Longer sequences = higher cost."],
                ["Purification", "15-25%", "HPLC purification to reach 98%+ purity is expensive but essential."],
                ["Testing & QC", "10-15%", "Mass spec, endotoxin, and sterility testing add real cost."],
                ["Overhead & Margin", "15-25%", "Packaging, cold-chain shipping, staff, and profit margin."],
              ].map(([label, pct, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div
                    style={{
                      minWidth: 90,
                      padding: "8px 0",
                      textAlign: "center",
                      borderRadius: 10,
                      background: i === 0 ? TEAL : i === 1 ? TEAL_LIGHT : i === 2 ? AMBER : NAVY,
                      color: WHITE,
                      fontWeight: 700,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {pct}
                  </div>
                  <div>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 20, color: "#4A5568", margin: "4px 0 0", lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={3} totalSlides={5}>
            <SectionTitle text="Why Prices Vary So Much" />
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                ["Peptide Length", "A 5-amino-acid peptide costs a fraction of a 40+ amino acid one. BPC-157 (15 AA) will always cost less than GLP-1 analogs."],
                ["Purity Level", "Going from 95% to 99% purity can double the purification cost. Always compare at the same purity tier."],
                ["Volume Ordered", "Vendors buying synthesis in bulk from Chinese or Indian labs get significantly lower per-unit costs."],
              ].map(([label, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <NumberBadge num={i + 1} color={AMBER} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 21, color: "#4A5568", margin: "6px 0 0", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={4} totalSlides={5}>
            <SectionTitle text="The Smart Buyer's Rule" />
            <div
              style={{
                padding: 40,
                borderRadius: 20,
                background: NAVY,
                color: WHITE,
                textAlign: "center",
                marginBottom: 36,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                  fontSize: 34,
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Compare price per milligram at the same purity level
              </p>
              <p style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 16, marginBottom: 0 }}>
                A $30 vial at 95% purity is not cheaper than a $45 vial at 99% purity.
              </p>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1, padding: 28, borderRadius: 14, background: "#FDF2F2", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#c23030", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Avoid</p>
                <p style={{ fontSize: 20, color: NAVY, margin: "12px 0 0", fontWeight: 600 }}>Cheapest per vial</p>
                <p style={{ fontSize: 18, color: "#4A5568", margin: "4px 0 0" }}>Ignores purity &amp; mg</p>
              </div>
              <div style={{ flex: 1, padding: 28, borderRadius: 14, background: "#E6F5F5", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Better</p>
                <p style={{ fontSize: 20, color: NAVY, margin: "12px 0 0", fontWeight: 600 }}>Cost per mg at 98%+</p>
                <p style={{ fontSize: 18, color: "#4A5568", margin: "4px 0 0" }}>Apples-to-apples comparison</p>
              </div>
            </div>
          </ContentSlide>

          <CTASlide
            heading="Find the Best Price per mg"
            subtext="Peptide Daily normalizes pricing across vendors so you can compare apples to apples, instantly."
            slideNum={5}
            totalSlides={5}
          />
        </CarouselPreview>

        {/* ── Guide 5: Peptide Storage & Handling Basics ────────────────── */}
        <CarouselPreview
          id="guide-05-storage"
          title='Guide 05 — "Peptide Storage &amp; Handling Basics"'
        >
          <TitleSlide
            icon="&#10052;"
            title="Peptide Storage & Handling Basics"
            subtitle="Keep your peptides potent with proper storage and handling techniques."
            slideNum={1}
            totalSlides={6}
          />

          <ContentSlide slideNum={2} totalSlides={6}>
            <SectionTitle text="Before Reconstitution" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                ["Store Lyophilized (Freeze-Dried)", "Keep unopened vials in the freezer at -20C for long-term storage, or refrigerator (2-8C) for short-term."],
                ["Keep Away from Light", "UV light degrades peptide bonds. Store in original packaging or wrap vials in foil."],
                ["Minimize Temperature Swings", "Avoid repeated freeze-thaw cycles. Only remove a vial when you are ready to reconstitute."],
              ].map(([label, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <NumberBadge num={i + 1} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 21, color: "#4A5568", margin: "6px 0 0", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={3} totalSlides={6}>
            <SectionTitle text="Reconstitution Steps" />
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                "Clean the vial stopper with an alcohol swab",
                "Draw bacteriostatic water into a sterile syringe",
                "Inject water slowly down the side of the vial",
                "Gently swirl (never shake) until fully dissolved",
                "Label the vial with date, peptide name, and concentration",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: i < 2 ? TEAL : i < 4 ? TEAL_LIGHT : AMBER,
                      color: WHITE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: NAVY,
                      paddingTop: 6,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={4} totalSlides={6}>
            <SectionTitle text="After Reconstitution" />
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                ["Refrigerate Immediately", "Reconstituted peptides must be stored at 2-8C (standard refrigerator). Never re-freeze."],
                ["Use Within 3-4 Weeks", "Most reconstituted peptides begin degrading after 28 days, even when refrigerated properly."],
                ["Use Sterile Technique", "Always swab the vial top with alcohol before drawing. Use a fresh needle each time."],
              ].map(([label, desc], i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <NumberBadge num={i + 1} color={AMBER} />
                  <div>
                    <p style={{ fontSize: 26, fontWeight: 700, margin: 0, color: NAVY }}>{label}</p>
                    <p style={{ fontSize: 21, color: "#4A5568", margin: "6px 0 0", lineHeight: 1.45 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSlide>

          <ContentSlide slideNum={5} totalSlides={6}>
            <SectionTitle text="Quick Reference" />
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #CBD5E0",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "flex",
                  background: NAVY,
                  color: WHITE,
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                <div style={{ flex: 2, padding: "18px 24px" }}>State</div>
                <div style={{ flex: 2, padding: "18px 24px" }}>Temperature</div>
                <div style={{ flex: 2, padding: "18px 24px" }}>Duration</div>
              </div>
              {[
                ["Lyophilized (sealed)", "-20C (freezer)", "1-2 years"],
                ["Lyophilized (opened)", "2-8C (fridge)", "3-6 months"],
                ["Reconstituted", "2-8C (fridge)", "3-4 weeks"],
                ["In transit", "Cold packs", "2-3 days max"],
              ].map(([state, temp, dur], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    fontSize: 21,
                    background: i % 2 === 0 ? WHITE : SLATE,
                    borderTop: "1px solid #CBD5E0",
                  }}
                >
                  <div style={{ flex: 2, padding: "16px 24px", fontWeight: 600, color: NAVY }}>{state}</div>
                  <div style={{ flex: 2, padding: "16px 24px", color: "#4A5568" }}>{temp}</div>
                  <div style={{ flex: 2, padding: "16px 24px", color: TEAL, fontWeight: 600 }}>{dur}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 32,
                padding: 24,
                borderRadius: 14,
                background: "#FFF8E7",
                borderLeft: `5px solid ${AMBER}`,
              }}
            >
              <p style={{ fontSize: 20, margin: 0, color: NAVY, lineHeight: 1.5 }}>
                <strong>Key rule:</strong> Heat, light, and moisture are the
                three enemies of peptide stability. Minimize exposure to all
                three.
              </p>
            </div>
          </ContentSlide>

          <CTASlide
            heading="Get Vendor Storage Ratings"
            subtext="Peptide Daily evaluates vendor shipping and packaging practices alongside lab purity data."
            slideNum={6}
            totalSlides={6}
          />
        </CarouselPreview>
      </div>
    </div>
  );
}
