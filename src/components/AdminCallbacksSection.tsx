import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CallbackRequest } from '../types';
import { 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Search, 
  Phone, 
  MessageCircle, 
  Calendar,
  AlertCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminCallbacksSection: React.FC = () => {
  const { callbackRequests, updateCallbackStatus, deleteCallbackRequest, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCallbacks = callbackRequests.filter((cb) => {
    const matchesStatus = filterStatus === 'all' || cb.status === filterStatus;
    const matchesSearch = 
      cb.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.phone.includes(searchQuery) ||
      (cb.eventInterest && cb.eventInterest.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cb.notes && cb.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = callbackRequests.filter(cb => cb.status === 'pending').length;
  const calledCount = callbackRequests.filter(cb => cb.status === 'called').length;
  const convertedCount = callbackRequests.filter(cb => cb.status === 'converted').length;

  const getWhatsAppLink = (phone: string, clientName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '256' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('256') && cleanPhone.length === 9) {
      formattedPhone = '256' + cleanPhone;
    }
    const text = encodeURIComponent(
      `Hello ${clientName}, this is the production team at SBL Events in Lwengo following up on your callback request. How can we assist you with your upcoming event?`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  return (
    <div id="admin-callbacks-section" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-white/15 bg-[#132644] text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Live Dispatch Callback Queue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Client Callback Requests
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Inquiries and callback requests submitted from the website are instantly queued here for immediate dispatch and WhatsApp outreach from Lwengo headquarters.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 bg-[#0E1D35] px-4 py-3 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pending</span>
            <span className="text-lg font-black text-amber-300">{pendingCount}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Called</span>
            <span className="text-lg font-black text-blue-300">{calledCount}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Converted</span>
            <span className="text-lg font-black text-emerald-300">{convertedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#132644] p-4 rounded-2xl border border-white/15 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-callback-search"
            type="text"
            placeholder="Search by client, phone, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0E1D35] border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${callbackRequests.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'called', label: `Called (${calledCount})` },
            { id: 'converted', label: `Converted (${convertedCount})` },
            { id: 'dismissed', label: 'Dismissed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                filterStatus === f.id
                  ? 'bg-white text-[#0F1F38] border-white font-bold shadow-xs'
                  : 'bg-[#0E1D35] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Callbacks List */}
      {filteredCallbacks.length === 0 ? (
        <div className="text-center p-12 rounded-3xl bg-[#132644] border border-white/15 text-slate-300 space-y-3">
          <PhoneCall className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Callback Requests Found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery ? 'No requests match your search criteria.' : 'The dispatch queue is currently clear.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCallbacks.map((cb) => {
            const isPending = cb.status === 'pending';
            const isConverted = cb.status === 'converted';
            const isCalled = cb.status === 'called';

            return (
              <div
                key={cb.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 shadow-lg transition-all ${
                  isPending
                    ? 'bg-[#183359] border-amber-400/40 ring-1 ring-amber-400/20'
                    : isConverted
                    ? 'bg-[#132644] border-emerald-400/30'
                    : 'bg-[#132644] border-white/15'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Status & Timestamp */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : isConverted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : isCalled
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                          : 'bg-slate-500/20 text-slate-300 border-slate-400/40'
                      }`}
                    >
                      {cb.status}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {cb.createdAt}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div>
                    <h3 className="font-bold text-base text-white">{cb.clientName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <a
                        href={`tel:${cb.phone}`}
                        className="text-xs text-white font-mono font-bold hover:underline"
                      >
                        {cb.phone}
                      </a>
                    </div>
                  </div>

                  {/* Details */}
                  {cb.eventInterest && (
                    <div className="text-xs bg-[#0E1D35] p-2.5 rounded-xl border border-white/10 text-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Interest:</span>
                      {cb.eventInterest}
                    </div>
                  )}

                  {cb.preferredTime && (
                    <p className="text-[11px] text-slate-300">
                      <strong className="text-slate-400">Preferred Time:</strong> {cb.preferredTime}
                    </p>
                  )}

                  {cb.notes && (
                    <p className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/5">
                      "{cb.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  {/* WhatsApp Direct Action Button */}
                  <a
                    href={getWhatsAppLink(cb.phone, cb.clientName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    title="Open WhatsApp chat with client"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp (Instant Chat)</span>
                  </a>

                  {/* Status Toggle Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => updateCallbackStatus(cb.id, 'called')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                        cb.status === 'called'
                          ? 'bg-blue-500/30 text-blue-200 border-blue-400'
                          : 'bg-[#0E1D35] text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      Called
                    </button>
                    <button
                      onClick={() => updateCallbackStatus(cb.id, 'converted')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                        cb.status === 'converted'
                          ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400'
                          : 'bg-[#0E1D35] text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      Booked
                    </button>
                    <button
                      onClick={() => deleteCallbackRequest(cb.id)}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                      title="Delete callback request"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
