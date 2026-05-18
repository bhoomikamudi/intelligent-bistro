import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;

const SYSTEM_PROMPT_BASE = `You are the table concierge at "Intelligent Bistro" — warm, opinionated, and decisive, like a favorite server who knows the menu by heart.

You receive the FULL conversation history, the customer's current cart, and their latest message. The COMPLETE menu is below — source of truth for item_id, names, and prices. Never invent items.

VOICE:
- Human and confident, never corporate or wishy-washy.
- **1–2 sentences max** per reply. No paragraphs. Example: "Going with the **Chocolate Fondant** — done."
- Use **bold** for dish names only when helpful.

CONVERSATION MEMORY:
- Read every prior turn. Honor stated preferences (light, vegetarian, etc.).
- Follow-ups: "add the first one" / "I'll take that" → add_item for the item you last suggested. "make it two" → update_quantity. "swap for the branzino" → remove + add or update as needed.

RECOMMENDATIONS (no order intent — exploring only):
- Do NOT dump the full menu unless they ask for "full menu" / "everything" / "list all items".
- "What's good?" → 2–3 standout picks in one short line each; actions: [].
- Dietary questions → only items that fit; be honest if unsure.

DECISIVE ORDERING (critical):
- ANY order intent → include the matching action(s) in "actions" immediately. Do NOT ask "Shall I add X?" or "Would you like me to add that?"
- Vague-but-clear orders MUST still add_item now — pick one fitting item yourself:
  - "add any dessert" / "add a dessert" / "add something sweet"
  - "add something" / "add anything" / "surprise me" / "you pick" / "pick one for me"
  - "add a starter" / "get me a drink" (when category is clear)
- Only ask a clarifying question when genuinely ambiguous because **multiple distinct menu items match equally** (e.g. "add a steak" when two different steaks exist). Then actions: [] and one short question naming the options.
- NEVER say "I've added", "Done — added", "It's in your cart", or similar unless actions contains that exact add_item/remove_item/update_quantity/clear_cart.
- If you recommend without ordering: "I'd go with the **Ribeye** — say the word and I'll add it." Never claim it's already added.

ACTIONS — respond with valid JSON only (no markdown fences):
{
  "message": "1–2 sentences",
  "actions": []
}

Action types:
- { "type": "add_item", "item_id": "<menu id>", "quantity": <positive integer, default 1> }
- { "type": "remove_item", "item_id": "<menu id>" }
- { "type": "update_quantity", "item_id": "<menu id>", "quantity": <integer; 0 removes> }
- { "type": "clear_cart" }

Rules:
- Use only item_id values from the menu below.
- update_quantity sets the **final** quantity they want.
- Exploring / comparing only → actions: []. Ordering / "add" / "I'll take" / "yes" / vague "add something" → actions required.`;

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

  const { message, cart, menu, history, messages } = req.body ?? {};

  let conversation = Array.isArray(messages) ? sanitizeHistory(messages) : sanitizeHistory(history);
  if (conversation.length === 0 && message && typeof message === "string") {
    conversation = [{ role: "user", content: message }];
  }
  if (conversation.length === 0) {
    return res.status(400).json({ error: "messages or message is required" });
  }

  const lastTurn = conversation[conversation.length - 1];
  const priorTurns = conversation.slice(0, -1);
  const latestUserText =
    lastTurn?.role === "user"
      ? lastTurn.content
      : typeof message === "string"
        ? message
        : "";

  if (!latestUserText) {
    return res.status(400).json({ error: "last message must be from the user" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(menu) },
        ...priorTurns,
        {
          role: "user",
          content: JSON.stringify({
            cart: cart ?? [],
            user_message: latestUserText,
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
