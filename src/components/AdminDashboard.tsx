import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus, EventType, Booking, InventoryItem, AdminUser, AdminRole } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminDashboardAnalytics } from './AdminDashboardAnalytics';

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
    addBooking,
    calendarEvents, 
    addCalendarEvent, 
    deleteCalendarEvent,
    inventory, 
    updateInventoryQuantity,
    testimonials, 
    approveTestimonial, 
    deleteTestimonial,
    services,
    showToast,
    theme
  } = useApp();

  const t = getThemeClasses(theme);

  // Authentication State
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'calendar' | 'inventory' | 'testimonials' | 'employees'>('overview');

  // Bookings Tab Filter/Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Manual Booking Form State
  const [manualClient, setManualClient] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualType, setManualType] = useState<EventType>('wedding');
  const [manualServiceIds] = useState<string[]>(['mega-tents']);
  const [manualTotal, setManualTotal] = useState(2500);

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

  // Metrics Calculations
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.estimatedTotal : sum), 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingReviewsCount = testimonials.filter((t) => !t.approved).length;

  const isMajorAdmin = currentAdminUser?.isMajorAdmin ?? false;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(userIdInput, passwordInput);
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
    const headers = ['Reference', 'Client', 'Phone', 'Email', 'Event Type', 'Date', 'Guest Count', 'Estimated Total', 'Status'];
    const rows = bookings.map((b) => [
      b.referenceNumber,
      `"${b.clientName}"`,
      b.phone,
      b.email,
      b.eventType,
      b.eventDate,
      b.guestCount,
      `$${b.estimatedTotal}`,
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

  // Filter bookings list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#0E1D35] text-white text-sm focus:outline-hidden focus:border-white transition-colors placeholder:text-slate-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-sm shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Unlock className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

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
          {isMajorAdmin && (
            <button
              onClick={openNewEmployeeModal}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Sub-Admin</span>
            </button>
          )}

          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] text-white shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold">Active Bookings Value</span>
            <DollarSign className="w-4 h-4 text-blue-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] block">
            ${totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-300 font-medium">
            Across {bookings.length} registered event orders
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] text-white shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] block">
            {pendingCount}
          </span>
          <span className="text-[11px] text-amber-200 font-medium">
            Requires follow-up & quoting
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] text-white shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold">Confirmed Events</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] block">
            {confirmedCount}
          </span>
          <span className="text-[11px] text-emerald-200 font-medium">
            Active in production dispatch
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#132644] text-white shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold">Team & Sub-Admins</span>
            <Users className="w-4 h-4 text-blue-200" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit'] block">
            {adminUsers.length} Staff
          </span>
          <span className="text-[11px] text-slate-300 font-medium">
            {adminUsers.filter(u => u.active).length} Active accounts
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
          { id: 'employees', label: `Sub-Admins & Staff (${adminUsers.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'calendar', label: 'Availability Calendar', icon: <Clock className="w-4 h-4" /> },
          { id: 'inventory', label: 'Fleet Inventory', icon: <Boxes className="w-4 h-4" /> },
          { id: 'testimonials', label: `Reviews (${pendingReviewsCount} new)`, icon: <Star className="w-4 h-4" /> },
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
      {/* TAB 2: OVERVIEW SUMMARY & RECHARTS ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recharts Monthly Bookings, Revenue & Fleet Utilization Summary */}
          <AdminDashboardAnalytics bookings={bookings} inventory={inventory} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Quick Actions & Recent Bookings */}
            <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-300" />
                  <span>Recent Event Booking Inquiries</span>
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

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white font-mono">
                        ${booking.estimatedTotal}
                      </span>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Operational Status */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-300" />
                <span>Fleet Dispatch Ready Status</span>
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
                        className="bg-white h-1.5 rounded-full"
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
          {/* Search & Export Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client, ref#, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white font-semibold focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsManualBookingOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-3xl border border-white/15 bg-[#132644] overflow-hidden text-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1D35] border-b border-white/15 text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
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
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-300">
                        {b.referenceNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{b.clientName}</span>
                        <span className="text-slate-300 text-[11px] block">{b.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-white block">{b.eventType.replace('_', ' ')}</span>
                        <span className="text-[11px] text-slate-400">{b.guestCount} guests</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white block">{b.eventDate}</span>
                        <span className="text-[11px] text-slate-300 truncate max-w-[150px] block">{b.location}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ${b.estimatedTotal}
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
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
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBookingDetails(b)}
                            className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white"
                            title="View Full Booking Specs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CALENDAR AVAILABILITY & BLACKOUTS */}
      {/* ========================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-3xl border border-white/15 bg-[#132644] text-white">
            <div>
              <h2 className="text-xl font-extrabold text-white">Production Schedule Management</h2>
              <p className="text-xs text-slate-300 mt-1">Schedule date holds, public showcases, and maintenance blackouts.</p>
            </div>
            <button
              onClick={() => setIsAddCalEventOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarEvents.map((evt) => (
              <div key={evt.id} className="p-5 rounded-2xl border border-white/15 bg-[#132644] text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-300">{evt.startDate}</span>
                  <button
                    onClick={() => deleteCalendarEvent(evt.id)}
                    className="text-red-300 hover:text-red-100"
                    title="Remove from Calendar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                <p className="text-xs text-slate-300">{evt.location}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="capitalize text-slate-400">{evt.status}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">{evt.eventType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              <div key={item.id} className="p-5 rounded-2xl border border-white/15 bg-[#132644] text-white space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">{item.category}</span>
                <h4 className="font-bold text-sm text-white">{item.name}</h4>
                
                {editingInvId === item.id ? (
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-300">Available / Total</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={invAvailable}
                          onChange={(e) => setInvAvailable(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded bg-[#0E1D35] border border-white/20 text-white font-mono"
                        />
                        <span>/</span>
                        <input
                          type="number"
                          value={invTotal}
                          onChange={(e) => setInvTotal(Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded bg-[#0E1D35] border border-white/20 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-300">Day Rate ($)</label>
                      <input
                        type="number"
                        value={invRate}
                        onChange={(e) => setInvRate(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded bg-[#0E1D35] border border-white/20 text-white font-mono"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSaveInventory(item)}
                        className="flex-1 py-1 rounded bg-white text-[#0F1F38] font-bold text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingInvId(null)}
                        className="px-2 py-1 rounded bg-white/10 text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-300">In Stock:</span>
                      <span className="font-bold text-white font-mono">{item.availableQuantity} of {item.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Rate:</span>
                      <span className="font-bold text-blue-200 font-mono">${item.dailyRate} / {item.unit}</span>
                    </div>
                    <button
                      onClick={() => startEditInventory(item)}
                      className="w-full py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                    >
                      Edit Stock & Pricing
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
      {/* MODAL: SUB-ADMIN EMPLOYEE REGISTRATION / EDIT (Major Admin Only) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-300" />
                  <h3 className="text-lg font-bold text-white">
                    {editingEmployee ? 'Edit Sub-Admin Employee' : 'Create New Sub-Admin Staff'}
                  </h3>
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
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs shadow-md"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <h3 className="text-base font-bold text-white">Manual Event Entry</h3>
                <button onClick={() => setIsManualBookingOpen(false)} className="text-slate-400 hover:text-white">
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
                    <label className="block text-slate-300 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Total ($)</label>
                    <input
                      type="number"
                      value={manualTotal}
                      onChange={(e) => setManualTotal(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold shadow-md"
                >
                  Create Booking Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD CALENDAR EVENT */}
      <AnimatePresence>
        {isAddCalEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <h3 className="text-base font-bold text-white">Add Schedule Slot</h3>
                <button onClick={() => setIsAddCalEventOpen(false)} className="text-slate-400 hover:text-white">
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
                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold shadow-md"
                >
                  Save to Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW BOOKING DETAILS */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-white/20 bg-[#132644] text-white shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-300">
                    {selectedBookingDetails.referenceNumber}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedBookingDetails.clientName}
                  </h3>
                </div>
                <button onClick={() => setSelectedBookingDetails(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0E1D35] border border-white/10">
                  <div>
                    <span className="text-slate-400 block">Phone:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Event Date:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Guest Count:</span>
                    <span className="font-semibold text-white">{selectedBookingDetails.guestCount} Attendees</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Selected Equipment & Production:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBookingDetails.selectedServices.map((sId) => {
                      const s = services.find((srv) => srv.id === sId);
                      return (
                        <span key={sId} className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-semibold">
                          {s ? s.title : sId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {selectedBookingDetails.customRequests && (
                  <div>
                    <span className="text-slate-400 block mb-1">Custom Client Requests:</span>
                    <p className="p-3 rounded-xl bg-[#0E1D35] text-slate-200 border border-white/10 leading-relaxed">
                      {selectedBookingDetails.customRequests}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-slate-300">Estimated Total:</span>
                  <span className="text-xl font-extrabold text-white font-mono">
                    ${selectedBookingDetails.estimatedTotal}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
