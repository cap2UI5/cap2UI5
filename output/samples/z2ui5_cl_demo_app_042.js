const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_042 extends z2ui5_if_app {
  async main(client) {
    if (client.check_on_init()) {
    }
    switch (client.get().EVENT) {
      case `BUTTON_ROUNDTRIP`:
        const lv_dummy = `user pressed a button, your custom implementation can be called here`;
        break;
      case `BUTTON_MSG_BOX`:
        client.message_box_display(`this is a message box with a custom text`, `success`);
        break;
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.object_page_layout({ showtitleinheadercontent: true, showeditheaderbutton: true, editheaderbuttonpress: client._event(`EDIT_HEADER_PRESS`), uppercaseanchorbar: false });
    const header_title = page.header_title().object_page_dyn_header_title();
    header_title.expanded_heading().hbox().title({ text: `Oblomov Dev`, wrapping: true });
    header_title.snapped_heading()
      .flex_box({ alignitems: `Center` })
      .avatar({ src: lcl_help.get_avatar(), class: `sapUiTinyMarginEnd` })
      .title({ text: `Oblomov Dev`, wrapping: true });
    header_title.expanded_content(`uxap`).text(`abap2UI5 Developer`);
    header_title.snapped_content(`uxap`).text(`abap2UI5 Developer`);
    header_title.snapped_title_on_mobile().title(`abap2UI5 Developer`);
    header_title.actions(`uxap`)
      .overflow_toolbar()
      .overflow_toolbar_button({ icon: `sap-icon://edit`, text: `edit header`, type: `Emphasized`, tooltip: `edit` })
      .overflow_toolbar_button({ icon: `sap-icon://pull-down`, text: `show section`, type: `Emphasized`, tooltip: `pull-down` })
      .overflow_toolbar_button({ icon: `sap-icon://show`, text: `show state`, tooltip: `show` })
      .button({ text: `Go Back`, press: client._event_nav_app_leave() });
    const header_content = page.header_content(`uxap`);
    header_content.flex_box({ wrap: `Wrap` })
      .avatar({ src: lcl_help.get_avatar(), class: `sapUiSmallMarginEnd`, displaysize: `layout` })
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .link({ text: `+33 6 4512 5158` })
      .link({ text: `email@email.com` })
      .get_parent()
      .horizontal_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(`Hello! I am an abap2UI5 developer`)
      .label(`San Jose, USA`)
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(`Hello! I am an abap2UI5 developer`)
      .vbox()
      .label(`Achived goals`)
      .progress_indicator({ percentvalue: `30%`, displayvalue: `30%` })
      .get_parent()
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(`San Jose, USA`)
      .get_parent();
    const sections = page.sections();
    sections.object_page_section({ titleuppercase: false, id: `goalsSectionSS1`, title: `2014 Goals Plan` })
      .heading(`uxap`)
      .message_strip(`this is a message strip`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `goalssubSectionSS1`, title: `goals1` })
      .blocks()
      .vbox()
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .label(`goals1`)
      .get_parent()
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `goalsSectionWS1`, title: `goals2` })
      .blocks()
      .vbox()
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`)
      .label(`goals2`);
    sections.object_page_section({ titleuppercase: false, id: `PersonalSection`, title: `Personal` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `personalSectionSS1`, title: `Connect` })
      .blocks()
      .label(`telephone`)
      .label(`email`)
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `personalSectionWS2`, title: `Payment information ` })
      .blocks()
      .label(`Hello! I am an abap2UI5 developer`)
      .label(`San Jose, USA`);
    sections.object_page_section({ titleuppercase: false, id: `employmentSection`, title: `Employment` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `empSectionSS1`, title: `Job information` })
      .blocks()
      .label(`info`)
      .label(`info`)
      .label(`info`)
      .label(`info`)
      .label(`info`)
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `empSectionWS2`, title: `Employee Details ` })
      .blocks()
      .vbox()
      .label(`details`)
      .label(`details`)
      .label(`details`)
      .label(`details`)
      .label(`details`)
      .label(`details`)
      .label(`details`)
      .label(`details`);
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_042;
