# AI Harness – Architecture Overview

An interactive React Flow diagram visualizing the AI Harness architecture.

![screenshot](./screenshot.png)

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## Deploy

Automatically deployed to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

**Live:** https://rifaterdemsahin.github.io/ai-harness-flow/

## Open Items

1. **Alibaba's role in External Providers** — clarify pricing or fallback behavior.
2. **"Som" under External Providers** — spelling or name unclear.
3. **"Runner" and "Runclock" in Desktop Models** — definitions needed.
4. **API keys → Key Vault edge** — should External Providers draw an edge into Key Vault in the Tools bar?
5. **"Not primary" label** — keep on Desktop Models card or replace with a visual cue?

## Stack

- Vite + React 18 + TypeScript
- @xyflow/react v12
- GitHub Pages via GitHub Actions