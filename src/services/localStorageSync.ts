import { 
  CalendarEvent, 
  Booking, 
  Service, 
  GalleryItem, 
  EventCategoryItem, 
  CallbackRequest, 
  Testimonial, 
  InventoryItem,
  SiteAnnouncement,
  ActivityLog,
  VideoReel,
  TikTokSectionConfig
} from '../types';

export const STORAGE_KEYS = {
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
  VIDEO_REELS: 'sbl_events_video_reels_v1',
  TIKTOK_CONFIG: 'sbl_events_tiktok_config_v1'
} as const;

// Helper to safely get parsed item from localStorage
export const getLocalItem = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`[LocalStore] Error reading key ${key}:`, err);
    return fallback;
  }
};

// Helper to safely write item to localStorage and notify listeners
export const setLocalItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch local custom event so other components / contexts can react immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sbl-local-store-update', {
        detail: { key, value }
      }));
    }
  } catch (err) {
    console.error(`[LocalStore] Error writing key ${key}:`, err);
  }
};

// --- Storage listener for multi-tab or intra-app synchronization ---
export const subscribeToLocalStore = (
  key: string,
  callback: (data: any) => void
): (() => void) => {
  const handleCustomEvent = (e: Event) => {
    const customEvt = e as CustomEvent<{ key: string; value: any }>;
    if (customEvt.detail && customEvt.detail.key === key) {
      callback(customEvt.detail.value);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch {
        // ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('sbl-local-store-update', handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('sbl-local-store-update', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
};

// 1. Calendar Events Local Store
export const saveCalendarEventToStore = async (event: CalendarEvent): Promise<void> => {
  const events = getLocalItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
  const index = events.findIndex(e => e.id === event.id);
  if (index >= 0) {
    events[index] = event;
  } else {
    events.push(event);
  }
  setLocalItem(STORAGE_KEYS.CALENDAR, events);
};

export const deleteCalendarEventFromStore = async (id: string): Promise<void> => {
  const events = getLocalItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
  const filtered = events.filter(e => e.id !== id);
  setLocalItem(STORAGE_KEYS.CALENDAR, filtered);
};

// 2. Bookings Local Store
export const saveBookingToStore = async (booking: Booking): Promise<void> => {
  const bookings = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    bookings[index] = booking;
  } else {
    bookings.unshift(booking);
  }
  setLocalItem(STORAGE_KEYS.BOOKINGS, bookings);
};

export const updateBookingInStore = async (id: string, updates: Partial<Booking>): Promise<void> => {
  const bookings = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex(b => b.id === id);
  if (index >= 0) {
    bookings[index] = { ...bookings[index], ...updates };
    setLocalItem(STORAGE_KEYS.BOOKINGS, bookings);
  }
};

export const deleteBookingFromStore = async (id: string): Promise<void> => {
  const bookings = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const filtered = bookings.filter(b => b.id !== id);
  setLocalItem(STORAGE_KEYS.BOOKINGS, filtered);

  // Also remove matching calendar event if linked
  const calEvtId = `cal-evt-${id}`;
  await deleteCalendarEventFromStore(calEvtId);
};

export const bulkDeleteBookingsFromStore = async (ids: string[]): Promise<void> => {
  const idSet = new Set(ids);
  const bookings = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const filtered = bookings.filter(b => !idSet.has(b.id));
  setLocalItem(STORAGE_KEYS.BOOKINGS, filtered);

  // Also clean up calendar events
  const events = getLocalItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
  const filteredEvents = events.filter(e => !ids.some(id => e.id === `cal-evt-${id}`));
  setLocalItem(STORAGE_KEYS.CALENDAR, filteredEvents);
};

// 3. Services Local Store
export const saveServiceToStore = async (service: Service): Promise<void> => {
  const services = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, []);
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  setLocalItem(STORAGE_KEYS.SERVICES, services);
};

export const deleteServiceFromStore = async (id: string): Promise<void> => {
  const services = getLocalItem<Service[]>(STORAGE_KEYS.SERVICES, []);
  const filtered = services.filter(s => s.id !== id);
  setLocalItem(STORAGE_KEYS.SERVICES, filtered);
};

// 4. Gallery Items Local Store
export const saveGalleryItemToStore = async (item: GalleryItem): Promise<void> => {
  const items = getLocalItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  const index = items.findIndex(g => g.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  setLocalItem(STORAGE_KEYS.GALLERY, items);
};

export const deleteGalleryItemFromStore = async (id: string): Promise<void> => {
  const items = getLocalItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
  const filtered = items.filter(g => g.id !== id);
  setLocalItem(STORAGE_KEYS.GALLERY, filtered);
};

// 5. Event Categories Local Store
export const saveEventCategoryToStore = async (category: EventCategoryItem): Promise<void> => {
  const categories = getLocalItem<EventCategoryItem[]>(STORAGE_KEYS.CATEGORIES, []);
  const index = categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
};

export const deleteEventCategoryFromStore = async (id: string): Promise<void> => {
  const categories = getLocalItem<EventCategoryItem[]>(STORAGE_KEYS.CATEGORIES, []);
  const filtered = categories.filter(c => c.id !== id);
  setLocalItem(STORAGE_KEYS.CATEGORIES, filtered);
};

// 6. Callback Requests Local Store
export const saveCallbackRequestToStore = async (req: CallbackRequest): Promise<void> => {
  const cbs = getLocalItem<CallbackRequest[]>(STORAGE_KEYS.CALLBACKS, []);
  const index = cbs.findIndex(c => c.id === req.id);
  if (index >= 0) {
    cbs[index] = req;
  } else {
    cbs.unshift(req);
  }
  setLocalItem(STORAGE_KEYS.CALLBACKS, cbs);
};

export const updateCallbackRequestInStore = async (id: string, updates: Partial<CallbackRequest>): Promise<void> => {
  const cbs = getLocalItem<CallbackRequest[]>(STORAGE_KEYS.CALLBACKS, []);
  const index = cbs.findIndex(c => c.id === id);
  if (index >= 0) {
    cbs[index] = { ...cbs[index], ...updates };
    setLocalItem(STORAGE_KEYS.CALLBACKS, cbs);
  }
};

export const deleteCallbackRequestFromStore = async (id: string): Promise<void> => {
  const cbs = getLocalItem<CallbackRequest[]>(STORAGE_KEYS.CALLBACKS, []);
  const filtered = cbs.filter(c => c.id !== id);
  setLocalItem(STORAGE_KEYS.CALLBACKS, filtered);
};

// 7. Testimonials Local Store
export const saveTestimonialToStore = async (testimonial: Testimonial): Promise<void> => {
  const testimonials = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
  const index = testimonials.findIndex(t => t.id === testimonial.id);
  if (index >= 0) {
    testimonials[index] = testimonial;
  } else {
    testimonials.unshift(testimonial);
  }
  setLocalItem(STORAGE_KEYS.TESTIMONIALS, testimonials);
};

export const deleteTestimonialFromStore = async (id: string): Promise<void> => {
  const testimonials = getLocalItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
  const filtered = testimonials.filter(t => t.id !== id);
  setLocalItem(STORAGE_KEYS.TESTIMONIALS, filtered);
};

// 8. Inventory Local Store
export const saveInventoryItemToStore = async (item: InventoryItem): Promise<void> => {
  const inventory = getLocalItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []);
  const index = inventory.findIndex(i => i.id === item.id);
  if (index >= 0) {
    inventory[index] = item;
  } else {
    inventory.push(item);
  }
  setLocalItem(STORAGE_KEYS.INVENTORY, inventory);
};

export const deleteInventoryItemFromStore = async (id: string): Promise<void> => {
  const inventory = getLocalItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []);
  const filtered = inventory.filter(i => i.id !== id);
  setLocalItem(STORAGE_KEYS.INVENTORY, filtered);
};

