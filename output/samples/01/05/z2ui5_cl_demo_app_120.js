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

  async main(client) {
    let view;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      client.view_display(view.shell().page({ title: `abap2UI5 - Device Capabilities`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })._z2ui5().geolocation({ finished: client._event(`GEOLOCATION_LOADED`), longitude: client._bind_edit(this.longitude), latitude: client._bind_edit(this.latitude), altitude: client._bind_edit(this.altitude), altitudeaccuracy: client._bind_edit(this.altitudeaccuracy), accuracy: client._bind_edit(this.accuracy), speed: client._bind_edit(this.speed) }).simple_form({ title: `Geolocation`, editable: true }).content(`form`).label(`Longitude`).input(client._bind_edit(this.longitude)).label(`Latitude`).input(client._bind_edit(this.latitude)).label(`Altitude`).input(client._bind_edit(this.altitude)).label(`Accuracy`).input(client._bind_edit(this.accuracy)).label(`AltitudeAccuracy`).input(client._bind_edit(this.altitudeaccuracy)).label(`Speed`).input(client._bind_edit(this.speed)).label(`MapContainer`).button({ text: `Display`, press: client._event(`MAP_CONTAINER_DISPLAY`) }).stringify());
      return;
    }
    switch (client.get().EVENT) {
      case `MAP_CONTAINER_DISPLAY`:
        if (this.longitude) {
          this.mt_spot = [{ pos: this.longitude + `;` + this.latitude + `;0`, type: `Default`, contentoffset: `0;-6`, scale: `1;1;1`, key: `Your Position`, tooltip: `Your Position` }];
        }
        view = z2ui5_cl_xml_view.factory();
        client.view_display(view.shell().page({ title: `abap2UI5 - Device Capabilities`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })._z2ui5().geolocation({ finished: client._event(), longitude: client._bind_edit(this.longitude), latitude: client._bind_edit(this.latitude), altitude: client._bind_edit(this.altitude), altitudeaccuracy: client._bind_edit(this.altitudeaccuracy), accuracy: client._bind_edit(this.accuracy), speed: client._bind_edit(this.speed) }).simple_form({ title: `Geolocation`, editable: true }).content(`form`).label(`Longitude`).input(client._bind_edit(this.longitude)).label(`Latitude`).input(client._bind_edit(this.latitude)).label(`Altitude`).input(client._bind_edit(this.altitude)).label(`Accuracy`).input(client._bind_edit(this.accuracy)).label(`AltitudeAccuracy`).input(client._bind_edit(this.altitudeaccuracy)).label(`Speed`).input(client._bind_edit(this.speed)).label(`MapContainer`).button({ text: `Display`, press: client._event(`MAP_CONTAINER_DISPLAY`) }).get_parent().get_parent().map_container({ autoadjustheight: true }).content({ ns: `vk` }).container_content({ title: `Analytic Map`, icon: `sap-icon://geographic-bubble-chart` }).content({ ns: `vk` }).analytic_map({ initialposition: `9.933573;50;0`, initialzoom: `6` }).vos().spots(client._bind(this.mt_spot)).spot({ position: `{POS}`, contentoffset: `{CONTENTOFFSET}`, type: `{TYPE}`, scale: `{SCALE}`, tooltip: `{TOOLTIP}` }).stringify());
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_120;
