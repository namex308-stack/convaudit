export type CalculatorFaq = {
  q: string;
  a: string;
};

export type EngagementRateFaq = CalculatorFaq;

export type EngagementRateBenchmark = {
  platform: string;
  minimum: number;
  maximum: number;
};

export const ENGAGEMENT_RATE_CALCULATOR = {
  slug: "engagement-rate-calculator",
  name: "Engagement Rate Calculator",
  title: "Engagement Rate Calculator: Calculate Social Engagement",
  description:
    "Calculate engagement rate from followers, likes, comments, and shares, then compare it with broad Instagram, TikTok, and YouTube benchmarks.",
};

export const ENGAGEMENT_RATE_BENCHMARKS: EngagementRateBenchmark[] = [
  { platform: "Instagram", minimum: 1, maximum: 3 },
  { platform: "TikTok", minimum: 3, maximum: 6 },
  { platform: "YouTube", minimum: 2, maximum: 5 },
];

export function calculateEngagementRate(
  followers: number,
  likes: number,
  comments: number,
  shares: number,
) {
  const interactions = likes + comments + shares;
  return followers > 0 ? (interactions / followers) * 100 : 0;
}

export function calculateTikTokEarnings(views: number, rpm: number) {
  return (views / 1000) * rpm;
}

export const ENGAGEMENT_RATE_FAQS: EngagementRateFaq[] = [
  {
    q: "How do you calculate engagement rate?",
    a: "Add the likes, comments, and shares on a post, divide their total by your follower count, and multiply by 100. This calculator uses that follower-based formula.",
  },
  {
    q: "What is a good engagement rate?",
    a: "A good rate depends on the platform, audience size, content format, and how engagement is measured. The ranges shown here are broad reference points, not official platform standards or guarantees.",
  },
  {
    q: "Can I use this calculator for any social platform?",
    a: "Yes. Enter the relevant follower or subscriber count and the post's likes, comments, and shares. The formula works across platforms, although their typical benchmarks and measurement methods may differ.",
  },
];

export type CalculatorContent = {
  slug: string;
  name: string;
  title: string;
  description: string;
  directAnswer: string;
  definitionTitle: string;
  definition: string;
  formula: string;
  faqs: CalculatorFaq[];
};

export const TIKTOK_MONEY_CALCULATOR: CalculatorContent = {
  slug: "tiktok-money-calculator",
  name: "TikTok Money Calculator",
  title: "TikTok Money Calculator: Estimate Creator Earnings",
  description:
    "Estimate TikTok creator earnings from monthly video views and RPM with a free, private calculator.",
  directAnswer:
    "The TikTok Money Calculator estimates potential creator earnings by multiplying monthly video views by your estimated revenue per 1,000 views (RPM). Enter both numbers for an instant estimate. It is free because calculations run in your browser, with no account, payment, or data upload required; actual TikTok payouts can differ.",
  definitionTitle: "What is TikTok creator revenue?",
  definition:
    "TikTok creator revenue is money earned through eligible platform monetization, sponsorships, and other creator programs. This calculator estimates view-based revenue only; it does not fetch private account data or guarantee a payout. RPM is the estimated amount earned per 1,000 views, and it can vary with eligibility, audience, region, and program terms.",
  formula:
    "Estimated earnings = (Monthly views ÷ 1,000) × estimated RPM",
  faqs: [
    {
      q: "How does the TikTok Money Calculator estimate earnings?",
      a: "It divides your monthly video views by 1,000 and multiplies that figure by the RPM you enter. RPM means estimated revenue per thousand views. The result is a planning estimate, not a report of actual TikTok payments, and it does not include sponsorships, gifts, subscriptions, or other income unless you account for them separately.",
    },
    {
      q: "What RPM should I enter for TikTok?",
      a: "Enter a revenue-per-thousand-views figure that reflects your own eligible account and the monetization program you want to estimate. There is no single RPM that applies to every creator: audience location, qualified views, content, and program rules can affect results. If you do not know your RPM, try a few values to compare scenarios.",
    },
    {
      q: "Does this calculator show guaranteed TikTok payouts?",
      a: "No. This is an independent estimate based only on the views and RPM you provide. TikTok eligibility requirements, qualified-view definitions, program availability, and payment rules can change, so the result may not match your earnings dashboard. Check TikTok’s current terms and your account analytics before making financial or business decisions.",
    },
  ],
};

