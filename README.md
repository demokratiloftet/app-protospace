# App Protospace

En liten idé. En kjørende app. Startmal for apper og API-er i Demokratiløftets utviklingssandkasse — [LOFT-98](https://devotta.atlassian.net/browse/LOFT-98).

**React + TypeScript + Node.js**, med lokal utvikling, Docker, GitHub Actions og privat deploy via Tailscale. Dette repoet er både malen og eksempelappen **Hello Løftet**. Ingen database, kontoer eller eksterne API-er trengs for å starte.

## Kom i gang

Du trenger Git og Node.js **24.17.0** (se `.node-version`). Installer pnpm **11.8.0** med `npm install --global pnpm@11.8.0`. Docker er valgfritt for lokal utvikling.

```sh
git clone https://github.com/demokratiloftet/app-protospace.git
cd app-protospace
pnpm install --frozen-lockfile
pnpm doctor
pnpm dev
```

Åpne **http://127.0.0.1:5173**. Frontend har automatisk oppdatering; API-et kjører på loopback-port 3000. Stopp begge med Ctrl+C.

Endre `src/main.tsx` for å bygge din visning og `server/app.ts` for å legge til API-ruter. Eksempelet bruker `GET /api/hello?name=Nora` og `GET /health`.

## Lag din egen app

1. Velg **Use this template → Create a new repository** på GitHub. Bruk `main` som hovedgren og velg et nytt appnavn.
2. Klon det nye repoet og kjør kommandoene over. Endre `name` i `package.json` og kjør `pnpm install --lockfile-only`. Tilpass tittel, tekst og repo-lenken i `src/main.tsx`.
3. Bygg appen og lever endringer med pull requests. `pnpm check` kjører typesjekk, HTTP-tester og produksjonsbygg.
4. Be driftsansvarlig registrere repoet for delt deploy. Oppgi navn, ansvarlig og eventuelle behov for lagring eller tjenester. [Deployveiledning](docs/deployment.md).

En kopi av malen har **deploy avslått**: GitHub kopierer ikke repoets secrets eller variabler. Den kan trygt kjøre CI før den er registrert på VPS-en.

## Privat eksempelapp

**[Åpne Hello Løftet](https://app-protospace.hackaton.demokratiloftet.no)** — krever Tailscale-tilgang.

Adresse og verifisert deploystatus finnes i [leveransenotatet](docs/verification.md). Du må være tilkoblet Demokratiløftets Tailscale-nettverk og ha tilgang til VPS-noden. [Tilgang og feilsøking](docs/tailscale.md).

Navnet du sender til eksempel-API-et returneres i svaret; appen lagrer det ikke og logger ikke forespørsler. Bruk syntetiske data når du videreutvikler prototypen. Privat nettverk erstatter ikke innlogging og datatilgangskontroll når du legger til faktiske brukerdata.

## Produksjonsbygg lokalt

```sh
pnpm check
pnpm start
# I et annet terminalvindu:
pnpm smoke
```

Eller med Docker (stopp `pnpm dev` / `pnpm start` først hvis port 3000 er opptatt):

```sh
docker compose up -d --build --wait
pnpm smoke
docker compose down
```

Åpne http://127.0.0.1:3000. Lokal Compose er en loopback-preview med vanlig utgående nettverk. Den godkjente VPS-topologien bruker et eget internt nettverk; Compose-filen i dette repoet brukes ikke direkte på VPS-en.

## Hva ligger hvor?

| Sted                                                                              | Ansvar                                                     |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/`                                                                            | React-grensesnitt og CSS                                   |
| `server/`                                                                         | Lite Node HTTP-API, statiske filer og HTTP-tester          |
| `scripts/`                                                                        | Lokal oppstart, verktøysjekk og smoke-test                 |
| `.github/workflows/check.yml`                                                     | CI og deploy av kontrollert commit                         |
| `Dockerfile`, `compose.yaml`                                                      | Produksjonsimage og lokal containerpreview                 |
| [server-infrastructure](https://github.com/demokratiloftet/server-infrastructure) | Operatørstyrt VPS-topologi, registrering og deploymottaker |
| [local-sandbox](https://github.com/demokratiloftet/local-sandbox)                 | Valgfri lokal AT Protocol-test med syntetiske kontoer      |

## Videre utvikling

- **Bare API:** behold `server/` og tilpass frontend eller fjern den og tilhørende byggesteg. Behold `/health` og containerport 3000.
- **AT Protocol:** bruk `local-sandbox` lokalt og les [integrasjonsnotatet](docs/integrations.md). Registrerte apper får automatisk forbindelse til den separate, delte test-PDS-en. Testkonto opprettes av driftsansvarlig.
- **Database / worker / biblioteker:** ikke ferdige maler i v0.1. Persistent lagring, migreringer og jobber trenger eget oppsett; gjenbrukbare pakker publiseres separat fra appdeploy.
- **Offentlig app:** se [publiseringsprosedyren](docs/public-apps.md). Et app-merge gjør aldri en app offentlig.

Se [CONTRIBUTING.md](CONTRIBUTING.md) for bidragsflyt. Repoet opprettes privat; eventuell offentlig kildekode og lisensvalg avgjøres separat av prosjektet.
