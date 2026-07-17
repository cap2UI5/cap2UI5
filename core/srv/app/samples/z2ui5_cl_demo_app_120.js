const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_120 extends z2ui5_if_app {
  longitude = ``;
  latitude = ``;
  altitude = ``;
  speed = ``;
  altitudeaccuracy = ``;
  accuracy = ``;
  mt_spot = [];
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `GEOLOCATION_ERROR`:
        client.message_box_display(`Location unavailable (${client.get_event_arg(1)}): ${client.get_event_arg(2)}`, `error`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Device Capabilities`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      ._z2ui5()
      .geolocation({ finished: this.client._event(`GEOLOCATION_LOADED`), error: this.client._event(`GEOLOCATION_ERROR`, [`\${$parameters>/code}`, `\${$parameters>/message}`]), longitude: this.client._bind_edit(this.longitude), latitude: this.client._bind_edit(this.latitude), altitude: this.client._bind_edit(this.altitude), altitudeaccuracy: this.client._bind_edit(this.altitudeaccuracy), accuracy: this.client._bind_edit(this.accuracy), speed: this.client._bind_edit(this.speed) })
      .simple_form({ title: `Geolocation`, editable: false })
      .content(`form`)
      .label(`Longitude`)
      .input({ value: this.client._bind_edit(this.longitude), editable: false })
      .label(`Latitude`)
      .input({ value: this.client._bind_edit(this.latitude), editable: false })
      .label(`Altitude`)
      .input({ value: this.client._bind_edit(this.altitude), editable: false })
      .label(`Accuracy`)
      .input({ value: this.client._bind_edit(this.accuracy), editable: false })
      .label(`AltitudeAccuracy`)
      .input({ value: this.client._bind_edit(this.altitudeaccuracy), editable: false })
      .label(`Speed`)
      .input({ value: this.client._bind_edit(this.speed), editable: false });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_120;
