import { Service, CalendarEvent, Testimonial, GalleryItem, InventoryItem, TeamMember, CallbackRequest, VideoReel, EventCategoryItem, ActivityLog } from '../types';
import kwanjulaRoyalStageImg from '../assets/images/kwanjula_royal_stage_1787463864885.jpg';
import sblMegaTentImg from '../assets/images/sbl_mega_tent_1787463878262.jpg';
import sblLedScreenImg from '../assets/images/sbl_led_screen_1787463891580.jpg';
import sblBridalDecorImg from '../assets/images/sbl_bridal_decor_1787463904784.jpg';
import eventsCalendarBannerImg from '../assets/images/events_calendar_banner_1788000976771.jpg';
import sblHallStageStockImg from '../assets/images/sbl_hall_stage_stock_1788000989414.jpg';
import sblAboutGardenLightsImg from '../assets/images/sbl_about_garden_lights_1788001002948.jpg';
import sblStageBlueTrussImg from '../assets/images/sbl_stage_blue_truss_1788001016044.jpg';
import sblBusinessCardImg from '../assets/images/sbl_business_card_1788001035817.jpg';
import bookingBannerBgImg from '../assets/images/booking_banner_bg_1788001658523.jpg';
import testimonialsBannerBgImg from '../assets/images/testimonials_banner_bg_1788001678245.jpg';
import galleryShowcaseBannerBgImg from '../assets/images/gallery_showcase_banner_bg_1788001694409.jpg';
import sblWeddingCoupleLogoImg from '../assets/images/sbl_wedding_couple_logo_1788335701538.jpg';

const weddingVipGlassLoungeImg = sblBridalDecorImg;
const intelligentLightingShowcaseImg = sblAboutGardenLightsImg;

export {
  kwanjulaRoyalStageImg,
  sblMegaTentImg,
  sblLedScreenImg,
  sblBridalDecorImg,
  eventsCalendarBannerImg,
  sblHallStageStockImg,
  sblAboutGardenLightsImg,
  sblStageBlueTrussImg,
  sblBusinessCardImg,
  bookingBannerBgImg,
  testimonialsBannerBgImg,
  galleryShowcaseBannerBgImg,
  weddingVipGlassLoungeImg,
  intelligentLightingShowcaseImg,
  sblWeddingCoupleLogoImg
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'mega-tents',
    title: 'Mega Tents & Alpine Marquees',
    tagline: 'Engineered high-capacity architectural shelter for 100 to 5,000+ guests',
    category: 'tents',
    shortDesc: 'Premium European-standard clear-span marquees, high-peak alpine tents, and transparent glass dome structures with certified storm anchoring.',
    fullDesc: 'SBL Events operates the region’s premier fleet of modular mega tents. Built with anodized structural aluminium and heavy-duty flame-retardant, UV-proof PVC membranes, our tents create breathtaking venues anywhere from rolling green lawns to paved urban plazas. Includes options for cassette flooring, crystal chandeliers, glass walling, and climate control.',
    image: sblMegaTentImg,
    galleryImages: [
      sblMegaTentImg,
      kwanjulaRoyalStageImg,
      sblBridalDecorImg
    ],
    basePrice: 4500000,
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
        description: 'Ideal for intimate garden weddings and private banquets.',
        features: ['15m x 20m Alpine Structure', 'Waterproof White Canvas', 'Standard Perimeter Draping', 'Ground Pegging & Basic Setup']
      },
      {
        name: 'Grand Marquee Royal (600 Guests)',
        popular: true,
        description: 'Our most popular choice for grand luxury weddings and corporate galas.',
        features: ['20m x 40m Clear-Span Marquee', 'Silk Pleated Roof Lining', 'Cassette Timber Flooring', 'Full Concrete Ballast Anchors', 'LED Perimeter Mood Wash']
      },
      {
        name: 'Imperial Mega Dome (1,500+ Guests)',
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
    image: sblStageBlueTrussImg,
    galleryImages: [
      sblStageBlueTrussImg,
      kwanjulaRoyalStageImg,
      sblLedScreenImg
    ],
    basePrice: 2500000,
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
    image: sblLedScreenImg,
    galleryImages: [
      sblLedScreenImg,
      kwanjulaRoyalStageImg
    ],
    basePrice: 1800000,
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
    image: sblLedScreenImg,
    galleryImages: [
      sblLedScreenImg,
      kwanjulaRoyalStageImg
    ],
    basePrice: 3000000,
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
    image: sblLedScreenImg,
    galleryImages: [
      sblLedScreenImg,
      kwanjulaRoyalStageImg
    ],
    basePrice: 2000000,
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
    image: kwanjulaRoyalStageImg,
    galleryImages: [
      kwanjulaRoyalStageImg
    ],
    basePrice: 1500000,
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
    image: sblBridalDecorImg,
    galleryImages: [
      sblBridalDecorImg,
      kwanjulaRoyalStageImg,
      sblMegaTentImg
    ],
    basePrice: 2800000,
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
    image: sblMegaTentImg,
    galleryImages: [
      sblMegaTentImg,
      kwanjulaRoyalStageImg
    ],
    basePrice: 3500000,
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
    image: sblMegaTentImg,
    galleryImages: [
      sblMegaTentImg,
      sblBridalDecorImg
    ],
    basePrice: 1200000,
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
    image: sblMegaTentImg,
    galleryImages: [
      sblMegaTentImg,
      kwanjulaRoyalStageImg
    ],
    basePrice: 1600000,
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
    content: 'SBL Events made our wedding in Uganda look majestic! The 20m x 40m clear-roof marquee lit up in gold uplighting with the low-lying cloud smoke during our first dance left everyone speechless. The sound was crystal clear and the luxury mobile toilets felt like a 5-star hotel.',
    rating: 5,
    date: 'July 2026',
    avatarIcon: 'heart',
    avatarBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
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
    content: 'Flawless execution! When organizing an event for 1,200 regional executives and dignitaries, failure is not an option. SBL provided high-nits LED screens, seamless live camera switching, pristine audio with zero feedback, and their senior MC handled diplomatic protocol brilliantly.',
    rating: 5,
    date: 'June 2026',
    avatarIcon: 'building',
    avatarBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
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
    content: 'As an event planner in Uganda, SBL Events is my most reliable partner. Whenever my inventory runs short or I need an expansive 1,000-seater alpine marquee, their B2B tent lending and staging service in Lwengo delivers on time without stress. Their rigging crew is fast and disciplined.',
    rating: 5,
    date: 'August 2026',
    avatarIcon: 'sparkles',
    avatarBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
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
    avatarIcon: 'music',
    avatarBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    eventType: 'concert_festival',
    verified: true,
    approved: true,
    featured: true
  },
  {
    id: 'test-5',
    author: 'Hajjat Fatuma & Dr. Sulaiman',
    role: 'Parents of the Bride',
    companyOrEvent: 'Royal Traditional Kwanjula Ceremony (800 Guests)',
    content: 'We are so grateful to the entire SBL Events team for the magnificent traditional Kwanjula in Masaka! The royal golden arch gazebos, plush VIP sweetheart chairs, and immaculate sound setup made our daughter’s introduction unforgettable. Every guest was praising the beauty and organization.',
    rating: 5,
    date: 'August 2026',
    avatarIcon: 'heart',
    avatarBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    eventType: 'wedding',
    verified: true,
    approved: true,
    featured: true
  },
  {
    id: 'test-6',
    author: 'Patrick Otim',
    role: 'National Logistics Lead',
    companyOrEvent: 'All-Africa Agri-Business Expo & Conference',
    content: 'SBL delivered three synchronized 100kVA backup generators, 30m modular clear-span marquees with cassette wooden flooring, and heavy-duty AC units across four non-stop days. Zero power interruption and flawless technical coordination.',
    rating: 5,
    date: 'July 2026',
    avatarIcon: 'building',
    avatarBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    eventType: 'corporate',
    verified: true,
    approved: true,
    featured: true
  }
];

