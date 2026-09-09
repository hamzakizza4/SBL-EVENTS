import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Save, 
  Sparkles, 
  ExternalLink, 
  Image as ImageIcon, 
  Layers, 
  Star, 
  Video, 
  Calendar, 
  Check, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdminContentSync } from '../context/AdminContentSyncContext';

export const AdminCardEditModal: React.FC = () => {
  const { 
    cardEditorItem, 
    closeCardEditor, 
    showToast, 
    setCurrentPage, 
    updateTestimonial, 
    updateEventCategory, 
    updateCalendarEvent,
    eventCategories
  } = useApp();

  const {
    updateService,
    updateGalleryItem,
    updateVideoReel
  } = useAdminContentSync();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cardEditorItem && cardEditorItem.data) {
      setFormData({ ...cardEditorItem.data });
    } else {
      setFormData({});
    }
  }, [cardEditorItem]);

  if (!cardEditorItem) return null;

  const { type, data } = cardEditorItem;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenInAdminConsole = () => {
    closeCardEditor();
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (type === 'service') {
        const updates = {
          title: formData.title || data.title,
          category: formData.category || data.category,
          shortDesc: formData.shortDesc ?? data.shortDesc,
          description: formData.description ?? data.description,
          basePrice: Number(formData.basePrice) || data.basePrice,
          image: formData.image || data.image,
          capacity: formData.capacity ?? data.capacity,
          popular: formData.popular ?? data.popular,
          b2bAvailable: formData.b2bAvailable ?? data.b2bAvailable
        };
        await updateService(data.id, updates);
        showToast('Service Card Updated', `"${updates.title}" changes saved and live synced.`, 'success');
      } else if (type === 'gallery') {
        const updates = {
          title: formData.title || data.title,
          category: formData.category || data.category,
          image: formData.image || data.image,
          location: formData.location || data.location,
          desc: formData.desc || data.desc
        };
        await updateGalleryItem(data.id, updates);
        showToast('Gallery Card Updated', `"${updates.title}" showcase updated live.`, 'success');
      } else if (type === 'reel') {
        const updates = {
          title: formData.title || data.title,
          category: formData.category || data.category,
          thumbnail: formData.thumbnail || data.thumbnail,
          videoUrl: formData.videoUrl || data.videoUrl,
          badge: formData.badge || data.badge,
          viewsCount: formData.viewsCount || data.viewsCount,
          likesCount: formData.likesCount || data.likesCount,
          description: formData.description || data.description
        };
        await updateVideoReel(data.id, updates);
        showToast('TikTok Reel Updated', `"${updates.title}" reel saved and live synced.`, 'success');
      } else if (type === 'testimonial') {
        const updates = {
          author: formData.author || data.author,
          role: formData.role || data.role,
          eventType: formData.eventType || data.eventType,
          rating: Number(formData.rating) || data.rating,
          content: formData.content || data.content,
          location: formData.location || data.location,
          verified: formData.verified ?? data.verified
        };
        updateTestimonial(data.id, updates);
        showToast('Testimonial Updated', `Review from "${updates.author}" updated.`, 'success');
      } else if (type === 'category') {
        const updates = {
          name: formData.name || data.name,
          tagline: formData.tagline || data.tagline,
          description: formData.description || data.description,
          image: formData.image || data.image,
          startingPrice: Number(formData.startingPrice) || data.startingPrice
        };
        updateEventCategory(data.id, updates);
        showToast('Category Card Updated', `Category "${updates.name}" saved.`, 'success');
      } else if (type === 'event') {
        const updates = {
          title: formData.title || data.title,
          date: formData.date || data.date,
          category: formData.category || data.category,
          location: formData.location || data.location,
          clientName: formData.clientName || data.clientName,
          status: formData.status || data.status
        };
        updateCalendarEvent({ ...data, ...updates });
        showToast('Calendar Event Updated', `Event "${updates.title}" updated on schedule.`, 'success');
      }

      closeCardEditor();
    } catch (err) {
      console.error('[AdminCardEditModal] Save error:', err);
      showToast('Update Failed', 'An error occurred while saving card changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'service':
        return {
          label: 'Service Card',
          icon: <Layers className="w-4 h-4 text-amber-400" />,
          accent: 'border-amber-500/40 text-amber-300'
        };
      case 'gallery':
        return {
          label: 'Gallery Showcase Card',
          icon: <ImageIcon className="w-4 h-4 text-sky-400" />,
          accent: 'border-sky-500/40 text-sky-300'
        };
      case 'reel':
        return {
          label: 'TikTok Video Reel Card',
          icon: <Video className="w-4 h-4 text-pink-400" />,
          accent: 'border-pink-500/40 text-pink-300'
        };
      case 'testimonial':
        return {
          label: 'Client Review Card',
          icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />,
          accent: 'border-yellow-500/40 text-yellow-300'
        };
      case 'category':
        return {
          label: 'Event Category Card',
          icon: <Tag className="w-4 h-4 text-emerald-400" />,
          accent: 'border-emerald-500/40 text-emerald-300'
        };
      case 'event':
        return {
          label: 'Calendar Event Card',
          icon: <Calendar className="w-4 h-4 text-indigo-400" />,
          accent: 'border-indigo-500/40 text-indigo-300'
        };
      default:
        return {
          label: 'Card Item',
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          accent: 'border-amber-500/40 text-amber-300'
        };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <AnimatePresence>
      <div 
        id="admin-card-edit-modal-root"
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md"
        onClick={closeCardEditor}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl bg-[#0d1829] border border-amber-500/30 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-[#070e1a] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border text-[11px] font-bold ${typeInfo.accent}`}>
                  {typeInfo.icon}
                  <span>{typeInfo.label}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  ID: {data.id}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Quick Edit Card
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Changes persist directly to Cloud Firestore &amp; update across all views instantly.
              </p>
            </div>

            <button
              onClick={closeCardEditor}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[68vh] overflow-y-auto custom-scrollbar">
            
            {/* Title / Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {type === 'testimonial' ? 'Client / Author Name' : type === 'category' ? 'Category Name' : 'Card Title'}
              </label>
              <input
                type="text"
                required
                value={type === 'testimonial' ? formData.author || '' : type === 'category' ? formData.name || '' : formData.title || ''}
                onChange={(e) => handleInputChange(type === 'testimonial' ? 'author' : type === 'category' ? 'name' : 'title', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                placeholder="Enter title or name..."
              />
            </div>

            {/* Service Specific Fields */}
            {type === 'service' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Mega Tents, Sound & AV"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Base Price (UGX)
                    </label>
                    <input
                      type="number"
                      value={formData.basePrice ?? ''}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. 5000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Short Description / Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDesc || ''}
                    onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs leading-relaxed focus:outline-none transition-colors resize-none"
                    placeholder="Brief highlight displayed on the card..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Capacity / Spec
                    </label>
                    <input
                      type="text"
                      value={formData.capacity || ''}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. 500-1,500 Guests"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.b2bAvailable)}
                        onChange={(e) => handleInputChange('b2bAvailable', e.target.checked)}
                        className="rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-amber-400"
                      />
                      <span>B2B Hire Available</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Gallery Specific Fields */}
            {type === 'gallery' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Corporate, Concert, Wedding"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Kololo Airstrip, Kampala"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Description / Highlight
                  </label>
                  <textarea
                    rows={2}
                    value={formData.desc || ''}
                    onChange={(e) => handleInputChange('desc', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs leading-relaxed focus:outline-none transition-colors resize-none"
                    placeholder="Details about this production deployment..."
                  />
                </div>
              </>
            )}

            {/* TikTok Reel Specific Fields */}
            {type === 'reel' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => handleInputChange('badge', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Trending, Live Setup"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Views Count
                    </label>
                    <input
                      type="text"
                      value={formData.viewsCount || ''}
                      onChange={(e) => handleInputChange('viewsCount', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. 142.5K"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Video / TikTok URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl || ''}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs font-mono focus:outline-none transition-colors"
                    placeholder="https://www.tiktok.com/@sblevents/video/..."
                  />
                </div>
              </>
            )}

            {/* Testimonial Specific Fields */}
            {type === 'testimonial' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Role / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Bride, Head of Production"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Event Type
                    </label>
                    <input
                      type="text"
                      value={formData.eventType || ''}
                      onChange={(e) => handleInputChange('eventType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. Luxury Wedding, Concert"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleInputChange('rating', star)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            (Number(formData.rating) || 5) >= star 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-600'
                          }`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-2">
                      {formData.rating || 5} Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Review Content
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs leading-relaxed focus:outline-none transition-colors resize-none"
                    placeholder="Client feedback text..."
                  />
                </div>
              </>
            )}

            {/* Calendar Event Specific Fields */}
            {type === 'event' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Client / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.clientName || ''}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                      placeholder="e.g. MTN Uganda"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-sm font-semibold focus:outline-none transition-colors"
                    placeholder="e.g. Speke Resort Munyonyo"
                  />
                </div>
              </>
            )}

            {/* Image / Thumbnail URL with Live Preview */}
            {type !== 'testimonial' && type !== 'event' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {type === 'reel' ? 'Thumbnail Image URL' : 'Display Image URL'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={type === 'reel' ? formData.thumbnail || '' : formData.image || ''}
                    onChange={(e) => handleInputChange(type === 'reel' ? 'thumbnail' : 'image', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 focus:border-amber-400 text-white text-xs font-mono focus:outline-none transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {(formData.image || formData.thumbnail) && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-black shrink-0">
                      <img
                        src={type === 'reel' ? formData.thumbnail : formData.image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleOpenInAdminConsole}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 py-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Full Admin Console</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeCardEditor}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
