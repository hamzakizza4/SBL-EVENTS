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
  ActivityLog
} from '../types';

import {
  saveCalendarEventToStore,
  deleteCalendarEventFromStore,
  saveBookingToStore,
  updateBookingInStore,
  deleteBookingFromStore,
  bulkDeleteBookingsFromStore,
  saveServiceToStore,
  deleteServiceFromStore,
  saveGalleryItemToStore,
  deleteGalleryItemFromStore,
  saveEventCategoryToStore,
  deleteEventCategoryFromStore,
  saveCallbackRequestToStore,
  updateCallbackRequestInStore,
  deleteCallbackRequestFromStore,
  saveTestimonialToStore,
  deleteTestimonialFromStore,
  saveInventoryItemToStore,
  deleteInventoryItemFromStore,
  saveSiteSettingsToStore,
  saveActivityLogToStore,
  deleteActivityLogFromStore,
  clearAllActivityLogsFromStore,
  subscribeToLocalStore,
  STORAGE_KEYS,
  setLocalItem
} from './localStorageSync';

import {
  saveCalendarEventToFirestore,
  deleteCalendarEventFromFirestore,
  saveBookingToFirestore,
  updateBookingInFirestore,
  deleteBookingFromFirestore,
  bulkDeleteBookingsFromFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  saveGalleryItemToFirestore,
  deleteGalleryItemFromFirestore,
  saveEventCategoryToFirestore,
  deleteEventCategoryFromFirestore,
  saveCallbackRequestToFirestore,
  updateCallbackRequestInFirestore,
  deleteCallbackRequestFromFirestore,
  saveTestimonialToFirestore,
  deleteTestimonialFromFirestore,
  saveInventoryItemToFirestore,
  deleteInventoryItemFromFirestore,
  saveSiteSettingsToFirestore,
  saveActivityLogToFirestore,
  deleteActivityLogFromFirestore,
  clearAllActivityLogsFromFirestore,
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
  seedInitialDataIfEmpty as seedFirestoreIfEmpty
} from './firestoreSync';

// Re-export subscriptions and keys
export {
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
};

// 1. Services
export const syncSaveService = async (service: Service): Promise<void> => {
  await Promise.allSettled([
    saveServiceToStore(service),
    saveServiceToFirestore(service)
  ]);
};

export const syncDeleteService = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteServiceFromStore(id),
    deleteServiceFromFirestore(id)
  ]);
};

// 2. Gallery Showcase
export const syncSaveGalleryItem = async (item: GalleryItem): Promise<void> => {
  await Promise.allSettled([
    saveGalleryItemToStore(item),
    saveGalleryItemToFirestore(item)
  ]);
};

export const syncDeleteGalleryItem = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteGalleryItemFromStore(id),
    deleteGalleryItemFromFirestore(id)
  ]);
};

// 3. Event Categories
export const syncSaveEventCategory = async (category: EventCategoryItem): Promise<void> => {
  await Promise.allSettled([
    saveEventCategoryToStore(category),
    saveEventCategoryToFirestore(category)
  ]);
};

export const syncDeleteEventCategory = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteEventCategoryFromStore(id),
    deleteEventCategoryFromFirestore(id)
  ]);
};

// 4. Inventory Items
export const syncSaveInventoryItem = async (item: InventoryItem): Promise<void> => {
  await Promise.allSettled([
    saveInventoryItemToStore(item),
    saveInventoryItemToFirestore(item)
  ]);
};

export const syncDeleteInventoryItem = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteInventoryItemFromStore(id),
    deleteInventoryItemFromFirestore(id)
  ]);
};

// 5. Bookings
export const syncSaveBooking = async (booking: Booking): Promise<void> => {
  await Promise.allSettled([
    saveBookingToStore(booking),
    saveBookingToFirestore(booking)
  ]);
};

export const syncUpdateBooking = async (id: string, updates: Partial<Booking>): Promise<void> => {
  await Promise.allSettled([
    updateBookingInStore(id, updates),
    updateBookingInFirestore(id, updates)
  ]);
};

export const syncDeleteBooking = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteBookingFromStore(id),
    deleteBookingFromFirestore(id)
  ]);
};

export const syncBulkDeleteBookings = async (ids: string[]): Promise<void> => {
  await Promise.allSettled([
    bulkDeleteBookingsFromStore(ids),
    bulkDeleteBookingsFromFirestore(ids)
  ]);
};

// 6. Calendar Events
export const syncSaveCalendarEvent = async (event: CalendarEvent): Promise<void> => {
  await Promise.allSettled([
    saveCalendarEventToStore(event),
    saveCalendarEventToFirestore(event)
  ]);
};

export const syncDeleteCalendarEvent = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteCalendarEventFromStore(id),
    deleteCalendarEventFromFirestore(id)
  ]);
};

// 7. Callback Requests
export const syncSaveCallbackRequest = async (req: CallbackRequest): Promise<void> => {
  await Promise.allSettled([
    saveCallbackRequestToStore(req),
    saveCallbackRequestToFirestore(req)
  ]);
};

export const syncUpdateCallbackRequest = async (id: string, updates: Partial<CallbackRequest>): Promise<void> => {
  await Promise.allSettled([
    updateCallbackRequestInStore(id, updates),
    updateCallbackRequestInFirestore(id, updates)
  ]);
};

export const syncDeleteCallbackRequest = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteCallbackRequestFromStore(id),
    deleteCallbackRequestFromFirestore(id)
  ]);
};

// 8. Testimonials
export const syncSaveTestimonial = async (testimonial: Testimonial): Promise<void> => {
  await Promise.allSettled([
    saveTestimonialToStore(testimonial),
    saveTestimonialToFirestore(testimonial)
  ]);
};

export const syncDeleteTestimonial = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteTestimonialFromStore(id),
    deleteTestimonialFromFirestore(id)
  ]);
};

// 9. Site Settings (Announcement, Buffers)
export const syncSaveSiteSettings = async (settings: { bufferDaysBefore?: number; bufferDaysAfter?: number; announcement?: SiteAnnouncement }): Promise<void> => {
  await Promise.allSettled([
    saveSiteSettingsToStore(settings),
    saveSiteSettingsToFirestore(settings)
  ]);
};

// 10. Activity Logs
export const syncSaveActivityLog = async (log: ActivityLog): Promise<void> => {
  await Promise.allSettled([
    saveActivityLogToStore(log),
    saveActivityLogToFirestore(log)
  ]);
};

export const syncDeleteActivityLog = async (id: string): Promise<void> => {
  await Promise.allSettled([
    deleteActivityLogFromStore(id),
    deleteActivityLogFromFirestore(id)
  ]);
};

export const syncClearAllActivityLogs = async (ids: string[]): Promise<void> => {
  await Promise.allSettled([
    clearAllActivityLogsFromStore(ids),
    clearAllActivityLogsFromFirestore(ids)
  ]);
};
