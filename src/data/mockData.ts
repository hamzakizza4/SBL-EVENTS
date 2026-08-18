import { Service, CalendarEvent, Testimonial, GalleryItem, InventoryItem, TeamMember } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'mega-tents',
    title: 'Mega Tents & Alpine Marquees',
    tagline: 'Engineered high-capacity architectural shelter for 100 to 5,000+ guests',
    category: 'tents',
    shortDesc: 'Premium European-standard clear-span marquees, high-peak alpine tents, and transparent glass dome structures with certified storm anchoring.',
    fullDesc: 'SBL Events operates the region’s premier fleet of modular mega tents. Built with anodized structural aluminium and heavy-duty flame-retardant, UV-proof PVC membranes, our tents create breathtaking venues anywhere from rolling green lawns to paved urban plazas. Includes options for cassette flooring, crystal chandeliers, glass walling, and climate control.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 1200,
    priceUnit: 'per event day',
    capacityOrScale: '100 - 5,000+ Attendees',
    b2bAvailable: true,
    features: [
      'Engineered aluminium frame with 100km/h wind tolerance',
      'Crystal-clear transparent roofs & panoramic glass side-panels',
      'Heavy-duty integrated wooden cassette flooring & carpets',
      'Full thermal insulation and ducted HVAC air-conditioning'
    ],
    specs: [
      { label: 'Span Widths', value: '10m, 15m, 20m, 25m, 30m expandable lengths' },
      { label: 'Material', value: '850g/m² blackout/translucent flame-retardant PVC' },
      { label: 'Anchoring', value: 'Earth anchors, heavy concrete ballast blocks (no damage to tiles)' },
      { label: 'Setup Time', value: '4 to 12 hours depending on scale' }
    ],
    packages: [
      {
        name: 'Alpine Standard (200 Guests)',
        price: 950,
        description: 'Ideal for intimate garden weddings and private banquets.',
        features: ['15m x 20m Alpine Structure', 'Waterproof White Canvas', 'Standard Perimeter Draping', 'Ground Pegging & Basic Setup']
      },
      {
        name: 'Grand Marquee Royal (600 Guests)',
        price: 2400,
        popular: true,
        description: 'Our most popular choice for grand luxury weddings and corporate galas.',
        features: ['20m x 40m Clear-Span Marquee', 'Silk Pleated Roof Lining', 'Cassette Timber Flooring', 'Full Concrete Ballast Anchors', 'LED Perimeter Mood Wash']
      },
      {
        name: 'Imperial Mega Dome (1,500+ Guests)',
        price: 4800,
        description: 'For massive concerts, state dinners, and major cultural festivals.',
        features: ['30m x 60m Modular Megatent', 'Panoramic Glass Walls & Double Doors', 'Heavy Duty Flooring with Red Carpet', 'HVAC Ducting Ports', 'Structural Rigging Truss Points']
      }
    ]
  },
  {
    id: 'stage-construction',
    title: 'Heavy-Duty Stages & Box Truss Rigging',
    tagline: 'Rock-solid concert stages, elevated podiums, catwalks & structural rigging',
    category: 'tents',
    shortDesc: 'Certified modular aluminium stages, curved festival roof trusses, VIP catwalks, and podiums customized for concerts, conferences, and awards.',
    fullDesc: 'From high-impact fashion show catwalks to multi-tier rock festival stages, SBL Events constructs robust, load-bearing staging with millimeter precision. All stages feature slip-resistant textured decking, adjustable hydraulic leveling legs for uneven terrain, safety kickboards, railings, and velvet stage skirting.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 650,
    priceUnit: 'per setup',
    capacityOrScale: 'Heights: 0.4m to 2.4m | Up to 400m² Stage Area',
    b2bAvailable: true,
    features: [
      'TUV certified 400mm x 400mm heavy aluminium box trussing',
      '750kg/m² load-bearing weatherproof plywood anti-slip decks',
      'Custom staircases with LED safety step lights and handrails',
      'Wheelchair accessible ramps and VIP presidential podiums'
    ],
    specs: [
      { label: 'Deck Dimensions', value: '2m x 1m modular interlocking panels' },
      { label: 'Height Range', value: '40cm, 60cm, 100cm, 150cm, 200cm' },
      { label: 'Truss Finish', value: 'Natural Silver Aluminium & Matte Black powder-coated' }
    ]
  },
  {
    id: 'intelligent-lighting',
    title: 'Intelligent Architectural & Mood Lighting',
    tagline: 'Dynamic beam lasers, computer DMX moving heads, uplighting & warm ambient glow',
    category: 'lighting',
    shortDesc: 'Transform any venue into a cinematic wonderland with computerized beam moving heads, wireless battery uplighting, pixel tubes, and custom monogram gobos.',
    fullDesc: 'Lighting sets the pulse of any celebration. SBL Events brings cutting-edge DMX programmable lighting design. We illuminate outdoor landscapes, bathe marquee draping in romantic warm ambers or corporate brand hues, and ignite dance floors with synchronization to live music and MC cues.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 500,
    priceUnit: 'per package',
    capacityOrScale: 'Indoor Ballrooms to 10,000-seat Outdoor Arenas',
    b2bAvailable: true,
    features: [
      '380W BSW Moving Head Beams with rotating prism & gobo effects',
      'Wireless IP65 waterproof outdoor uplighting for trees and architectural facades',
      'Titan One & GrandMA digital lighting consoles with live lighting engineer',
      'Low-lying dry ice fog machines for cloud-like "Dancing on the Clouds" bridal moments'
    ],
    specs: [
      { label: 'Fixtures', value: 'Moving heads, LED Bars, Pixel Tubes, Profile Spotlights' },
      { label: 'Control', value: 'Wireless DMX512 + Art-Net Network' },
      { label: 'Special Effects', value: 'Sparkular cold fireworks, CO2 jets, low-smoke generators' }
    ]
  },
  {
    id: 'led-screens',
    title: 'High-Definition LED Video Walls & Screens',
    tagline: 'Ultra-bright indoor & outdoor P2.6 / P3.9 LED displays with live video switching',
    category: 'screens',
    shortDesc: 'Crisp, sunlight-visible modular LED screens for live camera feeds, sponsor displays, wedding photo montages, concert graphics, and corporate keynotes.',
    fullDesc: 'Say goodbye to washed-out projectors. SBL Events delivers high-nits, seamless curved and flat LED video screens that shine brilliantly even under midday sun. Managed with Novastar 4K processors and multi-camera live video production switchers, our team handles real-time IMAG camera feeds, motion graphics, and live social streams.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 800,
    priceUnit: 'per day',
    capacityOrScale: 'Sizes from 3m x 2m up to 16m x 6m Ultra-Wide',
    b2bAvailable: true,
    features: [
      'P2.6 High Definition Indoor & P3.9 High-Nits IP65 Outdoor panels',
      'Novastar 4K video processors with HDMI/SDI 4K switching',
      'Multi-camera live broadcast feed integration with professional operators',
      'Ground-stacking or high-truss flying rig configurations'
    ],
    specs: [
      { label: 'Brightness', value: '5,500 nits daylight readable' },
      { label: 'Refresh Rate', value: '3,840 Hz flicker-free on broadcast video' },
      { label: 'Configuration', value: 'Flat, 90° corner, or curved concave/convex' }
    ]
  },
  {
    id: 'mobile-disco-sound',
    title: 'Mobile Disco, Concert Sound & Live DJ',
    tagline: 'Pristine acoustic coverage with active line array audio & premier DJ sound systems',
    category: 'sound-mc',
    shortDesc: 'Crystal-clear acoustic reinforcement with DB Technologies / RCF line arrays, dual 18-inch subwoofers, Pioneer CDJ-3000 decks, and versatile party DJs.',
    fullDesc: 'Sound clarity can make or break an event. SBL Events deploys world-class active line array sound systems calibrated for balanced volume distribution across thousands of guests without deafening the front rows. Paired with top-tier wireless Shure Axient microphones and seasoned club/wedding DJs with vast eclectic music libraries.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 550,
    priceUnit: 'per event',
    capacityOrScale: '50 to 8,000+ Audience Coverage',
    b2bAvailable: true,
    features: [
      'Active Line Array columns & high-excursion 2000W subwoofers',
      'Pioneer DJ Nexus 2 / CDJ-3000 setups with custom DJ illuminated booths',
      'UHF Digital Wireless Mics (Shure Beta 58A / Sennheiser G4) with zero dropouts',
      'Tailored music curation for weddings, corporate galas, African/Afrobeats, Pop, EDM & Oldies'
    ],
    specs: [
      { label: 'Audio Power', value: '5,000W to 40,000W RMS digital amplification' },
      { label: 'Mixers', value: 'Behringer X32 / Allen & Heath SQ-6 32-channel digital mixers' },
      { label: 'Monitoring', value: 'Stage wedges + Wireless In-Ear Monitor (IEM) systems' }
    ]
  },
  {
    id: 'professional-mc',
    title: 'Professional MC & Master of Ceremonies',
    tagline: 'Charismatic, articulate, and bilingual hosts who keep your program on time and energized',
    category: 'sound-mc',
    shortDesc: 'Seasoned event hosts skilled in maintaining audience engagement, managing protocol, handling VIP guests, and orchestrating smooth, fun transitions.',
    fullDesc: 'Our Master of Ceremonies roster represents the industry gold standard. Whether leading an executive corporate summit, presidential dinner, glamorous wedding reception, or high-energy festival crowd, SBL MCs blend refined diplomacy, witty crowd chemistry, and strict adherence to your run of show.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 400,
    priceUnit: 'per event',
    capacityOrScale: 'All audience sizes',
    b2bAvailable: false,
    features: [
      'Pre-event program consultation and detailed timeline review',
      'Bilingual hosting (English, Swahili, Luganda, French upon request)',
      'VIP protocol etiquette and formal toast facilitation',
      'Dynamic crowd games, couple entry choreography & hype management'
    ],
    specs: [
      { label: 'Experience', value: 'Minimum 7+ years of mainstage hosting' },
      { label: 'Specializations', value: 'Corporate Galas, Weddings, State Banquets, Award Shows' }
    ]
  },
  {
    id: 'luxury-decoration',
    title: 'Luxury Decoration & Thematic Styling',
    tagline: 'Bespoke floral architecture, silk drapery, custom backdrops & luxury table scapes',
    category: 'production',
    shortDesc: 'Exquisite custom styling including fresh floral arches, royal head-table installations, velvet draped walls, mirror walkways, and ambient table settings.',
    fullDesc: 'Our visionary creative team turns empty canvases into opulent spectacles. SBL Decoration merges modern floral sculpture, imported glassware, gold Chiavari and Dior chairs, cascading crystal chandeliers, and customized photo-moment backdrops that leave guests in awe and photographers thrilled.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 750,
    priceUnit: 'per theme setup',
    capacityOrScale: 'Customizable for 50 to 2,000+ Guests',
    b2bAvailable: false,
    features: [
      'Fresh floral ceiling cascades & bespoke stage focal backdrops',
      'Chiavari, Phoenix, Chanel, and Dior luxury seating with designer cushions',
      'Mirrored acrylic runways, gold charger plates, and linen napkins',
      'Custom 3D logo signage, entrance arches, and neon photo booths'
    ],
    specs: [
      { label: 'Floral Types', value: 'Imported fresh roses, hydrangeas, orchids, and lush greenery' },
      { label: 'Fabric Quality', value: 'Heavy premium matte silk, chiffon, and velvet draping' }
    ]
  },
  {
    id: 'event-planning',
    title: 'Full-Spectrum Event Planning & Coordination',
    tagline: 'End-to-end production management, budget oversight & flawless day-of execution',
    category: 'production',
    shortDesc: 'Stress-free event production from concept mood boards, vendor contract management, floor planning, permit coordination, to minute-by-minute execution.',
    fullDesc: 'SBL Events acts as your all-in-one producer. We eliminate the stress of dealing with dozen distinct vendors by uniting technical engineering, catering synchronization, artist riders, and guest transport under a single battle-tested project manager and on-site command team.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 900,
    priceUnit: 'per project',
    capacityOrScale: 'Full event coordination',
    b2bAvailable: false,
    features: [
      'Dedicated Senior Event Director and on-site stage managers with radios',
      '3D venue layout visualizer and guest flow simulation',
      'Emergency contingency plans (weather, backup power, medical aid)',
      'Complete budget reconciliation and vendor timeline synchronization'
    ],
    specs: [
      { label: 'Timeline', value: 'Pre-planning starting 6 months to 2 weeks out' },
      { label: 'Team Size', value: '4 to 18 dedicated on-site coordinators' }
    ]
  },
  {
    id: 'mobile-toilets',
    title: 'VIP Mobile Luxury Restrooms & Sanitation',
    tagline: 'Self-contained, air-conditioned executive restroom trailers with hotel-grade luxury',
    category: 'restrooms',
    shortDesc: 'Pristine 5-star mobile washroom trailers featuring porcelain flushing toilets, running hot/cold water, vanity mirrors, AC, music, and full-time attendants.',
    fullDesc: 'Ensure your VIP guests enjoy five-star comfort even at the most remote outdoor lawn, farm, or beach venue. SBL luxury mobile restroom trailers feature separate male/female suites with porcelain flushing basins, luxury liquid soaps, cloth towels, LED ambient mirrors, and quiet on-board water & waste systems with continuous on-site sanitization.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 350,
    priceUnit: 'per unit / day',
    capacityOrScale: 'Suites for 150 to 2,000+ Guests',
    b2bAvailable: true,
    features: [
      'Fully self-contained: Integrated fresh water tanks & odor-free waste tanks',
      'Whisper-quiet air conditioning & background Bluetooth audio',
      'Touchless sensor taps, luxury hand lotion dispensers & LED makeup mirrors',
      'Dedicated smartly uniformed hygiene attendant stationed throughout your event'
    ],
    specs: [
      { label: 'Configurations', value: '2-Bay VIP trailer, 4-Bay Executive, 6-Bay Grand trailers' },
      { label: 'Power', value: 'Standard 240V plug or onboard generator operation' },
      { label: 'Hygiene', value: 'Hospital-grade sanitization between guest uses' }
    ]
  },
  {
    id: 'tent-lending-b2b',
    title: 'B2B Tent Lending & Equipment Sub-Rentals',
    tagline: 'Wholesale gear lending & marquee rental for event planners, promoters & venues',
    category: 'b2b-lending',
    shortDesc: 'Direct dry-hire and wet-hire equipment lending: Mega tents, heavy trussing, sound rigs, 100kVA silent generators, and luxury chairs at wholesale rates.',
    fullDesc: 'Are you a fellow event planner, hotel venue, concert promoter, or rental company in need of additional inventory or high-capacity alpine tents? SBL Events offers certified B2B equipment lending with flexible daily/weekly rates, rapid warehouse dispatch, certified rigging crews, or direct yard pickup.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80'
    ],
    basePrice: 450,
    priceUnit: 'daily wholesale rate',
    capacityOrScale: 'Large volume wholesale inventory',
    b2bAvailable: true,
    features: [
      'Discounted wholesale pricing for verified event organizers & venues',
      'Option for dry-hire (equipment only) or wet-hire (with SBL rigging crew)',
      'Emergency same-day dispatch for last-minute guest overflows',
      'Fully insured structural gear and load test certifications provided'
    ],
    specs: [
      { label: 'Inventory', value: '15,000+ sq/m of tents, 350m truss, 2,500 Chiavari chairs' },
      { label: 'Payment Terms', value: 'Flexible B2B terms for corporate accounts & retainers' }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Royal Garden Wedding - Victoria & David',
    eventType: 'wedding',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    location: 'Serene Botanical Gardens, Entebbe Road',
    status: 'booked',
    servicesSummary: ['Grand Marquee (600 Guests)', 'Intelligent Lighting', 'Sound & Live DJ', 'Decoration', 'Luxury Mobile Toilets'],
    clientName: 'David K. & Victoria M.',
    guestCount: 650
  },
  {
    id: 'evt-2',
    title: 'East Africa Fintech Gala & Tech Summit',
    eventType: 'corporate',
    startDate: '2026-08-26',
    endDate: '2026-08-27',
    location: 'Speke Resort Convention Grounds',
    status: 'booked',
    servicesSummary: ['P2.6 LED Video Wall (12m x 4m)', 'Heavy Box Truss Stage', 'Corporate Lighting', 'Executive Sound', 'Senior MC'],
    clientName: 'Fintech Alliance Africa',
    guestCount: 850
  },
  {
    id: 'evt-3',
    title: 'Annual Afro-Fusion Music Festival 2026',
    eventType: 'concert_festival',
    startDate: '2026-09-04',
    endDate: '2026-09-06',
    location: 'Lakeside Cultural Grounds',
    status: 'public_showcase',
    isPublic: true,
    publicDescription: 'Mainstage festival production by SBL Events featuring 40kW Line Arrays, full DMX beam laser lighting, 3 LED screens & 2000-seater hospitality marquee.',
    servicesSummary: ['Main Festival Stage', '30m Dome Tent', 'P3.9 Outdoor LED Screens', '40kW Audio', '100kVA Generator Backup'],
    clientName: 'Afro-Beats Live Promoters',
    guestCount: 4500
  },
  {
    id: 'evt-4',
    title: 'B2B Marquee Lending to Grand Palm Hotel',
    eventType: 'tent_lending_b2b',
    startDate: '2026-09-11',
    endDate: '2026-09-13',
    location: 'Grand Palm Resort Grounds',
    status: 'booked',
    servicesSummary: ['2x 20m x 30m Clear-Span Tents', 'Cassette Flooring', 'Rigging Crew'],
    clientName: 'Grand Palm Hospitality',
    guestCount: 800
  },
  {
    id: 'evt-5',
    title: 'Silver Jubilee Diplomatic Banquet',
    eventType: 'cultural_religious',
    startDate: '2026-09-18',
    endDate: '2026-09-18',
    location: 'Diplomatic Compound Grounds',
    status: 'booked',
    servicesSummary: ['Imperial Mega Marquee', 'Crystal Chandeliers', 'VIP Mobile Restrooms', 'Master of Ceremonies'],
    clientName: 'Consular Protocol Office',
    guestCount: 400
  },
  {
    id: 'evt-6',
    title: 'SBL Open House & Production Showcase Day',
    eventType: 'outdoor_expo',
    startDate: '2026-09-25',
    endDate: '2026-09-25',
    location: 'SBL Production Central Hub',
    status: 'public_showcase',
    isPublic: true,
    publicDescription: 'Join us for live demonstrations of our newest P2.6 curved LED wall, Alpine glass marquee, laser light shows, and meet our top MCs and sound engineers.',
    servicesSummary: ['Live Gear Demo', 'Tent Displays', 'Free Consultations'],
    guestCount: 300
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Brenda & Arthur Mugisha',
    role: 'Bride & Groom',
    companyOrEvent: 'Grand Garden Wedding (700 Guests)',
    content: 'SBL Events made our wedding look like a million dollars! The 20m x 40m clear-roof marquee lit up in gold uplighting with the low-lying cloud smoke during our first dance left everyone speechless. The sound was crystal clear and the luxury mobile toilets felt like a 5-star hotel.',
    rating: 5,
    date: 'July 2026',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    eventType: 'wedding',
    verified: true,
    approved: true,
    featured: true
  },
  {
    id: 'test-2',
    author: 'Marcus Omondi',
    role: 'Head of Brand & Corporate Affairs',
    companyOrEvent: 'East Africa Telecoms Annual Summit',
    content: 'Flawless execution! When organizing an event for 1,200 regional executives and ministers, failure is not an option. SBL provided the high-nits LED screens, seamless live camera switching, pristine audio with zero feedback, and their senior MC handled diplomatic protocol brilliantly.',
    rating: 5,
    date: 'June 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    eventType: 'corporate',
    verified: true,
    approved: true,
    featured: true
  },
  {
    id: 'test-3',
    author: 'Claire Nantume',
    role: 'Lead Planner & Director',
    companyOrEvent: 'Nantume Luxury Weddings (B2B Partner)',
    content: 'As an event planner, SBL Events is my secret weapon. Whenever my inventory runs short or I need an expansive 1,000-seater alpine marquee, their B2B tent lending and staging service delivers on time without stress. Their rigging crew is fast, disciplined, and courteous.',
    rating: 5,
    date: 'August 2026',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    eventType: 'tent_lending_b2b',
    verified: true,
    approved: true,
    featured: true
  },
  {
    id: 'test-4',
    author: 'DJ Derrick "The Maestro"',
    role: 'Festival Music Producer',
    companyOrEvent: 'Sundowner Vibes Festival',
    content: 'The mobile disco and stage lighting setup SBL brought was insane. The moving beam fixtures and dual 18-inch subwoofers shook the entire lakeside grounds while keeping the mid-range vocals crisp. Best technical team in the business.',
    rating: 5,
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    eventType: 'concert_festival',
    verified: true,
    approved: true,
    featured: false
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bkg-101',
    referenceNumber: 'SBL-2026-8812',
    clientName: 'Dr. Sarah Kigozi',
    email: 'sarah.kigozi@medhealth.org',
    phone: '+256 702 445 890',
    companyName: 'MedHealth Foundation',
    eventType: 'corporate' as const,
    eventDate: '2026-09-02',
    endDate: '2026-09-02',
    durationDays: 1,
    location: 'Commonwealth Grounds, Munyonyo',
    venueType: 'outdoor_grass' as const,
    guestCount: 450,
    selectedServices: ['mega-tents', 'intelligent-lighting', 'led-screens', 'mobile-disco-sound'],
    addons: [
      { id: 'gen-100', name: '100kVA Backup Silent Generator', price: 350, quantity: 1 },
      { id: 'wc-vip', name: 'VIP 2-Bay Luxury Restroom Trailer', price: 350, quantity: 2 }
    ],
    customRequests: 'Include branding logo monogram projected on tent roof. VIP red carpet entrance required.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '20m x 30m Clear-Span Marquee',
    lightingStyle: 'Corporate Blue & Warm Gold Theme',
    estimatedTotal: 3950,
    status: 'confirmed' as const,
    createdAt: '2026-08-10',
    notes: 'Advance deposit paid. Site visit completed on Aug 12.'
  },
  {
    id: 'bkg-102',
    referenceNumber: 'SBL-2026-8845',
    clientName: 'Kenneth & Anita Businge',
    email: 'kenneth.businge@gmail.com',
    phone: '+256 772 311 908',
    eventType: 'wedding' as const,
    eventDate: '2026-09-19',
    endDate: '2026-09-19',
    durationDays: 1,
    location: 'Kajjansi Hillside Country Club',
    venueType: 'outdoor_grass' as const,
    guestCount: 500,
    selectedServices: ['mega-tents', 'luxury-decoration', 'intelligent-lighting', 'mobile-disco-sound', 'professional-mc', 'mobile-toilets'],
    addons: [
      { id: 'dry-ice', name: 'Dancing on Clouds (Low-Fog Effect)', price: 150, quantity: 1 },
      { id: 'sparkular', name: 'Indoor Cold Spark Fireworks (4 Units)', price: 200, quantity: 1 }
    ],
    customRequests: 'Emerald green and champagne gold decor palette. High-peak alpine tent with fairy light canopy.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '20m x 40m Alpine Marquee',
    lightingStyle: 'Romantic Warm Amber & Fairy Light Glow',
    estimatedTotal: 4850,
    status: 'pending' as const,
    createdAt: '2026-08-15',
    notes: 'Awaiting final contract sign-off.'
  },
  {
    id: 'bkg-103',
    referenceNumber: 'SBL-2026-8790',
    clientName: 'Pulse Events Ltd (Patrick O.)',
    email: 'patrick@pulseevents.co',
    phone: '+256 755 889 012',
    companyName: 'Pulse Events Ltd',
    eventType: 'tent_lending_b2b' as const,
    eventDate: '2026-08-28',
    endDate: '2026-08-30',
    durationDays: 3,
    location: 'Jinja Agricultural Showgrounds',
    venueType: 'outdoor_grass' as const,
    guestCount: 1500,
    selectedServices: ['mega-tents', 'stage-construction', 'tent-lending-b2b'],
    addons: [
      { id: 'riggers', name: 'Certified SBL Rigging Crew (4 Pax)', price: 300, quantity: 1 }
    ],
    customRequests: 'B2B Equipment Sub-Rental: 30m x 50m Modular Marquee + 12m x 8m Box Truss Stage with roof canopy.',
    powerRequirement: 'venue_power_available' as const,
    tentSizeNeeded: '30m x 50m Modular Marquee',
    estimatedTotal: 3800,
    status: 'confirmed' as const,
    createdAt: '2026-08-04',
    notes: 'Truck logistics scheduled for Aug 27 morning.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Royal Botanical Marquee Wedding',
    category: 'weddings',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    location: 'Entebbe Botanical Gardens',
    date: 'Summer 2026',
    attendees: '600 Guests',
    description: 'A breathtaking 20m x 40m clear-span marquee with silk pleated ceiling drapes, crystal chandeliers, warm DMX uplighting, and custom floral head table.',
    servicesProvided: ['Mega Tents', 'Decoration', 'Intelligent Lighting', 'VIP Restrooms', 'Mobile Disco'],
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-2',
    title: 'Pan-African Energy Summit & Expo Stage',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    location: 'Kigali Convention Arena Grounds',
    date: 'June 2026',
    attendees: '1,400 Delegates',
    description: 'High-impact conference setup featuring a 14m x 4m P2.6 ultra-wide LED screen, curved stage trussing, line array sound, and multi-camera broadcast switching.',
    servicesProvided: ['LED Screens', 'Stage & Trussing', 'Sound Systems', 'Event Coordination', 'Lighting']
  },
  {
    id: 'gal-3',
    title: 'Lakeside Moonlit Festival Mainstage',
    category: 'concerts',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    location: 'Speke Resort Lakeside',
    date: 'May 2026',
    attendees: '3,800 Attendees',
    description: 'Full concert production with heavy aluminium ground-support box truss, 380W beam moving heads, 40kW line array audio, and synchronized cold pyrotechnics.',
    servicesProvided: ['Stage Construction', 'Mobile Disco & DJ', 'Lighting Show', 'LED Video Wall', 'Mega Tents']
  },
  {
    id: 'gal-4',
    title: 'Luxury Glass Marquee Dinner Gala',
    category: 'weddings',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
    location: 'Hilltop Country Estate',
    date: 'April 2026',
    attendees: '400 VIP Guests',
    description: 'Transparent panoramic glass dome marquee with parquet hardwood flooring, ambient perimeter uplights, and luxury mobile toilet suites.',
    servicesProvided: ['Mega Tents', 'Mobile Restrooms', 'Lighting Design', 'Decoration']
  },
  {
    id: 'gal-5',
    title: 'Corporate Awards Gala & Banquet',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    location: 'Grand Ballroom & Lawn',
    date: 'March 2026',
    attendees: '500 Executives',
    description: 'End-to-end event planning, senior MC orchestration, custom awards stage backdrop, and seamless audio-visual presentation delivery.',
    servicesProvided: ['Event Planning', 'Professional MC', 'Sound & Video', 'Stage Rigging']
  },
  {
    id: 'gal-6',
    title: 'Nightclub Vibe Wedding After-Party',
    category: 'concerts',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    location: 'Private Villa Grounds',
    date: 'July 2026',
    attendees: '250 Guests',
    description: 'Complete mobile disco setup with custom illuminated DJ booth, moving beam light show, low-smoke machine, and curated club mixes until sunrise.',
    servicesProvided: ['Mobile Disco', 'Lighting Effects', 'Sound System', 'VIP Restrooms']
  }
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    name: '20m x 40m Alpine Clear-Span Mega Marquee',
    category: 'Tents & Structures',
    totalQuantity: 6,
    availableQuantity: 4,
    unit: 'Structure',
    dailyRate: 1800,
    specs: 'Heavy aluminium frame, 850g/m² blackout/clear PVC, 100km/h wind rating',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-2',
    name: 'P2.6 / P3.9 Ultra-HD Modular LED Panels (500x500mm)',
    category: 'Video & Screens',
    totalQuantity: 180,
    availableQuantity: 120,
    unit: 'Panels',
    dailyRate: 15,
    specs: 'Novastar 4K processing, 5,500 nits daylight readable, 3840Hz refresh',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-3',
    name: 'DB Technologies DVA T8 Active Line Array Modules',
    category: 'Audio & Sound',
    totalQuantity: 24,
    availableQuantity: 16,
    unit: 'Speakers',
    dailyRate: 40,
    specs: '700W RMS 3-way active line array module with DSP control',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-4',
    name: '400mm Aluminium Box Trussing (3-meter Sections)',
    category: 'Staging & Truss',
    totalQuantity: 80,
    availableQuantity: 52,
    unit: 'Lengths',
    dailyRate: 20,
    specs: 'TUV certified structural load alloy 6082-T6 with quick-lock pins',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-5',
    name: 'VIP Executive 4-Bay Mobile Restroom Trailer',
    category: 'Restrooms & Sanitation',
    totalQuantity: 5,
    availableQuantity: 3,
    unit: 'Trailers',
    dailyRate: 450,
    specs: 'Air-conditioned, hot/cold vanity, porcelain flushing bowls, stereo music',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-6',
    name: '100kVA Cummins Silent Diesel Generator',
    category: 'Power & Logistics',
    totalQuantity: 4,
    availableQuantity: 3,
    unit: 'Generators',
    dailyRate: 350,
    specs: 'Soundproof canopy <65dB at 7m, 3-phase 415V distribution board with ATS',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-7',
    name: '380W BSW Beam/Spot/Wash Moving Head Lights',
    category: 'Lighting & FX',
    totalQuantity: 48,
    availableQuantity: 32,
    unit: 'Fixtures',
    dailyRate: 25,
    specs: 'DMX512, rotating 8+16 facet prism, 14 color filters, frost filter',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  },
  {
    id: 'inv-8',
    name: 'Gold Phoenix & Dior Luxury Banquet Chairs',
    category: 'Decoration & Seating',
    totalQuantity: 2500,
    availableQuantity: 1800,
    unit: 'Chairs',
    dailyRate: 1.5,
    specs: 'High-density polycarbonate with plush velvet padded cushions',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80',
    b2bEligible: true
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Simon B. Lubega',
    role: 'Founder & Chief Event Producer',
    experience: '18+ Years',
    specialty: 'Mega Tent Engineering & Large Scale Production Logistics',
    bio: 'Pioneered structural tent safety standards and high-capacity concert staging across the region. Has orchestrated state galas, mega festivals, and high-profile luxury weddings.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Valerie K. Sserwadda',
    role: 'Head of Event Design & Floral Architecture',
    experience: '12+ Years',
    specialty: 'Luxury Thematic Styling & High-Fashion Wedding Decors',
    bio: 'Master of atmospheric transformation, Valerie combines silk drapery, architectural floral installs, and ambient lighting palettes to produce sensory wonder.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'DJ Ronald "Ronix" Magezi',
    role: 'Head of Sound & Technical Audio Engineer',
    experience: '14+ Years',
    specialty: 'Line Array Acoustic Calibration & Live Disco Mixing',
    bio: 'Former radio sound director turned premier event audio specialist. Ensures crystal clear speech intelligibility and bone-shaking party bass without distortion.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Gerald "MC Gerald" Tumusiime',
    role: 'Lead Master of Ceremonies & Host',
    experience: '10+ Years',
    specialty: 'Corporate Protocol & High-Energy Reception Hosting',
    bio: 'Charismatic, witty, and effortlessly fluent in English and Swahili. Known for keeping presidential dinners dignified and wedding dance floors packed.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  }
];

