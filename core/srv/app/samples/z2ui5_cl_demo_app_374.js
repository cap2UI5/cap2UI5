const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_374 extends z2ui5_if_app {
  t_items = [];
  detail_text = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_items = z2ui5_cl_util.abap_tab_assign(this.t_items, [{ title: `Product A`, descr: `First product` }, { title: `Product B`, descr: `Second product` }, { title: `Product C`, descr: `Third product` }]);
      this.detail_text = `Select an item from the master list.`;
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Split Container`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.SplitContainer` });
    const split = page.split_container();
    split.master_pages()
      .page(`Master`)
      .list(this.client._bind(this.t_items))
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, type: `Active`, press: this.client._event(`ITEM_PRESS`, [`\${TITLE}`]) });
    split.detail_pages()
      .page({ title: `Detail`, class: `sapUiContentPadding` })
      .text(this.client._bind(this.detail_text));
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `ITEM_PRESS`:
        this.detail_text = `${this.client.get_event_arg()} selected in the master list.`;
        this.client.view_model_update();
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The split container keeps a master list and a detail area side by side. On phones only one of the two pages is visible at a time.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_374;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

