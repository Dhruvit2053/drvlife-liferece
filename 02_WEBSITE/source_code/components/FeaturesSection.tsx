import React, { useState } from 'react';
import { 
  Receipt, 
  Zap, 
  Brain, 
  Camera, 
  PieChart, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FEATURES, type FeatureItem } from '../config/appConfig';

export const FeaturesSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt': return <Receipt className="w-6 h-6 text-[#7F77DD]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#EF9F27]" />;
      case 'Brain': return <Brain className="w-6 h-6 text-[#7F77DD]" />;
      case 'Camera': return <Camera className="w-6 h-6 text-[#1D9E75]" />;
      case 'PieChart': return <PieChart className="w-6 h-6 text-[#534AB7]" />;
      case 'FileText': return <FileText className="w-6 h-6 text-[#7F77DD]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#1D9E75]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#1D9E75]" />;
      default: return <Sparkles className="w-6 h-6 text-[#7F77DD]" />;
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0C091A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/10 border border-[#7F77DD]/20 text-[#7F77DD] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINEERED FOR FINTECH EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Features Built for Real-World Money Management
          </h2>
          <p className="text-base sm:text-lg text-[#888799]">
            Every capability in DrvLife is implemented natively on Android, tested with live banking notifications, and built with genuine privacy guarantees.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
              className="glass-panel rounded-2xl p-6 glass-card-hover cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(feature.icon)}
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.07] text-[#E8E6F0] border border-white/10">
                      {feature.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#7F77DD] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#888799] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Expandable detail snippet */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#7F77DD]">
                <span>{selectedFeature?.id === feature.id ? "Hide details" : "More details"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${selectedFeature?.id === feature.id ? 'rotate-90' : ''}`} />
              </div>

              {selectedFeature?.id === feature.id && (
                <div className="pt-3 text-xs text-[#E8E6F0] bg-[#534AB7]/10 p-3 rounded-xl mt-3 border border-[#7F77DD]/20 animate-in fade-in duration-200">
                  {feature.details}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
