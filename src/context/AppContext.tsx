import React, { createContext, useContext, useState, useEffect, useCallback , useRef} from 'react';
import { 
  Page, 
  Service, 
  Booking, 
  CalendarEvent, 
  Testimonial, 
  InventoryItem, 
  GalleryItem,
  ToastMessage, 
  BookingStatus, 
  ThemeMode, 
  AdminUser,
  CallbackRequest,
  BookingPrefill,
  EventCategoryItem,
  SiteAnnouncement,
  AdminBookingAlert,
  AdminLiveAlert,
  AdminAlertCategory,
  ActivityLog,
  ActivityLogCategory,
  CardEditorType,
  CardEditorItem
} from '../types';
import { playAdminBookingChime } from '../utils/audioAlert';
import { EmailConfirmationData } from '../components/EmailConfirmationModal';
import { 
  INITIAL_SERVICES, 
  INITIAL_BOOKINGS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_TESTIMONIALS, 
  INVENTORY_ITEMS, 
  GALLERY_ITEMS,
  INITIAL_ADMIN_USERS,
  INITIAL_CALLBACK_REQUESTS,
  INITIAL_EVENT_CATEGORIES,
  INITIAL_ACTIVITY_LOGS
} from '../data/mockData';
import { checkDateRangeBlocked, isPastDate } from '../utils/bookingDateUtils';
import { 
  checkBookingRateLimit, 
  recordBookingSubmission, 
  checkCallbackRateLimit, 
  recordCallbackSubmission, 
  isDuplicatePayload 
} from '../utils/security';
import {
  syncSaveActivityLog as saveActivityLogToStore,
  syncDeleteActivityLog as deleteActivityLogFromStore,
  syncClearAllActivityLogs as clearAllActivityLogsFromStore,
  syncSaveCalendarEvent as saveCalendarEventToStore,
  syncDeleteCalendarEvent as deleteCalendarEventFromStore,
  syncSaveBooking as saveBookingToStore,
  syncUpdateBooking as updateBookingInStore,
  syncDeleteBooking as deleteBookingFromStore,
  syncBulkDeleteBookings as bulkDeleteBookingsFromStore,
  syncSaveEventCategory as saveEventCategoryToStore,
  syncDeleteEventCategory as deleteEventCategoryFromStore,
  syncSaveCallbackRequest as saveCallbackRequestToStore,
  syncUpdateCallbackRequest as updateCallbackRequestInStore,
  syncDeleteCallbackRequest as deleteCallbackRequestFromStore,
  syncSaveTestimonial as saveTestimonialToStore,
  syncDeleteTestimonial as deleteTestimonialFromStore,
  syncSaveInventoryItem as saveInventoryItemToStore,
  syncDeleteInventoryItem as deleteInventoryItemFromStore,
  syncSaveSiteSettings as saveSiteSettingsToStore,
  subscribeToLocalStore,
  STORAGE_KEYS,
  setLocalItem,
  subscribeToCalendarEvents,
  subscribeToBookings,
  subscribeToServices,
  subscribeToGallery,
  subscribeToCategories,
  subscribeToCallbacks,
  subscribeToTestimonials,
  subscribeToInventory,
  subscribeToSiteSettings,
  subscribeToActivityLogs,
  seedFirestoreIfEmpty
} from '../services/unifiedSync';
import { seedInitialDataIfEmpty } from '../services/localStorageSync';
import { useAdminContentSync, ContentSyncStatus } from './AdminContentSyncContext';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  services: Service[];

  bookings: Booking[];
  calendarEvents: CalendarEvent[];
  testimonials: Testimonial[];
  inventory: InventoryItem[];
  galleryItems: GalleryItem[];
  callbackRequests: CallbackRequest[];
  
  // Buffer days configuration (Default: 2 days before event unavailable for setup/rigging)
  bufferDaysBefore: number;
  bufferDaysAfter: number;
  setBufferDaysBefore: (days: number) => void;
  setBufferDaysAfter: (days: number) => void;
  
  // Admin & Sub-Admins Authentication
  adminUsers: AdminUser[];
  currentAdminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (userIdOrPin: string, passwordInput?: string) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  toggleAdminUserStatus: (id: string) => void;

  // Booking actions
  addBooking: (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'status'>) => Booking | null;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => void;
  updateBookingPayment: (
    id: string, 
    paymentUpdates: { 
      amountPaid?: number; 
      balanceDue?: number; 
      paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'overdue'; 
      paymentDueDate?: string; 
      notes?: string;
      lastReminderSentAt?: string;
    }
  ) => void;
  sendPaymentReminderEmail: (bookingId: string, customMessage?: string) => void;
  bulkSendPaymentReminders: (bookingIds: string[], customMessage?: string) => { sentCount: number; totalBalance: number };
  deleteBooking: (id: string) => void;
  bulkDeleteBookings: (bookingIds: string[]) => void;
  bulkUpdateBookingStatus: (bookingIds: string[], status: BookingStatus) => void;
  
  // Callback actions
  addCallbackRequest: (req: Omit<CallbackRequest, 'id' | 'createdAt' | 'status'>) => CallbackRequest;
  updateCallbackStatus: (id: string, status: 'pending' | 'called' | 'converted' | 'dismissed') => void;
  deleteCallbackRequest: (id: string) => void;
  
  // Calendar actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  // Testimonial actions
  addTestimonial: (test: Omit<Testimonial, 'id' | 'date' | 'approved' | 'verified'>) => void;
  addAdminTestimonial: (test: Omit<Testimonial, 'id' | 'date'>) => Testimonial;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  
  // Inventory actions
  updateInventoryQuantity: (id: string, total: number, available: number, dailyRate?: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Event Categories & Catalog Management (Created & Managed in Admin)
  eventCategories: EventCategoryItem[];
  addEventCategory: (category: Omit<EventCategoryItem, 'id' | 'createdAt'>) => EventCategoryItem;
  updateEventCategory: (id: string, updates: Partial<EventCategoryItem>) => void;
  deleteEventCategory: (id: string) => void;
  toggleEventCategoryStatus: (id: string) => void;
  reorderEventCategories: (categories: EventCategoryItem[]) => void;
  resetEventCategoriesToDefault: () => void;

  // Events Done & Gallery Management actions (Posted by Admin)
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  resetGalleryToDefault: () => void;
  
  // Services & Media Management actions (Pictures and Videos)
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addServiceImage: (serviceId: string, imageUrl: string) => void;
  removeServiceImage: (serviceId: string, imageIndex: number) => void;
  setServiceCoverImage: (serviceId: string, imageUrl: string) => void;
  addServiceVideo: (serviceId: string, video: { title: string; url: string; platform?: 'tiktok' | 'youtube' | 'mp4' | 'other' }) => void;
  removeServiceVideo: (serviceId: string, videoId: string) => void;
  resetServicesToDefault: () => void;
  
  // Quick booking drawer helper
  isBookingModalOpen: boolean;
  openBookingModal: (prefill?: BookingPrefill) => void;
  closeBookingModal: () => void;
  bookingPrefill: BookingPrefill | null;

  // Splash Screen
  isSplashScreenOpen: boolean;
  openSplashScreen: () => void;
  closeSplashScreen: () => void;

  // Site-Wide Live Announcement / Promotion Banner (Admin Controlled)
  announcement: SiteAnnouncement;
  updateAnnouncement: (updates: Partial<SiteAnnouncement>) => void;
  resetAnnouncementToDefault: () => void;

  // Global Command Palette & Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Keyboard Shortcuts Guide Modal
  isShortcutsOpen: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
  
  // Email Confirmation Mock Trigger
  isEmailModalOpen: boolean;
  activeEmailConfirmation: EmailConfirmationData | null;
  openEmailModal: (data: EmailConfirmationData) => void;
  closeEmailModal: () => void;
  triggerMockEmailConfirmation: (
    booking: Booking | { referenceNumber: string; clientName: string; email?: string; phone: string; eventType: string; eventDate: string; location: string; durationDays?: number; guestCount?: number; selectedServices?: string[]; customRequests?: string },
    customEmail?: string
  ) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (
    title: string, 
    message: string, 
    type?: 'success' | 'info' | 'warning' | 'error',
    referenceNumber?: string,
    actionLabel?: string,
    onAction?: () => void
  ) => void;
  removeToast: (id: string) => void;

  // Admin Card Quick Editor Modal
  cardEditorItem: CardEditorItem | null;
  openCardEditor: (type: CardEditorType, data: any) => void;
  closeCardEditor: () => void;

  // Booking loading state & Firestore Perceived Performance
  isBookingsLoading: boolean;
  fastSync: () => Promise<void>;
  simulateFirestoreFetch: () => Promise<void>;

  // Admin Quick Booking Toast Alert System
  adminBookingAlerts: AdminLiveAlert[];
  triggerAdminLiveNotification: (alert: {
    category: AdminAlertCategory;
    title: string;
    message: string;
    priority?: 'normal' | 'high' | 'urgent';
    booking?: Booking;
    callback?: CallbackRequest;
    testimonial?: Testimonial;
    actionType?: 'review_booking' | 'confirm_booking' | 'view_callbacks' | 'call_client' | 'view_reviews' | 'approve_review' | 'view_logs' | 'dismiss';
    metadata?: Record<string, any>;
    source?: 'quick_booking' | 'firestore_live' | 'manual' | 'client_action';
  }) => void;
  activityLogs: ActivityLog[];
  isActivityLogsLoading: boolean;
  refreshActivityLogs: () => Promise<void>;
  logActivity: (category: ActivityLogCategory, action: string, title: string, description: string, metadata?: Record<string, any>) => Promise<void>;
  deleteActivityLog: (id: string) => Promise<void>;
  clearAllActivityLogs: () => Promise<void>;
  dismissAdminAlert: (alertId: string) => void;
  clearAllAdminAlerts: () => void;
  triggerQuickBookingAlert: (booking: Booking, source?: 'quick_booking' | 'firestore_live' | 'manual') => void;

  // Real-Time Cloud Firestore Content Synchronization Telemetry
  syncStatus: ContentSyncStatus;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  isCloudConnected: boolean;
  pendingSyncCount: number;
  forceRefreshFromCloud: () => Promise<void>;
  retryPendingSync: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SERVICES: 'sbl_events_services_v3',
  THEME: 'sbl_events_theme_v4',
  BOOKINGS: 'sbl_events_bookings_v2',
  CALENDAR: 'sbl_events_calendar_v2',
  TESTIMONIALS: 'sbl_events_testimonials_v2',
  INVENTORY: 'sbl_events_inventory_v2',
  GALLERY: 'sbl_events_gallery_v2',
  ADMIN_AUTH: 'sbl_events_admin_auth_v2',
  ADMIN_USERS: 'sbl_events_admin_users_v2',
  ACTIVE_USER: 'sbl_events_active_user_v2',
  CALLBACKS: 'sbl_events_callbacks_v2',
  BUFFER_BEFORE: 'sbl_events_buffer_before_v1',
  BUFFER_AFTER: 'sbl_events_buffer_after_v1',
  CATEGORIES: 'sbl_events_categories_v1',
  ANNOUNCEMENT: 'sbl_events_announcement_v1',
  ACTIVITY_LOGS: 'sbl_events_activity_logs_v1',
};

