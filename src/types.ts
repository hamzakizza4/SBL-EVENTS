export type Page = 'home' | 'services' | 'gallery' | 'about' | 'calendar' | 'testimonials' | 'contact' | 'admin';

export type ThemeMode = 'medium-dark-blue' | 'deep-navy-blue' | 'slate-dark-blue' | 'light-luxury';

export type ServiceCategory = 'production' | 'tents' | 'lighting' | 'sound-mc' | 'screens' | 'restrooms' | 'b2b-lending';

export interface ServicePackage {
  name: string;
  price: number;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  category: ServiceCategory;
  shortDesc: string;
  fullDesc: string;
  image: string;
  galleryImages: string[];
  basePrice: number;
  priceUnit: string;
  features: string[];
  specs: { label: string; value: string }[];
  capacityOrScale?: string;
  b2bAvailable: boolean;
  packages?: ServicePackage[];
}

export type EventType = 
  | 'wedding' 
  | 'corporate' 
  | 'concert_festival' 
  | 'private_party' 
  | 'outdoor_expo' 
  | 'cultural_religious' 
  | 'tent_lending_b2b'
  | 'other';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  clientName: string;
  email: string;
  phone: string;
  companyName?: string;
  eventType: EventType;
  eventDate: string;
  endDate?: string;
  durationDays: number;
  location: string;
  venueType: 'outdoor_grass' | 'outdoor_concrete' | 'indoor_hall' | 'beach' | 'private_compound';
  guestCount: number;
  selectedServices: string[]; // Service IDs
  addons: BookingAddon[];
  customRequests: string;
  powerRequirement?: 'generator_needed' | 'venue_power_available' | 'unsure';
  tentSizeNeeded?: string;
  lightingStyle?: string;
  estimatedTotal: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  assignedStaffId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  eventType: EventType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  location: string;
  status: 'booked' | 'tentative' | 'public_showcase' | 'maintenance_blackout';
  servicesSummary: string[];
  clientName?: string;
  guestCount?: number;
  isPublic?: boolean;
  publicDescription?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  companyOrEvent: string;
  content: string;
  rating: number; // 1-5
  date: string;
  image: string;
  eventType: EventType;
  verified: boolean;
  approved: boolean;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: ServiceCategory | 'all' | 'weddings' | 'corporate' | 'concerts';
  image: string;
  location: string;
  date: string;
  attendees: string;
  description: string;
  servicesProvided: string[];
  beforeImage?: string;
  afterImage?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
  dailyRate: number;
  specs: string;
  image: string;
  b2bEligible: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  specialty: string;
  bio: string;
  image: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// User & Sub-Admin / Employee Types
export type AdminRole = 
  | 'major_admin' 
  | 'operations_manager' 
  | 'tent_rigging_lead' 
  | 'av_sound_engineer' 
  | 'lighting_visuals_lead' 
  | 'booking_coordinator' 
  | 'finance_invoicing';

export interface AdminPermissions {
  canManageBookings: boolean;
  canManageSubAdmins: boolean;
  canManageCalendar: boolean;
  canManageInventory: boolean;
  canManageTestimonials: boolean;
  canManageFinances: boolean;
  canManageSettings: boolean;
}

export interface AdminUser {
  id: string;
  userId: string; // e.g. 'sbl 1000' or 'sbl 1001'
  name: string;
  email: string;
  phone?: string;
  password: string; // e.g. '123'
  role: AdminRole;
  roleTitle: string;
  isMajorAdmin: boolean;
  active: boolean;
  permissions: AdminPermissions;
  createdAt: string;
  lastLogin?: string;
}
