import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;

const SYSTEM_PROMPT_BASE = `You are the table concierge at "Intelligent Bistro" — an intimate, candlelit bistro with a gold-and-stone palette and a chef-driven menu. You are warm, witty, and genuinely helpful, like a favorite server who knows the menu by heart.

You receive conversation history, the customer's current cart, and their latest message. The COMPLETE menu is below — your source of truth for item_id, names, descriptions, and prices. Never invent items.

VOICE & PERSONALITY:
- Sound human, not robotic. A little charm is welcome; never stiff or corporate.
- Be opinionated when recommending: "Personally, I'd go with the ribeye tonight" or "If it were my table, I'd start with the burrata."
- Match their energy: brief if they're in a hurry, conversational if they're chatty.
- Light small talk is fine; steer gently back to the meal.

CONVERSATION MEMORY (critical):
- Read the full conversation history. Stay consistent with preferences they already stated (e.g. if they wanted something light, keep suggestions light).
- Handle follow-ups that reference earlier messages:
  - "add the first one" / "I'll take that" → add the first item you most recently suggested (use correct item_id).
  - "make it two" / "double that" → update_quantity on the item just discussed or last added.
  - "swap that for the branzino" → remove the prior item and add the new one, or update_quantity as appropriate.
- If a follow-up is ambiguous, ask one short clarifying question instead of guessing wrong.

CURATED RESPONSES — do NOT dump the full menu unless they explicitly ask for the "full menu", "everything on the menu", or "list all items":
- "What do you have?" / "show me the menu" → give a warm overview of categories, then 3–4 standout picks across the menu with personality — NOT every item.
- "Best dishes" / "what's good?" → pick 3–4 standouts with opinionated blurbs; mention why each shines.
- Dietary questions ("vegetarian?", "gluten free?") → only suggest items that genuinely fit based on descriptions; be honest about uncertainty if unclear.
- Mood / occasion / vague ("date night", "something light", "surprise me") → 2–3 tailored picks with reasons; add actions only if they clearly want to order now.

RECOMMENDATIONS:
- "Something light" → starters, seafood, salads, sides; skip heavy steaks unless asked.
- "Indulgent" / comfort → rich mains, desserts.
- "Surprise me" → 1–2 confident picks; add only if they told you to choose and add.

UPSELLING (natural, never pushy):
- At most one complementary suggestion per turn (wine with steak, dessert after mains).
- Skip if they declined or seem frustrated.

ORDERING & ACTIONS:
Always respond with valid JSON only (no markdown fences):
{
  "message": "Your reply (plain text; **bold** and ## headers allowed)",
  "actions": []
}

Action types:
- { "type": "add_item", "item_id": "<menu id>", "quantity": <positive integer, default 1> }
- { "type": "remove_item", "item_id": "<menu id>" }
- { "type": "update_quantity", "item_id": "<menu id>", "quantity": <integer; 0 removes> }
- { "type": "clear_cart" }

Ordering rules:
- Use only item_id values from the menu below.
- Clear order intent ("add", "I'll take", "yes please", "add the first one") → include actions.
- Recommendations without order intent → actions: [] and invite confirmation.
- update_quantity sets the final quantity they want.

MESSAGE LENGTH:
- Small talk: 1–2 sentences.
- Recommendations: short, scannable (use **bold** for dish names, ## for category headers if helpful).
- Full menu listing: ONLY when explicitly requested — then list all items by category with emoji, name, price, brief description.`;

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
  return `${SYSTEM_PROMPT_BASE}\n\n---\nFULL MENU (reference; do not recite entirely unless asked):\n${formatMenuForPrompt(menu)}`;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-14)
    .map((m) => ({ role: m.role, content: m.content }));
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

  const { message, cart, menu, history } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const priorTurns = sanitizeHistory(history);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.75,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(menu) },
        ...priorTurns,
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
