import React, { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Page, Service, GalleryItem, InventoryItem, Booking, CalendarEvent, CallbackRequest, Testimonial } from '../types';
import { COMPANY_CONTACT_INFO, sblWeddingCoupleLogoImg } from '../data/mockData';
import { 
  Search, 
  X, 
  Sparkles, 
  Calendar, 
  Image as ImageIcon, 
  Users, 
  MessageSquareQuote, 
  Mail, 
  Lock, 
  Package, 
  ChevronRight, 
  ArrowUpRight, 
  Phone, 
  MessageCircle,
  Clock,
  Layers,
  HelpCircle,
  CornerDownLeft,
  Command,
  History,
  UserCheck,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  Filter,
  Flame,
  CreditCard,
  Tent,
  Zap,
  Tv,
  Volume2,
  Bath,
  Truck,
  Tag,
  SlidersHorizontal,
  ArrowRight,
  Sparkle,
  RotateCcw
} from 'lucide-react';

export type SearchCategoryType = 
  | 'all' 
  | 'clients' 
  | 'archive' 
  | 'service' 
  | 'inventory' 
  | 'gallery' 
  | 'page' 
  | 'action' 
  | 'faq';

export interface ServiceCategoryOption {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

export const BASE_SERVICE_CATEGORIES: ServiceCategoryOption[] = [
  { id: 'all', label: 'All Service Categories', shortLabel: 'All Services', icon: Layers, keywords: ['all', 'every', 'fleet', 'gear'] },
  { id: 'tents', label: 'Mega Tents & Stages', shortLabel: 'Tents & Stages', icon: Tent, keywords: ['tent', 'tents', 'marquee', 'alpine', 'stage', 'truss', 'dome', 'canopy', 'shelter', 'catwalk'] },
  { id: 'lighting', label: 'Intelligent Lighting', shortLabel: 'Lighting & FX', icon: Zap, keywords: ['light', 'lighting', 'beam', 'spot', 'wash', 'moving head', 'dmx', 'laser', 'ambient', 'uplighting', 'fog'] },
  { id: 'screens', label: 'LED Video Screens', shortLabel: 'LED Screens', icon: Tv, keywords: ['screen', 'screens', 'led', 'video', 'display', 'p3.9', 'p2.6', 'wall', 'panel', 'visual'] },
  { id: 'sound-mc', label: 'Mobile Disco & Sound', shortLabel: 'Sound & Disco', icon: Volume2, keywords: ['sound', 'audio', 'disco', 'speaker', 'line array', 'mic', 'microphone', 'mc', 'dj', 'pa system', 'acoustic'] },
  { id: 'production', label: 'Decor & Planning', shortLabel: 'Decor & Planning', icon: Sparkle, keywords: ['decor', 'decoration', 'kwanjula', 'planning', 'stage decor', 'drape', 'flower', 'wedding', 'table', 'chair'] },
  { id: 'restrooms', label: 'Mobile Restrooms', shortLabel: 'Restrooms', icon: Bath, keywords: ['restroom', 'toilet', 'sanitation', 'mobile restroom', 'vip restroom', 'trailer', 'washroom', 'vanity'] },
  { id: 'b2b-lending', label: 'B2B Equipment Hire', shortLabel: 'B2B Hire', icon: Truck, keywords: ['b2b', 'hire', 'lending', 'wholesale', 'planner', 'sub-rental', 'generator', 'heavy equipment'] },
];

export interface RealtimeSuggestion {
  id: string;
  type: 'service-category' | 'service' | 'inventory' | 'client' | 'archive' | 'keyword';
  title: string;
  subtitle?: string;
  badge: string;
  badgeColor?: string;
  icon: React.ReactNode;
  actionText?: string;
  onApply: () => void;
}

export interface SearchResult {
  id: string;
  category: SearchCategoryType;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  image?: string;
  highlightMeta?: string;
  // Rich details for 3D Preview Card
  clientData?: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    reference: string;
    date: string;
    location: string;
    guestCount?: number;
    eventType: string;
    status: string;
    paymentStatus?: string;
    estimatedTotal?: number;
    amountPaid?: number;
    balanceDue?: number;
    notes?: string;
    selectedServices?: string[];
  };
  archiveData?: {
    title: string;
    clientName?: string;
    date: string;
    location: string;
    attendees?: string;
    category: string;
    description: string;
    servicesProvided?: string[];
    isFeatured?: boolean;
    image: string;
  };
  serviceCategory?: string;
  serviceCategoryLabel?: string;
  serviceData?: {
    title: string;
    tagline: string;
    basePrice?: number;
    priceUnit?: string;
    capacity?: string;
    b2bAvailable?: boolean;
    image: string;
    features?: string[];
    serviceCategory?: string;
    serviceCategoryLabel?: string;
  };
  inventoryData?: {
    name: string;
    available: number;
    total: number;
    dailyRate?: number;
    unit: string;
    specs: string;
    image?: string;
    b2bEligible?: boolean;
  };
  searchIndex?: string;
  onSelect: () => void;
}

// Highlight matched substring in real-time (memoized for zero unnecessary rerenders)
export const HighlightMatch: React.FC<{ text?: string; query: string; className?: string }> = React.memo(({ text, query, className }) => {
  if (!text) return null;
  const q = query.trim().toLowerCase();
  if (!q) return <span className={className}>{text}</span>;
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <span className={className}>{text}</span>;
  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + q.length);
  const after = text.substring(idx + q.length);
  return (
    <span className={className}>
      {before}
      <mark className="bg-amber-400/40 text-amber-100 rounded-xs px-0.5 font-bold not-italic">
        {match}
      </mark>
      {after}
    </span>
  );
});

