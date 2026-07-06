const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_134_0 extends z2ui5_if_app {
  t_tab = [];
  mv_scrollupdate = false;
  field_01 = ``;
  field_02 = ``;
  focus_id = ``;
  selstart = ``;
  selend = ``;
  update_focus = false;
  mt_scroll = [];

  view_display({ client } = {}) {
    const ls_row = { title: `Peter`, value: `red`, info: `completed`, descr: `this is a description` };
    for (let sy_index = 1; sy_index <= 100; sy_index++) {
      this.t_tab.push(ls_row);
    }
    const view = z2ui5_cl_xml_view.factory().shell();
    const page = view.page({ id: `id_page`, title: `abap2UI5 - Scrolling (use Chrome to avoid incompatibilities)`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page._z2ui5()
      .scrolling({ setupdate: client._bind_edit(this.mv_scrollupdate), items: client._bind_edit(this.mt_scroll) });
    const tab = page.table({ sticky: `ColumnHeaders,HeaderToolbar`, headertext: `Table with some entries`, items: client._bind(this.t_tab) });
    tab.columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Color`)
      .get_parent()
      .column()
      .text(`Info`)
      .get_parent()
      .column()
      .text(`Description`);
    tab.items().column_list_item().cells().text(`{TITLE}`).text(`{VALUE}`).text(`{INFO}`).text(`{DESCR}`);
    page.footer()
      .overflow_toolbar()
      .button({ text: `Scroll Top`, press: client._event(`BUTTON_SCROLL_TOP`) })
      .button({ text: `Scroll 500 up`, press: client._event(`BUTTON_SCROLL_UP`) })
      .button({ text: `Scroll 500 down`, press: client._event(`BUTTON_SCROLL_DOWN`) })
      .button({ text: `Scroll Bottom`, press: client._event(`BUTTON_SCROLL_BOTTOM`) });
    client.view_display(view.stringify());
  }

  init({ client } = {}) {
    this.field_01 = `this is a text`;
    this.field_02 = `this is another text`;
    this.selstart = `3`;
    this.selend = `7`;
    this.mt_scroll.push({ n: `id_page` });
    this.view_display({ client: client });
  }

  async main(client) {
    if (client.check_on_init()) {
      this.init({ client: client });
      return;
    }
    client.message_toast_display(`server roundtrip`);
    switch (client.get().EVENT) {
      case `BUTTON_SCROLL_TOP`:
        this.mt_scroll = {};
        this.mt_scroll.push({ n: `id_page`, v: `0` });
        this.mv_scrollupdate = true;
        client.view_model_update();
        break;
      case `BUTTON_SCROLL_UP`:
        let lv_pos = (this.mt_scroll.find((row) => row.n === `id_page`).v);
        lv_pos = lv_pos - 500;
        if (lv_pos < 0) {
          lv_pos = 0;
        }
        this.mt_scroll.find((row) => row.n === `id_page`)
          .v = /* TODO(abap2js) */ shift_left(this.shift_right((lv_pos)));
        this.mv_scrollupdate = true;
        client.view_model_update();
        break;
      case `BUTTON_SCROLL_DOWN`:
        lv_pos = this.mt_scroll.find((row) => row.n === `id_page`).v;
        lv_pos = lv_pos + 500;
        if (lv_pos < 0) {
          lv_pos = 0;
        }
        this.mt_scroll.find((row) => row.n === `id_page`)
          .v = /* TODO(abap2js) */ shift_left(this.shift_right((lv_pos)));
        this.mv_scrollupdate = true;
        client.view_model_update();
        break;
      case `BUTTON_SCROLL_BOTTOM`:
        this.mt_scroll = {};
        this.mt_scroll.push({ n: `id_page`, v: `99999` });
        this.mv_scrollupdate = true;
        client.view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_134_0;
