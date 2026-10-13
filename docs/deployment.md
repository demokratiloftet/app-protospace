# Fra repo til privat HTTPS

Hver app får `https://<repo>.hackaton.demokratiloftet.no`. Vi bruker subdomener slik at apper får egne origins og kan bruke `/` uten spesiell frontend-konfigurasjon. Stavemåten `hackaton` er bevisst valgt for dette domenet.

## Deltaker: tre steg

1. Opprett et **privat repo i demokratiloftet** fra denne malen, med `main` som hovedgren. Bruk små bokstaver, tall og bindestrek i navnet.
2. Kjør `pnpm install --frozen-lockfile` og `pnpm dev`. Bygg frontend i `src/` og backend i `server/`.
3. Send repoets navn til driftsansvarlig for engangsregistrering. Etter registrering: push til `main`; GitHub Actions tester, bygger containeren og deployer automatisk. Se **Actions → Check and deploy** for resultatet.

Det er samme flyt for en ren backend: behold containerport 3000 og `GET /health`. Startmalen er Node-basert; andre runtime-profiler må godkjennes særskilt.

Deltakere trenger GitHub-tilgang og tilgang til Tailscale-nettverket for å åpne appene. De trenger ikke SSH, Docker-tilgang på VPS-en, DNS-nøkler eller PDS-administratorpassord. Lokalt arbeid krever ikke Tailscale.

## Operatør: én registreringskommando

Fra det gjennomgåtte `server-infrastructure`-repoet:

```sh
python3 deploy/register.py mitt-appnavn --identity ~/.ssh/hostinger
```

Forutsetninger: GitHub CLI med administratortilgang til apprepoet, verifisert SSH-hostnøkkel, installert deploymottaker og klargjort hackathon-infrastruktur. Kommandoen reserverer port, oppretter fast topologi, deployer første commit, setter begrenset triggernøkkel i GitHub og starter CI. Den nekter å overskrive en eksisterende registrering.

[Operatørveiledning og bootstrap](https://github.com/demokratiloftet/server-infrastructure/blob/feat/loft-98-protospace/deploy/SANDBOX.md). Infrastrukturendringene ligger foreløpig i [PR #6](https://github.com/demokratiloftet/server-infrastructure/pull/6).

## Hva er automatisk?

- CI bruker pnpm med låste avhengigheter og tester produksjonscontaineren.
- Deploymottakeren godtar bare eksakt commit på registrert hovedgren.
- Apper kjører med fast, operatørstyrt nettverk og ressursgrenser; appens Compose-fil brukes ikke på VPS-en.
- Feilet oppstart eller helsesjekk gjenoppretter forrige image.
- Nye commits endrer ikke DNS, publisering, administratornøkler eller delt infrastruktur.

Første registrering krever gjennomgang av koden og Dockerfile. Dette er en sandkasse for kjente deltakere med betrodd skrivetilgang, ikke en tjeneste for å kjøre vilkårlig fiendtlig kode. Containerbygg skjer fortsatt på den delte VPS-en, serialisert med andre deployer; store bygg bør flyttes til egne byggemaskiner før videre skalering.

Persistent lagring, databaseendringer og ekstra bakgrunnstjenester er operatøroppgaver. `/tmp` er liten og midlertidig. Appen kan kun kontakte den delte test-PDS-en gjennom en fast proxy; annen utgående trafikk må avtales.

## Tilgang og publisering

HTTPS er privat gjennom Tailscale, selv om DNS-navnet kan slås opp offentlig. Det er en separat test-PDS med egne data, nøkler og invitasjoner. Se [PDS-integrasjon](integrations.md).

Offentlig tilgang er en **egen operatørendring** i den eksisterende offentlige gatewayen og DNS, ikke et flagg deltakeren kan sette i repoet. [Publiseringsprosedyre](public-apps.md). Automatisk offentlig publisering inngår ikke i denne versjonen.
