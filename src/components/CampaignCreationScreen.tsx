
import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface CampaignCreationScreenProps {
  onBack: () => void;
  onSave: () => void;
}

const CampaignCreationScreen: React.FC<CampaignCreationScreenProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: '',
    requirements: {
      ageRange: '',
      height: '',
      gender: '',
      location: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-8 pb-3">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Crea Campagna</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dettagli Campagna</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titolo Campagna</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Fashion Week Estate 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrizione</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder="Descrivi i requisiti della tua campagna..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Scadenza</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="€2.500 - €5.000"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Requisiti</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fascia di Età</label>
              <input
                type="text"
                value={formData.requirements.ageRange}
                onChange={(e) => setFormData({
                  ...formData, 
                  requirements: {...formData.requirements, ageRange: e.target.value}
                })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="18-28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Altezza</label>
              <input
                type="text"
                value={formData.requirements.height}
                onChange={(e) => setFormData({
                  ...formData, 
                  requirements: {...formData.requirements, height: e.target.value}
                })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="1,72m - 1,83m"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Genere</label>
              <select
                value={formData.requirements.gender}
                onChange={(e) => setFormData({
                  ...formData, 
                  requirements: {...formData.requirements, gender: e.target.value}
                })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Qualsiasi</option>
                <option value="female">Femminile</option>
                <option value="male">Maschile</option>
                <option value="non-binary">Non-binario</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Località</label>
              <input
                type="text"
                value={formData.requirements.location}
                onChange={(e) => setFormData({
                  ...formData, 
                  requirements: {...formData.requirements, location: e.target.value}
                })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Milano, Italia"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
        >
          Crea Campagna
        </button>
      </form>
    </div>
  );
};

export default CampaignCreationScreen;
