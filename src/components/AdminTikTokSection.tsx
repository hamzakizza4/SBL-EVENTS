import React, { useState } from 'react';
import { useAdminContentSync } from '../context/AdminContentSyncContext';
import { useApp } from '../context/AppContext';
import { VideoReel, TikTokSectionConfig } from '../types';
import { 
  Film, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  Eye, 
  Check, 
  RotateCcw, 
  Save, 
  Radio, 
  Flame, 
  Share2, 
  Tag, 
  X,
  AlertCircle,
  Video,
  Clock,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithSkeleton } from './ImageWithSkeleton';

export const AdminTikTokSection: React.FC = () => {
  const { 
    videoReels, 
    tiktokConfig, 
    addVideoReel, 
    updateVideoReel, 
    deleteVideoReel, 
    resetVideoReelsToDefault,
    updateTikTokConfig,
    resetTikTokConfigToDefault,
    isSyncing 
  } = useAdminContentSync();

  const { showToast } = useApp();

  // Local state for Section Settings editing
  const [configForm, setConfigForm] = useState<TikTokSectionConfig>(tiktokConfig);
  const [isConfigDirty, setIsConfigDirty] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Filter and Search for Reels
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<VideoReel | null>(null);
  const [reelForm, setReelForm] = useState<Partial<VideoReel>>({
    title: '',
    category: 'Dome Tents',
    thumbnail: '',
    videoUrl: '',
    duration: '0:45',
    viewsCount: '15.2K',
    likesCount: '1.8K',
    badge: 'Trending Live',
    tiktokHandle: '@sbleventsug',
    description: '',
    audioTranscriptNotes: ''
  });

  const [deleteTargetReel, setDeleteTargetReel] = useState<VideoReel | null>(null);
  const [previewReel, setPreviewReel] = useState<VideoReel | null>(null);

  // Sync config form with state changes from context
  React.useEffect(() => {
    setConfigForm(tiktokConfig);
    setIsConfigDirty(false);
  }, [tiktokConfig]);

  const handleConfigChange = (field: keyof TikTokSectionConfig, value: any) => {
    setConfigForm((prev) => ({ ...prev, [field]: value }));
    setIsConfigDirty(true);
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    try {
      await updateTikTokConfig(configForm);
      setIsConfigDirty(false);
      showToast('TikTok Hub Saved', 'Live showcase configuration updated and synchronized.', 'success');
    } catch (err) {
      showToast('Error', 'Failed to save TikTok section settings.', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleResetConfig = async () => {
    if (window.confirm('Reset TikTok Section title, subtitle, and badges back to original defaults?')) {
      await resetTikTokConfigToDefault();
      showToast('Defaults Restored', 'TikTok showcase content reset to factory defaults.', 'info');
    }
  };

  const openAddReelModal = () => {
    setEditingReel(null);
    setReelForm({
      title: '',
      category: 'Dome Tents',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      videoUrl: configForm.profileUrl || 'https://www.tiktok.com/@sbleventsug',
      duration: '0:45',
      viewsCount: '10.5K',
      likesCount: '1.2K',
      badge: 'Uganda Rigging',
      tiktokHandle: configForm.tiktokHandle || '@sbleventsug',
      description: '',
      audioTranscriptNotes: ''
    });
    setIsAddEditModalOpen(true);
  };

  const openEditReelModal = (reel: VideoReel) => {
    setEditingReel(reel);
    setReelForm({ ...reel });
    setIsAddEditModalOpen(true);
  };

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.title?.trim()) {
      showToast('Validation Error', 'Please enter a video reel title.', 'error');
      return;
    }

    try {
      if (editingReel) {
        await updateVideoReel(editingReel.id, reelForm);
        showToast('Video Reel Updated', `"${reelForm.title}" has been saved.`, 'success');
      } else {
        await addVideoReel({
          title: reelForm.title || 'SBL Event Live Highlight',
          category: reelForm.category || 'Dome Tents',
          thumbnail: reelForm.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
          videoUrl: reelForm.videoUrl || configForm.profileUrl || configForm.tiktokUrl,
          tiktokUrl: reelForm.tiktokUrl || reelForm.videoUrl || configForm.tiktokUrl || 'https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/',
          duration: reelForm.duration || '0:30',
          viewsCount: reelForm.viewsCount || '10K',
          likesCount: reelForm.likesCount || '1K',
          badge: reelForm.badge || 'Uganda Rigging',
          tiktokHandle: reelForm.tiktokHandle || configForm.tiktokHandle || '@sbleventsug',
          hotline: reelForm.hotline || configForm.hotline || '0752420911',
          location: reelForm.location || 'Masaka & Lwengo Depot, Uganda',
          equipmentHighlights: reelForm.equipmentHighlights || ['Mega Tent Rigging', 'Line Array Sound', 'Moving Beams'],
          description: reelForm.description || '',
          audioTranscriptNotes: reelForm.audioTranscriptNotes || ''
        });
        showToast('Video Reel Created', 'New TikTok clip added to the live showcase.', 'success');
      }
      setIsAddEditModalOpen(false);
    } catch (err) {
      showToast('Save Error', 'Failed to save video reel.', 'error');
    }
  };

  const handleDeleteReel = async () => {
    if (!deleteTargetReel) return;
    try {
      await deleteVideoReel(deleteTargetReel.id);
      showToast('Reel Removed', `"${deleteTargetReel.title}" deleted from TikTok hub.`, 'warning');
      setDeleteTargetReel(null);
    } catch (err) {
      showToast('Delete Error', 'Failed to remove reel.', 'error');
    }
  };

  const handleResetReels = async () => {
    if (window.confirm('Reset all TikTok video reels back to initial Ugandan event showcase reels?')) {
      await resetVideoReelsToDefault();
      showToast('Reels Reset', 'Original showcase video reels restored.', 'info');
    }
  };

  const categories = ['all', ...Array.from(new Set(videoReels.map((r) => r.category || 'General')))];

  const filteredReels = videoReels.filter((reel) => {
    const matchesSearch = 
      reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reel.description && reel.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (reel.category && reel.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || reel.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 text-white">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#132644] border border-white/15 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Editable TikTok Live Hub & Reels</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
            "Experience SBL Live on TikTok" Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Customize the live TikTok showcase section on the homepage. Edit titles, badge text, follower counters, profile links, and manage all showcase video reels with instant cloud synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={openAddReelModal}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Reel</span>
          </button>

          <button
            type="button"
            onClick={handleResetReels}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset video reels to original factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Reels</span>
          </button>

          <a
            href={configForm.profileUrl || 'https://www.tiktok.com/@sbleventsug'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/40 text-pink-200 border border-pink-400/40 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Live Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION 1: SECTION COPY & CONFIGURATION EDITOR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1D35] border border-white/15 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Homepage Showcase Settings
              </h3>
              <p className="text-xs text-slate-300">
                These controls edit the headlines, badges, and links displayed directly to visitors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetConfig}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Reset Copy Defaults
            </button>
            <button
              type="button"
              onClick={() => handleSaveConfig()}
              disabled={!isConfigDirty && !isSavingConfig}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isConfigDirty
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black ring-2 ring-amber-300/50 active:scale-95'
                  : 'bg-emerald-600 text-white opacity-80'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingConfig ? 'Saving...' : isConfigDirty ? 'Save Changes' : 'Saved'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Main Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Section Main Title</span>
              <span className="text-[10px] text-slate-400 font-mono">Displayed as H2 headline</span>
            </label>
            <input
              type="text"
              value={configForm.title}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              placeholder="Experience SBL Live on TikTok"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-300">
              Section Subtitle & Highlights Description
            </label>
            <textarea
              rows={2}
              value={configForm.subtitle}
              onChange={(e) => handleConfigChange('subtitle', e.target.value)}
              placeholder="Watch real live setups in Masaka, Lwengo & across Uganda..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Badge Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Badge Label Text
            </label>
            <input
              type="text"
              value={configForm.badgeText || ''}
              onChange={(e) => handleConfigChange('badgeText', e.target.value)}
              placeholder="Official TikTok Hub • 70,000+ Impressions"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* TikTok Handle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              TikTok Handle
            </label>
            <input
              type="text"
              value={configForm.tiktokHandle}
              onChange={(e) => handleConfigChange('tiktokHandle', e.target.value)}
              placeholder="@sbleventsug"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* TikTok Profile URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Official TikTok Link / Profile URL</span>
              <span className="text-[10px] text-slate-400 font-mono">Visitors will jump here when clicking "Visit"</span>
            </label>
            <input
              type="url"
              value={configForm.profileUrl}
              onChange={(e) => handleConfigChange('profileUrl', e.target.value)}
              placeholder="https://vm.tiktok.com/ZS9BfEAJpnj3Y-51DZa/"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Stats: Followers & Likes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Followers Counter Label
            </label>
            <input
              type="text"
              value={configForm.followersCount || ''}
              onChange={(e) => handleConfigChange('followersCount', e.target.value)}
              placeholder="48.5K+ Followers"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Likes Counter Label
            </label>
            <input
              type="text"
              value={configForm.likesCount || ''}
              onChange={(e) => handleConfigChange('likesCount', e.target.value)}
              placeholder="340K+ Likes"
              className="w-full px-4 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Live Now Toggle */}
          <div className="p-4 rounded-2xl bg-[#132644] border border-white/10 flex items-center justify-between md:col-span-2">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${configForm.isLiveNow ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
              <div>
                <span className="text-xs font-bold text-white block">
                  Broadcast "Live Now on TikTok" Status Badge
                </span>
                <span className="text-[11px] text-slate-300">
                  Activates glowing red live broadcast indicator on the homepage when crews are streaming from events.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleConfigChange('isLiveNow', !configForm.isLiveNow)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                configForm.isLiveNow
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {configForm.isLiveNow ? 'LIVE ON' : 'OFFLINE'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: VIDEO REELS MANAGEMENT & REEL LIST */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Video Reels Showcase ({videoReels.length} Clips)
            </h3>
            <p className="text-xs text-slate-300">
              Add, edit, or remove showcase reels that appear in the 4-column video carousel.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search reels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#132644] border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-40 sm:w-52"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#132644] border border-white/20 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0F1F38] text-white capitalize">
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredReels.map((reel) => (
            <div
              key={reel.id}
              className="p-3 rounded-2xl bg-[#0E1D35] border border-white/15 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3 group shadow-lg"
            >
              {/* Thumbnail Container */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-black">
                <ImageWithSkeleton
                  src={reel.thumbnail}
                  alt={reel.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  icon={<Film className="w-5 h-5 text-pink-400" />}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px]">
                  <span className="bg-rose-600/90 text-white px-2 py-0.5 rounded-full font-black">
                    {reel.badge || 'Showcase'}
                  </span>
                  <span className="bg-black/80 text-slate-200 px-1.5 py-0.5 rounded font-mono font-bold">
                    {reel.duration}
                  </span>
                </div>

                {/* Play Preview overlay */}
                <button
                  type="button"
                  onClick={() => setPreviewReel(reel)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </button>

                {/* Bottom stats */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Flame className="w-3 h-3" />
                    {reel.viewsCount}
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{reel.category || 'Reel'}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                  {reel.title}
                </h4>
                {reel.description && (
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {reel.description}
                  </p>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
                <a
                  href={reel.videoUrl || configForm.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] px-2 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 font-bold flex items-center gap-1"
                  title="Open video on TikTok"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditReelModal(reel)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Edit Reel"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTargetReel(reel)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors cursor-pointer"
                    title="Delete Reel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReels.length === 0 && (
            <div className="col-span-full text-center py-12 p-6 rounded-2xl bg-[#0E1D35] border border-white/10 space-y-3">
              <Film className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="font-bold text-white text-sm">No video reels match your search</h4>
              <p className="text-xs text-slate-400">Try clearing filters or click below to add a new reel.</p>
              <button
                type="button"
                onClick={openAddReelModal}
                className="px-4 py-2 rounded-xl bg-white text-[#0F1F38] text-xs font-bold cursor-pointer"
              >
                Add New Reel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT REEL MODAL */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsAddEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0F1F38] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-black text-white">
                    {editingReel ? 'Edit TikTok Video Reel' : 'Add New TikTok Video Reel'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveReel} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Video Title *</label>
                  <input
                    type="text"
                    required
                    value={reelForm.title || ''}
                    onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                    placeholder="e.g. Kwanjula Mega Canopy Rigging Masaka"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#132644] border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Category</label>
                    <select
                      value={reelForm.category || 'Dome Tents'}
                      onChange={(e) => setReelForm({ ...reelForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Dome Tents">Dome Tents</option>
                      <option value="Sound System">Sound System</option>
                      <option value="Lighting & FX">Lighting & FX</option>
                      <option value="Bridal Decor">Bridal Decor</option>
                      <option value="LED Video Walls">LED Video Walls</option>
                      <option value="Live Kwanjula">Live Kwanjula</option>
                      <option value="Corporate Events">Corporate Events</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Badge Label</label>
                    <input
                      type="text"
                      value={reelForm.badge || ''}
                      onChange={(e) => setReelForm({ ...reelForm, badge: e.target.value })}
                      placeholder="e.g. Uganda Rigging"
                      className="w-full px-3 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Cover Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={reelForm.thumbnail || ''}
                    onChange={(e) => setReelForm({ ...reelForm, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  {reelForm.thumbnail && (
                    <div className="h-28 rounded-xl overflow-hidden border border-white/20 mt-1 bg-black">
                      <img
                        src={reelForm.thumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">TikTok Direct Clip URL</label>
                  <input
                    type="url"
                    value={reelForm.videoUrl || ''}
                    onChange={(e) => setReelForm({ ...reelForm, videoUrl: e.target.value })}
                    placeholder="https://www.tiktok.com/@sbleventsug/video/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Duration, Views, Likes */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Duration</label>
                    <input
                      type="text"
                      value={reelForm.duration || ''}
                      onChange={(e) => setReelForm({ ...reelForm, duration: e.target.value })}
                      placeholder="0:45"
                      className="w-full px-2.5 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Views Counter</label>
                    <input
                      type="text"
                      value={reelForm.viewsCount || ''}
                      onChange={(e) => setReelForm({ ...reelForm, viewsCount: e.target.value })}
                      placeholder="18.5K"
                      className="w-full px-2.5 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Likes Counter</label>
                    <input
                      type="text"
                      value={reelForm.likesCount || ''}
                      onChange={(e) => setReelForm({ ...reelForm, likesCount: e.target.value })}
                      placeholder="2.4K"
                      className="w-full px-2.5 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Caption / Description</label>
                  <textarea
                    rows={2}
                    value={reelForm.description || ''}
                    onChange={(e) => setReelForm({ ...reelForm, description: e.target.value })}
                    placeholder="Short description of equipment deployed..."
                    className="w-full px-3 py-2 rounded-xl bg-[#132644] border border-white/20 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-bold shadow-md cursor-pointer active:scale-95"
                  >
                    {editingReel ? 'Save Updates' : 'Add Reel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE REEL CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTargetReel && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setDeleteTargetReel(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0F1F38] border border-red-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Delete Video Reel?</h3>
                  <p className="text-xs text-slate-300">This reel will be removed from the live homepage showcase.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                <span className="font-bold text-white block">{deleteTargetReel.title}</span>
                <span className="text-slate-400 font-mono">{deleteTargetReel.category} • {deleteTargetReel.duration}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetReel(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteReel}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK PREVIEW MODAL */}
      <AnimatePresence>
        {previewReel && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewReel(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0F1F38] border border-white/20 rounded-3xl p-5 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <span className="text-xs font-bold text-cyan-300">{previewReel.category}</span>
                <button
                  onClick={() => setPreviewReel(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden bg-black">
                <img
                  src={previewReel.thumbnail}
                  alt={previewReel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <h4 className="font-extrabold text-sm text-white">{previewReel.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{previewReel.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewReel(null)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold"
                >
                  Close Preview
                </button>
                <a
                  href={previewReel.videoUrl || configForm.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span>Open on TikTok</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
