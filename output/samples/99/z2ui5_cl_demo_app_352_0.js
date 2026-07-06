const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_352_0 extends z2ui5_if_app {
  input = ``;

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }

  view_display({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`z2ui5.afterBE = (id , mode) => { ` + `debugger;` + `var input = z2ui5.oView.byId(id).getDomRef();` + `input = input.childNodes[0].childNodes[0];` + `input.setAttribute("inputmode" , mode);` + ` alert("inputmode changed to" + mode); }`);
    const page = view.shell()
      .page({ title: `abap2UI5 - Softkeyboard on/off`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      ._z2ui5()
      .focus(`ZINPUT`)
      .simple_form({ editable: true })
      .content(`form`)
      .title(`Keyboard on/off`)
      .label(`Input`)
      .input({ id: `ZINPUT`, value: client._bind_edit(this.input), showvaluehelp: true, valuehelprequest: client._event(`CALL_KEYBOARD`), valuehelpiconsrc: `sap-icon://keyboard-and-mouse` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CALL_KEYBOARD`)) {
      client.follow_up_action(`z2ui5.afterBE("ZINPUT", "none");`);
    }
  }
}

module.exports = z2ui5_cl_demo_app_352_0;
