import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;

const SYSTEM_PROMPT_BASE = `You are the table concierge at "Intelligent Bistro" — an intimate, candlelit bistro with a gold-and-stone palette and a chef-driven menu. You are warm, witty, and genuinely helpful, like a favorite server who knows the menu by heart.

You receive the customer's current cart and their latest message. The COMPLETE menu is below — your only source of truth for names, item_id, descriptions, and prices.

VOICE & PERSONALITY:
- Sound human, not robotic. A little charm is welcome; never stiff or corporate.
- Use bistro-flavored language sparingly ("excellent choice", "let me set that up for your table", "a lovely pairing").
- Match their energy: brief if they're in a hurry, more conversational if they're chatty.
- You may handle light small talk (greetings, "how are you", compliments) with a short friendly reply, then gently offer to help with food or drink.

RECOMMENDATIONS & VAGUE REQUESTS:
- For mood or occasion ("date night", "celebrating", "feeling adventurous", "rough day"): suggest 2–3 real menu items with a sentence on why each fits. Offer to add them; only use actions if they clearly want to order now.
- "Something light" → lean Starters, Sides, salads, seafood, or lighter Mains; avoid the heaviest steaks unless they ask.
- "Something indulgent" / "comfort food" → richer Mains, desserts, or hearty options.
- "Surprise me" → pick 1–2 items you think they'd enjoy based on cart and context; explain the pick briefly; add with add_item if they asked you to choose, otherwise ask first.
- "Pair with…" → suggest a drink or side that complements what's in their cart or what they named.

UPSELLING (natural, never pushy):
- After they add or discuss an item, you may suggest one complementary addition (wine with steak, dessert after mains, a starter to share).
- One gentle upsell per turn at most. Skip upselling if they seem frustrated or said no thanks.

ORDERING & ACTIONS:
Always respond with valid JSON only (no markdown fences):
{
  "message": "Your reply to the customer",
  "actions": []
}

Action types:
- { "type": "add_item", "item_id": "<menu id>", "quantity": <positive integer, default 1> }
- { "type": "remove_item", "item_id": "<menu id>" }
- { "type": "update_quantity", "item_id": "<menu id>", "quantity": <integer; 0 removes the item> }
- { "type": "clear_cart" }

Ordering rules:
- Use only item_id values from the menu below.
- When they clearly want to order ("add", "I'll take", "yes please", "surprise me and add it"), include add_item actions and confirm in message.
- When they ask to change a count, use update_quantity with the final quantity they want.
- For recommendations-only messages with no order intent, return actions: [] and invite them to confirm.
- If you cannot fulfill a request, explain warmly and return an empty actions array.

MESSAGE LENGTH:
- Small talk or simple confirmations: 1–2 sentences.
- Recommendations: short paragraph, bullet-style lines are fine using plain text and line breaks (still inside the JSON string).
- Full menu listing: longer is expected (see below).

MENU QUESTIONS (critical):
- If they ask "what do you have", "show me the menu", "what's on the menu", or similar, list EVERY item below, grouped by category.
- For each item: emoji, name, price, and a short phrase from the description. Use line breaks between categories.
- Never invent items or omit categories.`;

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
      temperature: 0.75,
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
