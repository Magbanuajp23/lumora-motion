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
  "Gaming Montage":
    "Turn this into a gaming montage with phonk energy, beat-synced eliminations, speed ramps, impact zooms, and bold kinetic captions.",
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
    name: "Gaming Montage",
    accent: "from-signal via-aurora to-plasma",
    meta: "Phonk sync",
    detail: "Beat drops, speed ramps, impact zooms",
    icon: "gamepad"
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
  "Make this a viral TikTok edit.",
  "Create a cinematic luxury reel.",
  "Turn this into a gaming montage with phonk.",
  "Add Alex Hormozi style captions.",
  "Make this emotional and cinematic."
];

export const processingSteps = [
  "Analyzing clips",
  "Detecting highlights",
  "Syncing beats",
  "Generating captions",
  "Optimizing pacing",
  "Applying cinematic effects",
  "Preparing export"
];

export const renderQualities = [
  { label: "720p", time: "48 sec", credits: 0 },
  { label: "1080p", time: "1 min 24 sec", credits: 0 },
  { label: "4K Pro", time: "3 min 12 sec", credits: 3 }
];

export const captionStyles = [
  {
    label: "Bold White",
    value: "bold-white",
    detail: "Clean creator captions with a dark glass backing"
  },
  {
    label: "Yellow Highlight",
    value: "yellow-highlight",
    detail: "High-retention emphasis for hooks and key phrases"
  },
  {
    label: "Luxury Serif",
    value: "luxury-serif",
    detail: "Elegant editorial captions for premium reels"
  },
  {
    label: "TikTok-style Subtitles",
    value: "tiktok-subtitles",
    detail: "Punchy short-form subtitles with strong contrast"
  }
] as const;

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
  ["Prompt-to-edit", "Turn rough clips into polished TikToks, Reels, and Shorts with natural language direction."],
  ["Viral pacing engine", "Structure hooks, beat cuts, captions, and payoff moments around short-form retention."],
  ["Cinematic presets", "Use viral, luxury, gaming, real estate, motivational, and trailer-style looks."],
  ["FFmpeg export core", "Frontend MVP backed by a real local render/export pipeline."]
] as const;

export const creatorStats = [
  ["38K+", "videos rendered"],
  ["12K+", "creator workflows"],
  ["4.9/5", "average rating"],
  ["94%", "top viral score"]
] as const;

export const showcaseStats = [
  ["128K+", "Videos Rendered"],
  ["42", "AI Presets"],
  ["1m 18s", "Average Render Time"],
  ["97%", "Creator Satisfaction"]
] as const;

export const transformationShowcases = [
  {
    title: "Viral TikTok Edit",
    preset: "Viral TikTok",
    renderTime: "52 sec",
    description: "Raw phone footage becomes a hook-first vertical short with kinetic captions, punchy contrast, and beat-style pacing.",
    beforeLabel: "Phone clip",
    afterLabel: "Viral cut",
    beforeNote: "Before: plain phone clip",
    afterNote: "After: captions, pacing, color grade, and branded output",
    beforeVideo: "/demo-videos/viral-tiktok-before.mp4",
    afterVideo: "/demo-videos/viral-tiktok-after.mp4",
    accent: "from-signal via-plasma to-white",
    scene: "creator"
  },
  {
    title: "Real Estate Luxury Tour",
    preset: "Real Estate",
    renderTime: "1m 34s",
    description: "A plain walkthrough is transformed into a polished property reel with bright interiors, smooth motion, and premium labels.",
    beforeLabel: "Walkthrough",
    afterLabel: "Listing reel",
    beforeNote: "Before: raw walkthrough footage",
    afterNote: "After: luxury grade, smooth motion, and listing overlay",
    beforeVideo: "/demo-videos/real-estate-before.mp4",
    afterVideo: "/demo-videos/real-estate-after.mp4",
    accent: "from-white via-signal to-plasma",
    scene: "estate"
  },
  {
    title: "Gaming Montage",
    preset: "Gaming Montage",
    renderTime: "1m 08s",
    description: "Long gameplay is compressed into a fast phonk-style montage with impact zooms, shake energy, and clutch captions.",
    beforeLabel: "Raw gameplay",
    afterLabel: "Impact sync",
    beforeNote: "Before: unedited gameplay capture",
    afterNote: "After: impact cuts, zooms, captions, and branded output",
    beforeVideo: "/demo-videos/gaming-before.mp4",
    afterVideo: "/demo-videos/gaming-after.mp4",
    accent: "from-plasma via-aurora to-white",
    scene: "gaming"
  },
  {
    title: "Cinematic Travel Reel",
    preset: "Cinematic",
    renderTime: "1m 22s",
    description: "Travel clips get an emotional grade, slow zoom feel, trailer-style titles, and smooth fade transitions.",
    beforeLabel: "Trip clips",
    afterLabel: "Film reel",
    beforeNote: "Before: plain travel clips",
    afterNote: "After: cinematic grade, titles, motion, and watermark",
    beforeVideo: "/demo-videos/cinematic-before.mp4",
    afterVideo: "/demo-videos/cinematic-after.mp4",
    accent: "from-plasma via-white to-aurora",
    scene: "travel"
  },
  {
    title: "Motivational Edit",
    preset: "Motivational",
    renderTime: "58 sec",
    description: "A simple talking-head clip becomes a high-energy founder short with warm color, bold captions, and dramatic pacing.",
    beforeLabel: "Raw talk",
    afterLabel: "Founder short",
    beforeNote: "Before: raw talking-head footage",
    afterNote: "After: bold captions, warm grade, and motivational pacing",
    beforeVideo: "/demo-videos/motivational-before.mp4",
    afterVideo: "/demo-videos/motivational-after.mp4",
    accent: "from-white via-plasma to-signal",
    scene: "motivation"
  },
  {
    title: "Luxury Brand Ad",
    preset: "Luxury",
    renderTime: "1m 46s",
    description: "Product b-roll turns into a premium campaign asset with soft contrast, elegant text, and clean slow-motion feel.",
    beforeLabel: "Product b-roll",
    afterLabel: "Brand ad",
    beforeNote: "Before: raw product b-roll",
    afterNote: "After: premium grade, elegant titles, and branded output",
    beforeVideo: "/demo-videos/luxury-before.mp4",
    afterVideo: "/demo-videos/luxury-after.mp4",
    accent: "from-aurora via-white to-plasma",
    scene: "luxury"
  }
] as const;

