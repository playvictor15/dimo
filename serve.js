import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// 🔥 Endpoint principal da Dimo
app.post("/api/dimo", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Dimo: diga algo pra eu responder!" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          { role: "system", content: "Você é Dimo, uma IA motivacional com humor, empatia e energia positiva. Fale como um coach engraçado e amigo próximo, usando expressões carismáticas e motivacionais." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ Dimo não entendeu. Pode repetir?";
    res.json({ reply });
  } catch (err) {
    console.error("Erro no servidor Dimo:", err);
    res.status(500).json({ reply: "😵‍💫 Dimo travou um pouquinho... tenta de novo?" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Dimo está online em http://localhost:${PORT}`));
