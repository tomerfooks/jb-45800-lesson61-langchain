import "dotenv/config";
import express from "express";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

import getProducts from "./tools/getProducts.js";
import runCommand from "./tools/runCommand.js";

import loadMcpTools from "./src/loadMcpTools.js";

const app = express();

app.use(express.json());
app.use(express.static("frontend"));

const messages = [
  {
    role: "system",
    content:
      "אתה העוזר האישי שלי. הכלי העיקרי שלך, הוא היכולת להריץ פקודות. יש לך סקילים skills תחת תיקייה ./skills. ",
  },
];

const model = new ChatOpenAI({
  model: process.env.LLM_MODEL ?? "gpt-5.4-mini",
  temperature: 0,
  apiKey: process.env.LLM_API_KEY ?? "",
  configuration: { baseURL: process.env.LLM_BASE_URL },
});

// Load additional tools from the MCP (Modular Chat Platform)
const mcpTools = await loadMcpTools();

const agent = createReactAgent({
  llm: model,
  tools: [runCommand, ...mcpTools],
});

app.post("/ask", async (req, res) => {
  const question = req.body?.question;
  const controller = new AbortController();
  
  const msg = { role: "user", content: question };
  messages.push(msg);

  const result = await agent.invoke(
    { messages: messages },
    { signal: controller.signal },
  );
  try {
    const messages = result.messages;
    const last = messages[messages.length - 1];
    res.json({ answer: last?.content });
  } catch (err) {
    res.status(504).json({ error: `Agent failed.` });
  }
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`🚀 Agent HTTP server listening on http://localhost:${PORT}`);
});
