import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
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

export const COLLECTIONS = {
  CALENDAR_EVENTS: 'calendar_events',
  BOOKINGS: 'bookings',
  SERVICES: 'services',
  GALLERY: 'gallery_items',
  CATEGORIES: 'event_categories',
  CALLBACKS: 'callback_requests',
  TESTIMONIALS: 'testimonials',
  INVENTORY: 'inventory',
  SETTINGS: 'site_settings',
  ACTIVITY_LOGS: 'activity_logs',
  VIDEO_REELS: 'video_reels'
} as const;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operation: OperationType;
  path: string | null;
  authInfo: {
    userId: string | null;
    email: string | null;
    isAuthenticated: boolean;
  };
}

export function handleFirestoreError(error: unknown, operation: OperationType, path: string | null = null): FirestoreErrorInfo {
  const errMessage = error instanceof Error ? error.message : String(error);
  const currentUser = auth?.currentUser;
  const info: FirestoreErrorInfo = {
    error: errMessage,
    operation,
    path,
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      isAuthenticated: Boolean(currentUser)
    }
  };
  console.error('[Firestore Error]', JSON.stringify(info));
  return info;
}

// Helper to sanitize objects recursively for Firestore (removes undefined which crashes setDoc)
export const cleanData = <T extends any>(data: T): T => {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanData(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const val = (data as any)[key];
        if (val !== undefined) {
          result[key] = cleanData(val);
        }
      }
    }
    return result;
  }
  return data;
};

// --- Live Real-Time Listeners ---

export const subscribeToCalendarEvents = (callback: (events: CalendarEvent[]) => void) => {
  const colRef = collection(db, COLLECTIONS.CALENDAR_EVENTS);
  return onSnapshot(colRef, (snapshot) => {
    const events: CalendarEvent[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...(doc.data() as Omit<CalendarEvent, 'id'>) });
    });
    callback(events);
  }, (err) => {
    console.warn('[Firestore] Calendar events sync listener notice:', err.message);
  });
};

export const subscribeToBookings = (callback: (bookings: Booking[]) => void) => {
  const colRef = collection(db, COLLECTIONS.BOOKINGS);
  return onSnapshot(colRef, (snapshot) => {
    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...(doc.data() as Omit<Booking, 'id'>) });
    });
    callback(bookings);
  }, (err) => {
    console.warn('[Firestore] Bookings sync listener notice:', err.message);
  });
};

export const subscribeToServices = (callback: (services: Service[]) => void) => {
  const colRef = collection(db, COLLECTIONS.SERVICES);
  return onSnapshot(colRef, (snapshot) => {
    const services: Service[] = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...(doc.data() as Omit<Service, 'id'>) });
    });
    callback(services);
  }, (err) => {
    console.warn('[Firestore] Services sync listener notice:', err.message);
  });
};

export const subscribeToGallery = (callback: (items: GalleryItem[]) => void) => {
  const colRef = collection(db, COLLECTIONS.GALLERY);
  return onSnapshot(colRef, (snapshot) => {
    const items: GalleryItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<GalleryItem, 'id'>) });
    });
    callback(items);
  }, (err) => {
    console.warn('[Firestore] Gallery sync listener notice:', err.message);
  });
};

export const subscribeToCategories = (callback: (categories: EventCategoryItem[]) => void) => {
  const colRef = collection(db, COLLECTIONS.CATEGORIES);
  return onSnapshot(colRef, (snapshot) => {
    const items: EventCategoryItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<EventCategoryItem, 'id'>) });
    });
    callback(items);
  }, (err) => {
    console.warn('[Firestore] Categories sync listener notice:', err.message);
  });
};

export const subscribeToCallbacks = (callback: (callbacks: CallbackRequest[]) => void) => {
  const colRef = collection(db, COLLECTIONS.CALLBACKS);
  return onSnapshot(colRef, (snapshot) => {
    const items: CallbackRequest[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<CallbackRequest, 'id'>) });
    });
    callback(items);
  }, (err) => {
    console.warn('[Firestore] Callbacks sync listener notice:', err.message);
  });
};

