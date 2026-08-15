const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_120 extends z2ui5_if_app {
  longitude = ``;
  latitude = ``;
  altitude = ``;
  speed = ``;
  altitudeaccuracy = ``;
  accuracy = ``;
  mt_spot = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    switch (client.get_event()) {
      case `GEOLOCATION_ERROR`:
        client.message_box_display(`Location unavailable (${client.get_event_arg(1)}): ${client.get_event_arg(2)}`, `error`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Device - Geolocation from the Browser` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The geolocation custom control reads the device position from the browser and binds ` + `longitude, latitude, altitude, accuracy and speed into the read-only form below.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag({ n: `Geolocation`, ns: `z2ui5` })
      .a({ n: `finished`, v: this.client._event(`GEOLOCATION_LOADED`) })
      .a({ n: `error`, v: this.client._event(`GEOLOCATION_ERROR`, [`\${$parameters>/code}`, `\${$parameters>/message}`]) })
      .a({ n: `longitude`, v: this.client._bind(this.longitude) })
      .a({ n: `latitude`, v: this.client._bind(this.latitude) })
      .a({ n: `altitude`, v: this.client._bind(this.altitude) })
      .a({ n: `accuracy`, v: this.client._bind(this.accuracy) })
      .a({ n: `altitudeAccuracy`, v: this.client._bind(this.altitudeaccuracy) })
      .a({ n: `speed`, v: this.client._bind(this.speed) })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Geolocation` })
      .a({ n: `editable`, b: false })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Longitude` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.longitude) })
      .tag(`Label`)
      .a({ n: `text`, v: `Latitude` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.latitude) })
      .tag(`Label`)
      .a({ n: `text`, v: `Altitude` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.altitude) })
      .tag(`Label`)
      .a({ n: `text`, v: `Accuracy` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.accuracy) })
      .tag(`Label`)
      .a({ n: `text`, v: `AltitudeAccuracy` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.altitudeaccuracy) })
      .tag(`Label`)
      .a({ n: `text`, v: `Speed` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: this.client._bind(this.speed) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_120;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

