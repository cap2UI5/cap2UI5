const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_256 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const css = `.fixFlexFixedSize > .sapUiFixFlexFixed {` + ` background: #D7E9FF;` + `}` + `.fixFlexFixedSize > .sapUiFixFlexFlexible {` + ` background: #A9CFFF;` + `}` + `.fixFlexFixedSize .sapMText {` + ` margin-bottom: 1rem;` + `}`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `style`, ns: `html` })._cc_plain_xml(css).get_parent();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Fix Flex - Fix container size`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.ui.layout.FixFlex/sample/sap.ui.layout.sample.FixFlexFixedSize` });
    const layout = page.fix_flex({ ns: `layout`, class: `fixFlexFixedSize`, fixcontentsize: `150px` })
      .fix_content(`layout`)
      .scroll_container({ height: `100%`, vertical: true })
      .text(`Fix content - Lorem Ipsum is simply dummy text of the printing and typesetting industry. ` + `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley ` + `of type and scrambled it to make a type specimen book. ` + `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ` + `It was popularised in the 1960s with the release of Letraset sheets containing.`)
      .text(`Fix content - Lorem Ipsum is simply dummy text of the printing and typesetting industry. ` + `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley ` + `of type and scrambled it to make a type specimen book. ` + `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ` + `It was popularised in the 1960s with the release of Letraset sheets containing.`)
      .text(`Fix content - Lorem Ipsum is simply dummy text of the printing and typesetting industry. ` + `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley ` + `of type and scrambled it to make a type specimen book. ` + `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ` + `It was popularised in the 1960s with the release of Letraset sheets containing.`)
      .text(`Fix content - Lorem Ipsum is simply dummy text of the printing and typesetting industry. ` + `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley ` + `of type and scrambled it to make a type specimen book. ` + `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ` + `It was popularised in the 1960s with the release of Letraset sheets containing.`)
      .get_parent()
      .get_parent()
      .flex_content(`layout`)
      .text({ class: `column1`, text: `This container is flexible and it will adapt its size to fill the remaining size in the FixFlex control` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows a FixFlex control where fixContentSize is set to a specific value(150px) and sap.m.scrollContainer is enabling vertical scrolling.` });
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

module.exports = z2ui5_cl_demo_app_256;