export const POPULAR_SEARCH_SUGGESTIONS = [
  { label: 'Mega Tents', query: 'Mega Tents', icon: Tent, serviceCategory: 'tents' },
  { label: 'LED Screens', query: 'LED Screens', icon: Tv, serviceCategory: 'screens' },
  { label: 'Intelligent Lighting', query: 'Lighting', icon: Zap, serviceCategory: 'lighting' },
  { label: 'Mobile Disco & Sound', query: 'Sound', icon: Volume2, serviceCategory: 'sound-mc' },
  { label: 'Kwanjula Stages', query: 'Kwanjula', icon: Sparkle, serviceCategory: 'production' },
  { label: 'VIP Restrooms', query: 'Restroom', icon: Bath, serviceCategory: 'restrooms' },
  { label: '100kVA Generator', query: '100kVA', icon: Truck, serviceCategory: 'b2b-lending' },
  { label: 'Ref: SBL-2026-9042', query: 'SBL-2026-9042', icon: Users, serviceCategory: 'all' },
  { label: 'Speke Resort Munyonyo', query: 'Speke Resort', icon: MapPin, serviceCategory: 'all' },
];

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    closeSearch, 
    setCurrentPage, 
    openBookingModal, 
    services, 
    galleryItems, 
    inventory, 
    bookings,
    calendarEvents,
    callbackRequests,
    testimonials,
    openShortcuts,
    showToast,
    eventCategories
  } = useApp();

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState<SearchCategoryType>('all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Dynamic available service categories combining base options and admin eventCategories
  const availableServiceCategories = useMemo<ServiceCategoryOption[]>(() => {
    const list = [...BASE_SERVICE_CATEGORIES];
    if (eventCategories && eventCategories.length > 0) {
      eventCategories.filter(c => c.active).forEach(cat => {
        if (!list.some(item => item.id === cat.slug)) {
          list.push({
            id: cat.slug,
            label: cat.name,
            shortLabel: cat.name.split(' ')[0] || cat.name,
            icon: Sparkle,
            keywords: [cat.name.toLowerCase(), cat.slug.toLowerCase(), ...(cat.recommendedServices || [])]
          });
        }
      });
    }
    return list;
  }, [eventCategories]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const specularGlowRef = useRef<HTMLDivElement>(null);

  // Instant auto-focus input and reset state when opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('all');
      setSelectedServiceCategory('all');
      // Direct focus without delay for instantaneous responsiveness
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isSearchOpen]);

  // Handle 3D perspective mouse movement via direct DOM mutation (0 React re-renders)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewCardRef.current) return;
    const rect = previewCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates (-1 to 1)
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;
    
    // Smooth angle tilt values (max 8 deg for elegant luxury feel)
    const rotateY = normalizedX * 8;
    const rotateX = -normalizedY * 8;
    
    previewCardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    if (specularGlowRef.current) {
      specularGlowRef.current.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(245, 158, 11, 0.25) 0%, transparent 60%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (previewCardRef.current) {
      previewCardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (specularGlowRef.current) {
      specularGlowRef.current.style.background = 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 60%)';
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    showToast('Copied to Clipboard', `${label}: "${text}" copied.`, 'success');
    setTimeout(() => setCopiedRef(null), 2500);
  };

  // Construct comprehensive search pool including Historical Event Archives and Client Details
  const allResults = useMemo<SearchResult[]>(() => {
    if (!isSearchOpen) return [];
    const results: SearchResult[] = [];

    // 1. CLIENT DETAILS & LIVE BOOKINGS
    bookings.forEach((b: Booking) => {
      const isSettled = b.paymentStatus === 'fully_paid';
      const isDeposit = b.paymentStatus === 'deposit_paid';
      const isOverdue = b.paymentStatus === 'overdue';

      const paymentBadge = isSettled 
        ? 'Fully Paid' 
        : isDeposit 
        ? 'Deposit Paid' 
        : isOverdue 
        ? 'Overdue Balance' 
        : 'Payment Pending';

      const badgeColor = isSettled 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
        : isDeposit 
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
        : isOverdue 
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
        : 'bg-slate-500/20 text-slate-300 border-slate-500/40';

      results.push({
        id: `client-${b.id}`,
        category: 'clients',
        categoryLabel: 'Client Record & Booking',
        title: b.clientName,
        subtitle: `Ref: ${b.referenceNumber} • ${b.location} • ${b.eventDate} • ${b.guestCount || 0} Guests`,
        badge: paymentBadge,
        badgeColor,
        icon: <Users className="w-4 h-4 text-amber-400" />,
        highlightMeta: `${b.phone} ${b.email} ${b.referenceNumber} ${b.companyName || ''}`,
        clientData: {
          name: b.clientName,
          phone: b.phone,
          email: b.email,
          company: b.companyName,
          reference: b.referenceNumber,
          date: b.eventDate,
          location: b.location,
          guestCount: b.guestCount,
          eventType: b.eventType,
          status: b.status,
          paymentStatus: b.paymentStatus,
          estimatedTotal: b.estimatedTotal,
          amountPaid: b.amountPaid,
          balanceDue: b.balanceDue,
          notes: b.notes || b.customRequests,
          selectedServices: b.selectedServices
        },
        onSelect: () => {
          setCurrentPage('admin');
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Client Ledger Opened', `Loaded record for ${b.clientName} (${b.referenceNumber}) in Admin Portal.`, 'info');
        }
      });
    });

    // 1b. Callback Leads & Client Contacts
    callbackRequests.forEach((cb: CallbackRequest) => {
      results.push({
        id: `callback-${cb.id}`,
        category: 'clients',
        categoryLabel: 'Client Inquiries & Callbacks',
        title: cb.clientName,
        subtitle: `Phone: ${cb.phone} • Interest: ${cb.eventInterest}`,
        badge: `Lead: ${cb.status.toUpperCase()}`,
        badgeColor: cb.status === 'called' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: <Phone className="w-4 h-4 text-emerald-400" />,
        highlightMeta: `${cb.phone} ${cb.eventInterest} ${cb.notes || ''}`,
        clientData: {
          name: cb.clientName,
          phone: cb.phone,
          reference: `LEAD-${cb.id.substring(0, 6).toUpperCase()}`,
          date: cb.createdAt || 'Recent Lead',
          location: 'Uganda Client Queue',
          eventType: cb.eventInterest,
          status: cb.status,
          notes: cb.notes
        },
        onSelect: () => {
          setCurrentPage('admin');
          closeSearch();
          showToast('Lead Queue', `Viewing callback record for ${cb.clientName}.`, 'info');
        }
      });
    });

    // 2. HISTORICAL EVENT ARCHIVES & SHOWCASES
    galleryItems.forEach((gal: GalleryItem) => {
      results.push({
        id: `archive-${gal.id}`,
        category: 'archive',
        categoryLabel: 'Historical Event Archive',
        title: gal.title,
        subtitle: `${gal.location} • ${gal.date} • ${gal.attendees || 'Grand Setup'} • ${gal.category.toUpperCase()}`,
        badge: gal.badge || 'Archive Verified',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: <History className="w-4 h-4 text-rose-400" />,
        image: gal.image,
        highlightMeta: `${gal.clientName || ''} ${gal.description} ${gal.servicesProvided?.join(' ') || ''}`,
        archiveData: {
          title: gal.title,
          clientName: gal.clientName,
          date: gal.date,
          location: gal.location,
          attendees: gal.attendees,
          category: gal.category,
          description: gal.description,
          servicesProvided: gal.servicesProvided,
          isFeatured: gal.isFeaturedRealSetup,
          image: gal.image
        },
        onSelect: () => {
          setCurrentPage('gallery');
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Event Archive Opened', `Loaded "${gal.title}" in Events Done Gallery.`, 'info');
        }
      });
    });

    // 2b. Historical Calendar Events
    calendarEvents.forEach((evt: CalendarEvent) => {
      results.push({
        id: `cal-archive-${evt.id}`,
        category: 'archive',
        categoryLabel: 'Event Schedule Archive',
        title: evt.title,
        subtitle: `${evt.location} • ${evt.startDate} to ${evt.endDate} • ${evt.eventType.toUpperCase()}`,
        badge: evt.status === 'booked' ? 'Official Event' : 'Showcase',
        badgeColor: evt.status === 'booked' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        icon: <Calendar className="w-4 h-4 text-blue-400" />,
        highlightMeta: `${evt.clientName || ''} ${evt.location} ${evt.servicesSummary?.join(' ') || ''} ${evt.publicDescription || ''}`,
        archiveData: {
          title: evt.title,
          clientName: evt.clientName,
          date: `${evt.startDate} — ${evt.endDate}`,
          location: evt.location,
          attendees: evt.guestCount ? `${evt.guestCount} Guests` : undefined,
          category: evt.eventType,
          description: evt.publicDescription || `Scheduled event with ${evt.servicesSummary?.join(', ') || 'full production fleet'}.`,
          servicesProvided: evt.servicesSummary,
          image: services[0]?.image || ''
        },
        onSelect: () => {
          setCurrentPage('calendar');
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 3. SERVICES & PRODUCTION RIGS
    services.forEach((srv: Service) => {
      const catOption = availableServiceCategories.find(c => c.id === srv.category);
      const catLabel = catOption?.label || (srv.category ? srv.category.toUpperCase() : 'General Service');

      results.push({
        id: `service-${srv.id}`,
        category: 'service',
        categoryLabel: 'Services & Rigging',
        serviceCategory: srv.category,
        serviceCategoryLabel: catLabel,
        title: srv.title,
        subtitle: `${srv.capacityOrScale || 'All Scales'} • ${srv.tagline}`,
        badge: srv.b2bAvailable ? 'B2B Wholesale' : 'Production Fleet',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: <Package className="w-4 h-4 text-amber-400" />,
        image: srv.image,
        highlightMeta: `${srv.fullDesc} ${srv.shortDesc} ${srv.features.join(' ')} ${srv.category} ${catLabel}`,
        serviceData: {
          title: srv.title,
          tagline: srv.tagline,
          basePrice: srv.basePrice,
          priceUnit: srv.priceUnit,
          capacity: srv.capacityOrScale,
          b2bAvailable: srv.b2bAvailable,
          image: srv.image,
          features: srv.features,
          serviceCategory: srv.category,
          serviceCategoryLabel: catLabel
        },
        onSelect: () => {
          setCurrentPage('home');
          closeSearch();
          setTimeout(() => {
            const el = document.getElementById('featured-equipment-fleet') || document.getElementById('home-view');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      });
    });

    // 4. WAREHOUSE INVENTORY FLEET
    const invToServiceCatMap: Record<string, string> = {
      'Tents & Structures': 'tents',
      'Video & Screens': 'screens',
      'Audio & Sound': 'sound-mc',
      'Staging & Truss': 'tents',
      'Restrooms & Sanitation': 'restrooms',
      'Lighting & FX': 'lighting',
      'Decoration & Seating': 'production',
      'Power & Logistics': 'b2b-lending'
    };

    inventory.forEach((inv: InventoryItem) => {
      const srvCat = invToServiceCatMap[inv.category] || 'b2b-lending';
      const catOption = availableServiceCategories.find(c => c.id === srvCat);

      results.push({
        id: `inventory-${inv.id}`,
        category: 'inventory',
        categoryLabel: 'Warehouse Fleet Inventory',
        serviceCategory: srvCat,
        serviceCategoryLabel: catOption?.label || inv.category,
        title: inv.name,
        subtitle: `Rate: UGX ${inv.dailyRate?.toLocaleString()} ${inv.unit} • ${inv.specs}`,
        badge: `${inv.availableQuantity}/${inv.totalQuantity} In Stock`,
        badgeColor: inv.availableQuantity > 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40',
        icon: <Layers className="w-4 h-4 text-teal-400" />,
        image: inv.image,
        highlightMeta: `${inv.category} ${inv.specs} ${inv.unit} ${catOption?.label || ''}`,
        inventoryData: {
          name: inv.name,
          available: inv.availableQuantity,
          total: inv.totalQuantity,
          dailyRate: inv.dailyRate,
          unit: inv.unit,
          specs: inv.specs,
          image: inv.image,
          b2bEligible: inv.b2bEligible
        },
        onSelect: () => {
          setCurrentPage('calendar');
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 5. TESTIMONIALS & REVIEWS
    testimonials.forEach((t: Testimonial) => {
      results.push({
        id: `testimonial-${t.id}`,
        category: 'archive',
        categoryLabel: 'Client Testimonial & Review',
        title: `${t.author} (${t.companyOrEvent})`,
        subtitle: `"${t.content.substring(0, 90)}..." • Rating: ${t.rating}/5 ⭐`,
        badge: 'Verified Client',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        icon: <MessageSquareQuote className="w-4 h-4 text-purple-400" />,
        highlightMeta: `${t.content} ${t.role} ${t.companyOrEvent}`,
        onSelect: () => {
          setCurrentPage('testimonials');
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 6. QUICK PAGES
    const pages: { id: Page; label: string; desc: string; icon: React.ReactNode }[] = [
      { id: 'home', label: 'Home Page', desc: 'SBL landing page, live rigging reel, equipment showcase', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
      { id: 'gallery', label: 'Events Done (Showcase Archive)', desc: 'Real setups, Kwanjula royal stages, wedding domes, concert rigs', icon: <ImageIcon className="w-4 h-4 text-rose-400" /> },
      { id: 'calendar', label: 'Live Calendar & Logistics Stock', desc: 'Real-time schedule check, rigging availability, 2-day buffer status', icon: <Calendar className="w-4 h-4 text-blue-400" /> },
      { id: 'about', label: 'About SBL Events', desc: 'Our journey, founder story, rigging engineers, warehouse hub', icon: <Users className="w-4 h-4 text-emerald-400" /> },
      { id: 'testimonials', label: 'Client Reviews', desc: 'Verified client feedback from weddings, crusades & corporate galas', icon: <MessageSquareQuote className="w-4 h-4 text-purple-400" /> },
      { id: 'contact', label: 'Book Event & Transparent Estimator', desc: 'Transparent pricing calculator, booking wizard, direct callback', icon: <Mail className="w-4 h-4 text-pink-400" /> },
      { id: 'admin', label: 'Admin & Employee Ledger Portal', desc: 'Management login, schedule manager, inventory rates, billing ledger', icon: <Lock className="w-4 h-4 text-slate-400" /> },
    ];

    pages.forEach(p => {
      results.push({
        id: `page-${p.id}`,
        category: 'page',
        categoryLabel: 'Quick Navigation',
        title: p.label,
        subtitle: p.desc,
        icon: p.icon,
        badge: 'Page View',
        badgeColor: 'bg-white/10 text-slate-300 border-white/20',
        onSelect: () => {
          setCurrentPage(p.id);
          closeSearch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 7. INSTANT ACTIONS & HOTLINES
    results.push({
      id: 'action-book-event',
      category: 'action',
      categoryLabel: 'Instant Operations',
      title: 'Book Event / Reserve Equipment',
      subtitle: 'Launch instant reservation wizard with live rate calculations',
      icon: <Calendar className="w-4 h-4 text-red-400" />,
      badge: 'Interactive Wizard',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      onSelect: () => {
        closeSearch();
        openBookingModal();
      }
    });

    results.push({
      id: 'action-whatsapp-direct',
      category: 'action',
      categoryLabel: 'Instant Operations',
      title: 'Chat on WhatsApp Direct',
      subtitle: `Instant chat with SBL Operations (${COMPANY_CONTACT_INFO.whatsappDisplay})`,
      icon: <MessageCircle className="w-4 h-4 text-emerald-400" />,
      badge: 'Live 24/7 Chat',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      onSelect: () => {
        closeSearch();
        window.open(COMPANY_CONTACT_INFO.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    });

    results.push({
      id: 'action-call-hotline',
      category: 'action',
      categoryLabel: 'Instant Operations',
      title: 'Call Technical Dispatch Line',
      subtitle: `Call ${COMPANY_CONTACT_INFO.phoneDisplay} (24/7 Dispatch Hotline)`,
      icon: <Phone className="w-4 h-4 text-blue-400" />,
      badge: 'Hotline Voice',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      onSelect: () => {
        closeSearch();
        window.location.href = `tel:${COMPANY_CONTACT_INFO.primaryPhone}`;
      }
    });

    results.push({
      id: 'action-email-dispatch',
      category: 'action',
      categoryLabel: 'Instant Operations',
      title: 'Email Dispatch Inquiries (najibshafiq@sblevents.com)',
      subtitle: `Open email client to send direct quotation or equipment booking inquiry to najibshafiq@sblevents.com`,
      icon: <Mail className="w-4 h-4 text-pink-400" />,
      badge: 'Direct Mail Dispatch',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      onSelect: () => {
        closeSearch();
        window.location.href = `mailto:${COMPANY_CONTACT_INFO.email}?subject=SBL%20Events%20Inquiry%20%26%20Quotation%20Request`;
      }
    });

    results.push({
      id: 'action-view-shortcuts',
      category: 'action',
      categoryLabel: 'Instant Operations',
      title: 'View Keyboard Shortcuts',
      subtitle: 'Open full accessibility keyboard navigation cheatsheet',
      icon: <Command className="w-4 h-4 text-amber-400" />,
      badge: 'Command Helper',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      onSelect: () => {
        closeSearch();
        openShortcuts();
      }
    });

    // 8. COMMON FAQS
    const faqs = [
      { q: 'How far in advance should we reserve tents?', a: 'We recommend booking 2 to 4 weeks ahead for mega tents and kwanjula setups.' },
      { q: 'Do you offer B2B equipment lending to event planners?', a: 'Yes, wholesale rates on tents, trusses, sound systems and screens.' },
      { q: 'How do you secure structures in heavy rain and storms?', a: 'Heavy concrete ballasts and certified steel earth anchors.' },
      { q: 'Do you provide standby silent generators?', a: 'Yes, 50kVA, 100kVA and 150kVA Cummins super-silent diesel generators.' },
      { q: 'What is the official email for quotations and confirmations?', a: 'najibshafiq@sblevents.com' },
      { q: 'Where are SBL logistics hubs located?', a: 'Centrally located in Masaka City and Lwengo District, serving all of Uganda.' }
    ];

    faqs.forEach((faq, idx) => {
      results.push({
        id: `faq-${idx}`,
        category: 'faq',
        categoryLabel: 'FAQs & Documentation',
        title: faq.q,
        subtitle: faq.a,
        icon: <HelpCircle className="w-4 h-4 text-amber-300" />,
        badge: 'FAQ Answer',
        badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        onSelect: () => {
          setCurrentPage('contact');
          closeSearch();
        }
      });
    });

    // Precompute lowercase searchIndex for instant sub-millisecond filtering
    results.forEach(item => {
      item.searchIndex = `${item.title} ${item.subtitle || ''} ${item.highlightMeta || ''} ${item.categoryLabel} ${item.badge || ''} ${item.serviceCategoryLabel || ''}`.toLowerCase();
    });

    return results;
  }, [isSearchOpen, bookings, callbackRequests, galleryItems, calendarEvents, services, inventory, testimonials, availableServiceCategories, setCurrentPage, closeSearch, openBookingModal, openShortcuts, showToast]);

  // Filter based on deferred search query (guarantees zero keystroke delay)
  const queryClean = deferredQuery.trim().toLowerCase();
  
  const filteredResults = useMemo(() => {
    if (!isSearchOpen || allResults.length === 0) return [];
    const tokens = queryClean ? queryClean.split(/\s+/).filter(Boolean) : [];

    return allResults.filter(item => {
      // 1. Primary category filter
      const matchesCategory = 
        activeCategory === 'all' || 
        item.category === activeCategory ||
        (activeCategory === 'gallery' && item.category === 'archive');

      if (!matchesCategory) return false;

      // 2. Service category filter
      if (selectedServiceCategory !== 'all') {
        if (item.category === 'service') {
          const matchesDirect = item.serviceCategory === selectedServiceCategory;
          const customCat = eventCategories?.find(c => c.slug === selectedServiceCategory);
          const matchesCustom = customCat && customCat.recommendedServices?.some(id => item.id.includes(id));
          if (!matchesDirect && !matchesCustom) return false;
        } else if (item.serviceCategory) {
          if (item.serviceCategory !== selectedServiceCategory) return false;
        } else if (activeCategory === 'service') {
          return false;
        }
      }

      // 3. Fast token-based index search (instant execution)
      if (tokens.length === 0) return true;

      const idx = item.searchIndex || '';
      for (let i = 0; i < tokens.length; i++) {
        if (!idx.includes(tokens[i])) return false;
      }

      return true;
    });
  }, [allResults, activeCategory, selectedServiceCategory, queryClean, eventCategories, isSearchOpen]);

  // Real-time dynamic suggestions computed with deferred query
  const realtimeSuggestions = useMemo<RealtimeSuggestion[]>(() => {
    if (!isSearchOpen) return [];
    const q = queryClean;
    if (!q) return [];

    const suggestions: RealtimeSuggestion[] = [];

    // 1. Check matching Service Categories
    availableServiceCategories.forEach(cat => {
      if (cat.id === 'all') return;
      const matchesLabel = cat.label.toLowerCase().includes(q);
      const matchesShort = cat.shortLabel.toLowerCase().includes(q);
      const matchesKeyword = cat.keywords.some(k => k.includes(q) || q.includes(k));

      if (matchesLabel || matchesShort || matchesKeyword) {
        const IconComponent = cat.icon;
        const count = services.filter(s => s.category === cat.id).length;
        suggestions.push({
          id: `sug-cat-${cat.id}`,
          type: 'service-category',
          title: `Filter Category: ${cat.label}`,
          subtitle: `${count} Production Services • Rigging & Equipment`,
          badge: 'Category Filter',
          badgeColor: 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md',
          icon: <IconComponent className="w-3.5 h-3.5 text-slate-950" />,
          actionText: 'Apply Filter',
          onApply: () => {
            setSelectedServiceCategory(cat.id);
            setActiveCategory('service');
            setSelectedIndex(0);
            showToast('Category Filter Applied', `Showing results in "${cat.label}".`, 'info');
          }
        });
      }
    });

    // 2. Check matching Services
    services.forEach(srv => {
      if (
        srv.title.toLowerCase().includes(q) || 
        srv.tagline.toLowerCase().includes(q) || 
        srv.features.some(f => f.toLowerCase().includes(q))
      ) {
        suggestions.push({
          id: `sug-srv-${srv.id}`,
          type: 'service',
          title: srv.title,
          subtitle: srv.tagline,
          badge: 'Service',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: <Package className="w-3.5 h-3.5 text-amber-400" />,
          actionText: 'Select',
          onApply: () => {
            setQuery(srv.title);
            setSelectedServiceCategory(srv.category);
            setActiveCategory('service');
            setSelectedIndex(0);
          }
        });
      }
    });

    // 3. Check matching Clients & References
    bookings.forEach(b => {
      const matchName = b.clientName.toLowerCase().includes(q);
      const matchRef = b.referenceNumber.toLowerCase().includes(q);
      const matchLoc = b.location.toLowerCase().includes(q);
      if (matchName || matchRef || matchLoc) {
        suggestions.push({
          id: `sug-bkg-${b.id}`,
          type: 'client',
          title: b.clientName,
          subtitle: `Ref: ${b.referenceNumber} • ${b.location} (${b.eventDate})`,
          badge: 'Client Record',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          actionText: 'Open',
          onApply: () => {
            setQuery(b.clientName);
            setActiveCategory('clients');
            setSelectedIndex(0);
          }
        });
      }
    });

    // 4. Check matching Inventory Fleet
    inventory.forEach(inv => {
      if (
        inv.name.toLowerCase().includes(q) || 
        inv.specs.toLowerCase().includes(q) || 
        inv.category.toLowerCase().includes(q)
      ) {
        suggestions.push({
          id: `sug-inv-${inv.id}`,
          type: 'inventory',
          title: inv.name,
          subtitle: `${inv.specs} • Stock: ${inv.availableQuantity}/${inv.totalQuantity}`,
          badge: 'Warehouse Fleet',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          icon: <Layers className="w-3.5 h-3.5 text-teal-400" />,
          actionText: 'Inspect',
          onApply: () => {
            setQuery(inv.name);
            setActiveCategory('inventory');
            setSelectedIndex(0);
          }
        });
      }
    });

    // 5. Check matching Archives / Events
    galleryItems.forEach(gal => {
      if (gal.title.toLowerCase().includes(q) || gal.description.toLowerCase().includes(q)) {
        suggestions.push({
          id: `sug-gal-${gal.id}`,
          type: 'archive',
          title: gal.title,
          subtitle: `${gal.category.toUpperCase()} • ${gal.date}`,
          badge: 'Event Archive',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: <History className="w-3.5 h-3.5 text-purple-400" />,
          actionText: 'View',
          onApply: () => {
            setQuery(gal.title);
            setActiveCategory('archive');
            setSelectedIndex(0);
          }
        });
      }
    });

    return suggestions.slice(0, 6);
  }, [isSearchOpen, queryClean, availableServiceCategories, services, bookings, inventory, galleryItems, showToast]);

  // Windowed visible results for 60fps instant rendering
  const visibleResults = useMemo(() => filteredResults.slice(0, 30), [filteredResults]);

  // Ensure selected index stays in range
  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(0);
    }
  }, [filteredResults.length, selectedIndex]);

  const activeResult = filteredResults[selectedIndex] || filteredResults[0];

  // Keyboard navigation within search list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && realtimeSuggestions.length > 0) {
      e.preventDefault();
      realtimeSuggestions[0].onApply();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filteredResults.length || 1)) % (filteredResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
  };

  // Memoized category counts for quick badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allResults.length,
      clients: 0,
      archive: 0,
      service: 0,
      inventory: 0,
      page: 0,
      action: 0,
      faq: 0,
    };
    for (let i = 0; i < allResults.length; i++) {
      const cat = allResults[i].category;
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    }
    return counts;
  }, [allResults]);

  const categories = useMemo(() => [
    { id: 'all' as SearchCategoryType, label: 'All Intelligence', count: categoryCounts.all, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'clients' as SearchCategoryType, label: 'Client Records', count: categoryCounts.clients, icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'archive' as SearchCategoryType, label: 'Historical Archives', count: categoryCounts.archive, icon: <History className="w-3.5 h-3.5" /> },
    { id: 'service' as SearchCategoryType, label: 'Services & Rigging', count: categoryCounts.service, icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'inventory' as SearchCategoryType, label: 'Warehouse Fleet', count: categoryCounts.inventory, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'page' as SearchCategoryType, label: 'Navigation', count: categoryCounts.page, icon: <ExternalLink className="w-3.5 h-3.5" /> },
    { id: 'action' as SearchCategoryType, label: 'Actions', count: categoryCounts.action, icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'faq' as SearchCategoryType, label: 'FAQs', count: categoryCounts.faq, icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ], [categoryCounts]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="global-search-modal-overlay"
        className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 md:pt-16 px-3 sm:px-6 bg-slate-950/85 backdrop-blur-xl transition-all"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSearch();
        }}
      >
        {/* Ambient 3D Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20, rotateX: 6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 1200 }}
          className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-[#070D18]/95 text-white shadow-2xl shadow-black/90 flex flex-col max-h-[88vh] backdrop-blur-2xl ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Brand Emblem & Welcoming Search Header */}
          <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-gradient-to-r from-[#080F1E] via-[#0D182E] to-[#080F1E] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative overflow-hidden">
            {/* Subtle Gold Foil Sheen Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* SBL Wedding Couple Brand Badge */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#050913] border border-amber-400/50 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10 group">
                <img
                  src={sblWeddingCoupleLogoImg}
                  alt="SBL Events"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black tracking-tight font-['Outfit'] text-white">
                    SBL Global Intelligence &amp; Archive Search
                  </h3>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>3D Live Sync</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant search across client ledgers, historical setups, bookings, equipment &amp; archives
                </p>
              </div>
            </div>

            {/* Quick Actions / Close */}
            <div className="flex items-center justify-between sm:justify-end gap-2 relative z-10">
              <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                <span>Navigate:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-amber-300">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-amber-300">↓</kbd>
                <span className="ml-1">Select:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-amber-300">↵</kbd>
              </div>

              <button
                type="button"
                onClick={closeSearch}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                title="Close search (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Box with Glowing Ring */}
          <div className="p-3 sm:p-4 bg-[#050914] border-b border-amber-500/20 relative">
            <div className="relative flex items-center bg-[#0C1527] rounded-2xl border border-amber-500/40 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30 shadow-inner transition-all">
              <div className="pl-4 pr-2 text-amber-400 flex items-center justify-center">
                <Search className="w-5 h-5 animate-pulse" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search clients (Dr. Sarah, Patrick, Mukasa), event archives (Kwanjula, Masaka, Gala), ref numbers (SBL-2026), mega tents, sound, LED..."
                className="w-full py-3 sm:py-3.5 pr-4 bg-transparent text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Real-time Dynamic Suggestions Tray (as user types) */}
            {realtimeSuggestions.length > 0 && (
              <div className="mt-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0C172C] to-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between gap-2 mb-1.5 px-1 text-[11px] font-bold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Real-Time Suggestions ({realtimeSuggestions.length}):</span>
                  </div>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                    Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-amber-300">Tab</kbd> to apply top match
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {realtimeSuggestions.map((sug) => (
                    <button
                      key={sug.id}
                      type="button"
                      onClick={sug.onApply}
                      className="px-2.5 py-1.5 rounded-xl bg-[#091224] hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-left transition-all flex items-center gap-2 shrink-0 group cursor-pointer shadow-sm"
                    >
                      <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300 group-hover:scale-110 transition-transform">
                        {sug.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            <HighlightMatch text={sug.title} query={query} />
                          </span>
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${sug.badgeColor || 'bg-amber-500/20 text-amber-300'}`}>
                            {sug.badge}
                          </span>
                        </div>
                        {sug.subtitle && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {sug.subtitle}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-3 h-3 text-amber-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Popular Searches (when search query is empty) */}
            {!queryClean && (
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Popular:</span>
                </span>
                {POPULAR_SEARCH_SUGGESTIONS.map(pop => {
                  const Icon = pop.icon;
                  return (
                    <button
                      key={pop.label}
                      type="button"
                      onClick={() => {
                        setQuery(pop.query);
                        if (pop.serviceCategory !== 'all') {
                          setSelectedServiceCategory(pop.serviceCategory);
                        }
                        setSelectedIndex(0);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-[#0B1426] hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/40 text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Icon className="w-3 h-3 text-amber-400" />
                      <span>{pop.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Primary Category Filter Pills */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-[#091120] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-white/10 text-slate-400'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Service Category Filter Bar */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter by Service Category:</span>
                {selectedServiceCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServiceCategory('all');
                      setSelectedIndex(0);
                    }}
                    className="ml-2 inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {availableServiceCategories.map(svcCat => {
                  const isCatSelected = selectedServiceCategory === svcCat.id;
                  const Icon = svcCat.icon;
                  const count = svcCat.id === 'all' 
                    ? services.length 
                    : services.filter(s => s.category === svcCat.id).length;

                  return (
                    <button
                      key={svcCat.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceCategory(svcCat.id);
                        if (activeCategory !== 'all' && activeCategory !== 'service' && activeCategory !== 'inventory') {
                          setActiveCategory('service');
                        }
                        setSelectedIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isCatSelected
                          ? 'bg-amber-400 text-slate-950 font-black shadow-sm ring-1 ring-amber-300'
                          : 'bg-[#080E1C] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                      }`}
                      title={svcCat.label}
                    >
                      <Icon className={`w-3 h-3 ${isCatSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>{svcCat.shortLabel || svcCat.label}</span>
                      {count > 0 && (
                        <span className={`text-[9px] px-1.2 py-0.1 rounded ${
                          isCatSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-white/10 text-slate-400'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Dual-Pane Interactive Layout: Left Results List | Right 3D Interactive Preview Inspector */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[380px] max-h-[58vh]">
            
            {/* Left Column: Results List */}
            <div 
              ref={listRef} 
              className="lg:col-span-7 p-2 sm:p-3 overflow-y-auto space-y-1.5 border-b lg:border-b-0 lg:border-r border-amber-500/15 max-h-[40vh] lg:max-h-full"
            >
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Matching Records ({filteredResults.length})</span>
                  {selectedServiceCategory !== 'all' && (
                    <span className="text-[10px] font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      Category: {availableServiceCategories.find(c => c.id === selectedServiceCategory)?.shortLabel || selectedServiceCategory}
                    </span>
                  )}
                </div>
                {queryClean && <span className="text-amber-300 lowercase font-normal">query: &ldquo;{queryClean}&rdquo;</span>}
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-8 text-center space-y-3 text-slate-400">
                  <HelpCircle className="w-10 h-10 mx-auto opacity-40 text-amber-400" />
                  <p className="text-sm font-bold text-white">No results matching &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing service category filters or searching by client name (<strong className="text-amber-300">Dr. Sarah</strong>, <strong className="text-amber-300">Kenneth</strong>), reference code (<strong className="text-amber-300">SBL-2026</strong>), city (<strong className="text-amber-300">Masaka</strong>, <strong className="text-amber-300">Munyonyo</strong>), or equipment (<strong className="text-amber-300">Mega Tents</strong>, <strong className="text-amber-300">Line Array</strong>).
                  </p>
                  {selectedServiceCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedServiceCategory('all')}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Category Filter</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {visibleResults.map((result, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={result.id}
                        onClick={() => result.onSelect()}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer text-left relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0F1E38] via-[#142646] to-[#0F1E38] border border-amber-400/60 text-white shadow-xl shadow-amber-500/5'
                            : 'hover:bg-white/5 border border-white/5 text-slate-300'
                        }`}
                      >
                        {/* Active Indicator Bar */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500" />
                        )}

                        <div className="flex items-center gap-3 min-w-0">
                          {/* Icon / Thumbnail */}
                          {result.image ? (
                            <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/15 shrink-0 relative">
                              <img
                                src={result.image}
                                alt={result.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                          ) : (
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              isSelected 
                                ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md' 
                                : 'bg-[#091120] text-slate-300 border-white/10'
                            }`}>
                              {result.icon}
                            </div>
                          )}

                          {/* Title & Metadata */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                                <HighlightMatch text={result.title} query={deferredQuery} />
                              </h4>
                              {result.badge && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${result.badgeColor || 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                                  {result.badge}
                                </span>
                              )}
                              {result.serviceCategoryLabel && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                                  {result.serviceCategoryLabel}
                                </span>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                <HighlightMatch text={result.subtitle} query={deferredQuery} />
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300">
                              <span className="text-amber-300 font-semibold">{result.categoryLabel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Action Trigger */}
                        <div className="flex items-center gap-1 shrink-0 text-slate-400">
                          {isSelected ? (
                            <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
                              <span>Inspect</span>
                              <CornerDownLeft className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredResults.length > visibleResults.length && (
                    <div className="p-2.5 text-center text-[11px] text-slate-400 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Showing top 30 of {filteredResults.length} matching records. Type further to pinpoint.</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Column: 3D Interactive Live Inspector & Preview Panel */}
            <div className="hidden lg:flex lg:col-span-5 p-4 bg-[#050914]/90 flex-col justify-between overflow-y-auto relative">
              {activeResult ? (
                <div
                  ref={previewCardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.12s ease-out'
                  }}
                  className="w-full rounded-2xl bg-gradient-to-b from-[#0C1527] to-[#070D18] border border-amber-400/40 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4"
                >
                  {/* Dynamic 3D Specular Sheen Overlay */}
                  <div
                    ref={specularGlowRef}
                    className="absolute inset-0 pointer-events-none opacity-40 transition-opacity"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.25) 0%, transparent 60%)'
                    }}
                  />

                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {activeResult.categoryLabel}
                      </span>
                      {activeResult.badge && (
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${activeResult.badgeColor || 'bg-white/10 text-white border-white/20'}`}>
                          {activeResult.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      3D Preview
                    </span>
                  </div>

                  {/* 1. PREVIEW: CLIENT DETAILS RECORD */}
                  {activeResult.clientData ? (
                    <div className="space-y-4 relative z-10">
                      {/* Client Header Card */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg">
                          {activeResult.clientData.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-black text-white truncate font-['Outfit']">
                            {activeResult.clientData.name}
                          </h3>
                          {activeResult.clientData.company && (
                            <p className="text-xs text-amber-300 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              <span>{activeResult.clientData.company}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono font-bold text-slate-300">
                              {activeResult.clientData.reference}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(activeResult.clientData!.reference, 'Reference Number');
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition-colors"
                              title="Copy Reference"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Event Key Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Event Date</span>
                          <span className="font-bold text-white flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {activeResult.clientData.date}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Venue Location</span>
                          <span className="font-bold text-white truncate flex items-center gap-1" title={activeResult.clientData.location}>
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{activeResult.clientData.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Financial Ledger Balance Bar if available */}
                      {activeResult.clientData.estimatedTotal !== undefined && (
                        <div className="p-3 rounded-xl bg-[#060B14] border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-300">Total Quote:</span>
                            <span className="text-white font-mono">UGX {activeResult.clientData.estimatedTotal.toLocaleString()}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
                            <div>
                              <span className="text-slate-300 block">Paid:</span>
                              <span className="font-bold text-emerald-400 font-mono">
                                UGX {(activeResult.clientData.amountPaid || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-300 block">Balance Due:</span>
                              <span className="font-bold text-amber-300 font-mono">
                                UGX {(activeResult.clientData.balanceDue || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes / Special Requests */}
                      {activeResult.clientData.notes && (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                          <span className="text-[10px] font-bold text-slate-300 uppercase block">Ledger Notes / Needs</span>
                          <p className="text-[11px] line-clamp-2 text-slate-200">{activeResult.clientData.notes}</p>
                        </div>
                      )}

                      {/* Client Direct Action Quick Triggers */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`tel:${activeResult.clientData.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Client</span>
                        </a>

                        <a
                          href={`https://wa.me/${activeResult.clientData.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ) : activeResult.archiveData ? (
                    /* 2. PREVIEW: HISTORICAL EVENT ARCHIVE */
                    <div className="space-y-3 relative z-10">
                      {/* Archive Photo Banner */}
                      {activeResult.archiveData.image && (
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-amber-400/30 relative shadow-lg">
                          <img
                            src={activeResult.archiveData.image}
                            alt={activeResult.archiveData.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-bold text-white">
                            <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              {activeResult.archiveData.location}
                            </span>
                            {activeResult.archiveData.attendees && (
                              <span className="bg-amber-500/80 text-slate-950 px-2 py-0.5 rounded font-black">
                                {activeResult.archiveData.attendees}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-black text-white font-['Outfit'] leading-snug">
                          {activeResult.archiveData.title}
                        </h3>
                        <p className="text-xs text-amber-300 font-semibold mt-0.5">
                          Archive Timeline: {activeResult.archiveData.date}
                        </p>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                          {activeResult.archiveData.description}
                        </p>
                      </div>

                      {/* Equipment / Services Deployed in setup */}
                      {activeResult.archiveData.servicesProvided && activeResult.archiveData.servicesProvided.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-white/10">
                          <span className="text-[10px] font-bold text-slate-300 uppercase block">Equipment Rigged &amp; Deployed:</span>
                          <div className="flex flex-wrap gap-1">
                            {activeResult.archiveData.servicesProvided.map((s, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeResult.serviceData ? (
                    /* 3. PREVIEW: SERVICE CATALOG */
                    <div className="space-y-3 relative z-10">
                      {activeResult.serviceData.image && (
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-amber-400/30 relative shadow-lg">
                          <img
                            src={activeResult.serviceData.image}
                            alt={activeResult.serviceData.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 text-xs font-bold text-white">
                            Capacity: {activeResult.serviceData.capacity || 'All Scales'}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-black text-white font-['Outfit']">
                          {activeResult.serviceData.title}
                        </h3>
                        <p className="text-xs text-amber-300 font-semibold mt-0.5">
                          {activeResult.serviceData.tagline}
                        </p>

                        {activeResult.serviceData.serviceCategoryLabel && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">Category:</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (activeResult.serviceData?.serviceCategory) {
                                  setSelectedServiceCategory(activeResult.serviceData.serviceCategory);
                                  setActiveCategory('service');
                                  setSelectedIndex(0);
                                  showToast('Category Filter Applied', `Showing all services in "${activeResult.serviceData.serviceCategoryLabel}"`, 'info');
                                }
                              }}
                              className="px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Filter by this service category"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              <span>{activeResult.serviceData.serviceCategoryLabel}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {activeResult.serviceData.basePrice && (
                        <div className="p-2.5 rounded-xl bg-[#060B14] border border-amber-500/30 flex items-center justify-between text-xs">
                          <span className="text-slate-300">Starting Rental:</span>
                          <span className="font-bold text-amber-300 font-mono text-sm">
                            UGX {activeResult.serviceData.basePrice.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{activeResult.serviceData.priceUnit}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : activeResult.inventoryData ? (
                    /* 4. PREVIEW: INVENTORY STOCK ITEM */
                    <div className="space-y-3 relative z-10">
                      {activeResult.inventoryData.image && (
                        <div className="w-full h-32 rounded-xl overflow-hidden border border-amber-400/30 relative">
                          <img
                            src={activeResult.inventoryData.image}
                            alt={activeResult.inventoryData.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-black text-white font-['Outfit']">
                          {activeResult.inventoryData.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          {activeResult.inventoryData.specs}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#060B14] border border-emerald-500/30 space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase block">Available Stock</span>
                          <span className="text-lg font-black text-emerald-400 font-mono">
                            {activeResult.inventoryData.available} <span className="text-xs font-normal text-slate-400">{activeResult.inventoryData.unit}</span>
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#060B14] border border-white/10 space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-300 uppercase block">Total Fleet</span>
                          <span className="text-lg font-black text-white font-mono">
                            {activeResult.inventoryData.total} <span className="text-xs font-normal text-slate-400">{activeResult.inventoryData.unit}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 5. DEFAULT PREVIEW */
                    <div className="space-y-3 relative z-10">
                      <h3 className="text-base font-black text-white font-['Outfit']">
                        {activeResult.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeResult.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Bottom Action Button on Preview Card */}
                  <button
                    type="button"
                    onClick={() => activeResult.onSelect()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer relative z-10"
                  >
                    <span>Open &amp; View Record</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                  <Search className="w-8 h-8 opacity-30 text-amber-400" />
                  <p className="text-xs">Hover or select any record on the left to preview 3D details</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer Shortcuts Navigation Bar */}
          <div className="p-3 sm:px-5 sm:py-3 bg-[#050914] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[10px] text-amber-300">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[10px] text-amber-300">↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[10px] text-amber-300">↵</kbd>
                <span>open record</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 font-mono text-[10px] text-amber-300">ESC</kbd>
                <span>dismiss</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Uganda Logistics Hotline:</span>
              <a href={`tel:${COMPANY_CONTACT_INFO.primaryPhone}`} className="text-amber-300 font-mono font-bold hover:underline">
                {COMPANY_CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
