import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeSSHCommand } from "../services/ssh.service.js";

export function registerDockerTools(server: McpServer): void {
  // Tool 1: List all containers
  server.tool(
    "list_containers",
    "Lists all running and stopped Docker containers on the remote server.",
    {},
    async () => {
      try {
        const command = `docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"`;
        const result = await executeSSHCommand(command);
        return {
          content: [{ type: "text", text: `Containers List:\n${result}` }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );

  // Tool 2: Inspect health and logs
  server.tool(
    "analyze_container_health",
    "Fetches the status and latest logs of a specific Docker container.",
    {
      containerName: z.string().describe("The name of the Docker container"),
    },
    async ({ containerName }) => {
      try {
        const command = `docker inspect --format='{{.State.Status}}' ${containerName} && docker logs --tail 50 ${containerName}`;
        const result = await executeSSHCommand(command);
        return {
          content: [
            {
              type: "text",
              text: `Container: ${containerName}\nStatus & Logs:\n${result}`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );

  // Tool 3: Lifecycle management (start/stop/restart)
  server.tool(
    "manage_container",
    "Starts, stops, or restarts a specific Docker container.",
    {
      containerName: z.string().describe("The name of the Docker container"),
      action: z
        .enum(["start", "stop", "restart"])
        .describe("The action to perform on the container"),
    },
    async ({ containerName, action }) => {
      try {
        const command = `docker ${action} ${containerName}`;
        const result = await executeSSHCommand(command);
        return {
          content: [
            {
              type: "text",
              text: `Successfully executed '${action}' on container '${containerName}'.\nOutput: ${result}`,
            },
          ],
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
