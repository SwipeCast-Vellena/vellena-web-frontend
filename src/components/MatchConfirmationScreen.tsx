
import React from 'react';
import { Heart, MessageCircle, Phone, Mail, Star, ArrowRight } from 'lucide-react';

interface MatchConfirmationScreenProps {
  onStartChat: () => void;
  onContinueSwiping: () => void;
}

const MatchConfirmationScreen: React.FC<MatchConfirmationScreenProps> = ({ 
  onStartChat, 
  onContinueSwiping 
}) => {
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
          Tu e <span className="font-semibold text-slate-900">Sarah Johnson</span> avete fatto match. 
          Inizia ora a costruire la tua connessione professionale.
        </p>
      </div>

      {/* Match Details Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-8 w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Sarah Johnson"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">Sarah Johnson</h3>
            <p className="text-slate-600">Modella di Moda</p>
            <p className="text-sm text-slate-500">Milano, Italia</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center p-3 bg-slate-50 rounded-xl">
            <Mail className="w-5 h-5 text-slate-600 mr-3" />
            <span className="text-slate-700 font-medium">sarah.johnson@email.com</span>
          </div>
          <div className="flex items-center p-3 bg-slate-50 rounded-xl">
            <Phone className="w-5 h-5 text-slate-600 mr-3" />
            <span className="text-slate-700 font-medium">+39 345 123 4567</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-1">Nota Professionale:</p>
          <p className="text-sm text-blue-700">
            Questa connessione è esclusivamente per scopi professionali. Mantieni standard di comunicazione professionale.
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
