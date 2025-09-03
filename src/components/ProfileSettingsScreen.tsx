import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Video,
  LogOut,
  Shield,
  FileText,
  HelpCircle,
  User,
  Camera,
  Upload,
} from "lucide-react";
import { getBaseUrl } from "@/services/utils/baseUrl";
import { uploadVideo } from "@/services/uploadVideo";
import { fetchMyModelPhotos } from "@/services/modelPhotos";
import axios from "axios";
import { upgradeToPro } from "@/services/stripeService";

interface ProfileSettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onBack,
  onLogout,
}) => {
  interface BackendProfile {
    id: number;
    is_pro: number;
    name: string;
    age: number;
    genre: string;
    height: string;
    location: string;
    category: string;
    description: string;
    video_portfolio?: string;
    email: string;
    card_number:string;
  }
  const [userProfile, setUserProfile] = useState({
    id: 0,
    is_pro: 0,
    name: "",
    email: "",
    location: "",
    bio: "",
    age: 0,
    height: "",
    profession: "",
    video_portfolio: null,
    genre: "",
    card_number:"",
  });

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modelPhotos, setModelPhotos] = useState<string[]>([]);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    const fetchPhotos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const baseUrl = await getBaseUrl(); // wait for the actual URL

        fetchMyModelPhotos(token, (err, data) => {
          if (err) {
            console.error("Failed to fetch model photos:", err);
            return;
          }

          // prepend baseUrl to each relative photo URL
          const photosArray =
            data?.groups?.Portfolio?.map((p: any) => `${baseUrl}${p.url}`) ||
            [];

          setModelPhotos(photosArray);

          console.log("Fetched model photos:", photosArray);
        });
      } catch (error) {
        console.error("Failed to get base URL", error);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchMyModelPhotos(token, (err, data) => {
      if (err) {
        console.error("Failed to fetch model photos:", err);
        return;
      }

      // assuming backend returns array of photo URLs
      setModelPhotos(data.photos || []);
    });
  }, []);

  const handleVideoUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");
  };

  const handleReplaceVideoClick = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl = await getBaseUrl();
      try {
        const token = localStorage.getItem("token"); // assuming you store JWT here
        const res = await axios.get<BackendProfile>(
          `${baseUrl}/api/model/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profile = res.data;
        setUserProfile({
          id: profile.id,
          is_pro: profile.is_pro,
          name: profile.name,
          email: profile.email, // you may get this from JWT or separate endpoint
          location: profile.location,
          bio: profile.description,
          age: profile.age,
          height: profile.height + " m",
          profession: profile.category,
          video_portfolio: profile.video_portfolio,
          genre: profile.genre,
          card_number:profile.card_number,
        });
        console.log("Fetched profile:", profile);
      } catch (err: any) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const getAvatarColor = (name: string) => {
    const colors = [
      "#043584ff",
      "#73616146",
      "#895a09ff",
      "#034f35ff",
      "#200560ff",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const handleUpgrade = () => {
    if (!userProfile?.id) {
      alert("You must be logged in to upgrade.");
      return;
    }
    upgradeToPro(userProfile.id);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = await getBaseUrl();

      await axios.post(
        `${baseUrl}/api/model/profile`,
        {
          id: userProfile.id,
          is_pro: userProfile.is_pro,
          name: userProfile.name,
          age: userProfile.age,
          genre: userProfile.genre, // pick from dropdown or state
          height: userProfile.height,
          location: userProfile.location,
          category: userProfile.profession,
          description: userProfile.bio,
          video_portfolio: videoUrl || userProfile.video_portfolio || null,
          card_number:userProfile.card_number,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
            <h1 className="text-2xl font-bold text-slate-900">
              Profilo e Impostazioni
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch to Pro Button */}
            <button
              onClick={handleUpgrade}
              disabled={userProfile.is_pro === 1}
              className={`px-4 py-2 text-white text-sm font-medium rounded-xl shadow-sm
                ${userProfile.is_pro === 1 
                  ? "bg-gray-400 cursor-not-allowed"  // ✅ disabled style
                  : "bg-indigo-600 hover:bg-indigo-700" // normal style
                }`}
            >
              {userProfile.is_pro === 1 ? "You are already a Pro" : "Upgrade to Pro"}
            </button>
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <Edit3 className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>


      <div className="px-6 py-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl overflow-hidden">
                {modelPhotos.length > 0 ? (
                  <img
                    src={modelPhotos[0]} // show first photo
                    alt="Profilo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl cursor-pointer"
                    style={{
                      backgroundColor: getAvatarColor(userProfile.name),
                    }}
                  >
                    {userProfile.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                {userProfile.name}
              </h2>
              <p className="text-slate-600">{userProfile.profession}</p>
              <p className="text-sm text-slate-500">{userProfile.location}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={userProfile.email}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Età
                </label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      age: parseInt(e.target.value),
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Altezza
                </label>
                <input
                  type="text"
                  value={userProfile.height}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, height: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
                />
              </div>
            </div>

            
            
{/* Card Number + Location side by side */}
<div className="grid grid-cols-2 gap-4 mt-4">
<div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Località
    </label>
    <input
      type="text"
      value={userProfile.location}
      onChange={(e) =>
        setUserProfile({ ...userProfile, location: e.target.value })
      }
      disabled={!isEditing}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Numero Carta
    </label>
    <input
      type="text"
      value={userProfile.card_number}
      onChange={(e) =>
        setUserProfile({ ...userProfile, card_number: e.target.value })
      }
      disabled={!isEditing}
      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-50"
      placeholder="**** **** **** ****"
      maxLength={19}
    />
  </div>
  
</div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bio Professionale
              </label>
              <textarea
                value={userProfile.bio}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, bio: e.target.value })
                }
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

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Video Professionale
          </h3>

          {/* Hidden file input always rendered */}
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
            {videoUploaded || userProfile.video_portfolio ? (
              <div>
                <video
                  src={videoUrl || userProfile.video_portfolio || ""}
                  controls
                  className="w-full rounded-xl mb-3"
                />
                <p className="text-sm text-slate-600 mb-3">
                  Presentazione professionale di 30 secondi
                </p>
                <div className="flex justify-center gap-3">
                  {/* <button
                    type="button"
                    onClick={handleVideoUploadClick}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    Sostituisci Video
                  </button> */}
                  {/* Delete */}
                  {/* <button
                    type="button"
                    className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
                  >
                    Elimina Video
                  </button> */}
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-medium text-slate-900 mb-2">
                  Carica un video di presentazione
                </p>
                <button
                  type="button"
                  onClick={handleVideoUploadClick}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                >
                  Carica Video
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">
                  Impostazioni Privacy
                </span>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">
                  Termini di Servizio
                </span>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">
                  Informativa sulla Privacy
                </span>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">
                  Aiuto e Supporto
                </span>
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
          <p className="text-xs text-slate-400 mt-1">
            Piattaforma Professionale per il Matching di Talenti
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsScreen;
