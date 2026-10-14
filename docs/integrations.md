# Connecting a PDS

A Personal Data Server (PDS) stores an account's AT Protocol repository. This template connects to an existing PDS; it does not install one or create an account.

## 1. Choose a PDS and test account

- **Your own PDS or provider:** use the HTTPS service URL of the PDS hosting your test account. Your account handle is not necessarily its PDS address. Get an app password from that account's settings.
- **Shared hackathon test PDS:** ask Edvin for a test account and [Tailscale access](tailscale.md). Its URL is `https://pds.hackaton.demokratiloftet.no`. This is a private test environment; do not assume its identities or records are available on the public network.
- **A local PDS:** configure its loopback HTTP address and a local test account. Running a local PDS is a separate setup.

Use synthetic test data. Records on a public PDS are generally publicly readable; an app password grants access to the account and belongs only in your local configuration.

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

## Build on the example

A record is addressed as `at://<account-DID>/<collection>/<record-key>`. Another app can read it from that account's PDS using `getRecord`, or list a collection with `listRecords`. Both apps need to understand the record's fields and meaning.

The note example uses `validate: false` for its experimental collection. For your own app, choose a namespace you control, define a [Lexicon](https://atproto.com/specs/lexicon), and agree the schema with other apps you want to interoperate with. Creating a record does not automatically put it into Bluesky's feed or make other apps support it.

The app-password script is a development example. For user-facing browser sign-in, integrate [AT Protocol OAuth](https://atproto.com/specs/oauth), with per-user sessions and the permissions your app needs. OAuth, account discovery, indexing across users and app-specific storage are further work; the starter does not provide them yet.
