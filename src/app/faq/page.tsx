import type { Metadata } from "next";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import { FAQSchema } from "@/components/seo/faq-schema";

export const metadata: Metadata = {
  title: "FAQ | Peptide Daily",
  description:
    "Frequently asked questions about Peptide Daily — how we source data, our scoring methodology, editorial independence, and how to use the platform.",
};

const FAQS = [
  {
    q: "How does Peptide Daily make money?",
    a: "We earn revenue through the Verified Source Program ($99/year for providers who want a verified badge), downloadable resources, and eventually a premium tier. We do not use affiliate links, accept paid rankings, or run advertising. Our editorial content is never sponsored.",
  },
  {
    q: "Where does your pricing data come from?",
    a: "We scrape prices directly from vendor websites using automated fetchers that run every 15 minutes. Each vendor has a dedicated scraper that extracts product listings, prices, and availability status. We never pull data from third-party aggregators.",
  },
  {
    q: "What is a Trust Score?",
    a: "The Trust Score (0–100) is our composite quality metric combining three weighted components: Finnrick lab testing data (50%), community reviews (30%), and pricing signals (20%). When a component is missing, weights redistribute proportionally. The formula is fully documented on our Methodology page.",
  },
  {
    q: "What are Finnrick lab grades?",
    a: "Finnrick is an independent third-party lab testing service that tests peptide products from vendors. They assign letter grades (A through E) based on purity, quantity accuracy, and identity testing. We import their published test results and display them alongside our own data.",
  },
  {
    q: "Are you affiliated with any vendors or providers?",
    a: "No. Peptide Daily is editorially independent. We have no ownership stake in, financial relationship with, or affiliate agreement with any vendor, pharmacy, clinic, or manufacturer listed on the platform. Vendors cannot pay for better placement or higher scores.",
  },
  {
    q: "How is the Protocol Builder safety score calculated?",
    a: "The safety score starts at 100 and deducts points based on known interactions between the peptides in your protocol. An 'avoid' interaction deducts 30 points, a 'caution' interaction deducts 10 points, and protocols with more than 4 compounds receive a small complexity penalty. The score is informational only — always consult a healthcare professional.",
  },
  {
    q: "How accurate are the Kinetics Lab curves?",
    a: "PK curves are generated using a standard one-compartment pharmacokinetic model with first-order absorption (Bateman equation). Input parameters (Tmax, half-life, bioavailability) come from published clinical pharmacology literature. The curves show normalized relative concentration and should be used for educational comparison only, not for clinical dosing decisions.",
  },
  {
    q: "How often is provider information updated?",
    a: "Provider listings are reviewed periodically. FDA registration and compounding pharmacy status are verified against public FDA and state board databases. If you notice outdated information, contact us and we will update it promptly.",
  },
  {
    q: "Can I submit my clinic, pharmacy, or vendor for listing?",
    a: "Yes. Any legitimate provider can request a listing through our Directory page. If you want a Verified Source badge, you can apply through the Verified Source Program. The badge costs $99/year and requires identity verification — it does not affect search ranking.",
  },
  {
    q: "Is this medical advice?",
    a: "No. Peptide Daily is a research and information platform. Nothing on this site constitutes medical advice, diagnosis, or treatment recommendations. All content is intended for educational and research purposes. Always consult a qualified healthcare professional before starting any peptide protocol.",
  },
];

export default function FAQPage() {
  return (
    <div className="section-spacing">
      <FAQSchema faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      <div className="container-page max-w-3xl">
        <span className="eyebrow">FAQ</span>
        <h1 className="section-heading mt-4">Frequently asked questions</h1>
        <p className="section-subheading">
          How we work, where the data comes from, and what the numbers mean.
        </p>

        <dl className="mt-10 space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="surface-card p-6">
              <dt className="text-base font-semibold text-[var(--text-primary)]">
                {faq.q}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
