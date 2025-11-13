export type LocaleKey = 'en' | 'hi';

export const SUPPORT_COPY = {
  en: {
    hero: {
      title: 'Support hub',
      subtitle: 'Need help with bikes, orders, or rides? Pick the channel that suits you.'
    },
    contacts: [
      { label: 'WhatsApp', detail: '+91 98 765 43210', href: 'https://wa.me/919876543210' },
      { label: 'Email', detail: 'support@finspeed.example', href: 'mailto:support@finspeed.example' },
      { label: 'Call', detail: '1800-123-FSPD', href: 'tel:1800123' }
    ],
    faq: [
      { question: 'Where can I book service?', answer: 'Use the dealer locator or email service@finspeed.example.' },
      { question: 'How do I report a crash replacement?', answer: 'Open a ticket via email with frame serial + purchase proof.' }
    ]
  },
  hi: {
    hero: {
      title: 'सपोर्ट हब',
      subtitle: 'बाइक, ऑर्डर या राइड के लिए मदद चाहिए? अपना पसंदीदा चैनल चुनें।'
    },
    contacts: [
      { label: 'WhatsApp', detail: '+91 98 765 43210', href: 'https://wa.me/919876543210' },
      { label: 'ईमेल', detail: 'support@finspeed.example', href: 'mailto:support@finspeed.example' },
      { label: 'कॉल', detail: '1800-123-FSPD', href: 'tel:1800123' }
    ],
    faq: [
      { question: 'सेवा बुक कैसे करें?', answer: 'डीलर लोकेटर प्रयोग करें या service@finspeed.example पर ईमेल करें।' },
      { question: 'क्रेश रिप्लेसमेंट कैसे रिपोर्ट करें?', answer: 'ईमेल के साथ फ्रेम सीरियल + खरीद प्रमाण भेजें।' }
    ]
  }
} satisfies Record<LocaleKey, unknown>;
