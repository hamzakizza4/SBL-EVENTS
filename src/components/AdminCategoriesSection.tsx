import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Heart, 
  Building2, 
  Music, 
  Church, 
  PartyPopper, 
  Sparkles, 
  Trophy, 
  Truck, 
  Briefcase, 
  Flag, 
  Star, 
  Radio, 
  Users, 
  Tent,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Package,
  Wrench,
  DollarSign,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCategoryItem, Service } from '../types';

interface AdminCategoriesSectionProps {
  onSelectCategoryFilter?: (slug: string) => void;
  onBack?: () => void;
}

const AVAILABLE_ICONS: { name: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'Heart', label: 'Weddings & Romance', icon: Heart },
  { name: 'Building2', label: 'Corporate & Business', icon: Building2 },
  { name: 'Music', label: 'Concerts & Festivals', icon: Music },
  { name: 'Church', label: 'Religious & Crusades', icon: Church },
  { name: 'PartyPopper', label: 'Parties & Banquets', icon: PartyPopper },
  { name: 'Tent', label: 'Tents & Outdoor', icon: Tent },
  { name: 'Sparkles', label: 'VIP & Luxury', icon: Sparkles },
  { name: 'Trophy', label: 'Sports & Tournaments', icon: Trophy },
  { name: 'Truck', label: 'B2B & Dry Hire', icon: Truck },
  { name: 'Briefcase', label: 'Conferences & AGMs', icon: Briefcase },
  { name: 'Users', label: 'Community & Rallies', icon: Users },
  { name: 'Star', label: 'Featured Events', icon: Star },
  { name: 'Radio', label: 'Broadcast & Media', icon: Radio },
  { name: 'Flag', label: 'State & Diplomatic', icon: Flag },
];

