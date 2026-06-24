import "dotenv/config";
import express from "express";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import getWeather from "./tools/getWeather.js";

const app = express();
app.use(express.json());

app.use(express.static("frontend"));

const model = new ChatOpenAI({
  model: process.env.LLM_MODEL ?? "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.LLM_API_KEY ?? "",
  configuration: { baseURL: process.env.LLM_BASE_URL },
});

const agent = createReactAgent({
  llm: model,
  tools: [getWeather],
});

app.post("/ask", async (req, res) => {
  const question = req.body?.question;
  const controller = new AbortController();
  const result = await agent.invoke(
    {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that can answer questions about the weather. You always use Emojis!",
        },
        { role: "user", content: question },
      ],
    },
    { signal: controller.signal },
  );
  try {
    const messages = result.messages;
    const last = messages[messages.length - 1];
    const answer = !last
      ? "No response from agent."
      : typeof last.content === "string"
        ? last.content
        : JSON.stringify(last.content);
    res.json({ answer });
  } catch (err) {
    res.status(504).json({ error: `Agent failed.` });
  }
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`🚀 Agent HTTP server listening on http://localhost:${PORT}`);
});
