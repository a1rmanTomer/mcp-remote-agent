import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeSSHCommand } from "../services/ssh.service.js";

export function registerSystemTools(server: McpServer): void {
  // Tool 1: Fetch host OS telemetry metrics
  server.tool(
    "get_system_metrics",
    "Retrieves CPU load, RAM usage, and Disk space metrics from the remote server.",
    {},
    async () => {
      try {
        const command = `echo "--- Memory Usage ---" && free -h && echo "\n--- Disk Space ---" && df -h / && echo "\n--- CPU Load & Uptime ---" && uptime`;
        const result = await executeSSHCommand(command);
        return {
          content: [{ type: "text", text: `System Metrics:\n${result}` }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );
}
