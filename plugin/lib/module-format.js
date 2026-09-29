// Which module format a new .js file in a directory has to be written in.
// Node decides it by the package.json nearest to the file: "type": "module"
// makes every .js an ES module, where require( ) is not defined. `cds init`
// writes "type": "module", so a file generated into such a project with
// require( ) fails as soon as it is loaded. `npx cap2ui5 abap2js` and
// `cds add cap2ui5` both ask here.
const fs = require("fs");
const path = require("path");

/** "esm" or "cjs", from the package.json nearest to dir; "esm" without any. */
function moduleFormat(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    const pkg = path.join(d, "package.json");
    if (fs.existsSync(pkg)) return JSON.parse(fs.readFileSync(pkg, "utf8")).type === "module" ? "esm" : "cjs";
    if (path.dirname(d) === d) return "esm";
  }
}

module.exports = { moduleFormat };