export const INITIAL_CALLBACK_REQUESTS: CallbackRequest[] = [
  {
    id: 'cb-1',
    clientName: 'Hon. Patrick Ssemwogerere',
    phone: '0752420911',
    eventInterest: 'Mega Marquee & Sound for 1,000 Guests Wedding in Masaka',
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
    notes: 'Requested a site visit to assess terrain for clear-span marquee and 100kVA backup generator.',
    status: 'pending',
    createdAt: '2026-08-18 16:45'
  },
  {
    id: 'cb-2',
    clientName: 'Nassuna Gloria (Events By Glo)',
    phone: '0702112233',
    eventInterest: 'B2B Sub-Rental: 2 Units 15x30m Alpine Tents + Stage',
    preferredTime: 'Immediate WhatsApp / Call',
    notes: 'Urgent rental for weekend corporate launch in Mbarara.',
    status: 'pending',
    createdAt: '2026-08-19 09:10'
  },
  {
    id: 'cb-3',
    clientName: 'Dr. Ronald Mukasa',
    phone: '0772889900',
    eventInterest: 'Sound & LED Screen for Medical Conference',
    preferredTime: 'Afternoon (2:00 PM)',
    notes: 'Followed up and sent quotation. Converted to booking inquiry.',
    status: 'called',
    createdAt: '2026-08-17 11:20'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bkg-101',
    referenceNumber: 'SBL-2026-8812',
    clientName: 'Dr. Sarah Kigozi',
    email: 'najibshafiq@sblevents.com',
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
      { id: 'gen-100', name: '100kVA Backup Silent Generator', price: 1200000, quantity: 1 },
      { id: 'wc-vip', name: 'VIP 2-Bay Luxury Restroom Trailer', price: 1200000, quantity: 2 }
    ],
    customRequests: 'Include branding logo monogram projected on tent roof. VIP red carpet entrance required.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '20m x 30m Clear-Span Marquee',
    lightingStyle: 'Corporate Blue & Warm Gold Theme',
    estimatedTotal: 14900000,
    amountPaid: 8000000,
    balanceDue: 6900000,
    paymentStatus: 'deposit_paid' as const,
    paymentDueDate: '2026-09-01',
    lastReminderSentAt: '2026-08-25',
    status: 'confirmed' as const,
    createdAt: '2026-08-10',
    notes: 'Advance deposit paid. Site visit completed on Aug 12.'
  },
  {
    id: 'bkg-102',
    referenceNumber: 'SBL-2026-8845',
    clientName: 'Kenneth & Anita Businge',
    email: 'najibshafiq@sblevents.com',
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
      { id: 'dry-ice', name: 'Dancing on Clouds (Low-Fog Effect)', price: 550000, quantity: 1 },
      { id: 'sparkular', name: 'Indoor Cold Spark Fireworks (4 Units)', price: 750000, quantity: 1 }
    ],
    customRequests: 'Emerald green and champagne gold decor palette. High-peak alpine tent with fairy light canopy.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '20m x 40m Alpine Marquee',
    lightingStyle: 'Romantic Warm Amber & Fairy Light Glow',
    estimatedTotal: 18450000,
    amountPaid: 5000000,
    balanceDue: 13450000,
    paymentStatus: 'deposit_paid' as const,
    paymentDueDate: '2026-09-12',
    status: 'pending' as const,
    createdAt: '2026-08-15',
    notes: 'Awaiting final balance clearance and contract sign-off.'
  },
  {
    id: 'bkg-103',
    referenceNumber: 'SBL-2026-8790',
    clientName: 'Pulse Events Ltd (Patrick O.)',
    email: 'najibshafiq@sblevents.com',
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
      { id: 'riggers', name: 'Certified SBL Rigging Crew (4 Pax)', price: 900000, quantity: 1 }
    ],
    customRequests: 'B2B Equipment Sub-Rental: 30m x 50m Modular Marquee + 12m x 8m Box Truss Stage with roof canopy.',
    powerRequirement: 'venue_power_available' as const,
    tentSizeNeeded: '30m x 50m Modular Marquee',
    estimatedTotal: 14500000,
    amountPaid: 14500000,
    balanceDue: 0,
    paymentStatus: 'fully_paid' as const,
    paymentDueDate: '2026-08-25',
    status: 'confirmed' as const,
    createdAt: '2026-08-04',
    notes: 'Fully settled in advance. Truck logistics scheduled.'
  },
  {
    id: 'bkg-104',
    referenceNumber: 'SBL-2026-8910',
    clientName: 'Mukasa & Flavia Kwanjula',
    email: 'najibshafiq@sblevents.com',
    phone: '+256 782 554 123',
    eventType: 'wedding' as const,
    eventDate: '2026-09-26',
    endDate: '2026-09-26',
    durationDays: 1,
    location: 'Masaka Golf Lane Gardens',
    venueType: 'outdoor_grass' as const,
    guestCount: 400,
    selectedServices: ['mega-tents', 'luxury-decoration', 'intelligent-lighting', 'mobile-toilets'],
    addons: [],
    customRequests: 'Traditional Kwanjula gazebos and royal dais with red/gold theme. Needs 50kVA generator standby.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '20m x 30m Hexagonal Marquee',
    estimatedTotal: 12800000,
    amountPaid: 0,
    balanceDue: 12800000,
    paymentStatus: 'unpaid' as const,
    paymentDueDate: '2026-09-10',
    status: 'pending' as const,
    createdAt: '2026-08-20',
    notes: 'Invoice issued. Client requested payment reminder via email.'
  },
  {
    id: 'bkg-105',
    referenceNumber: 'SBL-2026-8955',
    clientName: 'Stanbic Bank Masaka Regional Gala',
    email: 'najibshafiq@sblevents.com',
    phone: '+256 701 998 443',
    companyName: 'Stanbic Bank Uganda',
    eventType: 'corporate' as const,
    eventDate: '2026-10-05',
    endDate: '2026-10-05',
    durationDays: 1,
    location: 'Masaka Recreation Grounds',
    venueType: 'outdoor_grass' as const,
    guestCount: 800,
    selectedServices: ['mega-tents', 'led-screens', 'intelligent-lighting', 'mobile-disco-sound', 'mobile-toilets'],
    addons: [
      { id: 'gen-150', name: '150kVA Heavy Duty Cummins Generator', price: 1800000, quantity: 1 }
    ],
    customRequests: '360 indoor trussing, high-definition P2.9 video wall, executive air-conditioned VIP restrooms.',
    powerRequirement: 'generator_needed' as const,
    tentSizeNeeded: '25m x 45m Clear-Span Marquee',
    estimatedTotal: 24500000,
    amountPaid: 10000000,
    balanceDue: 14500000,
    paymentStatus: 'overdue' as const,
    paymentDueDate: '2026-08-22',
    lastReminderSentAt: '2026-08-24',
    status: 'confirmed' as const,
    createdAt: '2026-08-01',
    notes: 'Partial 10M deposit received. Final payment overdue.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-real-1',
    title: 'Angel & Henry Royal Kwanjula Luxury Stage & Mega Decor',
    clientName: 'Angel & Henry',
    category: 'weddings',
    image: kwanjulaRoyalStageImg,
    location: 'Masaka Central VIP Grounds',
    date: 'August 2026',
    attendees: '1,200 VIP Guests',
    description: 'SBL Events signature grand setup: Royal multi-arch stage backdrop with illuminated cloud murals, tiered crystal chandeliers, delicate lilac & white silk drapery waves, P2.6 ultra-HD video backdrop screen, custom gold sweetheart bridal sofa, illuminated acrylic cake table, and line array mobile disco sound.',
    servicesProvided: ['Mega Tents', 'Luxury Decoration', 'LED Screens', 'Intelligent Lighting', 'Mobile Disco Sound', 'Air Conditioning Units'],
    isFeaturedRealSetup: true,
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://www.tiktok.com/@sblofficial92',
    badge: 'Real Client Showcase • Masaka',
    postedBy: 'Major Admin'
  },
  {
    id: 'gal-real-2',
    title: 'SBL Imperial Clear-Span Mega Tent & AC Ballroom',
    clientName: 'Grand Jubilee Reception',
    category: 'tents',
    image: sblMegaTentImg,
    location: 'Masaka / Lwengo Production Hub Showcase',
    date: 'August 2026',
    attendees: '1,800 Attendees',
    description: 'The premier European-standard modular Mega Tent imported directly from China by SBL Events ("Empologoma ya Bannamasaka"). Featuring high-clearance architectural aluminium framework, integrated ducted AC air-conditioning, full wooden cassette floor decking, crystal candelabra centerpieces, and curved bridal tables.',
    servicesProvided: ['Clear-Span Mega Tents', 'Cassette Timber Flooring', 'AC Climate Control', 'Intelligent Lighting', 'B2B Equipment Sub-Rental'],
    isFeaturedRealSetup: true,
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://www.tiktok.com/@sblofficial92',
    badge: 'New Mega Tent Fleet',
    postedBy: 'David Otim (Operations)'
  },
  {
    id: 'gal-real-3',
    title: 'High-Definition LED Video Screen & Disco Stage',
    clientName: 'Dr. Ronald & Phiona Wedding Banquet',
    category: 'weddings',
    image: sblLedScreenImg,
    location: 'Central Uganda Luxury Garden Hall',
    date: 'August 2026',
    attendees: '950 Attendees',
    description: 'Modular high-definition P2.6/P3.9 indoor & outdoor LED video screens deployed as dynamic stage backdrop. Integrated with live IMAG multi-camera feeds, computerized DMX beam moving heads, starburst ceiling chandeliers, and crystal centerpiece lighting (Hotline: 0752.420911).',
    servicesProvided: ['LED Screens', 'Intelligent Lighting', 'Mobile Disco & DJ', 'Stage Rigging'],
    isFeaturedRealSetup: true,
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://www.tiktok.com/@sblofficial92',
    badge: 'LED Screen Rental',
    postedBy: 'Brian Ssenkungu (AV Lead)'
  },
  {
    id: 'gal-real-4',
    title: 'Luxury Banqueting Ballroom & Curved Sweetheart Tables',
    clientName: 'Nassolo & Timothy Introduction & Banquet',
    category: 'weddings',
    image: sblBridalDecorImg,
    location: 'Lwengo Grand Reception Hall',
    date: 'August 2026',
    attendees: '800 Guests',
    description: 'Exquisite pastel rose, peach, and lavender theme with curved acrylic bridal tables, royal gold Queen chairs, sparkling crystal candelabras, ceiling silk pelmets, and whisper-quiet mobile air conditioning units for full hall thermal comfort.',
    servicesProvided: ['Luxury Decoration', 'Furniture & Seating', 'AC Climate Units', 'Mobile Restrooms'],
    isFeaturedRealSetup: true,
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://www.tiktok.com/@sblofficial92',
    badge: 'Luxury Styling',
    postedBy: 'Major Admin'
  },
  {
    id: 'gal-real-5',
    title: 'Silver Jubilee National Diplomatic Gala & Stage',
    clientName: 'Diplomatic Protocol & Trade Office',
    category: 'corporate',
    image: sblMegaTentImg,
    location: 'Diplomatic Grounds, Kampala',
    date: 'July 2026',
    attendees: '1,400 Delegates',
    description: 'Full-scale turnkey production for international trade summit: 30m clear-span marquee dome with VIP carpeted decking, dual 100kVA Cummins generator synchronization, P2.6 ultra-wide curved screen, and broadcast-grade audio switching.',
    servicesProvided: ['Mega Marquees', '100kVA Generators', 'LED Screens', 'Line Array Audio', 'VIP Restrooms'],
    isFeaturedRealSetup: true,
    badge: 'State Gala',
    postedBy: 'Major Admin'
  },
  {
    id: 'gal-real-6',
    title: 'Moonlit Lakeside Live Music Festival Mainstage',
    clientName: 'Afro-Vibe Music Festival',
    category: 'concerts',
    image: kwanjulaRoyalStageImg,
    location: 'Speke Resort Lakeside Grounds',
    date: 'June 2026',
    attendees: '4,500 Festival Fans',
    description: 'Concert staging with heavy aluminium ground-support box truss, 380W beam moving heads, 40kW active line array audio, synchronized cold pyrotechnics, and dancing on clouds low-fog effects.',
    servicesProvided: ['Box Truss Stage', 'Line Array Sound', 'Moving Beams', 'Cold Spark Pyros', 'Mega Tents'],
    isFeaturedRealSetup: true,
    badge: 'Festival Production',
    postedBy: 'Brian Ssenkungu (AV Lead)'
  }
];