export const subscribeToTestimonials = (callback: (testimonials: Testimonial[]) => void) => {
  const colRef = collection(db, COLLECTIONS.TESTIMONIALS);
  return onSnapshot(colRef, (snapshot) => {
    const items: Testimonial[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<Testimonial, 'id'>) });
    });
    callback(items);
  }, (err) => {
    console.warn('[Firestore] Testimonials sync listener notice:', err.message);
  });
};

export const subscribeToInventory = (callback: (inventory: InventoryItem[]) => void) => {
  const colRef = collection(db, COLLECTIONS.INVENTORY);
  return onSnapshot(colRef, (snapshot) => {
    const items: InventoryItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...(doc.data() as Omit<InventoryItem, 'id'>) });
    });
    callback(items);
  }, (err) => {
    console.warn('[Firestore] Inventory sync listener notice:', err.message);
  });
};

export const subscribeToSiteSettings = (callback: (settings: { bufferDaysBefore?: number; bufferDaysAfter?: number; announcement?: SiteAnnouncement }) => void) => {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'global_config');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as any);
    }
  }, (err) => {
    console.warn('[Firestore] Site settings sync listener notice:', err.message);
  });
};

export const subscribeToActivityLogs = (callback: (logs: ActivityLog[]) => void) => {
  const colRef = collection(db, COLLECTIONS.ACTIVITY_LOGS);
  return onSnapshot(colRef, (snapshot) => {
    const logs: ActivityLog[] = [];
    snapshot.forEach((docSnap) => {
      logs.push({ id: docSnap.id, ...(docSnap.data() as Omit<ActivityLog, 'id'>) });
    });
    // Sort descending by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(logs);
  }, (err) => {
    console.warn('[Firestore] Activity logs sync listener notice:', err.message);
  });
};

export const subscribeToVideoReels = (callback: (reels: VideoReel[]) => void) => {
  const colRef = collection(db, COLLECTIONS.VIDEO_REELS);
  return onSnapshot(colRef, (snapshot) => {
    const reels: VideoReel[] = [];
    snapshot.forEach((docSnap) => {
      reels.push({ id: docSnap.id, ...(docSnap.data() as Omit<VideoReel, 'id'>) });
    });
    callback(reels);
  }, (err) => {
    console.warn('[Firestore] Video reels sync listener notice:', err.message);
  });
};

export const subscribeToTikTokConfig = (callback: (config: TikTokSectionConfig) => void) => {
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'tiktok_section');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as TikTokSectionConfig);
    }
  }, (err) => {
    console.warn('[Firestore] TikTok config sync listener notice:', err.message);
  });
};

// --- CRUD Operations synced directly with Firestore ---

// 1. Calendar Events Live Sync
export const saveCalendarEventToFirestore = async (event: CalendarEvent) => {
  try {
    const docRef = doc(db, COLLECTIONS.CALENDAR_EVENTS, event.id);
    await setDoc(docRef, cleanData(event), { merge: true });
  } catch (err) {
    console.error('Error saving calendar event to Firestore:', err);
  }
};

export const deleteCalendarEventFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.CALENDAR_EVENTS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting calendar event from Firestore:', err);
  }
};

// 2. Bookings Live Sync
export const saveBookingToFirestore = async (booking: Booking) => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, booking.id);
    await setDoc(docRef, cleanData(booking), { merge: true });
  } catch (err) {
    console.error('Error saving booking to Firestore:', err);
  }
};

export const updateBookingInFirestore = async (id: string, updates: Partial<Booking>) => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
    await updateDoc(docRef, cleanData(updates));
  } catch (err) {
    console.error('Error updating booking in Firestore:', err);
  }
};

export const deleteBookingFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting booking from Firestore:', err);
  }
};

export const bulkDeleteBookingsFromFirestore = async (ids: string[]) => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
      batch.delete(docRef);
      // Also delete corresponding calendar event if any
      const calDocRef = doc(db, COLLECTIONS.CALENDAR_EVENTS, `cal-evt-${id}`);
      batch.delete(calDocRef);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error in bulk deleting bookings from Firestore:', err);
  }
};

// 3. Services Live Sync
export const saveServiceToFirestore = async (service: Service): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
    await setDoc(docRef, cleanData(service), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving service to Firestore:', err);
    throw err;
  }
};

export const deleteServiceFromFirestore = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.SERVICES, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting service from Firestore:', err);
    throw err;
  }
};

