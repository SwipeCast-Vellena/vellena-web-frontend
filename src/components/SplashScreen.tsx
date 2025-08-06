
import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      {/* Logo Section */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="mb-6 relative">
          <div className="w-24 h-24 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
            <Play className="w-12 h-12 text-slate-900" fill="currentColor" />
          </div>
          <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">ModelSwipe</h1>
        <p className="text-slate-300 text-lg font-medium">Connessioni Professionali per Talenti</p>
      </div>

      {/* Loading Indicator */}
      <div className="w-64 mb-8">
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-slate-400 text-sm text-center mt-4">Caricamento della tua esperienza...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
