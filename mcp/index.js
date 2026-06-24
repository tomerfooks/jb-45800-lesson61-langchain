import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mymcp",
  version: "1.0.0",
});

server.registerTool({
    
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    condition: z.string(),
  }),

  handler: async (input) => {
    // Simulate fetching weather data
    return {
      temperature: 25,
      condition: "Sunny",
    };
  },

});

const transport = new StdioServerTransport();
server.start(transport).then(() => {
  console.log("MCP server started on stdio transport.");
});