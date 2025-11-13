export type LocaleKey = 'en' | 'hi';

// Copy derived from specs/references/handoff/_shared/assets/locales/{en,hi}/home.json
export const HOME_COPY: Record<LocaleKey, {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  languageLabel: string;
  supportTitle: string;
}> = {
  en: {
    hero: {
      headline: 'Turning Pedals into Power',
      subheadline: 'Precision-engineered cycles that make performance accessible across India.',
      cta: 'Find a Dealer'
    },
    languageLabel: 'English',
    supportTitle: 'Need help? Reach support'
  },
  hi: {
    hero: {
      headline: 'पैडल को शक्ति में बदलें',
      subheadline: 'भारत भर में प्रदर्शन को सुलभ बनाने के लिए तैयार किए गए उच्च-सटीकता साइकिल।',
      cta: 'अपने निकटतम Finspeed डीलर को खोजें'
    },
    languageLabel: 'हिन्दी',
    supportTitle: 'मदद चाहिए? समर्थन से बात करें'
  }
};

export const NAV_LINKS = [
  { label: 'Bicycles', href: '/catalog' },
  { label: 'Models', href: '/models' },
  { label: 'Brand', href: '/brand-story' },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' }
];

export const PRODUCT_FAMILIES = [
  {
    title: 'Performance Road',
    blurb: 'Carbon-crafted aero frames engineered for cadence efficiency and long-haul comfort.'
  },
  {
    title: 'All-Terrain Adventure',
    blurb: 'Rugged geometry, precision shocks, and drivetrain tuning for Himalayan climbs to city grit.'
  },
  {
    title: 'Urban Electric',
    blurb: 'Torque-smart e-assist and IoT monitoring make daily commutes effortless.'
  }
];

export const SUPPORT_CHANNELS = [
  {
    label: 'WhatsApp',
    detail: '+91 98 765 43210',
    href: 'https://wa.me/919876543210'
  },
  {
    label: 'Email',
    detail: 'support@finspeed.example',
    href: 'mailto:support@finspeed.example'
  }
];
