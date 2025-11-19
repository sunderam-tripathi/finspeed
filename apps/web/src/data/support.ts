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
      namePlaceholder: 'Full name',
      emailPlaceholder: 'you@example.com',
      messagePlaceholder: 'Describe the issue, include bike serial or RiderLink ID if available.',
      button: 'Submit request',
      success: 'Thanks! We received your request and will respond soon.',
      fallback: 'Formspree endpoint missing. Email support@finspeed.example instead.',
      privacy: 'By submitting you agree to our privacy policy; we hash your email before analytics.'
    },
    faq: [
      { question: 'Where can I book service?', answer: 'Use the dealer locator or email service@finspeed.example with your pincode.' },
      { question: 'How do crash replacements work?', answer: 'Email crash@finspeed.example with photos, frame serial, and purchase proof. We respond within 2 business days.' },
      { question: 'Can I escalate telemetry issues?', answer: 'Yes — include RiderLink logs from the companion app or reference #RL in your message for priority routing.' }
    ]
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
      namePlaceholder: 'पूरा नाम',
      emailPlaceholder: 'आपका ईमेल',
      messagePlaceholder: 'समस्या का वर्णन करें, बाइक सीरियल या RiderLink ID शामिल करें।',
      button: 'अनुरोध भेजें',
      success: 'धन्यवाद! हमने आपका अनुरोध प्राप्त किया है।',
      fallback: 'Formspree उपलब्ध नहीं है। कृपया support@finspeed.example पर मेल करें।',
      privacy: 'फॉर्म भेजते समय आप हमारी गोपनीयता नीति से सहमत हैं; एनालिटिक्स से पहले ईमेल हैश किया जाता है।'
    },
    faq: [
      { question: 'सेवा बुक कैसे करें?', answer: 'डीलर लोकेटर या service@finspeed.example का उपयोग करें और अपना पिनकोड साझा करें।' },
      { question: 'क्रैश रिप्लेसमेंट कैसे काम करता है?', answer: 'crash@finspeed.example पर फोटो, फ्रेम सीरियल और खरीद प्रमाण भेजें।' },
      { question: 'टेलीमेट्री समस्या कैसे बढ़ाएँ?', answer: '#RL संदर्भ के साथ RiderLink लॉग भेजें ताकि प्राथमिकता मिले।' }
    ]
  }
};
