
import React from 'react';
import { ArrowLeft, MapPin, Calendar, Play, Heart, MessageCircle } from 'lucide-react';

interface UserDetailScreenProps {
  userId: number | null;
  onBack: () => void;
}

const UserDetailScreen: React.FC<UserDetailScreenProps> = ({ userId, onBack }) => {
  // Mock user data - in a real app this would come from an API
  const user = {
    id: userId || 1,
    name: "Sarah Johnson",
    age: 24,
    location: "Milano, Italia",
    profession: "Modella di Moda",
    bio: "Modella professionale con oltre 3 anni di esperienza in moda e lavori commerciali. Specializzata in passerelle, servizi editoriali e fotografia commerciale.",
    videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    ],
    experience: "3+ anni",
    height: "1,75m",
    skills: ["Passerella", "Editoriale", "Commerciale", "Beauty"]
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-12 pb-3">
        <div className="flex items-center">
          <button
            onClick={onBack}
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
          <img 
            src={user.videoThumbnail}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {user.name}, {user.age}
          </h2>
          
          <div className="flex items-center text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{user.location}</span>
          </div>

          <div className="bg-slate-100 px-3 py-1 rounded-full inline-block mb-4">
            <span className="text-sm font-medium text-slate-700">{user.profession}</span>
          </div>

          <p className="text-slate-700 leading-relaxed">{user.bio}</p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Dettagli</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Esperienza</p>
              <p className="font-medium text-slate-900">{user.experience}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Altezza</p>
              <p className="font-medium text-slate-900">{user.height}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Competenze</h3>
          
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {user.images.map((image, index) => (
              <div key={index} className="aspect-square bg-slate-200 rounded-xl overflow-hidden">
                <img 
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center">
            <Heart className="w-5 h-5 mr-2" />
            Mi Piace
          </button>
          <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Messaggio
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailScreen;
