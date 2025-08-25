import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Film,
  Filter,
  Heart,
  MapPin,
  MessageSquare,
  Settings,
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
import { Switch } from "@/components/ui/switch";

// --- Types ---
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
  currency?: string; // e.g. EUR
  genderPreference: "any" | "women" | "men";
  applicants: number;
  description: string;
  tags?: string[];
}

interface PaymentRow {
  id: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  status: "Pending" | "Processing" | "Paid";
  dueDate?: string; // ISO
}

interface MatchThreadPreview {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  unread: number;
  linkedCampaign?: string;
}

// --- Mock Data ---
const campaigns: Campaign[] = [
  {
    id: 101,
    title: "Milano Fashion Lookbook",
    agency: "Alta Moda Agency",
    city: "Milano",
    address: "Via Torino 21",
    startDate: "2025-09-03",
    endDate: "2025-09-05",
    deadline: "2025-08-25",
    compensation: 650,
    currency: "€",
    genderPreference: "women",
    applicants: 23,
    description:
      "Shooting lookbook FW for boutique brand; requires confident runway walk and posing.",
    tags: ["Lookbook", "Runway", "FW25"],
  },
  {
    id: 102,
    title: "Tech Expo Hostess",
    agency: "ExpoWorks",
    city: "Bologna",
    startDate: "2025-09-12",
    endDate: "2025-09-13",
    deadline: "2025-09-01",
    compensation: 300,
    currency: "€",
    genderPreference: "any",
    applicants: 41,
    description: "Assist stand visitors, basic product brief, shift-based scheduling.",
    tags: ["Hostess", "Expo"],
  },
  {
    id: 103,
    title: "E-commerce Studio Model",
    agency: "PixelHaus",
    city: "Torino",
    startDate: "2025-08-28",
    deadline: "2025-08-20",
    compensation: 400,
    currency: "€",
    genderPreference: "women",
    applicants: 11,
    description: "Half-day studio shoot for catalog images. Wardrobe provided.",
    tags: ["Studio", "Catalog"],
  },
];

const payments: PaymentRow[] = [
  { id: "p1", campaignTitle: "Streetwear Capsule", amount: 350, currency: "€", status: "Paid" },
  { id: "p2", campaignTitle: "Cosmetics Launch", amount: 500, currency: "€", status: "Processing" },
  { id: "p3", campaignTitle: "Boutique Editorial", amount: 420, currency: "€", status: "Pending", dueDate: "2025-08-18" },
];

const matches: MatchThreadPreview[] = [
  {
    id: "t1",
    name: "Alta Moda Agency",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    lastMessage: "Ciao! Ti va una call breve per i dettagli?",
    unread: 2,
    linkedCampaign: "Milano Fashion Lookbook",
  },
  {
    id: "t2",
    name: "ExpoWorks",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    lastMessage: "Turni disponibili venerdì e sabato.",
    unread: 0,
    linkedCampaign: "Tech Expo Hostess",
  },
];

// --- Utilities ---
const daysUntil = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    : "—";

const money = (n: number, c = "€") => `${c}${n.toFixed(0)}`;

