import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;

const SYSTEM_PROMPT_BASE = `You are the ordering assistant for "Intelligent Bistro", an upscale dark-table bistro.

You receive the customer's current cart and latest message. The COMPLETE menu is listed below — always use it as your source of truth for item names, ids, descriptions, and prices.

Always respond with valid JSON only (no markdown fences), in this exact shape:
{
  "message": "A friendly reply to the customer",
  "actions": []
}

Each entry in "actions" must be one of:
- { "type": "add_item", "item_id": "<menu id>", "quantity": <positive integer, default 1> }
- { "type": "remove_item", "item_id": "<menu id>" }
- { "type": "update_quantity", "item_id": "<menu id>", "quantity": <integer; 0 removes the item> }
- { "type": "clear_cart" }

Rules:
- Use only item_id values from the menu below.
- When the customer asks to add items, include add_item actions and confirm in message.
- When they ask to change a count, use update_quantity with the final quantity they want.
- If you cannot fulfill a request, explain in message and return an empty actions array.
- Keep message warm and concise unless listing the menu.

MENU QUESTIONS (critical):
- If they ask "what do you have", "show me the menu", "what's on the menu", or similar, list EVERY item from the menu below, grouped by category.
- For each item include: emoji, name, price, and a short phrase from the description. Use line breaks between categories.
- Do not invent items. Do not omit categories or items.`;

function formatMenuForPrompt(menu) {
  if (!Array.isArray(menu) || menu.length === 0) {
    return "(No menu items provided.)";
  }

  const byCategory = new Map();
  for (const item of menu) {
    const category = item.category || "Menu";
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(item);
  }

  const lines = [];
  for (const [category, items] of byCategory) {
    lines.push(`\n## ${category}`);
    for (const item of items) {
      const emoji = item.emoji ? `${item.emoji} ` : "";
      const price = typeof item.price === "number" ? `$${item.price}` : "";
      lines.push(
        `- ${emoji}${item.name} (id: ${item.id}) — ${price} — ${item.description ?? ""}`.trim(),
      );
    }
  }
  return lines.join("\n");
}

function buildSystemPrompt(menu) {
  return `${SYSTEM_PROMPT_BASE}\n\n---\nFULL MENU:\n${formatMenuForPrompt(menu)}`;
}

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/chat", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const { message, cart, menu } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(menu) },
        {
          role: "user",
          content: JSON.stringify({
            cart: cart ?? [],
            user_message: message,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return res.status(502).json({ error: "Empty response from OpenAI" });
    }

    const parsed = JSON.parse(raw);
    const reply =
      typeof parsed.message === "string" ? parsed.message : "How can I help with your order?";
    const actions = Array.isArray(parsed.actions) ? parsed.actions : [];

    res.json({ message: reply, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
