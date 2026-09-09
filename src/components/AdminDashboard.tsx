import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus, EventType, Booking, InventoryItem, AdminUser, AdminRole, ServiceCategory } from '../types';
import { 
  buildAllBookingConflictsMap, 
  BookingConflictDetails, 
  validateBookingOverlap 
} from '../utils/bookingConflictValidator';
import { BookingConflictAlertModal } from './BookingConflictAlertModal';
import { ConfirmOverlapBookingModal } from './ConfirmOverlapBookingModal';
import { CloudSyncBadge } from './CloudSyncBadge';
import { getThemeClasses } from '../utils/themeStyles';
import { formatUGX, formatUGXShort } from '../utils/currencyUtils';
import { 
  Lock, 
  Unlock, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Eye, 
  EyeOff,
  ShieldCheck, 
  Star, 
  Sparkles, 
  Boxes,
  Check,
  Users,
  UserCheck,
  UserX,
  KeyRound,
  Shield,
  Crown,
  Phone,
  Mail,
  UserPlus,
  RefreshCw,
  PhoneCall,
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Sliders,
  Printer,
  FileText,
  Layers,
  Tent,
  Volume2,
  Tv,
  Zap,
  CalendarRange,
  Info,
  CreditCard,
  CheckSquare,
  Square,
  MinusSquare,
  Send,
  AlertTriangle,
  RotateCcw,
  Bell,
  Database,
  Smartphone,
  Table as TableIcon,
  MoveLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminDashboardAnalytics } from './AdminDashboardAnalytics';
