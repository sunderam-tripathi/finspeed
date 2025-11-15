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
      kicker: 'ENGINEERED FOR INDIA',
      headline: 'Turning Pedals into Power',
      subheadline: 'Precision-engineered bicycles that make premium performance accessible everywhere.',
      body: 'Built for crowded streets, weekend escapes, and electric commutes — tuned for Indian riders.',
      primaryCta: 'View Bicycles',
      secondaryCta: 'Find a Dealer'
    },
    highlights: {
      title: 'Crafted for every ride',
      subtitle: 'Choose the discipline that fits your route and ritual.',
      cards: [
        {
          badge: '01',
          title: 'City Commute',
          blurb: 'Hybrid geometry, upright comfort, and puncture-protected tyres for weekday reliability.'
        },
        {
          badge: '02',
          title: 'Trail Explorer',
          blurb: 'Hydraulic forks, disc brakes, and knobby traction ready for monsoon clay and mountain dust.'
        },
        {
          badge: '03',
          title: 'Electric Assist',
          blurb: 'Torque-sensing e-assist, removable batteries, and integrated lights for effortless range.'
        }
      ]
    },
    engineering: {
      title: 'Engineering & performance',
      subtitle: 'Every frame, weld, and drivetrain is validated in our Delhi and Pune labs.',
      items: [
        { title: 'Lightweight alloy frames', detail: 'Double-butted tubes tuned for agility without sacrificing strength.' },
        { title: 'Disc brake package', detail: 'All-weather stopping power with organic pads and sealed cabling.' },
        { title: 'Service-ready hubs', detail: 'Standard spares, quick-release axles, and QR-coded manuals per bike.' },
        { title: 'IoT telemetry', detail: 'Optional RideLink module logs range, service hours, and diagnostics.' }
      ]
    },
    pricing: {
      title: 'Accessible pricing',
      subtitle: 'Transparent price bands with EMI-ready partners.',
      tiers: [
        {
          name: 'Daily Commute',
          price: '₹18k – ₹28k',
          description: 'Hybrid + city builds',
          features: ['Alloy frames', '2 services / 6 months', 'Fender + rack ready']
        },
        {
          name: 'Leisure & Fitness',
          price: '₹32k – ₹48k',
          description: 'Performance hybrids & MTBs',
          features: ['Lockout forks', '11/12 speed drivetrain', 'Road + trail kits']
        },
        {
          name: 'Kids & Teens',
          price: '₹12k – ₹20k',
          description: 'Confidence-building rides',
          features: ['Lightweight frames', 'Safety reflectors', 'Adjustable sizing']
        }
      ]
    },
    sustainability: {
      title: 'Ride clean. Ride local.',
      body: 'Every 10 km on a Finspeed saves up to 1.6 kg CO₂ compared to car commutes.',
      stat: '1.6 kg CO₂ saved / 10 km',
      footnote: 'Calculated on typical metro commute data, verified with the sustainability team in RFC-0003.',
      cta: 'Read why bicycles matter'
    },
    dealer: {
      title: 'Find a dealer near you',
      subtitle: 'Enter your pincode to see demo-ready studios, WhatsApp lines, and service slots.',
      placeholder: 'Enter 6-digit pincode',
      button: 'Search dealers',
      helper: 'Prefer WhatsApp? Use the floating button and we’ll route you.'
    },
    blog: {
      title: 'From the blog',
      subtitle: 'Guides, community stories, and sustainability notes from the Finspeed newsroom.',
      posts: [
        {
          tag: 'Tips',
          title: 'Daily commute cycling safety checklist',
          summary: 'Helmet fit, reflective layers, and the best early-morning routes through NCR.',
          href: '/blog/daily-commute-cycling-safety'
        },
        {
          tag: 'Stories',
          title: 'Weekend trail escapes near Pune',
          summary: 'MTB-ready routes, hydration points, and dealer-supported pit stops.',
          href: '/blog/weekend-trail-escapes'
        },
        {
          tag: 'Sustainability',
          title: 'How e-assist opens cycling to new riders',
          summary: 'Real adoption data from our Urban Electric pilots in Bengaluru.',
          href: '/blog/e-assist-impact'
        }
      ]
    },
    brand: {
      title: 'Read the full brand story',
      body: 'From workshop origins in coastal Tamil Nadu to a pan-India network delivering bilingual support, our mission is to make engineered cycling welcoming and trustworthy.',
      cta: 'Explore the brand story'
    },
    languageLabel: 'English',
    supportTitle: 'Need help? Reach support'
  },
  hi: {
    hero: {
      kicker: 'भारत के लिए इंजीनियर',
      headline: 'पैडल को शक्ति में बदलें',
      subheadline: 'उच्च-सटीकता वाली साइकिलें जो पूरे भारत में प्रदर्शन को सुलभ बनाती हैं।',
      body: 'भीड़भाड़ वाली सड़कों, वीकेंड ट्रेल और इलेक्ट्रिक कम्यूट के लिए तैयार — भारतीय राइडर्स के लिए ट्यून की गई।',
      primaryCta: 'साइकिलें देखें',
      secondaryCta: 'अपने निकटतम Finspeed डीलर को खोजें'
    },
    highlights: {
      title: 'हर सवारी के लिए तैयार',
      subtitle: 'अपनी दिनचर्या के अनुसार उपयुक्त श्रेणी चुनें।',
      cards: [
        {
          badge: '०१',
          title: 'सिटी कम्यूट',
          blurb: 'हाइब्रिड जियोमेट्री, आरामदायक राइडिंग पोज़िशन और पंक्चर-प्रोटेक्टेड टायर।'
        },
        {
          badge: '०२',
          title: 'ट्रेल एक्सप्लोरर',
          blurb: 'हाइड्रोलिक फोर्क, डिस्क ब्रेक और मजबूत ग्रिप वाले टायर पहाड़ों और मानसून कीचड़ के लिए।'
        },
        {
          badge: '०३',
          title: 'इलेक्ट्रिक असिस्ट',
          blurb: 'टॉर्क-सेंसिंग ई-असिस्ट, हटाने योग्य बैटरी और रोशन लाइट्स से आसान दूरी।'
        }
      ]
    },
    engineering: {
      title: 'इंजीनियरिंग और प्रदर्शन',
      subtitle: 'हर फ्रेम और ड्राइवट्रेन को दिल्ली और पुणे लैब में वैलिडेट किया जाता है।',
      items: [
        { title: 'हल्के एलॉय फ्रेम', detail: 'डबल-बटेड ट्यूब्स जो मजबूती रखते हुए फुरती देते हैं।' },
        { title: 'डिस्क ब्रेक पैकेज', detail: 'हर मौसम में भरोसेमंद ब्रेकिंग के लिए सील्ड केबलिंग।' },
        { title: 'सर्विस-रेडी हब', detail: 'स्टैंडर्ड स्पेयर पार्ट्स, क्विक-रिलीज़ एक्सल और QR कोड वाले मैनुअल।' },
        { title: 'IoT टेलीमेट्री', detail: 'RideLink मॉड्यूल रेंज, सर्विस घंटे और डायग्नोस्टिक्स लॉग करता है।' }
      ]
    },
    pricing: {
      title: 'सुलभ प्राइसिंग',
      subtitle: 'EMI साझेदारों के साथ स्पष्ट बैंड।',
      tiers: [
        {
          name: 'डेली कम्यूट',
          price: '₹18k – ₹28k',
          description: 'हाइब्रिड + सिटी बिल्ड',
          features: ['एलॉय फ्रेम', '6 महीने में 2 सर्विस', 'फेंडर/रैक रेडी']
        },
        {
          name: 'लीज़र व फिटनेस',
          price: '₹32k – ₹48k',
          description: 'परफॉर्मेंस हाइब्रिड और MTB',
          features: ['लॉकआउट फोर्क', '11/12 स्पीड ड्राइवट्रेन', 'रोड + ट्रेल किट']
        },
        {
          name: 'किड्स और टीन',
          price: '₹12k – ₹20k',
          description: 'आत्मविश्वास बढ़ाने वाली राइड',
          features: ['हल्के फ्रेम', 'सुरक्षा रिफ्लेक्टर', 'एडजस्टेबल साइजिंग']
        }
      ]
    },
    sustainability: {
      title: 'साफ़-सुथरी सवारी',
      body: 'हर 10 किमी साइकिल चलाने पर कार की तुलना में 1.6 किग्रा CO₂ की बचत होती है।',
      stat: '1.6 किग्रा CO₂ / 10 किमी',
      footnote: 'सामान्य मेट्रो कम्यूट डेटा और RFC-0003 सत्यापन पर आधारित।',
      cta: 'हमारी स्थिरता कहानी पढ़ें'
    },
    dealer: {
      title: 'अपने नज़दीकी डीलर को खोजें',
      subtitle: 'पिनकोड दर्ज करें और डेमो स्टूडियो, WhatsApp लाइन और सर्विस स्लॉट देखें।',
      placeholder: '6 अंकों का पिनकोड दर्ज करें',
      button: 'डीलर खोजें',
      helper: 'WhatsApp पसंद है? फ्लोटिंग बटन से सीधे चैट करें।'
    },
    blog: {
      title: 'ब्लॉग से',
      subtitle: 'मार्गदर्शक, समुदाय की कहानियां और स्थिरता नोट्स।',
      posts: [
        {
          tag: 'टिप्स',
          title: 'डेली कम्यूट सुरक्षा चेकलिस्ट',
          summary: 'हेलमेट फिट, रिफ्लेक्टिव लेयर और NCR की सुरक्षित सुबह रूट।',
          href: '/blog/daily-commute-cycling-safety'
        },
        {
          tag: 'कहानियां',
          title: 'पुणे के आसपास ट्रेल वीकेंड',
          summary: 'MTB रूट, हाइड्रेशन पॉइंट और डीलर सपोर्टेड रेस्ट।',
          href: '/blog/weekend-trail-escapes'
        },
        {
          tag: 'सस्टेनेबिलिटी',
          title: 'ई-असिस्ट क्यों नए राइडर्स लाता है',
          summary: 'बेंगलुरु के अर्बन इलेक्ट्रिक पायलट से वास्तविक डेटा।',
          href: '/blog/e-assist-impact'
        }
      ]
    },
    brand: {
      title: 'पूरी ब्रांड कहानी पढ़ें',
      body: 'तमिलनाडु के वर्कशॉप से लेकर पूरे भारत में बाइलिंगुअल सपोर्ट — हमारा लक्ष्य भरोसेमंद इंजीनियरिंग को सब तक पहुंचाना है।',
      cta: 'ब्रांड स्टोरी देखें'
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
