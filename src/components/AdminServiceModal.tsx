import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, ServiceCategory } from '../types';
import { 
  X, 
  ArrowLeft, 
  Save, 
  Layers, 
  DollarSign, 
  Tag, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  Upload,
  Eye,
  Check,
  Star,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { compressImageFileOrDataUrl } from '../utils/imageOptimizer';
import { 
  CURATED_SERVICE_IMAGE_PRESETS, 
  QUICK_FEATURE_SUGGESTIONS, 
  QUICK_PRICE_PRESETS, 
  QUICK_PRICE_UNITS, 
  QUICK_CAPACITY_PRESETS 
} from '../data/curatedPresets';

interface AdminServiceModalProps {
  service?: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Service, 'id'>, id?: string) => void;
  formatUGX: (amount: number) => string;
}

const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: 'tents', label: 'Tents & Canopies' },
  { value: 'sound-mc', label: 'Sound & Audio Production' },
  { value: 'lighting', label: 'Lighting & Special Effects' },
  { value: 'screens', label: 'LED Screens & Visuals' },
  { value: 'production', label: 'Full Production & Staging' },
  { value: 'restrooms', label: 'Luxury Mobile Restrooms' },
  { value: 'b2b-lending', label: 'B2B Wholesale Equipment Sub-Rental' },
];

