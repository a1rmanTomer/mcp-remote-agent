import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { registerDockerTools } from "./tools/docker.tools.js";
import { registerSystemTools } from "./tools/system.tools.js";

// Load environment variables from .env file
dotenv.config();

// Initialize the High-Level MCP Server instance
const server = new McpServer({
  name: "Remote-Server-Omni-Agent",
  version: "2.0.0",
});

// Register grouped tools
registerDockerTools(server);
registerSystemTools(server);

// Bootstrapping server onto Stdio transport layer
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    "Remote Omni-Agent MCP Server is running and waiting for AI requests...",
  );
}

main().catch(console.error);
