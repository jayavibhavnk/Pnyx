# Security

## Reporting

If you find a vulnerability in **Pnyx itself** (memory handling, prototype pollution, etc.), please open a **private** security advisory on the repository or email the maintainers if that is enabled.

## Scope

- **Agentfuse** and **upstream CLIs** (Claude Code, Codex, etc.) have their own threat models and update channels. Report issues in those projects to their vendors.
- Pnyx holds **task transcripts in memory** by default. Do not store secrets in prompts; treat shared memory like application logs.

## Supply chain

Pin dependencies in lockfiles for reproducible builds in production pipelines.
