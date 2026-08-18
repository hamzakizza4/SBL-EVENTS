import React from 'react';
import { useApp } from '../context/AppContext';
import { TEAM_MEMBERS, INVENTORY_ITEMS } from '../data/mockData';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Zap, 
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { openBookingModal, theme } = useApp();
  const t = getThemeClasses(theme);

  return (
    <div id="about-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
      
      {/* Hero / Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold shadow-xs">
            <Award className="w-4 h-4 text-blue-300" />
            <span>15+ Years Event Production</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] leading-tight ${t.headingText}`}>
            Engineering Exceptional Event Experiences
          </h1>

          <p className={`text-xs sm:text-base leading-relaxed ${t.bodyText}`}>
            <strong className="text-white">SBL Events</strong> is a premier full-scale production company providing clear-span marquee tents, stage structures, line array sound, intelligent lighting, LED screens, and mobile restrooms.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className={`p-4 rounded-2xl border ${t.cardBg} ${t.cardBorder} shadow-lg text-center`}>
              <span className="text-2xl font-black text-white font-['Outfit']">15+</span>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">Years Active</p>
            </div>
            <div className={`p-4 rounded-2xl border ${t.cardBg} ${t.cardBorder} shadow-lg text-center`}>
              <span className="text-2xl font-black text-white font-['Outfit']">50+</span>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">Specialists</p>
            </div>
            <div className={`p-4 rounded-2xl border ${t.cardBg} ${t.cardBorder} shadow-lg text-center`}>
              <span className="text-2xl font-black text-white font-['Outfit']">100%</span>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">Guaranteed</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
              alt="SBL Production Team"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F38] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#132644]/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white text-xs">
              <span className="font-bold text-white uppercase block">Certified Safety Protocols</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Every truss, ballast, and 3-phase connection is inspected by certified riggers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Key Personnel</span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] ${t.headingText}`}>
            Operations Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-5 space-y-3 shadow-xl text-center`}
            >
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{member.name}</h3>
                <p className="text-xs text-blue-300 font-medium">{member.role}</p>
                <p className="text-[10px] text-slate-400">{member.experience}</p>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed border-t border-white/10 pt-2">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Fleet */}
      <div className={`rounded-3xl p-6 sm:p-8 border ${t.cardBorder} bg-[#132644] text-white shadow-2xl space-y-6`}>
        <div className="space-y-1">
          <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">Equipment Fleet</span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit']">
            Certified Inventory & Rigging Arsenal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INVENTORY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#0E1D35] border border-white/15 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">{item.category}</span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-mono">
                  {item.totalQuantity} Units
                </span>
              </div>
              <h4 className="font-bold text-xs text-white">{item.name}</h4>
              <p className="text-[10px] text-slate-300">{item.specs}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Full liability insurance & structural certifications included.</span>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="py-2.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-[#0F1F38] font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <span>Book Venue Inspection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
