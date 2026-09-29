#!/usr/bin/env node
// cap2ui5 - the package's command line. One command so far:
//
//   npx --no-install cap2ui5 abap2js <class.clas.abap | directory>... [options]
//
// --no-install: this package's cap2ui5 or none - where the package is not
// installed, a bare `npx cap2ui5` downloads whatever npm has under that name.
//
// It translates abap2UI5 app classes into cap2UI5 app modules, one module per
// class, named after it: z2ui5_cl_my_app.clas.abap becomes
// srv/apps/z2ui5_cl_my_app.js, registered as Z2UI5_CL_MY_APP, so ?app_start=
// is the same on both sides. lib/abap2js.js says what is translated and what
// is refused; a refused class is reported with file, row and column and
// nothing is written for it.
//
//   --out <dir>       where the modules go (default: srv/apps)
//   --lib <dir>       where the other classes a class names are read from -
//                     `zcl_other=>ty_s_row` (repeatable; default: the
//                     directories of the inputs)
//   --origin <text>   `// @origin <text> <path of the input>` in each module
//   --esm | --cjs     the module format (default: what the package.json
//                     nearest to --out declares, ES modules for "module")
//   --check           write nothing; exit 1 when a module is missing or would change
//
// The exit code is 1 when any class was refused or, with --check, differs.
//
// It needs @abaplint/core, an optional peer dependency of the package: a
// project that translates adds it with `npm add -D @abaplint/core`.
"use strict";

const fs = require("fs");
const path = require("path");
const { moduleFormat } = require("../lib/module-format");
const { requireCore } = require("../lib/abaplint-core");

const USAGE = `usage: cap2ui5 abap2js <class.clas.abap | directory>... [--out dir] [--lib dir]... [--origin text] [--esm | --cjs] [--check]`;

function args(argv) {
  const o = { inputs: [], lib: [], out: "srv/apps", origin: null, format: null, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value\n${USAGE}`);
      return argv[++i];
    };
    if (a === "--out") o.out = value();
    else if (a === "--lib") o.lib.push(value());
    else if (a === "--origin") o.origin = value();
    else if (a === "--esm") o.format = "esm";
    else if (a === "--cjs") o.format = "cjs";
    else if (a === "--check") o.check = true;
    else if (a.startsWith("--")) throw new Error(`unknown option ${a}\n${USAGE}`);
    else o.inputs.push(a);
  }
  if (!o.inputs.length) throw new Error(USAGE);
  return o;
}

/** The classes behind the inputs: files as given, directories walked. */
function classes(inputs) {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".clas.abap")) out.push(p);
    }
  };
  for (const i of inputs) {
    if (!fs.existsSync(i)) throw new Error(`${i}: no such file or directory`);
    if (fs.statSync(i).isDirectory()) walk(i);
    else out.push(i);
  }
  return out;
}


function abap2jsCommand(argv) {
  const o = args(argv);
  // the parser is an optional peer: missing, this says how to add it
  requireCore();
  const { abap2js, library, Abap2jsError } = require("../lib/abap2js");
  const files = classes(o.inputs);
  const dirs = o.lib.length ? o.lib : [...new Set(files.map((f) => path.dirname(f)))];
  const lib = library(dirs);
  if (!lib.frameworkFound) {
    throw new Error("@abap2ui5/node-runtime carries no downport/ - the client's ABAP types are read from there");
  }
  const format = o.format ?? moduleFormat(o.out);
  let refused = 0;
  let changed = 0;
  let written = 0;
  for (const file of files) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
    let result;
    try {
      result = abap2js(fs.readFileSync(file, "utf8"), {
        file, library: lib, format, origin: o.origin ? `${o.origin} ${rel}` : undefined,
      });
    } catch (e) {
      if (!(e instanceof Abap2jsError)) throw e;
      refused++;
      console.error(`refused: ${e.message}`);
      continue;
    }
    const target = path.join(o.out, `${result.name.toLowerCase()}.js`);
    const before = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
    if (o.check) {
      if (before !== result.code) {
        changed++;
        console.error(`${before === null ? "missing" : "differs"}: ${target}`);
      }
      continue;
    }
    fs.mkdirSync(o.out, { recursive: true });
    if (before !== result.code) fs.writeFileSync(target, result.code);
    written++;
  }
  const summary = o.check
    ? `${files.length - refused - changed} up to date, ${changed} to regenerate, ${refused} refused`
    : `${written} translated into ${o.out}, ${refused} refused`;
  console.log(`cap2ui5 abap2js: ${summary}`);
  return refused || changed ? 1 : 0;
}

function main(argv) {
  const [command, ...rest] = argv;
  if (command === "abap2js") return abap2jsCommand(rest);
  console.error(command ? `unknown command ${command}\n${USAGE}` : USAGE);
  return 1;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}

module.exports = { main };
