
import React, { useState } from 'react';
import { ArrowLeft, Upload, Video, User } from 'lucide-react';

interface ProfileCreationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    gender: '',
    location: '',
    bio: ''
  });
  const [videoUploaded, setVideoUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const handleVideoUpload = () => {
    // Simulate video upload
    setVideoUploaded(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 ml-4">Crea Profilo</h1>
        </div>
        <p className="text-slate-600">Costruisci il tuo profilo professionale per iniziare a connetterti</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informazioni di Base
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Il tuo nome professionale"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Età</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Altezza</label>
                <input
                  type="text"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="1,75m"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Genere</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              >
                <option value="">Seleziona genere</option>
                <option value="female">Femmina</option>
                <option value="male">Maschio</option>
                <option value="non-binary">Non-binario</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Località</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Milano, Italia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio Professionale</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder="Breve descrizione della tua esperienza e specialità..."
                required
              />
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Video Professionale (Obbligatorio)
          </h2>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            {videoUploaded ? (
              <div className="text-green-600">
                <Video className="w-12 h-12 mx-auto mb-3" />
                <p className="font-medium">Video caricato con successo!</p>
                <p className="text-sm text-slate-600 mt-2">Presentazione professionale di 30 secondi</p>
                <button
                  type="button"
                  onClick={handleVideoUpload}
                  className="mt-4 text-slate-900 font-medium hover:underline"
                >
                  Sostituisci video
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-900 mb-2">Carica il tuo video di presentazione</p>
                <p className="text-sm text-slate-600 mb-4">Massimo 30 secondi • Supportati MP4, MOV</p>
                <button
                  type="button"
                  onClick={handleVideoUpload}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Scegli File Video
                </button>
              </div>
            )}
          </div>
          
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Il tuo video dovrebbe mostrare professionalmente il tuo aspetto, personalità e capacità di comunicazione. 
            Mantienilo appropriato per il business e coinvolgente.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!videoUploaded}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Completa Configurazione Profilo
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreationScreen;
