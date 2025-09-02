import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Film,
  Heart,
  MapPin,
  Star,
  ThumbsDown,
  ThumbsUp,
  User2,
  Video as VideoIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import NotificationsCard from "./NotificationCard";
import RecentMatches from "./RecentMatches";

import { useCampaignStore } from "../stores/campaignStore";
// import { getModelProfile } from "@/services/modelService"; // not used currently

// --- Types coming from backend (snake_case) ---
type BackendCampaign = {
  id: number;
  title: string;
  agency_name?: string; // backend name
  agency?: string; // sometimes already camel? keep both safe
  city: string;
  address?: string;
  start_date: string; // ISO
  end_date?: string; // ISO
  deadline: string; // ISO
  compensation: number;
  currency?: string;
  gender_preference: "any" | "women" | "men";
  application_count?: number;
  description: string;
  tags?: string[];
};

// --- UI Type (camelCase) ---
interface Campaign {
  id: number;
  title: string;
  agency: string;
  city: string;
  address?: string;
  startDate: string; // ISO
  endDate?: string; // ISO
  deadline: string; // ISO
  compensation: number;
  currency?: string; // e.g. "€"
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

const mapToUICampaign = (c: BackendCampaign): Campaign => ({
  id: c.id,
  title: c.title,
  agency: c.agency ?? c.agency_name ?? "Unknown Agency",
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

// --- Component ---
export default function MainFeedScreenModel() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "swipe">("list");
  const { campaigns, fetchCampaigns } = useCampaignStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Profile completion mock
  const profile = {
    photo: false,
    age: 24,
    height: "1.75m",
    measurements: "84-62-90",
    video: true,
    category: "Model",
    city: "Milano, IT",
  };

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.photo,
      !!profile.age,
      !!profile.height,
      !!profile.measurements,
      profile.video,
      !!profile.category,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  // …inside MainFeedScreenModel, replace the uiCampaigns useMemo with this:
  const uiCampaigns = useMemo<Campaign[]>(() => {
    const raw = (Array.isArray(campaigns) ? campaigns : []) as BackendCampaign[];

    const normalized = raw
      .map(mapToUICampaign)
      // guard against bad/empty date strings
      .filter((c) => c.deadline && !Number.isNaN(new Date(c.deadline).getTime()))
      // keep only future/today
      .filter((c) => isFutureOrToday(c.deadline))
      // sort by nearest deadline
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return normalized.slice(0, 3);
  }, [campaigns]);


  // --- Actions (placeholders) ---
  const applyToCampaign = (id: number) => {
    alert(`Applied to #${id}`);
  };

  const skipCampaign = (id: number) => {
    alert(`Skipped #${id}`);
  };

  const uploadVideo = () => {
    alert("Open 30s vertical video uploader");
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-50">
      {/* Topbar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User2 className="w-5 h-5 text-slate-700" />
            <div>
              <div className="text-sm text-slate-500">Welcome back</div>
              <div className="font-semibold text-slate-900">
                Sarah Johnson · <span className="text-slate-600">Model</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, agencies, cities"
                className="w-72"
              />
            </div>
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
                <div className="font-semibold text-slate-900">Profile completeness</div>
                <div className="text-sm text-slate-500">{completion}%</div>
              </div>
              <Progress value={completion} className="mb-4" />
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <ChecklistItem done={profile.photo} label="Profile photo" />
                <ChecklistItem done={!!profile.age} label="Age" />
                <ChecklistItem done={!!profile.height} label="Height" />
                <ChecklistItem done={!!profile.measurements} label="Measurements" />
                <ChecklistItem done={profile.video} label="30s intro video" />
                <ChecklistItem done={!!profile.category} label="Category selected" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" className="gap-2">
                  <User2 className="w-4 h-4" />
                  Edit profile
                </Button>
              </div>
            </CardContent>
          </Card>
          <NotificationsCard />
        </div>

        {/* Video uploader */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5" />
                <div className="font-semibold">30s Vertical Intro Video</div>
              </div>
              <Button onClick={uploadVideo} className="gap-2">
                <VideoIcon className="w-4 h-4" />
                Upload
              </Button>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center bg-slate-50">
              <p className="text-sm text-slate-600">
                Drag & drop or <span className="font-semibold text-slate-900">click to select</span>. MP4/MOV, 9:16, max 60MB.
              </p>
              <p className="text-xs text-slate-500 mt-1">From desktop or phone camera.</p>
            </div>
          </CardContent>
        </Card>

        {/* Jobs feed: toggle Swipe/List */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-slate-900">Available Jobs</div>
          <div className="flex items-center gap-2">
            <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
              List
            </Button>
            <Button variant={view === "swipe" ? "default" : "outline"} onClick={() => setView("swipe")}>
              Swipe
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uiCampaigns.map((item) => {
              const deadlineDate = new Date(item.deadline);
              const diffTime = deadlineDate.getTime() - new Date().getTime();
              const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const timeLeft = daysLeft > 0 ? `${daysLeft} giorni rimasti` : daysLeft === 0 ? "Oggi" : "Scaduto";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  {/* Header with title + agency + time left */}
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

                  {/* Description */}
                  <p className="text-slate-700 mb-4 leading-relaxed">{item.description}</p>

                  {/* Gender + Location */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-4 h-4 mr-2 text-center">👤</span>
                      <span>
                        {item.genderPreference === "any"
                          ? "Qualsiasi"
                          : item.genderPreference === "women"
                          ? "Femminile"
                          : "Maschile"}
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

                  {/* Start + End */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                      <span>
                        Start:{" "}
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
                          End:{" "}
                          {new Date(item.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer: deadline + applicants + budget */}
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
                      <div className="text-sm text-slate-600">{item.applicants} candidati</div>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {(item.currency ?? "€") + item.compensation}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between mt-4">
                    <Button variant="outline" className="gap-2" onClick={() => skipCampaign(item.id)}>
                      <ThumbsDown className="w-4 h-4" /> Skip
                    </Button>
                    <Button className="gap-2" onClick={() => applyToCampaign(item.id)}>
                      <ThumbsUp className="w-4 h-4" /> Apply
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <SwipeDeck items={uiCampaigns} onApply={applyToCampaign} onSkip={skipCampaign} />
        )}

        {/* Matches / Chat preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-40">
          <RecentMatches />
          {/* Rating */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="font-semibold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5" /> Rate Agency
              </div>
              <p className="text-sm text-slate-600">
                How was your last job with <span className="font-medium">Streetwear Labs</span>?
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Button key={i} size="icon" variant="outline" className="rounded-full">
                    <Star className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              <Button className="w-full">Submit rating</Button>
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

function SwipeDeck({
  items,
  onApply,
  onSkip,
}: {
  items: Campaign[];
  onApply: (id: number) => void;
  onSkip: (id: number) => void;
}) {
  const [index, setIndex] = useState(0);

  // Never trust props at runtime
  const safeItems = Array.isArray(items) ? items : [];
  const current = safeItems[index];

  if (!current) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-slate-600">
          No more jobs. Check back later.
        </CardContent>
      </Card>
    );
  }

  // Safe helpers (avoid NaN / undefined)
  const safeDeadline = current.deadline && !Number.isNaN(new Date(current.deadline).getTime())
    ? current.deadline
    : undefined;
  const safeStart = current.startDate && !Number.isNaN(new Date(current.startDate).getTime())
    ? current.startDate
    : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <Card className="relative">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-slate-900 font-semibold text-lg">{current.title ?? "Untitled"}</div>
              <div className="text-sm text-slate-600">{current.agency ?? "Unknown Agency"}</div>
            </div>
            <Badge variant="secondary">{current.tags?.[0] ?? "Open"}</Badge>
          </div>

          <p className="text-slate-700 text-sm">{current.description ?? "—"}</p>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {current.city ?? "—"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {safeDeadline
                ? <>Deadline {fmtDate(safeDeadline)} ({daysUntil(safeDeadline)}d)</>
                : "Deadline —"}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {safeStart ? <>Start {fmtDate(safeStart)}</> : "Start —"}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {money(current.compensation ?? 0, current.currency ?? "€")}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {current.tags?.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex md:flex-col gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => {
            onSkip(current.id);
            setIndex((i) => i + 1);
          }}
        >
          <ThumbsDown className="w-4 h-4" /> Pass
        </Button>
        <Button
          className="flex-1 gap-2"
          onClick={() => {
            onApply(current.id);
            setIndex((i) => i + 1);
          }}
        >
          <ThumbsUp className="w-4 h-4" /> Apply
        </Button>
        <Button
          variant="secondary"
          className="flex-1 gap-2"
          onClick={() => setIndex((i) => i + 1)}
        >
          <Heart className="w-4 h-4" /> Save
        </Button>
      </div>
    </div>
  );
}

