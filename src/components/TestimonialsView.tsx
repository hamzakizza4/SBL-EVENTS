import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventType } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  MessageSquareQuote, 
  Star, 
  ShieldCheck, 
  Plus, 
  Filter, 
  X, 
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsView: React.FC = () => {
  const { testimonials, addTestimonial, theme } = useApp();
  const t = getThemeClasses(theme);

  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Submit Review Form State
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [companyOrEvent, setCompanyOrEvent] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [eventType, setEventType] = useState<EventType>('wedding');

  const filteredReviews = testimonials.filter((test) => {
    if (!test.approved && !test.featured) return false;
    if (filterType === 'all') return true;
    return test.eventType === filterType;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || !companyOrEvent.trim()) return;

    addTestimonial({
      author,
      role: role || 'Event Host',
      companyOrEvent,
      content,
      rating,
      eventType,
      image: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=300&q=80`,
    });

    setAuthor('');
    setRole('');
    setCompanyOrEvent('');
    setContent('');
    setRating(5);
    setIsSubmitModalOpen(false);
  };

  return (
    <div id="testimonials-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
          <MessageSquareQuote className="w-4 h-4 text-blue-300" />
          <span>Real Client Stories & Trust</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
          What Our Clients & Partners Say
        </h1>
        <p className={`text-xs sm:text-base leading-relaxed ${t.mutedText}`}>
          From glamorous weddings and international corporate galas to peer event planners using our B2B tent lending service, hear directly from those who trusted SBL Events.
        </p>
      </div>

      {/* Filter and Submit Row */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border ${t.cardBg} ${t.cardBorder} shadow-xl`}>
        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'wedding', label: 'Weddings' },
            { id: 'corporate', label: 'Corporate Galas' },
            { id: 'concert', label: 'Concerts & Stages' },
            { id: 'b2b-lending', label: 'B2B Tent Lending' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterType === f.id
                  ? 'bg-white text-[#0F1F38] border-white font-bold shadow-md'
                  : 'bg-[#152A4A] text-slate-200 border-white/15 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Testimonial</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((test) => (
          <div
            key={test.id}
            className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-300">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white uppercase bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  {test.eventType}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{test.content}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <img
                src={test.image}
                alt={test.author}
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">{test.author}</h4>
                <p className="text-[11px] text-blue-300 font-semibold">{test.role}</p>
                <p className="text-[10px] text-slate-400">{test.companyOrEvent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT REVIEW MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full rounded-3xl p-6 sm:p-8 bg-[#132644] text-white border border-white/20 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div>
                  <h3 className="text-xl font-bold font-['Outfit']">Share Your SBL Events Experience</h3>
                  <p className="text-xs text-slate-300">Your feedback helps future clients plan with confidence.</p>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Your Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Bride / Event Director"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Company or Event Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins Wedding / Tech Summit"
                      value={companyOrEvent}
                      onChange={(e) => setCompanyOrEvent(e.target.value)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-200">Event Category</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white focus:outline-hidden focus:border-white"
                    >
                      <option value="wedding">Luxury Wedding</option>
                      <option value="corporate">Corporate Gala / Expo</option>
                      <option value="concert">Concert / Stage Festival</option>
                      <option value="b2b-lending">B2B Tent Lending</option>
                      <option value="private">Private Celebration</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Overall Rating (1 - 5 Stars)</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-300"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-300' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-300 ml-2 font-bold">{rating} out of 5</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Your Review & Comments *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the tent setup, sound clarity, MC performance, or overall execution..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#0E1D35] border border-white/20 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-white/20 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
