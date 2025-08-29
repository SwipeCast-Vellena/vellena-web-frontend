
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit3, Video, LogOut, Shield, FileText, HelpCircle, User, Camera } from 'lucide-react';
import { getBaseUrl } from '@/services/utils/baseUrl';
import axios from 'axios';


interface ProfileSettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}


const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ onBack, onLogout }) => {

  interface BackendProfile {
    name: string;
    age: number;
    genre: string;
    height: string;
    location: string;
    category: string;
    description: string;
    video_portfolio?: string;
  }
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    age: 0,
    height: "",
    profession: '',
    video:'',
    genre:'',
  });

  const handleEmail=async()=>{
    
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl=await getBaseUrl();
      try {
        const token = localStorage.getItem("token"); // assuming you store JWT here
        const res = await axios.get<BackendProfile>(`${baseUrl}/api/model/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const profile = res.data;
        setUserProfile({
          name: profile.name,
          email: "user@email.com", // you may get this from JWT or separate endpoint
          location: profile.location,
          bio: profile.description,
          age: profile.age,
          height: profile.height +" m",
          profession: profile.category,
          video: profile.video_portfolio,
          genre:profile.genre,
        });
      } catch (err: any) {
        console.error("Failed to load profile", err);
      }
    };
  
    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl=await getBaseUrl();
  
      await axios.post(`${baseUrl}/api/model/profile`, {
        name: userProfile.name,
        age: userProfile.age,
        genre: userProfile.genre, // pick from dropdown or state
        height: userProfile.height,
        location: userProfile.location,
        category: userProfile.profession,
        description: userProfile.bio,
        video_portfolio: userProfile.video || null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setIsEditing(false);
      alert("Profilo aggiornato con successo!");
    } catch (err: any) {
      console.error("Error updating profile", err);
      alert("Errore nell'aggiornamento del profilo");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Profilo e Impostazioni</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
          >
            <Edit3 className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Profilo"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{userProfile.name}</h2>
              <p className="text-slate-600">{userProfile.profession}</p>
              <p className="text-sm text-slate-500">{userProfile.location}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Età</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Altezza</label>
                <input
                  type="text"
                  value={userProfile.height}
                  onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Località</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio Professionale</label>
              <textarea
                value={userProfile.bio}
                onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50 h-24 resize-none"
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                  Salva Modifiche
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Annulla
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Management */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Video Professionale
          </h3>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Video Attuale</p>
                <p className="text-sm text-slate-600">Presentazione professionale di 30 secondi</p>
              </div>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Anteprima
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors">
              Aggiorna Video
            </button>
            <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors">
              Elimina Video
            </button>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Impostazioni Privacy</span>
              </div>
              <span className="text-slate-400">›</span>
            </button>
            
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Termini di Servizio</span>
              </div>
              <span className="text-slate-400">›</span>
            </button>
            
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Informativa sulla Privacy</span>
              </div>
              <span className="text-slate-400">›</span>
            </button>
            
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Aiuto e Supporto</span>
              </div>
              <span className="text-slate-400">›</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Disconnetti</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">yo_work v1.0.0</p>
          <p className="text-xs text-slate-400 mt-1">Piattaforma Professionale per il Matching di Talenti</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;
