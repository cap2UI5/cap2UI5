const cl_abap_char_utilities = require("abap2UI5/cl_abap_char_utilities");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_005 extends z2ui5_if_app {
  value1 = 0;
  value2 = 0;

  async main(client) {
    if (client.check_on_init()) {
      this.value1 = 10;
      this.value2 = 90;
    } else if (client.check_on_event(`SLIDER_CHANGE`)) {
      client.message_toast_display(`Range Slider ${cl_abap_char_utilities.newline}value1 ${this.value1} ${cl_abap_char_utilities.newline}value2 ${this.value2}`);
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Range Slider Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const grid = page.grid(`L12 M12 S12`).content(`layout`);
    grid.simple_form({ title: `More Controls`, editable: true })
      .content(`form`)
      .label(`Range Slider`)
      .range_slider({ max: `100`, min: `0`, step: `10`, startvalue: `10`, endvalue: `20`, showtickmarks: true, labelinterval: `2`, width: `80%`, class: `sapUiTinyMargin`, value: client._bind_edit(this.value1), value2: client._bind_edit(this.value2), change: client._event(`SLIDER_CHANGE`) });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_005;
