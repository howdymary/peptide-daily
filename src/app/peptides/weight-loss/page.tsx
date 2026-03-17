import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/config/seo";

export const metadata = buildMetadata("/peptides/weight-loss");

export default function WeightLossPage() {
    return (
          <div>
                <JsonLd path="/peptides/weight-loss" />
          
            {/* Hero */}
                <section
                          className="py-16 sm:py-20"
                          style={{ background: "var(--brand-navy)" }}
                        >
                        <div className="container-page">
                                  <div className="max-w-2xl">
                                              <div className="section-label-light mb-5">Topic Guide</div>div>
                                              <h1
                                                              className="display-heading text-3xl sm:text-4xl lg:text-5xl"
                                                              style={{ color: "#ffffff" }}
                                                            >
                                                            Peptides for Weight Loss and
                                                            <br />
                                                            <em
                                                                              className="not-italic"
                                                                              style={{ color: "var(--brand-accent)" }}
                                                                            >
                                                                            Body Recomposition
                                                            </em>em>
                                              </h1>h1>
                                              <p
                                                              className="mt-5 text-base leading-relaxed sm:text-lg"
                                                              style={{ color: "rgb(255 255 255 / 0.65)" }}
                                                            >
                                                            An evidence-based overview of peptides currently studied
                                                            for weight management — including FDA-approved GLP-1
                                                            agonists and investigational compounds. Vendor pricing,
                                                            lab data, and what the clinical research actually shows.
                                              </p>p>
                                  </div>div>
                        </div>div>
                </section>section>
          
            {/* Disclaimer */}
                <div
                          className="border-b py-4"
                          style={{
                                      background: "var(--info-bg)",
                                      borderColor: "var(--info-border)",
                          }}
                        >
                        <div className="container-page">
                                  <p
                                                className="text-xs leading-relaxed"
                                                style={{ color: "var(--info-text)" }}
                                              >
                                              <strong>Not medical advice.</strong>strong> This page is for
                                              informational and research purposes only. Consult a
                                              qualified healthcare provider before using any peptide.
                                  </p>p>
                        </div>div>
                </div>div>
          
            {/* Content sections */}
                <div className="container-page py-12">
                        <div className="mx-auto max-w-3xl space-y-12">
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            What are GLP-1 receptor agonist peptides?
                                              </h2>h2>
                                              <p
                                                              className="text-sm leading-relaxed"
                                                              style={{ color: "var(--foreground-secondary)" }}
                                                            >
                                                            GLP-1 (glucagon-like peptide-1) receptor agonists are a class of peptides that mimic the incretin hormone GLP-1, which plays a central role in glucose metabolism and appetite regulation. When these peptides bind to GLP-1 receptors, they slow gastric emptying, enhance insulin secretion, and reduce appetite through central nervous system signaling. Semaglutide and tirzepatide are the most widely studied compounds in this class, with robust Phase 3 clinical trial data supporting their use in weight management.
                                              </p>p>
                                              <div className="mt-4 flex flex-wrap gap-2">
                                                            <Link
                                                                              href="/learn/semaglutide"
                                                                              className="see-also-link rounded-lg border px-4 py-2 text-sm font-medium"
                                                                              style={{
                                                                                                  borderColor: "var(--border)",
                                                                                                  background: "var(--surface)",
                                                                                                  color: "var(--foreground-secondary)",
                                                                              }}
                                                                            >
                                                                            Semaglutide overview →
                                                            </Link>Link>
                                                            <Link
                                                                              href="/learn/tirzepatide"
                                                                              className="see-also-link rounded-lg border px-4 py-2 text-sm font-medium"
                                                                              style={{
                                                                                                  borderColor: "var(--border)",
                                                                                                  background: "var(--surface)",
                                                                                                  color: "var(--foreground-secondary)",
                                                                              }}
                                                                            >
                                                                            Tirzepatide overview →
                                                            </Link>Link>
                                              </div>div>
                                  </section>section>
                        
                                  <hr style={{ borderColor: "var(--border)" }} />
                        
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            Semaglutide, tirzepatide, and other compounds compared
                                              </h2>h2>
                                              <p
                                                              className="text-sm leading-relaxed"
                                                              style={{ color: "var(--foreground-secondary)" }}
                                                            >
                                                            The weight-management peptide landscape ranges from FDA-approved prescription medications to investigational and research-only compounds. Semaglutide (marketed as Wegovy and Ozempic) and tirzepatide (Mounjaro and Zepbound) have the strongest clinical evidence, with trials showing 15–22% mean body weight reduction over 68–72 weeks. Tesamorelin, a GHRH analog, is FDA-approved for HIV-associated lipodystrophy but is sometimes studied for broader metabolic applications. Other compounds like AOD-9604 and MOTS-c remain investigational with limited human data.
                                              </p>p>
                                  </section>section>
                        
                                  <hr style={{ borderColor: "var(--border)" }} />
                        
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            How we compare prices across vendors
                                              </h2>h2>
                                              <p
                                                              className="text-sm leading-relaxed"
                                                              style={{ color: "var(--foreground-secondary)" }}
                                                            >
                                                            Peptide Daily automatically scrapes vendor websites every 15 minutes to capture live pricing for research-grade peptides. Prices are displayed per package alongside concentration and quantity details so you can compare equivalent products across different suppliers. For weight-management peptides specifically, pricing can vary significantly — sometimes by 40–60% for the same compound and quantity — making vendor comparison especially valuable in this category.
                                              </p>p>
                                              <Link
                                                              href="/peptides?search=semaglutide"
                                                              className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
                                                              style={{ color: "var(--accent)" }}
                                                            >
                                                            Compare semaglutide prices →
                                              </Link>Link>
                                  </section>section>
                        
                                  <hr style={{ borderColor: "var(--border)" }} />
                        
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            Understanding Finnrick lab grades for weight-loss peptides
                                              </h2>h2>
                                              <p
                                                              className="text-sm leading-relaxed"
                                                              style={{ color: "var(--foreground-secondary)" }}
                                                            >
                                                            Finnrick independently tests vendor peptide products for purity, identity, and quantity accuracy. Grades range from A (highest quality) to E, based on aggregate test results across multiple samples from each vendor. For GLP-1 agonists and other weight-management peptides, lab testing is especially important because these are complex molecules where degradation or impurities can affect both safety and efficacy. We display Finnrick data alongside pricing so you can evaluate cost in the context of verified quality.
                                              </p>p>
                                  </section>section>
                        
                                  <hr style={{ borderColor: "var(--border)" }} />
                        
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            Safety considerations and regulatory status
                                              </h2>h2>
                                              <p
                                                              className="text-sm leading-relaxed"
                                                              style={{ color: "var(--foreground-secondary)" }}
                                                            >
                                                            Regulatory status varies widely across weight-management peptides. Semaglutide and tirzepatide are FDA-approved prescription medications with well-characterized safety profiles from large clinical trials. Common side effects include nausea, vomiting, and diarrhea, particularly during dose titration. Other peptides studied for weight management — such as AOD-9604 or various GH secretagogues — are not approved for human use and have limited safety data. Always consult a healthcare provider before using any peptide, particularly those without regulatory approval.
                                              </p>p>
                                  </section>section>
                        
                                  <hr style={{ borderColor: "var(--border)" }} />
                        
                                  <section>
                                              <h2
                                                              className="mb-4 text-xl font-bold"
                                                              style={{ color: "var(--foreground)" }}
                                                            >
                                                            Frequently asked questions
                                              </h2>h2>
                                              <div className="space-y-6">
                                                            <div>
                                                                            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                                                                              Are peptides for weight loss FDA-approved?
                                                                            </h3>h3>
                                                                            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                                                                                              Some are. Semaglutide (Wegovy/Ozempic) and tirzepatide (Mounjaro/Zepbound) are FDA-approved GLP-1 receptor agonists prescribed for weight management. Many other peptides marketed for weight loss are not approved for human use.
                                                                            </p>p>
                                                            </div>div>
                                                            <div>
                                                                            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                                                                              How do peptide prices vary across vendors?
                                                                            </h3>h3>
                                                                            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                                                                                              Prices for research-grade peptides can vary by 40–60% between vendors for the same compound and quantity. Peptide Daily tracks live pricing across multiple suppliers so you can compare cost alongside lab quality data.
                                                                            </p>p>
                                                            </div>div>
                                                            <div>
                                                                            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                                                                              What does a Finnrick lab grade mean?
                                                                            </h3>h3>
                                                                            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                                                                                              Finnrick independently tests vendor peptides for purity, quantity accuracy, and identity. Grades range from A (highest quality) to E, based on aggregate test results across multiple samples from each vendor.
                                                                            </p>p>
                                                            </div>div>
                                              </div>div>
                                  </section>section>
                        </div>div>
                </div>div>
          
            {/* CTA */}
                <section
                          className="py-14"
                          style={{ background: "var(--brand-navy)" }}
                        >
                        <div className="container-page text-center">
                                  <h2
                                                className="display-heading text-3xl"
                                                style={{ color: "#ffffff" }}
                                              >
                                              Ready to compare weight-loss peptide prices?
                                  </h2>h2>
                                  <p
                                                className="mt-3 text-sm"
                                                style={{ color: "rgb(255 255 255 / 0.6)" }}
                                              >
                                              See live pricing, Finnrick lab grades, and community
                                              reviews for every tracked compound.
                                  </p>p>
                                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                                              <Link
                                                              href="/peptides?category=metabolic"
                                                              className="rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                                                              style={{
                                                                                background: "var(--brand-accent)",
                                                                                color: "#fff",
                                                              }}
                                                            >
                                                            Compare Prices
                                              </Link>Link>
                                              <Link
                                                              href="/learn"
                                                              className="cta-ghost-btn rounded-lg border px-6 py-3 text-sm font-medium"
                                                              style={{
                                                                                borderColor: "rgb(255 255 255 / 0.25)",
                                                                                color: "rgb(255 255 255 / 0.85)",
                                                              }}
                                                            >
                                                            Read the Research
                                              </Link>Link>
                                  </div>div>
                        </div>div>
                </section>section>
          </div>div>
        );
}</div>
