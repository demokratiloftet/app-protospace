// A synthetic write/read/delete smoke test. No administrator access is needed.
// Use a separate demo account/app password; never print session credentials.
import { randomUUID } from "node:crypto";
const base = process.env.PDS_URL;
if (!base)
  throw new Error(
    "Set PDS_URL in .env to your account's PDS. See docs/integrations.md.",
  );
const pds = new URL(base);
if (
  pds.username ||
  pds.password ||
  (pds.protocol !== "https:" &&
    !(
      pds.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(pds.hostname)
    ))
)
  throw new Error(
    "Use HTTPS for PDS_URL (HTTP is allowed only for a local PDS).",
  );
let credentials;
if (process.argv.includes("--stdin")) {
  let input = "";
  for await (const part of process.stdin) input += part;
  credentials = JSON.parse(input);
} else {
  credentials = {
    identifier: process.env.PDS_IDENTIFIER,
    password: process.env.PDS_APP_PASSWORD,
  };
}
if (!credentials.identifier || !credentials.password)
  throw new Error(
    "Set PDS_IDENTIFIER and PDS_APP_PASSWORD (a demo account, never PDS admin credentials).",
  );
async function rpc(method, body, token) {
  const response = await fetch(new URL("/xrpc/" + method, base), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify(body),
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
  return response.status === 204 ? undefined : response.json();
}
const session = await rpc("com.atproto.server.createSession", credentials);
const collection = "no.demokratiloftet.hackathon.note";
const rkey = randomUUID();
const value = {
  $type: collection,
  text: "Hello from App Protospace",
  createdAt: new Date().toISOString(),
};
let written = false;
try {
  const record = await rpc(
    "com.atproto.repo.putRecord",
    {
      repo: session.did,
      collection,
      rkey,
      validate: false,
      record: value,
    },
    session.accessJwt,
  );
  written = true;
  const url = new URL("/xrpc/com.atproto.repo.getRecord", base);
  url.search = new URLSearchParams({
    repo: session.did,
    collection,
    rkey,
  }).toString();
  const read = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    redirect: "error",
  });
  if (!read.ok)
    throw new Error(`PDS read verification failed: HTTP ${read.status}`);
  const result = await read.json();
  if (
    result.uri !== record.uri ||
    result.value?.$type !== value.$type ||
    result.value?.text !== value.text ||
    result.value?.createdAt !== value.createdAt
  )
    throw new Error("PDS read verification failed");
  console.log(`PDS write/read verified: ${record.uri}`);
} finally {
  if (written) {
    await rpc(
      "com.atproto.repo.deleteRecord",
      { repo: session.did, collection, rkey },
      session.accessJwt,
    );
    console.log("Synthetic record removed.");
  }
}
