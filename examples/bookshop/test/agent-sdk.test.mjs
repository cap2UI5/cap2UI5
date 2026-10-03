// The agent endpoint driven by the official MCP client
// (@modelcontextprotocol/sdk, Client over StreamableHTTPClientTransport) -
// what Claude Code and other clients built on it do: initialize, the
// initialized notification, tools/list, tools/call. The other agent tests
// speak the JSON-RPC by hand; this one holds the endpoint to a client that
// was not written against it.
import assert from "node:assert/strict";
import { test } from "node:test";
import { URL } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { serve } from "./server.mjs";

process.env.CDS_REQUIRES_CAP2UI5_AGENT = "true";
const s = serve();

async function connect(user) {
  const client = new Client({ name: "cap2ui5-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(`${s.url}/mcp`), {
    requestInit: { headers: { Authorization: "Basic " + Buffer.from(`${user}:`).toString("base64") } },
  });
  await client.connect(transport);
  return client;
}

test("the SDK's client connects, lists the four tools and operates the Books app", async () => {
  const client = await connect("alice");
  try {
    assert.equal(client.getServerVersion()?.name, "cap2ui5");
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name), ["app_list", "app_start", "app_describe", "app_act"]);

    const listed = await client.callTool({ name: "app_list", arguments: {} });
    assert.deepEqual(JSON.parse(listed.content[0].text).apps.map((a) => a.app), ["ZCL_JS_BOOKS"]);

    const started = await client.callTool({ name: "app_start", arguments: { app: "ZCL_JS_BOOKS" } });
    const snap = JSON.parse(started.content[0].text);
    assert.equal(snap.fields[0].path, "/SEARCH");

    const acted = await client.callTool({ name: "app_act",
      arguments: { session: snap.session, values: { SEARCH: "Jane" }, event: "SEARCH" } });
    assert.equal(acted.isError, undefined);
    assert.deepEqual(JSON.parse(acted.content[0].text).tables[0].rows.map((r) => r.TITLE), ["Jane Eyre"]);

    const refused = await client.callTool({ name: "app_act", arguments: { session: JSON.parse(acted.content[0].text).session, event: "ADD" } });
    assert.equal(refused.isError, true);
    assert.match(refused.content[0].text, /needs a human/);
  } finally {
    await client.close();
  }
});

test("without credentials the SDK's client gets no connection", async () => {
  const client = new Client({ name: "cap2ui5-test", version: "1.0.0" });
  await assert.rejects(client.connect(new StreamableHTTPClientTransport(new URL(`${s.url}/mcp`))), /401|Unauthorized/i);
});