export const demoCategories = [
  {
    name: "TikTok edits",
    raw: "Raw hook",
    edited: "Caption punch",
    accent: "from-signal to-plasma",
    stat: "2.1x retention"
  },
  {
    name: "gaming montages",
    raw: "Long gameplay",
    edited: "Phonk drop",
    accent: "from-plasma to-aurora",
    stat: "18 beat cuts"
  },
  {
    name: "luxury reels",
    raw: "Phone footage",
    edited: "Premium grade",
    accent: "from-aurora to-white",
    stat: "cinema look"
  },
  {
    name: "real estate edits",
    raw: "Walkthrough",
    edited: "Listing reel",
    accent: "from-white to-signal",
    stat: "32 scenes"
  },
  {
    name: "podcast shorts",
    raw: "Long episode",
    edited: "Viral clip",
    accent: "from-signal to-white",
    stat: "smart captions"
  },
  {
    name: "vlog edits",
    raw: "Daily clips",
    edited: "Story arc",
    accent: "from-plasma to-signal",
    stat: "fast pacing"
  }
] as const;

export const templates = [
  ["Viral TikTok", "Hook cut", "2 credits", ["captions", "beat cuts", "9:16"], "Trending"],
  ["Gaming Montage", "Phonk sync", "3 credits", ["speed ramps", "impact zooms", "bass hits"], "Hot"],
  ["Luxury Lifestyle", "Premium reel", "2 credits", ["soft glow", "slow reveals", "brand grade"], "Pro"],
  ["Cinematic Reels", "Trailer pass", "2 credits", ["film grade", "sound swells", "dramatic fades"], "New"],
  ["Podcast Clips", "Talking head", "1 credit", ["captions", "jump cuts", "headline hook"], "Creator"],
  ["Real Estate Reels", "Listing tour", "2 credits", ["room labels", "smooth pans", "bright grade"], "Agency"],
  ["Business Ads", "Founder offer", "2 credits", ["CTA captions", "product beats", "clean pacing"], "Launch"],
  ["Motivational Edits", "Story arc", "2 credits", ["bold quotes", "emotional lift", "final punch"], "Viral"]
] as const;

export const aiSuggestions = [
  ["Boost opening hook", "Lead with the strongest visual in the first 1.2 seconds."],
  ["Add pattern interrupt", "Insert a zoom pulse before the third caption beat."],
  ["Shorten dead air", "Remove 4.6 seconds of low-motion footage from the middle."],
  ["Export vertical cut", "Create a 9:16 Shorts version for reposting."]
] as const;

export const renderQueue = [
  ["Client launch reel", "Rendering", "72%"],
  ["Gaming montage batch", "Queued", "starts next"],
  ["Podcast highlight", "Exported", "1080p"]
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
    "Sample launch creator",
    "Demo quote: Lumora Motion turns messy reels into polished campaign cuts before my editor coffee even cools."
  ],
  [
    "Theo Banks",
    "Sample real estate filmmaker",
    "Demo quote: The prompt flow nails pacing and captions. It feels like a production assistant built into the browser."
  ],
  [
    "Rina Vale",
    "Sample founder",
    "Demo quote: This is the first AI editor that feels premium enough to show clients during a pitch."
  ]
];
