import assert from "node:assert/strict";
const base = process.env.APP_URL ?? "http://127.0.0.1:3000";
const get = (path) =>
  fetch(new URL(path, base), { signal: AbortSignal.timeout(10000) });
const health = await get("/health");
assert.equal(health.status, 200);
assert.equal((await health.json()).status, "ok");
const page = await get("/");
assert.equal(page.status, 200);
assert.match(await page.text(), /id="root"/);
const hello = await get("/api/hello?name=Workshop");
assert.equal(hello.status, 200);
assert.match((await hello.json()).message, /Workshop/);
for (const path of ["/.env", "/server/app.ts", "/api/missing"])
  assert.equal((await get(path)).status, 404);
console.log(`Smoke checks passed: ${base}`);
