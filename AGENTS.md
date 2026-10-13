# App Protospace

- This repository is a reusable app template and its live Hello Løftet example.
- Keep local services on loopback. VPS routing, secrets and approved Compose topology belong to server-infrastructure.
- Apps are private through Tailscale by default. Public exposure is an explicit operator change, never a side effect of an app merge.
- Do not add the Docker socket, privileged mode, host mounts, shared infrastructure networks or credentials to this app.
- Run npm run check after code changes. Verify the container using docker compose up -d --build --wait and npm run smoke.
- The example is stateless. New durable storage, migrations and external integrations need explicit design and operator setup.
- Never claim a deployment succeeded without checking its health and recorded commit.
