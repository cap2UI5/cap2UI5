#!/usr/bin/env node
/*
 * vendor-agent - copies the agent-snapshot code of abap2UI5/mcp-server into
 * the plugin: the three pure modules behind its app_start / app_describe /
 * app_act tools, which the plugin's MCP endpoint (plugin/lib/agent/) runs.
 *
 *   lib/viewxml.mjs   -> plugin/lib/agent/vendor/viewxml.mjs
 *   lib/snapshot.mjs  -> plugin/lib/agent/vendor/snapshot.mjs
 *   lib/appclient.mjs -> plugin/lib/agent/vendor/appclient.mjs
 *
 * Why vendored and not a dependency: the snapshot is a CONTRACT
 * (docs/agent-snapshot.md upstream) that several implementations share - the
 * MCP server against its transpiled backend, the VS Code extension against a
 * real system, the ABAP addon in-system, and this plugin inside CAP - and the
 * plugin must describe a screen exactly as the server does. A second
 * implementation here is how the two would drift. @abap2ui5/mcp-server is a
 * program with Playwright and the linter as dependencies, not a library, so
 * the code is copied, mechanically, at a recorded COMMIT rather than a moving
 * branch - the way abap2UI5/vscode-extension vendors the same three files
 * (its scripts/vendor-agent.mjs) - and a bump goes through this repository's
 * tests.
 *
 * The copies are byte for byte the upstream files behind a header naming the
 * repository, the path and the commit; they stay `.mjs`, so their sibling
 * imports need no rewrite, and the plugin (CommonJS) loads them with
 * import( ). plugin/lib/agent/vendor/source.json records the commit and the
 * sha256 of every file written, and examples/bookshop/test/agent-vendor.test.mjs
 * (npm test, offline) fails when a copy no longer matches its recorded hash -
 * a hand edit.
 *
 *   node scripts/vendor-agent.mjs /path/to/mcp-server --ref <rev>
 *   node scripts/vendor-agent.mjs /path/to/mcp-server            (its HEAD)
 *   node scripts/vendor-agent.mjs --ref <sha>                    (GitHub raw)
 *   node scripts/vendor-agent.mjs [/path/to/mcp-server] --check
 *        (regenerates from the RECORDED commit in memory and fails when a
 *         committed copy differs - the copy drifted from its source commit)
 *
 * A local checkout is read through `git show <commit>:<path>`, so its working
 * tree and branch do not matter - only that it has the commit.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = "abap2UI5/mcp-server";
const TOOL = "vendor-agent";
export const VENDOR_DIR = "plugin/lib/agent/vendor";
export const SOURCE_RECORD = `${VENDOR_DIR}/source.json`;
const FETCH_TIMEOUT_MS = 30_000;

/** The modules, upstream path -> vendored path. */
export const MODULES = {
  "lib/viewxml.mjs": `${VENDOR_DIR}/viewxml.mjs`,
  "lib/snapshot.mjs": `${VENDOR_DIR}/snapshot.mjs`,
  "lib/appclient.mjs": `${VENDOR_DIR}/appclient.mjs`,
};

/** The header every vendored module starts with. */
export function moduleHeader(from, commit) {
  return (
    "/*\n" +
    ` * VENDORED - do not edit. ${REPO} ${from}\n` +
    ` * at commit ${commit},\n` +
    " * copied unchanged by scripts/vendor-agent.mjs (`npm run agent-vendor`).\n" +
    " * `npm run agent-vendor:check` fails when this copy drifts from that\n" +
    " * commit, agent-vendor.test.mjs when it no longer matches source.json.\n" +
    " * Change it upstream, then re-vendor.\n" +
    " */\n"
  );
}

/** One upstream module as it is vendored: the header, then the file. */
export function vendorModule(text, from, commit) {
  return moduleHeader(from, commit) + text.replace(/\r\n/g, "\n");
}

export const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");

function fail(message, code = 1) {
  console.error(`${TOOL}: ${message}`);
  process.exit(code);
}

