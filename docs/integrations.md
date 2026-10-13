# Felles test-PDS

Hackathon-appene bruker en separat, delt PDS med syntetiske kontoer. Den gjenbruker infrastrukturen sin pinnede Spaces PDS-build og private PLC-katalog, men har egen datavolum, administratornøkkel, JWT-nøkkel og rotasjonsnøkkel. Eksisterende appkontoer og PDS-datavolumer brukes ikke.

- Fra en maskin på Tailscale: `https://pds.hackaton.demokratiloftet.no`
- Fra en registrert app: `PDS_URL=http://gateway:3001`, satt av operatøren.
- Kanonisk tjenesteadresse: `PDS_PUBLIC_URL=https://pds.hackaton.demokratiloftet.no`.
- `GET /api/sandbox` viser om appen når tjenesten, uten å utlevere interne adresser eller nøkler.

Standard AT Protocol-records kan skrives og leses med en testkonto. Kontooppretting krever invitasjon; driftsansvarlig kan klargjøre en syntetisk konto per team med `python3 deploy/pds-account.py teamnavn` på VPS-en. Kommandoen skriver credentials til en root-eid fil og viser bare filstien. Del tilgang privat med teamet, aldri i Git eller GitHub Actions-loggen. Bruk app-passord ved videre appintegrasjon; eksempelet aksepterer også et separat testkontopassord.

## Prøv en ekte record

På Tailscale, fra apprepoet (zsh):

```sh
export PDS_IDENTIFIER=teamnavn.pds.hackaton.demokratiloftet.no
read -s 'PDS_APP_PASSWORD?Testkontoens app-passord: '; echo
export PDS_APP_PASSWORD
pnpm pds:demo
unset PDS_APP_PASSWORD
```

Testen oppretter en midlertidig `no.demokratiloftet.hackathon.note`, leser den tilbake og sletter den. Den skriver aldri passord eller sesjonstokens til terminalen. `scripts/pds-demo.mjs` er et lite, fungerende eksempel på innlogging og record-operasjoner. Bruk syntetiske data: vanlige AT Protocol-records er lesbare av andre med tilgang til PDS-en, ikke private per app.

For lokal UI-utvikling mot den delte testtjenesten:

```sh
PDS_URL=https://pds.hackaton.demokratiloftet.no pnpm dev
```

Appen fungerer også uten PDS. For en helt lokal instans kan dere bruke [local-sandbox](https://github.com/demokratiloftet/local-sandbox).

## Identitet og Spaces

En felles PDS gir ikke automatisk felles innlogging, SSO eller autorisasjon. Første versjon verifiserer standard AT Protocol-records med testkontoer. Nettleserbasert OAuth for hvert nytt appdomene og Spaces-delegering er ikke ferdig koblet opp eller verifisert her.

Gjenbruk [identity-component](https://github.com/demokratiloftet/identity-component) og [atproto-client](https://github.com/demokratiloftet/atproto-client) når innlogging/delegering legges til. Hver app må ha egne sessions og krypteringsnøkler. OAuth krever operatørstyrte metadata-/callbackruter og presise PDS-unntak for private domener; ikke slå av SSRF-beskyttelse for å få det til å virke.
