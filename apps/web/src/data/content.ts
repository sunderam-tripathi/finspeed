export type LocaleKey = 'en' | 'hi';

type HighlightCard = {
  badge: string;
  title: string;
  blurb: string;
};

type EngineeringItem = {
  title: string;
  detail: string;
};

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

type BlogPost = {
  tag: string;
  title: string;
  summary: string;
  href: string;
};

export type HomeCopy = {
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  highlights: {
    title: string;
    subtitle: string;
    cards: HighlightCard[];
  };
  engineering: {
    title: string;
    subtitle: string;
    items: EngineeringItem[];
  };
  pricing: {
    title: string;
    subtitle: string;
    tiers: PricingTier[];
  };
  sustainability: {
    title: string;
    body: string;
    stat: string;
    footnote: string;
    cta: string;
  };
  dealer: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    helper: string;
  };
  blog: {
    title: string;
    subtitle: string;
    posts: BlogPost[];
  };
  brand: {
    title: string;
    body: string;
    cta: string;
  };
  languageLabel: string;
  supportTitle: string;
};

// Copy derived from specs/references/handoff/_shared/assets/locales/{en,hi}/home.json + ui-ux-aesthetics spec
export const HOME_COPY: Record<LocaleKey, HomeCopy> = {
  en: {
    hero: {
      kicker: '',
      headline: 'Turning Pedals into Power',
      subheadline: 'Precision-engineered cycles that make performance accessible across India.',
      body: '',
      primaryCta: 'Find a Dealer',
      secondaryCta: ''
    },
    highlights: {
      title: '',
      subtitle: '',
      cards: []
    },
    engineering: {
      title: '',
      subtitle: '',
      items: []
    },
    pricing: {
      title: '',
      subtitle: '',
      tiers: []
    },
    sustainability: {
      title: '',
      body: '',
      stat: '',
      footnote: '',
      cta: ''
    },
    dealer: {
      title: '',
      subtitle: '',
      placeholder: '',
      button: '',
      helper: ''
    },
    blog: {
      title: '',
      subtitle: '',
      posts: []
    },
    brand: {
      title: '',
      body: '',
      cta: ''
    },
    languageLabel: 'English',
    supportTitle: ''
  },
  hi: {
    hero: {
      kicker: '',
      headline: 'पैडल को शक्ति में बदलें',
      subheadline: 'भारत भर में प्रदर्शन को सुलभ बनाने के लिए तैयार किए गए उच्च-सटीकता साइकिल।',
      body: '',
      primaryCta: 'अपने निकटतम Finspeed डीलर को खोजें',
      secondaryCta: ''
    },
    highlights: {
      title: '',
      subtitle: '',
      cards: []
    },
    engineering: {
      title: '',
      subtitle: '',
      items: []
    },
    pricing: {
      title: '',
      subtitle: '',
      tiers: []
    },
    sustainability: {
      title: '',
      body: '',
      stat: '',
      footnote: '',
      cta: ''
    },
    dealer: {
      title: '',
      subtitle: '',
      placeholder: '',
      button: '',
      helper: ''
    },
    blog: {
      title: '',
      subtitle: '',
      posts: []
    },
    brand: {
      title: '',
      body: '',
      cta: ''
    },
    languageLabel: 'हिन्दी',
    supportTitle: ''
  }
};

export const NAV_LINKS = [
  { label: 'Bicycles', href: '/catalog' },
  { label: 'Models', href: '/models' },
  { label: 'Brand', href: '/brand-story' },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' }
];

export const SUPPORT_CHANNELS = [
  {
    label: 'WhatsApp',
    detail: '',
    href: ''
  },
  {
    label: 'Email',
    detail: '',
    href: ''
  }
];
