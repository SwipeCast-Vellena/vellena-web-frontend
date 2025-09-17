
import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Video, User, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { createOrUpdateAgencyProfile } from '../services/createOrUpdateAgencyProfile';
import { getBaseUrl } from '../services/utils/baseUrl';
import axios from 'axios';

interface ProfileCreationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileCreationScreenAgency: React.FC<ProfileCreationScreenProps> = ({ onBack, onComplete }) => {
    const [formData, setFormData] = useState({
      name: '',
      operating_years: '',
      no_of_employees: '',
      location: '',
      professional_bio: '',
      website: '',
      vat_number: '',
      pdf_file: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [pdfUploading, setPdfUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, pdf_file: file });
    } else {
      alert(t('agencyProfile.invalidFileType'));
    }
  };

  const uploadPdf = async (file: File): Promise<string | null> => {
    try {
      setPdfUploading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const baseUrl = await getBaseUrl();
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post(`${baseUrl}/api/agency/upload-pdf`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.pdfPath;
    } catch (error) {
      console.error('PDF upload failed:', error);
      throw error;
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let pdfPath = null;
      
      // Upload PDF if provided
      if (formData.pdf_file) {
        pdfPath = await uploadPdf(formData.pdf_file);
      }

      await createOrUpdateAgencyProfile({
        name: formData.name,
        operating_years: Number(formData.operating_years),
        no_of_employees: Number(formData.no_of_employees),
        location: formData.location,
        professional_bio: formData.professional_bio,
        website: formData.website || null,
        vat_number: formData.vat_number || null,
        pdf_path: pdfPath,
      });

      alert(t('profileCreation.profileSaved'));
      onComplete();
    } catch (error: any) {
      alert(error.message || t('profileCreation.errorSaving'));
    } finally {
      setLoading(false);
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
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.agency.name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('profile-creation.agency.name.placeholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.years')}</label>
                <input
                  type="number"
                  value={formData.operating_years}
                  onChange={(e) => setFormData({...formData, operating_years: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.employee')}</label>
                <input
                  type="text"
                  value={formData.no_of_employees}
                  onChange={(e) => setFormData({...formData, no_of_employees: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="15"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.agency.website')}</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('profile-creation.agency.website.placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.location')}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('modelFeed.defaultCity')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.bio')}</label>
              <textarea
                value={formData.professional_bio}
                onChange={(e) => setFormData({...formData, professional_bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder={t('profile-creation.bio.placeholder')}
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {t('agencyProfile.additionalInfo')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('agencyProfile.vatNumber')}</label>
              <input
                type="text"
                value={formData.vat_number}
                onChange={(e) => setFormData({...formData, vat_number: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('agencyProfile.vatNumberPlaceholder')}
              />
              <p className="text-xs text-slate-500 mt-1">{t('agencyProfile.vatNumberOptional')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('agencyProfile.companyDocuments')}</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-input"
                />
                
                {formData.pdf_file ? (
                  <div>
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-medium text-slate-900 mb-2">{formData.pdf_file.name}</p>
                    <p className="text-sm text-slate-600 mb-3">{t('agencyProfile.pdfUploaded')}</p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                      >
                        {t('agencyProfile.replacePdf')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, pdf_file: null})}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
                      >
                        {t('agencyProfile.removePdf')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="font-medium text-slate-900 mb-2">{t('agencyProfile.uploadPdf')}</p>
                    <p className="text-sm text-slate-600 mb-3">{t('agencyProfile.pdfDescription')}</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                      {t('agencyProfile.selectPdf')}
                    </button>
                    <p className="text-xs text-slate-500 mt-2">{t('agencyProfile.pdfOptional')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || pdfUploading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading || pdfUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                {pdfUploading ? t('agencyProfile.uploadingPdf') : t('settings.save')}
              </>
            ) : (
              t('profile-creation.complete')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreationScreenAgency;
