import { getBaseUrl } from "./utils/baseUrl";


export async function addFavorite(modelId: number) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ modelId }),
  });
  return res.json();
}

  export async function isFavorite(modelId: number, token: string) {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/favorite/${modelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isFavorite;
  }

  export async function removeFavorite(modelId: number, token: string) {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modelId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.msg || "Failed to remove favorite");
    return data;
  }