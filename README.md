# App Protospace

A small **React + TypeScript + Node.js** starter for building on **AT Protocol**. Start with a working UI and API, then use the included record example to connect your own idea to a Personal Data Server (PDS).

## Start locally

Use **Node.js 24.17.0** (see `.node-version`) and **pnpm 11.8.0**. If needed, install pnpm with `npm install --global pnpm@11.8.0`.

1. Select **Use this template → Create a new repository** on [GitHub](https://github.com/demokratiloftet/app-protospace). Choose your own account or organisation, then clone your new repository.
2. From that directory, run:

   ```sh
   pnpm install
   pnpm dev
   ```

3. Open **http://127.0.0.1:5173**. Edit `src/main.tsx` and see your changes immediately. The Node API runs at http://127.0.0.1:3000 and restarts when its code changes. Ctrl+C stops both.

No Docker, hosting account, PDS account or Tailscale access is needed for this step. `pnpm doctor` checks your local tools. If the ports are taken, use `DEV_PORT=5174 API_PORT=3001 pnpm dev`.

## What works out of the box?

| Included                        | What it does                                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| React UI and Node API           | A local greeting example demonstrates a browser-to-backend request.                                      |
| PDS connection check            | Set `PDS_URL` in `.env` and restart; the page checks whether that PDS is reachable.                      |
| Real AT Protocol record example | With a test account and app password, `pnpm pds:demo` writes, reads and deletes a note on your PDS.      |
| Checks and production build     | `pnpm check` runs formatting checks, types, tests and the build. Docker and GitHub Actions are included. |

Starting the app **does not create a PDS, create an account or sign you in**. The page's PDS status is a reachability check. Browser sign-in/OAuth, a feed/indexer and an app database are not implemented.

## Try your first AT Protocol record

```sh
cp .env.example .env
# Edit .env: set PDS_URL, PDS_IDENTIFIER and PDS_APP_PASSWORD.
pnpm pds:demo
```

Use the PDS that actually hosts your test account and an app password from that account. `.env` is ignored by Git; `pnpm dev`, `pnpm start` and `pnpm pds:demo` load it. Existing shell variables take precedence. Restart after changing it.

The example prints the record's `at://` address, verifies its contents and removes it. Read [Connecting a PDS](docs/integrations.md) for account choices, the data flow and how to build on the example.

## Make it yours

| File                            | Start here                                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/main.tsx`, `src/style.css` | Replace the example screen with your app.                                                                               |
| `server/app.ts`                 | Add your backend routes. The starter accepts GET/HEAD only; add request validation and authentication for write routes. |
| `scripts/pds-demo.mjs`          | Follow the login → write → read → delete example.                                                                       |
| `.env.example`                  | Document your app's configuration without credentials.                                                                  |
| `index.html`, `package.json`    | Change the title, metadata and package name. Also replace the repository links in `src/main.tsx`.                       |

The PDS stores AT Protocol records; your app supplies its own interface and behaviour. Apps can share data when they understand the same record format. This starter's temporary note is an experiment, not a published interoperable schema.

[Hackathon guide](docs/HACKATHON.md) · [PDS guide](docs/integrations.md) · [Build and hosting](docs/deployment.md) · [Contributing](CONTRIBUTING.md)

License: a reuse license has not yet been selected; there is currently no `LICENSE` file.