const git = (local, args) => execFileSync("git", ["-C", local, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Where the upstream files come from: a local checkout's git objects, or
 *  GitHub raw at the commit. */
function upstream(local, commit) {
  if (local) return { read: async (file) => git(local, ["show", `${commit}:${file}`]) };
  return {
    read: async (file) => {
      const url = `https://raw.githubusercontent.com/${REPO}/${commit}/${file}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) fail(`${url} -> HTTP ${res.status}`, 2);
      return res.text();
    },
  };
}

/** The full commit a ref names: from the checkout, or from the GitHub API. */
async function resolveCommit(local, ref) {
  if (/^[0-9a-f]{40}$/.test(ref)) return ref;
  if (local) return git(local, ["rev-parse", `${ref}^{commit}`]).trim();
  const res = await fetch(`https://api.github.com/repos/${REPO}/commits/${ref}`, {
    headers: { accept: "application/vnd.github.sha" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) fail(`cannot resolve ${REPO}@${ref} -> HTTP ${res.status}`, 2);
  return (await res.text()).trim();
}

/** Every vendored file, path -> content, for one commit. */
async function build(local, commit) {
  const src = upstream(local, commit);
  const files = {};
  const from = {};
  for (const [up, out] of Object.entries(MODULES)) {
    files[out] = vendorModule(await src.read(up), up, commit);
    from[out] = up;
  }
  const record = {
    note: `What scripts/vendor-agent.mjs copied from ${REPO}, at which commit, and the sha256 of every file it ` +
      "wrote. Generated - do not edit; examples/bookshop/test/agent-vendor.test.mjs holds the copies to these hashes.",
    repository: REPO,
    commit,
    files: Object.fromEntries(Object.keys(files).sort()
      .map((out) => [out, { from: from[out], sha256: sha256(files[out]) }])),
  };
  files[SOURCE_RECORD] = `${JSON.stringify(record, null, 2)}\n`;
  return files;
}

/** What is committed in the vendor folder right now. */
function committedFiles() {
  const abs = path.join(ROOT, VENDOR_DIR);
  if (!fs.existsSync(abs)) return {};
  return Object.fromEntries(fs.readdirSync(abs)
    .map((f) => [`${VENDOR_DIR}/${f}`, fs.readFileSync(path.join(abs, f), "utf8")]));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const check = argv.includes("--check");
  const refAt = argv.indexOf("--ref");
  const ref = refAt >= 0 ? argv[refAt + 1] : undefined;
  if (refAt >= 0 && (!ref || ref.startsWith("--"))) fail("--ref needs a value (a commit, tag or branch)");
  const local = argv.find((a, i) => !a.startsWith("--") && !(refAt >= 0 && i === refAt + 1));

  const recordPath = path.join(ROOT, SOURCE_RECORD);
  const recorded = fs.existsSync(recordPath) ? JSON.parse(fs.readFileSync(recordPath, "utf8")).commit : undefined;

  if (check) {
    if (!recorded) fail(`${SOURCE_RECORD} is missing - run \`npm run agent-vendor\` first`);
    const want = await build(local, recorded);
    const have = committedFiles();
    const problems = [];
    for (const [file, text] of Object.entries(want)) {
      if (have[file] === undefined) problems.push(`missing: ${file}`);
      else if (have[file] !== text) problems.push(`differs from ${REPO}@${recorded.slice(0, 12)}: ${file}`);
    }
    for (const file of Object.keys(have)) {
      if (want[file] === undefined) problems.push(`not vendored from upstream (remove it): ${file}`);
    }
    if (problems.length) {
      console.error(`${TOOL}: the vendored agent code DRIFTED from ${REPO}@${recorded}:`);
      for (const p of problems) console.error(`  ${p}`);
      console.error(`Re-vendor with \`npm run agent-vendor -- /path/to/mcp-server --ref ${recorded}\` ` +
        "(or a newer commit) instead of editing the copies.");
      process.exit(1);
    }
    console.log(`agent vendor: up to date with ${REPO}@${recorded.slice(0, 12)} (${Object.keys(want).length} files)`);
  } else {
    if (!local && !ref) fail("name the source - a local checkout (its HEAD is taken) and/or --ref <commit>");
    const commit = await resolveCommit(local, ref || "HEAD");
    const files = await build(local, commit);
    for (const file of Object.keys(committedFiles())) {
      if (files[file] === undefined) fs.rmSync(path.join(ROOT, file));
    }
    for (const [file, text] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
      fs.writeFileSync(path.join(ROOT, file), text);
    }
    console.log(`agent vendor: ${Object.keys(files).length} files from ${REPO}@${commit}` +
      (recorded && recorded !== commit ? ` (was ${recorded.slice(0, 12)})` : ""));
  }
}
