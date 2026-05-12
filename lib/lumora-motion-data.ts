export const brand = {
  name: "Lumora Motion",
  shortName: "Lumora",
  tagline: "AI motion studio",
  watermark: "Edited with Lumora Motion",
  emailPlaceholder: "creator@lumoramotion.ai"
};

export const presetPrompts: Record<string, string> = {
  "Viral TikTok":
    "Make this a viral short-form edit with a 2-second hook, beat-synced cuts, bold captions, and a strong final callout.",
  Cinematic:
    "Make it cinematic and emotional with dramatic pacing, soft film color, music swells, and a memorable closing shot.",
  Luxury:
    "Give this a luxury brand edit with elegant motion, premium color grading, slow reveals, and refined transitions.",
  "Real Estate":
    "Add a luxury real estate vibe with bright interiors, smooth walkthrough pacing, clean labels, and an upscale finish.",
  Motivational:
    "Make this motivational with powerful captions, energetic pacing, emotional music, and an inspiring final message."
};

export const presets = [
  {
    name: "Viral TikTok",
    accent: "from-signal via-plasma to-white",
    meta: "9:16 edits",
    detail: "Jump cuts, captions, beat-synced motion",
    icon: "zap"
  },
  {
    name: "Cinematic",
    accent: "from-plasma via-white to-aurora",
    meta: "16:9 grade",
    detail: "Trailer pacing, emotional color, dramatic contrast",
    icon: "clapperboard"
  },
  {
    name: "Luxury",
    accent: "from-aurora via-white to-plasma",
    meta: "Premium ad",
    detail: "Slow reveals, glossy grade, elegant pacing",
    icon: "badge"
  },
  {
    name: "Real Estate",
    accent: "from-white via-signal to-plasma",
    meta: "Tour polish",
    detail: "Clean walkthroughs, daylight lift, smooth pans",
    icon: "image"
  },
  {
    name: "Motivational",
    accent: "from-white via-plasma to-signal",
    meta: "Founder story",
    detail: "Bold captions, emotional arc, uplifting rhythm",
    icon: "sparkles"
  }
];

export const promptExamples = [
  "Make this a viral TikTok edit",
  "Make it cinematic and emotional",
  "Add luxury real estate vibe",
  "Make it fast-paced with captions"
];

export const processingSteps = [
  "Analyzing video",
  "Detecting scenes",
  "Cutting clips",
  "Adding captions",
  "Applying transitions",
  "Enhancing audio",
  "Preparing export"
];

export const renderQualities = [
  { label: "720p", time: "48 sec", credits: 0 },
  { label: "1080p", time: "1 min 24 sec", credits: 0 },
  { label: "4K Pro", time: "3 min 12 sec", credits: 3 }
];

export const creditCosts = [
  ["Basic AI edit", "1 credit"],
  ["Cinematic AI edit", "2 credits"],
  ["Auto captions", "1 credit"],
  ["Beat sync editing", "1 credit"],
  ["Premium VFX", "2 credits"],
  ["4K export", "3 credits"]
] as const;

export const creditSummary = {
  plan: "Pro",
  monthlyCredits: 500,
  remainingCredits: 382,
  usedCredits: 118,
  renewal: "renews in 12 days"
};

export const usageHistory = [
  ["Viral launch clip", "Cinematic AI edit + captions", "-3 credits", "Today"],
  ["Gaming montage", "Beat sync editing", "-1 credit", "Yesterday"],
  ["Luxury listing reel", "4K export + premium VFX", "-5 credits", "May 9"],
  ["Founder short", "Basic AI edit", "-1 credit", "May 8"]
] as const;

export const creditBundles = [
  ["Starter Boost", "50 credits", "$5"],
  ["Creator Pack", "250 credits", "$15"],
  ["Studio Reserve", "1000 credits", "$39"]
] as const;

