const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_118 extends z2ui5_if_app {
  problematic_rows = null;
  these_are_fine_rows = null;

  async main(client) {
    if (client.check_on_init()) {
      this.problematic_rows = [{ id: 1, descr: `filled with the actual date and time in correct format`, adate: sy_datum, atime: sy_uzeit }, { id: 2, descr: `correct init values`, adate: `00000000`, atime: `000000` }, { id: 3, descr: `correct init values by ignoring` }, { id: 4, descr: `filling with a zero leads to a correct init value`, adate: 0, atime: 0 }, { id: 5, descr: `this raises an exception now`, adate: ``, atime: `` }, { id: 6, descr: `Fifth row`, adate: sy_datum, atime: sy_uzeit }];
      this.these_are_fine_rows = [{ id: 1, descr: `First row`, adate: sy_datum, atime: sy_uzeit }, { id: 2, descr: `Second row`, adate: 0, atime: 0 }, { id: 3, descr: `Third row`, adate: 0, atime: 0 }, { id: 4, descr: `Fourth row`, adate: 0, atime: 0 }, { id: 5, descr: `Fifth row`, adate: sy_datum, atime: sy_uzeit }];
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Weird Behavior Showcase`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack(), showheader: true });
    const tab_ko = page.table({ mode: `MultiSelect`, items: client._bind_edit(this.problematic_rows) });
    tab_ko.header_toolbar()
      .toolbar()
      .title(`This table has the weird behavior`)
      .toolbar_spacer()
      .button({ text: `Go`, icon: `sap-icon://blur`, press: client._event(`ON_BTN_GO`) });
    tab_ko.columns()
      .column()
      .text(`ID`)
      .get_parent()
      .column()
      .text(`Description`)
      .get_parent()
      .column()
      .text(`Date `)
      .get_parent()
      .column()
      .text(`Time`);
    tab_ko.items()
      .column_list_item()
      .cells()
      .object_identifier({ title: `{ID}` })
      .get_parent()
      .text(`{DESCR}`)
      .text(`{ADATE}`)
      .text(`{ATIME}`);
    const tab_ok = page.table({ mode: `MultiSelect`, items: client._bind_edit(this.these_are_fine_rows) });
    tab_ok.header_toolbar().toolbar().title(`This table is fine`);
    tab_ok.columns()
      .column()
      .text(`ID`)
      .get_parent()
      .column()
      .text(`Description`)
      .get_parent()
      .column()
      .text(`Date `)
      .get_parent()
      .column()
      .text(`Time`);
    tab_ok.items()
      .column_list_item()
      .cells()
      .object_identifier({ title: `{ID}` })
      .get_parent()
      .text(`{DESCR}`)
      .text(`{ADATE}`)
      .text(`{ATIME}`);
    client.view_display(view.stringify());
    client.action.gen({ val: z2ui5_if_client.cs_event.set_title, t_arg: [`abap2UI5 - Weird Behavior Showcase`] });
  }
}

module.exports = z2ui5_cl_demo_app_118;
