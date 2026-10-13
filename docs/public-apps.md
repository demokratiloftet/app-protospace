# Gjøre en utvalgt app offentlig

Eksempelappen er **privat**. Offentlig publisering er en særskilt operatøroperasjon og er ikke utført i denne leveransen.

Anbefalt fremgangsmåte på denne VPS-en:

1. Avklar nøyaktig app, vertsnavn, hvilke ruter som skal være tilgjengelige og hvilke data som blir offentlige. Legg til appautentisering dersom innholdet ikke skal være åpent.
2. Lag en endring i server-infrastructure med en eksplisitt rute i den offentlige gatewayen til bare denne appen. Eksisterende gateway har en streng tillatelsesliste og kan ikke brukes som vilkårlig videresender.
3. Opprett nødvendig DNS/TLS og en avgrenset forbindelse fra gatewayen til appen. Behold database/API-administrasjon privat. Ikke koble alle apper til hele AT Protocol-nettverket eller endre appens bind-adresse til `0.0.0.0` på verten.
4. Test fra et nettverk uten Tailscale: riktig vertsnavn virker; ukjent vertsnavn og private ruter virker ikke; øvrige private apper er fortsatt utilgjengelige.
5. Dokumenter reversering: fjern akkurat den nye gatewayruten og DNS-oppføringen. Behold app og datavolumer.

Tailscale Serve er privat. Tailscale Funnel er offentlig og skal ikke aktiveres som en «tilkoblingsfiks». Denne versjonen tilbyr en dokumentert operatørprosess, ikke en testet knapp for offentlig publisering.
