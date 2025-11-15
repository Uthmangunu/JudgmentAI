export const QUICK_SUMMARY_PROMPT = `Analyze this Reddit discussion and provide a structured summary:

1. Overall consensus verdict (one sentence)
2. Top 3 highlights with percentages
3. Top 3 strongest arguments FOR (aspect, quote, sentiment %)
4. Top 3 strongest arguments AGAINST (aspect, quote, sentiment %)
5. General sentiment breakdown by major topics (5-7 topics)

Format response as JSON for easy parsing.`;

export const META_ANALYSIS_PROMPT = `You are an academic researcher conducting a meta-analysis of online discourse.

Analyze this Reddit discussion as a distant case study. Provide:

1. Discourse Structure Analysis - argumentative patterns, biases (with quotes)
2. Rhetorical Strategy Comparison - PRO vs CON tactics with percentages
3. Psychological Patterns - cognitive biases detected (with examples)
4. Sentiment Evolution Timeline - how sentiment changed over time
5. Unspoken Assumptions - implicit premises driving arguments
6. Steelman Analysis - strongest versions of PRO and CON arguments
7. Meta-Insight - what this reveals about opinion formation
8. Methodology Note - approach and limitations

Format as structured JSON for parsing.
Treat this as a sociological case study, not a product review.`;

export const ANALYSIS_MODES = [
  { id: 'quick', label: '📊 Quick Summary' },
  { id: 'meta', label: '🔬 Deep Meta-Analysis' },
  { id: 'chat', label: '💬 Chat with AI' },
];

export const DEFAULT_RECENT_ANALYSIS = {
  id: 'demo',
  title: 'Sample Discussion',
  created_at: new Date().toISOString(),
};

export const POSITIVE_COLOR = '#00FF41';
export const NEGATIVE_COLOR = '#FF3333';
export const NEUTRAL_COLOR = '#FFA500';
