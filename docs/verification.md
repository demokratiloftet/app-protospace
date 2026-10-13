# Verifisert leveranse – 13. oktober 2026

- Kildemal: [app-protospace](https://github.com/demokratiloftet/app-protospace), privat GitHub template-repo.
- Første pnpm/PDS-release: `86eac49f412ef4dc0501848e5d3bf7f3403f2688`; [CI og deploy](https://github.com/demokratiloftet/app-protospace/actions/runs/38442838147) bestått.
- En ny instans ble opprettet fra malen: [hackathon-hello](https://github.com/demokratiloftet/hackathon-hello). Registrert med én operatørkommando, uten manuell Compose-/DNS-/secret-konfigurasjon for appen.
- Infrastrukturforslaget er [PR #6](https://github.com/demokratiloftet/server-infrastructure/pull/6), fortsatt åpent. Det gjennomgåtte oppsettet er installert på VPS-en.

## Live adresser

| Tjeneste             | URL                                                 |
| -------------------- | --------------------------------------------------- |
| Startside            | https://hackaton.demokratiloftet.no                 |
| Malens eksempelapp   | https://app-protospace.hackaton.demokratiloftet.no  |
| Ny instans fra malen | https://hackathon-hello.hackaton.demokratiloftet.no |
| Felles test-PDS      | https://pds.hackaton.demokratiloftet.no             |

Alle krever tilgang til riktig Tailscale-nettverk. Det gamle appdomenet `app-protospace.dev.demokratiloftet.no` er beholdt som alias. HTTPS-navnene er testet fra en separat Tailscale-klient med normal sertifikatverifisering. DNS peker til den eksisterende private proxyen, ikke VPS-ens offentlige adresse.

## Kontrollert

- pnpm 11.8.0, låsefil, typesjekk, HTTP-tester, produksjonsbygg, dependency audit og Docker smoke-test.
- Begge appene rapporterer kontakt med test-PDS-en på `/api/sandbox`.
- Ekte innlogging og write/read/delete av en syntetisk AT Protocol-record, både fra Tailscale-klienten og fra hver apps isolerte container. Ingen administratorcredentials ble gitt til appene; midlertidige records ble slettet.
- PDS-invitasjoner er påkrevd. Tjenesten har eget datavolum og egne hemmeligheter.
- Startside, begge apper og PDS returnerer HTTP 200 privat. Forespørsler med de samme Host-navnene gjennom den offentlige gatewayen returnerer 404.
- Appen har ingen publiserte porter, ingen host-volumer, ikke-root bruker, read-only rotfilsystem, droppede capabilities og CPU/minne/PID-grenser. Fast operatørproxy håndterer ingress og PDS-trafikk.
- Mottakerens begrensninger og rollback ved mislykket kandidat testes automatisk. Vi har ikke med vilje ødelagt en live release for å teste rollback.

## Avgrensninger

Offentlig publisering er fortsatt en eksplisitt operatørendring, ikke selvbetjening. Nye OAuth-klienter, felles SSO, Spaces-delegering og apper med egen varig database trenger særskilt integrasjon. Containerbygg skjer på delt VPS; løsningen er for kjente, betrodde hackathon-deltakere, ikke vilkårlig fiendtlig kode.