import { AdminCallbacksSection } from './AdminCallbacksSection';
import { AdminServicesMediaSection } from './AdminServicesMediaSection';
import { AdminGallerySection } from './AdminGallerySection';
import { AdminCategoriesSection } from './AdminCategoriesSection';
import { AdminPaymentRemindersSection } from './AdminPaymentRemindersSection';
import { AdminMonthlyCalendar } from './AdminMonthlyCalendar';
import { AdminBookingsTableSkeleton, AdminAnalyticsSkeleton, AdminPaymentsSkeleton } from './AdminSkeletonLoader';
import { AdminToastNotificationSystem } from './AdminToastNotificationSystem';
import { AdminActivityLogsSection } from './AdminActivityLogsSection';
import { AdminTikTokSection } from './AdminTikTokSection';
import { SwipeableBookingCard } from './SwipeableBookingCard';
import { DeleteBookingModal } from './DeleteBookingModal';
import { Camera, History } from 'lucide-react';
import { checkAdminLockoutStatus, recordFailedLoginAttempt, resetLoginAttempts } from '../utils/security';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    currentAdminUser,
    adminUsers,
    loginAdmin, 
    logoutAdmin, 
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminUserStatus,
    bookings, 
    updateBookingStatus, 
    deleteBooking,
    bulkDeleteBookings,
    bulkSendPaymentReminders,
    bulkUpdateBookingStatus,
    addBooking,
    calendarEvents, 
    addCalendarEvent, 
    deleteCalendarEvent,
    inventory, 
    updateInventoryQuantity,
    testimonials, 
    approveTestimonial, 
    deleteTestimonial,
    galleryItems,
    eventCategories,
    callbackRequests,
    services,
    bufferDaysBefore,
    bufferDaysAfter,
    setBufferDaysBefore,
    setBufferDaysAfter,
    showToast,
    triggerMockEmailConfirmation,
    theme,
    isBookingsLoading,
    fastSync,
    simulateFirestoreFetch,
    adminBookingAlerts,
    dismissAdminAlert,
    clearAllAdminAlerts,
    triggerQuickBookingAlert,
    activityLogs,
    logActivity
  } = useApp();

  const t = getThemeClasses(theme);

  // Authentication State
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showDemoPasscodes, setShowDemoPasscodes] = useState(false);
  
  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'bookings' | 'categories' | 'gallery' | 'services-media' | 'callbacks' | 'employees' | 'calendar' | 'inventory' | 'testimonials' | 'activity_logs' | 'tiktok'>('overview');

  // Bookings Tab Filter/Search & Expandable Rows State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedBookingIds, setExpandedBookingIds] = useState<Set<string>>(new Set());
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Multi-Select & Bulk Operations State
  const [selectedBookingIds, setSelectedBookingIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkEmailCustomMessage, setBulkEmailCustomMessage] = useState('');
  const [bulkEmailSubject, setBulkEmailSubject] = useState('Payment Reminder: SBL Event Logistics Invoice & Balance Due');

  // Touch Device View & Swipe-to-Delete State
  const [bookingViewMode, setBookingViewMode] = useState<'cards' | 'table'>('cards');
  const [deleteModalBooking, setDeleteModalBooking] = useState<Booking | null>(null);
  const [isSingleDeleteModalOpen, setIsSingleDeleteModalOpen] = useState(false);

  // Booking Overlap Validation Layer & Conflict Alert Modals
  const [selectedConflictBooking, setSelectedConflictBooking] = useState<Booking | null>(null);
  const [selectedConflictDetails, setSelectedConflictDetails] = useState<BookingConflictDetails | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  const [pendingConfirmOverlapBooking, setPendingConfirmOverlapBooking] = useState<Booking | null>(null);
  const [pendingConfirmOverlapDetails, setPendingConfirmOverlapDetails] = useState<BookingConflictDetails | null>(null);
  const [isConfirmOverlapModalOpen, setIsConfirmOverlapModalOpen] = useState(false);

  // Compute live conflicts map against confirmed reservations, pending bookings, and calendar events
  const bookingConflicts = useMemo(() => {
    return buildAllBookingConflictsMap(bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter);
  }, [bookings, calendarEvents, bufferDaysBefore, bufferDaysAfter]);

  const activeOverlapConflictsCount = useMemo(() => {
    let count = 0;
    bookingConflicts.forEach((details) => {
      if (details.hasConflict && details.severity === 'critical') {
        count++;
      }
    });
    return count;
  }, [bookingConflicts]);

  const handleInspectConflict = (booking: Booking, conflict: BookingConflictDetails) => {
    setSelectedConflictBooking(booking);
    setSelectedConflictDetails(conflict);
    setIsConflictModalOpen(true);
  };

  const handleRequestStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    if (newStatus === 'confirmed') {
      const conflict = bookingConflicts.get(bookingId);
      if (conflict && conflict.hasConflict && conflict.severity === 'critical') {
        const target = bookings.find((b) => b.id === bookingId);
        if (target) {
          setPendingConfirmOverlapBooking(target);
          setPendingConfirmOverlapDetails(conflict);
          setIsConfirmOverlapModalOpen(true);
          return;
        }
      }
    }
    updateBookingStatus(bookingId, newStatus);
  };

  const handleForceConfirmOverlap = () => {
    if (pendingConfirmOverlapBooking) {
      updateBookingStatus(pendingConfirmOverlapBooking.id, 'confirmed');
      showToast('Booking Confirmed', `Booking #${pendingConfirmOverlapBooking.referenceNumber} has been confirmed with overlap override.`, 'warning');
      setIsConfirmOverlapModalOpen(false);
      setPendingConfirmOverlapBooking(null);
      setPendingConfirmOverlapDetails(null);
    }
  };

  const handleDeleteRequest = (booking: Booking) => {
    setDeleteModalBooking(booking);
    setIsSingleDeleteModalOpen(true);
  };

  const handleConfirmDeleteBooking = (booking: Booking) => {
    deleteBooking(booking.id);
    setIsSingleDeleteModalOpen(false);
    setDeleteModalBooking(null);
  };

  // Quick Booking Alert Popover & Data Refresh State
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshingData(true);
    await fastSync();
    setIsRefreshingData(false);
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 2000);
    showToast('⚡ Fast Synced', 'Live bookings and event schedules refreshed with zero lag.', 'success');
  };

  const handleSimulateQuickBooking = () => {
    const mockNames = [
      'Ritah Mukasa',
      'Dr. Patrick Byaruhanga',
      'Kembabazi Brenda',
      'Geoffrey Mugisha',
      'Nalubega Sarah'
    ];
    const mockLocations = [
      'Speke Resort Munyonyo, Kampala',
      'Victoria Serena Golf Resort, Kigo',
      'Kampala Serena Hotel Gardens',
      'Sheraton Hotel Rwenzori Ballroom, Kampala',
      'Jinja Nile Resort, Jinja'
    ];
    const mockEvents: EventType[] = ['wedding', 'corporate', 'concert', 'introduction', 'birthday'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const randomEvt = mockEvents[Math.floor(Math.random() * mockEvents.length)];

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14 + Math.floor(Math.random() * 12));
    const eventDateStr = targetDate.toISOString().split('T')[0];

    const newBooking = addBooking({
      clientName: randomName,
      email: `${randomName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      phone: `+256 70${Math.floor(1000000 + Math.random() * 9000000)}`,
      companyName: randomEvt === 'corporate' ? 'Nile Breweries Ltd' : '',
      eventType: randomEvt,
      eventDate: eventDateStr,
      durationDays: 1,
      location: randomLoc,
      venueType: 'outdoor_grass',
      guestCount: 350,
      selectedServices: ['srv-dome-tents', 'srv-jbl-sound', 'srv-stage-truss'],
      addons: [
        { id: 'add-generator', name: 'Standby Generator 50kVA', price: 650000, quantity: 1 },
        { id: 'add-moving-heads', name: 'Moving Head Beam Lights', price: 400000, quantity: 4 }
      ],
      customRequests: 'Need high-lumen LED screens and dome canopy rigging completed 3 hours before arrival.',
      isQuickBooking: true,
      estimatedTotal: 6500000 + Math.floor(Math.random() * 5) * 500000
    });

    if (newBooking) {
      showToast(
        '⚡ Test Quick Booking Simulated',
        `Simulated incoming request from ${newBooking.clientName} for ${newBooking.eventType}. Ref #${newBooking.referenceNumber}`,
        'info'
      );
    }
  };

  const toggleExpandBooking = (id: string) => {
    setExpandedBookingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllBookings = () => {
    setExpandedBookingIds(new Set(filteredBookings.map((b) => b.id)));
  };

  const collapseAllBookings = () => {
    setExpandedBookingIds(new Set());
  };

  // Manual Booking Form State
  const [manualClient, setManualClient] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualType, setManualType] = useState<EventType>('wedding');
  const [manualServiceIds] = useState<string[]>(['mega-tents']);
  const [manualTotal, setManualTotal] = useState(7500000);

  // New Calendar Event Form State
  const [isAddCalEventOpen, setIsAddCalEventOpen] = useState(false);
  const [calTitle, setCalTitle] = useState('');
  const [calType, setCalType] = useState<EventType>('corporate');
  const [calStartDate, setCalStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [calEndDate, setCalEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [calLocation, setCalLocation] = useState('Kampala Grounds');
  const [calIsPublic, setCalIsPublic] = useState(false);
  const [calDesc, setCalDesc] = useState('');

  // Inventory Edit State
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [invAvailable, setInvAvailable] = useState<number>(0);
  const [invTotal, setInvTotal] = useState<number>(0);
  const [invRate, setInvRate] = useState<number>(0);

  // Employee / Sub-Admin Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<AdminUser | null>(null);
  const [empUserId, setEmpUserId] = useState('');
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empPassword, setEmpPassword] = useState('123');
  const [empRole, setEmpRole] = useState<AdminRole>('operations_manager');
  const [empRoleTitle, setEmpRoleTitle] = useState('Operations & Dispatch Lead');
  const [empPerms, setEmpPerms] = useState({
    canManageBookings: true,
    canManageSubAdmins: false,
    canManageCalendar: true,
    canManageInventory: true,
    canManageTestimonials: true,
    canManageFinances: false,
    canManageSettings: false,
  });

  // Operational Metrics Calculations (Focus on Inventory, Reviews, Operations, and Unfinished Balances - No Revenue)
  const totalFleetUnits = inventory.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const availableFleetUnits = inventory.reduce((sum, item) => sum + (item.availableQuantity || 0), 0);
  const deployedFleetUnits = Math.max(0, totalFleetUnits - availableFleetUnits);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingReviewsCount = testimonials.filter((t) => !t.approved).length;
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  // Unfinished payments / pending client balances calculation
  const unpaidBookingsCount = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const paid = b.amountPaid !== undefined ? b.amountPaid : (b.paymentStatus === 'fully_paid' ? b.estimatedTotal : 0);
    const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal - paid);
    return balance > 0 || b.paymentStatus === 'unpaid' || b.paymentStatus === 'deposit_paid' || b.paymentStatus === 'overdue';
  }).length;

  const isMajorAdmin = currentAdminUser?.isMajorAdmin ?? false;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = checkAdminLockoutStatus();
    if (lockout.isLocked) {
      showToast(
        'Portal Locked',
        `Too many failed attempts detected. Please wait ${lockout.remainingSeconds} seconds before trying again.`,
        'error'
      );
      return;
    }

    const success = loginAdmin(userIdInput, passwordInput);
    if (success) {
      resetLoginAttempts();
    } else {
      const attempt = recordFailedLoginAttempt();
      if (attempt.isLocked) {
        showToast(
          'Account Security Lockout',
          'Multiple invalid attempts recorded. Portal is temporarily locked for 60 seconds.',
          'error'
        );
      } else {
        const remaining = Math.max(0, attempt.maxAttempts - attempt.attemptsCount);
        showToast(
          'Authentication Failed',
          `Incorrect User ID or Password. ${remaining} attempt(s) remaining before temporary lockout.`,
          'error'
        );
      }
    }
  };

  const handleQuickLoginMajor = () => {
    setUserIdInput('sbl 1000');
    setPasswordInput('123');
    loginAdmin('sbl 1000', '123');
  };

  const handleQuickLoginSub = (uId: string) => {
    setUserIdInput(uId);
    setPasswordInput('123');
    loginAdmin(uId, '123');
  };

  const handleExportCSV = () => {
    const headers = ['Reference', 'Client', 'Phone', 'Email', 'Event Type', 'Date', 'Guest Count', 'Estimated Total (UGX)', 'Status'];
    const rows = bookings.map((b) => [
      b.referenceNumber,
      `"${b.clientName}"`,
      b.phone,
      b.email,
      b.eventType,
      b.eventDate,
      b.guestCount,
      `"UGX ${b.estimatedTotal.toLocaleString()}"`,
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SBL_Events_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Completed', 'Bookings exported to CSV file.', 'success');
  };

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEmployeeModalOpen) setIsEmployeeModalOpen(false);
        if (isManualBookingOpen) setIsManualBookingOpen(false);
        if (isAddCalEventOpen) setIsAddCalEventOpen(false);
        if (isBulkDeleteModalOpen) setIsBulkDeleteModalOpen(false);
        if (isBulkEmailModalOpen) setIsBulkEmailModalOpen(false);
        if (selectedBookingDetails) setSelectedBookingDetails(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEmployeeModalOpen, isManualBookingOpen, isAddCalEventOpen, isBulkDeleteModalOpen, isBulkEmailModalOpen, selectedBookingDetails]);

  const handleSaveInventory = (item: InventoryItem) => {
    updateInventoryQuantity(item.id, invTotal, invAvailable, invRate);
    setEditingInvId(null);
  };

  const startEditInventory = (item: InventoryItem) => {
    setEditingInvId(item.id);
    setInvAvailable(item.availableQuantity);
    setInvTotal(item.totalQuantity);
    setInvRate(item.dailyRate);
  };

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClient || !manualPhone || !manualDate) return;

    addBooking({
      clientName: manualClient,
      email: manualEmail || `${manualClient.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: manualPhone,
      eventType: manualType,
      eventDate: manualDate,
      durationDays: 1,
      location: 'Main Hall / Field',
      venueType: 'outdoor_grass',
      guestCount: 300,
      selectedServices: manualServiceIds,
      addons: [],
      customRequests: 'Added manually via Admin portal',
      estimatedTotal: manualTotal,
    });

    setManualClient('');
    setManualPhone('');
    setManualEmail('');
    setIsManualBookingOpen(false);
  };

  const handleAddCalEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calTitle || !calStartDate) return;

    addCalendarEvent({
      title: calTitle,
      eventType: calType,
      startDate: calStartDate,
      endDate: calEndDate || calStartDate,
      location: calLocation,
      status: 'booked',
      servicesSummary: ['Mega Tents', 'Sound & Stage'],
      isPublic: calIsPublic,
      publicDescription: calDesc,
    });

    setCalTitle('');
    setCalDesc('');
    setIsAddCalEventOpen(false);
  };

  // Sub-Admin Employee Form Handlers
  const openNewEmployeeModal = () => {
    const nextNum = 1000 + adminUsers.length + 1;
    setEditingEmployee(null);
    setEmpUserId(`sbl ${nextNum}`);
    setEmpName('');
    setEmpEmail('');
    setEmpPhone('');
    setEmpPassword('123');
    setEmpRole('operations_manager');
    setEmpRoleTitle('Operations & Logistics Lead');
    setEmpPerms({
      canManageBookings: true,
      canManageSubAdmins: false,
      canManageCalendar: true,
      canManageInventory: true,
      canManageTestimonials: true,
      canManageFinances: false,
      canManageSettings: false,
    });
    setIsEmployeeModalOpen(true);
  };

  const openEditEmployeeModal = (user: AdminUser) => {
    setEditingEmployee(user);
    setEmpUserId(user.userId);
    setEmpName(user.name);
    setEmpEmail(user.email);
    setEmpPhone(user.phone || '');
    setEmpPassword(user.password);
    setEmpRole(user.role);
    setEmpRoleTitle(user.roleTitle);
    setEmpPerms({ ...user.permissions });
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empUserId.trim() || !empName.trim() || !empEmail.trim()) {
      showToast('Validation Error', 'Please fill in User ID, Name, and Email.', 'warning');
      return;
    }

    if (editingEmployee) {
      updateAdminUser(editingEmployee.id, {
        userId: empUserId.trim(),
        name: empName.trim(),
        email: empEmail.trim(),
        phone: empPhone.trim(),
        password: empPassword.trim() || '123',
        role: empRole,
        roleTitle: empRoleTitle.trim(),
        permissions: empPerms,
      });
    } else {
      addAdminUser({
        userId: empUserId.trim(),
        name: empName.trim(),
        email: empEmail.trim(),
        phone: empPhone.trim(),
        password: empPassword.trim() || '123',
        role: empRole,
        roleTitle: empRoleTitle.trim(),
        isMajorAdmin: false,
        active: true,
        permissions: empPerms,
      });
    }
    setIsEmployeeModalOpen(false);
  };

  // Filter bookings list with enhanced search by client name, date, event type, phone, location (Memoized for peak speed)
  const filteredBookings = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return bookings.filter((b) => {
      let matchesSearch = true;
      if (q) {
        const matchesClient = b.clientName.toLowerCase().includes(q);
        const matchesRef = b.referenceNumber.toLowerCase().includes(q);
        const matchesPhone = b.phone.includes(q);
        const matchesEmail = (b.email || '').toLowerCase().includes(q);
        const matchesLocation = b.location.toLowerCase().includes(q);
        const matchesEventType = (b.eventType || '').toLowerCase().replace(/_/g, ' ').includes(q) || (b.eventType || '').toLowerCase().includes(q);
        const matchesDate = (b.eventDate || '').toLowerCase().includes(q);
        
        // Match month names (e.g. "sep", "september", "oct", "2026-09", etc.)
        let matchesMonth = false;
        if (b.eventDate) {
          const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const parts = b.eventDate.split('-');
          if (parts.length >= 2) {
            const mIndex = parseInt(parts[1], 10) - 1;
            if (mIndex >= 0 && mIndex < 12) {
              matchesMonth = monthNames[mIndex].includes(q) || shortMonths[mIndex].includes(q);
            }
          }
        }

        matchesSearch = matchesClient || matchesRef || matchesPhone || matchesEmail || matchesLocation || matchesEventType || matchesDate || matchesMonth;
      }

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesCategory = 
        categoryFilter === 'all' || 
        (b.eventType && (
          b.eventType.toLowerCase() === categoryFilter.toLowerCase() ||
          b.eventType.toLowerCase().replace(/[^a-z0-9_-]/g, '_') === categoryFilter.toLowerCase()
        ));

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, searchQuery, statusFilter, categoryFilter]);

  // Multi-Select computed helpers & memoized lists
  const selectedBookingsList = React.useMemo(() => {
    return bookings.filter((b) => selectedBookingIds.has(b.id));
  }, [bookings, selectedBookingIds]);

  const selectedUnpaidBookingsList = React.useMemo(() => {
    return selectedBookingsList.filter((b) => {
      const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal || 0) - (b.amountPaid || 0);
      return balance > 0;
    });
  }, [selectedBookingsList]);

  const totalSelectedBalance = React.useMemo(() => {
    return selectedUnpaidBookingsList.reduce((sum, b) => {
      const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal || 0) - (b.amountPaid || 0);
      return sum + balance;
    }, 0);
  }, [selectedUnpaidBookingsList]);

  const isAllFilteredSelected = filteredBookings.length > 0 && selectedBookingIds.size === filteredBookings.length;
  const isIndeterminate = selectedBookingIds.size > 0 && selectedBookingIds.size < filteredBookings.length;

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      setSelectedBookingIds(new Set());
    } else {
      setSelectedBookingIds(new Set(filteredBookings.map((b) => b.id)));
    }
  };

  const handleToggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedBookingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedBookingIds(new Set());
  };

  const handleConfirmBulkDelete = () => {
    const ids = Array.from(selectedBookingIds) as string[];
    bulkDeleteBookings(ids);
    setSelectedBookingIds(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  const handleConfirmBulkSendEmail = () => {
    const ids = Array.from(selectedBookingIds) as string[];
    bulkSendPaymentReminders(ids, bulkEmailCustomMessage);
    setSelectedBookingIds(new Set());
    setIsBulkEmailModalOpen(false);
  };

  const handleBulkStatusChange = (status: BookingStatus) => {
    const ids = Array.from(selectedBookingIds) as string[];
    bulkUpdateBookingStatus(ids, status);
  };

  // ==========================================
  // VIEW: LOGIN GATEWAY
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full rounded-3xl p-8 sm:p-10 border border-white/20 bg-[#132644] text-white shadow-2xl shadow-[#081225]/80 space-y-6 relative overflow-hidden"
        >
          {/* Top Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
              Admin Portal Login
            </h1>
            <p className="text-xs text-slate-300">
              Sign in with your staff credentials
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter User ID"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#0E1D35] text-white text-sm focus:outline-hidden focus:border-white transition-colors placeholder:text-slate-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordInput ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-white/20 bg-[#0E1D35] text-white text-sm focus:outline-hidden focus:border-white transition-colors placeholder:text-slate-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                  title={showPasswordInput ? "Hide password" : "Show password"}
                >
                  {showPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Credentials & 1-Click Login */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                1-Click Quick Access
              </p>
              <button
                type="button"
                onClick={() => setShowDemoPasscodes(!showDemoPasscodes)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                title={showDemoPasscodes ? "Hide passcodes" : "Show passcodes"}
              >
                {showDemoPasscodes ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">Hide Passcodes</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Passcodes</span>
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickLoginMajor}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-400/20 hover:border-amber-400/40 border border-white/20 text-xs font-bold text-white text-center transition-all cursor-pointer"
              >
                <div className="text-amber-300 flex items-center justify-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Major Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  sbl 1000 {showDemoPasscodes ? '/ 123' : '/ ••••'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLoginSub('sbl 1001')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-emerald-400/20 hover:border-emerald-400/40 border border-white/20 text-xs font-bold text-white text-center transition-all cursor-pointer"
              >
                <div className="text-emerald-300 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Operations</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  sbl 1001 {showDemoPasscodes ? '/ 123' : '/ ••••'}
                </div>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN CONSOLE
  // ==========================================
  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
      
      {/* Top Banner & User Profile Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl border border-white/20 bg-[#132644] text-white shadow-xl shadow-[#081225]/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isMajorAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0F1F38] text-xs font-extrabold shadow-sm">
                <Crown className="w-3.5 h-3.5 text-[#0F1F38]" />
                Major Admin (Root Superuser)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white border border-white/20 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Employee Sub-Admin
              </span>
            )}

            <span className="text-xs text-slate-300 bg-[#0E1D35] px-3 py-1 rounded-full border border-white/15 font-mono">
              User ID: {currentAdminUser?.userId}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
            {currentAdminUser?.name}
          </h1>
          <p className="text-xs text-slate-300">
            Role: <strong className="text-white">{currentAdminUser?.roleTitle}</strong> • Logged in to SBL Live Production Console
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Cloud Firestore Global Synchronization Status */}
          <CloudSyncBadge compact={true} />

          {/* Local High-Speed Database Status */}
          <div className="flex items-center gap-2 bg-[#0E1D35] px-3 py-2 rounded-xl border border-white/15">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                Local Store Active
              </span>
            </div>
          </div>

          {/* Fast Sync Button */}
          <button
            type="button"
            onClick={handleRefreshData}
            disabled={isRefreshingData}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-60 ${
              justSynced
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-300/40'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
            }`}
            title="Fast refresh bookings, ledger payments, and inventory from local store"
          >
            {justSynced ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Synced!</span>
              </>
            ) : (
              <>
                <Zap className={`w-3.5 h-3.5 ${isRefreshingData ? 'animate-spin text-amber-950' : 'fill-slate-950'}`} />
                <span>{isRefreshingData ? 'Syncing...' : 'Fast Sync'}</span>
              </>
            )}
          </button>

          {/* Quick Booking Alerts Bell & Notification Center */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAlertsDropdownOpen(!isAlertsDropdownOpen)}
              className={`relative px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                adminBookingAlerts.length > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
              }`}
              title="Quick Booking Notification Alerts"
            >
              <Bell className={`w-4 h-4 ${adminBookingAlerts.length > 0 ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Alerts</span>
              {adminBookingAlerts.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] leading-none">
                  {adminBookingAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {isAlertsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-white/20 bg-[#0A1628]/98 backdrop-blur-2xl p-4 text-white shadow-2xl z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="font-extrabold text-sm text-white">Quick Booking Alerts</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                      {adminBookingAlerts.length}
                    </span>
                  </div>
                  {adminBookingAlerts.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllAdminAlerts}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Simulate Quick Booking Test Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    handleSimulateQuickBooking();
                    setIsAlertsDropdownOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simulate Incoming Quick Booking</span>
                </button>

                {adminBookingAlerts.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs space-y-1">
                    <p className="font-medium text-slate-300">No pending quick alerts</p>
                    <p className="text-[11px]">When clients submit quick bookings, live audio chimes and toast alerts will appear here.</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
                    {adminBookingAlerts.map((alert) => {
                      const b = alert.booking;
                      return (
                        <div key={alert.id} className="pt-2.5 first:pt-0 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate max-w-[170px]">{b.clientName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 flex items-center justify-between">
                            <span className="capitalize">{b.eventType.replace('_', ' ')} • {b.eventDate}</span>
                            <span className="font-mono text-amber-300 font-bold">
                              {b.estimatedTotal ? formatUGX(b.estimatedTotal) : 'Standard'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('bookings');
                                setExpandedBookingIds((prev) => new Set([...prev, b.id]));
                                setSearchQuery(b.referenceNumber);
                                dismissAdminAlert(alert.id);
                                setIsAlertsDropdownOpen(false);
                              }}
                              className="text-[11px] px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateBookingStatus(b.id, 'confirmed');
                                dismissAdminAlert(alert.id);
                              }}
                              className="text-[11px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => dismissAdminAlert(alert.id)}
                              className="text-[11px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer ml-auto"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('activity_logs')}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'activity_logs'
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
            }`}
            title="View Live Activity Logs & Audit Trail"
          >
            <History className="w-4 h-4 text-emerald-300" />
            <span className="hidden sm:inline">Activity Logs</span>
            {activityLogs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-200 font-bold">
                {activityLogs.length}
              </span>
            )}
          </button>

          {isMajorAdmin && (
            <button
              onClick={openNewEmployeeModal}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Sub-Admin</span>
            </button>
          )}

          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Live Admin Quick Booking Toast Notification Stack */}
      <AdminToastNotificationSystem
        alerts={adminBookingAlerts}
        onDismiss={dismissAdminAlert}
        onClearAll={clearAllAdminAlerts}
        onReviewBooking={(b) => {
          setActiveTab('bookings');
          setExpandedBookingIds((prev) => new Set([...prev, b.id]));
          setSearchQuery(b.referenceNumber);
          showToast('Navigated to Booking', `Inspecting #${b.referenceNumber} in Bookings table.`, 'info');
        }}
        onQuickConfirm={(bookingId) => {
          updateBookingStatus(bookingId, 'confirmed');
          showToast('Booking Confirmed', 'Booking status updated to confirmed.', 'success');
        }}
        onCallClient={(phone) => {
          window.location.href = `tel:${phone}`;
          showToast('Calling Client', `Dialing ${phone}...`, 'info');
        }}
        onApproveReview={(reviewId) => {
          approveTestimonial(reviewId);
          showToast('Review Approved', 'Review approved and published to public site.', 'success');
        }}
        onViewCallbacks={() => {
          setActiveTab('callbacks');
        }}
        onViewActivityLogs={() => {
          setActiveTab('activity_logs');
        }}
      />

      {/* KPI METRICS OVERVIEW STRIP (Inventory Stock, Live Reviews, Active Schedule, and Unfinished Balances) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Fleet Inventory Stock */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] hover:bg-[#162d50] text-white shadow-md space-y-1 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Fleet Inventory Stock</span>
            <Boxes className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-300 tracking-tight font-['Outfit'] block font-mono">
            {totalFleetUnits} Units
          </span>
          <span className="text-[11px] text-slate-300 font-medium block">
            {availableFleetUnits} Available • {deployedFleetUnits} In Field
          </span>
        </div>

        {/* KPI 2: Live Customer Reviews */}
        <div 
          onClick={() => setActiveTab('testimonials')}
          className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] hover:bg-[#162d50] text-white shadow-md space-y-1 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Satisfaction</span>
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-['Outfit'] block font-mono">
            {averageRating} ★
          </span>
          <span className="text-[11px] text-slate-300 font-medium block">
            {testimonials.length} Reviews ({pendingReviewsCount} Pending)
          </span>
        </div>

        {/* KPI 3: Confirmed Events Production */}
        <div 
          onClick={() => setActiveTab('bookings')}
          className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] hover:bg-[#162d50] text-white shadow-md space-y-1 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Events</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] block font-mono">
            {confirmedCount} Schedules
          </span>
          <span className="text-[11px] text-emerald-200 font-medium block">
            {pendingCount} Inquiries • {bookings.filter(b => b.status === 'completed').length} Completed
          </span>
        </div>

        {/* KPI 4: Unfinished Payments & Client Balances */}
        <div 
          onClick={() => setActiveTab('payments')}
          className="p-5 sm:p-6 rounded-2xl border border-amber-400/30 bg-[#132644] hover:bg-[#162d50] text-white shadow-md space-y-1 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Unfinished Payments</span>
            <CreditCard className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight font-['Outfit'] block font-mono">
            {unpaidBookingsCount} Clients
          </span>
          <span className="text-[11px] text-amber-200 font-medium block">
            Pending email reminders & ledger
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'payments', label: `Unfinished Payments (${unpaidBookingsCount})`, icon: <CreditCard className="w-4 h-4 text-amber-300" /> },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: 'categories', label: `Event Categories (${eventCategories.length})`, icon: <Layers className="w-4 h-4 text-amber-300" /> },
          { id: 'gallery', label: `Events Done (${galleryItems.length})`, icon: <Camera className="w-4 h-4 text-pink-300" /> },
          { id: 'inventory', label: `Fleet Inventory (${totalFleetUnits})`, icon: <Boxes className="w-4 h-4" /> },
          { id: 'services-media', label: `Services & Media (${services.length})`, icon: <Layers className="w-4 h-4 text-blue-300" /> },
          { 
            id: 'callbacks', 
            label: `Callbacks (${callbackRequests?.filter(c => c.status === 'pending').length || 0} new)`, 
            icon: <PhoneCall className="w-4 h-4 text-emerald-400" /> 
          },
          { id: 'employees', label: `Sub-Admins & Staff (${adminUsers.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'calendar', label: 'Availability Calendar', icon: <Clock className="w-4 h-4" /> },
          { id: 'testimonials', label: `Reviews (${pendingReviewsCount} new)`, icon: <Star className="w-4 h-4 text-amber-300" /> },
          { 
            id: 'activity_logs', 
            label: `Activity Logs (${activityLogs.length})`, 
            icon: <History className="w-4 h-4 text-emerald-400" /> 
          },
          { 
            id: 'tiktok', 
            label: 'TikTok Live Hub', 
            icon: <Sparkles className="w-4 h-4 text-cyan-300" /> 
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-white text-[#0F1F38] border-white shadow-md'
                  : 'bg-[#132644] text-slate-200 border-white/15 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB: EVENT CATEGORIES & CATALOG MANAGEMENT (Admin Hub) */}
      {/* ========================================================= */}
      {activeTab === 'categories' && (
        <AdminCategoriesSection 
          onSelectCategoryFilter={(slug) => {
            setCategoryFilter(slug);
            setActiveTab('bookings');
          }} 
        />
      )}

      {/* ========================================================= */}
      {/* TAB: EVENTS DONE & GALLERY SHOWCASE (Admin Hub) */}
      {/* ========================================================= */}
      {activeTab === 'gallery' && (
        <AdminGallerySection />
      )}

      {/* ========================================================= */}
      {/* TAB: SERVICES, PICTURES & VIDEOS MEDIA MANAGER (Admin Hub) */}
      {/* ========================================================= */}
      {activeTab === 'services-media' && (
        <AdminServicesMediaSection />
      )}

      {/* ========================================================= */}
      {/* TAB: CALLBACK REQUESTS DISPATCH (Admin Portal) */}
      {/* ========================================================= */}
      {activeTab === 'callbacks' && (
        <AdminCallbacksSection />
      )}

      {/* ========================================================= */}
      {/* TAB 1: SUB-ADMINS & EMPLOYEES MANAGEMENT (Major Admin Hub) */}
      {/* ========================================================= */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-white/15 bg-[#132644] text-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold mb-2">
                <Crown className="w-3.5 h-3.5 text-blue-300" />
                <span>Multi-User Sub-Admin Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Sub-Admin Staff & Employee Management
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Manage sub-admin staff accounts, assign departmental roles, and configure system permissions.
              </p>
            </div>

            {isMajorAdmin ? (
              <button
                onClick={openNewEmployeeModal}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Sub-Admin</span>
              </button>
            ) : (
              <div className="text-xs text-slate-300 bg-[#0E1D35] p-3 rounded-xl border border-white/10">
                Staff view mode (Contact Major Admin for permissions)
              </div>
            )}
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all shadow-md ${
                  user.isMajorAdmin
                    ? 'bg-[#183359] border-white/30 ring-1 ring-white/20'
                    : user.active
                    ? 'bg-[#132644] border-white/15'
                    : 'bg-[#0E1D35] border-red-500/30 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#0E1D35] text-blue-200 border border-white/15">
                      {user.userId}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {user.isMajorAdmin ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-[#0F1F38] uppercase">
                          Root Admin
                        </span>
                      ) : user.active ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/30">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                      {user.name}
                      {user.isMajorAdmin && <Crown className="w-4 h-4 text-blue-200" />}
                    </h3>
                    <p className="text-xs text-blue-300 font-semibold">{user.roleTitle}</p>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Permissions Pills */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Granted Permissions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.canManageBookings && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Bookings</span>
                      )}
                      {user.permissions.canManageCalendar && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Calendar</span>
                      )}
                      {user.permissions.canManageInventory && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Inventory</span>
                      )}
                      {user.permissions.canManageTestimonials && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Reviews</span>
                      )}
                      {user.permissions.canManageSubAdmins && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 text-white font-bold">Sub-Admins</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions (Major Admin Only) */}
                {isMajorAdmin && (
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditEmployeeModal(user)}
                      className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {!user.isMajorAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAdminUserStatus(user.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            user.active
                              ? 'bg-amber-500/20 text-amber-200 border-amber-400/30 hover:bg-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/30'
                          }`}
                        >
                          {user.active ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => deleteAdminUser(user.id)}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: UNFINISHED CLIENT PAYMENTS & EMAIL REMINDERS */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        isBookingsLoading ? <AdminPaymentsSkeleton /> : <AdminPaymentRemindersSection />
      )}

      {/* ========================================================= */}
      {/* TAB 2: OVERVIEW SUMMARY, FLEET & REVIEWS ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Universal Event Quick Search Bar */}
          <div className="p-6 rounded-3xl border border-white/20 bg-[#132644] text-white shadow-xl shadow-[#081225]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-['Outfit']">
                  <Search className="w-5 h-5 text-blue-300" />
                  <span>Search All Events & Client Bookings</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Filter schedule and orders instantly by client name, date (e.g. 2026-09, Sep), or event type
                </p>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Search</span>
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter events by client name, event date (e.g. 2026-09-18 or Sep), event type (wedding, corporate, concert)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0E1D35] border border-white/20 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:border-white transition-colors font-medium shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-3 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-amber-200 font-bold focus:outline-hidden"
                >
                  <option value="all">All Event Types</option>
                  {eventCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Open Full Bookings Table ({filteredBookings.length})</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>
            </div>

            {/* Quick Matching Event Chips when searching */}
            {searchQuery && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-blue-300">
                    Found {filteredBookings.length} matching event{filteredBookings.length === 1 ? '' : 's'} for "{searchQuery}"
                  </span>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-blue-300 hover:text-white font-bold"
                  >
                    View in Bookings Management →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredBookings.slice(0, 3).map((b) => (
                    <div 
                      key={b.id} 
                      onClick={() => setSelectedBookingDetails(b)}
                      className="p-3 rounded-xl bg-[#0E1D35] border border-white/10 hover:border-white/30 cursor-pointer transition-all flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-white truncate">{b.clientName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-blue-200 uppercase font-mono">{b.eventType}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{b.eventDate}</span>
                          <span>•</span>
                          <span className="truncate">{b.location}</span>
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                        b.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Redesigned Analytics: Fleet Inventory Stock & Live Reviews (Excludes Money Earned) */}
          {isBookingsLoading ? (
            <AdminAnalyticsSkeleton />
          ) : (
            <AdminDashboardAnalytics bookings={bookings} inventory={inventory} />
          )}

          {/* Direct Unfinished Client Payments Follow-up Banner */}
          <div className="p-6 rounded-3xl border border-amber-400/30 bg-[#132644] text-white shadow-xl shadow-[#081225]/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Unfinished Client Payments & Balance Reminders
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono">
                    {unpaidBookingsCount} Pending
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Track clients who have not completed their full payments and send customized payment reminder emails directly with payment ledger updates.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0F1F38] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Payment Reminders Hub →</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Quick Actions & Recent Bookings */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 font-['Outfit']">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>Recent Event Production Schedules</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-blue-300 hover:text-white"
                  >
                    View All ({bookings.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl border border-white/10 bg-[#0E1D35] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-300">
                            {booking.referenceNumber}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {booking.clientName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {booking.eventType.toUpperCase()} • {booking.eventDate} ({booking.guestCount} guests) • {booking.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                              : booking.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                              : booking.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
                              : 'bg-red-500/20 text-red-200 border-red-400/30'
                          }`}
                        >
                          <option value="pending" className="bg-[#0E1D35] text-white">Pending</option>
                          <option value="confirmed" className="bg-[#0E1D35] text-white">Confirmed</option>
                          <option value="completed" className="bg-[#0E1D35] text-white">Completed</option>
                          <option value="cancelled" className="bg-[#0E1D35] text-white">Cancelled</option>
                        </select>
                        <button
                          onClick={() => setSelectedBookingDetails(booking)}
                          className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white"
                          title="View Full Client Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Operational Fleet Status */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                  <Boxes className="w-4 h-4 text-blue-300" />
                  <span>Fleet Depot Dispatch Status</span>
                </h3>

                <div className="space-y-3">
                  {inventory.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border border-white/10 bg-[#0E1D35] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{item.name}</span>
                        <span className="text-blue-300 font-mono font-bold">
                          {item.availableQuantity} / {item.totalQuantity}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-400 h-1.5 rounded-full"
                          style={{ width: `${(item.availableQuantity / item.totalQuantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors text-center block"
                >
                  Manage All Fleet Inventory →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: BOOKINGS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Search & Export Toolbar with Expand/Collapse & Buffer info */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[240px] sm:max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client name, event date (e.g. Sep or 2026-09), event type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white font-semibold focus:outline-hidden"
              >
                <option value="all">All Statuses ({bookings.length})</option>
                <option value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</option>
                <option value="confirmed">Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</option>
                <option value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</option>
                <option value="cancelled">Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-amber-200 font-semibold focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                {eventCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
                <button
                  onClick={expandAllBookings}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Expand all orders to view full equipment specifications"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
                  <span>Expand All Orders</span>
                </button>
                <button
                  onClick={collapseAllBookings}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Collapse all rows"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>Collapse All</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Touch Cards (Swipe-to-Delete) vs Wide Table View Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#0E1D35] border border-white/20">
                <button
                  type="button"
                  onClick={() => setBookingViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    bookingViewMode === 'cards'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Touch-optimized Cards with Swipe-to-Delete"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Touch Cards</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    Swipe
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    bookingViewMode === 'table'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Standard Wide Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
              </div>

              {/* Quick Buffer Indicator Pill */}
              <div 
                onClick={() => setActiveTab('calendar')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Click to adjust unavailable buffer days in Calendar settings"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Pre-Event Buffer: {bufferDaysBefore} Days</span>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsManualBookingOpen(true)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* BULK SELECTION & ACTION BAR */}
          <AnimatePresence>
            {selectedBookingIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.18 }}
                className="p-4 rounded-3xl border-2 border-amber-400/40 bg-[#0E1D35] text-white shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md font-mono">
                    {selectedBookingIds.size}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <span>{selectedBookingIds.size} Booking{selectedBookingIds.size > 1 ? 's' : ''} Selected</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-normal">
                        of {filteredBookings.length} filtered
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedUnpaidBookingsList.length > 0 ? (
                        <span className="text-amber-300 font-semibold">
                          {selectedUnpaidBookingsList.length} client{selectedUnpaidBookingsList.length > 1 ? 's' : ''} with unpaid balances totaling{' '}
                          <strong className="font-mono text-white underline decoration-amber-400">{formatUGX(totalSelectedBalance)}</strong>
                        </span>
                      ) : (
                        <span className="text-slate-400">All selected bookings are settled or fully paid</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Bulk Email Reminders Button */}
                  <button
                    onClick={() => {
                      setBulkEmailSubject(`Payment Reminder: SBL Event Logistics Invoice & Balance Due`);
                      setBulkEmailCustomMessage(
                        `Dear Valued Client,\n\nThis is a friendly reminder from SBL Events regarding the outstanding balance for your upcoming event.\n\nPlease find your booking reference and settle the remaining deposit to ensure uninterrupted staging, sound, and mega-tent rigging.\n\nThank you for choosing SBL Events.`
                      );
                      setIsBulkEmailModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                    <span>Send Bulk Reminders ({selectedUnpaidBookingsList.length > 0 ? selectedUnpaidBookingsList.length : selectedBookingIds.size})</span>
                  </button>

                  {/* Bulk Status Update Dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusChange(e.target.value as BookingStatus);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all focus:outline-hidden cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0E1D35] text-slate-400">Set Status For All...</option>
                    <option value="confirmed" className="bg-[#0E1D35] text-emerald-300">Mark Confirmed (Place in Calendar)</option>
                    <option value="completed" className="bg-[#0E1D35] text-blue-300">Mark Completed</option>
                    <option value="pending" className="bg-[#0E1D35] text-amber-300">Mark Pending</option>
                    <option value="cancelled" className="bg-[#0E1D35] text-red-300">Mark Cancelled</option>
                  </select>

                  {/* Bulk Delete Button */}
                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-300" />
                    <span>Delete ({selectedBookingIds.size})</span>
                  </button>

                  {/* Deselect All */}
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    Deselect
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bookings View: Skeleton, Empty State, Touch Cards (with Swipe-to-Delete), or Table View */}
          {isBookingsLoading ? (
            <AdminBookingsTableSkeleton rowCount={6} />
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-white/15 bg-[#132644] text-white">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                No event bookings match your current search query or active filter criteria. Try resetting filters or creating a new booking.
              </p>
            </div>
          ) : bookingViewMode === 'cards' ? (
            <div className="space-y-4">
              {/* Calendar Overlap Warning Banner */}
              {activeOverlapConflictsCount > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:px-4 sm:py-3.5 rounded-2xl bg-red-500/15 border border-red-500/35 text-xs text-white shadow-xl animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-red-500/25 border border-red-500/40 text-red-300 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                    </span>
                    <div>
                      <span className="font-black text-red-300">Schedule Overlap Alert:</span>{' '}
                      <span className="text-slate-200">
                        {activeOverlapConflictsCount} pending booking{activeOverlapConflictsCount > 1 ? 's collide' : ' collides'} directly with existing confirmed dates in the calendar.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const firstConflicted = filteredBookings.find((b) => {
                        const c = bookingConflicts.get(b.id);
                        return c && c.hasConflict && c.severity === 'critical';
                      });
                      if (firstConflicted) {
                        const c = bookingConflicts.get(firstConflicted.id);
                        if (c) handleInspectConflict(firstConflicted, c);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect First Conflict</span>
                  </button>
                </div>
              )}

              {/* Touch Device Gesture Affordance Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500/15 via-amber-500/10 to-[#0E1D35] border border-red-500/25 text-xs text-white shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-red-500/25 border border-red-500/40 text-red-300 flex items-center justify-center shrink-0">
                    <MoveLeft className="w-4 h-4 animate-pulse" />
                  </span>
                  <div>
                    <span className="font-extrabold text-white">Swipe to Delete Enabled:</span>{' '}
                    <span className="text-slate-300">
                      On any touch device or mouse, drag a card left to quickly delete with verification. Tap full specs to inspect order equipment.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    {filteredBookings.length} {filteredBookings.length === 1 ? 'Event' : 'Events'}
                  </span>
                </div>
              </div>

              {/* Grid of Swipeable Booking Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((b) => (
                  <SwipeableBookingCard
                    key={b.id}
                    booking={b}
                    services={services}
                    isSelected={selectedBookingIds.has(b.id)}
                    onToggleSelect={(e) => handleToggleSelectOne(b.id, e)}
                    onDeleteRequest={handleDeleteRequest}
                    onViewDetails={(bk) => setSelectedBookingDetails(bk)}
                    onViewEmail={(bk) => {
                      triggerMockEmailConfirmation({
                        referenceNumber: bk.referenceNumber,
                        clientName: bk.clientName,
                        email: bk.email,
                        phone: bk.phone,
                        eventType: bk.eventType,
                        eventDate: bk.eventDate,
                        location: bk.location,
                        durationDays: bk.durationDays,
                        guestCount: bk.guestCount,
                        selectedServices: bk.selectedServices,
                        customRequests: bk.customRequests,
                        createdAt: bk.createdAt,
                      });
                    }}
                    onUpdateStatus={(id, status) => handleRequestStatusChange(id, status)}
                    conflict={bookingConflicts.get(b.id)}
                    onInspectConflict={handleInspectConflict}
                    isExpanded={expandedBookingIds.has(b.id)}
                    onToggleExpand={() => toggleExpandBooking(b.id)}
                    formatUGX={formatUGX}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-[#132644] overflow-hidden text-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1D35] border-b border-white/15 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="p-1 rounded-md text-slate-300 hover:text-white transition-colors"
                        title={isAllFilteredSelected ? "Deselect All" : "Select All Filtered"}
                      >
                        {isAllFilteredSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : isIndeterminate ? (
                          <MinusSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="p-4 w-10"></th>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Client & Contact</th>
                    <th className="p-4">Event Details</th>
                    <th className="p-4">Date & Location</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredBookings.map((b) => {
                    const isExpanded = expandedBookingIds.has(b.id);
                    const isSelected = selectedBookingIds.has(b.id);
                    const orderedServicesList = b.selectedServices.map(
                      (sId) => services.find((srv) => srv.id === sId) || { id: sId, title: sId, basePrice: 0, category: 'equipment' as ServiceCategory, shortDesc: 'Specialized event equipment hire', tagline: '', fullDesc: '', image: '', galleryImages: [], priceUnit: 'per event', features: [], specs: [], b2bAvailable: false }
                    );

                    return (
                      <React.Fragment key={b.id}>
                        <tr 
                          className={`transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-500/15 border-l-4 border-l-amber-400 hover:bg-amber-500/20' 
                              : isExpanded 
                              ? 'bg-white/5 border-l-4 border-l-blue-400' 
                              : 'hover:bg-white/5'
                          }`}
                          onClick={() => toggleExpandBooking(b.id)}
                        >
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleToggleSelectOne(b.id, e)}
                              className="p-1 rounded-md text-slate-300 hover:text-white transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandBooking(b.id);
                              }}
                              className="p-1 rounded-md hover:bg-white/20 text-slate-300 transition-colors"
                              title={isExpanded ? 'Collapse order specs' : 'Expand order specs'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-amber-300" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 font-mono font-bold text-blue-300">
                            <div className="flex items-center gap-1.5">
                              <span>{b.referenceNumber}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                              {b.createdAt}
                            </span>
                            {(() => {
                              const conflict = bookingConflicts.get(b.id);
                              if (!conflict || !conflict.hasConflict) return null;
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInspectConflict(b, conflict);
                                  }}
                                  className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                                    conflict.severity === 'critical'
                                      ? 'bg-red-500/25 border border-red-500/40 text-red-300 shadow-xs animate-pulse'
                                      : 'bg-amber-500/25 border border-amber-500/40 text-amber-300'
                                  }`}
                                  title="Click to inspect reservation date conflict"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{conflict.severity === 'critical' ? 'Overlap Alert' : 'Logistics Buffer'}</span>
                                </button>
                              );
                            })()}
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <span className="font-bold text-white block">{b.clientName}</span>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <a
                                href={`tel:${b.phone}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold transition-colors"
                                title="Call Client"
                              >
                                <Phone className="w-3 h-3 text-blue-300" />
                                <span>{b.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.clientName}, this is SBL Events regarding your booking request #${b.referenceNumber} for ${b.eventType.replace('_', ' ')} on ${b.eventDate}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-colors"
                                title="WhatsApp Client"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                            {b.email && (
                              <a href={`mailto:${b.email}`} className="text-slate-400 text-[10px] hover:text-slate-200 block truncate max-w-[170px] mt-0.5">
                                {b.email}
                              </a>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="capitalize font-semibold text-white block">{b.eventType.replace('_', ' ')}</span>
                            <span className="text-[11px] text-slate-400">{b.guestCount} guests • {b.durationDays || 1} day{(b.durationDays || 1) > 1 ? 's' : ''}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{b.eventDate}</span>
                            <span className="text-[11px] text-slate-300 truncate max-w-[150px] block">{b.location}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                            {formatUGX(b.estimatedTotal)}
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={b.status}
                              onChange={(e) => handleRequestStatusChange(b.id, e.target.value as BookingStatus)}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                                  : b.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                                  : b.status === 'completed'
                                  ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
                                  : 'bg-red-500/20 text-red-200 border-red-400/30'
                              }`}
                            >
                              <option value="pending" className="bg-[#0E1D35] text-white">Pending</option>
                              <option value="confirmed" className="bg-[#0E1D35] text-white">Confirmed</option>
                              <option value="completed" className="bg-[#0E1D35] text-white">Completed</option>
                              <option value="cancelled" className="bg-[#0E1D35] text-white">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  triggerMockEmailConfirmation({
                                    referenceNumber: b.referenceNumber,
                                    clientName: b.clientName,
                                    email: b.email,
                                    phone: b.phone,
                                    eventType: b.eventType,
                                    eventDate: b.eventDate,
                                    location: b.location,
                                    durationDays: b.durationDays,
                                    guestCount: b.guestCount,
                                    selectedServices: b.selectedServices,
                                    customRequests: b.customRequests,
                                    createdAt: b.createdAt,
                                  });
                                }}
                                className="p-1.5 rounded-lg border border-amber-400/30 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200"
                                title="View / Resend Client Email Confirmation Receipt"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedBookingDetails(b)}
                                className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white"
                                title="View Full Booking Modal"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRequest(b)}
                                className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-red-200 cursor-pointer"
                                title="Delete Booking (Verification Modal)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* EXPANDABLE ROW: EXACT CLIENT ORDER DETAILS */}
                        {isExpanded && (
                          <tr className="bg-[#0b1626] border-b-2 border-white/20">
                            <td colSpan={8} className="p-5 sm:p-6 space-y-5">
                              <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-4 border-b border-white/15">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                                      {b.referenceNumber}
                                    </span>
                                    <span className="text-xs text-slate-300 font-semibold">
                                      Order Specifications & Client Selections
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                      b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    }`}>
                                      {b.status}
                                    </span>
                                  </div>
                                  <h4 className="text-base font-extrabold text-white mt-1">
                                    {b.clientName} &bull; <span className="capitalize">{b.eventType.replace('_', ' ')}</span> on {b.eventDate} ({b.durationDays || 1} Day{(b.durationDays || 1) > 1 ? 's' : ''})
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {b.status !== 'confirmed' && (
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Confirm & Lock to Calendar</span>
                                    </button>
                                  )}
                                  <a
                                    href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `*SBL EVENTS INVOICE & ORDER SUMMARY*\n` +
                                      `Reference: ${b.referenceNumber}\n` +
                                      `Client: ${b.clientName}\n` +
                                      `Event: ${b.eventType.toUpperCase()} on ${b.eventDate} (${b.durationDays || 1} day)\n` +
                                      `Location: ${b.location} (${b.guestCount} Guests)\n` +
                                      `Ordered Equipment:\n` +
                                      orderedServicesList.map(s => ` - ${s.title}`).join('\n') +
                                      (b.addons && b.addons.length > 0 ? `\nAdd-ons:\n` + b.addons.map(a => ` - ${a.name} (Qty: ${a.quantity})`).join('\n') : '') +
                                      `\n*Estimated Total: ${formatUGX(b.estimatedTotal)}*\n` +
                                      `Dispatch Office: Lwengo, Uganda (Hotline: +256 752 420 911)`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Send WhatsApp Quote</span>
                                  </a>
                                  <button
                                    onClick={() => setSelectedBookingDetails(b)}
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-300" />
                                    <span>Full Specs Modal</span>
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Ordered Services & Equipment List */}
                                <div className="lg:col-span-2 space-y-3">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-blue-300" />
                                    <span>Ordered Services & Equipment Packages ({orderedServicesList.length})</span>
                                  </span>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {orderedServicesList.map((srv, idx) => (
                                      <div key={idx} className="p-3.5 rounded-2xl bg-[#132644] border border-white/15 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
                                            {srv.category}
                                          </span>
                                          <span className="font-mono font-bold text-amber-300 text-xs">
                                            From {formatUGX(srv.basePrice)}
                                          </span>
                                        </div>
                                        <h5 className="font-bold text-white text-xs">{srv.title}</h5>
                                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                                          {srv.shortDesc}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Itemized Add-ons */}
                                  {b.addons && b.addons.length > 0 && (
                                    <div className="pt-2">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                        Itemized Extra Add-Ons ({b.addons.length})
                                      </span>
                                      <div className="rounded-xl border border-white/10 bg-[#132644] overflow-hidden">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-[#0E1D35] text-slate-400 text-[10px] uppercase">
                                            <tr>
                                              <th className="p-2.5">Item</th>
                                              <th className="p-2.5 text-center">Qty</th>
                                              <th className="p-2.5 text-right">Unit Price</th>
                                              <th className="p-2.5 text-right">Subtotal</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-white/10">
                                            {b.addons.map((add, idx) => (
                                              <tr key={idx}>
                                                <td className="p-2.5 font-semibold text-white">{add.name}</td>
                                                <td className="p-2.5 text-center font-mono">{add.quantity}</td>
                                                <td className="p-2.5 text-right font-mono text-slate-300">{formatUGX(add.price)}</td>
                                                <td className="p-2.5 text-right font-mono font-bold text-amber-300">{formatUGX(add.price * add.quantity)}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Event & Logistics Configuration Details */}
                                <div className="p-4 rounded-2xl bg-[#132644] border border-white/15 space-y-3">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Logistics & Venue Setup</span>
                                  </span>

                                  <div className="space-y-2 text-xs divide-y divide-white/10">
                                    <div className="flex justify-between items-center pt-1">
                                      <span className="text-slate-400">Venue Surface:</span>
                                      <span className="font-semibold text-white capitalize">{b.venueType?.replace('_', ' ') || 'Outdoor grass'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Guest Capacity:</span>
                                      <span className="font-semibold text-white">{b.guestCount} attendees</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Tent Requirements:</span>
                                      <span className="font-semibold text-white">{b.tentSizeNeeded || 'Standard Marquee'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Lighting Profile:</span>
                                      <span className="font-semibold text-white">{b.lightingStyle || 'Warm Wash & Uplighting'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Power Source:</span>
                                      <span className="font-semibold text-white capitalize">{b.powerRequirement?.replace('_', ' ') || 'Generator Needed'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Duration:</span>
                                      <span className="font-semibold text-white">{b.durationDays || 1} Full Day{(b.durationDays || 1) > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="text-slate-400">Pre-Event Buffer:</span>
                                      <span className="font-bold text-amber-300">{bufferDaysBefore} Days Reserved</span>
                                    </div>
                                  </div>

                                  {b.customRequests && (
                                    <div className="pt-2 border-t border-white/10">
                                      <span className="text-[10px] text-slate-400 block mb-1">Client Special Instructions:</span>
                                      <p className="text-xs text-slate-200 bg-[#0E1D35] p-2.5 rounded-xl border border-white/10 leading-relaxed italic">
                                        "{b.customRequests}"
                                      </p>
                                    </div>
                                  )}

                                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">Total Order Value:</span>
                                    <span className="font-mono font-extrabold text-amber-300 text-sm">
                                      {formatUGX(b.estimatedTotal)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CALENDAR AVAILABILITY & MONTHLY SCHEDULE OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === 'calendar' && (
        <AdminMonthlyCalendar
          onOpenBookingDetails={(b) => setSelectedBookingDetails(b)}
          onOpenManualBooking={() => setIsManualBookingOpen(true)}
          onOpenAddEventSlot={() => setIsAddCalEventOpen(true)}
        />
      )}

      {/* ========================================================= */}
      {/* TAB 5: INVENTORY FLEET CONTROL */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white">
            <h2 className="text-xl font-extrabold text-white">Equipment Fleet & B2B Sub-Rental Inventory</h2>
            <p className="text-xs text-slate-300 mt-1">Adjust available quantities and day rates for wholesale equipment leasing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Asset
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                </div>
                
                {editingInvId === item.id ? (
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold">Available / Total</label>
                      <div className="flex items-center gap-2 mt-0.5">
                        <input
                          type="number"
                          value={invAvailable}
                          onChange={(e) => setInvAvailable(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                        />
                        <span className="text-slate-400">/</span>
                        <input
                          type="number"
                          value={invTotal}
                          onChange={(e) => setInvTotal(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold">Day Rate (UGX)</label>
                      <input
                        type="number"
                        value={invRate}
                        onChange={(e) => setInvRate(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold mt-0.5"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSaveInventory(item)}
                        className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingInvId(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">In Stock:</span>
                      <span className="font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.availableQuantity} of {item.totalQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Daily Rate:</span>
                      <span className="font-black text-blue-600 font-mono text-sm">
                        {formatUGX(item.dailyRate)}
                      </span>
                    </div>
                    <button
                      onClick={() => startEditInventory(item)}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Edit Stock & Pricing</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: TESTIMONIALS VERIFICATION */}
      {/* ========================================================= */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white">
            <h2 className="text-xl font-extrabold text-white">Client Reviews Moderation</h2>
            <p className="text-xs text-slate-300 mt-1">Approve client feedback before it displays on the public website.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div key={test.id} className="p-6 rounded-2xl border border-white/15 bg-[#132644] text-white space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-300">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      test.approved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {test.approved ? 'Published' : 'Needs Approval'}
                    </span>
                  </div>

                  <p className="text-xs italic text-slate-200 leading-relaxed">"{test.content}"</p>
                  <div className="pt-2">
                    <strong className="text-white text-xs block">{test.author}</strong>
                    <span className="text-blue-300 text-[11px]">{test.companyOrEvent}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {!test.approved && (
                    <button
                      onClick={() => approveTestimonial(test.id)}
                      className="flex-1 py-1.5 rounded-lg bg-white text-[#0F1F38] font-bold text-xs hover:bg-slate-100"
                    >
                      Approve & Publish
                    </button>
                  )}
                  <button
                    onClick={() => deleteTestimonial(test.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: ACTIVITY LOGS & AUDIT TRAIL */}
      {/* ========================================================= */}
      {activeTab === 'activity_logs' && (
        <AdminActivityLogsSection 
          onNavigateToBooking={(refNum) => {
            setSearchQuery(refNum);
            setActiveTab('bookings');
            showToast('Navigated to Booking', `Filtered table for booking #${refNum}.`, 'info');
          }}
          onNavigateToSettings={() => {
            setActiveTab('overview');
            showToast('Settings & Controls', 'Navigated to Dashboard Operations settings.', 'info');
          }}
        />
      )}

      {/* ========================================================= */}
      {/* TAB: TIKTOK LIVE HUB & SHOWCASE REELS */}
      {/* ========================================================= */}
      {activeTab === 'tiktok' && (
        <AdminTikTokSection />
      )}

      {/* ========================================================= */}
      {/* MODAL: SUB-ADMIN EMPLOYEE REGISTRATION / EDIT (Major Admin Only) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEmployeeModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-6 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border border-white/15"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-300" />
                    <h3 className="text-lg font-bold text-white">
                      {editingEmployee ? 'Edit Sub-Admin Employee' : 'Create New Sub-Admin Staff'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      User ID (Login Username)
                    </label>
                    <input
                      type="text"
                      value={empUserId}
                      onChange={(e) => setEmpUserId(e.target.value)}
                      placeholder="e.g. sbl 1005"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      placeholder="e.g. 123"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Employee Full Name
                  </label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="e.g. Valerie Sserwadda"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      placeholder="employee@sblevents.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Phone Contact
                    </label>
                    <input
                      type="tel"
                      value={empPhone}
                      onChange={(e) => setEmpPhone(e.target.value)}
                      placeholder="+256 700 000 000"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Departmental Role
                    </label>
                    <select
                      value={empRole}
                      onChange={(e) => {
                        const r = e.target.value as AdminRole;
                        setEmpRole(r);
                        if (r === 'operations_manager') setEmpRoleTitle('Operations & Dispatch Lead');
                        if (r === 'tent_rigging_lead') setEmpRoleTitle('Mega Tent & Rigging Supervisor');
                        if (r === 'av_sound_engineer') setEmpRoleTitle('Lead Sound & Audio Engineer');
                        if (r === 'lighting_visuals_lead') setEmpRoleTitle('Intelligent Lighting & LED Lead');
                        if (r === 'booking_coordinator') setEmpRoleTitle('Senior Booking Coordinator');
                        if (r === 'finance_invoicing') setEmpRoleTitle('Finance & Billing Officer');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs"
                    >
                      <option value="operations_manager">Operations Manager</option>
                      <option value="tent_rigging_lead">Tent & Stage Lead</option>
                      <option value="av_sound_engineer">Sound & Audio Engineer</option>
                      <option value="lighting_visuals_lead">Lighting & LED Tech</option>
                      <option value="booking_coordinator">Booking Coordinator</option>
                      <option value="finance_invoicing">Finance & Invoicing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Custom Role Title
                    </label>
                    <input
                      type="text"
                      value={empRoleTitle}
                      onChange={(e) => setEmpRoleTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Custom Permissions Toggles */}
                <div className="space-y-2 pt-2 border-t border-white/15">
                  <span className="text-xs font-bold text-white block">
                    Assigned Administrative Permissions:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0E1D35] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={empPerms.canManageBookings}
                        onChange={(e) => setEmpPerms({ ...empPerms, canManageBookings: e.target.checked })}
                        className="accent-blue-500 rounded"
                      />
                      <span>Manage Bookings</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0E1D35] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={empPerms.canManageCalendar}
                        onChange={(e) => setEmpPerms({ ...empPerms, canManageCalendar: e.target.checked })}
                        className="accent-blue-500 rounded"
                      />
                      <span>Manage Calendar</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0E1D35] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={empPerms.canManageInventory}
                        onChange={(e) => setEmpPerms({ ...empPerms, canManageInventory: e.target.checked })}
                        className="accent-blue-500 rounded"
                      />
                      <span>Manage Inventory</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0E1D35] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={empPerms.canManageTestimonials}
                        onChange={(e) => setEmpPerms({ ...empPerms, canManageTestimonials: e.target.checked })}
                        className="accent-blue-500 rounded"
                      />
                      <span>Approve Reviews</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold hover:bg-white/20 flex items-center gap-1.5 cursor-pointer border border-white/15"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back / Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    {editingEmployee ? 'Save Changes' : 'Register Sub-Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: MANUAL BOOKING CREATION */}
      <AnimatePresence>
        {isManualBookingOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsManualBookingOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsManualBookingOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <h3 className="text-base font-bold text-white">Manual Event Entry</h3>
                </div>
                <button onClick={() => setIsManualBookingOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualBookingSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Client Full Name</label>
                  <input
                    type="text"
                    value={manualClient}
                    onChange={(e) => setManualClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Event Category</label>
                    <select
                      value={manualType}
                      onChange={(e) => setManualType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                    >
                      {eventCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Total (UGX)</label>
                    <input
                      type="number"
                      value={manualTotal}
                      onChange={(e) => setManualTotal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsManualBookingOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold shadow-md cursor-pointer"
                  >
                    Create Booking Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD CALENDAR EVENT */}
      <AnimatePresence>
        {isAddCalEventOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsAddCalEventOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddCalEventOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <h3 className="text-base font-bold text-white">Add Schedule Slot</h3>
                </div>
                <button onClick={() => setIsAddCalEventOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCalEventSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={calTitle}
                    onChange={(e) => setCalTitle(e.target.value)}
                    placeholder="e.g. VIP Gala: State Banquet"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={calStartDate}
                      onChange={(e) => setCalStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={calEndDate}
                      onChange={(e) => setCalEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={calLocation}
                    onChange={(e) => setCalLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCalEventOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold shadow-md cursor-pointer"
                  >
                    Save to Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW BOOKING DETAILS */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedBookingDetails(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingDetails(null)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {selectedBookingDetails.referenceNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        selectedBookingDetails.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {selectedBookingDetails.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {selectedBookingDetails.clientName}
                    </h3>
                  </div>
                </div>
                <button onClick={() => setSelectedBookingDetails(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0E1D35] border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Client Phone / Direct Contact:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-white">{selectedBookingDetails.phone}</span>
                      <a
                        href={`tel:${selectedBookingDetails.phone}`}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-blue-300 flex items-center gap-1 font-semibold"
                        title="Call"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedBookingDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedBookingDetails.clientName}, this is SBL Events regarding booking #${selectedBookingDetails.referenceNumber}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 font-bold border border-emerald-500/30"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address:</span>
                    <span className="font-semibold text-white truncate block mt-1">{selectedBookingDetails.email || 'None Provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Event Date & Duration:</span>
                    <span className="font-semibold text-white mt-1 block">
                      {selectedBookingDetails.eventDate} ({selectedBookingDetails.durationDays || 1} Full Day{(selectedBookingDetails.durationDays || 1) > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location & Expected Guests:</span>
                    <span className="font-semibold text-white mt-1 block">
                      {selectedBookingDetails.location} • {selectedBookingDetails.guestCount} attendees
                    </span>
                  </div>
                </div>

                {/* Ordered Services & Specifications */}
                <div>
                  <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] block mb-2">
                    Ordered Services & Equipment Packages ({selectedBookingDetails.selectedServices.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedBookingDetails.selectedServices.map((sId) => {
                      const s = services.find((srv) => srv.id === sId);
                      return (
                        <div key={sId} className="p-3 rounded-xl bg-[#0E1D35] border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                              {s?.category || 'Equipment'}
                            </span>
                            <span className="font-mono font-bold text-amber-300 text-xs">
                              {s ? `From ${formatUGX(s.basePrice)}` : ''}
                            </span>
                          </div>
                          <h6 className="font-bold text-white text-xs">{s ? s.title : sId}</h6>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{s?.shortDesc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add-ons Breakdown if any */}
                {selectedBookingDetails.addons && selectedBookingDetails.addons.length > 0 && (
                  <div>
                    <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] block mb-1.5">
                      Selected Add-Ons & Extras
                    </span>
                    <div className="rounded-xl border border-white/10 bg-[#0E1D35] overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-black/20 text-slate-400 text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5">Item</th>
                            <th className="p-2.5 text-center">Quantity</th>
                            <th className="p-2.5 text-right">Unit Price</th>
                            <th className="p-2.5 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {selectedBookingDetails.addons.map((add, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-semibold text-white">{add.name}</td>
                              <td className="p-2.5 text-center font-mono">{add.quantity}</td>
                              <td className="p-2.5 text-right font-mono text-slate-300">{formatUGX(add.price)}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-amber-300">{formatUGX(add.price * add.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Venue & Logistics */}
                <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Surface:</span>
                    <span className="font-semibold text-white capitalize">{selectedBookingDetails.venueType?.replace('_', ' ') || 'Outdoor grass'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tent Style:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.tentSizeNeeded || 'Standard Marquee'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lighting:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.lightingStyle || 'Warm Wash'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Power Generator:</span>
                    <span className="font-semibold text-white capitalize">{selectedBookingDetails.powerRequirement?.replace('_', ' ') || 'Included'}</span>
                  </div>
                </div>

                {selectedBookingDetails.customRequests && (
                  <div>
                    <span className="text-slate-400 block mb-1 text-[11px] font-bold">Custom Client Special Requests:</span>
                    <p className="p-3 rounded-xl bg-[#0E1D35] text-slate-200 border border-white/10 leading-relaxed italic">
                      "{selectedBookingDetails.customRequests}"
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Calendar Logistics Status:</span>
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs mt-0.5 ${
                      selectedBookingDetails.status === 'confirmed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      <span>{selectedBookingDetails.status === 'confirmed' ? 'Placed in Public Calendar (Pre-Event Buffer Active)' : 'Pending Confirmation'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <button
                      onClick={() => {
                        triggerMockEmailConfirmation({
                          referenceNumber: selectedBookingDetails.referenceNumber,
                          clientName: selectedBookingDetails.clientName,
                          email: selectedBookingDetails.email,
                          phone: selectedBookingDetails.phone,
                          eventType: selectedBookingDetails.eventType,
                          eventDate: selectedBookingDetails.eventDate,
                          location: selectedBookingDetails.location,
                          durationDays: selectedBookingDetails.durationDays,
                          guestCount: selectedBookingDetails.guestCount,
                          selectedServices: selectedBookingDetails.selectedServices,
                          customRequests: selectedBookingDetails.customRequests,
                          createdAt: selectedBookingDetails.createdAt,
                        });
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#0E1D35] hover:bg-[#152a4a] text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Receipt</span>
                    </button>

                    {selectedBookingDetails.status !== 'confirmed' && (
                      <button
                        onClick={() => {
                          updateBookingStatus(selectedBookingDetails.id, 'confirmed');
                          setSelectedBookingDetails({ ...selectedBookingDetails, status: 'confirmed' });
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm & Place in Calendar</span>
                      </button>
                    )}
                    <div className="text-right ml-auto sm:ml-2">
                      <span className="text-[10px] text-slate-400 block">Estimated Total</span>
                      <span className="text-lg font-extrabold text-amber-300 font-mono">
                        {formatUGX(selectedBookingDetails.estimatedTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* BULK DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl border border-red-500/40 bg-[#132644] text-white shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Confirm Bulk Deletion</h3>
                  <p className="text-xs text-slate-300">This action will permanently delete multiple event orders.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-2">
                <p className="text-xs text-slate-200">
                  You are about to delete <strong className="text-amber-300 font-mono text-sm">{selectedBookingIds.size}</strong> selected booking record{selectedBookingIds.size > 1 ? 's' : ''}:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 divide-y divide-white/5 text-[11px]">
                  {selectedBookingsList.map((b) => (
                    <div key={b.id} className="pt-1.5 flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white truncate max-w-[200px]">{b.clientName}</span>
                      <span className="font-mono text-blue-300">{b.referenceNumber}</span>
                      <span className="text-slate-400">{b.eventDate}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-red-300/90 pt-2 border-t border-white/10">
                  ⚠️ Any associated public calendar reservations will also be removed immediately.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Permanently Delete ({selectedBookingIds.size})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* BULK EMAIL PAYMENT REMINDERS MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isBulkEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl rounded-3xl border border-amber-400/40 bg-[#132644] text-white shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-3 text-amber-300">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Bulk Payment Reminder Dispatch</h3>
                    <p className="text-xs text-slate-300">
                      Send personalized payment reminders to clients with outstanding balances.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBulkEmailModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Target Recipients List */}
              <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    Recipients ({selectedBookingsList.length})
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    Total Balance: {formatUGX(totalSelectedBalance)}
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/5 text-[11px]">
                  {selectedBookingsList.map((b) => {
                    const balance = b.balanceDue !== undefined ? b.balanceDue : (b.estimatedTotal || 0) - (b.amountPaid || 0);
                    return (
                      <div key={b.id} className="pt-1.5 flex items-center justify-between text-slate-300">
                        <div>
                          <span className="font-bold text-white block">{b.clientName}</span>
                          <span className="text-[10px] text-slate-400">{b.email || 'No email (SMS/Call default)'} • {b.phone}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold block ${balance > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                            {balance > 0 ? `Due: ${formatUGX(balance)}` : 'Fully Paid'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">#{b.referenceNumber}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">Email Subject</label>
                <input
                  type="text"
                  value={bulkEmailSubject}
                  onChange={(e) => setBulkEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Email Body / Custom Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  Reminder Message (Included with invoice breakdown)
                </label>
                <textarea
                  rows={4}
                  value={bulkEmailCustomMessage}
                  onChange={(e) => setBulkEmailCustomMessage(e.target.value)}
                  placeholder="Enter custom reminder note for clients..."
                  className="w-full p-3 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white focus:outline-hidden focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dispatches through SBL verified notification gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkEmailModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBulkSendEmail}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Send Reminders to All</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swipe-to-Delete Confirmation Modal for Touch & Single Item Management */}
      <DeleteBookingModal
        isOpen={isSingleDeleteModalOpen}
        booking={deleteModalBooking}
        onClose={() => {
          setIsSingleDeleteModalOpen(false);
          setDeleteModalBooking(null);
        }}
        onConfirm={handleConfirmDeleteBooking}
        formatUGX={formatUGX}
      />

      {/* Calendar Overlap & Logistics Conflict Inspection Modal */}
      <BookingConflictAlertModal
        isOpen={isConflictModalOpen}
        booking={selectedConflictBooking}
        conflict={selectedConflictDetails}
        onClose={() => {
          setIsConflictModalOpen(false);
          setSelectedConflictBooking(null);
          setSelectedConflictDetails(null);
        }}
        onNavigateToCalendar={() => {
          setIsConflictModalOpen(false);
          setActiveTab('calendar');
        }}
      />

      {/* Intercept Modal: Confirming an Overlapping Booking */}
      <ConfirmOverlapBookingModal
        isOpen={isConfirmOverlapModalOpen}
        booking={pendingConfirmOverlapBooking}
        conflict={pendingConfirmOverlapDetails}
        onClose={() => {
          setIsConfirmOverlapModalOpen(false);
          setPendingConfirmOverlapBooking(null);
          setPendingConfirmOverlapDetails(null);
        }}
        onProceedAnyway={handleForceConfirmOverlap}
      />

    </div>
  );
};