export const VIDEO_REELS: VideoReel[] = [
  {
    id: 'reel-1',
    title: 'SBL Mega Tent Setup & AC Ballroom Showcase',
    description: 'Walkthrough of SBL Events’ newly imported modular Mega Marquee in Masaka ("Empologoma ya Bannamasaka"). Showcasing high-peak clear-span framework, ducted AC climate control, and luxury silk pelmet drapery.',
    category: 'megatent',
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
    hotline: '0752.420911',
    thumbnail: sblMegaTentImg,
    badge: 'Mega Tent Fleet',
    duration: '0:48',
    viewsCount: '18.4K Views',
    location: 'Masaka & Lwengo Dispatch',
    equipmentHighlights: ['Aluminium Clear-Span Marquee', 'Ducted Air Conditioning Units', 'Silk Pleated Ceiling Waves', 'Cassette Wooden Flooring'],
    audioTranscriptNotes: 'Luganda Audio: "Wema zino ze tuyita Mega Tent, SBL empologoma ya bannamasaka... ezivudde obutereevu e China nga Maria’s Cargo yazitika ne zituuka e Uganda... SBL twagala okwebaza."',
    ugxEstimate: 6500000
  },
  {
    id: 'reel-2',
    title: 'Angel & Henry Royal Kwanjula Grand Stage',
    description: 'Complete stage and venue transformation for Angel & Henry’s luxury introduction ceremony: illuminated backdrop arches, P2.6 LED screen, tiered crystal chandeliers, and pink/lilac floral installations.',
    category: 'weddings',
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
    hotline: '0752.420911',
    thumbnail: kwanjulaRoyalStageImg,
    badge: 'Royal Stage Decor',
    duration: '0:55',
    viewsCount: '24.2K Views',
    location: 'Masaka VIP Event',
    equipmentHighlights: ['Multi-Tier Royal Arch Backdrop', 'P2.6 LED Video Screen', 'Tiered Crystal Chandeliers', 'Custom Gold Sweetheart Sofa'],
    audioTranscriptNotes: 'Luganda Audio: "Angel Introduces Henry — SBL Events Masaka mwebale mukutakati... Buli akiraba ku TikTok ne social media platforms... Disco enungi ey’omulembe, AC enungi, na zino screen empya."',
    ugxEstimate: 8500000
  },
  {
    id: 'reel-3',
    title: 'Ultra-Bright LED Video Screens Demo & Hire',
    description: 'High-definition modular P2.6 / P3.9 LED screen panels in action during a live reception, displaying crisp motion graphics, ambient visuals, and live camera relay.',
    category: 'screens',
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
    hotline: '0752.420911',
    thumbnail: sblLedScreenImg,
    badge: 'Screens Available',
    duration: '0:35',
    viewsCount: '12.8K Views',
    location: 'Available Across Uganda',
    equipmentHighlights: ['P2.6 & P3.9 High-Nits Panels', 'Novastar 4K Processors', 'Live Multi-Camera Switcher', 'Custom Ground-Stacking Rig'],
    audioTranscriptNotes: 'Live Display: "Screens Available 0752.420911 — SBL Events Official @sblofficial92 — Masaka, Lwengo, Kampala & Nationwide."',
    ugxEstimate: 3000000
  },
  {
    id: 'reel-4',
    title: 'Mobile Disco, DMX Moving Beams & Sound Check',
    description: 'Intelligent beam lighting programming with computerized moving heads, low-fog dry ice clouds, and crystal-clear DB Technologies line array audio coverage.',
    category: 'lighting',
    tiktokHandle: '@sblofficial92',
    tiktokUrl: 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
    hotline: '0752.420911',
    thumbnail: sblBridalDecorImg,
    badge: 'Disco & Sound Rig',
    duration: '0:42',
    viewsCount: '15.6K Views',
    location: 'Event Venue Staging',
    equipmentHighlights: ['380W Beam Moving Heads', 'Low-Lying Fog Cloud Machine', 'Line Array Audio Towers', 'Wireless DMX Controllers'],
    audioTranscriptNotes: 'Live Rig: "SBL Sound & Disco Rigging in action — crisp audio with zero feedback, synchronized moving beams, and dancing on clouds."',
    ugxEstimate: 2800000
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
    dailyRate: 6500000,
    specs: 'Heavy aluminium frame, 850g/m² blackout/clear PVC, 100km/h wind rating',
    image: sblMegaTentImg,
    b2bEligible: true
  },
  {
    id: 'inv-2',
    name: 'P2.6 / P3.9 Ultra-HD Modular LED Panels (500x500mm)',
    category: 'Video & Screens',
    totalQuantity: 180,
    availableQuantity: 120,
    unit: 'Panels',
    dailyRate: 55000,
    specs: 'Novastar 4K processing, 5,500 nits daylight readable, 3840Hz refresh',
    image: sblLedScreenImg,
    b2bEligible: true
  },
  {
    id: 'inv-3',
    name: 'DB Technologies DVA T8 Active Line Array Modules',
    category: 'Audio & Sound',
    totalQuantity: 24,
    availableQuantity: 16,
    unit: 'Speakers',
    dailyRate: 150000,
    specs: '700W RMS 3-way active line array module with DSP control',
    image: sblLedScreenImg,
    b2bEligible: true
  },
  {
    id: 'inv-4',
    name: '400mm Aluminium Box Trussing (3-meter Sections)',
    category: 'Staging & Truss',
    totalQuantity: 80,
    availableQuantity: 52,
    unit: 'Lengths',
    dailyRate: 75000,
    specs: 'TUV certified structural load alloy 6082-T6 with quick-lock pins',
    image: sblStageBlueTrussImg,
    b2bEligible: true
  },
  {
    id: 'inv-5',
    name: 'VIP Executive 4-Bay Mobile Restroom Trailer',
    category: 'Restrooms & Sanitation',
    totalQuantity: 5,
    availableQuantity: 3,
    unit: 'Trailers',
    dailyRate: 1600000,
    specs: 'Air-conditioned, hot/cold vanity, porcelain flushing bowls, stereo music',
    image: sblMegaTentImg,
    b2bEligible: true
  },
  {
    id: 'inv-6',
    name: '100kVA Cummins Silent Diesel Generator',
    category: 'Power & Logistics',
    totalQuantity: 4,
    availableQuantity: 3,
    unit: 'Generators',
    dailyRate: 1200000,
    specs: 'Soundproof canopy <65dB at 7m, 3-phase 415V distribution board with ATS',
    image: sblMegaTentImg,
    b2bEligible: true
  },
  {
    id: 'inv-7',
    name: '380W BSW Beam/Spot/Wash Moving Head Lights',
    category: 'Lighting & FX',
    totalQuantity: 48,
    availableQuantity: 32,
    unit: 'Fixtures',
    dailyRate: 90000,
    specs: 'DMX512, rotating 8+16 facet prism, 14 color filters, frost filter',
    image: sblLedScreenImg,
    b2bEligible: true
  },
  {
    id: 'inv-8',
    name: 'Gold Phoenix & Dior Luxury Banquet Chairs',
    category: 'Decoration & Seating',
    totalQuantity: 2500,
    availableQuantity: 1800,
    unit: 'Chairs',
    dailyRate: 6000,
    specs: 'High-density polycarbonate with plush velvet padded cushions',
    image: sblHallStageStockImg,
    b2bEligible: true
  },
  {
    id: 'inv-9',
    name: 'Ducted Mobile Air Conditioning & Climate Units (50kW)',
    category: 'Tents & Structures',
    totalQuantity: 8,
    availableQuantity: 6,
    unit: 'AC Units',
    dailyRate: 950000,
    specs: 'High-capacity cooling for mega marquees with insulated fabric ducts and silent compressors',
    image: sblMegaTentImg,
    b2bEligible: true
  },
  {
    id: 'inv-10',
    name: 'Heavy-Duty Layer Concert Stage Platforms (2m x 1m Modules)',
    category: 'Staging & Truss',
    totalQuantity: 60,
    availableQuantity: 42,
    unit: 'Decks',
    dailyRate: 60000,
    specs: 'Anti-slip water-resistant phenolic surface with adjustable telescopic legs (0.6m - 1.8m)',
    image: sblStageBlueTrussImg,
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
    image: sblMegaTentImg
  },
  {
    name: 'Valerie K. Sserwadda',
    role: 'Head of Event Design & Floral Architecture',
    experience: '12+ Years',
    specialty: 'Luxury Thematic Styling & High-Fashion Wedding Decors',
    bio: 'Master of atmospheric transformation, Valerie combines silk drapery, architectural floral installs, and ambient lighting palettes to produce sensory wonder.',
    image: sblBridalDecorImg
  },
  {
    name: 'DJ Ronald "Ronix" Magezi',
    role: 'Head of Sound & Technical Audio Engineer',
    experience: '14+ Years',
    specialty: 'Line Array Acoustic Calibration & Live Disco Mixing',
    bio: 'Former radio sound director turned premier event audio specialist. Ensures crystal clear speech intelligibility and bone-shaking party bass without distortion.',
    image: sblLedScreenImg
  },
  {
    name: 'Gerald "MC Gerald" Tumusiime',
    role: 'Lead Master of Ceremonies & Host',
    experience: '10+ Years',
    specialty: 'Corporate Protocol & High-Energy Reception Hosting',
    bio: 'Charismatic, witty, and effortlessly fluent in English and Swahili. Known for keeping presidential dinners dignified and wedding dance floors packed.',
    image: kwanjulaRoyalStageImg
  }
];

