/**
 * Peptide Educational Content Library
 *
 * All content is written for YMYL/E-E-A-T compliance: neutral, research-led,
 * consumer-friendly, and free of therapeutic claims or dosing instructions.
 *
 * Sources are real, peer-reviewed publications and official regulatory pages.
 */

export type RegulatoryStatus =
  | "fda-approved"
  | "investigational"
  | "research-chemical"
  | "compounded"
  | "approved-china";

/**
 * User intent / goal tags — used to filter peptides on the Learn hub and to
 * power SEO landing pages (e.g. /learn/goals/weight-loss).
 */
export type GoalTag =
  | "weight-loss"
  | "muscle-growth"
  | "workout-recovery"
  | "skin"
  | "longevity"
  | "chronic-pain"
  | "immune"
  | "cognitive";

export interface PeptideReference {
  number: number;
  title: string;
  journal: string;
  url: string;
}

export interface RelatedPeptide {
  label: string;
  slug: string;
}

export interface PeptideContent {
  slug: string;
  name: string;
  /** Alternate / shorter display name */
  altName?: string;
  category: "metabolic" | "growth-hormone" | "tissue-repair" | "melanocortin";
  regulatoryStatus: RegulatoryStatus;
  /** One-line status note shown in badge tooltip */
  statusNote: string;
  seoTitle: string;
  metaDescription: string;
  /**
   * 1–2 sentence snippet used in inline "Learn" blocks on news, price, and
   * vendor pages. Should be self-contained and jargon-free.
   */
  shortSummary: string;
  /** User-intent tags that power goal-based filtering and SEO landing pages */
  goalTags: GoalTag[];
  /** Array of paragraph strings */
  overview: string[];
  /** Array of paragraph strings */
  researchContext: string[];
  references: PeptideReference[];
  /** Array of paragraph strings */
  safetyNotes: string[];
  /** How it fits on the platform */
  hubNote: string;
  seeAlso: RelatedPeptide[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY LABELS
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<PeptideContent["category"], string> = {
  "metabolic": "Metabolic / GLP-1",
  "growth-hormone": "Growth Hormone",
  "tissue-repair": "Tissue Repair",
  "melanocortin": "Melanocortin",
};

export const REGULATORY_LABELS: Record<RegulatoryStatus, string> = {
  "fda-approved": "FDA Approved",
  "investigational": "Investigational",
  "research-chemical": "Research Chemical",
  "compounded": "Compounded (Rx)",
  "approved-china": "Approved in China",
};

export const REGULATORY_COLORS: Record<
  RegulatoryStatus,
  { bg: string; text: string; border: string }
> = {
  "fda-approved":     { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  "investigational":  { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "research-chemical":{ bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  "compounded":       { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  "approved-china":   { bg: "#f0fdfa", text: "#134e4a", border: "#99f6e4" },
};

export const GOAL_LABELS: Record<GoalTag, string> = {
  "weight-loss":       "Weight Management",
  "muscle-growth":     "Muscle Growth",
  "workout-recovery":  "Workout Recovery",
  "skin":              "Skin & Beauty",
  "longevity":         "Longevity",
  "chronic-pain":      "Chronic Pain",
  "immune":            "Immune Support",
  "cognitive":         "Cognitive & Sleep",
};

export const GOAL_DESCRIPTIONS: Record<GoalTag, string> = {
  "weight-loss":      "Peptides studied in metabolic contexts — including FDA-approved GLP-1/GIP receptor agonists and investigational compounds involved in appetite regulation and fat metabolism.",
  "muscle-growth":    "Growth hormone secretagogues and peptides studied in contexts of body composition, lean mass, and anabolic signaling. Most are investigational or compounded.",
  "workout-recovery": "Peptides studied for potential roles in tissue repair, wound healing, and musculoskeletal recovery. Most evidence is preclinical.",
  "skin":             "Peptides investigated for skin biology, collagen synthesis, and pigmentation — spanning commercial cosmetic ingredients and investigational compounds.",
  "longevity":        "Peptides associated with cellular health, mitochondrial function, and age-related physiological pathways. Evidence ranges from early-stage to investigational.",
  "chronic-pain":     "Peptides studied for anti-inflammatory and tissue-repair mechanisms relevant to chronic pain contexts. Human data is generally limited.",
  "immune":           "Peptides that modulate immune function — from the relatively well-characterized thymosin class to early-stage antimicrobial peptides.",
  "cognitive":        "Peptides studied for neuroprotective, anxiolytic, and cognitive effects. Most evidence comes from Russian clinical programs or early-phase research.",
};

export const GOAL_ORDER: GoalTag[] = [
  "weight-loss", "muscle-growth", "workout-recovery", "skin",
  "longevity", "chronic-pain", "immune", "cognitive",
];

// ─────────────────────────────────────────────────────────────────────────────
// PEPTIDE DATA
// ─────────────────────────────────────────────────────────────────────────────

export const PEPTIDES: PeptideContent[] = [
  // ── 1. TIRZEPATIDE ─────────────────────────────────────────────────────────
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "metabolic",
    regulatoryStatus: "fda-approved",
    statusNote: "FDA-approved as Mounjaro (T2D) and Zepbound (weight management, OSA)",
    seoTitle: "Tirzepatide: Research Overview, Mechanism & Safety Context",
    metaDescription:
      "Learn what tirzepatide is, how it works as a dual GIP/GLP-1 receptor agonist, and what clinical research has shown. Educational overview only.",
    shortSummary:
      "Tirzepatide is an FDA-approved dual GIP/GLP-1 receptor agonist (Mounjaro, Zepbound) studied for type 2 diabetes and chronic weight management, with extensive Phase 3 trial data.",
    goalTags: ["weight-loss"],
    overview: [
      "Tirzepatide is a synthetic peptide that activates two receptors involved in metabolic signaling: the glucose-dependent insulinotropic polypeptide (GIP) receptor and the glucagon-like peptide-1 (GLP-1) receptor. This dual-receptor mechanism distinguishes it from single-target GLP-1 receptor agonists. Tirzepatide is manufactured by Eli Lilly and is administered as a once-weekly subcutaneous injection.",
      "As a dual agonist, tirzepatide works by mimicking the activity of two naturally occurring incretin hormones that the body releases in response to food intake. These hormones help regulate blood sugar, slow gastric emptying, and influence appetite signaling in the brain. Tirzepatide has been one of the most widely studied peptides in metabolic research in recent years and has received multiple regulatory approvals in the United States.",
    ],
    researchContext: [
      "Tirzepatide has been studied across several large-scale clinical trial programs. The SURPASS series evaluated its effects in adults with type 2 diabetes, while the SURMOUNT series studied its effects in adults with obesity or overweight. Key areas of clinical investigation include metabolic health and glycemic control in type 2 diabetes, body weight management in adults with obesity or overweight (with or without type 2 diabetes), obstructive sleep apnea in adults with obesity, and cardiovascular risk factors associated with excess body weight.",
      "Phase 3 trials in the SURMOUNT program enrolled thousands of participants and evaluated tirzepatide at multiple dose levels over periods up to 72 weeks. Head-to-head trials have also compared tirzepatide with other approved medications in the same therapeutic class. The SURMOUNT-OSA trial specifically examined breathing-related outcomes during sleep in adults with obesity and moderate-to-severe obstructive sleep apnea.",
    ],
    references: [
      {
        number: 1,
        title: "SURMOUNT-1 Phase 3 Trial",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT04184622",
      },
      {
        number: 2,
        title: 'Jastreboff AM, et al. "Tirzepatide Once Weekly for the Treatment of Obesity." NEJM (2022)',
        journal: "New England Journal of Medicine",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
      },
      {
        number: 3,
        title: "FDA Press Release: Approval of Zepbound for Chronic Weight Management (2023)",
        journal: "FDA.gov",
        url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-medication-chronic-weight-management",
      },
      {
        number: 4,
        title: "Mounjaro (Tirzepatide) Prescribing Information — FDA Label",
        journal: "FDA.gov",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/215866s000lbl.pdf",
      },
      {
        number: 5,
        title: "SURMOUNT-OSA Trial",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT05024032",
      },
    ],
    safetyNotes: [
      "Tirzepatide is an FDA-approved prescription medication in the United States. It is marketed under the brand names Mounjaro (for type 2 diabetes) and Zepbound (for chronic weight management and moderate-to-severe obstructive sleep apnea in adults with obesity). Both formulations require a prescription and are administered by subcutaneous injection.",
      "As with all prescription medications, tirzepatide carries labeled warnings and potential side effects, which are described in its FDA-approved prescribing information. Regulatory status and product availability vary by country. Tirzepatide is not available as an oral formulation in any FDA-approved product as of early 2026. Readers should consult a licensed healthcare provider for any decisions related to treatment.",
    ],
    hubNote:
      "Tirzepatide is one of the most widely discussed molecules in the GLP-1 and metabolic peptide space. On our site, it is commonly featured in price comparison and lab-rating tools, and it frequently appears alongside semaglutide, retatrutide, and other incretin-class molecules in educational comparisons.",
    seeAlso: [
      { label: "Semaglutide", slug: "semaglutide" },
      { label: "Retatrutide", slug: "retatrutide" },
      { label: "Mazdutide", slug: "mazdutide" },
      { label: "Survodutide", slug: "survodutide" },
    ],
  },

  // ── 2. SEMAGLUTIDE ─────────────────────────────────────────────────────────
  {
    slug: "semaglutide",
    name: "Semaglutide",
    shortSummary:
      "Semaglutide is an FDA-approved GLP-1 receptor agonist (Ozempic, Wegovy) with robust clinical evidence for type 2 diabetes management and chronic weight loss.",
    goalTags: ["weight-loss"],
    category: "metabolic",
    regulatoryStatus: "fda-approved",
    statusNote: "FDA-approved as Ozempic (T2D), Wegovy (weight management), and Rybelsus (oral T2D)",
    seoTitle: "Semaglutide: Research Overview, Clinical Studies & Regulatory Context",
    metaDescription:
      "What is semaglutide? Learn about this GLP-1 receptor agonist, its clinical research history, and current regulatory status. Educational content only.",
    overview: [
      "Semaglutide is a synthetic peptide analog of human glucagon-like peptide-1 (GLP-1) developed by Novo Nordisk. It activates the GLP-1 receptor, which plays a role in blood sugar regulation, appetite signaling, and gastric motility. Semaglutide's molecular structure includes modifications — specifically, a fatty acid chain that enables albumin binding — that extend its half-life to approximately seven days, allowing once-weekly administration.",
      "Semaglutide is one of the most extensively studied peptides in clinical medicine, with hundreds of clinical trials conducted globally. It is available in both injectable and oral formulations across multiple approved indications. As of late 2025, Novo Nordisk announced FDA approval of an oral semaglutide formulation for chronic weight management, making it the first oral GLP-1 medication approved for that indication.",
    ],
    researchContext: [
      "Semaglutide has been evaluated across several major clinical trial programs. The SUSTAIN program studied injectable semaglutide in adults with type 2 diabetes. The STEP program evaluated its effects on weight management in adults with obesity or overweight. The PIONEER program focused on oral semaglutide for type 2 diabetes. The SELECT trial assessed cardiovascular outcomes in adults with overweight or obesity and established cardiovascular disease.",
      "These programs have collectively enrolled tens of thousands of participants across dozens of countries, making semaglutide one of the most clinically validated peptides in current use. Research has also explored its effects on kidney outcomes, liver fat, and additional cardiometabolic endpoints.",
    ],
    references: [
      {
        number: 1,
        title: 'Wilding JPH, et al. "Once-Weekly Semaglutide in Adults with Overweight or Obesity." NEJM (2021)',
        journal: "New England Journal of Medicine",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183",
      },
      {
        number: 2,
        title: "SELECT Cardiovascular Outcomes Trial",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT03574597",
      },
      {
        number: 3,
        title: "PIONEER 1 Trial — Oral Semaglutide in Type 2 Diabetes",
        journal: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/31189511/",
      },
      {
        number: 4,
        title: "Ozempic (Semaglutide) Prescribing Information — FDA Label",
        journal: "FDA.gov",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/209637s003lbl.pdf",
      },
      {
        number: 5,
        title: "FDA Approval of Wegovy for Chronic Weight Management (2021)",
        journal: "FDA.gov",
        url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-drug-treatment-chronic-weight-management-first-2014",
      },
    ],
    safetyNotes: [
      "Semaglutide is an FDA-approved prescription medication available under several brand names: Ozempic (injectable, for type 2 diabetes), Wegovy (injectable and oral, for chronic weight management), and Rybelsus (oral, for type 2 diabetes). Each formulation has its own approved indication, dosing, and prescribing information.",
      "As with all prescription medications, semaglutide carries labeled warnings and potential adverse effects described in its prescribing information. Regulatory approval and availability vary internationally. Compounded versions of semaglutide have been the subject of ongoing regulatory and legal action in the United States. Readers should consult a licensed healthcare provider for any decisions about treatment.",
    ],
    hubNote:
      "Semaglutide is the benchmark molecule in GLP-1 research and one of the most commonly searched peptides on our platform. It appears prominently in our price comparison tools, lab-rating features, and head-to-head research summaries alongside tirzepatide and other metabolic peptides.",
    seeAlso: [
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Retatrutide", slug: "retatrutide" },
      { label: "Cagrilintide", slug: "cagrilintide" },
      { label: "Mazdutide", slug: "mazdutide" },
    ],
  },

  // ── 3. RETATRUTIDE ─────────────────────────────────────────────────────────
  {
    slug: "retatrutide",
    name: "Retatrutide",
    altName: "LY3437943",
    category: "metabolic",
    regulatoryStatus: "investigational",
    statusNote: "Phase 3 TRIUMPH program underway; first Phase 3 readout December 2025",
    seoTitle: "Retatrutide: Triple Agonist Research Overview & Clinical Trial Status",
    metaDescription:
      "What is retatrutide? Learn about this investigational triple GIP/GLP-1/glucagon receptor agonist and its Phase 3 TRIUMPH clinical trials.",
    shortSummary:
      "Retatrutide is an investigational triple GLP-1/GIP/glucagon receptor agonist in Phase 3 TRIUMPH trials, demonstrating significant weight reduction in Phase 2 research.",
    goalTags: ["weight-loss"],
    overview: [
      "Retatrutide (LY3437943) is an investigational synthetic peptide developed by Eli Lilly. It is classified as a triple hormone receptor agonist, meaning it activates three receptors simultaneously: the glucose-dependent insulinotropic polypeptide (GIP) receptor, the glucagon-like peptide-1 (GLP-1) receptor, and the glucagon receptor. This triple-agonist mechanism is a first-in-class approach, adding glucagon receptor activation to the dual GIP/GLP-1 mechanism seen in tirzepatide.",
      "Retatrutide is designed to be administered as a once-weekly subcutaneous injection. The addition of the glucagon receptor target is hypothesized to contribute to additional energy expenditure and metabolic effects beyond what dual agonists achieve. As of early 2026, retatrutide remains an investigational compound and has not been approved for any indication by any regulatory authority.",
    ],
    researchContext: [
      "Retatrutide has advanced through Phase 2 trials and is currently in Phase 3 development under the TRIUMPH clinical trial program. The Phase 2 trial, published in the New England Journal of Medicine in 2023, evaluated multiple doses in adults with obesity over 48 weeks and reported substantial dose-dependent reductions in body weight at the highest dose level studied.",
      "The TRIUMPH program consists of four Phase 3 trials enrolling over 5,800 participants, evaluating retatrutide for obesity and overweight, obstructive sleep apnea in people with obesity, knee osteoarthritis in people with obesity, and cardiovascular and renal outcomes. The first Phase 3 readout (TRIUMPH-4) was announced in December 2025, with seven additional readouts expected in 2026. Eli Lilly has also initiated additional studies including head-to-head comparisons and maintenance dosing strategies.",
    ],
    references: [
      {
        number: 1,
        title: 'Jastreboff AM, et al. "Triple–Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial." NEJM (2023)',
        journal: "New England Journal of Medicine",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
      },
      {
        number: 2,
        title: "TRIUMPH-4 Trial",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT05931367",
      },
      {
        number: 3,
        title: 'Giblin K, et al. "Retatrutide for the Treatment of Obesity, OSA and Knee OA: Rationale and Design of the TRIUMPH Trials." Diabetes Obes Metab (2026)',
        journal: "Diabetes, Obesity and Metabolism",
        url: "https://pubmed.ncbi.nlm.nih.gov/41090431/",
      },
      {
        number: 4,
        title: "Eli Lilly TRIUMPH-4 Topline Results Press Release (December 2025)",
        journal: "Eli Lilly",
        url: "https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average",
      },
      {
        number: 5,
        title: "ClinicalTrials.gov Search: Retatrutide",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/search?intr=retatrutide",
      },
    ],
    safetyNotes: [
      "Retatrutide is an investigational drug that has not been approved by the FDA or any other regulatory authority for any indication. It is currently available only through enrollment in clinical trials. The safety profile observed in Phase 2 and early Phase 3 data has been generally consistent with other incretin-class therapies, with gastrointestinal symptoms being the most commonly reported adverse events. However, the full safety profile will not be established until the Phase 3 program is complete.",
      "As an investigational compound, retatrutide is not legally available through pharmacies, compounding services, or research chemical suppliers for human use. Regulations vary by country. Readers should consult a licensed healthcare provider for any decisions about investigational therapies or clinical trial participation.",
    ],
    hubNote:
      "Retatrutide is the leading next-generation investigational peptide tracked on our platform. It appears in our pipeline tracker, is commonly compared with tirzepatide and semaglutide in our research summaries, and is a key molecule in the GLP-1 and metabolic peptide educational sections.",
    seeAlso: [
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Semaglutide", slug: "semaglutide" },
      { label: "Survodutide", slug: "survodutide" },
      { label: "Mazdutide", slug: "mazdutide" },
    ],
  },

  // ── 4. MAZDUTIDE ───────────────────────────────────────────────────────────
  {
    slug: "mazdutide",
    name: "Mazdutide",
    altName: "IBI362",
    category: "metabolic",
    regulatoryStatus: "approved-china",
    statusNote: "Approved in China (2025) for obesity and T2D; Phase 2 ongoing in the US",
    seoTitle: "Mazdutide: Dual GLP-1/Glucagon Agonist Research & Clinical Trials",
    metaDescription:
      "What is mazdutide? Learn about this dual GLP-1/glucagon receptor agonist, its Phase 3 GLORY trials, and its regulatory status in China and the US.",
    shortSummary:
      "Mazdutide is a dual GLP-1/glucagon receptor agonist approved in China for weight management and T2D; currently in Phase 2 US trials. Not FDA-approved.",
    goalTags: ["weight-loss"],
    overview: [
      "Mazdutide (IBI362) is a synthetic peptide developed by Innovent Biologics (under license from Eli Lilly) that acts as a dual agonist at both the glucagon-like peptide-1 (GLP-1) receptor and the glucagon receptor. This dual mechanism is designed to combine the appetite-suppressing and glucose-regulating effects of GLP-1 agonism with the energy expenditure and lipid metabolism effects associated with glucagon receptor activation.",
      "Mazdutide is administered as a once-weekly subcutaneous injection and has been studied primarily in Chinese populations through the GLORY clinical trial program. In June 2025, mazdutide received approval in China (as Xinermei) for chronic weight management in adults with overweight or obesity, followed by approval for type 2 diabetes in September 2025, making it the world's first approved dual GLP-1/glucagon receptor agonist. It is not FDA-approved in the United States.",
    ],
    researchContext: [
      "The GLORY Phase 3 program evaluated mazdutide in Chinese adults with obesity or overweight. Published results in the New England Journal of Medicine reported weight reductions in the range of 10–14% over 48 weeks across dose groups, with a high proportion of participants achieving clinically meaningful weight loss thresholds. Phase 2 and 3 data have also demonstrated improvements in glycemic parameters in adults with type 2 diabetes.",
      "In the United States, mazdutide is currently in Phase 2 clinical trials, with Phase 3 studies and a potential NDA submission anticipated in the 2026–2028 timeframe. The DREAMS program is investigating head-to-head comparisons with semaglutide. Mazdutide's development in Asian populations fills an important evidence gap, as most incretin therapy data have historically been generated in predominantly Western populations.",
    ],
    references: [
      {
        number: 1,
        title: 'Ji L, et al. "Once-Weekly Mazdutide in Chinese Adults with Obesity or Overweight." NEJM (2024)',
        journal: "New England Journal of Medicine",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2411528",
      },
      {
        number: 2,
        title: "Phase 2 Randomized Controlled Trial of Mazdutide in Chinese Adults",
        journal: "Nature Communications (2023)",
        url: "https://www.nature.com/articles/s41467-023-44067-4",
      },
      {
        number: 3,
        title: "ClinicalTrials.gov: Mazdutide Phase 2 in US Populations (NCT06143956)",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT06143956",
      },
      {
        number: 4,
        title: "Innovent Biologics Mazdutide Press Releases",
        journal: "Innovent Biologics",
        url: "https://www.innoventbio.com",
      },
    ],
    safetyNotes: [
      "Mazdutide is approved in China for chronic weight management and type 2 diabetes. It is not FDA-approved in the United States and is currently in Phase 2 clinical development for US populations. The safety profile observed in Chinese clinical trials has been generally consistent with other incretin-class therapies, with gastrointestinal events being the most commonly reported adverse effects.",
      "As an investigational drug in most countries outside China, mazdutide is not available through pharmacies or compounding services. Regulations and approval status vary by country. Readers should consult a licensed healthcare provider for any decisions related to investigational therapies.",
    ],
    hubNote:
      "Mazdutide is featured in our pipeline tracker and next-generation metabolic peptide educational sections. It is commonly compared with survodutide (another dual GLP-1/glucagon agonist) and with tirzepatide and retatrutide in our research summaries.",
    seeAlso: [
      { label: "Survodutide", slug: "survodutide" },
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Retatrutide", slug: "retatrutide" },
      { label: "Semaglutide", slug: "semaglutide" },
    ],
  },

  // ── 5. SURVODUTIDE ─────────────────────────────────────────────────────────
  {
    slug: "survodutide",
    name: "Survodutide",
    altName: "BI 456906",
    category: "metabolic",
    regulatoryStatus: "investigational",
    statusNote: "Phase 3 SYNCHRONIZE program underway; also evaluated for MASH",
    seoTitle: "Survodutide: Dual GLP-1/Glucagon Agonist Research & Trial Status",
    metaDescription:
      "What is survodutide? Learn about this investigational dual GLP-1/glucagon agonist developed by Boehringer Ingelheim and its Phase 3 trials.",
    shortSummary:
      "Survodutide (BI 456906) is an investigational dual GLP-1/glucagon receptor agonist in Phase 3 trials for obesity and MASH; not yet approved by any regulatory authority.",
    goalTags: ["weight-loss"],
    overview: [
      "Survodutide (BI 456906) is an investigational synthetic peptide developed by Boehringer Ingelheim that acts as a dual agonist at the glucagon-like peptide-1 (GLP-1) receptor and the glucagon receptor. Like mazdutide, survodutide is designed to combine incretin-mediated appetite suppression with glucagon-driven increases in energy expenditure and lipid metabolism.",
      "Survodutide is administered as a once-weekly subcutaneous injection. It is currently being evaluated in multiple Phase 3 clinical trial programs and has not been approved by any regulatory authority for any indication as of early 2026.",
    ],
    researchContext: [
      "Phase 2 data, published and presented at major medical conferences, evaluated survodutide at multiple dose levels in adults with overweight or obesity across 12 countries over 46 weeks. Results showed dose-dependent weight reductions, with higher doses demonstrating substantial effects. Survodutide has also been studied in the context of metabolic dysfunction-associated steatohepatitis (MASH, formerly NASH), where Phase 2 data showed improvements in liver histology.",
      "Phase 3 programs include the SYNCHRONIZE series (evaluating survodutide for obesity with or without type 2 diabetes and cardiovascular disease) and the ACHIEVE series (evaluating survodutide for MASH). These trials are enrolling participants across multiple countries and are expected to report results through 2026. The SYNCHRONIZE-2 trial specifically studies survodutide in adults with obesity and type 2 diabetes, with primary endpoints including body weight change and weight loss thresholds.",
    ],
    references: [
      {
        number: 1,
        title: 'Busko M. "Survodutide Impresses in Phase 2 Weight-Loss Trial." Medscape (2023)',
        journal: "Medscape",
        url: "https://www.medscape.com/viewarticle/993928",
      },
      {
        number: 2,
        title: "ClinicalTrials.gov: SYNCHRONIZE-2 (Survodutide Phase 3)",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/search?intr=survodutide",
      },
      {
        number: 3,
        title: 'Wharton S, et al. "Design of SYNCHRONIZE-2." Diabetes Obes Metab (2026)',
        journal: "Diabetes, Obesity and Metabolism",
        url: "https://dom-pubs.onlinelibrary.wiley.com/doi/10.1111/dom.70263",
      },
      {
        number: 4,
        title: "Boehringer Ingelheim Survodutide Pipeline Page",
        journal: "Boehringer Ingelheim",
        url: "https://www.boehringer-ingelheim.com/human-health/metabolic-diseases",
      },
    ],
    safetyNotes: [
      "Survodutide is an investigational drug that has not been approved by the FDA or any other regulatory authority. It is available only through enrollment in clinical trials. The Phase 2 safety profile was generally consistent with other incretin-class therapies, with gastrointestinal side effects being the most common.",
      "As an investigational compound, survodutide is not legally available outside of clinical trials. Regulations vary by country. Readers should consult a licensed healthcare provider for decisions regarding investigational therapies or clinical trial enrollment.",
    ],
    hubNote:
      "Survodutide is tracked in our pipeline and next-generation metabolic peptide sections. It is commonly compared with mazdutide (the other leading dual GLP-1/glucagon agonist) and with retatrutide (the triple agonist) in our educational comparisons.",
    seeAlso: [
      { label: "Mazdutide", slug: "mazdutide" },
      { label: "Retatrutide", slug: "retatrutide" },
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Semaglutide", slug: "semaglutide" },
    ],
  },

  // ── 6. CAGRILINTIDE ────────────────────────────────────────────────────────
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    altName: "CagriSema (combination)",
    category: "metabolic",
    regulatoryStatus: "investigational",
    statusNote: "Phase 3 REDEFINE program evaluating CagriSema (cagrilintide + semaglutide)",
    seoTitle: "Cagrilintide: Amylin Receptor Agonist Research & CagriSema Overview",
    metaDescription:
      "What is cagrilintide? Learn about this long-acting amylin analog, its role in CagriSema with semaglutide, and its Phase 3 REDEFINE trials.",
    shortSummary:
      "Cagrilintide is a long-acting amylin analog studied in combination with semaglutide (CagriSema) in Phase 3 REDEFINE trials. It is not yet approved by any regulatory authority.",
    goalTags: ["weight-loss"],
    overview: [
      "Cagrilintide is a long-acting synthetic analog of amylin, a peptide hormone co-secreted with insulin from pancreatic beta cells. Amylin plays a role in slowing gastric emptying, promoting satiety, and suppressing glucagon secretion after meals. Cagrilintide is structurally modified to enhance its duration of action and is designed for once-weekly subcutaneous administration.",
      "Cagrilintide is developed by Novo Nordisk and is most prominently studied in combination with semaglutide as a fixed-dose combination known as CagriSema. This combination pairs amylin receptor agonism with GLP-1 receptor agonism, targeting two distinct satiety and metabolic pathways. CagriSema is currently in Phase 3 clinical trials and has not been approved by any regulatory authority.",
    ],
    researchContext: [
      "Phase 2 data on cagrilintide as a monotherapy showed dose-dependent weight reduction in adults with overweight or obesity. However, the primary clinical interest has centered on the CagriSema combination. In Phase 2 studies comparing CagriSema with cagrilintide alone and semaglutide alone, the combination demonstrated greater weight reduction than either monotherapy.",
      "The REDEFINE Phase 3 program is evaluating CagriSema across multiple indications, including obesity and overweight, type 2 diabetes, and cardiovascular outcomes. A systematic review of GLP-1 drugs found that CagriSema was associated with the most weight reduction among all evaluated GLP-1-class therapies at the time of publication. Phase 3 results are expected in 2025 and 2026.",
    ],
    references: [
      {
        number: 1,
        title: 'Frias JP, et al. "Efficacy and Safety of Co-administered Once-Weekly Cagrilintide 2.4 mg with Subcutaneous Semaglutide 2.4 mg." Lancet (2023)',
        journal: "The Lancet",
        url: "https://pubmed.ncbi.nlm.nih.gov/37385280/",
      },
      {
        number: 2,
        title: "ClinicalTrials.gov: REDEFINE Program (CagriSema Phase 3)",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/search?intr=cagrilintide",
      },
      {
        number: 3,
        title: "Novo Nordisk CagriSema Pipeline Page",
        journal: "Novo Nordisk",
        url: "https://www.novonordisk.com/science-and-technology/pipeline.html",
      },
      {
        number: 4,
        title: "Approved and Emerging Hormone-Based Anti-Obesity Medications: A Review. PMC (2024)",
        journal: "PMC / NLM",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11642516/",
      },
    ],
    safetyNotes: [
      "Cagrilintide (alone and as CagriSema) is investigational and has not been approved by the FDA or any other regulatory authority. It is currently available only through clinical trial enrollment. The adverse event profile observed in Phase 2 studies has been consistent with other incretin and amylin-class therapies, with gastrointestinal symptoms being the most commonly reported.",
      "Regulations vary by country. Readers should consult a licensed healthcare provider for decisions regarding investigational therapies or clinical trial participation.",
    ],
    hubNote:
      "Cagrilintide is featured in our pipeline tracker, primarily in the context of the CagriSema combination. It represents a novel mechanism (amylin agonism) that is distinct from GLP-1 and GIP pathways. It is commonly discussed in comparisons with tirzepatide and retatrutide on our platform.",
    seeAlso: [
      { label: "Semaglutide", slug: "semaglutide" },
      { label: "Tirzepatide", slug: "tirzepatide" },
      { label: "Retatrutide", slug: "retatrutide" },
    ],
  },

  // ── 7. BPC-157 ─────────────────────────────────────────────────────────────
  {
    slug: "bpc-157",
    name: "BPC-157",
    altName: "Body Protection Compound-157",
    category: "tissue-repair",
    regulatoryStatus: "research-chemical",
    statusNote: "FDA Category 2 bulk drug substance; no human clinical trials completed",
    seoTitle: "BPC-157: Research Summary, Regulatory Status & Safety Information",
    metaDescription:
      "What is BPC-157? Learn about this gastric peptide, its preclinical research in tissue repair, and its current FDA and regulatory classification.",
    shortSummary:
      "BPC-157 is a synthetic gastric peptide extensively studied in animal models for tissue repair and gut healing. It has no completed human trials and is classified as an FDA Category 2 bulk drug substance.",
    goalTags: ["workout-recovery", "chronic-pain"],
    overview: [
      "BPC-157 (Body Protection Compound-157) is a synthetic peptide consisting of 15 amino acids. It is derived from a sequence found in human gastric juice and is classified as a gastric pentadecapeptide. BPC-157 has been the subject of extensive preclinical research — predominantly in animal models — exploring its potential roles in tissue repair, mucosal protection, and various wound-healing processes.",
      "Despite growing interest from athletes, wellness communities, and some clinicians, BPC-157 has not been approved for human use by any regulatory authority. It has no completed randomized controlled trials in humans, and its safety profile in people remains largely unknown. The FDA has classified BPC-157 as a Category 2 bulk drug substance, restricting its use in pharmaceutical compounding.",
    ],
    researchContext: [
      "The majority of BPC-157 research has been conducted in laboratory (in vitro) and animal (in vivo) settings. Preclinical studies have investigated its effects in areas including gastrointestinal mucosal healing and ulcer models, tendon, ligament, muscle, and bone injury models, inflammatory pathways and wound-healing mechanisms, and vascular and neurological injury models.",
      "A 2025 systematic review in orthopedic sports medicine literature synthesized the available preclinical evidence and noted that while animal data show promise for musculoskeletal applications, clinical safety data in humans are extremely limited. Only a small number of pilot-scale human studies have been published, none of which are large-scale randomized controlled trials. No pharmaceutical company has initiated an FDA clinical trial program for BPC-157 as of early 2026, partly because the compound's naturally occurring sequence makes it difficult to patent.",
    ],
    references: [
      {
        number: 1,
        title: 'Sikiric P, et al. "Stable Gastric Pentadecapeptide BPC 157: Novel Therapy in Gastrointestinal Tract." Curr Pharm Des (2018)',
        journal: "Current Pharmaceutical Design",
        url: "https://pubmed.ncbi.nlm.nih.gov/29065827/",
      },
      {
        number: 2,
        title: "Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review (PMC, 2025)",
        journal: "PMC / NLM",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12313605/",
      },
      {
        number: 3,
        title: "FDA Bulk Drug Substances Used in Compounding — Category 2 List",
        journal: "FDA.gov",
        url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act",
      },
      {
        number: 4,
        title: "USADA: BPC-157 — Experimental Peptide Creates Risk for Athletes",
        journal: "USADA",
        url: "https://www.usada.org/spirit-of-sport/bpc-157-peptide-prohibited/",
      },
      {
        number: 5,
        title: "OPSS: BPC-157 Fact Sheet (Department of Defense)",
        journal: "DoD / OPSS",
        url: "https://www.opss.org/article/bpc-157-prohibited-peptide-and-unapproved-drug-found-health-and-wellness-products",
      },
    ],
    safetyNotes: [
      "BPC-157 is not approved by the FDA for any human use. In 2023, the FDA placed BPC-157 on its Category 2 list, which means it cannot be used by compounding pharmacies to create compounded medications. The FDA has cited concerns about immunogenicity, peptide-related impurities, and a lack of adequate human safety data.",
      "BPC-157 is prohibited by the World Anti-Doping Agency (WADA) under its S0 category (non-approved substances) and is listed on the U.S. Department of Defense Prohibited Dietary Supplement Ingredients list. Products sold as 'research chemicals' with BPC-157 are not subject to FDA quality standards. Regulations vary by country. Readers should consult a licensed healthcare provider before considering any unapproved substance.",
    ],
    hubNote:
      "BPC-157 is one of the most frequently searched research peptides on our platform. It appears in our research peptide education section, tissue-repair peptide overviews, and is commonly compared with TB-500 in our educational content.",
    seeAlso: [
      { label: "TB-500", slug: "tb-500" },
      { label: "GHK-Cu", slug: "ghk-cu" },
    ],
  },

  // ── 8. TB-500 ──────────────────────────────────────────────────────────────
  {
    slug: "tb-500",
    name: "TB-500",
    altName: "Thymosin Beta-4 Fragment",
    category: "tissue-repair",
    regulatoryStatus: "research-chemical",
    statusNote: "FDA compounding safety concern; WADA prohibited; no human approval",
    seoTitle: "TB-500 (Thymosin Beta-4 Fragment): Research Overview & Regulatory Status",
    metaDescription:
      "What is TB-500? Learn about this thymosin beta-4 fragment, its preclinical wound-healing research, and its FDA and regulatory classification.",
    shortSummary:
      "TB-500 is a synthetic fragment of thymosin beta-4, studied in preclinical and veterinary settings for tissue repair. It is not FDA-approved for human use and is WADA-prohibited.",
    goalTags: ["workout-recovery", "muscle-growth"],
    overview: [
      "TB-500 is a synthetic peptide fragment derived from thymosin beta-4 (Tβ4), a naturally occurring 43-amino-acid protein found in virtually all human and animal cells. Thymosin beta-4 plays a central role in actin regulation, which is fundamental to cell migration, proliferation, and differentiation — processes critical to wound healing and tissue repair. TB-500 typically refers to a specific active fragment of the thymosin beta-4 sequence.",
      "TB-500 has been studied primarily in preclinical and veterinary settings, with particular interest in wound healing, tissue repair, and reduction of inflammation. It has not been approved by the FDA for any human use and is classified among the peptides with safety concerns for compounding purposes.",
    ],
    researchContext: [
      "The parent molecule, thymosin beta-4, has a more extensive research literature than TB-500 specifically. Preclinical studies of thymosin beta-4 have investigated its effects in wound healing and dermal repair models, cardiac tissue repair following myocardial infarction, corneal wound healing, and inflammation modulation and anti-fibrotic effects.",
      "Thymosin beta-4 has been evaluated in some human clinical settings, particularly in ophthalmology (corneal wound repair) under the investigational drug name RGN-259. However, TB-500 (the fragment) has not undergone the same level of clinical investigation. In veterinary medicine, TB-500 has been used in equine settings for injury recovery, though regulatory bodies in horse racing have restricted its use.",
    ],
    references: [
      {
        number: 1,
        title: 'Goldstein AL, et al. "Thymosin β4: A Multi-Functional Regenerative Peptide." Expert Opin Biol Ther (2012)',
        journal: "Expert Opinion on Biological Therapy",
        url: "https://pubmed.ncbi.nlm.nih.gov/22171665/",
      },
      {
        number: 2,
        title: 'Sosne G, et al. "Thymosin Beta-4 and Corneal Wound Healing." Ann NY Acad Sci (2010)',
        journal: "Annals of the New York Academy of Sciences",
        url: "https://pubmed.ncbi.nlm.nih.gov/20946322/",
      },
      {
        number: 3,
        title: "FDA Bulk Drug Substance Compounding Safety Concerns",
        journal: "FDA.gov",
        url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act",
      },
      {
        number: 4,
        title: "WADA Prohibited List — Peptide Hormones, Growth Factors",
        journal: "WADA",
        url: "https://www.wada-ama.org/en/prohibited-list",
      },
    ],
    safetyNotes: [
      "TB-500 is not FDA-approved for any human use. The FDA has included thymosin beta-4 fragment among substances with safety concerns for compounding, citing issues related to immunogenicity, impurities, and insufficient human safety data. TB-500 is also prohibited by WADA as a peptide hormone and growth factor.",
      "Products sold as 'TB-500' through research chemical suppliers are unregulated, not manufactured to pharmaceutical standards, and explicitly labeled for research use only. Quality, purity, and potency are not guaranteed. Regulations vary by jurisdiction. Readers should consult a licensed healthcare provider before considering any unapproved substance.",
    ],
    hubNote:
      "TB-500 is one of the most searched tissue-repair research peptides on our platform. It is commonly compared with BPC-157 in our educational content and appears in our research peptide tracking and comparison tools.",
    seeAlso: [
      { label: "BPC-157", slug: "bpc-157" },
      { label: "GHK-Cu", slug: "ghk-cu" },
    ],
  },

  // ── 9. GHK-Cu ──────────────────────────────────────────────────────────────
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    altName: "Glycyl-L-Histidyl-L-Lysine Copper",
    category: "tissue-repair",
    regulatoryStatus: "research-chemical",
    statusNote: "FDA compounding concern for injectable forms; topical use widely available as cosmetic ingredient",
    seoTitle: "GHK-Cu: Copper Peptide Research, Skin Science & Regulatory Context",
    metaDescription:
      "What is GHK-Cu? Learn about this naturally occurring copper-binding peptide, its research in skin biology and wound healing, and its regulatory status.",
    shortSummary:
      "GHK-Cu is a naturally occurring copper-binding tripeptide researched for collagen synthesis and wound healing. Topical forms appear in many cosmetic products; injectable use is not FDA-approved.",
    goalTags: ["skin", "workout-recovery", "longevity"],
    overview: [
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper) is a naturally occurring copper-binding tripeptide first identified in human blood plasma. It consists of three amino acids (glycine, histidine, and lysine) complexed with a copper ion. GHK-Cu is present in human plasma, saliva, and urine, with plasma levels declining with age. It was first isolated and characterized in the 1970s by biochemist Loren Pickart.",
      "GHK-Cu has been studied primarily in the context of skin biology, wound healing, and cosmetic science. In preclinical research, it has been shown to participate in a range of biological processes, including stimulation of collagen synthesis, promotion of dermal remodeling and wound closure, antioxidant activity, and gene expression modulation related to tissue repair. GHK-Cu is used as an ingredient in some over-the-counter cosmetic and skincare products. It is not FDA-approved as a drug for any therapeutic indication.",
    ],
    researchContext: [
      "GHK-Cu research spans several decades and encompasses both basic science and applied dermatology. Preclinical and in vitro studies have documented its effects on fibroblast activity, collagen and glycosaminoglycan synthesis, and various wound-healing pathways. Genomic studies have suggested that GHK-Cu may influence the expression of thousands of genes related to tissue repair, inflammation, and antioxidant defense.",
      "In the cosmetic industry, GHK-Cu is incorporated into topical formulations (serums, creams) marketed for anti-aging and skin rejuvenation purposes. Some small clinical studies have evaluated topical GHK-Cu preparations for facial skin improvement. Injectable forms of GHK-Cu have been marketed through peptide research suppliers and some wellness clinics, but the FDA has included injectable GHK-Cu on its list of substances with safety concerns for compounding.",
    ],
    references: [
      {
        number: 1,
        title: 'Pickart L, et al. "The Human Tripeptide GHK-Cu in Remodeling and Tissue Regeneration." J Biomater Sci Polym Ed (2015)',
        journal: "Journal of Biomaterials Science",
        url: "https://pubmed.ncbi.nlm.nih.gov/25679823/",
      },
      {
        number: 2,
        title: 'Pickart L, Margolina A. "Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of New Gene Data." Int J Mol Sci (2018)',
        journal: "International Journal of Molecular Sciences",
        url: "https://pubmed.ncbi.nlm.nih.gov/29882840/",
      },
      {
        number: 3,
        title: 'Leyden JJ, et al. "Facial Skin Improvement with Copper Peptide Cream." Skin Pharmacol Physiol (2003)',
        journal: "Skin Pharmacology and Physiology",
        url: "https://pubmed.ncbi.nlm.nih.gov/12566835/",
      },
      {
        number: 4,
        title: "FDA Bulk Drug Substance Compounding — Safety Concerns",
        journal: "FDA.gov",
        url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act",
      },
    ],
    safetyNotes: [
      "GHK-Cu occupies a split regulatory position. As a cosmetic ingredient in topical formulations, it is commercially available in many countries and is not subject to drug-level regulation. However, the FDA has flagged injectable GHK-Cu as a substance with safety concerns for compounding, placing restrictions on its use by compounding pharmacies.",
      "GHK-Cu is not FDA-approved as a drug for any therapeutic indication. Products labeled as 'research chemicals' for injectable use are not manufactured to pharmaceutical standards. Topical cosmetic products containing GHK-Cu are widely available but are regulated as cosmetics, not drugs, meaning efficacy claims are limited. Regulations vary by country. Readers should consult a licensed healthcare provider regarding any injectable product.",
    ],
    hubNote:
      "GHK-Cu is featured in our cosmetic and skin-health peptide educational sections. It represents a unique category — a naturally occurring peptide with both cosmetic-grade (topical) and research-grade (injectable) availability. It is often discussed alongside BPC-157 and TB-500 in tissue repair overviews.",
    seeAlso: [
      { label: "BPC-157", slug: "bpc-157" },
      { label: "TB-500", slug: "tb-500" },
      { label: "Melanotan II", slug: "melanotan-ii" },
    ],
  },

  // ── 10. CJC-1295 ───────────────────────────────────────────────────────────
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    altName: "GHRH Analog (with DAC)",
    category: "growth-hormone",
    regulatoryStatus: "research-chemical",
    statusNote: "FDA compounding safety concern; WADA prohibited; not approved for human use",
    seoTitle: "CJC-1295: Growth Hormone Releasing Peptide Research & Regulatory Status",
    metaDescription:
      "What is CJC-1295? Learn about this GHRH analog, its clinical pharmacology research, and its current regulatory classification.",
    shortSummary:
      "CJC-1295 is a GHRH analog that stimulates pituitary GH release. Limited human clinical data exists; it is not FDA-approved and is classified as a compounding safety concern.",
    goalTags: ["muscle-growth", "longevity"],
    overview: [
      "CJC-1295 is a synthetic peptide analog of growth hormone-releasing hormone (GHRH). It consists of the first 29 amino acids of GHRH with chemical modifications designed to extend its biological half-life. The most widely discussed form, CJC-1295 with DAC (Drug Affinity Complex), incorporates a maleimido group that enables binding to serum albumin, extending its effective half-life to approximately six to eight days. A shorter-acting variant (sometimes called Mod GRF 1-29 or CJC-1295 without DAC) also exists.",
      "CJC-1295 works by stimulating the pituitary gland to release growth hormone (GH), mimicking the natural signaling pathway used by the body's endogenous GHRH. It is not FDA-approved for any human indication and is classified by the FDA as a substance with safety concerns when used in compounding.",
    ],
    researchContext: [
      "Published clinical data on CJC-1295 are limited but include a notable clinical study in healthy adults. A 2006 study published in the Journal of Clinical Endocrinology & Metabolism demonstrated that subcutaneous CJC-1295 administration produced sustained, dose-dependent increases in GH and insulin-like growth factor I (IGF-1) levels, with IGF-1 remaining elevated for up to 28 days following repeated dosing. Early-phase trials also evaluated CJC-1295 in the context of HIV-associated visceral obesity, though this program did not advance to registration.",
      "CJC-1295 is frequently discussed in combination with ipamorelin (a growth hormone secretagogue), based on the hypothesis that targeting both the GHRH and ghrelin receptor pathways simultaneously could amplify GH release. However, controlled clinical trials evaluating the combination in healthy adults for body composition outcomes are lacking.",
    ],
    references: [
      {
        number: 1,
        title: 'Teichman SL, et al. "Prolonged Stimulation of GH and IGF-I Secretion by CJC-1295 in Healthy Adults." J Clin Endocrinol Metab (2006)',
        journal: "Journal of Clinical Endocrinology & Metabolism",
        url: "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      },
      {
        number: 2,
        title: "ClinicalTrials.gov: CJC-1295 in HIV Patients With Visceral Obesity (NCT00267527)",
        journal: "ClinicalTrials.gov",
        url: "https://clinicaltrials.gov/study/NCT00267527",
      },
      {
        number: 3,
        title: "FDA Bulk Drug Substances — Compounding Safety Concerns",
        journal: "FDA.gov",
        url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act",
      },
      {
        number: 4,
        title: "WADA Prohibited List — Growth Hormone Releasing Factors",
        journal: "WADA",
        url: "https://www.wada-ama.org/en/prohibited-list",
      },
    ],
    safetyNotes: [
      "CJC-1295 is not FDA-approved for any human use. The FDA has flagged it for safety concerns related to compounding, citing reported serious adverse events and concerns about immunogenicity and impurities. It is prohibited by WADA under the category of growth hormone releasing factors.",
      "CJC-1295 is available through some research chemical suppliers, but these products are not manufactured under FDA-regulated conditions and are labeled for research use only. Quality, purity, and potency of such products are not guaranteed. Regulations vary internationally. Readers should consult a licensed healthcare provider before considering any unapproved substance.",
    ],
    hubNote:
      "CJC-1295 is one of the most commonly discussed growth hormone-related peptides on our platform. It appears in our GH peptide comparison tools and educational overviews, and is frequently viewed alongside ipamorelin, sermorelin, and tesamorelin.",
    seeAlso: [
      { label: "Ipamorelin", slug: "ipamorelin" },
      { label: "Sermorelin", slug: "sermorelin" },
      { label: "Tesamorelin", slug: "tesamorelin" },
    ],
  },

  // ── 11. IPAMORELIN ─────────────────────────────────────────────────────────
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    altName: "GHS-R1a Agonist (selective)",
    category: "growth-hormone",
    regulatoryStatus: "research-chemical",
    statusNote: "FDA compounding safety concern; WADA prohibited; not approved for human use",
    seoTitle: "Ipamorelin: Growth Hormone Secretagogue Research & Safety Overview",
    metaDescription:
      "What is ipamorelin? Learn about this selective ghrelin receptor agonist, its pharmacology research, and its current regulatory status.",
    shortSummary:
      "Ipamorelin is a selective growth hormone secretagogue that triggers pulsatile GH release without significant cortisol or prolactin elevation. Not FDA-approved; WADA-prohibited.",
    goalTags: ["muscle-growth", "longevity"],
    overview: [
      "Ipamorelin is a synthetic pentapeptide that acts as a selective growth hormone secretagogue (GHS). It works by binding to the ghrelin receptor (also known as GHS-R1a) on pituitary cells, triggering a short, pulsatile release of growth hormone (GH). Ipamorelin is noted for its selectivity — unlike some other growth hormone releasing peptides, it does not significantly stimulate the release of cortisol, prolactin, or aldosterone, which are considered undesirable side effects in the context of GH modulation.",
      "Ipamorelin has been studied in early-phase clinical research and pharmacokinetic modeling, but it has not advanced through full clinical development and is not FDA-approved for any human use. It remains one of the most discussed research peptides in the growth hormone secretagogue category.",
    ],
    researchContext: [
      "Published clinical pharmacology data on ipamorelin include Phase 1 and pharmacokinetic/pharmacodynamic (PK/PD) studies in healthy adults. A 1999 PK/PD modeling study characterized ipamorelin's GH response as a short, dose-dependent pulse with a terminal half-life of approximately two hours after intravenous administration. Additional research explored its effects on postoperative bowel function, where it showed some promise as a prokinetic agent but did not advance to approval.",
      "Ipamorelin is frequently discussed in combination with CJC-1295, based on the rationale that combining a GHRH analog with a ghrelin receptor agonist could produce complementary effects on GH release. However, well-controlled human trials evaluating this combination for body composition or performance outcomes have not been published.",
    ],
    references: [
      {
        number: 1,
        title: 'Raun K, et al. "Ipamorelin, the First Selective Growth Hormone Secretagogue." Eur J Endocrinol (1998)',
        journal: "European Journal of Endocrinology",
        url: "https://pubmed.ncbi.nlm.nih.gov/9893261/",
      },
      {
        number: 2,
        title: 'Gobburu JVS, et al. "Pharmacokinetic-Pharmacodynamic Modeling of Ipamorelin." J Clin Pharmacol (1999)',
        journal: "Journal of Clinical Pharmacology",
        url: "https://pubmed.ncbi.nlm.nih.gov/10073328/",
      },
      {
        number: 3,
        title: "FDA Bulk Drug Substance Compounding Safety Concerns",
        journal: "FDA.gov",
        url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act",
      },
      {
        number: 4,
        title: "WADA Prohibited List — Growth Hormone Secretagogues",
        journal: "WADA",
        url: "https://www.wada-ama.org/en/prohibited-list",
      },
    ],
    safetyNotes: [
      "Ipamorelin is not FDA-approved for any human use. The FDA has flagged it as a substance with safety concerns in the compounding context, and it is prohibited by WADA as a growth hormone secretagogue. Reported serious adverse events exist in some clinical contexts.",
      "Products available from research chemical suppliers are unregulated and not manufactured to pharmaceutical standards. Readers should consult a licensed healthcare provider before considering any unapproved substance. Regulations vary by jurisdiction.",
    ],
    hubNote:
      "Ipamorelin is one of the most commonly searched growth hormone secretagogues on our platform. It frequently appears alongside CJC-1295 in our GH peptide comparisons and educational content, and is included in our research peptide tracking tools.",
    seeAlso: [
      { label: "CJC-1295", slug: "cjc-1295" },
      { label: "Sermorelin", slug: "sermorelin" },
      { label: "Tesamorelin", slug: "tesamorelin" },
    ],
  },

  // ── 12. SERMORELIN ─────────────────────────────────────────────────────────
  {
    slug: "sermorelin",
    name: "Sermorelin",
    altName: "GRF 1-29 / GHRH 1-29",
    category: "growth-hormone",
    regulatoryStatus: "compounded",
    statusNote: "Formerly FDA-approved (Geref, withdrawn 2008 for business reasons); now available via compounding pharmacies",
    seoTitle: "Sermorelin: GHRH Analog Research, FDA History & Current Status",
    metaDescription:
      "What is sermorelin? Learn about this growth hormone-releasing hormone analog, its FDA history, and its current availability through compounding.",
    shortSummary:
      "Sermorelin (GHRH 1-29) was previously FDA-approved for pediatric GH deficiency and is now available through compounding. It stimulates pituitary GH release and has a longer clinical history than most research peptides.",
    goalTags: ["muscle-growth", "longevity"],
    overview: [
      "Sermorelin (also known as GRF 1-29 or GHRH 1-29) is a synthetic peptide consisting of the first 29 amino acids of human growth hormone-releasing hormone (GHRH). It was one of the first GHRH analogs to be developed and clinically used, representing the shortest fragment of GHRH that retains full biological activity at the GHRH receptor.",
      "Sermorelin works by stimulating the pituitary gland to produce and release endogenous growth hormone (GH), rather than replacing GH directly. This mechanism preserves the body's natural pulsatile GH secretion pattern and feedback regulation. Sermorelin was previously FDA-approved (under the brand name Geref) for diagnosing and treating growth hormone deficiency in children but was discontinued from the commercial market in 2008 for business reasons, not safety concerns.",
    ],
    researchContext: [
      "Sermorelin's clinical history spans several decades. It received FDA orphan drug designation in 1988 and subsequent FDA approvals in 1990 (as a diagnostic agent for pituitary function) and 1997 (for treating pediatric growth hormone deficiency under the brand Geref). Clinical studies in children demonstrated that sermorelin effectively stimulated GH secretion and promoted growth.",
      "Since the manufacturer's voluntary withdrawal from the market, sermorelin has continued to be used in off-label adult contexts through compounding pharmacies, primarily in hormone optimization and anti-aging medicine. However, most published clinical data come from pediatric growth hormone deficiency populations, and well-controlled adult studies are limited. Sermorelin is shorter-acting than some newer GHRH analogs like tesamorelin and CJC-1295.",
    ],
    references: [
      {
        number: 1,
        title: "Sermorelin — Wikipedia (Summary of FDA Approval History)",
        journal: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Sermorelin",
      },
      {
        number: 2,
        title: 'Thorner MO, et al. "Once Daily Subcutaneous GHRH-(1-29) NH2 Accelerates Growth in Growth Hormone-Deficient Children." J Clin Endocrinol Metab (1996)',
        journal: "Journal of Clinical Endocrinology & Metabolism",
        url: "https://pubmed.ncbi.nlm.nih.gov/8636311/",
      },
      {
        number: 3,
        title: "FDA Drug Approval Database: Sermorelin",
        journal: "FDA.gov",
        url: "https://www.accessdata.fda.gov/scripts/cder/daf/",
      },
      {
        number: 4,
        title: "Exploring FDA-Approved Frontiers: Insights into GHRH Analogs. PMC (2024)",
        journal: "PMC / NLM",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10968328/",
      },
    ],
    safetyNotes: [
      "Sermorelin was formerly FDA-approved but the commercially manufactured version (Geref) was voluntarily discontinued in 2008. The discontinuation was a business decision by the manufacturer, not a safety action by the FDA. Sermorelin is not a controlled substance.",
      "Currently, sermorelin is available in the United States through licensed compounding pharmacies by prescription. Compounded products are not FDA-approved and do not undergo the same regulatory review as commercially manufactured medications. Quality and purity can vary between compounding sources. Readers should consult a licensed healthcare provider for any decisions related to hormone therapy.",
    ],
    hubNote:
      "Sermorelin is one of the foundational GHRH peptides on our platform. It is frequently compared with tesamorelin, CJC-1295, and ipamorelin in our GH peptide educational sections, and its unique regulatory history (formerly FDA-approved, now compounded) makes it an instructive case study.",
    seeAlso: [
      { label: "Tesamorelin", slug: "tesamorelin" },
      { label: "CJC-1295", slug: "cjc-1295" },
      { label: "Ipamorelin", slug: "ipamorelin" },
    ],
  },

  // ── 13. TESAMORELIN ────────────────────────────────────────────────────────
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    altName: "Egrifta / Egrifta WR",
    category: "growth-hormone",
    regulatoryStatus: "fda-approved",
    statusNote: "FDA-approved (Egrifta / Egrifta WR) for HIV-associated lipodystrophy",
    seoTitle: "Tesamorelin: FDA-Approved GHRH Analog for HIV Lipodystrophy",
    metaDescription:
      "What is tesamorelin? Learn about this FDA-approved GHRH analog, its clinical use in HIV-associated lipodystrophy, and its off-label research.",
    shortSummary:
      "Tesamorelin (Egrifta) is an FDA-approved GHRH analog indicated for HIV-associated lipodystrophy. It stimulates endogenous GH release and has Phase 3 trial data supporting its approved use.",
    goalTags: ["weight-loss", "longevity"],
    overview: [
      "Tesamorelin is a synthetic 44-amino acid peptide analog of human growth hormone-releasing hormone (GHRH), developed by Theratechnologies. It preserves the full native GHRH sequence with an added N-terminal trans-3-hexenoic acid modification that improves stability against enzymatic degradation, extending its functional half-life compared to shorter analogs like sermorelin.",
      "Tesamorelin is the only GHRH analog currently carrying active FDA approval in the United States. It is approved under the brand name Egrifta (and the newer Egrifta WR formulation) for the reduction of excess abdominal fat in adults with HIV who have lipodystrophy — a condition characterized by abnormal fat distribution associated with antiretroviral therapy. An updated F8 formulation received FDA approval in early 2025, simplifying the dosing regimen.",
    ],
    researchContext: [
      "Tesamorelin's FDA approval is supported by robust Phase 3 clinical trial data. Pivotal trials enrolled over 800 HIV-infected patients with lipodystrophy and demonstrated significant reductions in visceral adipose tissue after 26 weeks of daily subcutaneous administration, with extension studies showing sustained effects at 52 weeks. Additional research has shown associated improvements in lipid profiles, including triglyceride and cholesterol ratios.",
      "Off-label interest in tesamorelin has grown in areas including body composition in non-HIV populations, non-alcoholic fatty liver disease (NAFLD/MASH), and age-related growth hormone decline. However, controlled clinical trial evidence for these off-label uses is limited compared to the HIV-lipodystrophy data. Tesamorelin stimulates endogenous GH release through the pituitary, meaning it preserves the body's natural feedback mechanisms rather than supplying exogenous GH directly.",
    ],
    references: [
      {
        number: 1,
        title: 'Falutz J, et al. "Reduction of Trunk Fat with Tesamorelin in HIV." NEJM (2010)',
        journal: "New England Journal of Medicine",
        url: "https://pubmed.ncbi.nlm.nih.gov/17148572/",
      },
      {
        number: 2,
        title: "Egrifta (Tesamorelin) Prescribing Information — FDA Label",
        journal: "FDA.gov",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/022505s014lbl.pdf",
      },
      {
        number: 3,
        title: 'Stanley TL, et al. "Effects of Tesamorelin on Nonalcoholic Fatty Liver Disease." JAMA (2014)',
        journal: "JAMA",
        url: "https://pubmed.ncbi.nlm.nih.gov/25117610/",
      },
      {
        number: 4,
        title: "FDA Approves F8 Formulation of Tesamorelin (2025)",
        journal: "Contagion Live",
        url: "https://www.contagionlive.com/view/fda-approves-f8-formulation-of-theratechnologies-tesamorelin-for-hiv-associated-lipodystrophy",
      },
    ],
    safetyNotes: [
      "Tesamorelin (Egrifta/Egrifta WR) is FDA-approved for a specific indication: reduction of excess abdominal fat in adults with HIV and lipodystrophy. It is a prescription medication administered daily by subcutaneous injection. Common adverse reactions include joint pain, injection site reactions, pain in extremities, peripheral edema, and muscle pain.",
      "Off-label use of tesamorelin in non-HIV populations has not been evaluated in Phase 3 trials and lacks the same level of regulatory-grade evidence. Tesamorelin is not indicated for general weight loss or anti-aging purposes. Regulations vary by country. Readers should consult a licensed healthcare provider for decisions about any medication.",
    ],
    hubNote:
      "Tesamorelin occupies a unique position as the only currently FDA-approved GHRH analog. It is featured in our GH peptide comparisons alongside sermorelin and CJC-1295, and serves as an important reference point in discussions about the distinction between approved and unapproved peptides.",
    seeAlso: [
      { label: "Sermorelin", slug: "sermorelin" },
      { label: "CJC-1295", slug: "cjc-1295" },
      { label: "Ipamorelin", slug: "ipamorelin" },
    ],
  },

