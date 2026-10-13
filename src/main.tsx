import { StrictMode, useEffect, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const repo = "https://github.com/demokratiloftet/app-protospace";
function App() {
  const [pds, setPds] = useState<"loading" | "ready" | "local" | "error">(
    "loading",
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    fetch("/api/sandbox")
      .then((r) => r.json())
      .then((data) =>
        setPds(
          !data.pds.configured
            ? "local"
            : data.pds.available
              ? "ready"
              : "error",
        ),
      )
      .catch(() => setPds("error"));
    fetch("/health")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setHealth(data.status === "ok" ? "ok" : "error"))
      .catch(() => setHealth("error"));
  }, []);
  async function greet(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/hello?name=${encodeURIComponent(name)}`,
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Kunne ikke nå API-et. Prøv igjen.");
      setMessage(data.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Noe gikk galt. Prøv igjen.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header>
        <a className="brand" href="/" aria-label="App Protospace, forsiden">
          <span className="brand-mark">L</span>
          <span>
            demokratiløftet<span className="brand-sub">APP PROTOSPACE</span>
          </span>
        </a>
        <a className="repo-link" href={repo}>
          Se koden <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main>
        <section className="hero">
          <div className="eyebrow">
            <span className="dot" /> ROM FOR Å PRØVE
          </div>
          <h1>
            En liten idé.
            <br />
            En kjørende <em>app.</em>
          </h1>
          <p className="intro">
            Velkommen til Løftets utviklingssandkasse. Her er det kort vei fra
            «hva om» til noe vi kan prøve sammen.
          </p>
          <a className="primary" href={`${repo}/generate`}>
            Lag din egen app <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href={`${repo}#kom-i-gang`}>
            Les oppstartsveiledningen <span aria-hidden="true">→</span>
          </a>
          <div className="hero-note">
            {pds === "ready"
              ? "Felles test-PDS er tilkoblet. Klar for AT Protocol-eksperimenter."
              : pds === "error"
                ? "Test-PDS svarer ikke. Du kan fortsatt bygge og bruke appen."
                : "Bygg lokalt. Del med teamet. Utvikle videre."}
          </div>
        </section>
        <section className="demo" aria-labelledby="demo-title">
          <div className="demo-top">
            <span>01 / HELLO LØFTET</span>
            <span className={`status ${health}`}>
              <span className="dot" />
              {health === "ok"
                ? "API-et er klart"
                : health === "error"
                  ? "API-et svarer ikke"
                  : "Sjekker API-et"}
            </span>
          </div>
          <div className="demo-body">
            <span className="hello-art" aria-hidden="true">
              hei<span>↗</span>
            </span>
            <h2 id="demo-title">Prøv den første forbindelsen.</h2>
            <p>
              Send en hilsen fra nettleseren til API-et. Et lite utgangspunkt
              for det du vil bygge.
            </p>
            <form onSubmit={greet}>
              <label htmlFor="name">
                Hva heter du? <span>(valgfritt)</span>
              </label>
              <div className="input-row">
                <input
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  maxLength={80}
                  placeholder="Ditt fornavn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button disabled={busy} type="submit">
                  {busy ? "Sender …" : "Si hei"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
            <div
              className={`reply ${message ? "answered" : ""}`}
              aria-live="polite"
            >
              {message || "Svaret fra API-et dukker opp her."}
            </div>
          </div>
          <div className="demo-bottom">
            <span>React + TypeScript + Node.js</span>
            <span>DIN STARTMAL</span>
          </div>
        </section>
        <section className="steps" aria-label="Fra idé til prototype">
          {[
            [
              "01",
              "Gjør den til din.",
              "Opprett et repo fra malen. Start lokalt og bytt ut denne siden med din idé.",
            ],
            [
              "02",
              "Bygg noe sammen.",
              "Legg til en visning, et API eller en integrasjon. Test og del endringen i GitHub.",
            ],
            [
              "03",
              "La andre prøve.",
              "Registrer appen hos driftsansvarlig. Godkjent kode deployes til teamets sandkasse.",
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </main>
      <footer>
        <span>
          Demokratiløftet <span className="footer-separator">/</span> Et sted å
          begynne.
        </span>
        <a href={`${repo}/blob/main/CONTRIBUTING.md`}>Bidra til sandkassen ↗</a>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
