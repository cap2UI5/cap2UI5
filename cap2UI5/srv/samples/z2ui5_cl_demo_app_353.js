const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_353 extends z2ui5_if_app {
  one = ``;
  ui5_version = ``;
  ui5_theme = ``;
  device_systemtype = ``;
  device_os = ``;
  device_browser = ``;
  device_height = ``;
  device_width = ``;
  client = null;

  read_device_info() {
    const ls_get = this.client.get();
    this.device_browser = z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.BROWSER.NAME);
    this.device_os = z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.OS.NAME);
    this.device_systemtype = z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.SYSTEM);
    this.device_height = (ls_get.S_DEVICE.RESIZE.HEIGHT);
    this.device_width = (ls_get.S_DEVICE.RESIZE.WIDTH);
    this.ui5_version = z2ui5_cl_util.abap_copy(ls_get.S_UI5.VERSION);
    this.ui5_theme = z2ui5_cl_util.abap_copy(ls_get.S_UI5.THEME);
  }

  start_timer() {
    this.client.action.gen({ val: z2ui5_if_client.cs_event.start_timer, t_arg: [this.client._event(`TIMER_FINISHED`), `4000`] });
  }

  render() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Multiple Timers`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const form = page.simple_form({ editable: true }).content(`form`);
    form.label(`device_browser`)
      .input(this.client._bind_edit(this.device_browser))
      .label(`device_os`)
      .input(this.client._bind_edit(this.device_os))
      .label(`device_systemtype`)
      .input(this.client._bind_edit(this.device_systemtype))
      .label(`device_height`)
      .input(this.client._bind_edit(this.device_height))
      .label(`device_width`)
      .input(this.client._bind_edit(this.device_width))
      .label(`ui5_version`)
      .input(this.client._bind_edit(this.ui5_version))
      .label(`ui5_theme`)
      .input(this.client._bind_edit(this.ui5_theme))
      .label(`Cursor here ->`)
      .input({ id: `IdOne`, value: this.client._bind_edit(this.one) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.read_device_info();
      this.render();
      this.start_timer();
      client.action.gen({ val: z2ui5_if_client.cs_event.set_focus, t_arg: [`IdOne`] });
    }
    if (client.check_on_event(`TIMER_FINISHED`)) {
      client.message_toast_display(`Timer finished`);
      this.start_timer();
      client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_353;
