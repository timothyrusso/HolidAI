---
name: agent-device-configuration
summary: install and configure the agent-device MCP server
description: Install and configure agent-device — the mobile app verification toolkit for AI agents — to debug and drive iOS/Android simulators, emulators, and physical devices. Registers the MCP server and sets the required environment variables. Run once per developer.
disable-model-invocation: true
argument-hint: "[--check-only]"
allowed-tools:
  - Bash(claude *)
  - Bash(which *)
  - Bash(command -v *)
  - Bash(chmod *)
  - Bash(.claude/skills/agent-device-configuration/scripts/setup-agent-device-env.sh)
  - Read
  - Write
---

Set up [agent-device](https://github.com/callstack/agent-device), a mobile app verification toolkit for AI agents that drives iOS/Android simulators, emulators, and physical devices.

## Current Environment

- agent-device CLI on PATH: !`command -v agent-device 2>/dev/null || echo "NOT FOUND"`
- agent-device MCP registered: !`claude mcp list 2>/dev/null | grep -i agent-device || echo "NOT REGISTERED"`

If `$ARGUMENTS` contains `--check-only`, report the state above and stop. Do NOT proceed to the installation steps.

---

## Step 1: Install the agent-device CLI

The MCP server runs via the `agent-device` binary, so the CLI must be on PATH first.

- If `command -v agent-device` found nothing, install it per the official guide: https://github.com/callstack/agent-device
- If it is already found, skip this step.

Do not guess an install command — follow the guide's current instructions, then re-check with `command -v agent-device`.

## Step 2: Register the MCP server

Register agent-device as a user-scoped stdio MCP server:

```bash
claude mcp add --transport stdio --scope user agent-device -- agent-device mcp
```

If it is already registered (see Current Environment above), skip this step.

## Step 3: Environment variables

The agent-device runner needs two environment variables in the shell profile. Add them with the bundled script (idempotent — safe to re-run, skips if already present):

```bash
.claude/skills/agent-device-configuration/scripts/setup-agent-device-env.sh
```

This appends the following block to the user's `~/.zshrc` (or bash profile):

```bash
# Agent-device
export AGENT_DEVICE_IOS_TEAM_ID=22QJ8UJ64H
export AGENT_DEVICE_IOS_BUNDLE_ID=com.lastminute.agentdevice.runner
```

Remind the user to run `source ~/.zshrc` (or open a new terminal) for the vars to take effect.

## Step 4: Verification

Check and report pass/fail:

- `command -v agent-device` (CLI on PATH)
- `claude mcp list | grep -i agent-device` (MCP registered)
- Env vars present in the shell profile (the setup script reports this)

Note that the MCP connection becomes usable only after the user reloads their shell / restarts the session so the environment variables are loaded.