export const AVAILABLE_ADDONS = [
  { id: 'gen-100', name: '100kVA Silent Diesel Generator (Fuel & Operator included)', price: 350, unit: 'per day' },
  { id: 'gen-50', name: '50kVA Backup Generator (Fuel & Operator)', price: 220, unit: 'per day' },
  { id: 'toilet-2bay', name: 'VIP 2-Bay Luxury Mobile Restroom with Attendant', price: 350, unit: 'per day' },
  { id: 'toilet-4bay', name: 'Executive 4-Bay Luxury Restroom Trailer with Attendant', price: 450, unit: 'per day' },
  { id: 'dry-ice', name: 'Dancing on Clouds (Heavy Low-Fog Effect for 1st Dance)', price: 150, unit: 'per session' },
  { id: 'sparkular', name: 'Indoor Cold Spark Fireworks (4 Firing Heads)', price: 200, unit: 'per setup' },
  { id: 'red-carpet', name: 'VIP Red Carpet Walkway with Stanchions & Velvet Ropes', price: 120, unit: 'per event' },
  { id: 'led-dancefloor', name: '3D Infinity Mirror / LED Interactive Dancefloor (5m x 5m)', price: 450, unit: 'per night' },
  { id: 'rigging-crew', name: 'Dedicated On-Site SBL Rigging & Technical Standby Crew', price: 250, unit: 'per day' }
];

