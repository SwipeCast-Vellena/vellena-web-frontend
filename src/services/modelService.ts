import { getBaseUrl } from "./utils/baseUrl";
import axios from "axios";

export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  video_portfolio: string;
  description: string;
  category: 'model' | 'hostess' | 'agency' | 'photographer';
  videoThumbnail: string;
  is_pro?: number;
}

interface BackendModel {
  id: number;
  name: string;
  description?: string;
  location: string;
  category: 'model' | 'hostess' | 'agency' | 'photographer';
  video_portfolio: string;
  videoThumbnail?: string;
  age:number;
  is_pro?: number;
}

interface BackendResponse {
  models: BackendModel[];
}

// Helper: generate a thumbnail from video URL
const generateThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.currentTime = 1; // capture frame at 1 second

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg"));
      } else {
        resolve(""); // fallback
      }
    });

    video.addEventListener("error", () => resolve("")); // fallback
  });
};

export const fetchModels = async (): Promise<Profile[]> => {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem("token");

  const res = await axios.get<BackendResponse>(`${baseUrl}/api/agency/model-profiles`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // generate dynamic thumbnails if not provided
  const modelsWithThumbnails = await Promise.all(
    res.data.models.map(async (m) => ({
      id: m.id,
      name: m.name,
      description: m.description || "Modella",
      location: m.location,
      category: m.category.toLowerCase() as 'model' | 'hostess' | 'agency' | 'photographer',
      bio: m.description || "",
      age: m.age,
      video_portfolio: m.video_portfolio,
      videoThumbnail: m.videoThumbnail || (m.video_portfolio ? await generateThumbnail(m.video_portfolio) : ""),
      is_pro: m.is_pro,
    }))
  );

  return modelsWithThumbnails;
};

export async function getPendingModels(): Promise<Profile[]> {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem("token");

  const res = await fetch(`${baseUrl}/api/agency/pending-matches`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch pending models");

  const data = await res.json();

  return data.map((m: any) => ({
    id: m.id,
    name: m.name,
    description: m.description || "Pending model",
    location: m.location || "Unknown",
    category: (m.category || "model").toLowerCase() as 'model' | 'hostess' | 'agency' | 'photographer',
    bio: m.bio || m.description || "Awaiting approval",
    age: m.age || 0,
    video_portfolio: m.video_portfolio,
    videoThumbnail: m.videoThumbnail || (m.video_portfolio ? `${m.video_portfolio}#t=1` : ""),
    is_pro: m.is_pro,
  }));
}

export async function getModelProfile() {
  const baseUrl = await getBaseUrl();
  const token = localStorage.getItem("token");

  const res = await fetch(`${baseUrl}/api/model/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch model profile");

  return res.json();
}
