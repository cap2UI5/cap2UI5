
class z2ui5_cl_app_title_js {
  static get() {
    let result = ``;
    result = `// Invisible control that sets the browser tab title from its bound` + `\\n` + `// ``title`` property.` + `\\n` + `sap.ui.define(["sap/ui/core/Control", "z2ui5/core/Lib"], (Control, Lib) => {` + `\\n` + ` "use strict";` + `\\n` + ` return Control.extend("z2ui5.cc.Title", {` + `\\n` + ` metadata: {` + `\\n` + ` properties: {` + `\\n` + ` title: {` + `\\n` + ` type: "string",` + `\\n` + ` },` + `\\n` + ` },` + `\\n` + ` },` + `\\n` + ` setTitle(val) {` + `\\n` + ` this.setProperty("title", val);` + `\\n` + ` document.title = Lib.toText(val);` + `\\n` + ` },` + `\\n` + ` renderer: { apiVersion: 2, render() {} },` + `\\n` + ` });` + `\\n` + `});` + `\\n` + `` + `\\n` + ``;
    return result;
  }
}

module.exports = z2ui5_cl_app_title_js;
