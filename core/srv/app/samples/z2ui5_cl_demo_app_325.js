const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_325 extends z2ui5_if_app {
  input = ``;
  text = ``;

  async main(client) {
    let view;
    let page;
    let obj_page;
    let header_title;
    let sections;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `Clipboard`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.message_strip({ text: `Copy the input field or text-area content to the system clipboard via the clipboard_copy follow-up action.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
      obj_page = page.object_page_layout({ showtitleinheadercontent: true, showeditheaderbutton: true, uppercaseanchorbar: false });
      header_title = obj_page.header_title().object_page_dyn_header_title();
      header_title.expanded_heading().hbox().title({ text: `Test`, wrapping: true });
      header_title.snapped_heading().flex_box({ alignitems: `Center` }).title({ text: `Test`, wrapping: true });
      sections = obj_page.sections();
      sections.object_page_section({ titleuppercase: false, id: `id_sec1`, title: `...` })
        .sub_sections()
        .object_page_sub_section({ id: `id_input`, title: `Input field` })
        .blocks()
        .vbox()
        .input({ value: client._bind(this.input), width: `50%` })
        .button({ text: `Copy input`, type: `Emphasized`, press: client._event(`COPY_INPUT`) });
      sections.object_page_section({ titleuppercase: false, id: `id_sec2`, title: `...` })
        .sub_sections()
        .object_page_sub_section({ id: `id_text_area`, title: `Text area` })
        .blocks()
        .vbox()
        .button({ text: `Copy text area`, type: `Emphasized`, press: client._event(`COPY_TEXT_AREA`) })
        .text_area({ valueliveupdate: true, editable: true, value: client._bind(this.text), growing: true, growingmaxlines: `50`, width: `100%`, rows: `15`, id: `text_id` });
      client.view_display(view.stringify());
    }
    switch (client.get().EVENT) {
      case `COPY_INPUT`:
        client.follow_up_action(z2ui5_if_client.cs_event.clipboard_copy, [this.input]);
        client.message_toast_display(`input field copied: ${this.input}`);
        break;
      case `COPY_TEXT_AREA`:
        client.follow_up_action(z2ui5_if_client.cs_event.clipboard_copy, [this.text]);
        client.message_toast_display(`text area copied: ${this.text}`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_325;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

