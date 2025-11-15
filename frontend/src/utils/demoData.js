export const demoConversation = {
  id: 'demo',
  title: 'Is the Orion X13 worth upgrading to?',
  reddit_url: 'https://www.reddit.com/r/tech/comments/demo/orion_x13_upgrade/',
  total_comments: 512,
  created_at: '2025-05-01T12:00:00Z',
  updated_at: '2025-05-02T08:30:00Z',
};

export const demoRecentAnalyses = [
  { id: 'demo', title: demoConversation.title, created_at: demoConversation.created_at },
];

export const demoQuickSummary = {
  verdict: 'MIXED — upgrade depends on thermal tolerance and camera priorities.',
  highlights: [
    { sentiment: 'positive', icon: '✅', percentage: 68, text: 'praise the cinematic camera upgrades' },
    { sentiment: 'neutral', icon: '⚖️', percentage: 42, text: 'note the performance bump is incremental' },
    { sentiment: 'negative', icon: '⚠️', percentage: 54, text: 'complain about throttling under load' },
  ],
  argumentsFor: [
    {
      aspect: 'Camera pipeline',
      count: 132,
      topQuote: 'It finally matches mirrorless rigs for run-and-gun work.',
      sentimentPercent: 84,
    },
    {
      aspect: 'Modular design',
      count: 87,
      topQuote: 'Battery swaps + SSD sleds make it field ready.',
      sentimentPercent: 76,
    },
    {
      aspect: 'Neural ISP',
      count: 54,
      topQuote: 'Low-light scenes are shockingly clean.',
      sentimentPercent: 71,
    },
  ],
  argumentsAgainst: [
    {
      aspect: 'Thermals',
      count: 101,
      topQuote: 'Sustained renders melt the chassis.',
      sentimentPercent: 22,
    },
    {
      aspect: 'Price delta',
      count: 65,
      topQuote: 'A $900 jump for marginal CPU gains is rough.',
      sentimentPercent: 28,
    },
    {
      aspect: 'Battery life',
      count: 58,
      topQuote: 'Two hours unplugged is a non-starter.',
      sentimentPercent: 31,
    },
  ],
  topics: [
    { name: 'Camera quality', positivePercent: 82 },
    { name: 'Performance', positivePercent: 64 },
    { name: 'Design', positivePercent: 71 },
    { name: 'Thermals', positivePercent: 29 },
    { name: 'Battery life', positivePercent: 34 },
    { name: 'Value for money', positivePercent: 38 },
  ],
};

export const demoMetaAnalysis = {
  discoursePatterns: [
    {
      number: 1,
      name: 'Spec sheet anchoring',
      percentage: 62,
      group: 'skeptics',
      description: 'Commenters compare raw CPU charts without considering camera stack upgrades.',
      exampleQuote: 'Same cores, same clocks — nothing to see here.',
      analysis: 'Anchoring on CPU benchmarks obscures the pro video focus of the release.',
    },
    {
      number: 2,
      name: 'Purchase justification',
      percentage: 48,
      group: 'owners',
      description: 'New buyers retroactively rationalize the spend with emotional language.',
      exampleQuote: 'This thing is my new understudy.',
      analysis: 'Language shifts from specs to self-worth after buying.',
    },
  ],
  proTactics: [
    { name: 'Field-test anecdotes', percentage: 44, example: 'Shot an indie short with a single battery.' },
    { name: 'Comparative framing', percentage: 38, example: 'Treat it like a cinema cam, not a laptop.' },
  ],
  conTactics: [
    { name: 'Value math threads', percentage: 41, example: '$600 gets you a desktop that beats it.' },
    { name: 'Thermal horror stories', percentage: 36, example: 'Fans spin like a drone on Premiere renders.' },
  ],
  rhetoricalBalance: 'Pro side leans on narrative proof, con side on price spreadsheets.',
  biases: [
    { number: 1, name: 'Sunk-cost rationalization', side: 'owners', percentage: 52, quote: 'It’s pricey but now I’m all-in on the ecosystem.' },
    { number: 2, name: 'Status quo bias', side: 'skeptics', percentage: 47, quote: 'The X11 is more than enough, no need to upgrade.' },
  ],
  sentimentTimeline: [
    { range: 'First 100 comments', positivePercent: 71 },
    { range: 'Comments 100-300', positivePercent: 42 },
    { range: 'Comments 300+', positivePercent: 55 },
  ],
  timeline: [
    { range: '0-2h', positivePercent: 74, note: 'Launch hype + hands-on photos' },
    { range: '2-6h', positivePercent: 41, note: 'Thermal complaints land' },
    { range: '6h+', positivePercent: 53, note: 'Professionals contextualize workflow gains' },
  ],
  sentimentPattern: 'Optimism dips once specs dominate but recovers when shooters weigh in.',
  assumptions: [
    { text: 'All creators prioritize CPU benchmarks over camera stack upgrades.', side: 'skeptics' },
    { text: 'Mobile workstations should sacrifice portability for thermal headroom.', side: 'owners' },
  ],
  steelmanPro: {
    count: 64,
    text: 'For teams balancing on-set capture and mobile finishing, Orion X13 is the first truly hybrid rig.',
    strength: 'Camera-first pipeline and modular batteries collapse kit weight.',
    weakness: 'Requires strict thermal management and battery budgeting.',
  },
  steelmanCon: {
    count: 71,
    text: 'If you already own an X11 or desktop rig, the price delta buys marginal gains.',
    strength: 'Benchmarks show minimal CPU uplift.',
    weakness: 'Ignores the film-focused upgrades entirely.',
  },
  metaInsight: {
    mainPoint: 'Decision splits along workflow identity, not specs.',
    keyPoints: [
      'Specs-only debates ignore the hybrid camera body vision.',
      'Skeptics rely on spreadsheet thinking; owners on lived workflows.',
      'Thermal anxiety is emotional shorthand for risk aversion.',
    ],
    absent: [
      { topic: 'Repairability', percentage: 5 },
      { topic: 'Accessory ecosystem', percentage: 8 },
    ],
  },
  methodology: {
    approach: ['ABSA on 500 comments', 'Rhetorical clustering', 'Timeline sentiment smoothing'],
    limitations: ['Demo data — no fresh scrape', 'LLM hallucinations mitigated with templates'],
  },
};

export const demoMessages = [
  {
    id: 'demo-msg-1',
    role: 'assistant',
    content: 'Ask me anything about the Orion X13 Reddit thread — I have consensus, arguments, and quotes ready.',
    created_at: '2025-05-02T08:30:00Z',
  },
];
