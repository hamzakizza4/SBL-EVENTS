import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Service, GalleryItem, ServiceCategory } from '../types';
import { INITIAL_SERVICES, GALLERY_ITEMS } from '../data/mockData';
import { 
  subscribeToServices, 
  subscribeToGallery, 
  saveServiceToFirestore, 
  deleteServiceFromFirestore, 
  saveGalleryItemToFirestore, 
  deleteGalleryItemFromFirestore,
  cleanData
} from '../services/firestoreSync';
import { 
  saveServiceToStore, 
  deleteServiceFromStore, 
  saveGalleryItemToStore, 
  deleteGalleryItemFromStore,
  setLocalItem,
  STORAGE_KEYS
} from '../services/localStorageSync';
import { isFirebaseConfigured, resolvedFirebaseConfig } from '../lib/firebase';

export type ContentSyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface AdminContentSyncContextType {
  // Live State (Reflected across all views)
  services: Service[];
  galleryItems: GalleryItem[];
  
  // Real-time Cloud Sync Telemetry
  syncStatus: ContentSyncStatus;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  isCloudConnected: boolean;
  pendingSyncCount: number;

  // Services Operations (Guaranteed Firestore Persistence)
  addService: (serviceData: Omit<Service, 'id'> & { id?: string }) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  addServiceImage: (serviceId: string, imageUrl: string) => Promise<boolean>;
  removeServiceImage: (serviceId: string, imageIndex: number) => Promise<boolean>;
  setServiceCoverImage: (serviceId: string, imageUrl: string) => Promise<boolean>;
  addServiceVideo: (
    serviceId: string, 
    video: { title: string; url: string; platform?: 'tiktok' | 'youtube' | 'mp4' | 'other' }
  ) => Promise<boolean>;
  removeServiceVideo: (serviceId: string, videoId: string) => Promise<boolean>;
  resetServicesToDefault: () => Promise<boolean>;

  // Gallery Operations (Guaranteed Firestore Persistence)
  addGalleryItem: (itemData: Omit<GalleryItem, 'id'> & { id?: string; createdAt?: string }) => Promise<GalleryItem>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  resetGalleryToDefault: () => Promise<boolean>;

  // Maintenance & Portability Handlers
  forceRefreshFromCloud: () => Promise<void>;
  retryPendingSync: () => Promise<void>;
}

const LOCAL_STORAGE_SERVICES_KEY = 'sbl_services_catalog_v2';
const LOCAL_STORAGE_GALLERY_KEY = 'sbl_gallery_showcase_v2';
const LOCAL_STORAGE_PENDING_QUEUE_KEY = 'sbl_pending_content_sync_queue';

interface PendingSyncAction {
  id: string;
  type: 'save_service' | 'delete_service' | 'save_gallery' | 'delete_gallery';
  data?: any;
  targetId: string;
  timestamp: number;
}

const AdminContentSyncContext = createContext<AdminContentSyncContextType | null>(null);

