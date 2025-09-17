import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Star,
  ThumbsDown,
  ThumbsUp,
  User2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import NotificationsCard from "./NotificationCard";
import RecentMatches from "./RecentMatches";
import { useCampaignStore } from "../stores/campaignStore";
import PhotoUploader from "../components/PhotoUploader";
import { toast } from "@/components/ui/use-toast"; 
import { getModelProfile } from "@/services/modelService";// adjust the path if needed
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";

// --- Types from backend ---
type BackendCampaign = {
  id: number;
  title: string;
  agency_name?: string;
  agency?: string;
  city: string;
  address?: string;
  start_date: string;
  end_date?: string;
  deadline: string;
  compensation: number;
  currency?: string;
  gender_preference: "any" | "women" | "men";
  application_count?: number;
  description: string;
  tags?: string[];
};

interface ModelProfile {
  name: string;
  category?: string;
  
}

// --- UI Type ---
interface Campaign {
  id: number;
  title: string;
  agency: string;
  city: string;
  address?: string;
  startDate: string;
  endDate?: string;
  deadline: string;
  compensation: number;
  currency?: string;
  genderPreference: "any" | "women" | "men";
  applicants: number;
  description: string;
  tags?: string[];
}

// --- Utilities ---
const daysUntil = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    : "—";

const money = (n: number, c?: string) => `${c ?? "€"}${Number(n ?? 0).toFixed(0)}`;

const isFutureOrToday = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

const mapToUICampaign = (c: BackendCampaign, t: (key: string) => string): Campaign => ({
  id: c.id,
  title: c.title,
  agency: c.agency ?? c.agency_name ?? t('modelFeed.unknownAgency'),
  city: c.city,
  address: c.address,
  startDate: c.start_date,
  endDate: c.end_date,
  deadline: c.deadline,
  compensation: c.compensation,
  currency: c.currency ?? "€",
  genderPreference: c.gender_preference,
  applicants: c.application_count ?? 0,
  description: c.description,
  tags: c.tags ?? [],
});

interface MainFeedScreenModelProps {
  onCampaignSelect?: (campaign: Campaign) => void;
  onEditProfile?: () => void; // ✅ add this
}

