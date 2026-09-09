export interface ImagePreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const CURATED_SERVICE_IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'tent-clear',
    title: 'Luxury Clear-Span Tent',
    category: 'tents',
    url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'tent-alpine',
    title: 'High-Peak Alpine Marquee',
    category: 'tents',
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'sound-concert',
    title: 'Line Array Audio Rig',
    category: 'sound-mc',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'sound-dj',
    title: 'Live DJ & Acoustic Deck',
    category: 'sound-mc',
    url: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'lighting-moving-heads',
    title: 'Beam & Moving Heads Stage',
    category: 'lighting',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'lighting-ambient',
    title: 'Warm Ambient Fairy Lighting',
    category: 'lighting',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'screens-led-wall',
    title: 'P2.6 Ultra-HD LED Wall',
    category: 'screens',
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'production-stage',
    title: 'Aluminium Truss & Staging',
    category: 'production',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'restroom-luxury',
    title: 'VIP Mobile Restroom Suite',
    category: 'restrooms',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'b2b-warehouse',
    title: 'Wholesale Truss & Equipment',
    category: 'b2b-lending',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200',
  },
];

export const QUICK_FEATURE_SUGGESTIONS = [
  'Professional Rigging Crew Included',
  'Dual Generator Backup Interlink',
  'Certified Audio Engineer on Site',
  'Free Delivery within Kampala & Entebbe',
  'Rainproof, Fire-Retardant Fabric',
  'High-Definition Live Camera Feed Integration',
  'VIP Restroom Sanitizer & Attendant',
  'Wireless UHF Microphone System (4 Channels)',
  'Heavy-Duty Wind Bracing (Up to 90 km/h)',
  'Emergency 24/7 Technician Standby',
  'Custom Mood Lighting & Dimmer Control',
  'Staging Carpet & Skirting Included',
];

export const QUICK_PRICE_PRESETS = [
  { label: '1.5M', value: 1500000 },
  { label: '2.5M', value: 2500000 },
  { label: '3.5M', value: 3500000 },
  { label: '5.0M', value: 5000000 },
  { label: '7.5M', value: 7500000 },
  { label: '12M', value: 12000000 },
];

export const QUICK_CAPACITY_PRESETS = [
  '100 - 300 Guests',
  '300 - 800 Guests',
  '500 - 1,500 Guests',
  '1,500 - 3,000 Guests',
  '3,000+ Stadium Scale',
];

export const QUICK_PRICE_UNITS = [
  'per event',
  'per day',
  'per weekend',
  'per 3 days',
  'per meter',
];

export const QUICK_UGANDAN_LOCATIONS = [
  'Kampala (Serena / Kololo)',
  'Entebbe Botanical / Lake Shore',
  'Masaka Golf Course Arena',
  'Jinja Nile Resort / Speke',
  'Mbarara City Venue',
  'Mukono / Seeta Resort',
  'Lwengo Country Venue',
  'Gulu Regional Stadium',
];

export const QUICK_EQUIPMENT_SUGGESTIONS = [
  'Clear-Span Mega Tent',
  'Line Array Sound System',
  'P2.6 Curved LED Wall',
  'Beam & Wash Moving Heads',
  'Luxury VIP Mobile Restrooms',
  'Aluminium Staging & Truss',
  'Dual Silent Generators',
  'Fairy Lights & Ambient Drape',
];
