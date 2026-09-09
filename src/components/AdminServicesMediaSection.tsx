import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Service, ServiceCategory, ServiceVideo } from '../types';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  Layers, 
  Star, 
  Edit3, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
  Play,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  SlidersHorizontal,
  ChevronLeft,
  LayoutGrid,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Flame,
  Search,
  Copy,
  X,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { AdminServiceModal } from './AdminServiceModal';
import { CloudSyncBadge } from './CloudSyncBadge';
import { compressImageFileOrDataUrl } from '../utils/imageOptimizer';
import { CURATED_SERVICE_IMAGE_PRESETS } from '../data/curatedPresets';

interface AdminServicesMediaSectionProps {
  onBack?: () => void;
}

export const AdminServicesMediaSection: React.FC<AdminServicesMediaSectionProps> = ({ onBack }) => {
  const { 
    services, 
    addService,
    deleteService,
    updateService, 
    addServiceImage, 
    removeServiceImage, 
    setServiceCoverImage, 
    addServiceVideo, 
    removeServiceVideo, 
    resetServicesToDefault,
    showToast 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'mega-tents');
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos' | 'details'>('photos');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [viewMode, setViewMode] = useState<'jumia' | 'studio'>('jumia');

  // Service Edit / Add Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  // Quick Price Modal State
  const [quickPriceService, setQuickPriceService] = useState<Service | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(1500000);

  // Lightbox Zoom Preview State
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Add Photo State
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Video State
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoPlatformInput, setVideoPlatformInput] = useState<'tiktok' | 'youtube' | 'mp4' | 'other'>('tiktok');

  // Filtered Services List
  const filteredServices = services.filter((srv) => {
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.tagline && srv.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srv.shortDesc && srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srv.features && srv.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategoryFilter === 'all' || srv.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Edit Service Info State
  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  const [editTitle, setEditTitle] = useState(activeService?.title || '');
  const [editTagline, setEditTagline] = useState(activeService?.tagline || '');
  const [editShortDesc, setEditShortDesc] = useState(activeService?.shortDesc || '');
  const [editCategory, setEditCategory] = useState<ServiceCategory>(activeService?.category || 'tents');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Synchronize edit inputs when selected service changes
  useEffect(() => {
    if (activeService) {
      setEditTitle(activeService.title);
      setEditTagline(activeService.tagline || '');
      setEditShortDesc(activeService.shortDesc || '');
      setEditCategory(activeService.category);
      setIsEditingInfo(false);
    }
  }, [selectedServiceId, activeService]);

  // Handle Photo Upload from local storage / disk
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (!activeService) return;

    setIsUploadingPhoto(true);
    try {
      showToast('Optimizing Image...', 'Processing photo for high-speed cloud sync.', 'info');
      const compressedDataUrl = await compressImageFileOrDataUrl(file, 1280, 1280, 0.82);
      if (compressedDataUrl && activeService) {
        addServiceImage(activeService.id, compressedDataUrl);
        showToast('Image Uploaded & Synced', 'Photo optimized and synced live to cloud database.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Upload Error', 'Failed to process image file.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Photo Add via URL
  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim() || !activeService) return;
    addServiceImage(activeService.id, imageUrlInput.trim());
    setImageUrlInput('');
    showToast('Photo Added', 'New image added to catalog.', 'success');
  };

  // Duplicate / Clone a service in 1 click
  const handleDuplicateService = (srv: Service) => {
    const clonedData = {
      title: `${srv.title} (Copy)`,
      tagline: srv.tagline ? `${srv.tagline} (Copy)` : '',
      shortDesc: srv.shortDesc || 'Professional event service by SBL Events.',
      fullDesc: srv.fullDesc || srv.shortDesc || 'Full professional event production service provided by SBL Events.',
      category: srv.category,
      basePrice: srv.basePrice || 1500000,
      priceUnit: srv.priceUnit || 'Event',
      capacityOrScale: srv.capacityOrScale || '500+ Guests',
      image: srv.image,
      features: srv.features ? [...srv.features] : ['Standard Rigging Setup'],
      galleryImages: srv.galleryImages ? [...srv.galleryImages] : [],
      videos: srv.videos ? [...srv.videos] : [],
      specs: srv.specs ? [...srv.specs] : [{ label: 'Standard', value: 'SBL Rigging Crew' }],
      packages: srv.packages ? [...srv.packages] : undefined,
      b2bAvailable: srv.b2bAvailable ?? true,
    };
    addService(clonedData);
    showToast('Service Cloned', `Created duplicate of "${srv.title}".`, 'success');
  };

  // Quick Price adjustment handlers
  const openQuickPriceModal = (srv: Service) => {
    setQuickPriceService(srv);
    setQuickPriceValue(srv.basePrice || srv.packages?.[0]?.price || 1500000);
  };

  const saveQuickPrice = () => {
    if (!quickPriceService) return;
    updateService(quickPriceService.id, { basePrice: quickPriceValue });
    showToast('Price Updated', `${quickPriceService.title} updated to UGX ${quickPriceValue.toLocaleString()}`, 'success');
    setQuickPriceService(null);
  };

  // Copy Image Link to Clipboard
  const handleCopyImageLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Link Copied', 'Image URL copied to clipboard.', 'info');
  };

  // Handle Video Add
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrlInput.trim() || !activeService) return;

    let detectedPlatform: 'tiktok' | 'youtube' | 'mp4' | 'other' = videoPlatformInput;
    const urlLower = videoUrlInput.toLowerCase();
    if (urlLower.includes('tiktok.com')) detectedPlatform = 'tiktok';
    else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) detectedPlatform = 'youtube';
    else if (urlLower.endsWith('.mp4')) detectedPlatform = 'mp4';

    addServiceVideo(activeService.id, {
      title: videoTitleInput.trim() || `${activeService.title} Video`,
      url: videoUrlInput.trim(),
      platform: detectedPlatform,
    });

    setVideoTitleInput('');
    setVideoUrlInput('');
    showToast('Video Attached', 'Video added to public marketplace showcase.', 'success');
  };

  // Handle Service Modal Save
  const handleSaveService = (serviceData: Partial<Service>) => {
    if (serviceToEdit) {
      updateService(serviceToEdit.id, serviceData);
      showToast('Service Updated', `"${serviceData.title}" updated in cloud catalog.`, 'success');
    } else {
      addService(serviceData as any);
      showToast('Service Created', `"${serviceData.title}" published to catalog.`, 'success');
    }
    setIsServiceModalOpen(false);
  };

  // Confirm delete service
  const confirmDeleteService = () => {
    if (serviceToDeleteId) {
      const srv = services.find((s) => s.id === serviceToDeleteId);
      deleteService(serviceToDeleteId);
      showToast('Service Deleted', `"${srv?.title || 'Service'}" removed from catalog.`, 'info');
      setServiceToDeleteId(null);
    }
  };

  // Save quick text edits
  const handleSaveQuickInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;
    updateService(activeService.id, {
      title: editTitle,
      tagline: editTagline,
      shortDesc: editShortDesc,
      category: editCategory,
    });
    setIsEditingInfo(false);
    showToast('Quick Info Saved', 'Service title and description updated.', 'success');
  };

  const formatUGX = (val?: number) => {
    return `UGX ${(val || 0).toLocaleString()}`;
  };

  const allImages = activeService ? [activeService.image, ...(activeService.galleryImages || [])].filter(Boolean) : [];
  const videos = activeService?.videos || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Controls */}
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
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Admin / Services & Media</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-300" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Service Media & Catalog Manager
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Real-time Firestore synchronizer: Any edit to images, prices, videos, or services immediately updates for all website visitors.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Jumia vs Studio View Switcher */}
            <div className="flex items-center p-1 bg-[#071326] rounded-xl border border-white/15 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('jumia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'jumia'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="View services as catalog cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'studio'
                    ? 'bg-white text-[#0F1F38] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Open uploader and multi-media editor"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Media Studio</span>
              </button>
            </div>

            <CloudSyncBadge compact={true} />

            <button
              type="button"
              onClick={() => {
                setServiceToEdit(null);
                setIsServiceModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>

            <button
              type="button"
              onClick={resetServicesToDefault}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-white/15"
              title="Restore original photos and catalogue"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
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
              placeholder="Search services by title, specs, features..."
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
              { id: 'tents', label: 'Tents' },
              { id: 'sound', label: 'Sound' },
              { id: 'lighting', label: 'Lighting' },
              { id: 'screens', label: 'Screens' },
              { id: 'production', label: 'Production' },
              { id: 'restrooms', label: 'Restrooms' },
              { id: 'b2b', label: 'B2B' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: JUMIA MARKETPLACE CARDS GRID */}
      {viewMode === 'jumia' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Public Catalog • Market View ({filteredServices.length} items)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Changes sync instantly to all site visitors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((srv) => {
              const photoCount = (srv.galleryImages?.length || 0) + (srv.image ? 1 : 0);
              const videoCount = srv.videos?.length || 0;
              const basePrice = srv.basePrice || (srv.packages?.[0]?.price) || 1500000;
              const slashedPrice = Math.round(basePrice * 1.25);
              const discountPercent = 20;

              return (
                <div 
                  key={srv.id}
                  className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
                >
                  {/* Jumia Media Showcase Header */}
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={srv.image} 
                      alt={srv.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setLightboxImageUrl(srv.image)}
                      title="Click to view full size"
                    />

                    {/* Official Blue Badge */}
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-br-xl shadow-xs tracking-wider flex items-center gap-1 z-10">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>OFFICIAL SBL</span>
                    </div>

                    {/* Media Counts Pill */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      <ImageIcon className="w-3 h-3 text-blue-400" />
                      <span>{photoCount}</span>
                      <span className="text-white/40">•</span>
                      <Video className="w-3 h-3 text-blue-400" />
                      <span>{videoCount}</span>
                    </div>

                    {/* Discount badge */}
                    <div className="absolute bottom-2 right-2 bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs z-10">
                      -{discountPercent}% OFF
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category & Status */}
                      <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <span>{srv.category.replace('-', ' ')}</span>
                        <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> In Stock
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {srv.title}
                      </h3>

                      {/* Tagline */}
                      {srv.tagline && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
                          {srv.tagline}
                        </p>
                      )}

                      {/* Ratings */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center text-blue-500 text-xs">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">4.9</span>
                        <span className="text-[11px] text-slate-400 font-mono">(42 verified)</span>
                      </div>
                    </div>

                    {/* Pricing Block with Quick Edit Trigger */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base sm:text-lg font-black text-blue-600 font-mono tracking-tight">
                            {formatUGX(basePrice)}
                          </span>
                          <span className="text-xs text-slate-400 line-through font-mono">
                            {formatUGX(slashedPrice)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openQuickPriceModal(srv)}
                          className="text-[11px] text-slate-400 hover:text-blue-600 font-bold px-1.5 py-0.5 rounded-md hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer"
                          title="Quickly adjust price"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Price</span>
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Official SBL Rigging Crew Included</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedServiceId(srv.id);
                          setViewMode('studio');
                          setMobileView('detail');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-2 rounded-xl shadow-xs flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
                        title="Add photos, videos and links"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Media Studio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setServiceToEdit(srv);
                          setIsServiceModalOpen(true);
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
                        title="Edit price and details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Specs</span>
                      </button>
                    </div>

                    {/* Practical Row: Clone & Delete */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleDuplicateService(srv)}
                        className="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Duplicate this service"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceToDeleteId(srv.id)}
                        className="text-slate-400 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="bg-[#0E1D35] p-8 rounded-2xl border border-white/10 text-center space-y-3">
              <Layers className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-white font-bold text-sm">No Services Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? `No services match "${searchQuery}". Try a different keyword.` : 'No services in this category.'}
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
        </div>
      )}

      {/* VIEW 2: STUDIO MEDIA & UPLOADER WORK AREA */}
      {viewMode === 'studio' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Services List (hidden on mobile when inspecting a service) */}
        <div className={`lg:col-span-4 bg-[#0E1D35] rounded-2xl border border-white/15 p-4 space-y-3 ${
          mobileView === 'detail' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10 text-xs font-bold text-slate-300">
            <span>All Services ({filteredServices.length})</span>
            <button
              type="button"
              onClick={() => {
                setServiceToEdit(null);
                setIsServiceModalOpen(true);
              }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredServices.map((srv) => {
              const isSelected = srv.id === selectedServiceId;
              const photoCount = (srv.galleryImages?.length || 0) + (srv.image ? 1 : 0);
              const videoCount = srv.videos?.length || 0;

              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setSelectedServiceId(srv.id);
                    setMobileView('detail');
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md text-white'
                      : 'bg-[#0A1830] border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  <img
                    src={srv.image}
                    alt={srv.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/15"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {srv.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs truncate">{srv.title}</h4>
                    <p className="text-[11px] text-amber-300/90 font-mono mt-0.5">
                      {formatUGX(srv.basePrice || srv.packages?.[0]?.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-[10px] text-slate-400 shrink-0">
                    <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-md">
                      <ImageIcon className="w-2.5 h-2.5 text-amber-400" />
                      {photoCount}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-md">
                      <Video className="w-2.5 h-2.5 text-blue-400" />
                      {videoCount}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Service Work Area */}
        <div className={`lg:col-span-8 bg-[#0E1D35] rounded-2xl border border-white/15 p-4 sm:p-6 space-y-6 ${
          mobileView === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>Back to All Services ({services.length})</span>
          </button>
          
          {/* Active Service Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Category: {activeService?.category?.toUpperCase()}
                </span>
                {activeService?.basePrice ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    UGX {activeService.basePrice.toLocaleString()} {activeService.priceUnit ? `/${activeService.priceUnit}` : ''}
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-white mt-1.5 font-['Outfit']">
                {activeService?.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">{activeService?.tagline}</p>
            </div>

            {/* Banner Quick Actions: Edit Specs, Duplicate, Delete */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setServiceToEdit(activeService);
                  setIsServiceModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Edit full service specifications, pricing, features and descriptions"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Full Specs</span>
              </button>

              <button
                type="button"
                onClick={() => activeService && handleDuplicateService(activeService)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Duplicate this service"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone</span>
              </button>

              <button
                type="button"
                onClick={() => activeService && setServiceToDeleteId(activeService.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors cursor-pointer"
                title="Delete this service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Media & Details Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#0A1830] p-1 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-white text-[#0F1F38] shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({allImages.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMediaTab === 'videos'
                  ? 'bg-white text-[#0F1F38] shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos ({videos.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('details')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMediaTab === 'details'
                  ? 'bg-white text-[#0F1F38] shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Quick Details</span>
            </button>
          </div>

          {/* TAB 1: PHOTOS & PICTURES */}
          {activeMediaTab === 'photos' && (
            <div className="space-y-6">
              
              {/* 1-Click Curated Presets Bar */}
              <div className="bg-[#0A1830] p-3.5 rounded-xl border border-white/15 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Curated Photo Presets (Add instantly to service)</span>
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {CURATED_SERVICE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => activeService && addServiceImage(activeService.id, preset.url)}
                      className="shrink-0 p-1.5 rounded-xl bg-[#0E1D35] hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-2 group"
                      title="Click to add this photo to service gallery"
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-8 h-8 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-white block max-w-[90px] truncate group-hover:text-amber-300">
                          {preset.title}
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold">+ Add Photo</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Photo Controls: Upload from Device & Add by URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Upload from Device / Drag-Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(true);
                  }}
                  onDragLeave={() => setIsDraggingPhoto(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processImageFile(file);
                  }}
                  className={`p-4 rounded-xl border border-dashed text-center space-y-3 transition-all ${
                    isDraggingPhoto ? 'border-amber-400 bg-amber-500/10' : 'border-white/20 bg-[#0A1830]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 text-blue-200 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {isUploadingPhoto ? 'Optimizing photo...' : 'Upload or Drag Photo Here'}
                    </h4>
                    <p className="text-[11px] text-slate-400">JPG, PNG, WebP automatically compressed for cloud</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                    id="service-file-upload"
                  />
                  <label
                    htmlFor="service-file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0F1F38] font-bold text-xs cursor-pointer shadow-md hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Image File</span>
                  </label>
                </div>

                {/* Add Photo via URL */}
                <form onSubmit={handleAddImageUrl} className="bg-[#0A1830] p-4 rounded-xl border border-white/15 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-200" />
                      <h4>Add Image by Web Link / URL</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Paste public photo URL to add to gallery</p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={!imageUrlInput.trim()}
                      className="w-full py-2 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo Link</span>
                    </button>
                  </div>
                </form>

              </div>

              {/* Photo Gallery Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>Current Attached Photos ({allImages.length})</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((imgUrl, index) => {
                    const isCover = imgUrl === activeService?.image;

                    return (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden border border-white/15 bg-[#0A1830] group aspect-4/3 flex flex-col justify-end"
                      >
                        <img
                          src={imgUrl}
                          alt={`${activeService?.title} ${index}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />

                        {isCover && (
                          <div className="absolute top-2 left-2 bg-[#0F1F38]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1 shadow-md">
                            <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                            <span>Cover</span>
                          </div>
                        )}

                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => setLightboxImageUrl(imgUrl)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer"
                          title="Zoom In"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-between gap-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => activeService && setServiceCoverImage(activeService.id, imgUrl)}
                              className="px-2 py-1 rounded-lg bg-white text-[#0F1F38] text-[10px] font-bold flex items-center gap-1 shadow-xs hover:bg-slate-100 cursor-pointer"
                              title="Set as Main Cover Photo"
                            >
                              <Star className="w-3 h-3" />
                              <span>Set Cover</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCopyImageLink(imgUrl)}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            title="Copy image link"
                          >
                            <Copy className="w-3 h-3" />
                          </button>

                          {allImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (!activeService) return;
                                const galleryIdx = (activeService.galleryImages || []).indexOf(imgUrl);
                                if (galleryIdx !== -1) {
                                  removeServiceImage(activeService.id, galleryIdx);
                                } else {
                                  const remaining = allImages.filter((img) => img !== imgUrl);
                                  if (remaining[0]) {
                                    setServiceCoverImage(activeService.id, remaining[0]);
                                  }
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 transition-colors cursor-pointer"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIDEOS & REELS */}
          {activeMediaTab === 'videos' && (
            <div className="space-y-6">
              
              {/* Add Video Form */}
              <form onSubmit={handleAddVideo} className="bg-[#0A1830] p-4 rounded-xl border border-white/15 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Video className="w-4 h-4 text-blue-200" />
                  <h4>Attach Video (TikTok, YouTube, MP4)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Video Title / Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Kwanjula Tent Drone Walkthrough"
                      value={videoTitleInput}
                      onChange={(e) => setVideoTitleInput(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Video Link / URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.tiktok.com/@sblofficial92/video/..."
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={!videoUrlInput.trim()}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Attach</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Videos Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Attached Videos ({videos.length})
                </h4>

                {videos.length === 0 ? (
                  <div className="bg-[#0A1830] p-8 rounded-xl border border-white/10 text-center space-y-2">
                    <Video className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">No videos attached to this service yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((vid, vIdx) => (
                      <div key={vIdx} className="bg-[#0A1830] border border-white/15 rounded-xl p-3.5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                            <Play className="w-5 h-5 fill-red-400" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{vid.title}</h5>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block mt-0.5">
                              {vid.platform}
                            </span>
                            <a
                              href={vid.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-300 hover:underline flex items-center gap-1 mt-1 truncate"
                            >
                              <span>Watch video</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => activeService && removeServiceVideo(activeService.id, vid.id || String(vIdx))}
                          className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-500 transition-colors cursor-pointer shrink-0"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: QUICK DETAILS FORM */}
          {activeMediaTab === 'details' && (
            <form onSubmit={handleSaveQuickInfo} className="bg-[#0A1830] p-5 rounded-xl border border-white/15 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-bold text-white text-sm">Quick Service Information</h4>
                <button
                  type="button"
                  onClick={() => {
                    setServiceToEdit(activeService);
                    setIsServiceModalOpen(true);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Open Full Specifications Modal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Service Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    <option value="tents">Tents & Canopies</option>
                    <option value="sound">Public Address & Sound</option>
                    <option value="lighting">Lighting & Illumination</option>
                    <option value="screens">LED Screens & Displays</option>
                    <option value="production">Full Event Production</option>
                    <option value="restrooms">Mobile Restrooms</option>
                    <option value="b2b">Corporate / B2B Solutions</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Tagline / Subheading</label>
                  <input
                    type="text"
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-slate-300 font-semibold">Short Description (Punchy)</label>
                  <textarea
                    rows={3}
                    value={editShortDesc}
                    onChange={(e) => setEditShortDesc(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Quick Info</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
      )}

      {/* Admin Service Modal for Full Specs, Pricing & Creating New Services */}
      <AdminServiceModal
        service={serviceToEdit}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
        formatUGX={(amount) => `UGX ${(amount || 0).toLocaleString()}`}
      />

      {/* QUICK PRICE ADJUSTER MODAL */}
      {quickPriceService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-2xl p-6 border border-white/20 bg-[#132644] text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Quick Price Adjuster
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickPriceService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300 font-semibold mb-1 truncate">
                {quickPriceService.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">UGX</span>
                <input
                  type="number"
                  step="50000"
                  value={quickPriceValue}
                  onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E1D35] border border-white/20 text-white font-mono font-bold text-lg focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick +/- Buttons */}
            <div className="flex flex-wrap gap-2">
              {[-500000, -100000, 100000, 500000, 1000000].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => setQuickPriceValue(prev => Math.max(100000, prev + delta))}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  {delta > 0 ? `+${(delta / 1000)}k` : `${(delta / 1000)}k`}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickPriceService(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveQuickPrice}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Price</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX ZOOM MODAL */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img
              src={lightboxImageUrl}
              alt="Zoomed Photo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Modal */}
      {serviceToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="max-w-md w-full rounded-2xl p-6 border border-red-500/30 bg-[#132644] text-white space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-400/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Delete Service from Catalog?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete this service? It will no longer appear on public website service pages or booking quotation checklists.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setServiceToDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel & Keep
              </button>
              <button
                type="button"
                onClick={confirmDeleteService}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
              >
                Yes, Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
