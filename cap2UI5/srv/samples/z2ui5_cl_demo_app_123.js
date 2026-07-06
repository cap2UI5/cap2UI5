const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_123 extends z2ui5_if_app {
  mt_spot = [];
  mt_route = [];
  mt_legend = [];

  async main(client) {
    if (client.check_on_init()) {
      this.mt_spot = [{ pos: `9.98336;53.55024;0`, contentoffset: `0;-6`, scale: `1;1;1`, key: `Hamburg`, tooltip: `Hamburg`, type: `Default`, icon: `factory` }, { pos: `11.5820;48.1351;0`, contentoffset: `0;-5`, scale: `1;1;1`, key: `Munich`, tooltip: `Munich`, type: `Default`, icon: `factory` }, { pos: `8.683340000;50.112000000;0`, contentoffset: `0;-6`, scale: `1;1;1`, key: `Frankfurt`, tooltip: `Frankfurt`, type: `Default`, icon: `factory` }];
      this.mt_route = [{ position: `2.3522219;48.856614;0; -74.0059731;40.7143528;0`, routetype: `Geodesic`, linedash: `10;5`, color: `92,186,230`, colorborder: `rgb(255,255,255)`, linewidth: `25` }];
      this.mt_legend = [{ text: `Dashed flight route`, color: `rgb(92,186,230)` }, { text: `Flight route`, color: `rgb(92,186,35)` }];
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Map Container`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const map = page.map_container({ autoadjustheight: true })
      .content(`vk`)
      .container_content({ title: `Analytic Map`, icon: `sap-icon://geographic-bubble-chart` })
      .content(`vk`)
      .analytic_map({ initialposition: `9.933573;50;0`, initialzoom: `6` });
    map.vos()
      .spots(client._bind(this.mt_spot))
      .spot({ position: `{POS}`, contentoffset: `{CONTENTOFFSET}`, type: `{TYPE}`, scale: `{SCALE}`, tooltip: `{TOOLTIP}` });
    map.routes(client._bind(this.mt_route))
      .route({ position: `{POSITION}`, routetype: `{ROUTETYPE}`, linedash: `{LINEDASH}`, color: `{COLOR}`, colorborder: `{COLORBORDER}`, linewidth: `{LINEWIDTH}` });
    map.legend_area()
      .legend({ items: client._bind(this.mt_legend), caption: `Legend` })
      .legenditem({ text: `{TEXT}`, color: `{COLOR}` });
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_123;