export const AdminContentSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State: Load from localStorage or defaults for instant rendering
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SERVICES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SERVICES;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return GALLERY_ITEMS;
  });

  // 2. Cloud Synchronization Status Tracking
  const [syncStatus, setSyncStatus] = useState<ContentSyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(navigator.onLine && isFirebaseConfigured());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Queue ref for offline resilience
  const pendingQueueRef = useRef<PendingSyncAction[]>([]);

  // Load offline queue on mount
  useEffect(() => {
    try {
      const queueRaw = localStorage.getItem(LOCAL_STORAGE_PENDING_QUEUE_KEY);
      if (queueRaw) {
        const parsed = JSON.parse(queueRaw);
        if (Array.isArray(parsed)) {
          pendingQueueRef.current = parsed;
          setPendingSyncCount(parsed.length);
        }
      }
    } catch {
      pendingQueueRef.current = [];
    }
  }, []);

  const persistPendingQueue = (queue: PendingSyncAction[]) => {
    pendingQueueRef.current = queue;
    setPendingSyncCount(queue.length);
    try {
      localStorage.setItem(LOCAL_STORAGE_PENDING_QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // ignore
    }
  };

  const enqueuePendingAction = (action: Omit<PendingSyncAction, 'id' | 'timestamp'>) => {
    const newAction: PendingSyncAction = {
      ...action,
      id: `sync-act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    const updated = [...pendingQueueRef.current, newAction];
    persistPendingQueue(updated);
  };

  // Re-flush pending sync actions when connectivity returns
  const retryPendingSync = useCallback(async () => {
    if (!navigator.onLine || pendingQueueRef.current.length === 0) return;

    setSyncStatus('syncing');
    const queue = [...pendingQueueRef.current];
    const remaining: PendingSyncAction[] = [];

    for (const action of queue) {
      try {
        if (action.type === 'save_service' && action.data) {
          await saveServiceToFirestore(action.data);
        } else if (action.type === 'delete_service') {
          await deleteServiceFromFirestore(action.targetId);
        } else if (action.type === 'save_gallery' && action.data) {
          await saveGalleryItemToFirestore(action.data);
        } else if (action.type === 'delete_gallery') {
          await deleteGalleryItemFromFirestore(action.targetId);
        }
      } catch (err) {
        console.warn('[ContentSync] Failed to flush queued sync item:', action, err);
        remaining.push(action);
      }
    }

    persistPendingQueue(remaining);
    if (remaining.length === 0) {
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
    } else {
      setSyncStatus('error');
    }
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsCloudConnected(true);
      retryPendingSync();
    };
    const handleOffline = () => {
      setIsCloudConnected(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [retryPendingSync]);

  // 3. Real-Time Cloud Listeners with Automatic Seeding & Portability
  useEffect(() => {
    let isSubscribed = true;

    // A. Subscribe to Services in Cloud Firestore
    const unsubServices = subscribeToServices((cloudServices) => {
      if (!isSubscribed) return;
      if (cloudServices && cloudServices.length > 0) {
        setServices(cloudServices);
        try {
          localStorage.setItem(LOCAL_STORAGE_SERVICES_KEY, JSON.stringify(cloudServices));
          setLocalItem(STORAGE_KEYS.SERVICES, cloudServices);
        } catch {
          // ignore
        }
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
        setIsCloudConnected(true);
      } else if (cloudServices && cloudServices.length === 0) {
        // Fresh database detected (e.g. hosted somewhere else) -> Auto bootstrap default services
        console.log('[ContentSync] Fresh Firestore detected. Bootstrapping default services...');
        INITIAL_SERVICES.forEach((srv) => {
          saveServiceToFirestore(srv).catch((err) => console.warn('[ContentSync] Auto-seed service error:', err));
        });
      }
    });

    // B. Subscribe to Gallery Items in Cloud Firestore
    const unsubGallery = subscribeToGallery((cloudGallery) => {
      if (!isSubscribed) return;
      if (cloudGallery && cloudGallery.length > 0) {
        setGalleryItems(cloudGallery);
        try {
          localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(cloudGallery));
          setLocalItem(STORAGE_KEYS.GALLERY, cloudGallery);
        } catch {
          // ignore
        }
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
        setIsCloudConnected(true);
      } else if (cloudGallery && cloudGallery.length === 0) {
        // Fresh database detected -> Auto bootstrap default gallery showcases
        console.log('[ContentSync] Fresh Firestore detected. Bootstrapping default gallery...');
        GALLERY_ITEMS.forEach((item) => {
          saveGalleryItemToFirestore(item).catch((err) => console.warn('[ContentSync] Auto-seed gallery error:', err));
        });
      }
    });

    return () => {
      isSubscribed = false;
      if (typeof unsubServices === 'function') unsubServices();
      if (typeof unsubGallery === 'function') unsubGallery();
    };
  }, []);

  // 4. Force manual refresh from cloud
  const forceRefreshFromCloud = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      await retryPendingSync();
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
    } catch (err: any) {
      setSyncStatus('error');
      setSyncError(err?.message || 'Failed to sync with cloud');
    }
  }, [retryPendingSync]);

  // ==========================================
  // SERVICES OPERATIONS (Immediate Persistence)
  // ==========================================

  const addService = useCallback(async (serviceData: Omit<Service, 'id'> & { id?: string }): Promise<Service> => {
    const newService: Service = {
      ...serviceData,
      id: serviceData.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    // 1. Optimistic React State update (Immediate reflection across all client-side views)
    setServices((prev) => [...prev, newService]);

    // 2. Concurrently save to local storage
    try {
      saveServiceToStore(newService).catch(console.error);
      const current = [...services, newService];
      localStorage.setItem(LOCAL_STORAGE_SERVICES_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('[ContentSync] Local storage write warning:', e);
    }

    // 3. Immediately persist to Cloud Firestore
    setSyncStatus('syncing');
    try {
      await saveServiceToFirestore(newService);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
    } catch (err: any) {
      console.error('[ContentSync] Cloud save failed for service:', err);
      enqueuePendingAction({ type: 'save_service', targetId: newService.id, data: newService });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Saved locally, queued for cloud sync');
    }

    return newService;
  }, [services]);

  const updateService = useCallback(async (id: string, updates: Partial<Service>): Promise<boolean> => {
    let updatedTarget: Service | null = null;

    // 1. Optimistic React State update
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id === id) {
          updatedTarget = { ...srv, ...updates };
          return updatedTarget;
        }
        return srv;
      })
    );

    if (!updatedTarget) return false;

    // 2. Local persistence
    try {
      saveServiceToStore(updatedTarget).catch(console.error);
      const updatedList = services.map((s) => (s.id === id ? updatedTarget! : s));
      localStorage.setItem(LOCAL_STORAGE_SERVICES_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('[ContentSync] Local storage write warning:', e);
    }

    // 3. Immediate Cloud Firestore persistence
    setSyncStatus('syncing');
    try {
      await saveServiceToFirestore(updatedTarget);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud update failed for service:', err);
      enqueuePendingAction({ type: 'save_service', targetId: id, data: updatedTarget });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Updated locally, queued for cloud sync');
      return true;
    }
  }, [services]);

  const deleteService = useCallback(async (id: string): Promise<boolean> => {
    // 1. Optimistic React State update
    setServices((prev) => prev.filter((srv) => srv.id !== id));

    // 2. Local persistence
    try {
      deleteServiceFromStore(id).catch(console.error);
      const updatedList = services.filter((s) => s.id !== id);
      localStorage.setItem(LOCAL_STORAGE_SERVICES_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('[ContentSync] Local storage delete warning:', e);
    }

    // 3. Immediate Cloud Firestore delete
    setSyncStatus('syncing');
    try {
      await deleteServiceFromFirestore(id);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud delete failed for service:', err);
      enqueuePendingAction({ type: 'delete_service', targetId: id });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Deleted locally, queued for cloud sync');
      return true;
    }
  }, [services]);

  const addServiceImage = useCallback(async (serviceId: string, imageUrl: string): Promise<boolean> => {
    if (!imageUrl.trim()) return false;
    const target = services.find((s) => s.id === serviceId);
    if (!target) return false;

    const currentGallery = target.galleryImages || [];
    const updatedGallery = [...currentGallery, imageUrl.trim()];
    return updateService(serviceId, { galleryImages: updatedGallery });
  }, [services, updateService]);

  const removeServiceImage = useCallback(async (serviceId: string, imageIndex: number): Promise<boolean> => {
    const target = services.find((s) => s.id === serviceId);
    if (!target || !target.galleryImages) return false;

    const updatedGallery = [...target.galleryImages];
    updatedGallery.splice(imageIndex, 1);
    return updateService(serviceId, { galleryImages: updatedGallery });
  }, [services, updateService]);

  const setServiceCoverImage = useCallback(async (serviceId: string, imageUrl: string): Promise<boolean> => {
    if (!imageUrl.trim()) return false;
    return updateService(serviceId, { image: imageUrl.trim() });
  }, [updateService]);

  const addServiceVideo = useCallback(async (
    serviceId: string, 
    video: { title: string; url: string; platform?: 'tiktok' | 'youtube' | 'mp4' | 'other' }
  ): Promise<boolean> => {
    if (!video.url.trim()) return false;
    const target = services.find((s) => s.id === serviceId);
    if (!target) return false;

    const newVideo = {
      id: `vid-${Date.now()}`,
      title: video.title.trim() || `${target.title} Video`,
      url: video.url.trim(),
      platform: video.platform || (video.url.includes('tiktok') ? 'tiktok' : video.url.includes('youtube') || video.url.includes('youtu.be') ? 'youtube' : 'other'),
    };

    const currentVideos = target.videos || [];
    return updateService(serviceId, { videos: [...currentVideos, newVideo] });
  }, [services, updateService]);

  const removeServiceVideo = useCallback(async (serviceId: string, videoId: string): Promise<boolean> => {
    const target = services.find((s) => s.id === serviceId);
    if (!target || !target.videos) return false;

    const updatedVideos = target.videos.filter((v) => v.id !== videoId);
    return updateService(serviceId, { videos: updatedVideos });
  }, [services, updateService]);

  const resetServicesToDefault = useCallback(async (): Promise<boolean> => {
    // 1. Optimistic React state reset
    setServices(INITIAL_SERVICES);

    // 2. Local storage reset
    try {
      localStorage.setItem(LOCAL_STORAGE_SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
      INITIAL_SERVICES.forEach((srv) => saveServiceToStore(srv).catch(console.error));
    } catch (e) {
      console.warn('[ContentSync] Local storage reset warning:', e);
    }

    // 3. Cloud Firestore persistence for all defaults
    setSyncStatus('syncing');
    try {
      await Promise.all(INITIAL_SERVICES.map((srv) => saveServiceToFirestore(srv)));
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud reset services error:', err);
      setSyncStatus('offline');
      setSyncError('Default services restored locally; waiting for cloud sync.');
      return true;
    }
  }, []);

  // ==========================================
  // GALLERY OPERATIONS (Immediate Persistence)
  // ==========================================

  const addGalleryItem = useCallback(async (itemData: Omit<GalleryItem, 'id'> & { id?: string; createdAt?: string }): Promise<GalleryItem> => {
    const newItem: GalleryItem = {
      ...itemData,
      id: itemData.id || `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: itemData.createdAt || new Date().toISOString(),
    };

    // 1. Optimistic React State update (Immediate reflection across Gallery & Home views)
    setGalleryItems((prev) => [newItem, ...prev]);

    // 2. Concurrently save to local storage
    try {
      saveGalleryItemToStore(newItem).catch(console.error);
      const current = [newItem, ...galleryItems];
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('[ContentSync] Local storage write warning:', e);
    }

    // 3. Immediately persist to Cloud Firestore
    setSyncStatus('syncing');
    try {
      await saveGalleryItemToFirestore(newItem);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
    } catch (err: any) {
      console.error('[ContentSync] Cloud save failed for gallery item:', err);
      enqueuePendingAction({ type: 'save_gallery', targetId: newItem.id, data: newItem });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Event showcase saved locally, queued for cloud sync');
    }

    return newItem;
  }, [galleryItems]);

  const updateGalleryItem = useCallback(async (id: string, updates: Partial<GalleryItem>): Promise<boolean> => {
    let updatedTarget: GalleryItem | null = null;

    // 1. Optimistic React State update
    setGalleryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedTarget = { ...item, ...updates };
          return updatedTarget;
        }
        return item;
      })
    );

    if (!updatedTarget) return false;

    // 2. Local persistence
    try {
      saveGalleryItemToStore(updatedTarget).catch(console.error);
      const updatedList = galleryItems.map((g) => (g.id === id ? updatedTarget! : g));
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('[ContentSync] Local storage write warning:', e);
    }

    // 3. Immediate Cloud Firestore persistence
    setSyncStatus('syncing');
    try {
      await saveGalleryItemToFirestore(updatedTarget);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud update failed for gallery item:', err);
      enqueuePendingAction({ type: 'save_gallery', targetId: id, data: updatedTarget });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Updated locally, queued for cloud sync');
      return true;
    }
  }, [galleryItems]);

  const deleteGalleryItem = useCallback(async (id: string): Promise<boolean> => {
    // 1. Optimistic React State update
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));

    // 2. Local persistence
    try {
      deleteGalleryItemFromStore(id).catch(console.error);
      const updatedList = galleryItems.filter((g) => g.id !== id);
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('[ContentSync] Local storage delete warning:', e);
    }

    // 3. Immediate Cloud Firestore delete
    setSyncStatus('syncing');
    try {
      await deleteGalleryItemFromFirestore(id);
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud delete failed for gallery item:', err);
      enqueuePendingAction({ type: 'delete_gallery', targetId: id });
      setSyncStatus('offline');
      setSyncError(err?.message || 'Deleted locally, queued for cloud sync');
      return true;
    }
  }, [galleryItems]);

  const resetGalleryToDefault = useCallback(async (): Promise<boolean> => {
    // 1. Optimistic React State reset
    setGalleryItems(GALLERY_ITEMS);

    // 2. Local storage reset
    try {
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(GALLERY_ITEMS));
      GALLERY_ITEMS.forEach((item) => saveGalleryItemToStore(item).catch(console.error));
    } catch (e) {
      console.warn('[ContentSync] Local storage reset warning:', e);
    }

    // 3. Cloud Firestore persistence for all defaults
    setSyncStatus('syncing');
    try {
      await Promise.all(GALLERY_ITEMS.map((item) => saveGalleryItemToFirestore(item)));
      setSyncStatus('synced');
      setLastSyncedAt(new Date());
      setSyncError(null);
      return true;
    } catch (err: any) {
      console.error('[ContentSync] Cloud reset gallery error:', err);
      setSyncStatus('offline');
      setSyncError('Default portfolio restored locally; waiting for cloud sync.');
      return true;
    }
  }, []);

  return (
    <AdminContentSyncContext.Provider
      value={{
        services,
        galleryItems,
        syncStatus,
        isSyncing: syncStatus === 'syncing',
        lastSyncedAt,
        syncError,
        isCloudConnected,
        pendingSyncCount,
        addService,
        updateService,
        deleteService,
        addServiceImage,
        removeServiceImage,
        setServiceCoverImage,
        addServiceVideo,
        removeServiceVideo,
        resetServicesToDefault,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetGalleryToDefault,
        forceRefreshFromCloud,
        retryPendingSync,
      }}
    >
      {children}
    </AdminContentSyncContext.Provider>
  );
};

export const useAdminContentSync = (): AdminContentSyncContextType => {
  const context = useContext(AdminContentSyncContext);
  if (!context) {
    throw new Error('useAdminContentSync must be used within an AdminContentSyncProvider');
  }
  return context;
};
