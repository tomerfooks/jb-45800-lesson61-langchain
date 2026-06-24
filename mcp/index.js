import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mymcp",
  version: "1.0.0",
});

server.registerTool(
  "get-weather",
  {
    title: "Get Weather",
    description: "Get the current weather for a given location.",
    inputSchema: z.object({
      location: z.string(),
    }),
  },
  async (input) => {
    const weather = { temperature: 25, condition: "מעולה" };
    return {
      content: [
        { type: "text", text: JSON.stringify(weather) },
      ],
    };
  },
);

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("MCP server started on stdio transport.");
});