const COLOR_THEMES: { id: EventCategoryItem['color']; label: string; bg: string; text: string; border: string; badgeBg: string }[] = [
  { id: 'rose', label: 'Rose / Pink', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-400/30', badgeBg: 'bg-rose-500/20' },
  { id: 'blue', label: 'Royal Blue', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-400/30', badgeBg: 'bg-blue-500/20' },
  { id: 'amber', label: 'Amber / Gold', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-400/30', badgeBg: 'bg-amber-500/20' },
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-400/30', badgeBg: 'bg-emerald-500/20' },
  { id: 'purple', label: 'Royal Purple', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-400/30', badgeBg: 'bg-purple-500/20' },
  { id: 'indigo', label: 'Deep Indigo', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-400/30', badgeBg: 'bg-indigo-500/20' },
  { id: 'cyan', label: 'Electric Cyan', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-400/30', badgeBg: 'bg-cyan-500/20' },
  { id: 'slate', label: 'Executive Slate', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-400/30', badgeBg: 'bg-slate-500/20' },
];

export const AdminCategoriesSection: React.FC<AdminCategoriesSectionProps> = ({ onSelectCategoryFilter, onBack }) => {
  const { 
    eventCategories, 
    addEventCategory, 
    updateEventCategory, 
    deleteEventCategory, 
    toggleEventCategoryStatus,
    resetEventCategoriesToDefault,
    bookings,
    services,
    setCurrentPage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Close modals on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (deleteConfirmId) setDeleteConfirmId(null);
        if (resetConfirmOpen) setResetConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, deleteConfirmId, resetConfirmOpen]);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    iconName: string;
    badge: string;
    color: EventCategoryItem['color'];
    targetScale: string;
    defaultPackageEstimate: number | string;
    recommendedServices: string[];
    rentalChecklist: string[];
    checklistInput: string;
    active: boolean;
  }>({
    name: '',
    slug: '',
    description: '',
    iconName: 'Heart',
    badge: '',
    color: 'rose',
    targetScale: '',
    defaultPackageEstimate: '',
    recommendedServices: [],
    rentalChecklist: [],
    checklistInput: '',
    active: true,
  });

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const total = eventCategories.length;
    const active = eventCategories.filter(c => c.active).length;
    const totalBookingsCount = bookings.length;

    // Map bookings to categories
    const categoryBookingCounts: Record<string, number> = {};
    bookings.forEach(b => {
      const typeKey = (b.eventType || '').toLowerCase();
      categoryBookingCounts[typeKey] = (categoryBookingCounts[typeKey] || 0) + 1;
    });

    return {
      total,
      active,
      inactive: total - active,
      totalBookingsCount,
      categoryBookingCounts,
    };
  }, [eventCategories, bookings]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return eventCategories.filter((cat) => {
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.badge && cat.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cat.recommendedServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? cat.active : !cat.active;

      return matchesSearch && matchesStatus;
    });
  }, [eventCategories, searchQuery, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      iconName: 'Heart',
      badge: 'Popular Setup',
      color: 'rose',
      targetScale: '200 - 1,000+ Guests',
      defaultPackageEstimate: 5000000,
      recommendedServices: services.slice(0, 3).map(s => s.title),
      rentalChecklist: [
        'High-capacity clear-span marquee',
        'Intelligent ambient uplighting',
        'Line-array acoustic sound system',
        'Silent backup diesel generator'
      ],
      checklistInput: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: EventCategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      iconName: category.iconName || 'Heart',
      badge: category.badge || '',
      color: category.color || 'blue',
      targetScale: category.targetScale || '',
      defaultPackageEstimate: category.defaultPackageEstimate || '',
      recommendedServices: category.recommendedServices || [],
      rentalChecklist: category.rentalChecklist || [],
      checklistInput: '',
      active: category.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCloneCategory = (category: EventCategoryItem) => {
    setEditingCategory(null);
    setFormData({
      name: `${category.name} (Copy)`,
      slug: `${category.slug}_copy`,
      description: category.description,
      iconName: category.iconName,
      badge: category.badge ? `${category.badge}` : 'Custom Category',
      color: category.color,
      targetScale: category.targetScale || '',
      defaultPackageEstimate: category.defaultPackageEstimate || '',
      recommendedServices: [...category.recommendedServices],
      rentalChecklist: [...(category.rentalChecklist || [])],
      checklistInput: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleToggleServiceRecommendation = (serviceTitle: string) => {
    setFormData(prev => {
      const exists = prev.recommendedServices.includes(serviceTitle);
      return {
        ...prev,
        recommendedServices: exists
          ? prev.recommendedServices.filter(s => s !== serviceTitle)
          : [...prev.recommendedServices, serviceTitle]
      };
    });
  };

  const handleAddChecklistItem = () => {
    if (!formData.checklistInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      rentalChecklist: [...prev.rentalChecklist, prev.checklistInput.trim()],
      checklistInput: ''
    }));
  };

  const handleRemoveChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rentalChecklist: prev.rentalChecklist.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slugFormatted = formData.slug.trim()
      ? formData.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
      : formData.name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    const estimateNum = formData.defaultPackageEstimate 
      ? Number(String(formData.defaultPackageEstimate).replace(/[^0-9]/g, '')) 
      : undefined;

    if (editingCategory) {
      updateEventCategory(editingCategory.id, {
        name: formData.name.trim(),
        slug: slugFormatted,
        description: formData.description.trim(),
        iconName: formData.iconName,
        badge: formData.badge.trim() || undefined,
        color: formData.color,
        targetScale: formData.targetScale.trim() || undefined,
        defaultPackageEstimate: estimateNum,
        recommendedServices: formData.recommendedServices,
        rentalChecklist: formData.rentalChecklist,
        active: formData.active,
      });
    } else {
      addEventCategory({
        name: formData.name.trim(),
        slug: slugFormatted,
        description: formData.description.trim(),
        iconName: formData.iconName,
        badge: formData.badge.trim() || undefined,
        color: formData.color,
        targetScale: formData.targetScale.trim() || undefined,
        defaultPackageEstimate: estimateNum,
        recommendedServices: formData.recommendedServices,
        rentalChecklist: formData.rentalChecklist,
        active: formData.active,
        order: eventCategories.length + 1,
      });
    }

    setIsModalOpen(false);
  };

  const renderCategoryIcon = (iconName: string, className?: string) => {
    const iconObj = AVAILABLE_ICONS.find(i => i.name === iconName) || AVAILABLE_ICONS[0];
    const IconComp = iconObj.icon;
    return <IconComp className={className || 'w-5 h-5'} />;
  };

  const getColorClasses = (color: EventCategoryItem['color']) => {
    return COLOR_THEMES.find(c => c.id === color) || COLOR_THEMES[1];
  };

  const formatUGX = (amount?: number) => {
    if (!amount) return 'UGX Custom';
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Metric Strip */}
      <div className="p-6 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-xl space-y-4">
        {onBack && (
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Admin / Categories</span>
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>Catalog & Bookings Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white tracking-tight">
              Event Categories Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create and manage bespoke event categories (e.g. Weddings, Corporate Galas, Concerts, Church Crusades) to organize equipment rentals, fleet packages, and client booking forms.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Reset categories to default presets"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0F1F38]" />
              <span>Create New Category</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-300 block">Total Event Categories</span>
            <span className="text-2xl font-black font-['Outfit'] text-white">{stats.total}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-300 block">Active in Booking Modal</span>
            <span className="text-2xl font-black font-['Outfit'] text-emerald-300">{stats.active}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-300 block">Linked System Bookings</span>
            <span className="text-2xl font-black font-['Outfit'] text-blue-300">{stats.totalBookingsCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-300 block">Fleet Rental Services</span>
            <span className="text-2xl font-black font-['Outfit'] text-amber-300">{services.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/15 bg-[#132644] text-white">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name, code, badge, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[#0E1D35] border border-white/20 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-white text-[#0F1F38] font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({eventCategories.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'active' ? 'bg-white text-[#0F1F38] font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'inactive' ? 'bg-white text-[#0F1F38] font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Inactive ({stats.inactive})
            </button>
          </div>
        </div>
      </div>

      {/* Categories Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="p-12 rounded-3xl border border-white/15 bg-[#132644] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-slate-300">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Event Categories Found</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Try adjusting your search filter or create a new category to organize your event catalog.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-white text-[#0F1F38] font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const colorMeta = getColorClasses(cat.color);
            const linkedBookings = (stats.categoryBookingCounts[cat.slug.toLowerCase()] || 0) +
              (stats.categoryBookingCounts[cat.name.toLowerCase()] || 0);

            return (
              <div
                key={cat.id}
                className={`rounded-3xl border ${colorMeta.border} bg-[#132644] p-5 sm:p-6 text-white space-y-4 flex flex-col justify-between hover:border-white/40 transition-all shadow-lg relative overflow-hidden`}
              >
                {/* Accent top banner */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${colorMeta.badgeBg}`} />

                <div className="space-y-3.5">
                  {/* Top line: Icon, Title & Active badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${colorMeta.bg} ${colorMeta.text} border ${colorMeta.border} flex items-center justify-center shadow-inner`}>
                        {renderCategoryIcon(cat.iconName, 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white font-['Outfit'] leading-tight">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0E1D35] text-slate-300 border border-white/10">
                            slug: {cat.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleEventCategoryStatus(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 shrink-0 ${
                        cat.active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30'
                      }`}
                      title={cat.active ? 'Click to deactivate in booking modal' : 'Click to activate'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.active ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                      <span>{cat.active ? 'Active' : 'Archived'}</span>
                    </button>
                  </div>

                  {/* Badge & Target Audience */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {cat.badge && (
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${colorMeta.badgeBg} ${colorMeta.text} border ${colorMeta.border} flex items-center gap-1`}>
                        <Tag className="w-3 h-3" />
                        <span>{cat.badge}</span>
                      </span>
                    )}

                    {cat.targetScale && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/10 text-slate-200 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{cat.targetScale}</span>
                      </span>
                    )}

                    {cat.defaultPackageEstimate ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/15 text-amber-200 border border-amber-400/20">
                        {formatUGX(cat.defaultPackageEstimate)}
                      </span>
                    ) : null}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {cat.description || 'No specific technical description provided for this category.'}
                  </p>

                  {/* Recommended Equipment & Rentals */}
                  {cat.recommendedServices && cat.recommendedServices.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                        <Package className="w-3.5 h-3.5 text-blue-300" />
                        <span>Recommended Rentals & Fleet:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cat.recommendedServices.map((srv, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#0E1D35] border border-white/10 text-[10px] text-slate-200 font-medium truncate max-w-[200px]"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rental Checklist */}
                  {cat.rentalChecklist && cat.rentalChecklist.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                        <Wrench className="w-3.5 h-3.5 text-amber-300" />
                        <span>Dispatch & Rigging Checklist:</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {cat.rentalChecklist.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {cat.rentalChecklist.length > 3 && (
                          <li className="text-[10px] text-slate-400 pl-4 font-semibold">
                            +{cat.rentalChecklist.length - 3} more checklist items
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Actions & Linked Bookings */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-blue-300" />
                      <span>Linked Bookings:</span>
                      <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                        {linkedBookings}
                      </span>
                    </div>

                    {onSelectCategoryFilter && linkedBookings > 0 && (
                      <button
                        onClick={() => onSelectCategoryFilter(cat.slug)}
                        className="text-[11px] text-blue-300 hover:text-white font-bold inline-flex items-center gap-0.5 transition-colors"
                      >
                        <span>Filter Bookings</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Category</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCloneCategory(cat)}
                        className="p-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        title="Clone Category as Template"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT EVENT CATEGORY */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#132644] text-white shadow-2xl my-8 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 bg-[#0F1F38] border-b border-white/15 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1 text-xs font-bold border border-white/15 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 text-white">
                      <Layers className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold font-['Outfit'] text-white">
                        {editingCategory ? `Edit Event Category: ${editingCategory.name}` : 'Create New Event Category'}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Configure category details, theme styling, and recommended fleet equipment.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
                {/* Row 1: Name and Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-white flex items-center justify-between">
                      <span>Category Name *</span>
                      <span className="text-[10px] text-slate-400 font-normal">e.g. Church Crusades & Rallies</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weddings & Kwanjula, Corporate Expos"
                      value={formData.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          name: newName,
                          slug: editingCategory ? prev.slug : newName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')
                        }));
                      }}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white flex items-center justify-between">
                      <span>URL Code / Slug *</span>
                      <span className="text-[10px] text-slate-400 font-normal">Internal system identifier</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. crusades, sports_tournament"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '_') })}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white font-mono"
                    />
                  </div>
                </div>

                {/* Row 2: Icon and Color Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">Visual Icon</label>
                    <div className="grid grid-cols-7 gap-1.5 p-2 rounded-xl bg-[#0E1D35] border border-white/20 max-h-28 overflow-y-auto">
                      {AVAILABLE_ICONS.map((iconItem) => {
                        const isSelected = formData.iconName === iconItem.name;
                        const IconComponent = iconItem.icon;
                        return (
                          <button
                            key={iconItem.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, iconName: iconItem.name })}
                            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-white text-[#0F1F38] shadow-md'
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                            title={iconItem.label}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">Color Accent</label>
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-[#0E1D35] border border-white/20">
                      {COLOR_THEMES.map((theme) => {
                        const isSelected = formData.color === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: theme.id })}
                            className={`p-2 rounded-lg text-center font-bold text-[11px] transition-all border ${
                              isSelected
                                ? 'bg-white text-[#0F1F38] border-white shadow-md'
                                : `${theme.bg} ${theme.text} ${theme.border} hover:opacity-90`
                            }`}
                          >
                            {theme.label.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 3: Badge, Target Scale, and Default Budget Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">Highlight Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. High Demand, VIP"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">Target Scale / Guests</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 - 3,000+ Guests"
                      value={formData.targetScale}
                      onChange={(e) => setFormData({ ...formData, targetScale: e.target.value })}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-white block">Package Estimate (UGX)</label>
                    <input
                      type="number"
                      placeholder="e.g. 6500000"
                      value={formData.defaultPackageEstimate}
                      onChange={(e) => setFormData({ ...formData, defaultPackageEstimate: e.target.value })}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-white font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-white block">Category Description & Production Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Describe typical client requirements, setup considerations, and recommended production tier..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white leading-relaxed resize-none"
                  />
                </div>

                {/* Recommended Fleet Services Multi-select */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-300" />
                      <span>Recommended Fleet & Rentals (Associate with Catalog)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Click to select equipment</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0E1D35] border border-white/15 max-h-40 overflow-y-auto">
                    {services.map((srv) => {
                      const isSelected = formData.recommendedServices.includes(srv.title);
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => handleToggleServiceRecommendation(srv.title)}
                          className={`p-2 rounded-xl text-left transition-colors flex items-center justify-between text-xs border ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-400/40 text-white font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">{srv.title}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-white/30'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rigging & Dispatch Checklist */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-300" />
                      <span>Dispatch & Rigging Preparation Checklist</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Required items for field crew</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add preparation item (e.g. 100kVA Generator, Crystal Chandeliers...)"
                      value={formData.checklistInput}
                      onChange={(e) => setFormData({ ...formData, checklistInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                      className="flex-1 bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddChecklistItem}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                    >
                      Add Item
                    </button>
                  </div>

                  {formData.rentalChecklist.length > 0 && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-[#0E1D35] border border-white/15 max-h-32 overflow-y-auto">
                      {formData.rentalChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 text-slate-200 text-xs">
                          <span className="flex items-center gap-2 truncate pr-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveChecklistItem(idx)}
                            className="text-red-300 hover:text-red-100 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E1D35] border border-white/15">
                  <div>
                    <span className="font-bold text-white block">Category Status</span>
                    <span className="text-[11px] text-slate-300">
                      When active, this category is visible in the public booking modal and catalog filters.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back / Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeleteConfirmId(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-2xl p-6 border border-red-500/30 bg-[#132644] text-white space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-400/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold">Delete Event Category?</h3>
                <p className="text-xs text-slate-300">
                  Are you sure you want to delete this event category? Existing bookings will retain their records, but this category will no longer appear in the catalog.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back / Cancel</span>
                </button>
                <button
                  onClick={() => {
                    deleteEventCategory(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Delete Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: RESET DEFAULTS CONFIRMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setResetConfirmOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full rounded-2xl p-6 border border-amber-500/30 bg-[#132644] text-white space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold">Restore Default Categories?</h3>
                <p className="text-xs text-slate-300">
                  This will reset your event categories catalogue back to the standard SBL presets (Weddings, Corporate, Concerts, Cultural, Parties, B2B Hire).
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back / Keep Current</span>
                </button>
                <button
                  onClick={() => {
                    resetEventCategoriesToDefault();
                    setResetConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  Yes, Restore Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
