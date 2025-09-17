import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPhotosByModelId } from "@/services/modelPhotos";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  Play,
  Heart,
  MessageCircle,
} from "lucide-react";
import { getBaseUrl } from "@/services/utils/baseUrl";
import {
  isFavorite,
  addFavorite,
  removeFavorite,
} from "@/services/favoriteService";

interface UserDetailScreenProps {
  userId: number;
  onBack: () => void;
}

interface Model {
  id: number;
  name: string;
  bio?: string;
  age?: number;
  images?: string[];
  videoThumbnail?: string;
  genre?:string;
  location?: string;
  description?: string;
  experience: "3+ anni";
  skills: ["Passerella", "Editoriale", "Commerciale", "Beauty"];
  height: number;
  category: string;
  video_portfolio: string;
  // add other fields your backend returns
}



const UserDetailScreen: React.FC<UserDetailScreenProps> = ({
  userId,
  onBack,
}) => {
  // // Mock user data - in a real app this would come from an API
  // const user = {
  //   id: userId || 1,
  //   name: "Sarah Johnson",
  //   age: 24,
  //   location: "Milano, Italia",
  //   profession: "Modella di Moda",
  //   bio: "Modella professionale con oltre 3 anni di esperienza in moda e lavori commerciali. Specializzata in passerelle, servizi editoriali e fotografia commerciale.",
  //   videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  //   images: [
  //     "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  //     "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  //     "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
  //   ],
  //   experience: "3+ anni",
  //   height: "1,75m",
  //   skills: ["Passerella", "Editoriale", "Commerciale", "Beauty"]
  // };

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false); // rename state
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!token) return;
      try {
        const fav = await isFavorite(userId, token); // use imported function
        setFavorite(fav);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavoriteStatus();
  }, [userId, token]);

  const toggleFavorite = async () => {
    if (!token) return;
    try {
      if (favorite) await removeFavorite(userId, token);
      else await addFavorite(userId);
      setFavorite(!favorite);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const baseUrl = await getBaseUrl();
        const token = localStorage.getItem("token");

        const res = await fetch(`${baseUrl}/api/model/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch model details");
        }

        const data: Model = await res.json();
        console.log(data);
        setModel(data);
      } catch (err) {
        console.error("Error fetching model:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [userId]);

  // 🔹 Fetch photos (separate from profile so it doesn't block loading)
useEffect(() => {
  if (!token) return;

  setLoadingPhotos(true);
  getBaseUrl().then((baseUrl) => {
    fetchPhotosByModelId(userId.toString(), token, (err, data) => {
      if (err) {
        console.error("Error fetching photos:", err);
        setLoadingPhotos(false);
        return;
      }

      // Flatten all groups into a single array of full URLs
      const urls: string[] = [];
      if (data?.groups) {
        Object.values(data.groups).forEach((group: any) => {
          group.forEach((p: any) => {
            // prepend baseUrl to relative path
            urls.push(`${baseUrl}${p.url}`);
          });
        });
      }

      setPhotos(urls);
      setLoadingPhotos(false);
    });
  });
}, [userId, token]);


  if (loading) {
    return <div className="p-4">Loading model details...</div>;
  }

  if (!model) {
    return (
      <div className="p-4">
        <p>Model not found.</p>
        <button
          onClick={onBack}
          className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-12 pb-3">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Profilo</h1>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Main Video/Image */}
        <div className="relative w-full h-64 bg-slate-200 rounded-2xl overflow-hidden">
          {model.video_portfolio ? (
            <video
              src={model.video_portfolio}
              controls
              className="w-full h-full object-cover"
            />
          ) : model.videoThumbnail ? (
            <img
              src={model.videoThumbnail}
              alt={model.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              No video available
            </div>
          )}
        </div>
        {/* <div className="relative w-full h-64 bg-slate-200 rounded-2xl overflow-hidden">
          {model.videoThumbnail && (
            <img
              src={model.videoThumbnail}
              alt={model.name}
              className="w-40 h-40 rounded-full mb-4 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play
                className="w-8 h-8 text-slate-900 ml-1"
                fill="currentColor"
              />
            </div>
          </div>
        </div> */}

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">
              {model.name}
            </h2>
            {model.is_pro === 1 && (
              <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
                PRO
              </span>
            )}
          </div>

          <div className="flex items-center text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{model.location}</span>
          </div>

          <div className="bg-slate-100 px-3 py-1 rounded-full inline-block mb-4">
            <span className="text-sm font-medium text-slate-700">
              {model.category}
            </span>
          </div>

          <p className="text-slate-700 leading-relaxed">{model.description}</p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Dettagli
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Age</p>
              <p className="font-medium text-slate-900">
                {model.age }
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Altezza</p>
              <p className="font-medium text-slate-900">{model.height}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Genere
          </h3>

          <div className="flex flex-wrap gap-2">
          <p className="font-medium text-slate-900">
                {model.genre}
              </p>
          </div>
        </div>

        {/* Portfolio (from API photos) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Portfolio
          </h3>
          {loadingPhotos ? (
            <p className="text-slate-500 text-sm">Loading photos...</p>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square bg-slate-200 rounded-xl overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No portfolio images</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={toggleFavorite}
            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center ${
              favorite ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            <Heart className="w-5 h-5 mr-2" />
            {favorite ? "Aggiunto ai preferiti" : "Aggiungi ai preferiti"}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default UserDetailScreen;
