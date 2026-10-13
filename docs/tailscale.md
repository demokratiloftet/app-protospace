# Tilgang med Tailscale

1. Installer Tailscale og få invitasjon/tilgang fra driftsansvarlig.
2. Koble til riktig tailnet. Privatlenken virker ikke bare fordi Tailscale er installert.
3. Åpne adressen i [leveransenotatet](verification.md).

VPS-ens Tailscale Serve terminerer HTTPS og videresender til appens loopback-port. Appen har ingen offentlig port og Tailscale Funnel er ikke aktivert for den. Tilgang styres av tailnetets eksisterende regler for VPS-noden; malen oppretter ikke nye ACL-er eller appbrukere.

## Hvis det ikke virker

- **Navnet finnes ikke / timeout:** kontroller at Tailscale er tilkoblet riktig nettverk og at MagicDNS fungerer. Be operatøren sjekke tilgang til appens HTTPS-port.
- **502:** Tailscale svarer, men appen kan være nede. Se Actions-status og be operatøren sjekke containerens helse og logger.
- **Sertifikatfeil:** ikke slå av sertifikatkontroll. Kontroller riktig `.ts.net`-adresse, klokke og Tailscale HTTPS-oppsett.
- **Lokal port opptatt:** stopp gammel devprosess. Containerpreview kan bruke `LOCAL_PORT=3001 docker compose up -d --build --wait`; test da med `APP_URL=http://127.0.0.1:3001 npm run smoke`.

`tailscale status` viser tilkoblingsstatus. Lokal utvikling trenger ikke Tailscale. Alle med tillatt tailnettilgang kan bruke dette statsløse eksempelet; egen appautentisering er ikke implementert.
