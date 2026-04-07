/**
 * Discovery Flow configuration — question definitions and branching logic.
 *
 * The flow is a step-through wizard that recommends peptides and providers
 * based on user goals. All logic is deterministic (no AI required).
 */

export interface FlowStep {
  id: string;
  question: string;
  subtitle?: string;
  options: FlowOption[];
}

export interface FlowOption {
  label: string;
  value: string;
  icon?: string;
  /** Tags this answer maps to for filtering */
  tags: string[];
}

export const DISCOVERY_STEPS: FlowStep[] = [
  {
    id: "goal",
    question: "What are you researching?",
    subtitle: "Select the area that best matches your primary interest.",
    options: [
      { label: "Weight management", value: "weight-loss", icon: "scale", tags: ["weight-loss", "metabolic"] },
      { label: "Recovery & healing", value: "recovery", icon: "bandage", tags: ["recovery", "tissue-repair", "wound-healing"] },
      { label: "Muscle & performance", value: "muscle", icon: "strength", tags: ["muscle-growth", "performance"] },
      { label: "Skin & appearance", value: "skin", icon: "sparkle", tags: ["skin", "anti-aging", "hair-growth"] },
      { label: "Cognitive function", value: "cognitive", icon: "brain", tags: ["cognitive", "neuroprotection"] },
      { label: "Sleep & stress", value: "sleep", icon: "moon", tags: ["sleep", "immune"] },
      { label: "Longevity & aging", value: "longevity", icon: "clock", tags: ["longevity", "anti-aging"] },
      { label: "Joint & gut health", value: "joint-gut", icon: "shield", tags: ["joint-health", "gut-health", "anti-inflammatory"] },
    ],
  },
  {
    id: "experience",
    question: "How familiar are you with peptide research?",
    options: [
      { label: "Brand new — just starting to learn", value: "beginner", tags: ["beginner"] },
      { label: "Somewhat familiar — read some research", value: "intermediate", tags: ["intermediate"] },
      { label: "Experienced — comfortable with protocols", value: "advanced", tags: ["advanced"] },
    ],
  },
  {
    id: "source-preference",
    question: "Where would you prefer to source compounds?",
    subtitle: "This helps us recommend the right type of provider.",
    options: [
      { label: "Prescribed by a physician or clinic", value: "clinical", tags: ["clinical", "telehealth", "clinic"] },
      { label: "Compounding pharmacy with a prescription", value: "pharmacy", tags: ["pharmacy_503a", "pharmacy_503b"] },
      { label: "Research vendor (for research use)", value: "research", tags: ["research", "online_vendor"] },
      { label: "Not sure yet — show me all options", value: "all", tags: [] },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: [
      { label: "Lab-tested quality above all", value: "quality", tags: ["lab-tested"] },
      { label: "Best price for the compound", value: "price", tags: ["price-sensitive"] },
      { label: "Clinical oversight and guidance", value: "guidance", tags: ["clinical"] },
      { label: "Convenience and fast shipping", value: "convenience", tags: ["convenience"] },
    ],
  },
];

export interface FlowAnswers {
  goal?: string;
  experience?: string;
  sourcePreference?: string;
  priority?: string;
}

/** Extract all tags from a set of answers. */
export function extractTags(answers: FlowAnswers): string[] {
  const tags: string[] = [];

  for (const step of DISCOVERY_STEPS) {
    const answer = answers[step.id as keyof FlowAnswers];
    if (!answer) continue;
    const option = step.options.find((o) => o.value === answer);
    if (option) {
      tags.push(...option.tags);
    }
  }

  return [...new Set(tags)];
}
