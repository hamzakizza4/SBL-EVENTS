import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Page, 
  Service, 
  Booking, 
  CalendarEvent, 
  Testimonial, 
  InventoryItem, 
  ToastMessage,
  BookingStatus,
  ThemeMode,
  AdminUser
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_BOOKINGS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_TESTIMONIALS, 
  INVENTORY_ITEMS,
  INITIAL_ADMIN_USERS
} from '../data/mockData';

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
  addBooking: (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'status'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => void;
  deleteBooking: (id: string) => void;
  
  // Calendar actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  
  // Testimonial actions
  addTestimonial: (test: Omit<Testimonial, 'id' | 'date' | 'approved' | 'verified'>) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  
  // Inventory actions
  updateInventoryQuantity: (id: string, total: number, available: number, dailyRate?: number) => void;
  
  // Quick booking drawer helper
  isBookingModalOpen: boolean;
  openBookingModal: (prefill?: { serviceId?: string; date?: string; packageType?: string }) => void;
  closeBookingModal: () => void;
  bookingPrefill: { serviceId?: string; date?: string; packageType?: string } | null;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  THEME: 'sbl_events_theme_v4',
  BOOKINGS: 'sbl_events_bookings_v2',
  CALENDAR: 'sbl_events_calendar_v2',
  TESTIMONIALS: 'sbl_events_testimonials_v2',
  INVENTORY: 'sbl_events_inventory_v2',
  ADMIN_AUTH: 'sbl_events_admin_auth_v2',
  ADMIN_USERS: 'sbl_events_admin_users_v2',
  ACTIVE_USER: 'sbl_events_active_user_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [services] = useState<Service[]>(INITIAL_SERVICES);

  // Theme mode: Default is medium-dark-blue (medium dark blue and white only)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
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

  // Booking Modal drawer
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPrefill, setBookingPrefill] = useState<{ serviceId?: string; date?: string; packageType?: string } | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
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

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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

  const addBooking = (bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): Booking => {
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

    // Also automatically register a tentative entry into the calendar
    const serviceNames = newBooking.selectedServices.map(
      (sId) => services.find((s) => s.id === sId)?.title || sId
    );

    const newCalendarEvent: CalendarEvent = {
      id: `cal-evt-${Date.now()}`,
      title: `${newBooking.eventType.toUpperCase()}: ${newBooking.clientName}`,
      eventType: newBooking.eventType,
      startDate: newBooking.eventDate,
      endDate: newBooking.endDate || newBooking.eventDate,
      location: newBooking.location || 'Client Venue',
      status: 'tentative',
      servicesSummary: serviceNames,
      clientName: newBooking.clientName,
      guestCount: newBooking.guestCount,
    };

    setCalendarEvents((prev) => [...prev, newCalendarEvent]);

    showToast(
      'Booking Request Received!',
      `Reference #${refNum}. Our production team will contact you within 2 hours.`,
      'success'
    );

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, notes?: string) => {
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
    showToast('Booking Updated', `Booking status changed to ${status.toUpperCase()}.`, 'info');
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast('Booking Removed', 'The booking record has been deleted.', 'warning');
  };

  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvt]);
    showToast('Calendar Updated', `Added "${newEvt.title}" to event schedule.`, 'success');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
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
    showToast('Thank You!', 'Your review has been submitted for verification.', 'success');
  };

  const approveTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approved: true } : t))
    );
    showToast('Review Published', 'Testimonial is now live on the public website.', 'success');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast('Review Deleted', 'Testimonial removed.', 'info');
  };

  const updateInventoryQuantity = (id: string, total: number, available: number, dailyRate?: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              totalQuantity: total,
              availableQuantity: available,
              dailyRate: dailyRate !== undefined ? dailyRate : item.dailyRate,
            }
          : item
      )
    );
    showToast('Inventory Updated', 'Stock count and rental pricing adjusted.', 'success');
  };

  const openBookingModal = (prefill?: { serviceId?: string; date?: string; packageType?: string }) => {
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
        bookings,
        calendarEvents,
        testimonials,
        inventory,
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
        updateBookingStatus,
        deleteBooking,
        addCalendarEvent,
        deleteCalendarEvent,
        addTestimonial,
        approveTestimonial,
        deleteTestimonial,
        updateInventoryQuantity,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        bookingPrefill,
        toasts,
        showToast,
        removeToast,
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
