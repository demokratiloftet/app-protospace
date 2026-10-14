# Build an AT Protocol app

Bring any idea: events, sports, a reading list, a community tool, or something entirely different. This template is an optional starting point. Use your existing stack if you already have one.

## Start

1. [Create a repository from the template](https://github.com/demokratiloftet/app-protospace/generate) in your own account or organisation. Invite your teammates there.
2. Clone it. With Node.js 24.17.0 and pnpm 11.8.0, run `pnpm install` and `pnpm dev`.
3. Open http://127.0.0.1:5173 and change `src/main.tsx`. You already have a working UI and Node API.
4. Follow [Connecting a PDS](integrations.md) to try a real record. Use your own test account or ask Edvin for access to the shared hackathon test PDS.
5. Build your feature. Run `pnpm check` before sharing your changes.

## What are we demonstrating?

Your app can write a record to a user's PDS, and another app can read and understand that same record. The two apps need an agreed record format. The sports demo shows this with an event publisher and a separate event viewer.

The starter includes a command-line record example. It does not include the sports apps, browser sign-in or a cross-user feed. A reachable PDS is not an authenticated session; the [PDS guide](integrations.md) explains the next steps.

## Share what you build

Keep your code in your team's repository and use whichever hosting works for you. If you want help running the app on the hackathon VPS, give Edvin the repository link and mention any database, external API or background-job needs. Hosting is arranged separately; creating a repository does not deploy it automatically.

The shared demo environment currently requires [Tailscale access](tailscale.md). Local development and other hosting do not.
