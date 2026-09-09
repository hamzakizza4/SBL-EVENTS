import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem } from '../types';
import { 
  X, 
  ArrowLeft, 
  Save, 
  Package, 
  Tag, 
  DollarSign, 
  Layers, 
  Image as ImageIcon, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface AdminInventoryModalProps {
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<InventoryItem, 'id'>, id?: string) => void;
  formatUGX: (amount: number) => string;
}

const DEFAULT_CATEGORIES = [
  'Tents & Canopies',
  'Line Array PA & Sound',
  'Aluminium Truss & Staging',
  'Concert & Mood Lighting',
  'HD LED Screens & AV',
  'Generators & Power Grid',
  'Luxury Mobile Restrooms',
  'Banquet Furniture & Decor',
  'Crowd Control & Security',
  'Other Event Equipment'
];

export const AdminInventoryModal: React.FC<AdminInventoryModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  formatUGX,
}) => {
  const isEditing = !!item;

  const [name, setName] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [totalQuantity, setTotalQuantity] = useState(10);
  const [availableQuantity, setAvailableQuantity] = useState(10);
  const [unit, setUnit] = useState('Unit');
  const [dailyRate, setDailyRate] = useState(150000);
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState('');
  const [b2bEligible, setB2bEligible] = useState(true);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setTotalQuantity(item.totalQuantity);
      setAvailableQuantity(item.availableQuantity);
      setUnit(item.unit || 'Unit');
      setDailyRate(item.dailyRate);
      setSpecs(item.specs || '');
      setImage(item.image || '');
      setB2bEligible(item.b2bEligible ?? true);
    } else {
      setName('');
      setCategory(DEFAULT_CATEGORIES[0]);
      setTotalQuantity(5);
      setAvailableQuantity(5);
      setUnit('Unit');
      setDailyRate(200000);
      setSpecs('');
      setImage('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80');
      setB2bEligible(true);
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const safeTotal = Math.max(0, Number(totalQuantity) || 0);
    const safeAvailable = Math.min(safeTotal, Math.max(0, Number(availableQuantity) || 0));

    const equipmentData: Omit<InventoryItem, 'id'> = {
      name: name.trim(),
      category: category.trim(),
      totalQuantity: safeTotal,
      availableQuantity: safeAvailable,
      unit: unit.trim() || 'Unit',
      dailyRate: Math.max(0, Number(dailyRate) || 0),
      specs: specs.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80',
      b2bEligible,
    };

    onSave(equipmentData, item?.id);
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
          className="relative w-full max-w-2xl bg-[#0F1F38] border border-white/20 rounded-3xl shadow-2xl text-white overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Sticky Header */}
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
                  {isEditing ? 'Edit Equipment Specs' : 'Add New Fleet Equipment'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isEditing ? `Modifying "${item?.name}"` : 'Expand warehouse inventory & B2B sub-rental catalogue'}
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

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Equipment Name *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  placeholder="e.g. Heavy-Duty Clear-Span Tent 20x40m (800 Pax)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Rental Unit (e.g. Unit, Set, Day, Tent) *
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  placeholder="e.g. Tent / Set / Day"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Total Fleet Units *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={totalQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalQuantity(val);
                    if (availableQuantity > val) setAvailableQuantity(val);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Available in Warehouse *
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalQuantity}
                  required
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Day Rate (UGX) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  />
                </div>
                <span className="text-[10px] text-amber-300/80 mt-1 block truncate">
                  {formatUGX(dailyRate)} / {unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Technical Specifications & Rigging Dimensions
              </label>
              <textarea
                rows={3}
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm leading-relaxed"
                placeholder="e.g. 6061-T6 Aluminum Truss, 290x290mm box, includes conical couplers and safety pins."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Equipment Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#091222] border border-white/20 text-white focus:outline-hidden focus:border-amber-400 transition-colors text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              {image && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-black/30 border border-white/10">
                  <img
                    src={image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-white/20"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-white">Image Preview</p>
                    <p className="text-[11px] text-slate-400">Loads on equipment catalogue and quotation PDF.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B1528] border border-white/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-white">B2B Wholesale Dry-Hire Eligible</h5>
                  <p className="text-[11px] text-slate-300">Allow peer event companies & agencies to lease this equipment wholesale.</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="b2b-eligible-toggle"
                checked={b2bEligible}
                onChange={(e) => setB2bEligible(e.target.checked)}
                className="w-5 h-5 rounded-md accent-amber-500 cursor-pointer"
              />
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
                <span>{isEditing ? 'Update Equipment' : 'Add to Inventory'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
