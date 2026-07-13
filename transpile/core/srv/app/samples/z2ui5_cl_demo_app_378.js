const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_378 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Panel`, class: `sapUiContentPadding`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Panel` });
    page.panel({ headertext: `Fixed Panel`, class: `sapUiSmallMarginBottom` })
      .text(`A basic panel with a header text and content. It cannot be collapsed.`);
    page.panel({ expandable: true, expanded: true, headertext: `Expandable Panel (initially expanded)`, class: `sapUiSmallMarginBottom`, expand: this.client._event(`EXPAND`, [`\${$source>/expanded}`]) })
      .text(`Collapse or expand this panel with the arrow in the header. The expand event is sent to the backend.`);
    page.panel({ expandable: true, expanded: false, headertext: `Expandable Panel (initially collapsed)`, class: `sapUiSmallMarginBottom` })
      .text(`This content is hidden until the panel is expanded.`);
    const panel = page.panel({ expandable: true, expanded: true });
    panel.header_toolbar()
      .toolbar()
      .title(`Panel with Header Toolbar`)
      .toolbar_spacer()
      .button({ icon: `sap-icon://settings`, type: `Transparent`, tooltip: `Settings`, press: this.client._event(`SETTINGS`) });
    panel.text(`Instead of a plain header text the panel can host a complete toolbar with actions.`);
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `EXPAND`:
        this.client.message_toast_display(`Panel expanded: ${this.client.get_event_arg(1)}`);
        break;
      case `SETTINGS`:
        this.client.message_toast_display(`Settings pressed`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The panel groups content under a header. It can be expandable and its header can be a plain text or a full toolbar.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_378;
