import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/chat", (req, res) => {
  const body = req.body ?? {};
  res.json({
    role: "assistant",
    content:
      "Chat is not wired to OpenAI yet. Set OPENAI_API_KEY in .env and extend this handler.",
    received: body,
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
