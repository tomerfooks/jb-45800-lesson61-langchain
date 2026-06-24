import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new Database(join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT,
    city  TEXT
  );
`);
if (db.prepare("SELECT COUNT(*) AS n FROM customers").get().n === 0) {
  const insert = db.prepare(
    "INSERT INTO customers (name, email, city) VALUES (?, ?, ?)",
  );
  const seed = db.transaction((rows) => rows.forEach((r) => insert.run(...r)));
  seed([
    ["Alice", "alice@example.com", "Tel Aviv"],
    ["Bob", "bob@example.com", "Haifa"],
    ["Carol", "carol@example.com", "Jerusalem"],
  ]);
}

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

server.registerTool(
  "query_sql",
  {
    title: "Query SQL",
    description:
      "Run any SQL query against the local SQLite database. " +
      "SELECT returns rows; INSERT/UPDATE/DELETE/DDL return affected row info. " +
      "Use standard SQLite syntax. One statement per call.",
    inputSchema: z.object({
      sql: z.string().describe("The SQL statement to execute."),
    }),
  },
  async ({ sql }) => {
    try {
      const stmt = db.prepare(sql);
      const result = stmt.reader
        ? stmt.all()
        : (({ changes, lastInsertRowid }) => ({ changes, lastInsertRowid }))(
            stmt.run(),
          );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: `SQL error: ${err.message}` }],
      };
    }
  },
);

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("MCP server started on stdio transport.");
});
