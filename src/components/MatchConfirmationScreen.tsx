
import React from 'react';
import { Heart, MessageCircle, Star, ArrowRight, X } from 'lucide-react';

interface MatchConfirmationScreenProps {
  onStartChat: () => void;
  onContinueSwiping: () => void;
  matchData?: {
    matched: boolean;
    score: number;
    reasons?: string[];
  };
}

const MatchConfirmationScreen: React.FC<MatchConfirmationScreenProps> = ({ 
  onStartChat, 
  onContinueSwiping,
  matchData 
}) => {
  const isMatched = matchData?.matched || false;
  const score = matchData?.score || 0;

  if (!isMatched) {
    // Oops screen for no match
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 flex flex-col items-center justify-center px-6">
        {/* Oops Animation */}
        <div className="relative mb-8">
          {/* Main Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center shadow-2xl">
            <X className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Oops Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Oops! 😔
          </h1>
          <p className="text-xl text-slate-600 mb-2">Nessun Match</p>
          <p className="text-slate-600 leading-relaxed max-w-md">
            Non hai fatto match con questa campagna. Non preoccuparti, ci sono molte altre opportunità!
          </p>
        </div>

        {/* Match Score Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-8 w-full max-w-md">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Match Score</h3>
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-slate-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-700">{score}%</span>
            </div>
            <p className="text-slate-600">
              Il tuo profilo ha una compatibilità del <span className="font-semibold">{score}%</span> con questa campagna.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-md">
          <button
            onClick={onContinueSwiping}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
          >
            <span>Continua a Scoprire</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Encouragement */}
        <div className="mt-8 max-w-md">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Non scoraggiarti! Ogni candidatura è un'opportunità di crescita. Continua a migliorare il tuo profilo e cerca altre campagne.
          </p>
        </div>
      </div>
    );
  }

  // Match screen for successful match
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center px-6">
      {/* Celebration Animation */}
      <div className="relative mb-8">
        {/* Floating Hearts */}
        <div className="absolute -top-4 -left-4 w-8 h-8 text-pink-400 animate-bounce">
          <Heart className="w-full h-full" fill="currentColor" />
        </div>
        <div className="absolute -top-2 -right-6 w-6 h-6 text-red-400 animate-pulse">
          <Heart className="w-full h-full" fill="currentColor" />
        </div>
        <div className="absolute -bottom-2 left-2 w-5 h-5 text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Heart className="w-full h-full" fill="currentColor" />
        </div>

        {/* Main Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
          <Star className="w-16 h-16 text-white" fill="currentColor" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          🎉 È un Match!
        </h1>
        <p className="text-xl text-slate-600 mb-2">Congratulazioni!</p>
        <p className="text-slate-600 leading-relaxed max-w-md">
          Hai fatto match con questa campagna! Inizia ora a costruire la tua connessione professionale.
        </p>
      </div>

      {/* Match Score Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-8 w-full max-w-md">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Match Score</h3>
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-green-700">{score}%</span>
          </div>
          <p className="text-slate-600">
            Il tuo profilo ha una compatibilità del <span className="font-semibold">{score}%</span> con questa campagna.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-4">
        <button
          onClick={onStartChat}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Inizia Chat Professionale</span>
        </button>
        
        <button
          onClick={onContinueSwiping}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-semibold text-lg border-2 border-slate-200 flex items-center justify-center space-x-2 hover:border-slate-300 transition-colors"
        >
          <span>Continua a Scoprire</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Guidelines */}
      <div className="mt-8 max-w-md">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Ricorda di mantenere tutte le comunicazioni professionali e focalizzate sul business. 
          Segnala eventuali comportamenti inappropriati usando il menu impostazioni.
        </p>
      </div>
    </div>
  );
};

export default MatchConfirmationScreen;
