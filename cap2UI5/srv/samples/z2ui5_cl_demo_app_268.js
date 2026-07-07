const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_268 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const css = `.size1 {` + ` font-size : 1.5rem;` + `}` + `.size2 {` + ` font-size : 2.5rem;` + `}` + `.size3 {` + ` font-size : 5rem;` + `}` + `.size4 {` + ` font-size : 7.5rem;` + `}` + `.size5 {` + ` font-size : 10rem;` + `}` + `@media (max-width:599px) {` + ` .size1 {` + ` font-size : 1rem;` + ` }` + ` .size2 {` + ` font-size : 2rem;` + `}` + ` .size3 {` + ` font-size : 3rem;` + ` }` + ` .size4 {` + ` font-size : 4rem;` + ` }` + ` .size5 {` + ` font-size : 5rem;` + ` }` + `}`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `style`, ns: `html` })._cc_plain_xml(css).get_parent();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Icon`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.ui.core.Icon/sample/sap.ui.core.sample.Icon` });
    page.hbox({ class: `sapUiSmallMargin` })
      .icon({ src: `sap-icon://syringe`, class: `size1`, color: `#031E48` })
      .get()
      .layout_data(`core`)
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .icon({ src: `sap-icon://pharmacy`, class: `size2`, color: `#64E4CE` })
      .get()
      .layout_data(`core`)
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .icon({ src: `sap-icon://electrocardiogram`, class: `size3`, color: `#E69A17` })
      .get()
      .layout_data(`core`)
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .icon({ src: `sap-icon://doctor`, class: `size4`, color: `#1C4C98` })
      .get()
      .layout_data(`core`)
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .icon({ src: `sap-icon://stethoscope`, class: `size5`, color: `#8875E7`, press: client._event(`handleStethoscopePress`) })
      .get()
      .layout_data(`core`)
      .flex_item_data({ growfactor: `1` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `handleStethoscopePress`:
        client.message_toast_display(`Over budget!`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Built with an embedded font, icons scale well, and can be altered with CSS. ` + `They can also fire a press event. See the Icon Explorer for more icons.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_268;