export const AVAILABLE_ADDONS = [
  { id: 'gen-100', name: '100kVA Silent Diesel Generator (Fuel & Operator included)', price: 1200000, unit: 'per day' },
  { id: 'gen-50', name: '50kVA Backup Generator (Fuel & Operator)', price: 800000, unit: 'per day' },
  { id: 'toilet-2bay', name: 'VIP 2-Bay Luxury Mobile Restroom with Attendant', price: 1200000, unit: 'per day' },
  { id: 'toilet-4bay', name: 'Executive 4-Bay Luxury Restroom Trailer with Attendant', price: 1600000, unit: 'per day' },
  { id: 'dry-ice', name: 'Dancing on Clouds (Heavy Low-Fog Effect for 1st Dance)', price: 550000, unit: 'per session' },
  { id: 'sparkular', name: 'Indoor Cold Spark Fireworks (4 Firing Heads)', price: 750000, unit: 'per setup' },
  { id: 'red-carpet', name: 'VIP Red Carpet Walkway with Stanchions & Velvet Ropes', price: 450000, unit: 'per event' },
  { id: 'led-dancefloor', name: '3D Infinity Mirror / LED Interactive Dancefloor (5m x 5m)', price: 1500000, unit: 'per night' },
  { id: 'rigging-crew', name: 'Dedicated On-Site SBL Rigging & Technical Standby Crew', price: 900000, unit: 'per day' }
];

