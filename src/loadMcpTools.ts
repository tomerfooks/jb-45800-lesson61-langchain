import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Turn one MCP input field into a Zod type.
// MCP tells us "number" or "string"; we default to string.
function toZodType(field: any) {
  if (field.type === "number") {
    return z.number();
  }
  return z.string();
}

// Build a Zod schema from an MCP tool's input description.
function buildSchema(inputSchema: any) {
  const shape: any = {};
  const properties = inputSchema?.properties ?? {};

  for (const name in properties) {
    shape[name] = toZodType(properties[name]);
  }

  return z.object(shape);
}

// Pull the text out of an MCP tool result.
function readText(result: any) {
  const parts = result.content ?? [];
  return parts.map((part: any) => part.text ?? "").join("\n");
}

async function loadMcpTools() {
  // Start the MCP server (mcp/index.js) and connect to it.
  const transport = new StdioClientTransport({
    command: "node",
    args: ["mcp/index.js"],
  });

  const mcpClient = new Client({
    name: "langchain-agent",
    version: "1.0.0",
  });

  await mcpClient.connect(transport);

  // Ask the server which tools it offers.
  const { tools } = await mcpClient.listTools();

  // Wrap each MCP tool as a LangChain tool.
  return tools.map((mcpTool) => {
    async function run(args: any) {
      const result = await mcpClient.callTool({
        name: mcpTool.name,
        arguments: args,
      });
      return readText(result);
    }

    return tool(run, {
      name: mcpTool.name,
      description: mcpTool.description ?? "",
      schema: buildSchema(mcpTool.inputSchema),
    });
  });
}

export default loadMcpTools;
