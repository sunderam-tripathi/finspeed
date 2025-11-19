export type LocaleKey = 'en' | 'hi';

export type SupportCopy = {
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  channels: Array<{ label: string; detail: string; href: string; description: string }>;
  status: {
    title: string;
    online: string;
    outage: string;
  };
  form: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    button: string;
    success: string;
    fallback: string;
    privacy: string;
  };
  faq: Array<{ question: string; answer: string }>;
};

export const SUPPORT_COPY: Record<LocaleKey, SupportCopy> = {
  en: {
    hero: {
      kicker: 'SUPPORT HUB',
      title: 'Support hub',
      subtitle: 'Visitors can contact Finspeed support quickly for sales, service, and diagnostics.'
    },
    channels: [
      {
        label: 'WhatsApp',
        detail: '+91 96506 08982',
        href: 'https://wa.me/919650608982',
        description: '6h SLA · 09:00–21:00 IST'
      },
      {
        label: 'Email',
        detail: 'support@finspeed.online',
        href: 'mailto:support@finspeed.online',
        description: 'Replies within 6 hours during support hours'
      }
    ],
    status: {
      title: 'Channel status',
      online: 'All channels online',
      outage: 'WhatsApp outage simulated — fallback to email or the support form.'
    },
    form: {
      title: 'Open a support request',
      subtitle: 'Provide as much detail as possible so we can route it to the right engineer.',
      namePlaceholder: '',
      emailPlaceholder: '',
      messagePlaceholder: '',
      button: '',
      success: '',
      fallback: '',
      privacy: ''
    },
    faq: []
  },
  hi: {
    hero: {
      kicker: 'सपोर्ट हब',
      title: 'सपोर्ट हब',
      subtitle: 'बिक्री और सेवा से जुड़े अनुरोधों के लिए Finspeed सपोर्ट से जल्दी संपर्क करें।'
    },
    channels: [
      {
        label: 'WhatsApp',
        detail: '+91 96506 08982',
        href: 'https://wa.me/919650608982',
        description: '6 घंटे SLA · सुबह 9 से रात 9 (IST)'
      },
      {
        label: 'ईमेल',
        detail: 'support@finspeed.online',
        href: 'mailto:support@finspeed.online',
        description: 'प्रकाशित सपोर्ट समय में 6 घंटे के भीतर उत्तर'
      }
    ],
    status: {
      title: 'चैनल स्थिति',
      online: 'सभी चैनल सक्रिय हैं',
      outage: 'WhatsApp आउटेज — कृपया ईमेल या समर्थन फॉर्म का उपयोग करें।'
    },
    form: {
      title: 'समर्थन अनुरोध भेजें',
      subtitle: 'जितनी अधिक जानकारी देंगे, उतनी जल्दी सही टीम तक पहुँचेगा।',
      namePlaceholder: '',
      emailPlaceholder: '',
      messagePlaceholder: '',
      button: '',
      success: '',
      fallback: '',
      privacy: ''
    },
    faq: []
  }
};