export const INITIAL_ADMIN_USERS = [
  {
    id: 'admin-major-1000',
    userId: 'sbl 1000',
    name: 'Major Admin (SBL General Director)',
    email: 'director@sblevents.com',
    phone: '+256 702 445 890',
    password: '123',
    role: 'major_admin' as const,
    roleTitle: 'Major Admin (Superuser)',
    isMajorAdmin: true,
    active: true,
    permissions: {
      canManageBookings: true,
      canManageSubAdmins: true,
      canManageCalendar: true,
      canManageInventory: true,
      canManageTestimonials: true,
      canManageFinances: true,
      canManageSettings: true,
    },
    createdAt: '2026-01-01',
    lastLogin: '2026-08-18 09:30'
  },
  {
    id: 'admin-sub-1001',
    userId: 'sbl 1001',
    name: 'David Otim',
    email: 'david.otim@sblevents.com',
    phone: '+256 772 100 101',
    password: '123',
    role: 'operations_manager' as const,
    roleTitle: 'Operations & Fleet Dispatch Manager',
    isMajorAdmin: false,
    active: true,
    permissions: {
      canManageBookings: true,
      canManageSubAdmins: false,
      canManageCalendar: true,
      canManageInventory: true,
      canManageTestimonials: true,
      canManageFinances: false,
      canManageSettings: false,
    },
    createdAt: '2026-02-15',
    lastLogin: '2026-08-17 16:45'
  },
  {
    id: 'admin-sub-1002',
    userId: 'sbl 1002',
    name: 'Sarah Nakato',
    email: 'sarah.nakato@sblevents.com',
    phone: '+256 782 200 202',
    password: '123',
    role: 'booking_coordinator' as const,
    roleTitle: 'Senior Client Booking & Inquiries Coordinator',
    isMajorAdmin: false,
    active: true,
    permissions: {
      canManageBookings: true,
      canManageSubAdmins: false,
      canManageCalendar: true,
      canManageInventory: false,
      canManageTestimonials: true,
      canManageFinances: false,
      canManageSettings: false,
    },
    createdAt: '2026-03-01',
    lastLogin: '2026-08-18 08:15'
  },
  {
    id: 'admin-sub-1003',
    userId: 'sbl 1003',
    name: 'Brian Ssenkungu',
    email: 'brian.audio@sblevents.com',
    phone: '+256 701 300 303',
    password: '123',
    role: 'av_sound_engineer' as const,
    roleTitle: 'Lead Audio, Lighting & LED Wall Engineer',
    isMajorAdmin: false,
    active: true,
    permissions: {
      canManageBookings: true,
      canManageSubAdmins: false,
      canManageCalendar: true,
      canManageInventory: true,
      canManageTestimonials: false,
      canManageFinances: false,
      canManageSettings: false,
    },
    createdAt: '2026-03-10',
    lastLogin: '2026-08-16 11:20'
  },
  {
    id: 'admin-sub-1004',
    userId: 'sbl 1004',
    name: 'Grace Kigozi',
    email: 'grace.rigging@sblevents.com',
    phone: '+256 752 400 404',
    password: '123',
    role: 'tent_rigging_lead' as const,
    roleTitle: 'Mega Marquee & Stage Rigging Supervisor',
    isMajorAdmin: false,
    active: true,
    permissions: {
      canManageBookings: true,
      canManageSubAdmins: false,
      canManageCalendar: true,
      canManageInventory: true,
      canManageTestimonials: false,
      canManageFinances: false,
      canManageSettings: false,
    },
    createdAt: '2026-04-05',
    lastLogin: '2026-08-15 14:10'
  }
];

export const COMPANY_CONTACT_INFO = {
  name: 'SBL Events Production & Rental Co.',
  tagline: 'Excellence in Event Production, Mega Tents, Lighting & Audio Engineering',
  phone: '+256 702 445 890',
  phoneAlt: '+256 772 311 908',
  whatsapp: '+256702445890',
  whatsappDisplay: '+256 702 445 890',
  email: 'info@sblevents.com',
  bookingsEmail: 'bookings@sblevents.com',
  b2bEmail: 'rentals@sblevents.com',
  address: 'Plot 48, SBL Industrial Complex, Jinja Road, Kampala, Uganda',
  hours: 'Monday – Saturday: 7:30 AM – 8:00 PM | 24/7 Event Technical Dispatch Support',
  emergencyLine: '+256 700 999 111 (24/7 Event Emergency Hotline)'
};
