# Bot Specification — AI Harness

> Data source for the Harness Orchestrator. The coordinator reads this spec and
> assigns compute to bots based on skills, availability, and cost.

## Bots

### Hermes
- **Role:** Primary autonomous agent
- **Skills:** Code generation, tool orchestration, Discord interaction, web research,
  file management, SSH/remote ops, Azure CLI, Grafana queries, cron scheduling,
  memory/context management
- **Runs on:** All compute hosts (Hetzner, Mac Mini, Skull Canyon, XPS, MacBook)
- **Auth:** Azure (device-code login), Grafana (API key), GitHub (SSH + PAT),
  Discord (bot token)
- **Coordination:** Hetzner is the main coordinator — assigns tasks to available
  compute based on skill match and host load

### GROKBOT
- **Role:** Secondary agent, task runner
- **Skills:** Code execution, build pipelines, test runs, deployment validation,
  monitoring alerts, log analysis
- **Runs on:** All compute hosts (Hetzner, Mac Mini, Skull Canyon, XPS, MacBook)
- **Auth:** Azure (service principal), Grafana (API key), GitHub (PAT)
- **Coordination:** Receives assignments from the coordinator; reports status back

## Compute Hosts

| Host | Location | Speed | Hermes | GROKBOT | Skills |
|---|---|---|---|---|---|
| Hetzner VPS | Datacenter (NBG1) | FAST | ✅ | ✅ | Always-on, coordinator, 4GB RAM, public IP, systemd services |
| Mac Mini | Home (UK) | FAST | ✅ | ✅ | Apple Silicon, local LLM inference, Xcode, iOS builds, Obsidian vault |
| Skull Canyon | Home (UK) | Slow | ✅ | ✅ | Intel NUC, Docker workloads, backup compute, GPU passthrough |
| XPS | Home (stays) | Variable | ✅ | ✅ | Development laptop, local coding, browser automation, stays home |
| MacBook | Mobile | Variable | ✅ | ✅ | Mobile development, Second Brain (Obsidian), on-the-go tasks |

## Authentication & Monitoring

### Azure
- **Login:** Device-code flow (interactive) or service principal (unattended)
- **Key Vault:** `dp-kv-deliverypilot` — stores all secrets (API keys, tokens, credentials)
- **Resources:** Resource group `deliverypilot-rg`, subscription `Azure subscription 1`
- **Usage:** Secret retrieval at startup, Key Vault wiring via `keyvault-env.sh`

### Grafana
- **Dashboard:** Bot health, task completion rates, compute utilization
- **Alerts:** Bot downtime, task failures, high latency, compute overload
- **Auth:** API key stored in Azure Key Vault

## Coordination Logic

The Harness Orchestrator (coordinator) runs on Hetzner and follows this flow:

1. **Read spec** — Load this bot-spec.md to know which bots and hosts are available
2. **Check health** — Query Grafana for host status and bot availability
3. **Match skills** — Assign tasks to the bot+host pair with the best skill match
4. **Balance load** — Prefer FAST hosts (Hetzner, Mac Mini) over slow ones
5. **Fallback** — If primary host is down, reassign to next available
6. **Report** — Log assignment decisions, push status to Discord channel

## Skill Matrix

| Skill | Hermes | GROKBOT | Best Host |
|---|---|---|---|
| Code generation | ✅ | ❌ | Hetzner (always-on) |
| Build & test | ✅ | ✅ | Mac Mini (fast) |
| Discord interaction | ✅ | ❌ | Hetzner (always-on) |
| Web research | ✅ | ❌ | Any |
| Monitoring alerts | ❌ | ✅ | Hetzner (always-on) |
| Log analysis | ✅ | ✅ | Hetzner |
| Azure operations | ✅ | ✅ | Hetzner |
| Local inference | ✅ | ❌ | Mac Mini (Apple Silicon) |
| Mobile tasks | ✅ | ❌ | MacBook |
| Obsidian sync | ✅ | ❌ | MacBook / Mac Mini |
| Deployment | ✅ | ✅ | Hetzner |
| Browser automation | ✅ | ❌ | XPS / MacBook |

## Version

- Spec version: 1.0.0
- Last updated: 2026-10-10
- Maintained by: Harness Orchestrator (auto-synced from diagram notes)