const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_103 extends z2ui5_if_app {
  t_products = [];
  t_products_sorted = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, product_id: `HT-1000`, quantity: `10` }, { name: `Notebook Basic 17`, product_id: `HT-1001`, quantity: `20` }, { name: `Notebook Basic 18`, product_id: `HT-1002`, quantity: `10` }, { name: `Notebook Basic 19`, product_id: `HT-1003`, quantity: `15` }, { name: `ITelO Vault`, product_id: `HT-1007`, quantity: `15` }, { name: `Notebook Professional 15`, product_id: `HT-1010`, quantity: `16` }, { name: `Notebook Professional 17`, product_id: `HT-1011`, quantity: `17` }, { name: `ITelO Vault Net`, product_id: `HT-1020`, quantity: `14` }, { name: `ITelO Vault SAT`, product_id: `HT-1021`, quantity: `50` }, { name: `Comfort Easy`, product_id: `HT-1022`, quantity: `30` }, { name: `Comfort Senior`, product_id: `HT-1023`, quantity: `24` }, { name: `Ergo Screen E-I`, product_id: `HT-1030`, quantity: `14` }, { name: `Ergo Screen E-II`, product_id: `HT-1031`, quantity: `24` }, { name: `Ergo Screen E-III`, product_id: `HT-1032`, quantity: `50` }, { name: `Flat Basic`, product_id: `HT-1035`, quantity: `23` }, { name: `Flat Future`, product_id: `HT-1036`, quantity: `22` }]);
    this.t_products_sorted = z2ui5_cl_util.abap_tab_assign(this.t_products_sorted, z2ui5_cl_util.abap_copy(this.t_products));
    this.t_products_sorted.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `ROOT_RESIZE`:
        this.resize_message({ val: `Root container is resized.` });
        break;
      case `INNER_RESIZE`:
        this.resize_message({ val: `Inner container is resized.` });
        break;
    }
  }

  resize_message({ val } = {}) {
    const old_sizes = this.client.get_event_arg();
    const new_sizes = this.client.get_event_arg(2);
    let message = z2ui5_cl_util.abap_copy(val);
    if (old_sizes) {
      message = `${message}${z2ui5_cl_sample_context.cv_char_util_newline}Old panes sizes = [${old_sizes}]`;
    }
    message = `${message}${z2ui5_cl_sample_context.cv_char_util_newline}New panes sizes = [${new_sizes}]`;
    this.client.message_toast_display(message);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: ResponsiveSplitter`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.ui.layout.ResponsiveSplitter/sample/sap.ui.layout.sample.ResponsiveSplitter` });
    const root_container = page.responsive_splitter({ defaultpane: `default` })
      .pane_container({ resize: this.client._event(`ROOT_RESIZE`, [`\${$parameters>/oldSizes}`, `\${$parameters>/newSizes}`]) });
    root_container.split_pane({ requiredparentwidth: `400`, id: `default` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .panel({ headertext: `Minimum parent width 400`, height: `100%` })
      .text(`LayoutData.size=auto`)
      .list({ headertext: `Products`, items: this.client._bind(this.t_products) })
      .standard_list_item({ title: `{NAME}`, counter: `{QUANTITY}` });
    const inner_container = root_container.pane_container({ orientation: `Vertical`, resize: this.client._event(`INNER_RESIZE`, [`\${$parameters>/oldSizes}`, `\${$parameters>/newSizes}`]) });
    inner_container.split_pane({ requiredparentwidth: `600` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .panel({ headertext: `Minimum parent width 600` })
      .vbox()
      .text(`LayoutData.size=auto`)
      .select({ forceselection: false, selectedkey: `1239102`, items: this.client._bind(this.t_products_sorted) })
      .item({ key: `{PRODUCT_ID}`, text: `{NAME}` });
    const pane_page = inner_container.split_pane({ requiredparentwidth: `800` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .page(`Minimum parent width 800`);
    pane_page.text(`LayoutData.size=auto`);
    pane_page.footer()
      .overflow_toolbar()
      .label(`Buttons:`)
      .toolbar_spacer()
      .button({ text: `New`, type: `Transparent` })
      .button({ text: `Open`, type: `Transparent` })
      .button({ text: `Save`, type: `Transparent` })
      .button({ text: `Save as`, type: `Transparent` })
      .button({ text: `Cut`, type: `Transparent` })
      .button({ text: `Copy`, type: `Transparent` })
      .button({ text: `Paste`, type: `Transparent` })
      .button({ text: `Undo`, type: `Transparent` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_103;

const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

