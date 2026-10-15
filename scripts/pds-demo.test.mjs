import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const script = fileURLToPath(new URL("./pds-demo.mjs", import.meta.url));
const identifier = "tester.example";
const password = "synthetic-test-password";
const token = "synthetic-session-token";

async function runDemo(t, base) {
  const cwd = await mkdtemp(join(tmpdir(), "protospace-pds-test-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(
    join(cwd, ".env"),
    `${base ? `PDS_URL=${base}\n` : ""}PDS_IDENTIFIER=${identifier}\nPDS_APP_PASSWORD=${password}\n`,
  );
  const env = { ...process.env };
  for (const key of ["PDS_URL", "PDS_IDENTIFIER", "PDS_APP_PASSWORD"])
    delete env[key];
  try {
    return {
      code: 0,
      ...(await exec(process.execPath, ["--env-file-if-exists=.env", script], {
        cwd,
        env,
        timeout: 15000,
      })),
    };
  } catch (error) {
    return error;
  }
}

for (const corruptRead of [false, true]) {
  test(`record demo loads .env and cleans up after ${corruptRead ? "a mismatched read" : "a successful read"}`, async (t) => {
    const calls = [];
    let record;
    let uri;
    let key;
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, "http://localhost");
      const method = url.pathname.split("/").at(-1);
      calls.push(method);
      res.setHeader("content-type", "application/json");
      let input = "";
      for await (const chunk of req) input += chunk;
      const body = input ? JSON.parse(input) : undefined;
      if (method === "com.atproto.server.createSession") {
        assert.deepEqual(body, { identifier, password });
        assert.equal(req.headers.authorization, undefined);
        res.end(JSON.stringify({ did: "did:plc:test", accessJwt: token }));
      } else if (method === "com.atproto.repo.putRecord") {
        assert.equal(req.headers.authorization, `Bearer ${token}`);
        record = body.record;
        key = body.rkey;
        uri = `at://${body.repo}/${body.collection}/${key}`;
        res.end(JSON.stringify({ uri }));
      } else if (method === "com.atproto.repo.getRecord") {
        assert.equal(req.method, "GET");
        assert.equal(req.headers.authorization, undefined);
        assert.equal(url.searchParams.get("rkey"), key);
        res.end(
          JSON.stringify({
            uri,
            value: corruptRead ? { ...record, text: "wrong" } : record,
          }),
        );
      } else if (method === "com.atproto.repo.deleteRecord") {
        assert.equal(req.headers.authorization, `Bearer ${token}`);
        assert.equal(body.rkey, key);
        res.writeHead(204).end();
      } else {
        res.writeHead(404).end();
      }
    }).listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => {
      server.closeAllConnections();
      server.close();
    });
    const result = await runDemo(
      t,
      `http://127.0.0.1:${server.address().port}`,
    );
    assert.equal(result.code, corruptRead ? 1 : 0);
    assert.deepEqual(calls, [
      "com.atproto.server.createSession",
      "com.atproto.repo.putRecord",
      "com.atproto.repo.getRecord",
      "com.atproto.repo.deleteRecord",
    ]);
    assert.match(result.stdout, /Synthetic record removed/);
    if (corruptRead)
      assert.match(result.stderr, /PDS read verification failed/);
    else assert(result.stdout.includes(uri));
    for (const secret of [password, token])
      assert(!(result.stdout + result.stderr).includes(secret));
  });
}

test("record demo requires an explicit PDS and rejects remote plaintext credentials", async (t) => {
  const missing = await runDemo(t);
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /Set PDS_URL in .env/);
  const insecure = await runDemo(t, "http://pds.example");
  assert.equal(insecure.code, 1);
  assert.match(insecure.stderr, /Use HTTPS for PDS_URL/);
});
