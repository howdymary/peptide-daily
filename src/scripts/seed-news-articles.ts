#!/usr/bin/env npx tsx
/**
 * Seeds realistic sample news articles for development / offline environments.
 * In production these would come from the live RSS ingestion pipeline.
 *
 * Run: npx tsx src/scripts/seed-news-articles.ts
 */

import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function slug(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 6);
  return `${base}-${hash}`;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

const ARTICLES = [
  // PubMed / research
  {
    source: "pubmed-peptides",
    title: "BPC-157 Accelerates Tendon Healing in a Rat Achilles Injury Model",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/articles/bpc157-tendon-2024",
    excerpt:
      "A controlled preclinical study found that systemic BPC-157 administration significantly improved biomechanical properties of healing Achilles tendons at 14 and 28 days post-injury. The peptide group showed 37% greater maximum load-to-failure compared to controls.",
    author: "Seiwerth S, Sikiric P",
    publishedAt: daysAgo(1),
    tags: ["BPC-157", "peptides", "recovery"],
    isEditorsPick: true,
  },
  {
    source: "pubmed-glp1",
    title: "Semaglutide 2.4 mg Reduces Cardiovascular Events in FLOW Trial",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/articles/semaglutide-flow-2024",
    excerpt:
      "The FLOW trial demonstrated a 20% relative risk reduction in major adverse cardiovascular events among participants with type 2 diabetes and chronic kidney disease receiving weekly semaglutide 2.4 mg subcutaneous injections over a median follow-up of 3.4 years.",
    author: "Perkovic V et al.",
    publishedAt: daysAgo(2),
    tags: ["semaglutide", "GLP-1", "weight-management", "metabolic", "research"],
    isEditorsPick: true,
  },
  {
    source: "pubmed-peptides",
    title: "TB-500 Promotes Cardiac Repair Through Actin Sequestration Mechanism",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/articles/tb500-cardiac-2024",
    excerpt:
      "Thymosin Beta-4 fragment (TB-500) was shown to reduce infarct size by approximately 26% in a murine myocardial infarction model, with histological evidence of improved neovascularisation and reduced fibrosis at 6 weeks.",
    author: "Goldstein AL, Kleinman HK",
    publishedAt: daysAgo(3),
    tags: ["TB-500", "peptides", "recovery", "research"],
    isEditorsPick: false,
  },
  {
    source: "pubmed-peptides",
    title: "GHK-Cu Peptide Modulates Over 4,000 Human Genes Linked to Tissue Repair",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/articles/ghk-cu-genes-2023",
    excerpt:
      "Comprehensive gene expression analysis revealed that GHK-Cu upregulates pathways involved in collagen synthesis, anti-inflammatory signalling, and stem cell homing. The copper peptide complex was shown to activate 58 anti-cancer and tissue-repair genes.",
    author: "Pickart L, Margolina A",
    publishedAt: daysAgo(5),
    tags: ["GHK-Cu", "peptides", "cosmetic", "research"],
    isEditorsPick: false,
  },
  {
    source: "pubmed-glp1",
    title: "Once-Weekly Tirzepatide vs Semaglutide for Weight Management: Head-to-Head Meta-Analysis",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/articles/tirzepatide-vs-sema-meta-2024",
    excerpt:
      "A network meta-analysis of 18 randomised controlled trials found tirzepatide 15 mg to produce greater mean weight loss (–21.4 kg) versus semaglutide 2.4 mg (–15.9 kg) at 68 weeks, with comparable safety profiles across both dual and single GLP-1 receptor agonists.",
    author: "Lingvay I et al.",
    publishedAt: daysAgo(4),
    tags: ["tirzepatide", "semaglutide", "GLP-1", "weight-management", "metabolic", "research"],
    isEditorsPick: true,
  },
  // FDA
  {
    source: "fda-press-releases",
    title: "FDA Warns Consumers About Unapproved Compounded GLP-1 Drug Products",
    sourceUrl: "https://www.fda.gov/news-events/press-announcements/fda-warns-glp1-compounded-2024",
    excerpt:
      "The FDA issued a safety communication urging consumers not to use compounded semaglutide or tirzepatide products that have not been approved or authorised by the agency. The announcement follows reports of adverse events including nausea, hypoglycaemia, and hospitalisation.",
    author: "FDA Office of Media Affairs",
    publishedAt: daysAgo(6),
    tags: ["semaglutide", "tirzepatide", "GLP-1", "regulatory", "safety"],
    isEditorsPick: false,
  },
  {
    source: "fda-press-releases",
    title: "FDA Approves First Oral GLP-1 Receptor Agonist for Type 2 Diabetes",
    sourceUrl: "https://www.fda.gov/news-events/press-announcements/fda-approves-oral-glp1-2024",
    excerpt:
      "The US Food and Drug Administration approved the first oral once-daily GLP-1 receptor agonist for glycaemic control in adults with type 2 diabetes, representing a significant shift in the delivery method for this class of metabolic peptide therapeutics.",
    author: "FDA News Release",
    publishedAt: daysAgo(8),
    tags: ["GLP-1", "metabolic", "regulatory"],
    isEditorsPick: false,
  },
  {
    source: "fda-press-releases",
    title: "FDA Issues Guidance on Peptide Drug Substance Nomenclature for INDs",
    sourceUrl: "https://www.fda.gov/news-events/press-announcements/peptide-nomenclature-guidance-2024",
    excerpt:
      "New FDA guidance clarifies naming conventions and characterisation requirements for peptide drug substances in Investigational New Drug applications, aiming to reduce application deficiencies and streamline the review process for peptide-based therapeutics.",
    author: "FDA Center for Drug Evaluation and Research",
    publishedAt: daysAgo(10),
    tags: ["regulatory", "research"],
    isEditorsPick: false,
  },
  // NIH
  {
    source: "nih-news",
    title: "NIH Research Highlights: Ipamorelin Shows Promise for Age-Related GH Decline",
    sourceUrl: "https://newsinhealth.nih.gov/articles/ipamorelin-aging-2024",
    excerpt:
      "NIA-funded researchers report that selective GH secretagogue ipamorelin restores pulsatile growth hormone secretion in older adults with somatopause without significantly elevating IGF-1 or cortisol, suggesting a potentially favourable safety window compared to non-selective peptides.",
    author: "National Institute on Aging",
    publishedAt: daysAgo(7),
    tags: ["ipamorelin", "growth-hormone", "peptides", "research"],
    isEditorsPick: false,
  },
  {
    source: "nih-news",
    title: "Longevity Peptides: NIH Workshop Summary on Therapeutic Potential",
    sourceUrl: "https://newsinhealth.nih.gov/articles/longevity-peptide-workshop-2024",
    excerpt:
      "A multi-disciplinary NIH workshop brought together researchers exploring short peptides as longevity therapeutics. Key findings included mechanistic insights into caloric restriction mimetics, rapamycin-independent mTOR modulation, and the role of mitochondrial peptides in ageing.",
    author: "NIH National Institute on Aging",
    publishedAt: daysAgo(12),
    tags: ["peptides", "research", "safety"],
    isEditorsPick: false,
  },
  // Science Daily
  {
    source: "science-daily-health",
    title: "Researchers Develop Novel Delivery System for Hydrophilic Peptides",
    sourceUrl: "https://www.sciencedaily.com/articles/peptide-delivery-2024",
    excerpt:
      "A team at MIT has developed a lipid nanoparticle formulation capable of delivering hydrophilic peptides orally with bioavailability exceeding 30%, compared to typical subcutaneous injection efficiency. The platform was demonstrated with BPC-157 analogs in a rodent pharmacokinetic study.",
    author: "MIT Koch Institute",
    publishedAt: daysAgo(2),
    tags: ["BPC-157", "peptides", "research"],
    isEditorsPick: false,
  },
  {
    source: "science-daily-health",
    title: "Copper Peptide Concentration Found Critical for Collagen Synthesis Outcomes",
    sourceUrl: "https://www.sciencedaily.com/articles/copper-peptide-dosing-2024",
    excerpt:
      "New in-vitro research suggests that the concentration window for optimal GHK-Cu activity is narrower than previously thought, with both sub- and supra-therapeutic concentrations producing suboptimal collagen mRNA expression in dermal fibroblast cultures.",
    author: "University of Edinburgh",
    publishedAt: daysAgo(9),
    tags: ["GHK-Cu", "cosmetic", "peptides", "research"],
    isEditorsPick: false,
  },
  {
    source: "science-daily-health",
    title: "Melanocortin System Peptides Show Dual Role in Appetite and Inflammation",
    sourceUrl: "https://www.sciencedaily.com/articles/melanocortin-dual-2024",
    excerpt:
      "Studies using PT-141 analogs have revealed an unexpected anti-inflammatory mechanism mediated through MC4R activation in macrophages, separate from the known central nervous system appetite-suppression pathway, opening new avenues in metabolic and inflammatory disease research.",
    author: "Scripps Research Institute",
    publishedAt: daysAgo(11),
    tags: ["PT-141", "peptides", "research"],
    isEditorsPick: false,
  },
];

