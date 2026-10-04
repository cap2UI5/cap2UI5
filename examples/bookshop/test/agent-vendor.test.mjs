// The agent-snapshot code vendored from abap2UI5/mcp-server
// (scripts/vendor-agent.mjs -> plugin/lib/agent/vendor/).
//
// The copies are held to their record: every vendored file matches the
// sha256 source.json recorded when it was copied, starts with the header that
// names that commit, and nothing else lies in the folder - so a hand edit
// fails here, offline. Whether the record still matches upstream is
// `npm run agent-vendor:check`, which needs the source; with MCP_SERVER_DIR
// pointing at a checkout of abap2UI5/mcp-server this test runs it as well.
//
// The second half pins what lib/agent/index.js relies on of the client:
// createAppClient's options transport, location and backendHint, the draft
// id the transport is handed, and AgentError for a refusal.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const DIR = path.join(ROOT, "plugin", "lib", "agent", "vendor");
const RECORD = JSON.parse(fs.readFileSync(path.join(DIR, "source.json"), "utf8"));
const sha256 = (file) => createHash("sha256").update(fs.readFileSync(path.join(ROOT, file), "utf8"), "utf8").digest("hex");

test("every vendored file matches the hash its record holds - no hand edits", () => {
  assert.equal(RECORD.repository, "abap2UI5/mcp-server");
  assert.match(RECORD.commit, /^[0-9a-f]{40}$/);
  assert.deepEqual(Object.values(RECORD.files).map((f) => f.from).sort(),
    ["lib/appclient.mjs", "lib/snapshot.mjs", "lib/viewxml.mjs"]);
  for (const [file, { sha256: want }] of Object.entries(RECORD.files)) {
    assert.equal(sha256(file), want, `${file} differs from what scripts/vendor-agent.mjs wrote - edit upstream and re-vendor`);
  }
});

test("every copy names its source and commit, and the folder holds nothing else", () => {
  for (const [file, { from }] of Object.entries(RECORD.files)) {
    const head = fs.readFileSync(path.join(ROOT, file), "utf8").split("\n").slice(0, 3).join("\n");
    assert.match(head, new RegExp(`VENDORED - do not edit\\. abap2UI5/mcp-server ${from.replace(".", "\\.")}`));
    assert.ok(head.includes(`at commit ${RECORD.commit}`), `${file}: ${head}`);
  }
  const listed = new Set(Object.keys(RECORD.files).map((f) => path.basename(f)));
  for (const f of fs.readdirSync(DIR)) {
    assert.ok(f === "source.json" || listed.has(f), `${f} lies in the vendor folder but was not vendored`);
  }
});

test("against a checkout of mcp-server (MCP_SERVER_DIR): the copies are its files at the recorded commit", (t) => {
  if (!process.env.MCP_SERVER_DIR) return t.skip("MCP_SERVER_DIR is not set");
  const out = execFileSync(process.execPath, [path.join(ROOT, "scripts", "vendor-agent.mjs"), process.env.MCP_SERVER_DIR, "--check"],
    { encoding: "utf8" });
  assert.match(out, /up to date/);
});

test("what the plugin uses of the client: transport, location, backendHint, the draft id, AgentError", async () => {
  const { createAppClient, AgentError } = await import(pathToFileURL(path.join(DIR, "appclient.mjs")).href);
  const sent = [];
  const view = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="T"><Input value="{/NAME}"/>' +
    "<Button text=\"Go\" press=\".eB(['GO'])\"/></Page></mvc:View>";
  const client = createAppClient({
    transport: async ({ body, headers, draftId }) => {
      sent.push({ body: JSON.parse(body), headers, draftId });
      const id = `D${sent.length}`;
      return { status: 200, body: JSON.stringify({ S_FRONT: { ID: id, APP: "ZCL_X",
        S_ACTION: { T_SYSTEM: [["VIEW_SLOTS", "display", "MAIN", view, {}]] } }, MODEL: { NAME: "" } }) };
    },
    location: (app) => ({ origin: "https://host", pathname: "/rest/root/z2ui5", search: `?app_start=${app}` }),
    backendHint: "HINT",
  });
  const snap = await client.start("ZCL_X");
  assert.deepEqual(sent[0].body.value.S_FRONT, { ORIGIN: "https://host", PATHNAME: "/rest/root/z2ui5", SEARCH: "?app_start=ZCL_X" });
  assert.equal(sent[0].draftId, null);
  assert.equal(sent[0].headers["content-type"], "application/json");
  assert.equal(snap.session, "D1");
  await client.act("D1", { values: { NAME: "Ada" }, event: "GO" });
  assert.equal(sent[1].draftId, "D1");
  assert.deepEqual(sent[1].body.value.MODEL, { NAME: "Ada" });
  assert.deepEqual(client.sessions(), [{ session: "D2", app: "ZCL_X" }]);
  await assert.rejects(client.act("D2", { event: "NOPE" }), (e) => e instanceof AgentError && /allowed events: GO/.test(e.message));

  const down = createAppClient({ transport: async () => { throw new Error("boom"); }, location: () => ({}), backendHint: "HINT" });
  await assert.rejects(down.start("ZCL_X"), (e) => e instanceof AgentError && e.message === "the backend did not answer (boom) - HINT");
});