// --- Component ---
export default function MainFeedScreenModel({ onCampaignSelect, onEditProfile }: MainFeedScreenModelProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<"list" | "swipe">("list");
  const { campaigns, fetchCampaigns } = useCampaignStore();
  const [token, setToken] = useState("");
  const [profilePhotoUploaded, setProfilePhotoUploaded] = useState(false);
  const [modelProfile,setModelProfile]=useState<ModelProfile|null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(()=>{
    const fetchProfile=async()=>{
      try {
        const prof=await getModelProfile();
        console.log(prof);
        setModelProfile(prof);
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile();
  },[])

  // Profile completion mock
  const [profile, setProfile] = useState({
      photo: false,
      age: 24,
      height: "1.75m",
      measurements: "84-62-90",
      video: true,
      category: t('modelFeed.categoryModel'),
      city: t('modelFeed.defaultCity'),
  });


  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profilePhotoUploaded,
      !!profile.age,
      !!profile.height,
      !!profile.measurements,
      profile.video,
      !!profile.category,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile, profilePhotoUploaded]);

  // Normalize campaigns for UI
  const uiCampaigns = useMemo<Campaign[]>(() => {
    const raw = (Array.isArray(campaigns) ? campaigns : []) as BackendCampaign[];

    return raw
      .map(c => mapToUICampaign(c, t))
      .filter((c) => c.deadline && !Number.isNaN(new Date(c.deadline).getTime()))
      .filter((c) => isFutureOrToday(c.deadline))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, [campaigns]);

  // --- Actions ---
  const applyToCampaign = (campaign: Campaign) => {
    alert(`Applied to #${campaign.id} (${campaign.title})`);
  };

  const skipCampaign = (id: number) => {
    toast({
      title: t('modelFeed.jobSkipped'),
      description: `${t('modelFeed.youSkippedJob')} #${id}`,
      variant: "destructive", // optional, or "default"
    });
  };

  const handleCampaignClick = (c: Campaign) => {
    if (onCampaignSelect) onCampaignSelect(c);
  };

  const uploadVideo = () => {
    alert(t('modelFeed.openVideoUploader'));
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-50">
      {/* Topbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User2 className="w-5 h-5 text-slate-700" />
            <div>
              <div className="text-sm text-slate-500">{t('modelFeed.welcomeBack')}</div>
              <div className="font-semibold text-slate-900">
                {modelProfile?.name} <span className="text-slate-600">{modelProfile?.category}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI + Profile completion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-slate-900">{t('modelFeed.profileCompleteness')}</div>
                <div className="text-sm text-slate-500">{completion}%</div>
              </div>
              <Progress value={completion} className="mb-4" />
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <ChecklistItem done={profilePhotoUploaded} label={t('modelFeed.profilePhoto')} />
                <ChecklistItem done={!!profile.age} label={t('modelFeed.age')} />
                <ChecklistItem done={!!profile.height} label={t('modelFeed.height')} />
                <ChecklistItem done={!!profile.measurements} label={t('modelFeed.measurements')} />
                <ChecklistItem done={profile.video} label={t('modelFeed.introVideo')} />
                <ChecklistItem done={!!profile.category} label={t('modelFeed.categorySelected')} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" className="gap-2" onClick={onEditProfile}>
                  <User2 className="w-4 h-4" />
                  {t('modelFeed.editProfile')}
                </Button>
              </div>
            </CardContent>
          </Card>
          <NotificationsCard />
        </div>

        {/* Photo uploader */}
        <div className="p-6">
          {token ? <PhotoUploader
            token={token}
            onUploadSuccess={(hasPhoto) => setProfilePhotoUploaded(hasPhoto)}
          /> : <p>{t('modelFeed.pleaseLogin')}</p>}
        </div>

        {/* Jobs feed: toggle Swipe/List */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-slate-900">{t('modelFeed.availableJobs')}</div>
          <div className="flex items-center gap-2">
            <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
              {t('modelFeed.list')}
            </Button>
            <Button variant={view === "swipe" ? "default" : "outline"} onClick={() => setView("swipe")}>
              {t('modelFeed.swipe')}
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiCampaigns.map((item) => {
              const deadlineDate = new Date(item.deadline);
              const diffTime = deadlineDate.getTime() - new Date().getTime();
              const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const timeLeft = daysLeft > 0 ? `${daysLeft} ${t('modelFeed.daysLeft')}` : daysLeft === 0 ? t('modelFeed.today') : t('modelFeed.expired');

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCampaignClick(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600 font-medium">{item.agency}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          daysLeft < 0 ? "bg-slate-100 text-slate-600" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {timeLeft}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-4 leading-relaxed">{item.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-4 h-4 mr-2 text-center">👤</span>
                      <span>
                        {item.genderPreference === "any"
                          ? t('modelFeed.genderAny')
                          : item.genderPreference === "women"
                          ? t('modelFeed.genderWomen')
                          : t('modelFeed.genderMen')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {item.city}
                        {item.address ? `, ${item.address}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                      <span>
                        {t('modelFeed.start')}:{" "}
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {item.endDate && (
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5 text-red-500" />
                        <span>
                          {t('modelFeed.end')}:{" "}
                          {new Date(item.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span className="font-bold text-slate-900">
                          {new Date(item.deadline).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">{item.applicants} {t('modelFeed.applicants')}</div>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {(item.currency ?? "€") + item.compensation}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Button
                      className="gap-2"
                      onClick={(e) => {
                        applyToCampaign(item);
                      }}
                    >
                      <ThumbsUp className="w-4 h-4" /> {t('modelFeed.apply')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <SwipeDeck items={uiCampaigns} onApply={applyToCampaign} onSkip={skipCampaign} onSelect={handleCampaignClick} t={t} />
        )}

        {/* Matches / Chat preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-40">
          <RecentMatches />
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5" /> {t('modelFeed.rateAgency')}
              </div>
              <p className="text-sm text-slate-600">
                {t('modelFeed.howWasJob')} <span className="font-medium">Streetwear Labs</span>?
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Button key={i} size="icon" variant="outline" className="rounded-full">
                    <Star className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              <Button className="w-full">{t('modelFeed.submitRating')}</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-48" />
      </div>
    </div>
  );
}

// --- Small components ---
function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
        done ? "bg-emerald-50 border-emerald-200" : "bg-white"
      }`}
    >
      <CheckCircle2 className={`w-4 h-4 ${done ? "text-emerald-600" : "text-slate-400"}`} />
      <span className={`text-sm ${done ? "text-emerald-800" : "text-slate-700"}`}>{label}</span>
    </div>
  );
}

// --- Swipe Deck ---
function SwipeDeck({
  items,
  onApply,
  onSkip,
  onSelect,
  t,
}: {
  items: Campaign[];
  onApply: (campaign: Campaign) => void; // changed from id:number
  onSkip: (id: number) => void;
  onSelect?: (c: Campaign) => void;
  t: (key: string) => string;
}) {
  const [index, setIndex] = useState(0);
  const safeItems = Array.isArray(items) ? items : [];
  const current = safeItems[index];

  if (!current) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-slate-600">
          {t('modelFeed.noMoreJobs')}
        </CardContent>
      </Card>
    );
  }

  const safeDeadline =
    current.deadline && !Number.isNaN(new Date(current.deadline).getTime())
      ? current.deadline
      : undefined;
  const safeStart =
    current.startDate && !Number.isNaN(new Date(current.startDate).getTime())
      ? current.startDate
      : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <Card
        className="relative cursor-pointer"
        onClick={() => onSelect?.(current)}
      >
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-slate-900 font-semibold text-lg">{current.title ?? t('modelFeed.untitled')}</div>
              <div className="text-sm text-slate-600">{current.agency ?? t('modelFeed.unknownAgency')}</div>
            </div>
            <Badge variant="secondary">{current.tags?.[0] ?? t('modelFeed.open')}</Badge>
          </div>

          <p className="text-slate-700 text-sm">{current.description ?? t('modelFeed.noDescription')}</p>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {current.city ?? t('modelFeed.noLocation')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {safeDeadline ? <>{t('modelFeed.deadline')} {fmtDate(safeDeadline)} ({daysUntil(safeDeadline)}d)</> : `${t('modelFeed.deadline')} —`}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
{t('modelFeed.start')}: {fmtDate(safeStart)}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> {money(current.compensation, current.currency)}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevent card click
                if (onApply) onApply(current);
                setIndex((i) => i + 1);
              }}
            >
              <ThumbsUp className="w-4 h-4" /> {t('modelFeed.apply')}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevent card click
                onSkip(current.id);
                setIndex((i) => i + 1);
              }}
            >
              <ThumbsDown className="w-4 h-4" /> {t('modelFeed.pass')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