const INITIAL_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: true,
  badge: 'SBL EVENTS DISPATCH',
  message: 'Now Booking Weddings, Kwanjulas & Concerts in Masaka, Lwengo & Nationwide • Heavy Standby Generator included on full packages!',
  actionText: 'Get Free Quote',
  actionType: 'booking',
  urgent: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  // Global Content Synchronization Hook (Immediate Firestore Persistence & Portability)
  const contentSync = useAdminContentSync();
  const services = contentSync.services;

  // Theme mode: Default is medium-dark-blue (Royal Blue & Crisp White - Original Signature)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      if (!saved || saved === 'white-brown' || saved === 'royal-emerald-gold' || saved === 'amethyst-rosegold' || saved === 'crimson-obsidian') {
        return 'medium-dark-blue';
      }
      return (saved as ThemeMode) || 'medium-dark-blue';
    } catch {
      return 'medium-dark-blue';
    }
  });

  // Admin Users / Employees List
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_USERS);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  // Currently Logged In Admin / Sub-admin
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_USER);
      if (saved) {
        return JSON.parse(saved);
      }
      const isAuth = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
      if (isAuth) {
        return INITIAL_ADMIN_USERS[0]; // Major Admin by default
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Bookings with localStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : (INITIAL_BOOKINGS as Booking[]);
    } catch {
      return INITIAL_BOOKINGS as Booking[];
    }
  });

  // Immediate high-speed store state (no endless skeleton blocking)
  const [isBookingsLoading, setIsBookingsLoading] = useState<boolean>(false);

  // Dedicated Admin Quick Booking Toast Alert System state
  const [adminBookingAlerts, setAdminBookingAlerts] = useState<AdminLiveAlert[]>([]);

  // Activity Logs with localStorage and Cloud Firestore sync
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });
  const [isActivityLogsLoading, setIsActivityLogsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  // Calendar events with localStorage
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CALENDAR);
      return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  // Testimonials with localStorage
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TESTIMONIALS);
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  // Inventory with localStorage
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INVENTORY_ITEMS;
    } catch {
      return INVENTORY_ITEMS;
    }
  });

  // Events Done & Gallery from ContentSync (Immediate Firestore persistence)
  const galleryItems = contentSync.galleryItems;

  // Callbacks with localStorage
  const [callbackRequests, setCallbackRequests] = useState<CallbackRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CALLBACKS);
      return saved ? JSON.parse(saved) : INITIAL_CALLBACK_REQUESTS;
    } catch {
      return INITIAL_CALLBACK_REQUESTS;
    }
  });

  // Event Categories with localStorage (Admin Managed)
  const [eventCategories, setEventCategories] = useState<EventCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_EVENT_CATEGORIES;
    } catch {
      return INITIAL_EVENT_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(eventCategories));
    } catch {
      // ignore
    }
  }, [eventCategories]);

  // Booking Modal drawer
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | null>(null);

  // Site-Wide Announcement / Promotion Banner (Admin Controlled)
  const [announcement, setAnnouncement] = useState<SiteAnnouncement>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENT);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENT;
    } catch {
      return INITIAL_ANNOUNCEMENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
    } catch {
      // ignore
    }
  }, [announcement]);

  const isAdminLoggedInRef = useRef(isAdminLoggedIn);
  useEffect(() => {
    isAdminLoggedInRef.current = isAdminLoggedIn;
  }, [isAdminLoggedIn]);

  // Global Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin Card Quick Editor State
  const [cardEditorItem, setCardEditorItem] = useState<CardEditorItem | null>(null);

  const openCardEditor = useCallback((type: CardEditorType, data: any) => {
    setCardEditorItem({ type, data });
  }, []);

  const closeCardEditor = useCallback(() => {
    setCardEditorItem(null);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = useCallback(
    (
      title: string, 
      message: string, 
      type: 'success' | 'info' | 'warning' | 'error' = 'success',
      referenceNumber?: string,
      actionLabel?: string,
      onAction?: () => void
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, title, message, type, referenceNumber, actionLabel, onAction };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 6500);
    },
    []
  );

  const dismissAdminAlert = useCallback((alertId: string) => {
    setAdminBookingAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const clearAllAdminAlerts = useCallback(() => {
    setAdminBookingAlerts([]);
  }, []);

  // Admin Live Notification Trigger
  const triggerAdminLiveNotification = useCallback(
    (alertData: {
      category: AdminAlertCategory;
      title: string;
      message: string;
      priority?: 'normal' | 'high' | 'urgent';
      booking?: Booking;
      callback?: CallbackRequest;
      testimonial?: Testimonial;
      actionType?: 'review_booking' | 'confirm_booking' | 'view_callbacks' | 'call_client' | 'view_reviews' | 'approve_review' | 'view_logs' | 'dismiss';
      metadata?: Record<string, any>;
      source?: 'quick_booking' | 'firestore_live' | 'manual' | 'client_action';
    }) => {
      const alertId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newAlert: AdminLiveAlert = {
        id: alertId,
        category: alertData.category,
        title: alertData.title,
        message: alertData.message,
        priority: alertData.priority || 'normal',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        booking: alertData.booking,
        callback: alertData.callback,
        testimonial: alertData.testimonial,
        actionType: alertData.actionType,
        metadata: alertData.metadata,
        source: alertData.source || 'manual',
      };

      setAdminBookingAlerts((prev) => [newAlert, ...prev.slice(0, 14)]);
      playAdminBookingChime();

      // Also trigger global toast notification
      showToast(
        alertData.title,
        alertData.message,
        alertData.priority === 'urgent' ? 'warning' : 'info',
        alertData.booking?.referenceNumber,
        alertData.category === 'booking' ? 'Review in Admin' : alertData.category === 'callback' ? 'View Callbacks' : 'Open Admin',
        () => {
          setCurrentPage('admin');
        }
      );
    },
    [setCurrentPage, showToast]
  );

  const triggerQuickBookingAlert = useCallback(
    (booking: Booking, source: 'quick_booking' | 'firestore_live' | 'manual' = 'quick_booking') => {
      triggerAdminLiveNotification({
        category: 'booking',
        title: '⚡ New Booking Request!',
        message: `${booking.clientName} requested ${booking.eventType.replace('_', ' ')} (${booking.eventDate}). Ref: #${booking.referenceNumber}`,
        priority: 'urgent',
        booking,
        actionType: 'review_booking',
        source,
      });
    },
    [triggerAdminLiveNotification]
  );

  // Activity Logs Management
  const logActivity = useCallback(
    async (
      category: ActivityLogCategory,
      action: string,
      title: string,
      description: string,
      metadata?: Record<string, any>
    ) => {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category,
        action,
        title,
        description,
        performedBy: currentAdminUser
          ? {
              userId: currentAdminUser.userId,
              name: currentAdminUser.name,
              role: currentAdminUser.roleTitle,
              isSystem: false,
            }
          : {
              name: metadata?.clientName || 'System',
              role: metadata?.clientName ? 'Client Web Portal' : 'System Automation',
              isSystem: !metadata?.clientName,
            },
        metadata,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      setActivityLogs((prev) => [newLog, ...prev]);
      saveActivityLogToStore(newLog).catch(console.error);
    },
    [currentAdminUser]
  );

  const deleteActivityLog = useCallback(async (id: string) => {
    setActivityLogs((prev) => prev.filter((l) => l.id !== id));
    deleteActivityLogFromStore(id).catch(console.error);
  }, []);

  const clearAllActivityLogs = useCallback(async () => {
    const ids = activityLogs.map((l) => l.id);
    setActivityLogs([]);
    clearAllActivityLogsFromStore(ids).catch(console.error);
  }, [activityLogs]);

  const refreshActivityLogs = useCallback(async () => {
    setIsActivityLogsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsActivityLogsLoading(false);
  }, []);

  const updateAnnouncement = (updates: Partial<SiteAnnouncement>) => {
    const updated = { ...announcement, ...updates };
    setAnnouncement(updated);
    saveSiteSettingsToStore({ announcement: updated }).catch(console.error);
    showToast('Announcement Updated', 'Live site promotion banner updated successfully.', 'success');
  };

  const resetAnnouncementToDefault = () => {
    setAnnouncement(INITIAL_ANNOUNCEMENT);
    saveSiteSettingsToStore({ announcement: INITIAL_ANNOUNCEMENT }).catch(console.error);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENT);
    } catch {
      // ignore
    }
    showToast('Announcement Reset', 'Default site promotion banner restored.', 'info');
  };

  // Splash Screen (Always active on app launch, accessible via Navbar/Footer anytime)
  const [isSplashScreenOpen, setIsSplashScreenOpen] = useState<boolean>(true);

  const openSplashScreen = useCallback(() => {
    setIsSplashScreenOpen(true);
  }, []);

  const closeSplashScreen = useCallback(() => {
    setIsSplashScreenOpen(false);
  }, []);

  // Email Confirmation Mock Modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [activeEmailConfirmation, setActiveEmailConfirmation] = useState<EmailConfirmationData | null>(null);

  // Global Command Palette & Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);

  // Keyboard Shortcuts Guide Modal
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const openShortcuts = useCallback(() => setIsShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsShortcutsOpen(false), []);
  const toggleShortcuts = useCallback(() => setIsShortcutsOpen(prev => !prev), []);

  const openEmailModal = useCallback((data: EmailConfirmationData) => {
    setActiveEmailConfirmation(data);
    setIsEmailModalOpen(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
  }, []);

  // Buffer Days: By default 2 days BEFORE event unavailable for setup/tent rigging/staging
  const [bufferDaysBefore, setBufferDaysBeforeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BUFFER_BEFORE);
      return saved !== null ? parseInt(saved, 10) : 2;
    } catch {
      return 2;
    }
  });

  const [bufferDaysAfter, setBufferDaysAfterState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BUFFER_AFTER);
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const setBufferDaysBefore = (days: number) => {
    const clamped = Math.max(0, Math.min(10, days));
    setBufferDaysBeforeState(clamped);
    saveSiteSettingsToStore({ bufferDaysBefore: clamped }).catch(console.error);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BUFFER_BEFORE, clamped.toString());
    } catch {
      // ignore
    }
    showToast('Setup Buffer Updated', `${clamped} day${clamped === 1 ? '' : 's'} prior to event now set as unavailable for logistics/rigging.`, 'info');
  };

  const setBufferDaysAfter = (days: number) => {
    const clamped = Math.max(0, Math.min(10, days));
    setBufferDaysAfterState(clamped);
    saveSiteSettingsToStore({ bufferDaysAfter: clamped }).catch(console.error);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BUFFER_AFTER, clamped.toString());
    } catch {
      // ignore
    }
    showToast('Teardown Buffer Updated', `${clamped} day${clamped === 1 ? '' : 's'} after event now set as unavailable for fleet recovery.`, 'info');
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch {
      // ignore
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_USERS, JSON.stringify(adminUsers));
    } catch {
      // ignore
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      if (currentAdminUser) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_USER, JSON.stringify(currentAdminUser));
        localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_USER);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch {
      // ignore
    }
  }, [currentAdminUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
    } catch {
      // ignore
    }
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch {
      // ignore
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch {
      // ignore
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GALLERY, JSON.stringify(galleryItems));
    } catch {
      // ignore
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CALLBACKS, JSON.stringify(callbackRequests));
    } catch {
      // ignore
    }
  }, [callbackRequests]);

  // Real-time synchronization listeners across tabs and Cloud Firestore
  useEffect(() => {
    const initialDataset = {
      calendarEvents: INITIAL_CALENDAR_EVENTS,
      bookings: INITIAL_BOOKINGS,
      services: INITIAL_SERVICES,
      galleryItems: GALLERY_ITEMS,
      eventCategories: INITIAL_EVENT_CATEGORIES,
      testimonials: INITIAL_TESTIMONIALS,
      inventory: INVENTORY_ITEMS,
      callbackRequests: INITIAL_CALLBACK_REQUESTS,
      announcement: INITIAL_ANNOUNCEMENT,
      bufferDaysBefore: 2,
      bufferDaysAfter: 0,
      activityLogs: INITIAL_ACTIVITY_LOGS,
    };

    // Seed local cache if first visit so all lists are immediately ready
    seedInitialDataIfEmpty(initialDataset);

    // Seed Cloud Firestore if collection is empty so database has full cloud catalogue
    seedFirestoreIfEmpty(initialDataset);

    // 1. Local Storage Event Subscriptions (fast intra-browser/tab sync)
    const unsubCalendar = subscribeToLocalStore(STORAGE_KEYS.CALENDAR, (events) => {
      if (events && Array.isArray(events)) setCalendarEvents(events);
    });
    const unsubBookings = subscribeToLocalStore(STORAGE_KEYS.BOOKINGS, (b) => {
      if (b && Array.isArray(b)) setBookings(b);
    });
    const unsubCategories = subscribeToLocalStore(STORAGE_KEYS.CATEGORIES, (c) => {
      if (c && Array.isArray(c)) setEventCategories(c);
    });
    const unsubCallbacks = subscribeToLocalStore(STORAGE_KEYS.CALLBACKS, (cb) => {
      if (cb && Array.isArray(cb)) setCallbackRequests(cb);
    });
    const unsubTestimonials = subscribeToLocalStore(STORAGE_KEYS.TESTIMONIALS, (tms) => {
      if (tms && Array.isArray(tms)) setTestimonials(tms);
    });
    const unsubInventory = subscribeToLocalStore(STORAGE_KEYS.INVENTORY, (inv) => {
      if (inv && Array.isArray(inv)) setInventory(inv);
    });
    const unsubAnnouncement = subscribeToLocalStore(STORAGE_KEYS.ANNOUNCEMENT, (ann) => {
      if (ann) setAnnouncement(ann);
    });
    const unsubLogs = subscribeToLocalStore(STORAGE_KEYS.ACTIVITY_LOGS, (logs) => {
      if (logs && Array.isArray(logs)) setActivityLogs(logs);
    });

    // 2. Authoritative Cloud Firestore Live Listeners for other entities
    // (Services & Gallery are managed with immediate persistence by AdminContentSyncContext)
    const unsubFirestoreCategories = subscribeToCategories((cloudCats) => {
      if (cloudCats && cloudCats.length > 0) {
        setEventCategories(cloudCats);
        setLocalItem(STORAGE_KEYS.CATEGORIES, cloudCats);
      }
    });

    const unsubFirestoreInventory = subscribeToInventory((cloudInv) => {
      if (cloudInv && cloudInv.length > 0) {
        setInventory(cloudInv);
        setLocalItem(STORAGE_KEYS.INVENTORY, cloudInv);
      }
    });

    const unsubFirestoreTestimonials = subscribeToTestimonials((cloudTestimonials) => {
      if (cloudTestimonials && cloudTestimonials.length > 0) {
        setTestimonials(cloudTestimonials);
        setLocalItem(STORAGE_KEYS.TESTIMONIALS, cloudTestimonials);
      }
    });

    const unsubFirestoreCalendar = subscribeToCalendarEvents((cloudEvents) => {
      if (cloudEvents && cloudEvents.length > 0) {
        setCalendarEvents(cloudEvents);
        setLocalItem(STORAGE_KEYS.CALENDAR, cloudEvents);
      }
    });

    const unsubFirestoreBookings = subscribeToBookings((cloudBookings) => {
      if (cloudBookings && Array.isArray(cloudBookings)) {
        setBookings(cloudBookings);
        setLocalItem(STORAGE_KEYS.BOOKINGS, cloudBookings);
      }
    });

    const unsubFirestoreCallbacks = subscribeToCallbacks((cloudCallbacks) => {
      if (cloudCallbacks && Array.isArray(cloudCallbacks)) {
        setCallbackRequests(cloudCallbacks);
        setLocalItem(STORAGE_KEYS.CALLBACKS, cloudCallbacks);
      }
    });

    const unsubFirestoreSettings = subscribeToSiteSettings((cloudSettings) => {
      if (cloudSettings) {
        if (cloudSettings.announcement) setAnnouncement(cloudSettings.announcement);
        if (cloudSettings.bufferDaysBefore !== undefined) setBufferDaysBefore(cloudSettings.bufferDaysBefore);
        if (cloudSettings.bufferDaysAfter !== undefined) setBufferDaysAfter(cloudSettings.bufferDaysAfter);
      }
    });

    const unsubFirestoreLogs = subscribeToActivityLogs((cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setActivityLogs(cloudLogs);
        setLocalItem(STORAGE_KEYS.ACTIVITY_LOGS, cloudLogs);
      }
    });

    return () => {
      unsubCalendar();
      unsubBookings();
      unsubCategories();
      unsubCallbacks();
      unsubTestimonials();
      unsubInventory();
      unsubAnnouncement();
      unsubLogs();

      // Cloud Firestore unsubscriptions
      unsubFirestoreCategories();
      unsubFirestoreInventory();
      unsubFirestoreTestimonials();
      unsubFirestoreCalendar();
      unsubFirestoreBookings();
      unsubFirestoreCallbacks();
      unsubFirestoreSettings();
      unsubFirestoreLogs();
    };
  }, []);

  // Lightning Fast Sync: Instant in-memory refresh with zero artificial delays
  const fastSync = useCallback(async () => {
    setIsBookingsLoading(false);
    try {
      const savedBookings = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        if (Array.isArray(parsed)) setBookings(parsed);
      }
      // Refresh content sync from cloud
      contentSync.forceRefreshFromCloud().catch(console.error);
      const savedCalendar = localStorage.getItem(LOCAL_STORAGE_KEYS.CALENDAR);
      if (savedCalendar) {
        const parsed = JSON.parse(savedCalendar);
        if (Array.isArray(parsed)) setCalendarEvents(parsed);
      }
      const savedInventory = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
      if (savedInventory) {
        const parsed = JSON.parse(savedInventory);
        if (Array.isArray(parsed)) setInventory(parsed);
      }
      const savedCallbacks = localStorage.getItem(LOCAL_STORAGE_KEYS.CALLBACKS);
      if (savedCallbacks) {
        const parsed = JSON.parse(savedCallbacks);
        if (Array.isArray(parsed)) setCallbackRequests(parsed);
      }
      const savedLogs = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOGS);
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) setActivityLogs(parsed);
      }
      const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed)) setEventCategories(parsed);
      }
    } catch (err) {
      console.warn('[Fast Sync] Local re-check notice:', err);
    }
  }, []);

  const simulateFirestoreFetch = useCallback(async () => {
    await fastSync();
  }, [fastSync]);

  const triggerMockEmailConfirmation = useCallback((
    booking: Booking | { referenceNumber: string; clientName: string; email?: string; phone: string; eventType: string; eventDate: string; location: string; durationDays?: number; guestCount?: number; selectedServices?: string[]; customRequests?: string; createdAt?: string },
    customEmail?: string
  ) => {
    const targetEmail = customEmail || (booking as any).email || `${booking.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`;
    const emailData: EmailConfirmationData = {
      referenceNumber: booking.referenceNumber,
      clientName: booking.clientName,
      email: targetEmail,
      phone: booking.phone,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      location: booking.location,
      durationDays: booking.durationDays || 1,
      guestCount: booking.guestCount || 300,
      selectedServices: booking.selectedServices || [],
      customRequests: booking.customRequests || '',
      createdAt: booking.createdAt || new Date().toISOString().split('T')[0],
    };

    setActiveEmailConfirmation(emailData);
    setIsEmailModalOpen(true);

    showToast(
      '📧 Email Confirmation Dispatched',
      `Booking Ref #${booking.referenceNumber} receipt sent to ${targetEmail}. Click to view details.`,
      'success',
      booking.referenceNumber,
      'View Receipt',
      () => {
        setActiveEmailConfirmation(emailData);
        setIsEmailModalOpen(true);
      }
    );
  }, []);

  // User normalization helper (handles 'sbl 1000', 'sbl1000', 'SBL 1000')
  const normalizeId = (str: string) => str.toLowerCase().replace(/\s+/g, '');

  const loginAdmin = (userIdOrPin: string, passwordInput?: string) => {
    const inputClean = userIdOrPin.trim();
    const passClean = passwordInput !== undefined ? passwordInput.trim() : '';

    // 1. Direct Major Admin credential check: User ID: 'sbl 1000' and Password: '123'
    if (
      (normalizeId(inputClean) === 'sbl1000' || normalizeId(inputClean) === 'majoradmin' || inputClean === 'admin') &&
      (passClean === '123' || passClean === 'admin123' || !passwordInput)
    ) {
      const majorUser = adminUsers.find((u) => u.isMajorAdmin) || INITIAL_ADMIN_USERS[0];
      setCurrentAdminUser(majorUser);
      setIsAdminLoggedIn(true);
      logActivity(
        'user_login',
        'ADMIN_LOGIN',
        `Major Admin Signed In: ${majorUser.name}`,
        `Superuser ${majorUser.name} (${majorUser.roleTitle}) logged into SBL Events Management Console.`,
        { userId: majorUser.userId, role: majorUser.roleTitle }
      );
      showToast('Major Admin Access Granted', `Welcome back, ${majorUser.name}. Full superuser privileges enabled.`, 'success');
      return true;
    }

    // 2. Check if searching by user ID or email among all registered adminUsers/employees
    const matchedUser = adminUsers.find((u) => {
      const matchesId = normalizeId(u.userId) === normalizeId(inputClean);
      const matchesEmail = u.email.toLowerCase() === inputClean.toLowerCase();
      return matchesId || matchesEmail;
    });

    if (matchedUser) {
      if (!matchedUser.active) {
        showToast('Account Deactivated', 'This sub-admin account is currently inactive. Contact the Major Admin.', 'error');
        return false;
      }

      // Check password if provided, or default '123' check
      if (passClean === matchedUser.password || passClean === '123' || !passwordInput) {
        const updated = {
          ...matchedUser,
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        setCurrentAdminUser(updated);
        setIsAdminLoggedIn(true);
        setAdminUsers((prev) => prev.map((u) => (u.id === matchedUser.id ? updated : u)));
        logActivity(
          'user_login',
          'ADMIN_LOGIN',
          `Staff Signed In: ${matchedUser.name}`,
          `${matchedUser.name} (${matchedUser.roleTitle}) accessed the SBL Management Console.`,
          { userId: matchedUser.userId, role: matchedUser.roleTitle }
        );
        showToast(
          matchedUser.isMajorAdmin ? 'Major Admin Authenticated' : 'Employee Portal Access',
          `Logged in as ${matchedUser.name} (${matchedUser.roleTitle}).`,
          'success'
        );
        return true;
      }
    }

    // 3. Fallback PIN check (legacy '123' / '1234')
    if (inputClean === '123' || inputClean === '1234' || inputClean === 'admin123') {
      const majorUser = adminUsers.find((u) => u.isMajorAdmin) || INITIAL_ADMIN_USERS[0];
      setCurrentAdminUser(majorUser);
      setIsAdminLoggedIn(true);
      showToast('Authenticated', 'Access granted to SBL Events Management Console.', 'success');
      return true;
    }

    showToast('Authentication Failed', 'Invalid User ID or Password. Please check your credentials.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    if (currentAdminUser) {
      logActivity(
        'user_login',
        'ADMIN_LOGOUT',
        `Admin Signed Out: ${currentAdminUser.name}`,
        `${currentAdminUser.name} (${currentAdminUser.roleTitle}) signed out of the management console.`,
        { userId: currentAdminUser.userId, role: currentAdminUser.roleTitle }
      );
    }
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_USER);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // ignore
    }
    showToast('Logged Out', 'You have been safely signed out of the Admin Console.', 'info');
  };

  // Sub-Admin Management Functions
  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    setAdminUsers((prev) => [...prev, newUser]);
    showToast('Sub-Admin Created', `Employee ${newUser.name} (User ID: ${newUser.userId}) registered successfully.`, 'success');
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    showToast('Employee Updated', 'Account details and permissions saved.', 'info');
  };

  const deleteAdminUser = (id: string) => {
    const target = adminUsers.find((u) => u.id === id);
    if (target?.isMajorAdmin) {
      showToast('Cannot Delete Major Admin', 'The root Major Admin account is protected.', 'warning');
      return;
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Sub-Admin Removed', `Account ${target?.name} was deleted.`, 'info');
  };

  const toggleAdminUserStatus = (id: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          if (u.isMajorAdmin) return u; // Never deactivate major admin
          const newActive = !u.active;
          showToast(
            newActive ? 'Employee Activated' : 'Employee Deactivated',
            `${u.name} is now ${newActive ? 'active' : 'suspended'}.`,
            'info'
          );
          return { ...u, active: newActive };
        }
        return u;
      })
    );
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): Booking | null => {
    // 0. Public Booking Rate Limiting & Abuse Prevention (Admins are exempt)
    if (!isAdminLoggedIn) {
      const rateCheck = checkBookingRateLimit(false);
      if (!rateCheck.allowed) {
        showToast(
          'Submission Rate Limit',
          rateCheck.message || `Please wait ${rateCheck.remainingSeconds}s before submitting another booking.`,
          'warning'
        );
        return null;
      }

      // Check duplicate spam
      const signature = `${bookingData.clientName}_${bookingData.phone}_${bookingData.eventDate}_${bookingData.eventType}`;
      if (isDuplicatePayload('booking', signature, 30)) {
        showToast(
          'Duplicate Request',
          'Your booking request was already submitted a moment ago. Our dispatch team is processing it!',
          'info'
        );
        return null;
      }
    }

    // 1. Prevent selecting past dates
    if (isPastDate(bookingData.eventDate)) {
      showToast(
        'Invalid Date Selection',
        'Past dates cannot be booked. Please select today or an upcoming date.',
        'error'
      );
      return null;
    }

    // 2. Check if requested date or duration falls on a confirmed date or buffer days (before / after)
    const conflictCheck = checkDateRangeBlocked(
      bookingData.eventDate, 
      bookingData.durationDays || 1, 
      bookings, 
      calendarEvents,
      bufferDaysBefore,
      bufferDaysAfter
    );

    if (conflictCheck.isBlocked && conflictCheck.conflict) {
      showToast(
        'Selected Date Unavailable',
        `Date ${conflictCheck.conflict.date} is unavailable (${conflictCheck.conflict.reason}). Please select an alternate date.`,
        'error'
      );
      return null;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `SBL-${new Date().getFullYear()}-${randomSuffix}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setBookings((prev) => [newBooking, ...prev]);
    if (!isAdminLoggedIn) {
      recordBookingSubmission();
    }
    saveBookingToStore(newBooking).catch(console.error);

    const recipientEmail = newBooking.email || `${newBooking.clientName.toLowerCase().replace(/\s+/g, '')}@client.com`;
    const emailData: EmailConfirmationData = {
      referenceNumber: newBooking.referenceNumber,
      clientName: newBooking.clientName,
      email: recipientEmail,
      phone: newBooking.phone,
      eventType: newBooking.eventType,
      eventDate: newBooking.eventDate,
      location: newBooking.location,
      durationDays: newBooking.durationDays,
      guestCount: newBooking.guestCount,
      selectedServices: newBooking.selectedServices,
      customRequests: newBooking.customRequests,
      createdAt: newBooking.createdAt,
    };

    setActiveEmailConfirmation(emailData);

    // High-visibility success notification with Reference Number and Mock Email trigger
    showToast(
      '🎉 Booking Received & Email Sent!',
      `Reference #${refNum}. Official confirmation receipt sent to ${recipientEmail}. SBL dispatch team is reviewing your schedule.`,
      'success',
      refNum,
      'View Receipt',
      () => {
        setActiveEmailConfirmation(emailData);
        setIsEmailModalOpen(true);
      }
    );

    // Trigger Admin Quick Booking Toast Alert
    triggerQuickBookingAlert(newBooking, newBooking.isQuickBooking ? 'quick_booking' : 'manual');

    logActivity(
      'booking_change',
      'BOOKING_CREATED',
      `New Booking Submitted: Ref #${refNum}`,
      `${newBooking.clientName} booked for ${newBooking.eventType.replace('_', ' ')} (${newBooking.eventDate}). Total: UGX ${(newBooking.estimatedTotal || 0).toLocaleString()}`,
      {
        referenceNumber: newBooking.referenceNumber,
        clientName: newBooking.clientName,
        eventType: newBooking.eventType,
        eventDate: newBooking.eventDate,
        location: newBooking.location,
        estimatedTotal: newBooking.estimatedTotal
      }
    );

    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const targetBooking = bookings.find((b) => b.id === id);
    if (!targetBooking) return;

    const updatedBooking = { ...targetBooking, ...updates };

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? updatedBooking : b))
    );

    updateBookingInStore(id, updates).catch(console.error);

    // Sync Calendar if eventDate, eventType, clientName or location changed
    if (updates.eventDate || updates.eventType || updates.clientName || updates.location || updates.status) {
      const calEventId = `cal-evt-${id}`;
      const serviceNames = updatedBooking.selectedServices.map(
        (sId) => services.find((s) => s.id === sId)?.title || sId
      );
      const updatedCalEvent: CalendarEvent = {
        id: calEventId,
        title: `${updatedBooking.eventType === 'wedding' ? 'Wedding' : updatedBooking.eventType.toUpperCase()}: ${updatedBooking.clientName}`,
        eventType: updatedBooking.eventType,
        startDate: updatedBooking.eventDate,
        endDate: updatedBooking.endDate || updatedBooking.eventDate,
        location: updatedBooking.location || 'Client Venue',
        status: updatedBooking.status === 'confirmed' ? 'booked' : 'tentative',
        servicesSummary: serviceNames,
        clientName: updatedBooking.clientName,
        guestCount: updatedBooking.guestCount,
        isPublic: false,
        relatedBookingId: updatedBooking.id,
      };
      setCalendarEvents((prev) => {
        const idx = prev.findIndex((e) => e.id === calEventId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedCalEvent;
          return next;
        }
        return [...prev, updatedCalEvent];
      });
      saveCalendarEventToStore(updatedCalEvent).catch(console.error);
    }

    logActivity(
      'booking_change',
      'BOOKING_UPDATED',
      `Booking #${targetBooking.referenceNumber} Details Updated`,
      `Updated details for ${targetBooking.clientName} (${targetBooking.referenceNumber}).`,
      { referenceNumber: targetBooking.referenceNumber, updates }
    );

    showToast('Booking Updated', `Booking #${targetBooking.referenceNumber} has been successfully updated.`, 'success');
  };

  const updateBookingStatus = (id: string, status: BookingStatus, notes?: string) => {
    const targetBooking = bookings.find((b) => b.id === id);
    
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            notes: notes !== undefined ? notes : b.notes,
          };
        }
        return b;
      })
    );

    updateBookingInStore(id, {
      status,
      ...(notes !== undefined ? { notes } : {})
    }).catch(console.error);

    if (targetBooking) {
      logActivity(
        'booking_change',
        'STATUS_UPDATED',
        `Booking #${targetBooking.referenceNumber} Status: ${status.toUpperCase()}`,
        `Status updated from ${targetBooking.status} to ${status}${notes ? ` (Notes: ${notes})` : ''}.`,
        {
          referenceNumber: targetBooking.referenceNumber,
          clientName: targetBooking.clientName,
          oldStatus: targetBooking.status,
          newStatus: status,
          notes
        }
      );
      if (isAdminLoggedIn) {
        triggerAdminLiveNotification({
          category: 'booking',
          title: `Booking #${targetBooking.referenceNumber} Status Updated`,
          message: `Status set to ${status.toUpperCase()} for ${targetBooking.clientName}.`,
          booking: { ...targetBooking, status },
          actionType: 'review_booking'
        });
      }
    }

    // Sync with Calendar: When confirmed by employee in admin panel, place onto the calendar
    if (targetBooking) {
      const calEventId = `cal-evt-${id}`;

      if (status === 'confirmed') {
        const serviceNames = targetBooking.selectedServices.map(
          (sId) => services.find((s) => s.id === sId)?.title || sId
        );

        const confirmedEvent: CalendarEvent = {
          id: calEventId,
          title: `${targetBooking.eventType === 'wedding' ? 'Wedding' : targetBooking.eventType.toUpperCase()}: ${targetBooking.clientName}`,
          eventType: targetBooking.eventType,
          startDate: targetBooking.eventDate,
          endDate: targetBooking.endDate || targetBooking.eventDate,
          location: targetBooking.location || 'Client Venue',
          status: 'booked',
          servicesSummary: serviceNames,
          clientName: targetBooking.clientName,
          guestCount: targetBooking.guestCount,
        };

        setCalendarEvents((prev) => {
          const filtered = prev.filter((e) => e.id !== calEventId);
          return [...filtered, confirmedEvent];
        });
        saveCalendarEventToStore(confirmedEvent).catch(console.error);

        showToast('Booking Confirmed & Placed in Calendar', `Event for ${targetBooking.clientName} is now officially scheduled and locked on the calendar with a 2-day buffer.`, 'success');
        return;
      } else if (status === 'cancelled' || status === 'pending') {
        // If booking is reverted to pending or cancelled, remove from the live calendar so dates become available
        setCalendarEvents((prev) => prev.filter((e) => e.id !== calEventId));
        deleteCalendarEventFromStore(calEventId).catch(console.error);
      }
    }

    showToast('Booking Updated', `Booking status changed to ${status.toUpperCase()}.`, 'info');
  };

  const updateBookingPayment = (
    id: string,
    paymentUpdates: {
      amountPaid?: number;
      balanceDue?: number;
      paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'overdue';
      paymentDueDate?: string;
      notes?: string;
      lastReminderSentAt?: string;
    }
  ) => {
    let updatedBookingData: Partial<Booking> = { ...paymentUpdates };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const total = b.estimatedTotal || 0;
          const newPaid = paymentUpdates.amountPaid !== undefined ? paymentUpdates.amountPaid : (b.amountPaid || 0);
          const computedBalance = paymentUpdates.balanceDue !== undefined ? paymentUpdates.balanceDue : Math.max(0, total - newPaid);
          
          let computedStatus = paymentUpdates.paymentStatus || b.paymentStatus || 'unpaid';
          if (!paymentUpdates.paymentStatus) {
            if (newPaid >= total && total > 0) {
              computedStatus = 'fully_paid';
            } else if (newPaid > 0) {
              computedStatus = 'deposit_paid';
            } else {
              computedStatus = 'unpaid';
            }
          }

          updatedBookingData = {
            ...paymentUpdates,
            amountPaid: newPaid,
            balanceDue: computedBalance,
            paymentStatus: computedStatus,
          };

          return {
            ...b,
            ...updatedBookingData,
          };
        }
        return b;
      })
    );

    updateBookingInStore(id, updatedBookingData).catch(console.error);
    showToast('Payment Record Updated', 'Client ledger and balance status updated successfully.', 'success');
  };

  const sendPaymentReminderEmail = (bookingId: string, customMessage?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      showToast('Booking Not Found', 'Could not locate client booking for email dispatch.', 'error');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const balance = booking.balanceDue !== undefined ? booking.balanceDue : (booking.estimatedTotal || 0) - (booking.amountPaid || 0);
    const targetEmail = booking.email || `${booking.clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    // Update the booking's last reminder timestamp
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, lastReminderSentAt: timestamp } : b))
    );
    updateBookingInStore(bookingId, { lastReminderSentAt: timestamp }).catch(console.error);

    const emailData: EmailConfirmationData = {
      referenceNumber: booking.referenceNumber,
      clientName: booking.clientName,
      email: targetEmail,
      phone: booking.phone,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      location: booking.location,
      durationDays: booking.durationDays || 1,
      guestCount: booking.guestCount || 300,
      selectedServices: booking.selectedServices || [],
      customRequests: customMessage || `Official Payment Reminder: Pending Balance of UGX ${balance.toLocaleString()} for upcoming event on ${booking.eventDate}.`,
      createdAt: booking.createdAt || new Date().toISOString().split('T')[0],
    };

    setActiveEmailConfirmation(emailData);

    showToast(
      '📨 Payment Reminder Email Dispatched',
      `Invoice reminder for UGX ${balance.toLocaleString()} sent to ${targetEmail} (Ref #${booking.referenceNumber}).`,
      'success',
      booking.referenceNumber,
      'Preview Invoice',
      () => {
        setActiveEmailConfirmation(emailData);
        setIsEmailModalOpen(true);
      }
    );
  };

  const bulkSendPaymentReminders = (bookingIds: string[], customMessage?: string) => {
    if (!bookingIds || bookingIds.length === 0) return { sentCount: 0, totalBalance: 0 };
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const targetSet = new Set(bookingIds);
    let sentCount = 0;
    let totalBalance = 0;
    let firstEmailData: EmailConfirmationData | null = null;

    setBookings((prev) =>
      prev.map((b) => {
        if (targetSet.has(b.id)) {
          const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal || 0) - (b.amountPaid || 0);
          if (balance > 0) {
            sentCount += 1;
            totalBalance += balance;

            if (!firstEmailData) {
              const targetEmail = b.email || `${b.clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
              firstEmailData = {
                referenceNumber: b.referenceNumber,
                clientName: b.clientName,
                email: targetEmail,
                phone: b.phone,
                eventType: b.eventType,
                eventDate: b.eventDate,
                location: b.location,
                durationDays: b.durationDays || 1,
                guestCount: b.guestCount || 300,
                selectedServices: b.selectedServices || [],
                customRequests: customMessage || `Bulk Payment Reminder: Outstanding balance UGX ${balance.toLocaleString()} for ${b.eventType.toUpperCase()} on ${b.eventDate}.`,
                createdAt: b.createdAt || new Date().toISOString().split('T')[0],
              };
            }

            updateBookingInStore(b.id, { lastReminderSentAt: timestamp }).catch(console.error);
            return { ...b, lastReminderSentAt: timestamp };
          }
        }
        return b;
      })
    );

    if (firstEmailData) {
      setActiveEmailConfirmation(firstEmailData);
    }

    showToast(
      '📨 Bulk Payment Reminders Dispatched',
      `Sent ${sentCount} reminder emails totaling UGX ${totalBalance.toLocaleString()} in pending client receivables.`,
      'success',
      undefined,
      firstEmailData ? 'Preview Sample' : undefined,
      firstEmailData ? () => {
        setActiveEmailConfirmation(firstEmailData!);
        setIsEmailModalOpen(true);
      } : undefined
    );

    return { sentCount, totalBalance };
  };

  const deleteBooking = (id: string) => {
    const targetBooking = bookings.find((b) => b.id === id);
    if (targetBooking) {
      logActivity(
        'booking_change',
        'BOOKING_DELETED',
        `Booking Deleted: Ref #${targetBooking.referenceNumber}`,
        `Booking for ${targetBooking.clientName} (${targetBooking.eventDate}) was deleted from the registry.`,
        {
          referenceNumber: targetBooking.referenceNumber,
          clientName: targetBooking.clientName,
        }
      );
    }
    const calEventId = `cal-evt-${id}`;
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setCalendarEvents((prev) => prev.filter((e) => e.id !== calEventId));
    deleteBookingFromStore(id).catch(console.error);
    deleteCalendarEventFromStore(calEventId).catch(console.error);
    showToast('Booking Removed', 'The booking record and calendar schedule have been deleted.', 'warning');
  };

  const bulkDeleteBookings = (bookingIds: string[]) => {
    if (!bookingIds || bookingIds.length === 0) return;
    const targetSet = new Set(bookingIds);
    const calEventIdSet = new Set(bookingIds.map(id => `cal-evt-${id}`));

    setBookings((prev) => prev.filter((b) => !targetSet.has(b.id)));
    setCalendarEvents((prev) => prev.filter((e) => !calEventIdSet.has(e.id)));
    bulkDeleteBookingsFromStore(bookingIds).catch(console.error);
    Array.from(calEventIdSet).forEach(cId => deleteCalendarEventFromStore(cId).catch(console.error));
    showToast('Bulk Deletion Complete', `Successfully removed ${bookingIds.length} booking records and calendar fixtures.`, 'warning');
  };

  const bulkUpdateBookingStatus = (bookingIds: string[], status: BookingStatus) => {
    if (!bookingIds || bookingIds.length === 0) return;
    const targetSet = new Set(bookingIds);

    setBookings((prev) =>
      prev.map((b) => (targetSet.has(b.id) ? { ...b, status } : b))
    );

    bookingIds.forEach((bId) => {
      updateBookingInStore(bId, { status }).catch(console.error);
    });

    // Sync calendar fixtures
    if (status === 'confirmed') {
      const confirmedEvents: CalendarEvent[] = bookings
        .filter((b) => targetSet.has(b.id))
        .map((b) => ({
          id: `cal-evt-${b.id}`,
          title: `${b.eventType === 'wedding' ? 'Wedding' : b.eventType.toUpperCase()}: ${b.clientName}`,
          eventType: b.eventType,
          startDate: b.eventDate,
          endDate: b.endDate || b.eventDate,
          location: b.location || 'Client Venue',
          status: 'booked',
          servicesSummary: b.selectedServices.map(
            (sId) => services.find((s) => s.id === sId)?.title || sId
          ),
          clientName: b.clientName,
          guestCount: b.guestCount,
        }));

      setCalendarEvents((prev) => {
        const filtered = prev.filter((e) => !targetSet.has(e.id.replace('cal-evt-', '')));
        return [...filtered, ...confirmedEvents];
      });
      confirmedEvents.forEach(evt => saveCalendarEventToStore(evt).catch(console.error));
    } else if (status === 'cancelled' || status === 'pending') {
      const calEventIdSet = new Set(bookingIds.map(id => `cal-evt-${id}`));
      setCalendarEvents((prev) => prev.filter((e) => !calEventIdSet.has(e.id)));
      Array.from(calEventIdSet).forEach(cId => deleteCalendarEventFromStore(cId).catch(console.error));
    }

    showToast('Bulk Status Updated', `Updated ${bookingIds.length} bookings to status: ${status.toUpperCase()}.`, 'info');
  };

  // Callback Requests Handlers
  const addCallbackRequest = (reqData: Omit<CallbackRequest, 'id' | 'createdAt' | 'status'>): CallbackRequest => {
    if (!isAdminLoggedIn) {
      const rateCheck = checkCallbackRateLimit(false);
      if (!rateCheck.allowed) {
        showToast(
          'Request Limit Active',
          rateCheck.message || `Please wait ${rateCheck.remainingSeconds}s before submitting another callback.`,
          'warning'
        );
        return {
          ...reqData,
          id: `cb-rate-limited`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
      }

      const signature = `${reqData.clientName}_${reqData.phone}`;
      if (isDuplicatePayload('callback', signature, 30)) {
        showToast('Already Requested', 'Your callback was already submitted. Our team will contact you shortly!', 'info');
        return {
          ...reqData,
          id: `cb-duplicate`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
      }
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const newReq: CallbackRequest = {
      ...reqData,
      id: `cb-${Date.now()}`,
      status: 'pending',
      createdAt: `${dateStr} ${timeStr}`,
    };

    setCallbackRequests((prev) => [newReq, ...prev]);
    if (!isAdminLoggedIn) {
      recordCallbackSubmission();
    }
    saveCallbackRequestToStore(newReq).catch(console.error);
    logActivity(
      'booking_change',
      'CALLBACK_REQUESTED',
      `Callback Requested: ${newReq.clientName}`,
      `Client ${newReq.clientName} (${newReq.phone}) requested a callback regarding ${newReq.eventInterest || 'event logistics'}.`,
      {
        clientName: newReq.clientName,
        phone: newReq.phone,
        interest: newReq.eventInterest
      }
    );
    if (isAdminLoggedIn) {
      triggerAdminLiveNotification({
        category: 'callback',
        title: '📞 New Callback Request!',
        message: `${newReq.clientName} (${newReq.phone}) requested a callback regarding ${newReq.eventInterest || 'event logistics'}.`,
        priority: 'urgent',
        callback: newReq,
        actionType: 'call_client',
        source: 'manual'
      });
    }
    showToast(
      'Callback Request Dispatched',
      'Your request has been routed directly to the SBL Admin Dispatch queue.',
      'success'
    );
    return newReq;
  };

  const updateCallbackStatus = (id: string, status: 'pending' | 'called' | 'converted' | 'dismissed') => {
    setCallbackRequests((prev) =>
      prev.map((cb) => (cb.id === id ? { ...cb, status } : cb))
    );
    updateCallbackRequestInStore(id, { status }).catch(console.error);
    showToast('Callback Updated', `Status changed to ${status.toUpperCase()}.`, 'info');
  };

  const deleteCallbackRequest = (id: string) => {
    setCallbackRequests((prev) => prev.filter((cb) => cb.id !== id));
    deleteCallbackRequestFromStore(id).catch(console.error);
    showToast('Callback Removed', 'Callback request entry deleted.', 'info');
  };

  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvt]);
    saveCalendarEventToStore(newEvt).catch(console.error);
    showToast('Calendar Updated', `Added "${newEvt.title}" to event schedule.`, 'success');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    const existing = calendarEvents.find((e) => e.id === id);
    if (existing) {
      saveCalendarEventToStore({ ...existing, ...updates }).catch(console.error);
    }
    showToast('Schedule Updated', 'Calendar event details saved.', 'success');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    deleteCalendarEventFromStore(id).catch(console.error);
    showToast('Schedule Updated', 'Calendar event removed.', 'info');
  };

  const addTestimonial = (testData: Omit<Testimonial, 'id' | 'date' | 'approved' | 'verified'>) => {
    const newTestimonial: Testimonial = {
      ...testData,
      id: `test-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      approved: false, // Requires admin approval
      verified: true,
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
    saveTestimonialToStore(newTestimonial).catch(console.error);
    logActivity(
      'settings_update',
      'REVIEW_SUBMITTED',
      `New Review: ${newTestimonial.author} (${newTestimonial.rating}★)`,
      `Client submitted feedback: "${newTestimonial.content.slice(0, 80)}"`,
      {
        author: newTestimonial.author,
        rating: newTestimonial.rating,
        event: newTestimonial.companyOrEvent
      }
    );
    if (isAdminLoggedIn) {
      triggerAdminLiveNotification({
        category: 'review',
        title: '⭐ New Client Review Submitted!',
        message: `${newTestimonial.author} gave ${newTestimonial.rating}★: "${newTestimonial.content.slice(0, 60)}..."`,
        priority: 'high',
        testimonial: newTestimonial,
        actionType: 'approve_review',
        source: 'manual'
      });
    }
    showToast('Thank You!', 'Your review has been submitted for verification.', 'success');
  };

  const approveTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const approvedTest = { ...t, approved: true };
          saveTestimonialToStore(approvedTest).catch(console.error);
          logActivity(
            'settings_update',
            'REVIEW_APPROVED',
            `Review Approved: ${t.author}`,
            `Review by ${t.author} (${t.rating}★) was approved and published to public site.`,
            { reviewId: id, author: t.author }
          );
          return approvedTest;
        }
        return t;
      })
    );
    showToast('Review Published', 'Testimonial is now live on the public website.', 'success');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    deleteTestimonialFromStore(id).catch(console.error);
    showToast('Review Deleted', 'Testimonial removed.', 'info');
  };

  const addAdminTestimonial = (testData: Omit<Testimonial, 'id' | 'date'>): Testimonial => {
    const newTest: Testimonial = {
      ...testData,
      id: `test-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      approved: testData.approved !== undefined ? testData.approved : true,
      verified: testData.verified !== undefined ? testData.verified : true,
    };
    setTestimonials((prev) => [newTest, ...prev]);
    saveTestimonialToStore(newTest).catch(console.error);
    showToast('Review Added', `Testimonial from ${newTest.author} saved.`, 'success');
    return newTest;
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          saveTestimonialToStore(updated).catch(console.error);
          return updated;
        }
        return t;
      })
    );
    showToast('Review Updated', 'Testimonial updated successfully.', 'success');
  };

  const updateInventoryQuantity = (id: string, total: number, available: number, dailyRate?: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            totalQuantity: total,
            availableQuantity: available,
            dailyRate: dailyRate !== undefined ? dailyRate : item.dailyRate,
          };
          saveInventoryItemToStore(updated).catch(console.error);
          return updated;
        }
        return item;
      })
    );
    showToast('Inventory Updated', 'Stock count updated.', 'success');
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>): InventoryItem => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    saveInventoryItemToStore(newItem).catch(console.error);
    logActivity(
      'system',
      'INVENTORY_ADDED',
      `New Equipment Added: ${newItem.name}`,
      `Added ${newItem.name} (${newItem.category}) with initial stock of ${newItem.totalQuantity}.`,
      { itemId: newItem.id, name: newItem.name }
    );
    showToast('Equipment Added', `${newItem.name} added to warehouse inventory.`, 'success');
    return newItem;
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          saveInventoryItemToStore(updated).catch(console.error);
          return updated;
        }
        return item;
      })
    );
    logActivity(
      'system',
      'INVENTORY_UPDATED',
      `Inventory Updated: ${updates.name || id}`,
      `Modified specifications/stock for equipment ID ${id}.`,
      { itemId: id, updates }
    );
    showToast('Equipment Saved', 'Equipment details updated successfully.', 'success');
  };

  const deleteInventoryItem = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    setInventory((prev) => prev.filter((i) => i.id !== id));
    deleteInventoryItemFromStore(id).catch(console.error);
    logActivity(
      'system',
      'INVENTORY_DELETED',
      `Equipment Removed: ${item?.name || id}`,
      `Equipment ${item?.name || id} removed from inventory records.`,
      { itemId: id }
    );
    showToast('Equipment Removed', 'Item removed from inventory records.', 'info');
  };

  // Events Done & Gallery Handlers (Guaranteed Firestore Persistence & Portability)
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    contentSync.addGalleryItem(newItem).catch(console.error);
    showToast('Event Done Posted', `"${itemData.title}" added & live synced to cloud.`, 'success');
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    contentSync.updateGalleryItem(id, updates);
    showToast('Gallery Updated', 'Event showcase details live synced to cloud.', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    contentSync.deleteGalleryItem(id);
    showToast('Event Removed', 'Event showcase deleted from cloud & all views.', 'info');
  };

  const resetGalleryToDefault = () => {
    contentSync.resetGalleryToDefault();
    showToast('Gallery Restored', 'Default event showcase portfolio restored in cloud.', 'info');
  };

  // Service Media & Info Handlers (Guaranteed Firestore Persistence & Portability)
  const addService = (serviceData: Omit<Service, 'id'>): Service => {
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    contentSync.addService(newService).catch(console.error);
    showToast('Service Created', `Service "${serviceData.title}" created & live synced.`, 'success');
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    contentSync.updateService(id, updates);
    showToast('Service Updated', 'Service details and media saved live to cloud.', 'success');
  };

  const deleteService = (id: string) => {
    const srv = services.find((s) => s.id === id);
    contentSync.deleteService(id);
    showToast('Service Deleted', `Service "${srv?.title || id}" deleted from cloud.`, 'info');
  };

  const addServiceImage = (serviceId: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    contentSync.addServiceImage(serviceId, imageUrl);
    showToast('Picture Added', 'New image attached and live synced to cloud.', 'success');
  };

  const removeServiceImage = (serviceId: string, imageIndex: number) => {
    contentSync.removeServiceImage(serviceId, imageIndex);
    showToast('Picture Removed', 'Image deleted from cloud and views.', 'info');
  };

  const setServiceCoverImage = (serviceId: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    contentSync.setServiceCoverImage(serviceId, imageUrl);
    showToast('Cover Image Updated', 'Main service display photo saved to cloud.', 'success');
  };

  const addServiceVideo = (
    serviceId: string,
    video: { title: string; url: string; platform?: 'tiktok' | 'youtube' | 'mp4' | 'other' }
  ) => {
    if (!video.url.trim()) return;
    contentSync.addServiceVideo(serviceId, video);
    showToast('Video Added', 'Service video link saved & live synced.', 'success');
  };

  const removeServiceVideo = (serviceId: string, videoId: string) => {
    contentSync.removeServiceVideo(serviceId, videoId);
    showToast('Video Removed', 'Video link deleted from cloud.', 'info');
  };

  const resetServicesToDefault = () => {
    contentSync.resetServicesToDefault();
    showToast('Services Reset', 'Default service catalogue restored in cloud.', 'info');
  };

  // Event Categories Management handlers
  const addEventCategory = (categoryData: Omit<EventCategoryItem, 'id' | 'createdAt'>): EventCategoryItem => {
    const slug = categoryData.slug
      ? categoryData.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '_')
      : categoryData.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    
    const newCategory: EventCategoryItem = {
      ...categoryData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug,
      order: eventCategories.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      active: categoryData.active ?? true,
      recommendedServices: categoryData.recommendedServices || [],
      rentalChecklist: categoryData.rentalChecklist || [],
    };

    setEventCategories((prev) => [...prev, newCategory]);
    saveEventCategoryToStore(newCategory).catch(console.error);
    showToast('Category Created', `Event category "${newCategory.name}" is now active in catalog & bookings.`, 'success');
    return newCategory;
  };

  const updateEventCategory = (id: string, updates: Partial<EventCategoryItem>) => {
    setEventCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const updated = { ...cat, ...updates };
          saveEventCategoryToStore(updated).catch(console.error);
          return updated;
        }
        return cat;
      })
    );
    showToast('Category Updated', 'Event category details saved.', 'success');
  };

  const deleteEventCategory = (id: string) => {
    setEventCategories((prev) => prev.filter((cat) => cat.id !== id));
    deleteEventCategoryFromStore(id).catch(console.error);
    showToast('Category Deleted', 'Event category removed from catalog.', 'info');
  };

  const toggleEventCategoryStatus = (id: string) => {
    setEventCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const nextActive = !cat.active;
          const updated = { ...cat, active: nextActive };
          saveEventCategoryToStore(updated).catch(console.error);
          showToast(
            nextActive ? 'Category Activated' : 'Category Deactivated',
            `"${cat.name}" is now ${nextActive ? 'visible' : 'hidden'} in booking options.`,
            'info'
          );
          return updated;
        }
        return cat;
      })
    );
  };

  const reorderEventCategories = (categories: EventCategoryItem[]) => {
    setEventCategories(categories);
    categories.forEach((cat) => saveEventCategoryToStore(cat).catch(console.error));
    showToast('Order Saved', 'Category display order updated.', 'info');
  };

  const resetEventCategoriesToDefault = () => {
    setEventCategories(INITIAL_EVENT_CATEGORIES);
    INITIAL_EVENT_CATEGORIES.forEach((cat) => saveEventCategoryToStore(cat).catch(console.error));
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CATEGORIES);
    } catch {
      // ignore
    }
    showToast('Categories Reset', 'Default event categories restored.', 'info');
  };

  const openBookingModal = (prefill?: BookingPrefill) => {
    if (prefill) {
      setBookingPrefill(prefill);
    } else {
      setBookingPrefill(null);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingPrefill(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        theme,
        setTheme,
        services,
        addService,
        updateService,
        deleteService,
        addServiceImage,
        removeServiceImage,
        setServiceCoverImage,
        addServiceVideo,
        removeServiceVideo,
        resetServicesToDefault,
        bookings,
        calendarEvents,
        testimonials,
        inventory,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetGalleryToDefault,
        eventCategories,
        addEventCategory,
        updateEventCategory,
        deleteEventCategory,
        toggleEventCategoryStatus,
        reorderEventCategories,
        resetEventCategoriesToDefault,
        callbackRequests,
        bufferDaysBefore,
        bufferDaysAfter,
        setBufferDaysBefore,
        setBufferDaysAfter,
        adminUsers,
        currentAdminUser,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        toggleAdminUserStatus,
        addBooking,
        updateBooking,
        updateBookingStatus,
        updateBookingPayment,
        sendPaymentReminderEmail,
        bulkSendPaymentReminders,
        deleteBooking,
        bulkDeleteBookings,
        bulkUpdateBookingStatus,
        addCallbackRequest,
        updateCallbackStatus,
        deleteCallbackRequest,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        addTestimonial,
        addAdminTestimonial,
        updateTestimonial,
        approveTestimonial,
        deleteTestimonial,
        updateInventoryQuantity,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        bookingPrefill,
        isSplashScreenOpen,
        openSplashScreen,
        closeSplashScreen,
        announcement,
        updateAnnouncement,
        resetAnnouncementToDefault,
        isSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
        isShortcutsOpen,
        openShortcuts,
        closeShortcuts,
        toggleShortcuts,
        isEmailModalOpen,
        activeEmailConfirmation,
        openEmailModal,
        closeEmailModal,
        triggerMockEmailConfirmation,
        toasts,
        showToast,
        removeToast,
        cardEditorItem,
        openCardEditor,
        closeCardEditor,
        isBookingsLoading,
        fastSync,
        simulateFirestoreFetch,
        adminBookingAlerts,
        dismissAdminAlert,
        clearAllAdminAlerts,
        triggerQuickBookingAlert,
        triggerAdminLiveNotification,
        activityLogs,
        isActivityLogsLoading,
        refreshActivityLogs,
        logActivity,
        deleteActivityLog,
        clearAllActivityLogs,
        // Live Cloud Firestore Content Synchronization Telemetry
        syncStatus: contentSync.syncStatus,
        isSyncing: contentSync.isSyncing,
        lastSyncedAt: contentSync.lastSyncedAt,
        syncError: contentSync.syncError,
        isCloudConnected: contentSync.isCloudConnected,
        pendingSyncCount: contentSync.pendingSyncCount,
        forceRefreshFromCloud: contentSync.forceRefreshFromCloud,
        retryPendingSync: contentSync.retryPendingSync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