// 4. Gallery Items Live Sync
export const saveGalleryItemToFirestore = async (item: GalleryItem): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.GALLERY, item.id);
    await setDoc(docRef, cleanData(item), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving gallery item to Firestore:', err);
    throw err;
  }
};

export const deleteGalleryItemFromFirestore = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting gallery item from Firestore:', err);
    throw err;
  }
};

// 5. Event Categories Live Sync
export const saveEventCategoryToFirestore = async (category: EventCategoryItem) => {
  try {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, category.id);
    await setDoc(docRef, cleanData(category), { merge: true });
  } catch (err) {
    console.error('Error saving event category to Firestore:', err);
  }
};

export const deleteEventCategoryFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting event category from Firestore:', err);
  }
};

// 6. Callback Requests Live Sync
export const saveCallbackRequestToFirestore = async (req: CallbackRequest) => {
  try {
    const docRef = doc(db, COLLECTIONS.CALLBACKS, req.id);
    await setDoc(docRef, cleanData(req), { merge: true });
  } catch (err) {
    console.error('Error saving callback to Firestore:', err);
  }
};

export const updateCallbackRequestInFirestore = async (id: string, updates: Partial<CallbackRequest>) => {
  try {
    const docRef = doc(db, COLLECTIONS.CALLBACKS, id);
    await updateDoc(docRef, cleanData(updates));
  } catch (err) {
    console.error('Error updating callback in Firestore:', err);
  }
};

export const deleteCallbackRequestFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.CALLBACKS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting callback from Firestore:', err);
  }
};

// 7. Testimonials Live Sync
export const saveTestimonialToFirestore = async (testimonial: Testimonial) => {
  try {
    const docRef = doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id);
    await setDoc(docRef, cleanData(testimonial), { merge: true });
  } catch (err) {
    console.error('Error saving testimonial to Firestore:', err);
  }
};

export const deleteTestimonialFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting testimonial from Firestore:', err);
  }
};

// 8. Inventory Live Sync
export const saveInventoryItemToFirestore = async (item: InventoryItem) => {
  try {
    const docRef = doc(db, COLLECTIONS.INVENTORY, item.id);
    await setDoc(docRef, cleanData(item), { merge: true });
  } catch (err) {
    console.error('Error saving inventory item to Firestore:', err);
  }
};

export const deleteInventoryItemFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.INVENTORY, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting inventory item from Firestore:', err);
  }
};

// 9. Site Settings Live Sync (Announcement, Buffers)
export const saveSiteSettingsToFirestore = async (settings: { bufferDaysBefore?: number; bufferDaysAfter?: number; announcement?: SiteAnnouncement }) => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'global_config');
    await setDoc(docRef, cleanData(settings), { merge: true });
  } catch (err) {
    console.error('Error saving site settings to Firestore:', err);
  }
};

// 10. Activity Logs Live Sync
export const saveActivityLogToFirestore = async (log: Omit<ActivityLog, 'id'> & { id?: string }) => {
  try {
    const logId = log.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, logId);
    const payload = cleanData({
      ...log,
      id: logId,
      createdAt: log.createdAt || new Date().toISOString()
    });
    await setDoc(docRef, payload, { merge: true });
    return logId;
  } catch (err) {
    console.error('Error saving activity log to Firestore:', err);
    return null;
  }
};

export const deleteActivityLogFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting activity log from Firestore:', err);
  }
};

export const clearAllActivityLogsFromFirestore = async (logIds: string[]) => {
  try {
    const batch = writeBatch(db);
    logIds.forEach((id) => {
      const docRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error clearing activity logs from Firestore:', err);
  }
};

// 11. TikTok Reels & Live Hub Firestore Sync
export const saveVideoReelToFirestore = async (reel: VideoReel): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.VIDEO_REELS, reel.id);
    await setDoc(docRef, cleanData(reel), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving video reel to Firestore:', err);
    throw err;
  }
};

export const deleteVideoReelFromFirestore = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.VIDEO_REELS, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting video reel from Firestore:', err);
    throw err;
  }
};

export const saveTikTokConfigToFirestore = async (config: TikTokSectionConfig): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'tiktok_section');
    await setDoc(docRef, cleanData(config), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving TikTok section config to Firestore:', err);
    throw err;
  }
};