export const aiStats = [
  ["Captions added", "24"],
  ["Transitions applied", "18"],
  ["Scenes optimized", "32"],
  ["Viral score", "94%"]
];

export const pricingPlans = [
  {
    name: "Free Plan",
    price: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    credits: "10 credits/month",
    tag: "Start",
    cta: "Start Free",
    watermark: "Edited with Lumora Motion",
    features: [
      "720p export",
      "watermark exports",
      "limited templates",
      "slower rendering",
      "basic AI edits",
      "basic captions",
      "limited transitions",
      "community support"
    ]
  },
  {
    name: "Creator Plan",
    price: "$7/month",
    monthlyPrice: "$7",
    yearlyPrice: "$5",
    credits: "100 credits/month",
    tag: "Creator",
    cta: "Upgrade Now",
    features: [
      "no watermark",
      "1080p export",
      "faster rendering",
      "cinematic presets",
      "auto captions",
      "beat sync editing",
      "priority render queue"
    ]
  },
  {
    name: "Pro Plan",
    price: "$19/month",
    monthlyPrice: "$19",
    yearlyPrice: "$15",
    credits: "500 credits/month",
    tag: "MOST POPULAR",
    cta: "Get Pro",
    featured: true,
    features: [
      "4K export",
      "advanced AI cinematic editing",
      "premium transitions/VFX",
      "AI storytelling edits",
      "AI color grading",
      "advanced motion effects",
      "cloud save/projects"
    ]
  },
  {
    name: "Studio / Agency Plan",
    price: "$49/month",
    monthlyPrice: "$49",
    yearlyPrice: "$39",
    credits: "2000 credits/month",
    tag: "Teams",
    cta: "Contact Studio",
    features: [
      "multi-user/team access",
      "shared workspace",
      "ultra-fast rendering",
      "commercial license",
      "bulk AI rendering",
      "future API access",
      "client project management",
      "priority support"
    ]
  }
];

export const workflowSteps = [
  ["01", "Upload", "Drop raw clips into the glass timeline and preview format, duration, and size."],
  ["02", "Prompt", "Describe the viral, cinematic, luxury, or business edit you want."],
  ["03", "Render", "Lumora Motion prepares cuts, captions, transitions, grading, and export."],
  ["04", "Publish", "Download a creator-ready MP4 and track credit usage from your dashboard."]
] as const;

export const featureHighlights = [
  ["Prompt-to-edit", "Turn rough clips into polished shorts with natural language direction."],
  ["Credit-aware rendering", "See exactly how edits, captions, VFX, and 4K exports consume credits."],
  ["Cinematic presets", "Use viral, luxury, real estate, motivational, and trailer-style looks."],
  ["FFmpeg export core", "Frontend MVP backed by a real local render/export pipeline."]
] as const;

export const faqs = [
  [
    "How do credits work?",
    "Each AI action consumes credits. A basic edit costs 1 credit, cinematic edits cost 2, and 4K export adds 3 credits."
  ],
  [
    "Can I export without a watermark?",
    "The Free Plan includes the Lumora Motion watermark. Creator, Pro, and Studio exports are shown as no-watermark plans."
  ],
  [
    "Is this connected to a real renderer?",
    "Yes. The MVP keeps the existing FFmpeg-backed upload, processing, and MP4 export route for local rendering."
  ],
  [
    "Who is Lumora Motion for?",
    "Creators, gamers, real estate teams, founders, and agencies producing cinematic short-form content."
  ]
] as const;

export const testimonials = [
  [
    "Maya Chen",
    "Launch creator",
    "Lumora Motion turns messy reels into polished campaign cuts before my editor coffee even cools."
  ],
  [
    "Theo Banks",
    "Real estate filmmaker",
    "The prompt flow nails pacing and captions. It feels like a production assistant built into the browser."
  ],
  [
    "Rina Vale",
    "Founder",
    "This is the first AI editor that feels premium enough to show clients during a pitch."
  ]
];
