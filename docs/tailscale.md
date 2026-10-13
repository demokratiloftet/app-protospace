# Tilgang med Tailscale

1. Installer Tailscale og få invitasjon/tilgang fra driftsansvarlig.
2. Koble til riktig tailnet. Privatlenken virker ikke bare fordi Tailscale er installert.
3. Åpne adressen i [leveransenotatet](verification.md).

Den eksisterende private Traefik-inngangen terminerer HTTPS på Tailscale-nettverket og videresender gjennom en fast proxy til appen. Appen har ingen offentlig port. Tailscale Serve og Funnel er ikke nødvendig og er ikke aktivert av denne leveransen. Tilgang styres av tailnetets eksisterende regler for den private proxy-noden; malen oppretter ikke nye ACL-er eller appbrukere.

## Hvis det ikke virker

- **Navnet finnes ikke / timeout:** kontroller at Tailscale er tilkoblet riktig nettverk. Appens DNS-navn skal resolve til den private proxyens Tailscale-adresse. Be operatøren sjekke tilgang til proxyen på port 443.
- **502:** Tailscale svarer, men appen kan være nede. Se Actions-status og be operatøren sjekke containerens helse og logger.
- **Sertifikatfeil:** ikke slå av sertifikatkontroll. Kontroller appadressen, klokken og sertifikatet på den private Traefik-inngangen.
- **Lokal port opptatt:** stopp gammel devprosess. Containerpreview kan bruke `LOCAL_PORT=3001 docker compose up -d --build --wait`; test da med `APP_URL=http://127.0.0.1:3001 pnpm smoke`.

Hvis andre prosjekter bruker standardportene, start utvikling med `DEV_PORT=5174 API_PORT=3001 pnpm dev`. Da åpner du http://127.0.0.1:5174. Ikke stopp andre prosjekter for å frigjøre portene.

`tailscale status` viser tilkoblingsstatus. Lokal utvikling trenger ikke Tailscale. Alle med tillatt tailnettilgang kan bruke dette statsløse eksempelet; egen appautentisering er ikke implementert.
