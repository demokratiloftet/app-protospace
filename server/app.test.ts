import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "./app.ts";

test("real HTTP: API, validation, static boundary and health", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "protospace-"));
  await writeFile(join(directory, "index.html"), "<h1>Hello</h1>");
  await writeFile(join(directory, ".env"), "SECRET=do-not-serve");
  const app = createApp({ publicDir: directory, revision: "test-revision" });
  app.listen(0, "127.0.0.1");
  await once(app, "listening");
  t.after(async () => {
    app.closeAllConnections();
    await new Promise<void>((r) => app.close(() => r()));
    await rm(directory, { recursive: true });
  });
  const address = app.address();
  assert(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  const health = await fetch(`${base}/health`);
  assert.deepEqual(await health.json(), {
    status: "ok",
    revision: "test-revision",
  });
  const hello = await fetch(
    `${base}/api/hello?name=${encodeURIComponent("Nora & Emil")}`,
  );
  assert.match((await hello.json()).message, /Nora & Emil/);
  assert.equal(
    (await fetch(`${base}/api/hello?name=${"x".repeat(81)}`)).status,
    400,
  );
  assert.equal((await fetch(`${base}/api/hello?name=%00`)).status, 400);
  assert.equal(
    (await fetch(`${base}/api/hello`, { method: "POST" })).status,
    405,
  );
  for (const path of [
    "/.env",
    "/%2eenv",
    "/server/app.ts",
    "/api/missing",
    "/assets/%2e%2e%2f%2eenv",
  ]) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
  assert.equal((await fetch(`${base}/%E0%A4%A`)).status, 400);
  const html = await fetch(base);
  assert.equal(html.status, 200);
  assert.match(await html.text(), /Hello/);
  assert.match(
    html.headers.get("content-security-policy")!,
    /frame-ancestors 'none'/,
  );
});
