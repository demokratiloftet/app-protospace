# Valgfrie integrasjoner

Start med den statsløse malen. Ta inn tjenester først når appen trenger dem.

- [local-sandbox](https://github.com/demokratiloftet/local-sandbox): lokal PDS/PLC med syntetiske kontoer. Følg dens README og isolasjonskrav. Ikke eksponer den gjennom en offentlig tunnel.
- [identity-component](https://github.com/demokratiloftet/identity-component): gjenbrukbar serverbasert identitet og OAuth.
- [atproto-client](https://github.com/demokratiloftet/atproto-client): gjenbrukbar serverklient for AT Protocol Spaces.

Ingen av disse er konfigurert i Hello Løftet. Delte tjeneste-URL-er, kontotilganger og nødvendige nettverksunntak må registreres hos driftsansvarlig. Hold serverhemmeligheter på serveren; alt som bygges inn i frontend er lesbart for brukeren.

VPS-appen bruker et internt Docker-nettverk uten vanlig ekstern IP-ruting. Dette er ikke en full grense mot fiendtlig kode: Docker-vert, administrator og Docker DNS inngår i tillitsmodellen. Nettverket er heller ikke tilgangskontroll inne i en app. Ikke bruk malen som isolert kjøring av vilkårlig, ubetrodd kode.
