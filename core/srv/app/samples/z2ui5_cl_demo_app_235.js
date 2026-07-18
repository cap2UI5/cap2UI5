const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_235 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Toolbar vs Bar vs OverflowToolbar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Toolbar/sample/sap.m.sample.ToolbarVsBar` });
    const page_02 = page_01.page({ title: `Bar can center a Title.`, titlelevel: `H2`, class: `sapUiContentPadding`, shownavbutton: true })
      .header_content()
      .button({ icon: `sap-icon://action` })
      .get_parent()
      .sub_header()
      .toolbar()
      .button({ type: `Back`, tooltip: `Back` })
      .toolbar_spacer()
      .title({ text: `Toolbar center`, level: `H3` })
      .toolbar_spacer()
      .get_parent()
      .get_parent()
      .content()
      .message_strip({ text: `A Toolbar's centering technique will be slightly off the center if there is a button on the left.`, class: `sapUiTinyMargin` })
      .toolbar()
      .label(`Toolbar can shrink content in case of overflow.`)
      .layout_data()
      .toolbar_layout_data({ shrinkable: false })
      .get_parent()
      .get_parent()
      .button({ text: `Accept`, type: `Accept` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .label(`This is a long non-shrinkable label.`)
      .layout_data()
      .toolbar_layout_data({ shrinkable: false })
      .get_parent()
      .get_parent()
      .button({ text: `Reject`, type: `Reject` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .button({ text: `Big Big Big Big Big Big Big Big Button` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .get_parent()
      .label()
      .bar()
      .content_left()
      .label(`Bar cannot really handle overflow it just cuts the content.`)
      .get_parent()
      .content_middle()
      .button({ text: `Accept`, type: `Accept` })
      .label(`This is a long non-shrinkable label.`)
      .button({ text: `Reject`, type: `Reject` })
      .button({ text: `Edit` })
      .button({ text: `Big Big Big Big Big Big Big Big Button` })
      .get_parent()
      .get_parent()
      .label()
      .overflow_toolbar()
      .label(`OverflowToolbar provides a See more (...) button for overflow.`)
      .layout_data()
      .toolbar_layout_data({ shrinkable: false })
      .get_parent()
      .get_parent()
      .button({ text: `Accept`, type: `Accept` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .label(`This is a long non-shrinkable label.`)
      .layout_data()
      .toolbar_layout_data({ shrinkable: false })
      .get_parent()
      .get_parent()
      .button({ text: `Reject`, type: `Reject` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .button({ text: `Big Big Big Big Big Big Big Big Button` })
      .layout_data()
      .toolbar_layout_data({ shrinkable: true })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .toolbar();
    client.view_display(page_02.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_235;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