async function main() {
  console.log("Seeding sample news articles...");

  // Fetch source IDs
  const sources = await prisma.newsSource.findMany({
    select: { id: true, slug: true },
  });
  const sourceMap = Object.fromEntries(sources.map((s) => [s.slug, s.id]));

  let inserted = 0;
  let skipped = 0;

  for (const article of ARTICLES) {
    const sourceId = sourceMap[article.source];
    if (!sourceId) {
      console.warn(`  Source not found: ${article.source} — run seed.ts first`);
      continue;
    }

    const articleSlug = slug(article.title);

    try {
      await prisma.newsArticle.upsert({
        where: { sourceUrl: article.sourceUrl },
        update: { isEditorsPick: article.isEditorsPick },
        create: {
          sourceId,
          title: article.title,
          slug: articleSlug,
          sourceUrl: article.sourceUrl,
          excerpt: article.excerpt,
          author: article.author ?? null,
          publishedAt: article.publishedAt,
          tags: article.tags,
          isEditorsPick: article.isEditorsPick ?? false,
        },
      });
      inserted++;
    } catch (e) {
      // slug collision — try with a different suffix
      try {
        const altSlug = `${articleSlug}-alt`;
        await prisma.newsArticle.upsert({
          where: { sourceUrl: article.sourceUrl },
          update: {},
          create: {
            sourceId,
            title: article.title,
            slug: altSlug,
            sourceUrl: article.sourceUrl,
            excerpt: article.excerpt,
            author: article.author ?? null,
            publishedAt: article.publishedAt,
            tags: article.tags,
            isEditorsPick: article.isEditorsPick ?? false,
          },
        });
        inserted++;
      } catch {
        skipped++;
        console.warn(`  Skipped (already exists): ${article.title}`);
      }
    }
  }

  console.log(`Seeded ${inserted} articles (${skipped} skipped).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
