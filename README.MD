# 🚀 Remote Server Omni-Agent (MCP Server)

An AI-powered **Model Context Protocol (MCP)** server that securely connects to your remote Linux infrastructure via SSH. It empowers AI assistants (like Claude, Cursor, etc.) to act as remote sysadmins—monitoring health, managing Docker containers, and retrieving system telemetry in real-time.

## ✨ Features

This MCP server exposes four powerful tools to your AI assistant:

1. 🐳 **`list_containers`** - Retrieves a formatted table of all Docker containers (running and stopped) on the remote server.
2. 🩺 **`analyze_container_health`** - Fetches the live status and the latest 50 lines of logs for a specific container to diagnose issues.
3. 📊 **`get_system_metrics`** - Retrieves Host OS telemetry, including CPU load, RAM usage, and Disk space.
4. ⚡ **`manage_container`** - Safely performs lifecycle actions (`start`, `stop`, `restart`) on specific Docker containers.

## 🛠️ Tech Stack

- **Language:** TypeScript / Node.js
- **Protocol:** `@modelcontextprotocol/sdk` (High-Level API with Zod validation)
- **Connectivity:** `ssh2` (Supports both Password and Modern `ed25519` / `RSA` Private Keys)

---

## ⚙️ Setup & Installation

**1. Clone the repository:**

```bash
git clone https://github.com/a1rmanTomer/mcp-remote-agent
cd remote-omni-agent-mcp
```

**2. Install dependencies:**

```bash
npm install
```

**3. Build the TypeScript code:**

```bash
npx tsc
```

_(This will compile the code into the `dist/` directory)._

---

## 🔑 Configuration

Create a `.env` file in the root directory. You can use either an SSH Private Key (Recommended) or a Password.

```env
# Remote Server IP or Domain
SSH_HOST=192.168.1.100

# SSH Username (e.g., root, ubuntu, your_user)
SSH_USER=root

# OPTION A: Path to your SSH Private Key
# Supports ed25519, RSA. Can use '~' for home dir.
SSH_PRIVATE_KEY_PATH=~/.ssh/id_ed25519

# OPTION B: SSH Password (if not using a key)
# SSH_PASSWORD=your_secure_password
```

---

## 🧪 Testing Locally (MCP Inspector)

You can test the tools manually using the official MCP Inspector before connecting it to your AI:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

- Click the generated local URL (e.g., `http://localhost:5173`).
- Click **Connect**.
- Go to the **Tools** tab, select a tool (like `get_system_metrics`), and click **Run Tool**.

---

## 🤖 Connecting to AI Clients

### Cursor IDE

1. Open Cursor Settings and navigate to **Features > MCP Servers**.
2. Click **+ Add New MCP Server**.
3. **Name:** `Remote-Omni-Agent` (or whatever you prefer)
4. **Type:** `command`
5. **Command:** `node`
6. **Args:** `/absolute/path/to/this/project/dist/index.js` _(Crucial: Use the absolute path to the `dist/index.js` file)_
7. Save and ensure the status indicator turns green.

### Claude Desktop

Edit your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Remote-Omni-Agent": {
      "command": "node",
      "args": ["/absolute/path/to/this/project/dist/index.js"]
    }
  }
}
```

### Windsurf IDE

1. Open the **Windsurf Settings** (gear icon).
2. Go to **MCP Servers**.
3. Add a new server with:
   - **Name:** `Remote-Omni-Agent`
   - **Command:** `node`
   - **Args:** `/absolute/path/to/this/project/dist/index.js`

### Zed Editor

Add the following to your `settings.json`:

```json
"mcp_servers": {
  "Remote-Omni-Agent": {
    "command": "node",
    "args": ["/absolute/path/to/this/project/dist/index.js"]
  }
}
```

## 🔒 Security & Architecture Notes

- **Zero Credential Exposure:** The AI model never sees your SSH keys or passwords. Authentication happens strictly locally on your machine.
- **Least Privilege:** The AI cannot run arbitrary terminal commands. It is restricted exactly to the endpoints defined in the MCP tools.
