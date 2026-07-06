const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_124 extends z2ui5_if_app {
  mv_scan_input = ``;
  mv_scan_type = ``;

  async main(client) {
    switch (client.get().EVENT) {
      case `ON_SCAN_SUCCESS`:
        client.message_box_display(`Scan finished!`);
        const lt_arg = client.get().T_EVENT_ARG;
        this.mv_scan_input = lt_arg[(1) - 1];
        this.mv_scan_type = lt_arg[(2) - 1];
        client.view_model_update();
        return;
        break;
    }
    client.view_display(z2ui5_cl_xml_view.factory().shell().page({ showheader: /* TODO(abap2js) */ xsdbool(false === client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).simple_form({ title: `Information`, editable: true }).content(`form`).label(`mv_scan_input`).input(client._bind_edit(this.mv_scan_input)).label(`mv_scan_type`).input(client._bind_edit(this.mv_scan_type)).label(`scanner`).barcode_scanner_button({ scansuccess: client._event(`ON_SCAN_SUCCESS`, [`\${$parameters>/text}`, `\${$parameters>/format}`]), dialogtitle: `Barcode Scanner` }).stringify());
  }
}

module.exports = z2ui5_cl_demo_app_124;
