import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Receipt, 
  Zap, 
  Brain, 
  Camera, 
  PieChart, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Check, 
  Sparkles
} from 'lucide-react';
import { FEATURES } from '../config/appConfig';

export const FeaturesPage: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt': return <Receipt className="w-8 h-8 text-[#7F77DD]" />;
      case 'Zap': return <Zap className="w-8 h-8 text-[#EF9F27]" />;
      case 'Brain': return <Brain className="w-8 h-8 text-[#7F77DD]" />;
      case 'Camera': return <Camera className="w-8 h-8 text-[#1D9E75]" />;
      case 'PieChart': return <PieChart className="w-8 h-8 text-[#534AB7]" />;
      case 'FileText': return <FileText className="w-8 h-8 text-[#7F77DD]" />;
      case 'TrendingUp': return <TrendingUp className="w-8 h-8 text-[#1D9E75]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8 text-[#1D9E75]" />;
      default: return <Sparkles className="w-8 h-8 text-[#7F77DD]" />;
    }
  };

  return (
    <div className="py-16 lg:py-24 bg-[#0C091A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30 text-[#7F77DD] text-xs font-semibold">
            <span>FULL CAPABILITY MATRIX</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Financial Autonomy
          </h1>
          <p className="text-base sm:text-lg text-[#888799]">
            DrvLife replaces manual spreadsheets and intrusive banking scrapers with local on-device intelligence and generative AI.
          </p>
        </div>

        {/* Detailed Feature Cards List */}
        <div className="space-y-12 mb-24">
          {FEATURES.map((feat) => (
            <div 
              key={feat.id}
              className="glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 hover:border-[#7F77DD]/30 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                      {getIcon(feat.icon)}
                    </div>
                    <div>
                      {feat.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#7F77DD]/20 text-[#7F77DD] border border-[#7F77DD]/30 mb-1 inline-block">
                          {feat.badge}
                        </span>
                      )}
                      <h2 className="text-2xl font-bold text-white">{feat.title}</h2>
                    </div>
                  </div>

                  <p className="text-base text-[#E8E6F0] leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-[#888799]">
                    <strong className="text-white">Under the hood: </strong>
                    {feat.details}
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-full max-w-xs p-5 rounded-2xl bg-[#140C2E]/60 border border-white/10 text-center space-y-2">
                    <span className="text-xs font-semibold text-[#1D9E75]">Status in Release v1.0</span>
                    <div className="text-base font-bold text-white">Production Ready</div>
                    <p className="text-[11px] text-[#888799]">Verified across GPay, PhonePe, and major Indian banking institutions.</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How DrvLife Compares to Traditional Apps
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[#888799]">
                  <th className="pb-4 font-semibold">Capability</th>
                  <th className="pb-4 font-bold text-[#7F77DD]">DrvLife (Android)</th>
                  <th className="pb-4 font-semibold">Old-School Budget Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#E8E6F0]">
                <tr>
                  <td className="py-4 font-medium">Automatic UPI Tracking</td>
                  <td className="py-4 text-[#1D9E75] font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Local Notifications
                  </td>
                  <td className="py-4 text-[#888799]">None (Manual only)</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Bank Password Required?</td>
                  <td className="py-4 text-[#1D9E75] font-bold">NO (Zero Access)</td>
                  <td className="py-4 text-[#E24B4A]">Requires Netbanking login</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">OTP & Sensitive Messages</td>
                  <td className="py-4 text-[#1D9E75] font-bold">100% Filtered & Discarded</td>
                  <td className="py-4 text-[#888799]">Stored in third-party clouds</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Generative AI Advisor</td>
                  <td className="py-4 text-[#7F77DD] font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Gemini Multimodal
                  </td>
                  <td className="py-4 text-[#888799]">Generic static tips</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Camera Receipt OCR</td>
                  <td className="py-4 text-[#1D9E75] font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Gemini AI Vision
                  </td>
                  <td className="py-4 text-[#888799]">Paid Add-on / None</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium">Native PDF & CSV Export</td>
                  <td className="py-4 text-[#1D9E75] font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Free Unlimited
                  </td>
                  <td className="py-4 text-[#888799]">Locked behind subscription</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/download"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-lg shadow-[#7F77DD]/30 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download DrvLife Today</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
