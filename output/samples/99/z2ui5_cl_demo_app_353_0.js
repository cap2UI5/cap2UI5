const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_353_0 extends z2ui5_if_app {
  one = ``;
  focus_field = ``;
  mv_check_active = false;
  ui5_version = ``;
  ui5_theme = ``;
  ui5_gav = ``;
  device_systemtype = ``;
  device_os = ``;
  device_browser = ``;
  device_phone = false;
  device_desktop = false;
  device_tablet = false;
  device_combi = false;
  device_height = ``;
  device_width = ``;
  client = null;

  event() {
    switch (this.client.get().EVENT) {
      case `TIMER_FINISHED`:
        this.client.message_toast_display(`Timer finished`);
        break;
      case `INFO_FINISHED`:
        this.client.message_toast_display(`Frontend finished`);
        break;
    }
    this.client.view_model_update();
  }

  render() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Multiple Timers`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page._z2ui5()
      .timer({ finished: this.client._event(`TIMER_FINISHED`), delayms: `4000`, checkactive: this.client._bind(this.mv_check_active) });
    page._z2ui5()
      .info_frontend({ finished: this.client._event(`INFO_FINISHED`), device_browser: this.client._bind_edit(this.device_browser), device_os: this.client._bind_edit(this.device_os), device_systemtype: this.client._bind_edit(this.device_systemtype), ui5_gav: this.client._bind_edit(this.ui5_gav), ui5_theme: this.client._bind_edit(this.ui5_theme), ui5_version: this.client._bind_edit(this.ui5_version), device_phone: this.client._bind_edit(this.device_phone), device_desktop: this.client._bind_edit(this.device_desktop), device_tablet: this.client._bind_edit(this.device_tablet), device_combi: this.client._bind_edit(this.device_combi), device_height: this.client._bind_edit(this.device_height), device_width: this.client._bind_edit(this.device_width) });
    const form = page._z2ui5()
      .focus(this.client._bind(this.focus_field))
      .simple_form({ editable: true })
      .content(`form`);
    form.label(`device_browser`)
      .input(this.client._bind_edit(this.device_os))
      .label(`device_systemtype`)
      .label(`Cursor here -> `)
      .input({ id: `IdOne`, type: ``, value: this.client._bind_edit(this.one) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.focus_field = `IdOne`;
      this.mv_check_active = true;
      this.render();
    }
    this.event();
  }
}

module.exports = z2ui5_cl_demo_app_353_0;
