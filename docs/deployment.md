# Fra GitHub til privat app

## For deltakere

Utvikle lokalt → pull request → review og merge til `main` → grønn CI → privat demo oppdateres. Følg **Actions → Check and deploy** for status. CI-feil stopper deploy; en feil ved helse- eller smoke-test på VPS-en utløser tilbakeføring til forrige image.

Første gang må en driftsansvarlig registrere appen. Oppgi:

- GitHub-repo i `demokratiloftet`, appnavn og ansvarlig.
- Hovedgren, normalt `main`.
- Ressursbehov (standard 0,5 CPU / 256 MiB) og eventuelle secrets.
- Eventuelt behov for varig lagring, intern tjenestetilgang eller eksterne API-er.

Malen bruker containerport 3000 og `GET /health`. Den har ingen database. Databasemigrering er ikke del av automatisk deploy.

## For driftsansvarlig

Følg [deploy/SANDBOX.md](https://github.com/demokratiloftet/server-infrastructure/blob/feat/loft-98-protospace/deploy/SANDBOX.md) i server-infrastructure. Endringen ligger i [PR #6](https://github.com/demokratiloftet/server-infrastructure/pull/6). Godkjent topologi installeres under `/etc/loftet-deploy/apps/REPO/`; kilden i apprepoet kan ikke endre den ved deploy.

Repoet trenger disse GitHub-innstillingene etter vellykket førstegangsoppsett:

| Type     | Navn                      | Innhold                                             |
| -------- | ------------------------- | --------------------------------------------------- |
| Variable | `DEMO_DEPLOY_ENABLED`     | `true` først etter bootstrap og tilgangstest        |
| Variable | `DEMO_DEPLOY_HOST`        | Verifisert adresse til VPS-ens SSH-endepunkt        |
| Secret   | `DEMO_DEPLOY_SSH_KEY`     | Egen nøkkel begrenset til `loftet-deploy REPO`      |
| Secret   | `DEMO_DEPLOY_KNOWN_HOSTS` | SSH-vertsnøkkel fra allerede verifisert forbindelse |

GitHub Actions sender et kortlevd, repoavgrenset `contents:read`-token over den begrensede SSH-forbindelsen. VPS-en trenger ikke en permanent GitHub-token. Deploynøkkelen gir ingen interaktiv shell, portvideresending eller filopplasting.

Denne første versjonen bruker dagens SSH-transport til serveren for CI. Apptrafikken er privat via Tailscale. Vi har ikke lagt til en ny Tailscale-identitet i GitHub Actions eller en runner på VPS-en.

Serveren godtar bare hovedgrenens gjeldende fulle commit-SHA, bygger uten runtime-secrets og oppdaterer bare appen. En global deploylås hindrer samtidige bygg/utrullinger. Endringer i blant annet `deploy/`, `infra/` og Compose-filer krever operatøroppsett; en rød deployjobb på slike endringer er forventet.

Pause: sett `DEMO_DEPLOY_ENABLED=false`. Vanlig tilbakeføring: revert endringen, merge og la CI deploye. Umiddelbar operatørtilbakeføring bruker forrige image fra `/var/lib/loftet-deploy/REPO/current.json`; følg infrastrukturens runbook. Ikke slett datavolumer eller kjør `down -v` på delt infrastruktur.
