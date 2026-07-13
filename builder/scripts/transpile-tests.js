#!/usr/bin/env node
/**
 * transpile-tests — the generator half of the self-healing loop.
 *
 * The upstream abap2UI5 sources carry ~40 ABAP unit-test includes
 * (*.clas.testclasses.abap). They encode the EXPECTED behavior of every
 * framework class — so transpiling them with abap2js and running them
 * against the transpiled/ported code turns every failure into a concrete
 * transpiler-or-port bug on a worklist:
 *
 *   input:  builder/run/input/abap2UI5/src/** /*.clas.testclasses.abap  (no /99/)
 *   output: builder/run/output/tests/<main_class>.units.js   one module per file
 *           builder/run/output/tests/units-report.json
 *
 * Each output module exports { __main, __classes: {name: Class}, __tests:
 * {ltclName: [methodNames]} }. All local classes of one include are emitted
 * into ONE module (they may reference each other); requires of sibling
 * locals are dropped in favor of the in-module definitions.
 *
 * The runner half is builder/test/upstream-units.test.js: it executes every
 * test method (fresh instance + setup/teardown, ABAP AUnit semantics) and
 * diffs the outcome against test/upstream-units.known-failures.json — the
 * ratchet that makes the loop self-healing: a new failure is a REGRESSION
 * (test red), a fixed one still on the list must be delisted (test red),
 * so the list can only shrink.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { transpileClass } = require("./abap2js");

const root = path.join(__dirname, "..");
const INPUT = path.join(root, "run", "input", "abap2UI5", "src");
const OUTPUT = path.join(root, "run", "output", "tests");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "99") walk(p, out); // 99/ = upstream-obsolete tree
    } else if (entry.name.endsWith(".clas.testclasses.abap")) out.push(p);
  }
  return out;
}

/** split an include into class chunks: { name: { def, impl } } (source order kept) */
function splitClasses(source) {
  const chunks = new Map();
  let cur = null; // { name, kind }
  let buf = [];
  for (const line of source.split(/\r?\n/)) {
    const open = line.match(/^\s*CLASS\s+(\w+)\s+(DEFINITION|IMPLEMENTATION)\b/i);
    if (open && !cur) {
      cur = { name: open[1].toLowerCase(), kind: open[2].toUpperCase() };
      buf = [line];
      continue;
    }
    if (cur) {
      buf.push(line);
      if (/^\s*ENDCLASS\s*\./i.test(line)) {
        const slot = chunks.get(cur.name) || { def: "", impl: "" };
        slot[cur.kind === "DEFINITION" ? "def" : "impl"] = buf.join("\n");
        chunks.set(cur.name, slot);
        cur = null;
      }
    }
  }
  return chunks;
}

/** test method names: METHODS <name> ... FOR TESTING (single or chained form) */
function testMethods(def) {
  // class-header noise that also precedes FOR TESTING (CLASS x DEFINITION
  // FINAL FOR TESTING RISK LEVEL HARMLESS DURATION SHORT)
  const STOP = new Set(["final", "abstract", "create", "public", "definition", "testing", "level", "harmless", "critical", "dangerous", "duration", "short", "medium", "long", "risk"]);
  const found = [];
  const re = /(\w+)\s+FOR\s+TESTING/gi;
  let m;
  while ((m = re.exec(def))) {
    const name = m[1].toLowerCase();
    if (!STOP.has(name)) found.push(name);
  }
  return [...new Set(found)];
}

fs.rmSync(OUTPUT, { recursive: true, force: true });
fs.mkdirSync(OUTPUT, { recursive: true });

// the generated modules require("abap2UI5/…") — a node_modules symlink onto
// the published CAP project resolves that natively (package name + exports),
// so the runner works standalone, without jest module mapping
const nm = path.join(OUTPUT, "node_modules");
fs.mkdirSync(nm, { recursive: true });
fs.symlinkSync(path.join(root, "..", "core"), path.join(nm, "abap2UI5"), "junction");

const report = [];
for (const file of walk(INPUT).sort()) {
  const mainClass = path.basename(file).replace(".clas.testclasses.abap", "");
  const source = fs.readFileSync(file, "utf8");
  const chunks = splitClasses(source);
  const localNames = new Set(chunks.keys());

  const requires = new Map(); // varName → require line
  const todoLines = [];
  const bodies = [];
  const tests = {};
  const emitted = [];
  let error = null;

  for (const [name, { def, impl }] of chunks) {
    try {
      const { code } = transpileClass(`${def}\n\n${impl}`, `${name}.clas.abap`);
      const lines = code.split("\n").filter((l) => !/^module\.exports =/.test(l));
      for (const l of lines) {
        const req = l.match(/^const (\w+) = require\("(.*)"\);$/);
        if (req) {
          if (!localNames.has(req[1])) requires.set(req[1], l);
          continue;
        }
        if (/^\/\/ TODO\(abap2js\)/.test(l)) {
          const ref = l.match(/unresolved reference (\w+)/);
          if (ref && localNames.has(ref[1])) continue; // sibling local — defined in-module
          todoLines.push(l);
          continue;
        }
        bodies.push(l);
      }
      const t = testMethods(def);
      if (t.length) tests[name] = t;
      emitted.push(name);
    } catch (e) {
      error = `${name}: ${e.message}`;
      break;
    }
  }

  if (error) {
    report.push({ main: mainClass, error });
    continue;
  }

  const out = [
    `// GENERATED from ${path.relative(root, file)} — do not edit`,
    ...[...requires.values()].sort(),
    ...todoLines,
    "",
    ...bodies,
    "",
    `module.exports = {`,
    `  __main: ${JSON.stringify(mainClass)},`,
    `  __classes: { ${emitted.join(", ")} },`,
    `  __tests: ${JSON.stringify(tests)},`,
    `};`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUTPUT, `${mainClass}.units.js`), out);
  report.push({ main: mainClass, classes: emitted.length, tests: Object.values(tests).flat().length, todos: todoLines.length });
}

fs.writeFileSync(path.join(OUTPUT, "units-report.json"), JSON.stringify(report, null, 2) + "\n");
const total = report.reduce((n, r) => n + (r.tests || 0), 0);
console.log(`${report.length} testclass includes → ${total} test methods (${report.filter((r) => r.error).length} failed to transpile)`);