export const AdminServiceModal: React.FC<AdminServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSave,
  formatUGX,
}) => {
  const isEditing = !!service;

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'features' | 'desc'>('basics');
  const [mobilePreviewMode, setMobilePreviewMode] = useState<'form' | 'preview'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('tents');
  const [basePrice, setBasePrice] = useState(2500000);
  const [priceUnit, setPriceUnit] = useState('per event');
  const [capacityOrScale, setCapacityOrScale] = useState('300 - 1,500 Guests');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [b2bAvailable, setB2bAvailable] = useState(true);

  // Uploading / Dragging State
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setTagline(service.tagline);
      setCategory(service.category);
      setBasePrice(service.basePrice || 0);
      setPriceUnit(service.priceUnit || 'per event');
      setCapacityOrScale(service.capacityOrScale || '');
      setShortDesc(service.shortDesc);
      setFullDesc(service.fullDesc);
      setImage(service.image);
      setFeatures(service.features ? [...service.features] : []);
      setB2bAvailable(service.b2bAvailable ?? true);
    } else {
      setTitle('');
      setTagline('');
      setCategory('tents');
      setBasePrice(3000000);
      setPriceUnit('per event');
      setCapacityOrScale('500 - 2,000 Guests');
      setShortDesc('');
      setFullDesc('');
      setImage('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200');
      setFeatures([
        'Professional On-site Rigging Crew',
        'Certified Sound & Lighting Technicians',
        'Dual Generator Interlink Backup',
        'Free Kampala Delivery & Setup',
      ]);
      setB2bAvailable(true);
    }
    setNewFeatureInput('');
    setActiveTab('basics');
    setMobilePreviewMode('form');
  }, [service, isOpen]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to save, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, tagline, category, basePrice, priceUnit, capacityOrScale, shortDesc, fullDesc, image, features, b2bAvailable]);

  const handleAddFeature = (featText?: string) => {
    const textToAdd = (featText || newFeatureInput).trim();
    if (!textToAdd) return;
    if (features.includes(textToAdd)) return;
    setFeatures([...features, textToAdd]);
    if (!featText) setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Image upload handler
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const compressed = await compressImageFileOrDataUrl(file, 1280, 1280, 0.84);
      if (compressed) {
        setImage(compressed);
      }
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setActiveTab('basics');
      return;
    }

    const serviceData: Omit<Service, 'id'> = {
      title: title.trim(),
      tagline: tagline.trim() || 'Professional Event Infrastructure by SBL Events',
      category,
      basePrice: Math.max(0, Number(basePrice) || 0),
      priceUnit: priceUnit.trim() || 'per event',
      capacityOrScale: capacityOrScale.trim() || 'Custom Scale',
      shortDesc: shortDesc.trim() || `${title.trim()} delivered with commercial-grade engineering and setup.`,
      fullDesc: fullDesc.trim() || `${title.trim()} - Complete event production infrastructure, certified installation, and dedicated technical crew.`,
      image: image.trim() || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200',
      galleryImages: service?.galleryImages || [],
      videos: service?.videos || [],
      features: features.length > 0 ? features : ['Complete Professional Setup', 'Dedicated Crew Included'],
      specs: service?.specs || [
        { label: 'Engineering', value: 'Commercial Grade A' },
        { label: 'Power Backup', value: 'Dual Generator Interlink' },
      ],
      b2bAvailable,
    };

    onSave(serviceData, service?.id);
    onClose();
  };

  // Human-readable UGX word converter (e.g. 3,500,000 -> 3.5 Million UGX)
  const getReadablePrice = (amt: number) => {
    if (amt >= 1000000000) {
      return `${(amt / 1000000000).toFixed(2)} Billion UGX`;
    }
    if (amt >= 1000000) {
      const millions = amt / 1000000;
      return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} Million UGX`;
    }
    if (amt >= 1000) {
      return `${(amt / 1000).toFixed(0)}k UGX`;
    }
    return `${amt.toLocaleString()} UGX`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-[#0B172B] border border-white/20 rounded-3xl shadow-2xl text-white overflow-hidden my-auto flex flex-col max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0F223D] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all cursor-pointer group"
                title="Cancel & Close"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                    {isEditing ? 'Edit Service & Pricing' : 'Add New Event Service'}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isEditing ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isEditing ? 'Live Edit Mode' : 'New Catalog Item'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate max-w-xs sm:max-w-md">
                  {isEditing ? `Live synchronizing "${service?.title}" to public marketplace` : 'Add gear, pricing, and specs to public catalog'}
                </p>
              </div>
            </div>

            {/* Mobile View Switcher (Editor vs Live Preview) */}
            <div className="flex items-center gap-2">
              <div className="lg:hidden flex items-center p-1 bg-[#071326] rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setMobilePreviewMode('form')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    mobilePreviewMode === 'form' ? 'bg-amber-500 text-[#0E1D35]' : 'text-slate-300'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePreviewMode('preview')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    mobilePreviewMode === 'preview' ? 'bg-amber-500 text-[#0E1D35]' : 'text-slate-300'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: Two Column Studio on Desktop */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
            
            {/* Left Column: Form Editor Controls */}
            <div className={`lg:col-span-7 flex flex-col border-r border-white/10 bg-[#0A1629] overflow-hidden ${
              mobilePreviewMode === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}>
              
              {/* Practical Navigation Tabs */}
              <div className="px-4 pt-3 pb-2 border-b border-white/10 bg-[#0E1F38] flex items-center gap-1 overflow-x-auto shrink-0 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('basics')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'basics'
                      ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>1. Title & Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pricing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>2. Pricing & Scale</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'features'
                      ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3. Features & Perks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('desc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'desc'
                      ? 'bg-amber-500 text-[#0E1D35] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>4. Descriptions</span>
                </button>
              </div>

              {/* Form Content Area */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
                
                {/* TAB 1: TITLE, CATEGORY, & MEDIA */}
                {activeTab === 'basics' && (
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Service Title *
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#060F1E] border border-white/20 text-white font-semibold focus:outline-hidden focus:border-amber-400 text-xs sm:text-sm"
                          placeholder="e.g. Mega Clear-Span Aluminium Tent (1,500 Pax)"
                        />
                      </div>
                    </div>

                    {/* Tagline & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Marketing Tagline
                        </label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs"
                          placeholder="e.g. German-Engineered Panoramic Luxury"
                        />
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Category *
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs cursor-pointer"
                          >
                            {CATEGORY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#0A1629]">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Primary Cover Image & Practical Picker */}
                    <div className="p-3.5 rounded-2xl bg-[#060F1E] border border-white/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Primary Cover Photo *</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>{isUploading ? 'Compressing...' : 'Upload from Device'}</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />

                      {/* Drag & Drop Zone / URL Input */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`p-3 rounded-xl border border-dashed transition-all ${
                          isDragging
                            ? 'border-amber-400 bg-amber-500/10'
                            : 'border-white/20 bg-[#0B1A30]'
                        }`}
                      >
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Paste image link (https://...) or drop photo file here"
                          className="w-full px-3 py-2 rounded-lg bg-[#060F1E] border border-white/20 text-white font-mono text-[11px] focus:outline-hidden focus:border-amber-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                          Drop any image from your computer to auto-optimize and preview immediately.
                        </p>
                      </div>

                      {/* Curated 1-Click Photo Presets */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Instant High-Res Curated Presets (1-Click Apply):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                          {CURATED_SERVICE_IMAGE_PRESETS.map((preset) => {
                            const isSelected = image === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => setImage(preset.url)}
                                className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                                    : 'bg-[#0A1629] border-white/10 hover:border-white/30'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.title}
                                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="truncate">
                                  <p className="text-[10px] font-bold text-white truncate">{preset.title}</p>
                                  <span className="text-[9px] text-slate-400 capitalize">{preset.category}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation to next tab */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('pricing')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <span>Next: Pricing & Scale</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRICING & SCALE STUDIO */}
                {activeTab === 'pricing' && (
                  <div className="space-y-4">
                    {/* Price Input & Quick Adjusters */}
                    <div className="p-4 rounded-2xl bg-[#060F1E] border border-white/15 space-y-3">
                      <label className="block font-bold uppercase tracking-wider text-slate-300">
                        Base Price (UGX) *
                      </label>

                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                        <input
                          type="number"
                          min={0}
                          step={50000}
                          required
                          value={basePrice}
                          onChange={(e) => setBasePrice(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0B1A30] border border-white/20 text-white font-mono font-extrabold text-base sm:text-lg focus:outline-hidden focus:border-amber-400"
                        />
                      </div>

                      {/* Readable Price Highlight */}
                      <div className="flex items-center justify-between text-xs bg-[#0F2442] p-2.5 rounded-xl border border-white/10">
                        <span className="text-slate-300">Live Formatted:</span>
                        <span className="font-extrabold text-amber-300 font-mono">
                          {formatUGX(basePrice)} ({getReadablePrice(basePrice)})
                        </span>
                      </div>

                      {/* Practical Quick Adjusters (+500k, +1M, -500k) */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Quick Price Increment / Decrement:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBasePrice(Math.max(0, basePrice - 500000))}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-mono text-[11px] font-bold cursor-pointer"
                          >
                            - 500k
                          </button>
                          <button
                            type="button"
                            onClick={() => setBasePrice(basePrice + 500000)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold cursor-pointer"
                          >
                            + 500k
                          </button>
                          <button
                            type="button"
                            onClick={() => setBasePrice(basePrice + 1000000)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold cursor-pointer"
                          >
                            + 1.0M
                          </button>
                          <button
                            type="button"
                            onClick={() => setBasePrice(basePrice + 2500000)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold cursor-pointer"
                          >
                            + 2.5M
                          </button>
                        </div>
                      </div>

                      {/* Common Price Presets */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Preset Standard Quotes:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_PRICE_PRESETS.map((preset) => (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => setBasePrice(preset.value)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                                basePrice === preset.value
                                  ? 'bg-amber-500 text-[#0E1D35] font-extrabold shadow-sm'
                                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Unit & Capacity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Pricing Unit *
                        </label>
                        <input
                          type="text"
                          required
                          value={priceUnit}
                          onChange={(e) => setPriceUnit(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs mb-1.5"
                          placeholder="e.g. per event"
                        />
                        {/* Quick Unit Pills */}
                        <div className="flex flex-wrap gap-1">
                          {QUICK_PRICE_UNITS.map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setPriceUnit(unit)}
                              className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                                priceUnit === unit ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Capacity / Scale
                        </label>
                        <input
                          type="text"
                          value={capacityOrScale}
                          onChange={(e) => setCapacityOrScale(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs mb-1.5"
                          placeholder="e.g. 500 - 1,500 Guests"
                        />
                        {/* Quick Capacity Pills */}
                        <div className="flex flex-wrap gap-1">
                          {QUICK_CAPACITY_PRESETS.map((cap) => (
                            <button
                              key={cap}
                              type="button"
                              onClick={() => setCapacityOrScale(cap)}
                              className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                                capacityOrScale === cap ? 'bg-blue-400 text-black font-bold' : 'bg-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {cap}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* B2B Wholesale Sub-Hire Toggle */}
                    <div className="p-3.5 rounded-2xl bg-[#060F1E] border border-white/15 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                        <div>
                          <h5 className="font-bold text-xs text-white">B2B Wholesale Sub-Hire Eligible</h5>
                          <p className="text-[11px] text-slate-300">Allow peer event rental agencies to rent this gear.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="service-b2b-eligible"
                        checked={b2bAvailable}
                        onChange={(e) => setB2bAvailable(e.target.checked)}
                        className="w-5 h-5 rounded-md accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Nav actions */}
                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('basics')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('features')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <span>Next: Features & Perks</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: FEATURES & PERKS */}
                {activeTab === 'features' && (
                  <div className="space-y-4">
                    {/* Key Features List */}
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Included Features ({features.length})
                      </label>
                      
                      <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
                        {features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#060F1E] border border-white/10 text-xs"
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-white font-medium">{feat}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                              title="Delete feature"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Custom Feature */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFeatureInput}
                          onChange={(e) => setNewFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFeature();
                            }
                          }}
                          placeholder="Type custom feature and hit enter..."
                          className="flex-1 px-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white text-xs focus:outline-hidden focus:border-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddFeature()}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0E1D35] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick 1-Click Feature Suggestions */}
                    <div className="p-3.5 rounded-2xl bg-[#060F1E] border border-white/15">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>1-Click Popular Event Rental Perks:</span>
                      </span>

                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_FEATURE_SUGGESTIONS.map((sugg) => {
                          const alreadyAdded = features.includes(sugg);
                          return (
                            <button
                              key={sugg}
                              type="button"
                              disabled={alreadyAdded}
                              onClick={() => handleAddFeature(sugg)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                                alreadyAdded
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-60'
                                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-200'
                              }`}
                            >
                              {alreadyAdded ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Plus className="w-3 h-3 text-amber-400" />
                              )}
                              <span>{sugg}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nav actions */}
                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('pricing')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('desc')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <span>Next: Descriptions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: DESCRIPTIONS & SPECS */}
                {activeTab === 'desc' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Short Summary (Card Previews) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs"
                        placeholder="Concise 1-2 sentence overview for marketplace cards..."
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Full Technical Description (Booking & Quote View) *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#060F1E] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 text-xs leading-relaxed"
                        placeholder="Detailed technical specifications, power requirements, wind rating, setup timeline..."
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#0F2442] border border-white/10 text-xs text-slate-300 flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                      <span>
                        Tip: You can use <kbd className="px-1.5 py-0.5 bg-black/40 rounded text-amber-300 font-mono text-[10px]">Ctrl + Enter</kbd> anywhere to save immediately.
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('features')}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

              </form>

              {/* Bottom Sticky Action Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0A1629] flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-[#0E1D35] font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes to Cloud' : 'Publish to Marketplace'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Marketplace Card Preview */}
            <div className={`lg:col-span-5 bg-[#071120] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto ${
              mobilePreviewMode === 'form' ? 'hidden lg:flex' : 'flex'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Public Card Preview</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Reactive
                  </span>
                </div>

                {/* SBL / Jumia Card Preview */}
                <div className="bg-[#0E1D35] rounded-2xl overflow-hidden border border-white/15 shadow-xl transition-all hover:border-amber-400/50">
                  {/* Photo Container */}
                  <div className="relative aspect-16/10 bg-[#071326] overflow-hidden">
                    <img
                      src={image || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200'}
                      alt={title || 'Preview'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Official Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>SBL OFFICIAL</span>
                    </div>

                    {/* Category Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 capitalize">
                      {category}
                    </div>

                    {/* B2B Badge */}
                    {b2bAvailable && (
                      <div className="absolute bottom-2 left-2.5 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>B2B Wholesale</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 font-['Outfit']">
                        {title || 'Service Title Preview'}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1">
                        {tagline || 'Marketing tagline will display here...'}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[11px] text-amber-400">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-white ml-1">5.0</span>
                      <span className="text-slate-400 text-[10px]">(Verified Gear)</span>
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-[10px] text-slate-400">Price Quote</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-amber-400 font-mono">
                          {formatUGX(basePrice)}
                        </span>
                        <span className="text-[11px] text-slate-300">/{priceUnit || 'per event'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                        Scale: {capacityOrScale || 'Custom event scale'}
                      </span>
                    </div>

                    {/* Features Preview */}
                    {features.length > 0 && (
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Included Perks ({features.length}):
                        </span>
                        <div className="space-y-1">
                          {features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                          {features.length > 3 && (
                            <span className="text-[10px] text-amber-400 font-semibold pl-4 block">
                              + {features.length - 3} more included perks
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Helper box */}
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                <span className="font-bold text-white block mb-1">Instant Portability Guarantee:</span>
                Changes saved here sync immediately to Cloud Firestore and update all visitor browsers in real time without refreshing.
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