  // ── 14. MELANOTAN II ───────────────────────────────────────────────────────
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    altName: "MT-II",
    category: "melanocortin",
    regulatoryStatus: "research-chemical",
    statusNote: "Not approved by FDA or any major authority; FDA Category 2 compounding restriction; multiple regulatory warnings issued",
    seoTitle: "Melanotan II: Melanocortin Peptide Research & Safety Information",
    metaDescription:
      "What is Melanotan II? Learn about this synthetic melanocortin peptide, its research history, and its regulatory and safety status.",
    shortSummary:
      "Melanotan II is a non-selective melanocortin receptor agonist studied for skin tanning and sexual function. It has never been approved by the FDA; multiple regulatory agencies have issued safety warnings.",
    goalTags: ["skin"],
    overview: [
      "Melanotan II is a synthetic cyclic peptide analog of alpha-melanocyte-stimulating hormone (α-MSH), originally developed at the University of Arizona in the 1980s as a potential sunless tanning agent. It acts on melanocortin receptors (MC1R through MC5R) with relatively non-selective activity, meaning it triggers multiple physiological pathways beyond pigmentation — including appetite suppression and sexual arousal, the latter of which led to the development of the related compound bremelanotide (PT-141).",
      "Melanotan II has never been approved by the FDA or any other major regulatory authority for human use. Despite this, it has gained widespread use in unregulated markets, particularly in the tanning and bodybuilding communities. Multiple regulatory agencies globally have issued warnings about its use.",
    ],
    researchContext: [
      "Early research on Melanotan II focused on its ability to stimulate melanogenesis (the production of melanin pigment in the skin) without UV exposure. Clinical studies conducted at the University of Arizona in the 1990s confirmed that subcutaneous Melanotan II administration could induce skin darkening in human subjects. Unexpected sexual side effects observed during these trials led to the development of bremelanotide, a refined derivative with more selective activity at MC3R and MC4R.",
      "Research areas that have been explored in academic and preclinical settings include melanogenesis and skin pigmentation, sexual function and arousal pathways, appetite regulation and energy homeostasis, and lipid metabolism. However, the broad receptor activity of Melanotan II means that its effects are diffuse and difficult to control, which is one reason it was not advanced through regulatory approval pathways. No large-scale, well-controlled clinical trials exist for Melanotan II in any therapeutic indication.",
    ],
    references: [
      {
        number: 1,
        title: 'Dorr RT, et al. "Effects of Superpotent Melanotropic Peptides in a Pilot Phase I Clinical Study." Life Sciences (1996)',
        journal: "Life Sciences",
        url: "https://pubmed.ncbi.nlm.nih.gov/8558069/",
      },
      {
        number: 2,
        title: 'Hadley ME. "Discovery That a Melanocortin Regulates Sexual Functions in Male and Female Humans." Peptides (2005)',
        journal: "Peptides",
        url: "https://pubmed.ncbi.nlm.nih.gov/15911072/",
      },
      {
        number: 3,
        title: "TGA (Australia): Melanotan-I and Melanotan-II Safety Advisory",
        journal: "Therapeutic Goods Administration",
        url: "https://www.tga.gov.au/news/safety-updates/melanotan-i-and-melanotan-ii",
      },
      {
        number: 4,
        title: "FDA Warning: Unapproved Tanning Products",
        journal: "FDA.gov",
        url: "https://www.fda.gov/consumers/consumer-updates/how-protect-your-skin-sun",
      },
    ],
    safetyNotes: [
      "Melanotan II is not approved by the FDA or any other major regulatory authority for any human use. Multiple agencies — including the FDA, the Australian Therapeutic Goods Administration (TGA), and European regulatory bodies — have issued warnings about unapproved Melanotan products, citing risks including uncontrolled changes in moles and skin pigmentation, nausea, facial flushing, and cardiovascular effects, as well as unknown long-term safety implications for melanocyte-active compounds.",
      "Melanotan II is listed on the FDA's Category 2 bulk drug substances list, restricting its use in compounding. Products available from online sources are unregulated and not subject to quality or purity standards. Readers should consult a licensed healthcare provider and be aware that using unapproved substances carries inherent risk.",
    ],
    hubNote:
      "Melanotan II is tracked in our cosmetic and melanocortin peptide educational sections. It is commonly compared with PT-141 (bremelanotide), its derivative, and appears in our educational overviews explaining the difference between research chemicals and approved medications.",
    seeAlso: [
      { label: "PT-141 (Bremelanotide)", slug: "pt-141" },
      { label: "GHK-Cu", slug: "ghk-cu" },
    ],
  },

  // ── 15. PT-141 (BREMELANOTIDE) ─────────────────────────────────────────────
  {
    slug: "pt-141",
    name: "PT-141",
    altName: "Bremelanotide / Vyleesi",
    category: "melanocortin",
    regulatoryStatus: "fda-approved",
    statusNote: "FDA-approved (Vyleesi) for acquired, generalized HSDD in premenopausal women",
    seoTitle: "PT-141 (Bremelanotide): FDA-Approved Melanocortin Agonist Overview",
    metaDescription:
      "What is PT-141? Learn about bremelanotide, its mechanism of action, FDA approval for HSDD, and its relationship to Melanotan II.",
    shortSummary:
      "PT-141 (bremelanotide / Vyleesi) is an FDA-approved melanocortin agonist for HSDD in premenopausal women. It targets CNS receptors influencing sexual desire rather than vascular pathways.",
    goalTags: ["skin"],
    overview: [
      "PT-141, known by its generic name bremelanotide, is a synthetic cyclic heptapeptide derived from Melanotan II. It acts as an agonist at melanocortin receptors MC3R and MC4R in the central nervous system, distinguishing it from vascular-acting medications. Bremelanotide was developed by Palatin Technologies and refined from Melanotan II specifically to target sexual arousal pathways while minimizing broader melanocortin effects like skin pigmentation.",
      "In 2019, the FDA approved bremelanotide under the brand name Vyleesi for the treatment of acquired, generalized hypoactive sexual desire disorder (HSDD) in premenopausal women. This made it the first melanocortin receptor agonist approved for a sexual health indication and the first FDA-approved on-demand treatment specifically targeting sexual desire rather than vascular function.",
    ],
    researchContext: [
      "Bremelanotide's development spanned more than two decades. Early research examined intranasal formulations in both male erectile dysfunction and female sexual dysfunction, but the intranasal route was halted by the FDA in 2007 due to observed increases in blood pressure. Development subsequently shifted to subcutaneous injection, which demonstrated a more favorable cardiovascular profile.",
      "Phase 3 clinical trials evaluated bremelanotide in premenopausal women with acquired, generalized HSDD and demonstrated improvements in sexual desire and reductions in associated distress compared to placebo. The medication is administered via subcutaneous autoinjector approximately 45 minutes before anticipated sexual activity. Research has also explored its potential in male sexual dysfunction, though it is not currently FDA-approved for men. Off-label use in men has been reported in clinical practice.",
    ],
    references: [
      {
        number: 1,
        title: 'Kingsberg SA, et al. "Bremelanotide for the Treatment of Hypoactive Sexual Desire Disorder." Obstetrics & Gynecology (2019)',
        journal: "Obstetrics & Gynecology",
        url: "https://pubmed.ncbi.nlm.nih.gov/31599840/",
      },
      {
        number: 2,
        title: "FDA Press Release: Approval of Vyleesi (Bremelanotide) for HSDD (2019)",
        journal: "FDA.gov",
        url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-treatment-hypoactive-sexual-desire-disorder-premenopausal-women",
      },
      {
        number: 3,
        title: "Bremelanotide — DrugBank Entry",
        journal: "DrugBank",
        url: "https://go.drugbank.com/drugs/DB11653",
      },
      {
        number: 4,
        title: 'Clayton AH, et al. "Bremelanotide for Female Sexual Dysfunctions in Premenopausal Women: A Randomized, Placebo-Controlled Dose-Finding Trial." Women\'s Health (2016)',
        journal: "Women's Health",
        url: "https://pubmed.ncbi.nlm.nih.gov/27401484/",
      },
    ],
    safetyNotes: [
      "Bremelanotide (Vyleesi) is FDA-approved exclusively for the treatment of acquired, generalized HSDD in premenopausal women. It is a prescription medication that must be obtained through a licensed healthcare provider. The FDA considers it a first-in-class medication.",
      "Use in men for erectile dysfunction or other sexual health indications is off-label and not FDA-approved. Labeled side effects include nausea, flushing, headache, and transient increases in blood pressure. The prescribing information recommends no more than one dose per 24 hours and no more than eight doses per month. Regulatory status varies internationally. Readers should consult a licensed healthcare provider for any treatment decisions.",
    ],
    hubNote:
      "PT-141 (bremelanotide) is featured in our melanocortin peptide educational section and represents an important case study in how research peptides can progress through clinical development to FDA approval. It is commonly compared with Melanotan II on our site.",
    seeAlso: [
      { label: "Melanotan II", slug: "melanotan-ii" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getPeptideBySlug(slug: string): PeptideContent | undefined {
  return PEPTIDES.find((p) => p.slug === slug);
}

export function getPeptidesByCategory(
  category: PeptideContent["category"],
): PeptideContent[] {
  return PEPTIDES.filter((p) => p.category === category);
}

export function getPeptidesByGoal(goal: GoalTag): PeptideContent[] {
  return PEPTIDES.filter((p) => p.goalTags.includes(goal));
}

export const CATEGORY_ORDER: PeptideContent["category"][] = [
  "metabolic",
  "growth-hormone",
  "tissue-repair",
  "melanocortin",
];
