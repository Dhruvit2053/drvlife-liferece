import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const DownloadPage: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const copyChecksum = () => {
    navigator.clipboard.writeText(APP_CONFIG.sha256Checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = APP_CONFIG.apkDownloadUrl;
    link.download = `drvlife-v${APP_CONFIG.version}.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-16 lg:py-24 bg-[#0C091A] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#534AB7]/20 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D9E75]/15 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OFFICIAL PRODUCTION RELEASE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Download DrvLife for Android
          </h1>
          <p className="text-base sm:text-lg text-[#888799]">
            Install the verified Android APK directly. Built with Jetpack Compose, Firebase, and Gemini AI.
          </p>
        </div>

        {/* Primary Download Portal Card */}
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl relative mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* App Icon & Basic Info */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#534AB7] to-[#7F77DD] p-1 shadow-2xl shadow-[#7F77DD]/30 mb-4">
                <div className="w-full h-full bg-[#0C091A] rounded-[22px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="DrvLife Logo" className="w-20 h-20 object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white">{APP_CONFIG.appName}</h2>
              <span className="text-xs font-semibold text-[#7F77DD] mt-0.5">Version {APP_CONFIG.version} (Build 1)</span>
              <span className="text-xs text-[#888799] mt-1">{APP_CONFIG.releaseDate}</span>
            </div>

            {/* Specifications & Primary Action */}
            <div className="md:col-span-8 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[#888799] block mb-1">File Size</span>
                  <span className="font-bold text-white text-sm">{APP_CONFIG.apkFileSize}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[#888799] block mb-1">Min Android</span>
                  <span className="font-bold text-white text-sm">{APP_CONFIG.minAndroidVersion}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[#888799] block mb-1">Target API</span>
                  <span className="font-bold text-white text-sm">Android 15 (API 36)</span>
                </div>
              </div>

              {/* Download Button */}
              <div>
                <button
                  onClick={handleDownload}
                  className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-[#534AB7] to-[#7F77DD] hover:from-[#6259cb] hover:to-[#8f88e8] shadow-xl shadow-[#7F77DD]/30 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-100"
                >
                  <Download className="w-6 h-6" />
                  <span>Download DrvLife APK ({APP_CONFIG.apkFileSize})</span>
                </button>

                {downloadStarted && (
                  <div className="mt-3 p-3 rounded-xl bg-[#1D9E75]/15 border border-[#1D9E75]/30 text-[#1D9E75] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Download initiated! If it didn't start, check your browser download prompts.</span>
                  </div>
                )}
              </div>

              {/* SHA-256 Checksum Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#888799] uppercase tracking-wider">
                    SHA-256 Checksum (Integrity Verification)
                  </span>
                  <button
                    onClick={copyChecksum}
                    className="text-[11px] font-semibold text-[#7F77DD] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3 h-3 text-[#1D9E75]" />
                        <span className="text-[#1D9E75]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-[#E8E6F0] break-all select-all">
                  {APP_CONFIG.sha256Checksum}
                </div>
              </div>

            </div>

          </div>

          {/* What's New Section */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7F77DD]" />
              <span>What's Included in Release v{APP_CONFIG.version}:</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#888799]">
              {APP_CONFIG.whatsNew.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
                  <span className="text-[#E8E6F0]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How to Install on Your Android Device
            </h2>
            <p className="text-sm text-[#888799] mt-2">
              Follow these simple steps to install the APK safely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7F77DD]/20 border border-[#7F77DD]/30 flex items-center justify-center text-[#7F77DD] font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-white">Tap Download</h3>
              <p className="text-xs text-[#888799] leading-relaxed">
                Click the Download button above to save the <code className="text-[#7F77DD]">drvlife-v1.0.apk</code> file to your device's Downloads folder.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EF9F27]/20 border border-[#EF9F27]/30 flex items-center justify-center text-[#EF9F27] font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-white">Allow Unknown Apps</h3>
              <p className="text-xs text-[#888799] leading-relaxed">
                If your browser shows a security prompt, tap <strong className="text-white">Settings</strong> and toggle on <strong className="text-white">"Allow from this source"</strong>.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/20 border border-[#1D9E75]/30 flex items-center justify-center text-[#1D9E75] font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-white">Tap Install & Launch</h3>
              <p className="text-xs text-[#888799] leading-relaxed">
                Tap <strong className="text-white">Install</strong> when prompted. Once complete, open DrvLife, sign up, and start understanding your money!
              </p>
            </div>

          </div>

          {/* Android Permission Callout */}
          <div className="p-6 rounded-2xl bg-[#534AB7]/10 border border-[#7F77DD]/20 flex items-start gap-4">
            <Info className="w-6 h-6 text-[#7F77DD] shrink-0 mt-1" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">Notification Access (Optional)</h4>
              <p className="text-[#888799] leading-relaxed">
                To enable automatic UPI and bank transaction tracking, Android requires Notification Access. You can enable this in-app or opt for <strong>Manual Entry Only</strong> with zero permissions required.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
