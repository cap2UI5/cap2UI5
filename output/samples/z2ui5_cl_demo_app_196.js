const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_196 extends z2ui5_if_app {
  mv_slider_value = 0;
  mt_shapes = [];
  client = null;

  initialize() {
    this.mv_slider_value = 0;
    this.mt_shapes = [{ id: `arrow_down` }, { id: `arrow_left` }, { id: `arrow_right` }, { id: `arrow_up` }, { id: `attention_1` }, { id: `attention_2` }, { id: `building` }, { id: `bulb` }, { id: `bull` }, { id: `calendar` }, { id: `car` }, { id: `cart` }, { id: `cereals` }, { id: `circle` }, { id: `clock` }, { id: `cloud` }, { id: `conveyor` }, { id: `desk` }, { id: `document` }, { id: `documents` }, { id: `dollar` }, { id: `donut` }, { id: `drop` }, { id: `envelope` }, { id: `euro` }, { id: `factory` }, { id: `female` }, { id: `fish` }, { id: `flag` }, { id: `folder_1` }, { id: `folder_2` }, { id: `gear` }, { id: `heart` }, { id: `honey` }, { id: `house` }, { id: `information` }, { id: `letter` }, { id: `lung` }, { id: `machine` }, { id: `male` }, { id: `pen` }, { id: `person` }, { id: `pin` }, { id: `plane` }, { id: `printer` }, { id: `progress` }, { id: `question` }, { id: `robot` }, { id: `sandclock` }, { id: `speed` }, { id: `stomach` }, { id: `success` }, { id: `tank_diesel` }, { id: `tank_lpg` }, { id: `thermo` }, { id: `tool` }, { id: `transfusion` }, { id: `travel` }, { id: `turnip` }, { id: `vehicle_construction` }, { id: `vehicle_tank` }, { id: `vehicle_tractor` }, { id: `vehicle_truck_1` }, { id: `vehicle_truck_2` }, { id: `vehicle_truck_3` }, { id: `warehouse` }];
  }

  view_display() {
    let lv_script = ``;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ ns: `html`, name: `style` })
      ._cc_plain_xml(`.SICursorStyle:hover {` + ` cursor: pointer;` + `}` + `.SIBorderStyle {` + ` border: 1px solid #cccccc;` + `}` + `.SIPanelStyle .sapMPanelContent{` + ` overflow: visible;` + `}`);
    const page = view.shell()
      .page({ showheader: (!((this.client.get().CHECK_LAUNCHPAD_ACTIVE) === true || (this.client.get().CHECK_LAUNCHPAD_ACTIVE) === `X`)), title: `abap2UI5 - Status Indicators Library`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const panel = page.panel({ class: `sapUiResponsiveMargin SIPanelStyle`, width: `95%` });
    panel.text(`Use the slider for adjusting the fill`);
    panel.slider({ class: `sapUiLargeMarginBottom`, enabletickmarks: true, value: this.client._bind_edit(this.mv_slider_value) })
      .get()
      .responsive_scale({ tickmarksbetweenlabels: `10` });
    const fb = panel.flex_box({ wrap: `Wrap`, items: this.client._bind(this.mt_shapes) });
    fb.items()
      .flex_box({ direction: `Column`, class: `sapUiTinyMargin SIBorderStyle` })
      .items()
      .status_indicator({ value: this.client._bind_edit(this.mv_slider_value), width: `120px`, height: `120px`, class: `sapUiTinyMargin SICursorStyle` })
      .property_thresholds()
      .property_threshold({ fillcolor: `Error`, tovalue: `25` })
      .get_parent()
      .property_threshold({ fillcolor: `Critical`, tovalue: `60` })
      .get_parent()
      .property_threshold({ fillcolor: `Good`, tovalue: `100` })
      .get_parent()
      .get_parent()
      .shape_group()
      .library_shape({ shapeid: `{ID}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.initialize();
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_196;
