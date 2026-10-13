# Leveransestatus

Verifisert 13. oktober 2026.

- Repo: [app-protospace](https://github.com/demokratiloftet/app-protospace), privat GitHub-template.
- Eksempelapp: **[Hello Løftet](https://app-protospace.dev.demokratiloftet.no)**, privat via Tailscale og eksisterende Traefik.
- Første deployede app-commit: `30edf187492f68fe2646626ef436f6249af9aaa4`. Senere versjoner følger godkjente hovedgren-kjøringer; `/health` og `/var/lib/loftet-deploy/app-protospace/current.json` viser faktisk kjørende SHA.
- Første komplette CI/deploy: [vellykket Actions-kjøring](https://github.com/demokratiloftet/app-protospace/actions/runs/38437225611).
- Infrastruktur: [PR #6](https://github.com/demokratiloftet/server-infrastructure/pull/6); registrering og mottaker er installert på VPS-en. PR-en er opprettet for gjennomgang, ikke automatisk merget.

## Gjennomførte kontroller

| Kontroll                                       | Resultat                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| TypeScript, produksjonsbygg og HTTP-tester     | Bestått lokalt og i CI på Node 24.17.0                                                                                 |
| Avhengighetssjekk                              | `npm audit`: ingen rapporterte sårbarheter ved verifikasjon                                                            |
| Docker-bygg og helsesjekk                      | Bestått lokalt, i CI og på VPS                                                                                         |
| Automatisk deploy                              | Actions utløste begrenset SSH-kommando; VPS registrerte riktig SHA                                                     |
| Privat HTTPS fra Mac til VPS via Tailscale     | Gyldig TLS; side, API og helsesjekk virker                                                                             |
| Offentlig VPS-adresse med appens vertsnavn/SNI | HTTP 404; appen er ikke publisert i offentlig gateway                                                                  |
| Offentlig direkte appport 3210                 | Utilgjengelig                                                                                                          |
| Appcontainer                                   | UID 1000, skrivebeskyttet rotfilsystem, alle capabilities fjernet, ingen publiserte porter, bare eget internt nettverk |
| Utgående IPv4 fra app til ekstern testadresse  | Blokkert; dette er ikke en påstand om full DNS-/egress-isolasjon                                                       |
| Nettleser                                      | Hilseskjema virker; desktop og mobilbredde 390 px kontrollert                                                          |
| Deploymottaker                                 | Sju tester, inkludert ugyldige mål/kommandoer og automatisk tilbakeføring ved simulert kandidatfeil                    |

Appen bruker standardgrensene 256 MiB / 0,5 CPU. Den faste gatewayen bruker 64 MiB / 0,25 CPU. Kun gatewayen deler nettverk med den private proxyens sidecar; appen deler ikke nettverk med PDS eller databaser. Ingen appdata lagres.

Offentlig publisering og nye datatjenester er ikke aktivert. Full produksjonsisolasjon, applikasjonsinnlogging og databasebackup er ikke del av denne statsløse startmalen. Feilende livekode er ikke bevisst deployet for å teste rollback; feilforløpet er verifisert i mottakertesten.

Operatørbackup av forrige deploymottaker og bootstrapgrunnlaget ligger privat på VPS-en i `/root/loftet-protospace-bootstrap-20261013/`. Nye appdeploys endrer bare eksempelappens container.