// 9. Site Settings Local Store (Announcement, Buffers)
export const saveSiteSettingsToStore = async (settings: { 
  bufferDaysBefore?: number; 
  bufferDaysAfter?: number; 
  announcement?: SiteAnnouncement 
}): Promise<void> => {
  if (settings.bufferDaysBefore !== undefined) {
    localStorage.setItem(STORAGE_KEYS.BUFFER_BEFORE, settings.bufferDaysBefore.toString());
  }
  if (settings.bufferDaysAfter !== undefined) {
    localStorage.setItem(STORAGE_KEYS.BUFFER_AFTER, settings.bufferDaysAfter.toString());
  }
  if (settings.announcement) {
    setLocalItem(STORAGE_KEYS.ANNOUNCEMENT, settings.announcement);
  }
};

// 10. Activity Logs Local Store
export const saveActivityLogToStore = async (log: Omit<ActivityLog, 'id'> & { id?: string }): Promise<string> => {
  const logId = log.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const logs = getLocalItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
  const fullLog: ActivityLog = {
    ...log,
    id: logId,
    createdAt: log.createdAt || new Date().toISOString()
  };
  logs.unshift(fullLog);
  // Cap at 200 logs to keep storage clean
  const trimmed = logs.slice(0, 200);
  setLocalItem(STORAGE_KEYS.ACTIVITY_LOGS, trimmed);
  return logId;
};