// --- Initial Database Seed Helper ---
// Seeds initial data if Firestore collections are empty, ensuring all data is persisted in the cloud
export const seedInitialDataIfEmpty = async (
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
) => {
  try {
    // 1. Services Check & Seed
    const srvSnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
    if (srvSnapshot.empty && initialData.services?.length > 0) {
      console.log('[Firestore] Bootstrapping services collection to Cloud Firestore...');
      const srvBatch = writeBatch(db);
      initialData.services.forEach((srv) => {
        srvBatch.set(doc(db, COLLECTIONS.SERVICES, srv.id), cleanData(srv));
      });
      await srvBatch.commit();
    }

    // 2. Gallery Check & Seed
    const galSnapshot = await getDocs(collection(db, COLLECTIONS.GALLERY));
    if (galSnapshot.empty && initialData.galleryItems?.length > 0) {
      console.log('[Firestore] Bootstrapping gallery collection to Cloud Firestore...');
      const galBatch = writeBatch(db);
      initialData.galleryItems.forEach((gal) => {
        galBatch.set(doc(db, COLLECTIONS.GALLERY, gal.id), cleanData(gal));
      });
      await galBatch.commit();
    }

    // 3. Categories Check & Seed
    const catSnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    if (catSnapshot.empty && initialData.eventCategories?.length > 0) {
      console.log('[Firestore] Bootstrapping event categories to Cloud Firestore...');
      const catBatch = writeBatch(db);
      initialData.eventCategories.forEach((cat) => {
        catBatch.set(doc(db, COLLECTIONS.CATEGORIES, cat.id), cleanData(cat));
      });
      await catBatch.commit();
    }

    // 4. Inventory Check & Seed
    const invSnapshot = await getDocs(collection(db, COLLECTIONS.INVENTORY));
    if (invSnapshot.empty && initialData.inventory?.length > 0) {
      console.log('[Firestore] Bootstrapping inventory to Cloud Firestore...');
      const invBatch = writeBatch(db);
      initialData.inventory.forEach((inv) => {
        invBatch.set(doc(db, COLLECTIONS.INVENTORY, inv.id), cleanData(inv));
      });
      await invBatch.commit();
    }

    // 5. Testimonials Check & Seed
    const testSnapshot = await getDocs(collection(db, COLLECTIONS.TESTIMONIALS));
    if (testSnapshot.empty && initialData.testimonials?.length > 0) {
      const testBatch = writeBatch(db);
      initialData.testimonials.forEach((test) => {
        testBatch.set(doc(db, COLLECTIONS.TESTIMONIALS, test.id), cleanData(test));
      });
      await testBatch.commit();
    }

    // 6. Calendar Events Check & Seed
    const calSnapshot = await getDocs(collection(db, COLLECTIONS.CALENDAR_EVENTS));
    if (calSnapshot.empty && initialData.calendarEvents?.length > 0) {
      const calBatch = writeBatch(db);
      initialData.calendarEvents.forEach((evt) => {
        calBatch.set(doc(db, COLLECTIONS.CALENDAR_EVENTS, evt.id), cleanData(evt));
      });
      await calBatch.commit();
    }

    // 7. Site Settings Check & Seed
    const settingsSnap = await getDocs(collection(db, COLLECTIONS.SETTINGS));
    if (settingsSnap.empty) {
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'global_config');
      await setDoc(settingsRef, cleanData({
        bufferDaysBefore: initialData.bufferDaysBefore,
        bufferDaysAfter: initialData.bufferDaysAfter,
        announcement: initialData.announcement
      }));
    }

    // 8. Activity Logs Check & Seed
    if (initialData.activityLogs && initialData.activityLogs.length > 0) {
      const logsSnapshot = await getDocs(collection(db, COLLECTIONS.ACTIVITY_LOGS));
      if (logsSnapshot.empty) {
        const logBatch = writeBatch(db);
        initialData.activityLogs.forEach((log) => {
          logBatch.set(doc(db, COLLECTIONS.ACTIVITY_LOGS, log.id), cleanData(log));
        });
        await logBatch.commit();
      }
    }
  } catch (err) {
    console.warn('[Firestore] Note on bootstrapping:', err);
  }
};
