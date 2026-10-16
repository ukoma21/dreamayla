export const plans={
  journal:{name:"Dream Journal",price:"$8.90",interval:"month",reports:"30 personal three-lens interpretations",features:["30 complete Dreamayla readings every month","Ancient symbolism through the Symbol lens","Jungian-inspired insight through the Psyche lens","Ayla Personal Insight through the Self lens","Private Dream Journal with saved interpretations","Discover recurring symbols and emotional patterns","Full access to Dreamayla insight tools: Birth Chart, Baby Name Analysis, and Baby Name Ideas"]},
  plus:{name:"Dreamayla Premium",price:"$12.90",interval:"month",reports:"Unlimited personal three-lens interpretations",features:["Unlimited complete Dreamayla readings","Everything included in Dream Journal","Deeper symbolic and archetypal exploration","Expanded Jungian-inspired perspectives","Dream DNA: discover long-term dream patterns","Ayla Dream Guide personal guidance","Private conversations grounded in your dream history","One-on-One Dream Consultation access","Priority personalized interpretation services"]}
} as const;
export type PlanKey=keyof typeof plans;

// Plan IDs are deployment configuration, never source-code credentials.
// Keeping this map beside the public plan names prevents the two monthly
// products from being selected interchangeably by the checkout route.
export const paypalPlanEnvironmentKeys: Record<PlanKey, "PAYPAL_JOURNAL_PLAN_ID" | "PAYPAL_PLUS_PLAN_ID"> = {
  journal: "PAYPAL_JOURNAL_PLAN_ID",
  plus: "PAYPAL_PLUS_PLAN_ID",
};
