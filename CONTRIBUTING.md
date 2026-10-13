# Bidra

Lag helst et eget repo fra malen for en ny prototype. Endringer som hjelper alle — oppstartsveiledning, feilrettinger, enklere deploy — hører hjemme her.

1. Lag en branch og gjør en avgrenset endring.
2. Kjør `npm run check`. Ved Docker-endringer: bygg containeren og kjør `npm run smoke`.
3. Åpne en pull request som beskriver hva som endres og hvordan det er testet.
4. En ansvarlig vurderer endringen før merge. Bare betrodde vedlikeholdere bør ha skrivetilgang til hovedgrenen.

CI bygger og tester pull requests uten deploynøkkel. Når deploy er aktivert, publiserer en vellykket hovedgren-kjøring bare dette repoets godkjente app. Nettverk, secrets, Compose-topologi og nye datatjenester håndteres av driftsansvarlig i server-infrastructure.

Kontroller hvilke branch protection-funksjoner GitHub-abonnementet støtter. CODEOWNERS alene håndhever ikke review. Hovedgren-skrivetilgang innebærer tillit til å endre kjørende kode.

Ikke legg persondata, `.env`, private nøkler eller testkontoer med reelle passord i repoet. Oppgi nødvendige variabelnavn i `.env.example`, uten verdier. Rotér en lekket nøkkel; sletting fra siste commit er ikke tilstrekkelig.
