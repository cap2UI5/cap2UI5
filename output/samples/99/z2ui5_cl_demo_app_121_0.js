const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_121_0 extends z2ui5_if_app {
  longitude = ``;
  latitude = ``;
  altitude = ``;
  speed = ``;
  altitudeaccuracy = ``;
  accuracy = ``;

  async main(client) {
    if (client.check_on_init()) {
      client.view_display(z2ui5_cl_xml_view.factory()._z2ui5().timer(client._event()).stringify());
      return;
    }
    switch (client.get().EVENT) {
      case `TIMER_FINISHED`:
        client.message_box_display(`Timer finished!`);
        return;
        break;
    }
    const view = z2ui5_cl_xml_view.factory();
    client.view_display(view.shell().page({ title: `abap2UI5`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })._z2ui5().timer({ finished: client._event(`TIMER_FINISHED`), delayms: `2000` }).simple_form({ title: `Timer Interval 2000 ms`, editable: true }).content(`form`).stringify());
  }
}

module.exports = z2ui5_cl_demo_app_121_0;
