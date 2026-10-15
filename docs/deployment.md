# Build and share your app

## Preview the production build

```sh
pnpm check
pnpm start
# In another terminal:
pnpm smoke
```

Open http://127.0.0.1:3000. Stop `pnpm dev` first if it is using that API port. `pnpm start` loads your optional `.env` file.

## Preview with Docker

```sh
docker compose up -d --build --wait
pnpm smoke
docker compose down
```

Docker is optional. If port 3000 is busy, use `LOCAL_PORT=3001 docker compose up -d --build --wait` and `APP_URL=http://127.0.0.1:3001 pnpm smoke`.

The local Compose preview does not pass your `.env` PDS settings or credentials into the container. Configure runtime environment variables explicitly when hosting an app. The image contains the compiled UI and API; it does not contain `.env` or the command-line PDS demo.

## Hosting

You can use a Node.js or Docker host of your choice. The production server serves the UI and API together and exposes `GET /health`. It uses `PORT` (default 3000) and `HOST` (default loopback); the Docker image listens on port 3000 inside its container. Keep configuration and credentials in the host's environment settings.

GitHub Actions runs checks for pushes to `main` and pull requests. The included hackathon deployment job stays disabled in a new repository until hosting is configured. Creating a repository or pushing code alone does not publish an app.

For help with the hackathon VPS, give Edvin your repository link and describe your app's services and storage needs. The shared environment currently requires Tailscale access. Public hosting and ongoing hosting after the event need to be arranged separately.
