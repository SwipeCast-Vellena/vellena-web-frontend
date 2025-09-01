import { getBaseUrl } from "./utils/baseUrl";
import axios from "axios";


export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  videoThumbnail: string;
  description: string;
  category: 'model' | 'hostess' | 'agency'| 'photographer';
}

interface BackendModel {
    id: number;
    name: string;
    description?: string;
    location: string;
    category: 'model' | 'hostess' | 'agency'| 'photographer';
  }
  
  interface BackendResponse {
    models: BackendModel[];
  }

  export const fetchModels = async (): Promise<Profile[]> => {
    const baseUrl = await getBaseUrl();
    const token = localStorage.getItem("token");
  
    const res = await axios.get<BackendResponse>(`${baseUrl}/api/agency/model-profiles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    return res.data.models.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description || "Modella",
      location: m.location,
      category: m.category.toLowerCase() as 'model' | 'hostess' | 'agency' | 'photographer',
      bio: m.description,
      age: 0, // backend doesn’t give it → fallback
      videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    }));
  };

  export async function getPendingModels(): Promise<Profile[]> {
    const baseUrl = await getBaseUrl();
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${baseUrl}/api/agency/pending-matches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!res.ok) throw new Error("Failed to fetch pending models");
  
    const data = await res.json();
  
    // map backend rows into Profile format
    return data.map((m: any) => ({
      id: m.id,
      name: m.name,
      description: m.description || "Pending model",
      location: m.location || "Unknown",
      category: (m.category || "model").toLowerCase() as 'model' | 'hostess' | 'agency' | 'photographer',
      bio: m.bio || m.description || "Awaiting approval",
      age: m.age || 0, // fallback
      videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    }));
  }

  export async function getModelProfile() {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/model/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch model profile");
    return res.json();
  }
  