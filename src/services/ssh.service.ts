import { Client } from "ssh2";
import type { ConnectConfig } from "ssh2";
import fs from "fs";
import os from "os";
import path from "path";

function resolveKeyPath(keyPath: string): string {
  if (keyPath.startsWith("~/") || keyPath === "~") {
    return path.join(os.homedir(), keyPath.slice(1));
  }
  return keyPath;
}

export async function executeSSHCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    const connectConfig: ConnectConfig = {
      host: process.env.SSH_HOST as string,
      port: 22,
      username: process.env.SSH_USER as string,
    };

    if (process.env.SSH_PRIVATE_KEY_PATH) {
      try {
        const fullPath = resolveKeyPath(process.env.SSH_PRIVATE_KEY_PATH);
        connectConfig.privateKey = fs.readFileSync(fullPath);
      } catch (err: any) {
        return reject(
          new Error(`Failed to read SSH private key: ${err.message}`),
        );
      }
    } else if (process.env.SSH_PASSWORD) {
      connectConfig.password = process.env.SSH_PASSWORD as string;
    } else {
      return reject(
        new Error(
          "No SSH authentication method provided. Please set SSH_PRIVATE_KEY_PATH or SSH_PASSWORD in .env",
        ),
      );
    }

    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          let output = "";
          stream
            .on("close", () => {
              conn.end();
              resolve(output);
            })
            .on("data", (data: any) => (output += data))
            .stderr.on("data", (data: any) => (output += `ERROR: ${data}`));
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect(connectConfig);
  });
}
