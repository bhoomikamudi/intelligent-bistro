import { MenuItemWithCategory } from "@/data/menu";

export type ChatCartAction =
  | { type: "add_item"; item_id: string; quantity?: number }
  | { type: "remove_item"; item_id: string }
  | { type: "update_quantity"; item_id: string; quantity: number }
  | { type: "clear_cart" };

export type ChatResponse = {
  message: string;
  actions: ChatCartAction[];
};

export type ChatRequest = {
  message: string;
  cart: { item_id: string; quantity: number; name: string; price: number }[];
  menu: MenuItemWithCategory[];
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Chat request failed");
  }

  return {
    message: data.message ?? "",
    actions: Array.isArray(data.actions) ? data.actions : [],
  };
}
