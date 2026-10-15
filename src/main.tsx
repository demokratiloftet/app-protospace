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
        throw new Error(data.error ?? "Could not reach the API. Try again.");
      setMessage(data.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header>
        <a className="brand" href="/" aria-label="App Protospace, home">
          <span className="brand-mark">L</span>
          <span>
            demokratiløftet<span className="brand-sub">APP PROTOSPACE</span>
          </span>
        </a>
        <a className="repo-link" href={repo}>
          View the code <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main>
        <section className="hero">
          <div className="eyebrow">
            <span className="dot" /> ROOM TO EXPERIMENT
          </div>
          <h1>
            Your idea.
            <br />A running <em>app.</em>
          </h1>
          <p className="intro">
            A starting point for your AT Protocol app. Build with React and
            Node.js, connect a PDS, and experiment with shared records.
          </p>
          <a className="primary" href={`${repo}/generate`}>
            Create your app <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href={`${repo}/blob/main/docs/HACKATHON.md`}>
            Read the hackathon guide <span aria-hidden="true">→</span>
          </a>
          <div className="hero-note">
            {pds === "ready"
              ? "PDS is reachable. Run pnpm pds:demo with a test account to try a real record."
              : pds === "error"
                ? "Could not reach the PDS. Check PDS_URL and your network, then reload."
                : pds === "local"
                  ? "PDS not configured. Add PDS_URL to .env and restart pnpm dev to connect one."
                  : "Checking PDS connection…"}
          </div>
        </section>
        <section className="demo" aria-labelledby="demo-title">
          <div className="demo-top">
            <span>01 / HELLO LØFTET</span>
            <span className={`status ${health}`}>
              <span className="dot" />
              {health === "ok"
                ? "API is ready"
                : health === "error"
                  ? "API is unavailable"
                  : "Checking API"}
            </span>
          </div>
          <div className="demo-body">
            <span className="hello-art" aria-hidden="true">
              hi<span>↗</span>
            </span>
            <h2 id="demo-title">Try your local API.</h2>
            <p>
              Send a greeting from your browser to the Node API. This local
              example does not write to a PDS or require an account.
            </p>
            <form onSubmit={greet}>
              <label htmlFor="name">
                Your name <span>(optional)</span>
              </label>
              <div className="input-row">
                <input
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  maxLength={80}
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button disabled={busy} type="submit">
                  {busy ? "Sending …" : "Say hello"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
            <div
              className={`reply ${message ? "answered" : ""}`}
              aria-live="polite"
            >
              {message || "The API response will appear here."}
            </div>
          </div>
          <div className="demo-bottom">
            <span>React + TypeScript + Node.js</span>
            <span>YOUR STARTER TEMPLATE</span>
          </div>
        </section>
        <section className="steps" aria-label="From idea to prototype">
          {[
            [
              "01",
              "Make it yours.",
              "Create a repository from the template. Run it locally and replace this page with your idea.",
            ],
            [
              "02",
              "Try AT Protocol.",
              "Choose a PDS and a test account. The record example writes, reads and removes a note; adapt it to your idea.",
            ],
            [
              "03",
              "Share a running app.",
              "Build in your own repository, invite your teammates, and host where you prefer. Ask Edvin if you want help with hackathon hosting.",
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
          Demokratiløftet <span className="footer-separator">/</span> A place to
          start.
        </span>
        <a href={`${repo}/blob/main/CONTRIBUTING.md`}>Contribute ↗</a>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
