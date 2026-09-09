export type Page = 'home' | 'services' | 'gallery' | 'about' | 'calendar' | 'testimonials' | 'contact' | 'admin' | 'stage-planner';

export interface BookingPrefill {
  serviceId?: string;
  date?: string;
  packageType?: string;
  selectedServices?: string[];
  guestCount?: number;
  eventType?: EventType;
  durationDays?: number;
  location?: string;
  estimatedTotal?: number;
  addons?: BookingAddon[];
  customRequests?: string;
}

export type ThemeMode = 
  | 'white-brown'
  | 'white-brown-light'
  | 'royal-emerald-gold' 
  | 'crimson-obsidian' 
  | 'amethyst-rosegold' 
  | 'medium-dark-blue' 
  | 'deep-navy-blue' 
  | 'slate-dark-blue' 
  | 'light-luxury';

export type ServiceCategory = 'production' | 'tents' | 'lighting' | 'sound-mc' | 'screens' | 'restrooms' | 'b2b-lending';

export interface ServicePackage {
  name: string;
  price?: number;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface ServiceVideo {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  platform?: 'tiktok' | 'youtube' | 'mp4' | 'other';
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
  videos?: ServiceVideo[];
  basePrice?: number;
  priceUnit?: string;
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
  | 'other'
  | (string & {});

export interface EventCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badge?: string;
  color: 'rose' | 'blue' | 'amber' | 'emerald' | 'purple' | 'indigo' | 'cyan' | 'slate';
  targetScale?: string;
  defaultPackageEstimate?: number;
  recommendedServices: string[];
  rentalChecklist?: string[];
  active: boolean;
  order: number;
  createdAt?: string;
}

export interface SiteAnnouncement {
  enabled: boolean;
  badge: string;
  message: string;
  actionText?: string;
  actionType?: 'booking' | 'whatsapp' | 'phone' | 'calendar' | 'gallery';
  urgent?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingAddon {
  id: string;
  name: string;
  price?: number;
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
  addons?: BookingAddon[];
  customRequests: string;
  powerRequirement?: 'generator_needed' | 'venue_power_available' | 'unsure';
  tentSizeNeeded?: string;
  lightingStyle?: string;
  estimatedTotal?: number;
  paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'overdue';
  amountPaid?: number;
  balanceDue?: number;
  paymentDueDate?: string;
  lastReminderSentAt?: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  assignedStaffId?: string;
  isQuickBooking?: boolean;
}

export type AdminAlertCategory = 'booking' | 'callback' | 'review' | 'settings' | 'login' | 'system';

export interface AdminLiveAlert {
  id: string;
  category: AdminAlertCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  booking?: Booking;
  callback?: CallbackRequest;
  testimonial?: Testimonial;
  actionType?: 'review_booking' | 'confirm_booking' | 'view_callbacks' | 'call_client' | 'view_reviews' | 'approve_review' | 'view_logs' | 'dismiss';
  metadata?: Record<string, any>;
  source?: 'quick_booking' | 'firestore_live' | 'manual' | 'client_action';
}

export type AdminBookingAlert = AdminLiveAlert;

export type ActivityLogCategory = 'booking_change' | 'user_login' | 'settings_update' | 'inventory_change' | 'service_change' | 'system';

export interface ActivityLog {
  id: string;
  category: ActivityLogCategory;
  action: string;
  title: string;
  description: string;
  performedBy: {
    userId?: string;
    name: string;
    role?: string;
    isSystem?: boolean;
  };
  metadata?: {
    bookingId?: string;
    referenceNumber?: string;
    clientName?: string;
    oldValue?: string | number | boolean;
    newValue?: string | number | boolean;
    ipOrLocation?: string;
    [key: string]: any;
  };
  timestamp: string;
  createdAt: string;
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
  relatedBookingId?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  companyOrEvent: string;
  content: string;
  rating: number; // 1-5
  date: string;
  image?: string;
  avatarIcon?: string;
  avatarBg?: string;
  eventType: EventType;
  verified: boolean;
  approved: boolean;
  featured?: boolean;
}

export interface CallbackRequest {
  id: string;
  clientName: string;
  phone: string;
  eventInterest?: string;
  preferredTime?: string;
  notes?: string;
  status: 'pending' | 'called' | 'converted' | 'dismissed';
  createdAt: string;
}

export interface VideoReel {
  id: string;
  title: string;
  description: string;
  category: 'megatent' | 'weddings' | 'screens' | 'lighting' | 'sound' | 'Dome Tents' | string;
  tiktokHandle: string;
  tiktokUrl?: string;
  videoUrl?: string;
  hotline?: string;
  thumbnail: string;
  badge: string;
  duration: string;
  viewsCount?: string;
  likesCount?: string;
  location?: string;
  equipmentHighlights?: string[];
  audioTranscriptNotes?: string;
  ugxEstimate?: number;
}

export interface TikTokSectionConfig {
  badge: string;
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokHandle: string;
  hotline: string;
  // Extended/alias fields for UI flexibility
  badgeText?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  subtitle?: string;
  profileUrl?: string;
  buttonLabel?: string;
  followersCount?: string;
  likesCount?: string;
  isLiveNow?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  clientName?: string;
  category: string;
  image: string;
  location: string;
  date: string;
  attendees?: string;
  description: string;
  servicesProvided: string[];
  isFeaturedRealSetup?: boolean;
  tiktokHandle?: string;
  tiktokUrl?: string;
  videoUrl?: string;
  galleryImages?: string[];
  photos?: string[];
  badge?: string;
  postedBy?: string;
  createdAt?: string;
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
  referenceNumber?: string;
  actionLabel?: string;
  onAction?: () => void;
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

export type CardEditorType = 'service' | 'category' | 'gallery' | 'reel' | 'testimonial' | 'event';

export interface CardEditorItem {
  type: CardEditorType;
  data: any;
}
