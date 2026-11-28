// The agent endpoint is OFF unless a project switches it on: without
// cds.requires.cap2ui5.agent there is no route - the path answers CAP's 404,
// as any path nobody serves - and nothing in the startup log offers one.
// agent.test.mjs is the endpoint switched on.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { mcp, serve, toolCall } from "./server.mjs";

const require = createRequire(import.meta.url);
const shipped = require("@cap2ui5/cds-plugin/package.json").cds.requires.cap2ui5;
const s = serve();

test("the shipped settings do not switch it on", () => {
  assert.equal("agent" in shipped, false);
});

test("without the setting the endpoint's path is not served - 404, whoever asks", async () => {
  const url = s.url.replace(/\/rest\/root\/z2ui5$/, "/rest/root/z2ui5/mcp");
  for (const user of ["alice", null]) {
    const r = await mcp(url, toolCall("app_list"), { user });
    assert.equal(r.status, 404, `${user ?? "anonymous"}: ${r.text.slice(0, 200)}`);
  }
  const init = await mcp(url, { jsonrpc: "2.0", id: 1, method: "initialize", params: {} }, { user: "alice" });
  assert.equal(init.status, 404);
});
