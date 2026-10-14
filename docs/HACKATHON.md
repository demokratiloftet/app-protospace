# Build today. Share a running app.

App Protospace is a working **React + TypeScript + Node.js starter**, with local development, tests, Docker and a deployment workflow. You bring the idea; the starter supplies the basic app and delivery setup. AT Protocol is optional.

## The offer

> We can help you get a small prototype running today. Start from this template, build locally, and give Edvin your repository name. After a one-time registration, pushing to main tests and deploys your app to its own HTTPS address on our VPS. Teams can also use a shared AT Protocol test PDS.

The template has already been used to create and deploy independent apps. The sports example demonstrates one app publishing an event and another reading the same PDS record. Both use an agreed experimental format; broader interoperability requires agreement with other applications. The example does not establish public federation, universal sign-in or production readiness.

## Your path from idea to URL

1. **Tell Edvin your idea and dependencies.** Mention sign-in, external APIs, database/storage or background jobs early. Arrange GitHub and Tailscale access.
2. On [App Protospace](https://github.com/demokratiloftet/app-protospace), choose **Use this template**. For shared VPS hosting, create an approved repository in `demokratiloftet` with `main` as its default branch. Edvin can create it for your team if needed. A private repo is the hackathon default.
3. Clone your new repository. Use Node **24.17.0** and pnpm **11.8.0**:

   ```sh
   pnpm install --frozen-lockfile
   pnpm doctor
   pnpm dev
   ```

   Open http://127.0.0.1:5173. Edit `src/main.tsx` for the screen and `server/app.ts` for the API. Update the app name, title and repository links. Run `pnpm check` before sharing changes.

4. **Give Edvin the repository name.** He reviews and registers it once. The registration configures the app's routing and limited deployment credentials.
5. **Keep building throughout the day.** Push to `main`, wait for green **Check and deploy** in GitHub Actions, and open `https://<repo>.hackaton.demokratiloftet.no`. The same URL serves your latest successful release.

Local work needs neither Tailscale nor VPS access. Hosted apps and the test PDS require approved Tailscale access. Participants do not need SSH or server administrator keys.

## What can we build?

| Scope                                                | Available path                                                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Small interfaces, dashboards, news/sports prototypes | Use the React screen and Node API; synthetic/sample data works immediately.                                     |
| Backend-only APIs                                    | Keep the Node server, container port 3000 and `/health`; adapt the frontend/build as needed.                    |
| Shared AT Protocol data                              | Request a dedicated team test account. Implement records and agree a format with the other apps consuming them. |
| External feeds or APIs, including AI services        | Agree credentials and outbound network access with the operator first.                                          |
| Own database, workers, sign-in/OAuth, other runtimes | Additional integration and operator setup; these are not preconfigured services in the starter.                 |
| Public internet access                               | An explicit, app-specific publishing step. Current VPS links are private.                                       |

This sandbox is for small prototypes from known teams. Registration currently caps at **ten apps total**; builds queue on one shared VPS. The default app allowance is 256 MiB RAM and 0.5 CPU. Extra registrations or heavier workloads need a capacity review. Uploaded files and local app storage are not durable by default.

## What happens next?

- **Start:** agree a small demo, get access, create the repo and register early.
- **During the day:** change code and push; ordinary updates deploy automatically. Ask Edvin when infrastructure needs change.
- **Showcase:** use your private URL from a Tailscale-connected presentation machine, with screenshots as backup.
- **Before leaving:** agree an owner, how long to keep hosting, whether to preserve test data and whether the app should become public. Long-term operation is a separate decision.

## Presenter: show the delivery path first

1. Open the starter and point to **Create your app**.
2. Show `src/main.tsx` and `server/app.ts`: UI and backend, ready to change.
3. Show a completed GitHub **Check and deploy** run and the resulting app URL.
4. Optionally show the sports pair for 30 seconds: publish, open the reader, change the venue. Explain that the PDS holds the shared record.
5. Invite teams: **“Bring me your repo name and tell me what services you need. We'll get your prototype hosted, then you can keep updating it throughout the day.”**

## Operator: register once

From the reviewed infrastructure checkout:

```sh
python3 deploy/register.py my-app --identity /path/to/your/operator-ssh-key
```

Verify the Actions result and `/health` revision before handing over the URL. Do not rerun registration on an existing or partly registered app. Normal updates use GitHub Actions; a failed startup/health check restores the previous image. This does not roll back database changes.

[Deployment details](deployment.md) · [PDS integration](integrations.md) · [Public publishing](public-apps.md)