// --- Component ---
export default function MainFeedScreenModel() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "swipe">("list");
  const [notifyMatches, setNotifyMatches] = useState(true);

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
    const fields = [profile.photo, !!profile.age, !!profile.height, !!profile.measurements, profile.video, !!profile.category];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const filteredCampaigns = useMemo(() => {
    if (!query.trim()) return campaigns;
    const q = query.toLowerCase();
    return campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.agency.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [query]);

  // --- Actions (placeholders) ---
  const applyToCampaign = (id: number) => {
    // TODO: integrate API
    alert(`Applied to #${id}`);
  };

  const skipCampaign = (id: number) => {
    // TODO: tracking skip
    alert(`Skipped #${id}`);
  };

  const uploadVideo = () => {
    // TODO: open file picker / mobile capture
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
              <div className="font-semibold text-slate-900">Sarah Johnson · <span className="text-slate-600">Model</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs, agencies, cities" className="w-72" />
      
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
                <Button variant="outline" className="gap-2"><User2 className="w-4 h-4"/>Edit profile</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-900">Job alerts</div>
                <Switch checked={notifyMatches} onCheckedChange={setNotifyMatches} />
              </div>
              <p className="text-sm text-slate-600">Get notified when jobs match your profile or location.</p>
              <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Notifications {notifyMatches ? "enabled" : "disabled"}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            You’ll get a toast when a new chat appears.
          </div>
                <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-amber-600"/> 2 new matches near <strong>Milano</strong></div>
                <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-600"/> 3 deadlines within 7 days</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video uploader */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5"/>
                <div className="font-semibold">30s Vertical Intro Video</div>
              </div>
              <Button onClick={uploadVideo} className="gap-2"><VideoIcon className="w-4 h-4"/>Upload</Button>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center bg-slate-50">
              <p className="text-sm text-slate-600">Drag & drop or <span className="font-semibold text-slate-900">click to select</span>. MP4/MOV, 9:16, max 60MB.</p>
              <p className="text-xs text-slate-500 mt-1">From desktop or phone camera.</p>
            </div>
          </CardContent>
        </Card>

        {/* Jobs feed: toggle Swipe/List */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-slate-900">Available Jobs</div>
          <div className="flex items-center gap-2">
            <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>List</Button>
            <Button variant={view === "swipe" ? "default" : "outline"} onClick={() => setView("swipe")}>Swipe</Button>
          </div>
        </div>

        {view === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-slate-900 font-semibold">{c.title}</div>
                      <div className="text-sm text-slate-600">{c.agency}</div>
                    </div>
                    <Badge variant="secondary">{c.tags?.[0] ?? "New"}</Badge>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{c.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{c.city}</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4"/>Deadline {fmtDate(c.deadline)} ({daysUntil(c.deadline)}d)</div>
                    <div className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/>Start {fmtDate(c.startDate)}</div>
                    <div className="flex items-center gap-1"><DollarSign className="w-4 h-4"/>{money(c.compensation, c.currency)}</div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-slate-500">{c.applicants} applicants</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="gap-2" onClick={() => skipCampaign(c.id)}><ThumbsDown className="w-4 h-4"/>Skip</Button>
                      <Button className="gap-2" onClick={() => applyToCampaign(c.id)}><ThumbsUp className="w-4 h-4"/>Apply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <SwipeDeck items={filteredCampaigns} onApply={applyToCampaign} onSkip={skipCampaign} />
        )}

        {/* Matches / Chat preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-40">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Recent Matches</div>
                <Button variant="ghost" className="gap-1">Open Inbox <ChevronRight className="w-4 h-4"/></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {matches.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 rounded-xl border p-3 bg-white">
                    <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-lg object-cover"/>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-slate-900">{m.name}</div>
                        {m.unread > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 h-5">{m.unread}</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 line-clamp-1">{m.lastMessage}</div>
                      <div className="mt-1 text-xs text-slate-500">Linked: {m.linkedCampaign}</div>
                    </div>
                    <Button size="sm" variant="secondary">Open</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/*Rating*/}
          <Card>
            <CardContent className="p-5 space-y-3">
              <div className="font-semibold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5"/> Rate Agency</div>
              <p className="text-sm text-slate-600">How was your last job with <span className="font-medium">Streetwear Labs</span>?</p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((i) => (
                  <Button key={i} size="icon" variant="outline" className="rounded-full"><Star className="w-4 h-4"/></Button>
                ))}
              </div>
              <Button className="w-full">Submit rating</Button>
            </CardContent>
          </Card>
        </div>
        <div className="mb-48">

        </div>
      </div>
    </div>
  );
}

// --- Small components ---
function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${done ? "bg-emerald-50 border-emerald-200" : "bg-white"}`}>
      <CheckCircle2 className={`w-4 h-4 ${done ? "text-emerald-600" : "text-slate-400"}`} />
      <span className={`text-sm ${done ? "text-emerald-800" : "text-slate-700"}`}>{label}</span>
    </div>
  );
}

function Tab({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center py-2 ${active ? "text-slate-900" : "text-slate-500"}`}>
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );
}

function SwipeDeck({ items, onApply, onSkip }: { items: Campaign[]; onApply: (id: number) => void; onSkip: (id: number) => void }) {
  // Simple non-gesture stack to emulate swipe choices (extend with real gestures later)
  const [index, setIndex] = useState(0);
  const current = items[index];

  if (!current) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-slate-600">No more jobs. Check back later.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <Card className="relative">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-slate-900 font-semibold text-lg">{current.title}</div>
              <div className="text-sm text-slate-600">{current.agency}</div>
            </div>
            <Badge variant="secondary">{current.tags?.[0] ?? "Open"}</Badge>
          </div>
          <p className="text-slate-700 text-sm">{current.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{current.city}</div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4"/>Deadline {fmtDate(current.deadline)} ({daysUntil(current.deadline)}d)</div>
            <div className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/>Start {fmtDate(current.startDate)}</div>
            <div className="flex items-center gap-1"><DollarSign className="w-4 h-4"/>{money(current.compensation, current.currency)}</div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            {current.tags?.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex md:flex-col gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={() => { onSkip(current.id); setIndex((i) => i + 1); }}>
          <ThumbsDown className="w-4 h-4"/> Pass
        </Button>
        <Button className="flex-1 gap-2" onClick={() => { onApply(current.id); setIndex((i) => i + 1); }}>
          <ThumbsUp className="w-4 h-4"/> Apply
        </Button>
        <Button variant="secondary" className="flex-1 gap-2">
          <Heart className="w-4 h-4"/> Save
        </Button>
      </div>
    </div>
  );
}
