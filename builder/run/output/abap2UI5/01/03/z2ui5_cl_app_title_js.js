
class z2ui5_cl_app_title_js {
  static get() {
    let result = ``;
    result = `// Invisible control that sets the browser tab title from its bound` + `
` + `// \`title\` property.` + `
` + `sap.ui.define(["sap/ui/core/Control", "z2ui5/core/Lib"], (Control, Lib) => {` + `
` + `  "use strict";` + `
` + `  return Control.extend("z2ui5.cc.Title", {` + `
` + `    metadata: {` + `
` + `      properties: {` + `
` + `        title: {` + `
` + `          type: "string",` + `
` + `        },` + `
` + `      },` + `
` + `    },` + `
` + `    setTitle(val) {` + `
` + `      this.setProperty("title", val);` + `
` + `      document.title = Lib.toText(val);` + `
` + `    },` + `
` + `    renderer: { apiVersion: 2, render() {} },` + `
` + `  });` + `
` + `});` + `
` + `` + `
` + ``;
    return result;
  }
}

module.exports = z2ui5_cl_app_title_js;
