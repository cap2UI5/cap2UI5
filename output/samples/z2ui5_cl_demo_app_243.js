const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_243 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Negative Margins`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .page({ showheader: `false`, class: `sapUiContentPadding` })
      .sub_header()
      .toolbar({ design: `Info` })
      .icon({ src: `sap-icon://begin` })
      .text(`This sample demonstrates classes which let you to add negative margin at two opposite sides (begin/end).`)
      .get_parent()
      .get_parent();
    const layout = page.panel({ class: `sapUiTinyNegativeMarginBeginEnd` })
      .content()
      .text({ text: `This panel uses margin class 'sapUiTinyNegativeMarginBeginEnd' to add a -0.5rem space at the panel's left and right sides.`, class: `sapMH4FontSize` })
      .get_parent()
      .get_parent()
      .panel({ class: `sapUiSmallNegativeMarginBeginEnd` })
      .content()
      .text({ text: `This panel uses margin class 'sapUiSmallNegativeMarginBeginEnd' to add a -1rem space at the panel's left and right sides.`, class: `sapMH4FontSize` })
      .get_parent()
      .get_parent()
      .panel({ class: `sapUiMediumNegativeMarginBeginEnd` })
      .content()
      .text({ text: `This panel uses margin class 'sapUiMediumNegativeMarginBeginEnd' to add a -2rem space at the panel's left and right sides.`, class: `sapMH4FontSize` })
      .get_parent()
      .get_parent()
      .panel({ class: `sapUiLargeNegativeMarginBeginEnd` })
      .content()
      .text({ text: `This panel uses margin class 'sapUiLargeNegativeMarginBeginEnd' to add a -3rem space at the panel's left and right sides.`, class: `sapMH4FontSize` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_243;
