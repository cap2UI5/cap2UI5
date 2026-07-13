const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_325 extends z2ui5_if_app {
  input = ``;
  text = ``;

  async main(client) {
    let view;
    let page;
    let header_title;
    let sections;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `Clipboard`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .object_page_layout({ showtitleinheadercontent: true, showeditheaderbutton: true, uppercaseanchorbar: false });
      header_title = page.header_title().object_page_dyn_header_title();
      header_title.expanded_heading().hbox().title({ text: `Test`, wrapping: true });
      header_title.snapped_heading().flex_box({ alignitems: `Center` }).title({ text: `Test`, wrapping: true });
      sections = page.sections();
      sections.object_page_section({ titleuppercase: false, id: `id_sec1`, title: `...` })
        .heading(`uxap`)
        .get_parent()
        .sub_sections()
        .object_page_sub_section({ id: `id_input`, title: `Input field` })
        .blocks()
        .vbox()
        .input({ value: client._bind_edit(this.input), width: `50%` })
        .button({ text: `Copy input`, type: `Emphasized`, press: client._event(`COPY_INPUT`) });
      sections.object_page_section({ titleuppercase: false, id: `id_sec2`, title: `...` })
        .heading(`uxap`)
        .get_parent()
        .sub_sections()
        .object_page_sub_section({ id: `id_text_area`, title: `Text area` })
        .blocks()
        .vbox()
        .button({ text: `Copy text area`, type: `Emphasized`, press: client._event(`COPY_TEXT_AREA`) })
        .text_area({ valueliveupdate: true, editable: true, value: client._bind_edit(this.text), growing: true, growingmaxlines: `50`, width: `100%`, rows: `15`, id: `text_id` });
      client.view_display(view.stringify());
    }
    switch (client.get().EVENT) {
      case `COPY_INPUT`:
        client.action.gen({ val: z2ui5_if_client.cs_event.clipboard_copy, t_arg: [this.input] });
        client.message_toast_display(`input field copied: ${this.input}`);
        break;
      case `COPY_TEXT_AREA`:
        client.action.gen({ val: z2ui5_if_client.cs_event.clipboard_copy, t_arg: [this.text] });
        client.message_toast_display(`text area copied: ${this.text}`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_325;
