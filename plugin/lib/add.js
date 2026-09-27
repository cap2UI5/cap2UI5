// `cds add cap2ui5` - the first app, for a project that has none yet.
//
// cds-dk collects facets through cds.add.register( ), as change-tracking and
// data-inspector register theirs. cds.add exists only while `cds add` runs,
// so the facet class is built on demand (facet( )) and cds-plugin.js asks for
// it only then. The work itself, scaffold( ), needs no cds-dk and is what the
// tests call.
const cds = require("@sap/cds");
const fs = require("fs");
const path = require("path");
const { config } = require("./config");

const LOG = cds.log("cap2ui5");

const HELLO = `// Your first cap2UI5 app - cds watch, then open /sap/bc/z2ui5?app_start=HELLO
// (cds watch prints the address, and the user to log in as).
const { defineApp } = require("cap2ui5");

defineApp("HELLO", class {
  name = "";

  main(c) {
    // isDisplay: the first roundtrip, and every time the app gets the screen back
    if (c.isDisplay) {
      c.view(\`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Shell><Page title="Hello cap2UI5">
          <Input value="\${c.bind("name")}" placeholder="Your name"/>
          <Button text="Go" press="\${c.event("GO")}"/>
        </Page></Shell></mvc:View>\`);
      return;
    }
    if (c.eventName === "GO") c.messageBox(\`Hello \${this.name}\`);
  }
});
`;

/**
 * Write the first app into the project's apps directory, unless it has one.
 * @param {string} root the project root
 * @param {{ apps: string }} conf the plugin's settings (lib/config.js)
 * @returns {string|null} the file written, relative to root - or null
 */
function scaffold(root, conf) {
  const dir = path.resolve(root, conf.apps);
  const apps = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(c|m)?js$/.test(f)) : [];
  if (apps.length) return null;
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "hello.js");
  fs.writeFileSync(file, HELLO);
  return path.relative(root, file);
}

/** The facet, for cds.add.register( ) - only callable while cds add runs. */
function facet() {
  return class Cap2ui5Facet extends cds.add.Plugin {
    static help() {
      return "a first abap2UI5 app in srv/apps/, served by the cap2ui5 plugin";
    }

    async run() {
      const conf = config();
      if (!conf) return LOG.warn("cds.requires.cap2ui5 is false - nothing to add");
      const file = scaffold(cds.root, conf);
      if (!file) return LOG.info(`${conf.apps}/ has apps already - nothing to add`);
      LOG.info(`created ${file} - cds watch, then open ${conf.routes[0]}?app_start=HELLO`);
    }
  };
}

module.exports = { scaffold, facet, HELLO };
