import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  Film, 
  MapPin, 
  Users, 
  Calendar, 
  Sparkles, 
  Check, 
  X, 
  RefreshCw,
  Eye,
  Layers,
  Image as ImageIcon,
  ChevronLeft,
  ArrowLeft,
  AlertCircle,
  Upload,
  Flame,
  ShieldCheck,
  Star,
  Search,
  Copy,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { compressImageFileOrDataUrl } from '../utils/imageOptimizer';
import { CloudSyncBadge } from './CloudSyncBadge';
import { 
  QUICK_UGANDAN_LOCATIONS, 
  QUICK_EQUIPMENT_SUGGESTIONS, 
  CURATED_SERVICE_IMAGE_PRESETS 
} from '../data/curatedPresets';

interface AdminGallerySectionProps {
  onBack?: () => void;
}

export const AdminGallerySection: React.FC<AdminGallerySectionProps> = ({ onBack }) => {
  const { 
    galleryItems, 
    addGalleryItem, 
    updateGalleryItem, 
    deleteGalleryItem, 
    resetGalleryToDefault,
    currentAdminUser,
    showToast 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [mobileModalTab, setMobileModalTab] = useState<'form' | 'preview'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'weddings' | 'tents' | 'corporate' | 'concerts' | 'cultural'>('weddings');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('500+ Guests');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('Full Production');
  const [clientName, setClientName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [servicesInput, setServicesInput] = useState('Alpine Mega Tent, Line Array Audio, VIP Restrooms, Staging');
  const [photosInput, setPhotosInput] = useState('');

  // Upload & Drag State
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered gallery items
  const filteredGalleryItems = galleryItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.servicesProvided && item.servicesProvided.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle Cover Photo Upload
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      showToast('Optimizing Cover Image...', 'Compressing photo for instant cloud sync.', 'info');
      const compressedDataUrl = await compressImageFileOrDataUrl(file, 1280, 1280, 0.82);
      if (compressedDataUrl) {
        setImageUrl(compressedDataUrl);
        showToast('Image Ready', 'Photo compressed and ready to save.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload Error', 'Failed to process image file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('weddings');
    setLocation('Kampala (Serena / Kololo)');
    setAttendees('500+ Guests');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setBadge('Full Production');
    setClientName('');
    setImageUrl('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200');
    setVideoUrl('');
    setServicesInput('Clear-Span Mega Tent, Line Array Audio, VIP Restrooms, Staging');
    setPhotosInput('');
    setEditingItem(null);
    setMobileModalTab('form');
  };

  const openCreateModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory((item.category as any) || 'weddings');
    setLocation(item.location);
    setAttendees(item.attendees);
    setDate(item.date);
    setDescription(item.description);
    setBadge(item.badge || '');
    setClientName(item.clientName || '');
    setImageUrl(item.image);
    setVideoUrl(item.videoUrl || '');
    setServicesInput(item.servicesProvided ? item.servicesProvided.join(', ') : '');
    setPhotosInput(item.photos ? item.photos.join('\n') : '');
    setMobileModalTab('form');
    setIsAddModalOpen(true);
  };

  // Duplicate / Clone an event showcase item
  const handleDuplicateItem = (item: GalleryItem) => {
    const clonedData = {
      title: `${item.title} (Copy)`,
      category: item.category,
      location: item.location,
      attendees: item.attendees,
      date: 'Recent Event',
      description: item.description,
      badge: item.badge || 'Verified Rigging',
      clientName: item.clientName ? `${item.clientName} (Copy)` : undefined,
      postedBy: currentAdminUser?.name || 'Hamza Kizza (Major Admin)',
      image: item.image,
      videoUrl: item.videoUrl,
      servicesProvided: item.servicesProvided ? [...item.servicesProvided] : ['Full Rigging'],
      photos: item.photos ? [...item.photos] : undefined,
    };
    addGalleryItem(clonedData);
    showToast('Event Showcase Duplicated', `Created a copy of "${item.title}".`, 'success');
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      showToast('Validation Error', 'Please enter an event title.', 'warning');
      return;
    }
    if (!imageUrl.trim()) {
      showToast('Validation Error', 'Please provide a cover image URL.', 'warning');
      return;
    }

    const servicesList = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const photosList = photosInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const itemData = {
      title: title.trim(),
      category,
      location: location.trim() || 'Kampala Venue',
      attendees: attendees.trim() || '500+ Guests',
      date: date.trim() || 'Recent Event',
      description: description.trim() || 'Full production setup completed successfully by SBL Events.',
      badge: badge.trim() || undefined,
      clientName: clientName.trim() || undefined,
      postedBy: currentAdminUser?.name || 'Hamza Kizza (Major Admin)',
      image: imageUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      servicesProvided: servicesList.length > 0 ? servicesList : ['Full Production Rigging'],
      photos: photosList.length > 0 ? photosList : undefined,
    };

    if (editingItem) {
      updateGalleryItem(editingItem.id, itemData);
      showToast('Event Done Updated', `"${title}" was updated in the cloud gallery.`, 'success');
    } else {
      addGalleryItem(itemData);
      showToast('Event Done Added', `"${title}" was published to the cloud gallery.`, 'success');
    }

    setIsAddModalOpen(false);
  };

  const quickAddEquipment = (eqName: string) => {
    const current = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!current.includes(eqName)) {
      setServicesInput([...current, eqName].join(', '));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0E1D35] p-5 rounded-2xl border border-white/10 space-y-4">
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
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Admin / Events Done Showcase</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-300" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Events Done & Portfolio Showcase
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Cloud-persisted gallery: Show off past setups (Kwanjula, mega weddings, concerts, state galas) with photos and videos.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <CloudSyncBadge compact={true} />

            <button
              type="button"
              onClick={resetGalleryToDefault}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/15 cursor-pointer"
              title="Restore official default showcase items"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0E1D35] font-extrabold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Event Done</span>
            </button>
          </div>
        </div>

        {/* Practical Search & Category Filter Toolbar */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search showcase by title, venue, couple, or gear..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#071326] border border-white/15 text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'weddings', label: 'Weddings' },
              { id: 'tents', label: 'Tents' },
              { id: 'corporate', label: 'Corporate' },
              { id: 'concerts', label: 'Concerts' },
              { id: 'cultural', label: 'Cultural' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-amber-500 text-[#0E1D35] shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Events Done in Jumia Marketplace Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
          >
            {/* Top Jumia Media Showcase */}
            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Official Blue Badge */}
              <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-br-xl shadow-xs tracking-wider flex items-center gap-1 z-10">
                <Flame className="w-3 h-3 fill-white" />
                <span>OFFICIAL SBL</span>
              </div>

              {/* Badges on Top Right */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/75 backdrop-blur-xs text-white shadow-xs">
                  {item.category}
                </span>

                {item.videoUrl && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                    <Film className="w-3 h-3" />
                    <span>Video</span>
                  </span>
                )}
              </div>

              {/* Attendees Badge */}
              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs z-10 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span>{item.attendees}</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>{item.category} Production</span>
                  <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* Location & Client */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-medium truncate max-w-[60%]">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  {item.clientName && (
                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[40%] text-right">
                      {item.clientName}
                    </span>
                  )}
                </div>

                {/* Rating Bar */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center text-blue-500 text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">5.0</span>
                  <span className="text-[11px] text-slate-400 font-mono">({item.date || 'Recent'})</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                  {item.description}
                </p>

                {/* Equipment Tags */}
                {item.servicesProvided && item.servicesProvided.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {item.servicesProvided.slice(0, 3).map((srv, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                        {srv}
                      </span>
                    ))}
                    {item.servicesProvided.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold">+{item.servicesProvided.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Showcase</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicateItem(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                  title="Duplicate / clone this showcase event"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 cursor-pointer"
                  title="Remove from public showcase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGalleryItems.length === 0 && (
        <div className="bg-[#0E1D35] p-8 rounded-2xl border border-white/10 text-center space-y-3">
          <Camera className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-white font-bold text-sm">No Showcase Events Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? `No events match "${searchQuery}". Try a different keyword.` : 'Start posting completed event setups to build your portfolio.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* DUAL-PANE STUDIO MODAL: POST / EDIT EVENT DONE WITH LIVE PREVIEW */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="max-w-5xl w-full rounded-3xl bg-[#0B172B] border border-white/20 text-white shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]"
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 border-b border-white/15 bg-[#0F223D] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer group"
                    title="Back"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                      {editingItem ? 'Edit Event Done' : 'Post New Event Done to Gallery'}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Live synchronizing to public portfolio
                    </p>
                  </div>
                </div>

                {/* Mobile Tab Toggle */}
                <div className="flex items-center gap-2">
                  <div className="lg:hidden flex items-center p-1 bg-[#071326] rounded-xl border border-white/15">
                    <button
                      type="button"
                      onClick={() => setMobileModalTab('form')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        mobileModalTab === 'form' ? 'bg-amber-500 text-[#0E1D35]' : 'text-slate-300'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileModalTab('preview')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        mobileModalTab === 'preview' ? 'bg-amber-500 text-[#0E1D35]' : 'text-slate-300'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Two-Column Studio */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
                
                {/* Left Column: Form Fields */}
                <form
                  onSubmit={handleSave}
                  className={`lg:col-span-7 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs border-r border-white/10 bg-[#0A1629] ${
                    mobileModalTab === 'preview' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Event Title */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Kwanjula Ceremony & Alpine Mega Tent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400 cursor-pointer"
                      >
                        <option value="weddings">Weddings & Kwanjula</option>
                        <option value="tents">Mega Tents & Structures</option>
                        <option value="corporate">Corporate Galas & Expos</option>
                        <option value="concerts">Concerts & Festivals</option>
                        <option value="cultural">Cultural Ceremonies</option>
                      </select>
                    </div>

                    {/* Client / Couple Name */}
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Client / Couple Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Kato & Florence"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    {/* Location with Quick Chips */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Masaka Golf Course Arena"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400 mb-1"
                      />
                      {/* Quick Location Chips */}
                      <div className="flex flex-wrap gap-1">
                        {QUICK_UGANDAN_LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocation(loc)}
                            className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                              location === loc
                                ? 'bg-amber-400 text-[#0E1D35] font-bold'
                                : 'bg-white/10 text-slate-300 hover:text-white'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Attendees with Quick Chips */}
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Attendees / Scale
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1,200 Guests"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400 mb-1"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['300+ Guests', '500+ Guests', '1,200+ Guests', '2,500+ Guests', '5,000+ Stadium'].map((att) => (
                          <button
                            key={att}
                            type="button"
                            onClick={() => setAttendees(att)}
                            className={`text-[10px] px-1.5 py-0.5 rounded-md cursor-pointer ${
                              attendees === att ? 'bg-blue-400 text-black font-bold' : 'bg-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {att}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Date */}
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Event Date / Season
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. August 2026"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    {/* Cover Photo Upload & Presets */}
                    <div className="space-y-2 sm:col-span-2 p-3.5 rounded-2xl bg-[#060F1E] border border-white/15">
                      <div className="flex items-center justify-between">
                        <label className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Cover Photo *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="text-[11px] bg-amber-500 hover:bg-amber-400 text-[#0E1D35] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{isUploading ? 'Compressing...' : 'Upload File'}</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverFileUpload}
                      />

                      {/* Drop Zone / URL Input */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`p-2.5 rounded-xl border border-dashed transition-all ${
                          isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-white/20 bg-[#0B1A30]'
                        }`}
                      >
                        <input
                          type="url"
                          required
                          placeholder="Paste image URL (https://...) or drop photo file here"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400 font-mono"
                        />
                      </div>

                      {/* 1-Click Curated Presets */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          1-Click Instant Photo Presets:
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {CURATED_SERVICE_IMAGE_PRESETS.slice(0, 6).map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setImageUrl(preset.url)}
                              className={`shrink-0 p-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                                imageUrl === preset.url ? 'border-amber-400 bg-amber-500/20' : 'border-white/10 bg-[#071326]'
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.title}
                                className="w-7 h-7 rounded-lg object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[10px] font-bold text-white max-w-[80px] truncate">{preset.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Equipment Deployed with Quick Chips */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Equipment Deployed (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Mega Tent, LED Screens, Line Array Sound, Luxury Restrooms"
                        value={servicesInput}
                        onChange={(e) => setServicesInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400 mb-1"
                      />
                      <div className="flex flex-wrap gap-1">
                        {QUICK_EQUIPMENT_SUGGESTIONS.map((eq) => (
                          <button
                            key={eq}
                            type="button"
                            onClick={() => quickAddEquipment(eq)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-2.5 h-2.5 text-amber-400" />
                            <span>{eq}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Event Description / Technical Highlights
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe the venue staging, audio clarity, and marquee rigging..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    {/* Video / TikTok URL */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider text-slate-300">
                        Video / TikTok URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.tiktok.com/@sblofficial92/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0E1D35] font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingItem ? 'Save Changes' : 'Publish Showcase'}</span>
                    </button>
                  </div>
                </form>

                {/* Right Column: Live Showcase Card Preview */}
                <div className={`lg:col-span-5 bg-[#071120] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto ${
                  mobileModalTab === 'form' ? 'hidden lg:flex' : 'flex'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live Showcase Card Preview</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                        Live Preview
                      </span>
                    </div>

                    {/* Preview Card */}
                    <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
                      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img
                          src={imageUrl || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200'}
                          alt={title || 'Event Preview'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-br-xl shadow-xs">
                          OFFICIAL SBL
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/75 text-white">
                            {category}
                          </span>
                          {videoUrl && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                              Video
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span>{attendees || '500+ Guests'}</span>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                          {title || 'Event Title Preview'}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-medium truncate max-w-[65%]">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="truncate">{location || 'Masaka Arena'}</span>
                          </span>
                          {clientName && (
                            <span className="text-[10px] font-bold text-slate-700 truncate max-w-[35%]">
                              {clientName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {description || 'Event description will display here...'}
                        </p>
                        {servicesInput && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {servicesInput.split(',').slice(0, 3).map((s, i) => (
                              <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                    <span className="font-bold text-white block mb-0.5">Cloud Persistence:</span>
                    Saved showcase events are published live to the visitor gallery and backed up to Firestore.
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-2xl p-6 border border-red-500/30 bg-[#132644] text-white space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-400/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Delete Showcase Event?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove <strong className="text-white">"{itemToDelete.title}"</strong> from the public gallery showcase? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel & Keep
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteGalleryItem(itemToDelete.id);
                  setItemToDelete(null);
                  showToast('Gallery Item Deleted', `Removed "${itemToDelete.title}" from showcase.`, 'info');
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
