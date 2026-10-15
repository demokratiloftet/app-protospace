# Build an AT Protocol app

Bring any idea: events, sports, a reading list, a community tool, or something entirely different. This template is an optional starting point. Use your existing stack if you already have one.

## Start

1. [Create a repository from the template](https://github.com/demokratiloftet/app-protospace/generate) in your own account or organisation. Invite your teammates there.
2. Clone it. With Node.js 24.17.0 and pnpm 11.8.0, run `pnpm install` and `pnpm dev`.
3. Open http://127.0.0.1:5173 and change `src/main.tsx`. You already have a working UI and Node API.
4. Choose a PDS below, then follow [Connecting a PDS](integrations.md) to try a real record.
5. Build your feature. Run `pnpm check` before sharing your changes.

## Choose where your test data lives

- **Shared hackathon PDS:** ask Edvin for a test account and Tailscale access. This is the suggested starting point if you want to avoid setting up a PDS yourself.
- **Local sandbox:** run a PDS and fixture accounts on your laptop using Docker. No Tailscale needed; accounts and records reset on restart. The separate [`local-sandbox` repository](https://github.com/demokratiloftet/local-sandbox) is public; clone it directly. [Setup commands](integrations.md#run-the-local-sandbox-instead).
- **Your own PDS/provider:** use a test account on the PDS you already use.

All three work with the template's configurable PDS connection and record example. Using our shared service is optional. Moving from local to shared does not transfer accounts or data automatically.

## What are we demonstrating?

Your app can write a record to a user's PDS, and another app can read and understand that same record. The two apps need an agreed record format. The sports demo shows this with an event publisher and a separate event viewer.

The starter includes a command-line record example. It does not include the sports apps, browser sign-in or a cross-user feed. A reachable PDS is not an authenticated session; the [PDS guide](integrations.md) explains the next steps.

## Share what you build

Keep your code in your team's repository and use whichever hosting works for you. If you want help running the app on the hackathon VPS, give Edvin the repository link and mention any database, external API or background-job needs. Hosting is arranged separately; creating a repository does not deploy it automatically.

Direct access to the shared test PDS requires [Tailscale access](tailscale.md). Apps explicitly published on public HTTPS can be visited without Tailscale. Local development with the sandbox also needs no Tailscale access.
