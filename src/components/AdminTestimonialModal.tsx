import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial, EventType } from '../types';
import { 
  X, 
  ArrowLeft, 
  Save, 
  Star, 
  User, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

interface AdminTestimonialModalProps {
  testimonial?: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Testimonial, 'id' | 'date'>, id?: string) => void;
}

export const AdminTestimonialModal: React.FC<AdminTestimonialModalProps> = ({
  testimonial,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!testimonial;

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Client');
  const [companyOrEvent, setCompanyOrEvent] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [approved, setApproved] = useState(true);
  const [verified, setVerified] = useState(true);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setAuthor(testimonial.author);
      setRole(testimonial.role || 'Client');
      setCompanyOrEvent(testimonial.companyOrEvent);
      setContent(testimonial.content);
      setRating(testimonial.rating || 5);
      setEventType(testimonial.eventType || 'wedding');
      setApproved(testimonial.approved ?? true);
      setVerified(testimonial.verified ?? true);
      setFeatured(testimonial.featured ?? false);
    } else {
      setAuthor('');
      setRole('Client');
      setCompanyOrEvent('');
      setContent('');
      setRating(5);
      setEventType('wedding');
      setApproved(true);
      setVerified(true);
      setFeatured(false);
    }
  }, [testimonial, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: Omit<Testimonial, 'id' | 'date'> = {
      author: author.trim(),
      role: role.trim() || 'Client',
      companyOrEvent: companyOrEvent.trim(),
      content: content.trim(),
      rating,
      eventType,
      approved,
      verified,
      featured,
    };

    onSave(reviewData, testimonial?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-xl bg-[#0F1F38] border border-white/20 rounded-3xl shadow-2xl text-white overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#132644] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-colors cursor-pointer group"
                title="Back without saving"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {isEditing ? 'Edit Client Review' : 'Add Client Review'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isEditing ? `Modifying review by ${testimonial?.author}` : 'Log feedback received via WhatsApp or phone call'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
            {/* Rating Stars Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Client Star Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#091222] border border-white/20 w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 rounded-lg hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono font-bold text-amber-300 text-sm">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client / Author Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    placeholder="e.g. Dr. Arthur & Grace Mugisha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  placeholder="e.g. Groom & Bride / Event Lead"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Company or Event Title *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={companyOrEvent}
                    onChange={(e) => setCompanyOrEvent(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                    placeholder="e.g. Speke Resort Munyonyo Wedding"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Event Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                >
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="concert">Concert / Festival</option>
                  <option value="introduction">Introduction / Kwanjula</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="b2b_dry_hire">B2B Sub-Rental</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Review Feedback / Quote *
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm leading-relaxed"
                  placeholder="Paste or write the client review feedback here..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1528] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-amber-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-white block">Published on Website</span>
                  <span className="text-[11px] text-slate-400">Visible to public website visitors</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B1528] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-amber-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-xs text-white block">Featured Review</span>
                  <span className="text-[11px] text-slate-400">Highlighted in top homepage carousel</span>
                </div>
              </label>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 sticky bottom-0 bg-[#0F1F38]/95 backdrop-blur-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel & Back
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-[#0E1D35] font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Review' : 'Add Review'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
