# Connecting a PDS

A Personal Data Server (PDS) stores an account's AT Protocol repository. This template connects to an existing PDS; it does not install one or create an account.

## 1. Choose a PDS and test account

Choose whichever fits your project. The template does not require the shared service.

| Option                    | What you need                                                                           | Good for                                                   |
| ------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Shared hackathon test PDS | A test account from Edvin and [Tailscale access](tailscale.md); no local Docker needed. | A quick start and experiments between teammates' apps.     |
| Local sandbox             | Docker with Compose, Node.js and the public `local-sandbox` repository.                 | Independent experiments with disposable accounts and data. |
| Your own PDS or provider  | A test account and app password on a PDS you can reach.                                 | Continuing with your existing setup.                       |

For the shared service, use `https://pds.hackaton.demokratiloftet.no`. This is a private test environment; do not assume its identities or records are available on the public network. Each team can use a separate test account. Apps do not need to use the same PDS to interoperate: they need to locate the relevant records and understand the same format.

For your own provider, use the HTTPS service URL of the PDS that hosts your test account. Your account handle is not necessarily its PDS address. Get an app password from that account's settings.

Use synthetic test data. Records on a public PDS are generally publicly readable; an app password grants access to the account and belongs only in your local configuration.

### Run the local sandbox instead

[`local-sandbox`](https://github.com/demokratiloftet/local-sandbox) is a separate Docker environment containing a real PDS, a local PLC identity directory and two synthetic accounts. The repository is public: clone it directly, with no GitHub invitation or Tailscale access needed.

With Docker running and Node.js 24.17.0 installed, run these commands in a separate directory from your app:

```sh
git clone https://github.com/demokratiloftet/local-sandbox.git
cd local-sandbox
npm ci
npm run build
npm run up
npm run verify
```

Leave the sandbox running. Back in your **app repository**, copy `.env.example` to `.env` and set:

```dotenv
PDS_URL=http://127.0.0.1:2583
PDS_IDENTIFIER=organiser.test
PDS_APP_PASSWORD=local-sandbox-only
```

These are disposable fixture credentials, not real account credentials. The record script accepts this local test-account password. The second fixture account is `issuer.test`, with the same password. Restart `pnpm dev` and run `pnpm pds:demo` in the app repository, just as with the shared service.

No Tailscale is needed. Several apps on your machine can use this local PDS. The sandbox is isolated from the public network and is not a complete Bluesky app/feed service. **Accounts, DIDs and records reset whenever the sandbox restarts.** Keep repeatable test data in fixture code. To stop it, run `npm run down` in the sandbox repository.

## 2. Configure the app

```sh
cp .env.example .env
```

Uncomment and fill in these entries in `.env`:

```dotenv
PDS_URL=https://your-pds.example
PDS_IDENTIFIER=your-test-account.example
PDS_APP_PASSWORD=your-test-account-app-password
```

The example values are placeholders. `PDS_URL` alone is enough for the connection check; the other two values are used only by the record script. Neither the page nor the Node API logs you in automatically.

If you chose the local sandbox above, keep those local values instead of these placeholders.

Restart `pnpm dev`, then reload the page. **PDS is reachable** means the API successfully called `com.atproto.server.describeServer`. You can also open http://127.0.0.1:5173/api/sandbox to see the result. If it is unavailable, check the service address and, for the shared test PDS, your Tailscale connection.

`pnpm dev`, `pnpm start` and `pnpm pds:demo` load `.env`. Environment variables already set in your shell take precedence. `PDS_PUBLIC_URL` is optional metadata for the browser if the service uses a different internal address. Never use a `VITE_` prefix for credentials: those variables are included in browser code.

## 3. Write, read and remove a record

```sh
pnpm pds:demo
```

[`scripts/pds-demo.mjs`](../scripts/pds-demo.mjs) performs this sequence:

1. `com.atproto.server.createSession` authenticates the test account.
2. `com.atproto.repo.putRecord` stores a note with a unique key in `no.demokratiloftet.hackathon.note`.
3. `com.atproto.repo.getRecord` reads it back **without authentication** and checks the contents.
4. `com.atproto.repo.deleteRecord` removes the test record, including when read verification fails.

The terminal prints the `at://` record address and confirms removal. Passwords and session tokens are not printed. If the process is interrupted or deletion fails, a synthetic note can remain on the account; the script will not report successful removal in that case.

The script deliberately requires an explicit `PDS_URL` so credentials go to the service you chose. Use HTTPS for a remote PDS; HTTP is accepted only on loopback for local development.

## Switching environments or hosting the app

PDS choice and app hosting are separate decisions. You can develop the app on your laptop against either a local or remote PDS.

To switch PDS, update the service URL and credentials, restart the app and create test data in the new account. Accounts, DIDs and records are **not migrated automatically**; update any saved record addresses or account references too.

A hosted app needs a PDS its server can reach. `127.0.0.1` on a VPS points to that VPS, not your laptop. For hackathon hosting, agree PDS connectivity with Edvin; the default shared setup connects to the hackathon PDS. Do not expose the disposable local sandbox to make a hosted app reach it.

## Build on the example

A record is addressed as `at://<account-DID>/<collection>/<record-key>`. Another app can read it from that account's PDS using `getRecord`, or list a collection with `listRecords`. Both apps need to understand the record's fields and meaning.

The note example uses `validate: false` for its experimental collection. For your own app, choose a namespace you control, define a [Lexicon](https://atproto.com/specs/lexicon), and agree the schema with other apps you want to interoperate with. Creating a record does not automatically put it into Bluesky's feed or make other apps support it.

The app-password script is a development example. For user-facing browser sign-in, integrate [AT Protocol OAuth](https://atproto.com/specs/oauth), with per-user sessions and the permissions your app needs. OAuth, account discovery, indexing across users and app-specific storage are further work; the starter does not provide them yet.
