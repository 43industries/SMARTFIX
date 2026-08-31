export const DEFAULT_CONTENT = {
  hero: {
    title: 'Professional Electronics Repair in Marshall, Texas',
    subtitle: 'Expert repair for phones, tablets, laptops, gaming consoles, and all your electronic devices'
  },
  services: {
    title: 'Our Electronics Repair Services',
    subtitle: 'Expert repair for all your electronic devices',
    items: [
      {
        icon: '📱',
        title: 'Phone Repair',
        text: 'Screens, batteries, charging ports, water damage, and more for iPhone, Android, and other smartphones.'
      },
      {
        icon: '💻',
        title: 'Laptop & Computer',
        text: 'Diagnostics, SSD upgrades, keyboard replacements, cooling issues, and software troubleshooting.'
      },
      {
        icon: '📲',
        title: 'Tablet Repair',
        text: 'Glass, displays, batteries, and connectors for iPad and Android tablets.'
      },
      {
        icon: '🎮',
        title: 'Gaming Consoles',
        text: 'HDMI, power, disc drive, overheating, and controller repairs for major console brands.'
      },
      {
        icon: '🔧',
        title: 'Other Electronics',
        text: 'Small electronics and accessories — ask us if we can fix it before you replace it.'
      }
    ]
  },
  about: {
    title: 'About SmartFix Marshall',
    paragraph1: 'SmartFix Marshall is your trusted electronics repair specialist in Marshall, Texas. We specialize in repairing phones, tablets, laptops, gaming consoles, and all electronic devices.',
    paragraph2: 'With years of experience and expertise in electronics repair, we provide fast, reliable, and affordable repair services. Our skilled technicians use quality parts and professional tools to get your devices working like new again.',
    features: [
      'Free diagnostic estimates on most repairs',
      'Quality parts and professional tools',
      'Fast turnaround on common repairs',
      'Honest recommendations — repair vs. replace'
    ]
  },
  contact: {
    phone: '(903) 578-7629',
    phoneTel: '+19035787629',
    email: 'smartfixmarshalltx@gmail.com',
    address: '1111B E Grand Avenue\nMarshall, TX 75670',
    hours: 'Mon: 9AM - 6PM\nTue: 9AM - 6PM\nWed: 9AM - 6PM\nThu: 9AM - 6PM\nFri: 9AM - 6PM\nSat: 10AM - 4PM\nSun: Closed'
  },
  quote: {
    title: 'Get a Free Quote',
    subtitle: 'Fill out the form below to get an instant quote for your electronics repair'
  },
  footer: {
    description: 'Your trusted electronics repair specialist in Marshall, Texas. Expert repair for phones, tablets, laptops, gaming consoles, and all electronic devices.'
  }
};

export function mergeContent(stored) {
  if (!stored || typeof stored !== 'object') {
    return structuredClone(DEFAULT_CONTENT);
  }
  return {
    hero: { ...DEFAULT_CONTENT.hero, ...stored.hero },
    services: {
      ...DEFAULT_CONTENT.services,
      ...stored.services,
      items: Array.isArray(stored.services?.items) && stored.services.items.length
        ? stored.services.items
        : DEFAULT_CONTENT.services.items
    },
    about: {
      ...DEFAULT_CONTENT.about,
      ...stored.about,
      features: Array.isArray(stored.about?.features) && stored.about.features.length
        ? stored.about.features
        : DEFAULT_CONTENT.about.features
    },
    contact: { ...DEFAULT_CONTENT.contact, ...stored.contact },
    quote: { ...DEFAULT_CONTENT.quote, ...stored.quote },
    footer: { ...DEFAULT_CONTENT.footer, ...stored.footer }
  };
}
