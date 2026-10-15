# Contributing

For a new app, create your own repository from this template and invite your collaborators there. You do not need write access to this repository to build an app.

For improvements to the template:

1. Create a branch (or fork the repository) and make a focused change.
2. Run `pnpm check`. For runtime or container changes, also run `docker compose up -d --build --wait`, `pnpm smoke` and `docker compose down`.
3. Open a pull request explaining the change and how you tested it.

Keep the default `pnpm install` / `pnpm dev` experience usable without credentials or private network access. Document optional configuration in `.env.example`. Keep credentials, `.env`, account files and personal data out of commits.

The template's documentation should help people build AT Protocol apps. Keep infrastructure runbooks and event-specific operating notes in the infrastructure repository.
