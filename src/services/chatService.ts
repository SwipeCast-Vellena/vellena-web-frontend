// chatService.ts
export type ServerMessage = {
  id: string;
  text: string;
  senderUid?: string;
  senderBackendId?: number;
  type?: "text" | "image" | "file";
  attachmentUrl?: string | null;
  createdAt?: { seconds: number; nanoseconds: number } | string | null;
  readBy?: string[];
};

export type MessageView = { 
  id: string; 
  text: string; 
  isMe: boolean; 
  timestamp: string 
};

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export class ChatService {
  private static getToken(): string {
    return localStorage.getItem("token") || "";
  }

  private static getHeaders(): Record<string, string> {
    const token = this.getToken();
    return { 
      "Content-Type": "application/json", 
      ...(token ? { Authorization: `Bearer ${token}` } : {}) 
    };
  }

  static formatTimestamp(createdAt: any): string {
    if (!createdAt) return "";
    if (typeof createdAt === "object" && createdAt.seconds != null) {
      const d = new Date(createdAt.seconds * 1000 + (createdAt.nanoseconds || 0) / 1e6);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (typeof createdAt === "string") {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    try { 
      const d = new Date(createdAt); 
      return !isNaN(d.getTime()) ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""; 
    } catch { 
      return ""; 
    }
  }

  static toViewMessage(m: ServerMessage): MessageView {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
    const isMe =
      (typeof m.senderBackendId === "number" && m.senderBackendId === currentUser.id) ||
      (typeof m.senderUid === "string" && m.senderUid === `u${currentUser.id}`);
  
    return {
      id: m.id,
      text: m.text || (m.attachmentUrl ? "(attachment)" : ""),
      isMe,
      timestamp: this.formatTimestamp(m.createdAt),
    };
  }

  private static async safeParse(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try { 
        return { ok: true, json: await res.json(), text: null }; 
      } catch (err) { 
        return { ok: false, json: null, text: await res.text() }; 
      }
    } else {
      const text = await res.text();
      return { ok: false, json: null, text };
    }
  }

  static async fetchMessages(chatId: string): Promise<{ 
    success: boolean; 
    messages?: MessageView[]; 
    title?: string; 
    error?: string 
  }> {
    if (!chatId) return { success: false, error: "No chat ID provided" };
    
    try {
      const url = `${API_BASE}/api/chat/${encodeURIComponent(chatId)}/messages`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const parsed = await this.safeParse(res);

      if (!res.ok || !parsed.ok || !parsed.json) {
        console.error("fetchMessages error:", parsed);
        return { success: false, error: "Failed to fetch messages" };
      }

      const j = parsed.json;
      if (!j.success || !Array.isArray(j.messages)) {
        console.error("fetchMessages bad shape:", j);
        return { success: false, error: "Invalid response format" };
      }

      return {
        success: true,
        messages: j.messages.map((m: ServerMessage) => this.toViewMessage(m)),
        title: j.title
      };
    } catch (err) {
      console.error("fetchMessages error:", err);
      return { success: false, error: "Network error" };
    }
  }

  static async sendMessage(chatId: string, text: string): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    if (!chatId || !text.trim()) {
      return { success: false, error: "Invalid chat ID or message text" };
    }

    try {
      const url = `${API_BASE}/api/chat/${encodeURIComponent(chatId)}/message`;
      const res = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ text, type: "text" }),
      });

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        if (res.ok && j && j.ok) {
          return { success: true, messageId: j.messageId };
        } else {
          console.error("sendMessage failed:", j);
          return { success: false, error: "Failed to send message" };
        }
      } else {
        const body = await res.text();
        console.error("sendMessage non-json:", res.status, body.slice(0, 200));
        return { success: false, error: "Invalid server response" };
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      return { success: false, error: "Network error" };
    }
  }

  static createOptimisticMessage(text: string): MessageView {
    return {
      id: `tmp-${Date.now()}`,
      text,
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
}