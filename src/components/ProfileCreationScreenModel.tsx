
import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Video, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { createOrUpdateModelProfile } from '../services/createOrUpdateModelProfile';
import { uploadVideo } from '../services/uploadVideo'

interface ProfileCreationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileCreationScreenModel: React.FC<ProfileCreationScreenProps> = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    gender: '',
    location: '',
    category:'',
    bio: ''
  });
  const [videoUploaded, setVideoUploaded] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrUpdateModelProfile({
        name: formData.name,
        age: Number(formData.age),
        genre: formData.gender,
        height: formData.height,
        location: formData.location,
        category: formData.category,
        description: formData.bio,
        video_portfolio: videoUrl,
      });

      alert(t('profileCreation.profileSaved'));
      onComplete();

    } catch (error: any) {
      alert(error.message || t('profileCreation.errorSaving'));
    }
  };


  const handleVideoUpload = () => {
    // Simulate video upload
    setVideoUploaded(true);
  };

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoUploadClick = () => {
    fileInputRef.current?.click(); // Trigger hidden file input click
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size (max 30MB)
  if (file.size > 30 * 1024 * 1024) {
    alert(t('profileCreation.fileSizeExceeds'));
    return;
  }

  try {
    setLoading(true); // 🔹 Start loading
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t('profileCreation.mustBeLoggedIn'));
      return;
    }

    const data = await uploadVideo(file, token);
    setVideoUrl(data.videoUrl); // Backend returns video path/url
    setVideoUploaded(true);
  } catch (err: any) {
    alert(err.message || t('profileCreation.videoUploadFailed'));
  } finally {
    setLoading(false); // 🔹 Stop loading
  }
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
          <h1 className="text-2xl font-bold text-slate-900 ml-4">{t('Page.title')}</h1>
        </div>
        <p className="text-slate-600">{t('page.subtitle')}</p>
      </div>

      <div className="absolute top-8 right-6 z-10">
        <LanguageSelector />
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            {t('page.info')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('profile-creation.name.placeholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.age')}</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.height')}</label>
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

            <div className="grid grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.gender')}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                >
                  <option value="">{t('profile-creation.gender.select')}</option>
                  <option value="female">{t('profile-creation.gender.female')}</option>
                  <option value="male">{t('profile-creation.gender.male')}</option>
                  <option value="non-binary">{t('profile-creation.gender.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.category')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                >
                  <option value="">{t('profile-creation.category.select')}</option>
                  <option value="Hostess">{t('profile-creation.category.hostess')}</option>
                  <option value="Model">{t('profile-creation.category.model')}</option>
                  <option value="Photographer">{t('profile-creation.category.photographer')}</option>
                  <option value="Promoter">{t('profile-creation.category.promotar')}</option>
                  <option value="Waiter">{t('profile-creation.category.waiter')}</option>
                  <option value="Other">{t('profile-creation.category.other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.location')}</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.bio')}</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder={t('profile-creation.bio.placeholder')}
                required
              />
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Video className="w-5 h-5 mr-2" />
            {t('profile-creation.video')}
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
                <p className="font-medium text-slate-900 mb-2">{t('profile-creation.record')}</p>
                <p className="text-sm text-slate-600 mb-4">{t('profile-creation.video.length')}</p>
                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  required
                />

                {/* Update your button: */}
                <button
                  type="button"
                  onClick={handleVideoUploadClick}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {loading ? "Uploading..." : t("profile-creation.record.button")}
                </button>


              </div>
            )}
          </div>
          
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            {t('profile-creation.record.info')}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!videoUploaded}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {t('profile-creation.complete')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreationScreenModel;
