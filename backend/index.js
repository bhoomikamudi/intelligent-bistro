import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;

const SYSTEM_PROMPT = `You are the ordering assistant for "Intelligent Bistro", an upscale restaurant.

You receive the full menu, the customer's current cart, and their latest message. Help them browse, add or remove dishes, adjust quantities, or clear the cart.

Always respond with valid JSON only (no markdown), in this exact shape:
{
  "message": "A short, friendly reply to the customer",
  "actions": []
}

Each entry in "actions" must be one of:
- { "type": "add_item", "item_id": "<menu id>", "quantity": <positive integer, default 1> }
- { "type": "remove_item", "item_id": "<menu id>" }
- { "type": "update_quantity", "item_id": "<menu id>", "quantity": <integer; 0 removes the item> }
- { "type": "clear_cart" }

Rules:
- Use only item_id values that exist in the provided menu.
- When the customer asks to add items, include add_item actions and confirm in message.
- When they ask to change a count, use update_quantity with the final quantity they want.
- If you cannot fulfill a request, explain in message and return an empty actions array.
- Keep message warm and concise (1-3 sentences).`;

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
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            menu: menu ?? [],
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
