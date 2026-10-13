import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { pdsStatus } from "./pds.ts";

test("PDS discovery works without credentials and refuses redirects", async (t) => {
  let redirect = false;
  const server = createServer((req, res) => {
    assert.equal(req.headers.authorization, undefined);
    assert.equal(req.url, "/xrpc/com.atproto.server.describeServer");
    if (redirect) {
      res.writeHead(302, { location: "http://127.0.0.1:1/private" });
      res.end();
    } else res.end(JSON.stringify({ inviteCodeRequired: true }));
  }).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const address = server.address();
  assert(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  assert.deepEqual(await pdsStatus(), { configured: false, available: false });
  assert.deepEqual(await pdsStatus(url), {
    configured: true,
    available: true,
    inviteRequired: true,
  });
  redirect = true;
  assert.deepEqual(await pdsStatus(url), {
    configured: true,
    available: false,
  });
});
