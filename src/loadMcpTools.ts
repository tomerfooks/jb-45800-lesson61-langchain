import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function loadMcpTools() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["mcp/index.js"],
  });

  const mcpClient = new Client({
    name: "langchain-agent",
    version: "1.0.0",
  });

  await mcpClient.connect(transport);
  const { tools } = await mcpClient.listTools();

  return tools.map((t) => {
    const schemaProps: Record<string, z.ZodTypeAny> = {};
    if (t.inputSchema?.properties) {
      for (const [key, val] of Object.entries(t.inputSchema.properties)) {
        const v = val as { type?: string };
        schemaProps[key] =
          v.type === "number" ? z.number() : z.string();
      }
    }

    return tool(
      async (args: Record<string, unknown>) => {
        const result = await mcpClient.callTool({
          name: t.name,
          arguments: args,
        });
        const items = (
          Array.isArray(result.content) ? result.content : []
        ) as { text?: string }[];
        return items.map((c) => c.text ?? "").join("\n");
      },
      {
        name: t.name,
        description: t.description ?? "",
        schema: z.object(schemaProps),
      },
    );
  });
}

export default loadMcpTools;