export interface CountdownCampaign {
  id: string;
  badge: string;
  badgeType: 'promo' | 'showcase' | 'festival';
  title: string;
  subtitle: string;
  targetDate: string; // Target milestone date ISO or future date string
  discountLabel?: string;
  discountValue?: string;
  slotsLeft?: number;
  highlightText: string;
  perks: string[];
  ctaText: string;
  actionType: 'book' | 'calendar' | 'whatsapp';
}

export const COUNTDOWN_CAMPAIGNS: CountdownCampaign[] = [
  {
    id: 'seasonal-wedding-promo',
    badge: 'Limited Seasonal Promotion',
    badgeType: 'promo',
    title: 'Festive & Peak Wedding Season Early Reservation Offer',
    subtitle: 'Lock in guaranteed dates for late 2026 / 2027 weddings across Uganda with special promotional pricing & bonus technical perks.',
    targetDate: '2026-09-05T23:59:59',
    discountLabel: 'Save Up To',
    discountValue: 'UGX 2,500,000',
    slotsLeft: 4,
    highlightText: '15% OFF Mega Marquee Packages + Free Cold Spark Firing & Mood Lighting',
    perks: [
      'Free 4-Unit Cold Spark Fireworks for bridal cake & entry',
      'Complimentary DMX Ambient Uplighting Wash',
      'Free site survey in Lwengo, Masaka, Mbarara & Kampala',
      'Zero cancellation re-booking penalty'
    ],
    ctaText: 'Claim Discount & Reserve Date',
    actionType: 'book'
  },
  {
    id: 'demo-day-expo',
    badge: 'Live Operations Showcase',
    badgeType: 'showcase',
    title: 'SBL Grand Production & Mega Tent Expo 2026',
    subtitle: 'Experience our 30m Clear-Span Dome Marquee, P2.6 Curved LED Wall, and live 40kW Line Array audio demos at the Lwengo central hub.',
    targetDate: '2026-09-25T10:00:00',
    discountLabel: 'Admission',
    discountValue: 'Free RSVP',
    slotsLeft: 28,
    highlightText: 'Live Audio-Visual & Structural Demonstrations + Meet Sound Engineers & MCs',
    perks: [
      'Hands-on walk-through of luxury AC mobile restroom suites',
      'Live DMX light show & dance-on-clouds demo',
      'Exclusive on-site 10% equipment lending voucher',
      'Free one-on-one wedding planner timeline review'
    ],
    ctaText: 'View Showcase on Schedule',
    actionType: 'calendar'
  },
  {
    id: 'afro-fusion-festival',
    badge: 'Major Concert Staging',
    badgeType: 'festival',
    title: 'Afro-Fusion Live Music Festival Staging',
    subtitle: 'SBL Events technical dispatch kick-off: 40kW concert sound, full heavy box-truss festival roofing & 100kVA dual power grid deployment.',
    targetDate: '2026-09-04T14:00:00',
    discountLabel: 'Scale',
    discountValue: '4,500+ Guests',
    slotsLeft: 2,
    highlightText: 'Mainstage Audio-Visual & Ground-Support Staging in Action',
    perks: [
      'P3.9 High-Nits Daylight LED Video Walls',
      '380W Beam Moving Heads & Laser Cannons',
      '100kVA Cummins Silent Generator Synchronized Grid'
    ],
    ctaText: 'Check Event Dispatch Details',
    actionType: 'calendar'
  }
];