export const INFLUENCER_RATE_CALCULATOR: CalculatorContent = {
  slug: "influencer-rate-calculator",
  name: "Influencer Sponsorship Rate Calculator",
  title: "Influencer Sponsorship Rate Calculator: Estimate Brand Pricing",
  description:
    "Build a starting sponsorship quote from average views, CPM, and deliverables—free and private.",
  directAnswer:
    "The Influencer Sponsorship Rate Calculator estimates a starting brand quote from average post views, a target cost per thousand views (CPM), and the number of deliverables. Enter your campaign assumptions to see an instant estimate. The tool is free and runs in your browser; the result is a negotiation starting point, not a fixed market rate.",
  definitionTitle: "What is an influencer sponsorship rate?",
  definition:
    "An influencer sponsorship rate is the fee a creator charges for agreed promotional work. Pricing can reflect expected views, audience fit, engagement, production, usage rights, exclusivity, and turnaround time. This calculator uses an adjustable CPM-based estimate and deliverable count, so creators and brands can model a starting price before negotiating the full campaign scope.",
  formula:
    "Estimated sponsorship rate = (Average views ÷ 1,000) × target CPM × deliverables",
  faqs: [
    {
      q: "How does the sponsorship rate estimate work?",
      a: "The calculator converts average post views into groups of 1,000, multiplies by your chosen CPM, and scales the amount by the number of deliverables. CPM is your chosen target price per thousand expected views. The estimate is a simple planning baseline and does not automatically price production, usage rights, exclusivity, or other contract terms.",
    },
    {
      q: "What CPM should I use when setting an influencer rate?",
      a: "Choose a CPM that reflects your audience, content format, campaign goals, niche, and past performance. Sponsorship pricing has no universal standard, and actual rates can vary substantially. If you are unsure, use several CPM assumptions to create a low, expected, and high quote, then compare them with your costs and the value offered to the brand.",
    },
    {
      q: "Does the result include usage rights or exclusivity?",
      a: "No. The estimate only multiplies average views, your selected CPM, and deliverable quantity. Paid usage, whitelisting, category exclusivity, revisions, rush production, and licensing can all require separate fees. Define those items in the campaign agreement and adjust your final quote rather than treating this calculator’s result as a complete contract price.",
    },
  ],
};

export const ROAS_CALCULATOR: CalculatorContent = {
  slug: "roas-calculator",
  name: "ROAS Calculator",
  title: "ROAS Calculator: Measure Return on Ad Spend",
  description:
    "Calculate return on ad spend instantly from ad-attributed revenue and campaign costs.",
  directAnswer:
    "The ROAS Calculator measures how much revenue your advertising generates for each unit of ad spend. Enter the revenue attributed to your ads and the campaign’s advertising cost to get the return-on-ad-spend ratio instantly. It is free to use because the calculation runs in your browser and does not require an account or data upload.",
  definitionTitle: "What is a good ROAS?",
  definition:
    "Return on ad spend (ROAS) is attributed revenue divided by advertising cost, commonly expressed as a ratio such as 4:1 or 4x. A “good” ROAS depends on margins, operating costs, attribution quality, and business goals. ROAS measures revenue efficiency, not profit, and should be interpreted alongside contribution margin and other campaign results.",
  formula: "ROAS = Ad-attributed revenue ÷ advertising spend",
  faqs: [
    {
      q: "How do you calculate ROAS?",
      a: "Divide the revenue attributed to an advertising campaign by the amount spent on that advertising. For example, $4,000 in attributed revenue from $1,000 in ad spend is a 4x ROAS. Use revenue and spend from the same campaign, currency, and reporting period for a meaningful comparison.",
    },
    {
      q: "What is considered a good ROAS?",
      a: "There is no universal good ROAS target. A campaign’s break-even point depends on gross margin, product costs, fulfillment, discounts, platform fees, and other operating expenses. A high revenue-to-spend ratio can still lose money if margins are low. Set a target from your economics and compare campaigns using consistent attribution.",
    },
    {
      q: "Is ROAS the same as advertising profit?",
      a: "No. ROAS compares attributed revenue with ad spend, but it does not subtract the cost of goods, shipping, agency fees, taxes, or other expenses. Profit measures what remains after relevant costs. Use ROAS to assess advertising efficiency, and pair it with margin or profit analysis to judge overall business performance.",
    },
  ],
};

export const FOLLOWER_GROWTH_CALCULATOR: CalculatorContent = {
  slug: "follower-growth-calculator",
  name: "Follower Growth Rate Calculator",
  title: "Follower Growth Rate Calculator: Track Audience Growth",
  description:
    "Measure follower growth or decline between two counts with a quick, free percentage calculator.",
  directAnswer:
    "The Follower Growth Rate Calculator shows the percentage change between a starting and ending follower count. Enter both counts to see net followers gained or lost and the growth rate instantly. It is free because the calculation happens in your browser without an account, tracking connection, or upload of your audience data.",
  definitionTitle: "What is follower growth rate?",
  definition:
    "Follower growth rate is the percentage increase or decrease in an account’s follower count over a selected period. It compares the net change with the starting audience, which makes growth easier to compare across account sizes. The rate alone does not explain why followers changed or whether new followers are active and relevant.",
  formula:
    "Follower growth rate (%) = ((Ending followers − Starting followers) ÷ Starting followers) × 100",
  faqs: [
    {
      q: "How do you calculate follower growth rate?",
      a: "Subtract the starting follower count from the ending count, divide the difference by the starting count, and multiply by 100. A positive result means the account gained followers; a negative result means it lost followers. The starting count must be greater than zero because percentage change cannot be calculated from a zero baseline.",
    },
    {
      q: "What is a good follower growth rate?",
      a: "A useful growth rate depends on the platform, time period, account size, posting strategy, and audience quality. There is no universal target that applies to every creator or brand. Compare your rate with your own previous periods using the same measurement window, and consider reach, engagement, and relevant audience growth alongside the percentage.",
    },
    {
      q: "Can follower growth rate be negative?",
      a: "Yes. If the ending follower count is lower than the starting count, the formula returns a negative percentage that represents audience decline. This can happen because people unfollow, inactive accounts are removed, or a platform updates its counts. Review the same time period and data source before drawing conclusions about performance.",
    },
  ],
};
