const fs = require('node:fs');
const path = require('node:path');

const USAGE = 'usage: node .claude/scripts/run-metrics.js <pr-number>';

const USAGE_FIELDS = [
  ['input', 'input_tokens'],
  ['output', 'output_tokens'],
  ['cacheWrite', 'cache_creation_input_tokens'],
  ['cacheRead', 'cache_read_input_tokens'],
];

function fail(message) {
  process.stderr.write(`run-metrics: ${message}\n`);
  process.exit(1);
}

function projectSlug(cwd) {
  return cwd.replace(/[^a-zA-Z0-9]/g, '-');
}

function fmtDuration(ms) {
  const seconds = Math.round(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

function fmtCount(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function listDirectories(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
  } catch {
    return [];
  }
}

function listTranscripts(dir) {
  try {
    return fs
      .readdirSync(dir)
      .filter(name => /^agent-.*\.jsonl$/.test(name))
      .sort()
      .map(name => path.join(dir, name));
  } catch {
    return [];
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function readJson(file) {
  const text = readText(file);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// NOTE: the run that OWNS the pull request is the one whose builder returned it: that is the only
// transcript match a passing mention of some other pull request cannot fake.
function classifyRun(dir, ownedPattern, mentionPattern) {
  let mentioned = false;
  for (const file of listTranscripts(dir)) {
    const text = readText(file);
    if (text === null) continue;
    if (ownedPattern.test(text)) return 'owner';
    if (mentionPattern.test(text)) mentioned = true;
  }
  return mentioned ? 'mention' : 'none';
}

function readTranscript(file) {
  const text = readText(file);
  if (text === null) return null;
  const turns = new Map();
  const toolUseIds = new Set();
  const toolCalls = new Map();
  let model = null;

  for (const line of text.split('\n')) {
    if (!line) continue;
    let record = null;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    const message = record && record.type === 'assistant' ? record.message : null;
    if (!message) continue;
    if (message.model) model = message.model;
    // NOTE: every line of one streamed turn repeats that turn's growing usage snapshot under the same
    // message id, so keeping the last snapshot per id counts the turn exactly once.
    if (message.usage) turns.set(message.id || record.requestId || `turn-${turns.size}`, message.usage);
    for (const block of Array.isArray(message.content) ? message.content : []) {
      if (block?.type !== 'tool_use' || toolUseIds.has(block.id)) continue;
      toolUseIds.add(block.id);
      toolCalls.set(block.name, (toolCalls.get(block.name) || 0) + 1);
    }
  }

  const spend = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 };
  for (const usage of turns.values()) {
    for (const [key, field] of USAGE_FIELDS) {
      const value = usage[field];
      if (typeof value === 'number' && Number.isFinite(value)) spend[key] += value;
    }
  }

  let codegraph = 0;
  for (const [name, count] of toolCalls) if (name?.includes('codegraph')) codegraph += count;

  return { model, spend, codegraph };
}

function spendTotal(spend) {
  return spend.input + spend.output + spend.cacheWrite + spend.cacheRead;
}

function buildRows(run, runDir) {
  const agents = (Array.isArray(run.workflowProgress) ? run.workflowProgress : [])
    .filter(entry => entry && entry.type === 'workflow_agent' && entry.label)
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const start = (a.entry.startedAt || a.entry.queuedAt || 0) - (b.entry.startedAt || b.entry.queuedAt || 0);
      return start !== 0 ? start : a.index - b.index;
    });

  const repeated = new Map();
  for (const { entry } of agents) repeated.set(entry.label, (repeated.get(entry.label) || 0) + 1);
  const seen = new Map();

  return agents.map(({ entry }) => {
    const occurrence = (seen.get(entry.label) || 0) + 1;
    seen.set(entry.label, occurrence);
    const name = repeated.get(entry.label) > 1 ? `${entry.label} (#${occurrence})` : entry.label;
    const transcript = entry.agentId ? readTranscript(path.join(runDir, `agent-${entry.agentId}.jsonl`)) : null;
    const ran = typeof entry.durationMs === 'number' && Number.isFinite(entry.durationMs);
    return {
      name,
      state: entry.state || 'unknown',
      blocked: entry.blocked === true,
      error: typeof entry.error === 'string' ? entry.error : null,
      model: entry.model || transcript?.model || null,
      durationMs: ran ? entry.durationMs : null,
      spend: transcript ? transcript.spend : null,
      codegraph: transcript ? transcript.codegraph : null,
    };
  });
}

function buildReport(prNumber, runId, run, rows, extraRuns) {
  const totals = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 };
  let agentMs = 0;
  let codegraph = 0;
  let ranCount = 0;

  const lines = [];
  for (const row of rows) {
    if (row.durationMs !== null) {
      agentMs += row.durationMs;
      ranCount += 1;
    }
    if (row.spend) for (const [key] of USAGE_FIELDS) totals[key] += row.spend[key];
    if (row.codegraph) codegraph += row.codegraph;

    const label =
      row.state === 'done' ? `\`${row.name}\`` : `\`${row.name}\` _(${row.state}${row.blocked ? ', blocked' : ''})_`;
    lines.push(
      `| ${label} | ${row.model || '—'} | ${row.durationMs === null ? '—' : fmtDuration(row.durationMs)} | ${
        row.spend === null ? '—' : fmtCount(spendTotal(row.spend))
      } | ${row.codegraph === null ? '—' : row.codegraph} |`,
    );
  }

  const unfinished = rows.filter(row => row.state !== 'done');
  const runMs = typeof run.durationMs === 'number' && Number.isFinite(run.durationMs) ? run.durationMs : null;

  const parts = [
    `## 📊 Run metrics — pull request #${prNumber}`,
    '',
    `\`${runId}\` · ${run.workflowName || 'workflow'} · ${run.status || 'unknown'} · ${rows.length} agent(s)`,
    '',
    '| Agent | Model | Wall-clock | Tokens | Codegraph |',
    '| --- | --- | --- | --- | --- |',
    lines.join('\n'),
    '',
    `**Totals** — ${ranCount} agent(s) ran · run wall-clock ${runMs === null ? '—' : fmtDuration(runMs)} · agent wall-clock ${fmtDuration(agentMs)} · tokens ${fmtCount(spendTotal(totals))} (input ${fmtCount(totals.input)} · output ${fmtCount(totals.output)} · cache write ${fmtCount(totals.cacheWrite)} · cache read ${fmtCount(totals.cacheRead)}) · codegraph ${codegraph} call(s)`,
  ];

  if (unfinished.length > 0) {
    parts.push('', '**Agents that did not complete**');
    for (const row of unfinished) {
      parts.push(
        `- \`${row.name}\` — ${row.state}${row.blocked ? ' (blocked)' : ''}: ${row.error || 'no reason recorded'}`,
      );
    }
  }

  if (extraRuns.length > 0) {
    parts.push(
      '',
      `_Note: ${extraRuns.length + 1} run(s) in this session are candidates for pull request #${prNumber}; the most recently started one is reported (others: ${extraRuns.join(', ')})._`,
    );
  }

  parts.push(
    '',
    "<sub>Read after the fact from the harness run record and the per-agent transcripts on disk. Wall-clock is the agent's own recorded duration; the run figure is the whole workflow, so it does not add up to the sum of the agents — review and QA overlap, and a killed run keeps counting long after its last agent stopped. Tokens are summed per turn from the transcripts — input + output + cache writes + cache reads, i.e. everything the run was billed for, not the final context size. Codegraph counts the agent's codegraph tool calls. A row with `—` has no recorded duration: it never started, or the run ended while it was still in flight.</sub>",
  );

  return parts.join('\n');
}

const prArg = process.argv[2];
if (!prArg || !/^\d+$/.test(prArg)) fail(`${USAGE} — got: ${prArg === undefined ? '(no argument)' : prArg}`);

const configDir = process.env.CLAUDE_CONFIG_DIR || (process.env.HOME ? path.join(process.env.HOME, '.claude') : null);
if (!configDir) fail('neither CLAUDE_CONFIG_DIR nor HOME is set — cannot locate the harness run records');

const sessionId = process.env.CLAUDE_CODE_SESSION_ID;
if (!sessionId) fail('CLAUDE_CODE_SESSION_ID is not set — run this in the session that ran the pipeline');

const sessionDir = path.join(configDir, 'projects', projectSlug(process.cwd()), sessionId);
const runsDir = path.join(sessionDir, 'subagents', 'workflows');
const runIds = listDirectories(runsDir);
if (runIds.length === 0) fail(`no workflow run directory under ${runsDir}`);

const ownedPattern = new RegExp(`"prUrl"\\s*:\\s*"[^"]*/pull/${prArg}(?![0-9])`);
const mentionPattern = new RegExp(`github\\.com/[^\\s"'\\\\]*/pull/${prArg}(?![0-9])`);

const owners = [];
const mentions = [];
for (const runId of runIds) {
  const kind = classifyRun(path.join(runsDir, runId), ownedPattern, mentionPattern);
  if (kind === 'owner') owners.push(runId);
  else if (kind === 'mention') mentions.push(runId);
}

const matched = owners.length > 0 ? owners : mentions;
if (matched.length === 0) {
  fail(
    `none of the ${runIds.length} run(s) in session ${sessionId} mentions pull request #${prArg} (checked: ${runIds.join(', ')})`,
  );
}

const runs = matched
  .map(runId => ({ runId, run: readJson(path.join(sessionDir, 'workflows', `${runId}.json`)) }))
  .filter(candidate => candidate.run !== null);
if (runs.length === 0) {
  fail(
    `run ${matched.join(', ')} matches pull request #${prArg} but its run record is missing under ${path.join(sessionDir, 'workflows')}`,
  );
}

runs.sort((a, b) => (b.run.startTime || 0) - (a.run.startTime || 0));
const chosen = runs[0];
const rows = buildRows(chosen.run, path.join(runsDir, chosen.runId));
if (rows.length === 0) fail(`run ${chosen.runId} records no agent for pull request #${prArg}`);

process.stdout.write(
  `${buildReport(
    prArg,
    chosen.runId,
    chosen.run,
    rows,
    runs.slice(1).map(candidate => candidate.runId),
  )}\n`,
);
