const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_141 extends z2ui5_if_app {
  t_tab = [];
  mv_textarea = ``;
  mv_stretch_active = false;
  ms_popup_input = { value1: ``, value2: ``, check_is_active: false, combo_key: `` };
  t_bapiret = null;
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP_TO_INPUT`:
        this.ms_popup_input.value1 = `value1`;
        this.popup_display();
        break;
    }
  }

  on_init() {
    this.t_bapiret = [{ message: `An empty Report field causes an empty XML Message to be sent`, type: `E`, id: `MSG1`, number: `001` }, { message: `Check was executed for wrong Scenario`, type: `E`, id: `MSG1`, number: `002` }, { message: `Request was handled without errors`, type: `S`, id: `MSG1`, number: `003` }, { message: `product activated`, type: `S`, id: `MSG4`, number: `375` }, { message: `check the input values`, type: `W`, id: `MSG2`, number: `375` }, { message: `product already in use`, type: `I`, id: `MSG2`, number: `375` }];
  }

  popup_display() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ contentheight: `500px`, contentwidth: `500px`, title: `Title` });
    dialog.content()
      .simple_form()
      .label({ text: `Input1`, id: `lbl1` })
      .input(this.client._bind_edit(this.ms_popup_input.value1))
      .label(`Input2`)
      .input(this.client._bind_edit(this.ms_popup_input.value2))
      .label(`Checkbox`)
      .checkbox({ selected: this.client._bind_edit(this.ms_popup_input.check_is_active), text: `this is a checkbox`, enabled: true })
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_TEXTAREA_CANCEL`) })
      .button({ text: `Confirm`, press: this.client._event_client(this.client.cs_event.popup_close), type: `Emphasized` });
    dialog._generic({ name: `HTML`, ns: `core`, t_prop: [{ n: `content`, v: `<script> z2ui5.setBlackColor(); </script>` }, { n: `preferDOM`, v: `true` }] })
      .get_parent();
    this.client.popup_display(popup.stringify());
  }

  view_display() {
    const css = `` + `.lbl-color { color: red !important; font-size: 30px !important; }`;
    const script = `` + `z2ui5.setBlackColor = function() {` + `\\n` + ` var lbl = sap.ui.getCore()
      .byId('popupId--lbl1');` + `\\n` + ` lbl.setText('changed from js');` + `\\n` + ` lbl.addStyleClass('lbl-color');` + `\\n` + `};`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `style`, ns: `html` })._cc_plain_xml(css).get_parent();
    view._generic({ name: `script`, ns: `html` })._cc_plain_xml(script).get_parent();
    const page = view.shell()
      .page({ title: `abap2UI5 - Popups`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const grid = page.grid(`L8 M12 S12`).content(`layout`);
    grid.simple_form(`Inputs`)
      .content(`form`)
      .label(`01`)
      .button({ text: `Popup Get Input Values`, press: this.client._event(`POPUP_TO_INPUT`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_141;
