#!/usr/bin/env bash
set -euo pipefail

# Append the agent-device environment variables to the user's shell profile.
# Idempotent: if the marker block is already present, the script does nothing.
# Used by the agent-device-configuration skill.

MARKER="# Agent-device"
read -r -d '' BLOCK <<'EOF' || true
# Agent-device
export AGENT_DEVICE_IOS_TEAM_ID=22QJ8UJ64H
export AGENT_DEVICE_IOS_BUNDLE_ID=com.lastminute.agentdevice.runner
EOF

# Pick the profile file for the current login shell.
shell_name="$(basename "${SHELL:-}")"
case "${shell_name}" in
  zsh)  PROFILE="${HOME}/.zshrc" ;;
  bash)
    if [ -f "${HOME}/.bash_profile" ]; then
      PROFILE="${HOME}/.bash_profile"
    else
      PROFILE="${HOME}/.bashrc"
    fi
    ;;
  *)    PROFILE="${HOME}/.zshrc" ;;  # default to zsh on macOS
esac

if [ -f "${PROFILE}" ] && grep -qF "${MARKER}" "${PROFILE}"; then
  echo "agent-device env vars already present in ${PROFILE}; nothing to do."
  exit 0
fi

# Ensure a leading newline separates the block from existing content.
{
  echo ""
  echo "${BLOCK}"
} >> "${PROFILE}"

echo "Added agent-device env vars to ${PROFILE}."
echo "Run 'source ${PROFILE}' or open a new terminal to load them."