export const deleteActivityLogFromStore = async (id: string): Promise<void> => {
  const logs = getLocalItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
  const filtered = logs.filter(l => l.id !== id);
  setLocalItem(STORAGE_KEYS.ACTIVITY_LOGS, filtered);
};

export const clearAllActivityLogsFromStore = async (_ids?: string[]): Promise<void> => {
  setLocalItem(STORAGE_KEYS.ACTIVITY_LOGS, []);
};

// 11. TikTok Reels & Live Hub Local Store
export const getVideoReelsFromStore = (fallback: VideoReel[]): VideoReel[] => {
  return getLocalItem<VideoReel[]>(STORAGE_KEYS.VIDEO_REELS, fallback);
};

export const saveVideoReelToStore = async (reel: VideoReel): Promise<void> => {
  const reels = getLocalItem<VideoReel[]>(STORAGE_KEYS.VIDEO_REELS, []);
  const index = reels.findIndex(r => r.id === reel.id);
  if (index >= 0) {
    reels[index] = reel;
  } else {
    reels.push(reel);
  }
  setLocalItem(STORAGE_KEYS.VIDEO_REELS, reels);
};

export const deleteVideoReelFromStore = async (id: string): Promise<void> => {
  const reels = getLocalItem<VideoReel[]>(STORAGE_KEYS.VIDEO_REELS, []);
  const filtered = reels.filter(r => r.id !== id);
  setLocalItem(STORAGE_KEYS.VIDEO_REELS, filtered);
};

export const getTikTokConfigFromStore = (fallback: TikTokSectionConfig): TikTokSectionConfig => {
  return getLocalItem<TikTokSectionConfig>(STORAGE_KEYS.TIKTOK_CONFIG, fallback);
};

export const saveTikTokConfigToStore = async (config: TikTokSectionConfig): Promise<void> => {
  setLocalItem(STORAGE_KEYS.TIKTOK_CONFIG, config);
};

// --- Initial Data Seeding Helper ---
export const seedInitialDataIfEmpty = (
  initialData: {
    calendarEvents: CalendarEvent[];
    bookings: Booking[];
    services: Service[];
    galleryItems: GalleryItem[];
    eventCategories: EventCategoryItem[];
    testimonials: Testimonial[];
    inventory: InventoryItem[];
    callbackRequests: CallbackRequest[];
    announcement: SiteAnnouncement;
    bufferDaysBefore: number;
    bufferDaysAfter: number;
    activityLogs?: ActivityLog[];
  }
): void => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      setLocalItem(STORAGE_KEYS.BOOKINGS, initialData.bookings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      setLocalItem(STORAGE_KEYS.SERVICES, initialData.services);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
      setLocalItem(STORAGE_KEYS.CALENDAR, initialData.calendarEvents);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      setLocalItem(STORAGE_KEYS.GALLERY, initialData.galleryItems);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      setLocalItem(STORAGE_KEYS.CATEGORIES, initialData.eventCategories);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      setLocalItem(STORAGE_KEYS.TESTIMONIALS, initialData.testimonials);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      setLocalItem(STORAGE_KEYS.INVENTORY, initialData.inventory);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALLBACKS)) {
      setLocalItem(STORAGE_KEYS.CALLBACKS, initialData.callbackRequests);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT)) {
      setLocalItem(STORAGE_KEYS.ANNOUNCEMENT, initialData.announcement);
    }
    if (localStorage.getItem(STORAGE_KEYS.BUFFER_BEFORE) === null) {
      localStorage.setItem(STORAGE_KEYS.BUFFER_BEFORE, initialData.bufferDaysBefore.toString());
    }
    if (localStorage.getItem(STORAGE_KEYS.BUFFER_AFTER) === null) {
      localStorage.setItem(STORAGE_KEYS.BUFFER_AFTER, initialData.bufferDaysAfter.toString());
    }
    if (initialData.activityLogs && !localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      setLocalItem(STORAGE_KEYS.ACTIVITY_LOGS, initialData.activityLogs);
    }
  } catch (err) {
    console.warn('[LocalStore] Seeding notice:', err);
  }
};