export const INITIAL_ADMIN_USERS = [
  {
    id: 'admin-major-1000',
    userId: 'sbl 1000',
    name: 'Major Admin (SBL General Director)',
    email: 'najibshafiq@sblevents.com',
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
    email: 'najibshafiq@sblevents.com',
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
    email: 'najibshafiq@sblevents.com',
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
    email: 'najibshafiq@sblevents.com',
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
    email: 'najibshafiq@sblevents.com',
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
  motto: 'We Design Your Dream',
  tagline: 'We Design Your Dream — Mega Marquees, Stage Rigging, Intelligent Lighting & Sound',
  phone: '0752420911',
  primaryPhone: '0752420911',
  phoneDisplay: '0752.420911',
  phoneAlt: '+256 752 420 911',
  whatsapp: '256752420911',
  whatsappDisplay: '0752 420 911',
  whatsappUrl: 'https://wa.me/256752420911?text=Hello%20SBL%20Events%20Uganda,%20I%20would%20like%20to%20inquire%20about%20your%20Mega%20Tent,%20Stage,%20LED%20Screens%20and%20Sound%20services',
  tiktok: '@sblofficial92',
  tiktokUrl: 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
  email: 'najibshafiq@sblevents.com',
  bookingsEmail: 'najibshafiq@sblevents.com',
  b2bEmail: 'najibshafiq@sblevents.com',
  address: 'SBL Central Production Hub, Lwengo & Masaka, Uganda (Serving Central, Western & Nationwide Uganda)',
  district: 'Masaka & Lwengo, Uganda',
  hours: 'Monday – Saturday: 7:30 AM – 8:00 PM | 24/7 Event Technical Dispatch',
  emergencyLine: '0752.420911 (24/7 Dispatch Hotline)'
};

export const INITIAL_EVENT_CATEGORIES: EventCategoryItem[] = [
  {
    id: 'cat-weddings',
    name: 'Weddings & Kwanjula Introductions',
    slug: 'wedding',
    description: 'High-end royal introductions (Kwanjula), white garden weddings, evening receptions, and bridal luxury dome setups with full silk draping, intelligent ambient illumination, and VIP staging.',
    iconName: 'Heart',
    badge: 'Most Booked (Peak Season)',
    color: 'rose',
    targetScale: '300 - 1,500+ Guests',
    defaultPackageEstimate: 7500000,
    recommendedServices: [
      'Mega Tents & Alpine Marquees',
      'Intelligent Architectural & Mood Lighting',
      'Heavy-Duty Stages & Box Truss Rigging',
      'Concert Line-Array Audio Systems',
      'P2.6 Curved & Flat LED Video Screens',
      'VIP Mobile Restroom Trailers'
    ],
    rentalChecklist: [
      'Clear-span aluminum marquee with crystal chandeliers',
      'Elevated bridal royal gazebo & stage deck',
      'DMX computer beam moving heads & amber wall washes',
      'Heavy low-fog dry ice machine for 1st dance & cold sparks',
      '2-Bay or 4-Bay air-conditioned VIP restroom trailer'
    ],
    active: true,
    order: 1,
    createdAt: '2026-01-01'
  },
  {
    id: 'cat-corporate',
    name: 'Corporate Galas, AGMs & Expos',
    slug: 'corporate',
    description: 'Executive corporate end-of-year dinners, product unveilings, trade fairs, annual general meetings, and presidential protocols requiring seamless acoustic delay and broadcast-grade LED visuals.',
    iconName: 'Building2',
    badge: 'Executive Standard',
    color: 'blue',
    targetScale: '150 - 2,000+ Delegates',
    defaultPackageEstimate: 9800000,
    recommendedServices: [
      'P2.6 Curved & Flat LED Video Screens',
      'Heavy-Duty Stages & Box Truss Rigging',
      'Concert Line-Array Audio Systems',
      '50kW Mobile Climate Control Units'
    ],
    rentalChecklist: [
      'High-resolution P2.6 daylight-readable LED screen wall',
      'Presidential acrylic podium with gooseneck microphones',
      'Acoustic delay speakers for crystal speech intelligibility',
      '100kVA silent dual synchronized diesel generator grid',
      'Modular carpeting and velvet barrier stanchions'
    ],
    active: true,
    order: 2,
    createdAt: '2026-01-05'
  },
  {
    id: 'cat-concerts',
    name: 'Concerts, Festivals & Live Shows',
    slug: 'concert_festival',
    description: 'High-energy live music concerts, youth festivals, stadium tours, and outdoor rallies demanding 40kW+ concert line-array acoustic arrays, laser beam effects, and heavy box-truss festival roofing.',
    iconName: 'Music',
    badge: 'High Wattage Rigging',
    color: 'amber',
    targetScale: '1,000 - 15,000+ Fans',
    defaultPackageEstimate: 14500000,
    recommendedServices: [
      'Concert Line-Array Audio Systems',
      'Heavy-Duty Stages & Box Truss Rigging',
      'Intelligent Architectural & Mood Lighting',
      'P2.6 Curved & Flat LED Video Screens'
    ],
    rentalChecklist: [
      '40kW Turbosound / JBL VTX line-array system with 18" subwoofers',
      'Heavy aluminium curved roof truss with ground-support towers',
      '380W beam moving heads, CO2 cryo jets & flame projectors',
      'P3.9 outdoor weather-sealed IMAG side video walls',
      'High-security crowd barrier barricades and DJ risers'
    ],
    active: true,
    order: 3,
    createdAt: '2026-01-10'
  },
  {
    id: 'cat-cultural',
    name: 'Cultural, Religious & Thanksgiving',
    slug: 'cultural_religious',
    description: 'Massive church crusades, thanksgiving assemblies, cultural clan coronations, and memorial dedications requiring expansive shaded marquees, public address systems, and robust crowd management.',
    iconName: 'Church',
    badge: 'High Capacity',
    color: 'emerald',
    targetScale: '500 - 5,000+ Gatherings',
    defaultPackageEstimate: 5200000,
    recommendedServices: [
      'Mega Tents & Alpine Marquees',
      'Concert Line-Array Audio Systems',
      'Heavy-Duty Stages & Box Truss Rigging'
    ],
    rentalChecklist: [
      'High-peak alpine marquee clusters for wide field coverage',
      'Long-throw horn PA speakers for expansive outdoor voice clarity',
      'Raised altar / elder podium with shade canopy',
      'Backup power generator with automatic transfer switch'
    ],
    active: true,
    order: 4,
    createdAt: '2026-01-15'
  },
  {
    id: 'cat-parties',
    name: 'Private Banquets & Milestone Parties',
    slug: 'private_party',
    description: 'Birthday milestone celebrations, graduation dinners, anniversary galas, and VIP residential garden soirees tailored with intimate canopy structures, dance floors, and club-style lighting.',
    iconName: 'PartyPopper',
    badge: 'Custom Atmosphere',
    color: 'purple',
    targetScale: '50 - 300+ Guests',
    defaultPackageEstimate: 3800000,
    recommendedServices: [
      'Intelligent Architectural & Mood Lighting',
      'Concert Line-Array Audio Systems',
      'VIP Mobile Restroom Trailers'
    ],
    rentalChecklist: [
      '3D infinity mirror interactive LED dance floor',
      'Compact high-output wireless battery uplighting',
      'Pro DJ mixing console & dual wireless handheld mics',
      'Single-bay or 2-bay luxury mobile restroom'
    ],
    active: true,
    order: 5,
    createdAt: '2026-01-20'
  },
  {
    id: 'cat-b2b',
    name: 'B2B Equipment Sub-Rental & Dry Hire',
    slug: 'tent_lending_b2b',
    description: 'Direct wholesale equipment lending and logistics support for fellow event planners, decorators, audio engineers, and tent rental companies across Masaka, Lwengo, Mbarara, and Kampala.',
    iconName: 'Truck',
    badge: 'Wholesale Dry Hire',
    color: 'cyan',
    targetScale: 'B2B Partner Companies',
    defaultPackageEstimate: 2900000,
    recommendedServices: [
      'Mega Tents & Alpine Marquees',
      'Heavy-Duty Stages & Box Truss Rigging',
      '50kW Mobile Climate Control Units',
      'VIP Mobile Restroom Trailers'
    ],
    rentalChecklist: [
      'Modular 10m / 15m / 20m marquee beam arches & purlins',
      '2m x 1m modular aluminium stage decks with telescopic legs',
      '400mm x 400mm certified heavy aluminium box truss sections',
      'Standby SBL certified rigging technician (optional)'
    ],
    active: true,
    order: 6,
    createdAt: '2026-02-01'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-bkg-1',
    category: 'booking_change',
    action: 'BOOKING_CREATED',
    title: 'New Booking Submitted: Ref #SBL-2026-9042',
    description: 'Ritah Mukasa submitted a booking request for Luxury Wedding at Speke Resort Munyonyo (500 guests).',
    performedBy: {
      name: 'Ritah Mukasa',
      role: 'Client Web Portal',
      isSystem: false
    },
    metadata: {
      referenceNumber: 'SBL-2026-9042',
      clientName: 'Ritah Mukasa',
      eventType: 'wedding',
      location: 'Speke Resort Munyonyo',
      estimatedTotal: 9500000,
      guestCount: 500
    },
    timestamp: '2026-09-04T07:45:00.000Z',
    createdAt: '2026-09-04T07:45:00.000Z'
  },
  {
    id: 'log-usr-1',
    category: 'user_login',
    action: 'ADMIN_LOGIN',
    title: 'Major Admin Login: SBL-1000',
    description: 'SBL-1000 (Major Admin) authenticated successfully and accessed the Master Management Portal.',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Major Admin'
    },
    metadata: {
      ipOrLocation: 'Kampala HQ, Central Uganda',
      sessionType: 'Desktop Web (Chrome)',
      authMethod: 'Master Access Credentials'
    },
    timestamp: '2026-09-04T07:15:00.000Z',
    createdAt: '2026-09-04T07:15:00.000Z'
  },
  {
    id: 'log-bkg-2',
    category: 'booking_change',
    action: 'STATUS_UPDATED',
    title: 'Booking Confirmed: Ref #SBL-2026-8819',
    description: 'Status changed from pending to confirmed by SBL-1000. Rigging crew and fleet units reserved.',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Major Admin'
    },
    metadata: {
      referenceNumber: 'SBL-2026-8819',
      clientName: 'Dr. Patrick Magezi',
      oldValue: 'pending',
      newValue: 'confirmed',
      venue: 'Serena Kigo Gardens'
    },
    timestamp: '2026-09-03T16:20:00.000Z',
    createdAt: '2026-09-03T16:20:00.000Z'
  },
  {
    id: 'log-set-1',
    category: 'settings_update',
    action: 'BUFFER_DAYS_UPDATED',
    title: 'Buffer Days Adjusted: 2 Pre / 1 Post',
    description: 'Pre-event rigging buffer set to 2 days before event date to guarantee zero setup clash during peak wedding season.',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Major Admin'
    },
    metadata: {
      bufferDaysBefore: 2,
      bufferDaysAfter: 1,
      oldValue: '1 day pre-buffer',
      newValue: '2 days pre-buffer'
    },
    timestamp: '2026-09-03T14:40:00.000Z',
    createdAt: '2026-09-03T14:40:00.000Z'
  },
  {
    id: 'log-bkg-3',
    category: 'booking_change',
    action: 'PAYMENT_RECORDED',
    title: 'Payment Recorded: Ref #SBL-2026-7721',
    description: 'Received initial bank deposit of UGX 4,500,000 for Corporate Gala. Balance due: UGX 3,500,000.',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Finance & Invoicing'
    },
    metadata: {
      referenceNumber: 'SBL-2026-7721',
      clientName: 'Stanbic Bank Uganda',
      amountPaid: 4500000,
      balanceDue: 3500000,
      paymentStatus: 'deposit_paid'
    },
    timestamp: '2026-09-03T11:15:00.000Z',
    createdAt: '2026-09-03T11:15:00.000Z'
  },
  {
    id: 'log-usr-2',
    category: 'user_login',
    action: 'STAFF_LOGIN',
    title: 'Staff Login: SBL-1002 (David Mukisa)',
    description: 'Tent Rigging Lead authenticated to inspect marquee structural checklists for Masaka event.',
    performedBy: {
      userId: 'sbl 1002',
      name: 'David Mukisa',
      role: 'Tent Rigging Lead'
    },
    metadata: {
      ipOrLocation: 'Masaka Operations Hub',
      sessionType: 'Mobile Web'
    },
    timestamp: '2026-09-03T09:30:00.000Z',
    createdAt: '2026-09-03T09:30:00.000Z'
  },
  {
    id: 'log-set-2',
    category: 'settings_update',
    action: 'ANNOUNCEMENT_UPDATED',
    title: 'Site Announcement Published',
    description: 'Updated client-facing promotion banner: "⚡ Booking Peak Season Offer: 15% Off Mega Tents & AV Packages".',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Major Admin'
    },
    metadata: {
      announcementTitle: 'Peak Season 2026 Special',
      announcementActive: true
    },
    timestamp: '2026-09-02T16:00:00.000Z',
    createdAt: '2026-09-02T16:00:00.000Z'
  },
  {
    id: 'log-set-3',
    category: 'settings_update',
    action: 'INVENTORY_STOCK_UPDATE',
    title: 'Inventory Stock Level Updated: P3.91 LED Wall',
    description: 'Available stock level adjusted to 60 units following preventive maintenance and calibration.',
    performedBy: {
      userId: 'sbl 1000',
      name: 'SBL-1000',
      role: 'Operations Manager'
    },
    metadata: {
      itemName: 'Outdoor High-Brightness P3.91 LED Screen',
      totalQuantity: 60,
      availableQuantity: 60
    },
    timestamp: '2026-09-02T10:15:00.000Z',
    createdAt: '2026-09-02T10:15:00.000Z'
  }
];


