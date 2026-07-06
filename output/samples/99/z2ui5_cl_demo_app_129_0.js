const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_129_0 extends z2ui5_if_app {
  lv_text = ``;
  screen = { check_is_active: false, colour: ``, combo_key: ``, combo_key2: ``, segment_key: ``, date: ``, date_time: ``, time_start: ``, time_end: ``, check_switch_01: false, check_switch_02: false };
  mt_suggestion = [];

  async main(client) {
    if (client.check_on_init()) {
      this.lv_text = 10;
      this.on_init();
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `REFRESH`:
        this.lv_text = this.lv_text + 10;
        client.view_model_update();
        break;
      case `BUTTON_SEND`:
        this.popup_display_view({ client: client });
        break;
      case `BUTTON_POPOVER`:
        this.popover_display({ client, id: `ppvr` });
        break;
    }
  }

  on_init() {
    this.screen = { check_is_active: true, colour: `BLUE`, combo_key: `GRAY`, segment_key: `GREEN`, date: `07.12.22`, date_time: `23.12.2022, 19:27:20`, time_start: `05:24:00`, time_end: `17:23:57` };
    this.mt_suggestion = [{ descr: `Green`, value: `GREEN` }, { descr: `Blue`, value: `BLUE` }, { descr: `Black`, value: `BLACK` }, { descr: `Grey`, value: `GREY` }, { descr: `Blue2`, value: `BLUE2` }, { descr: `Blue3`, value: `BLUE3` }];
  }

  view_display({ client } = {}) {
    let page = z2ui5_cl_xml_view.factory();
    page._z2ui5().timer({ finished: client._event(`REFRESH`), checkrepeat: true, delayms: `3000` });
    page = page.shell()
      .page({ title: `abap2UI5 - Selection-Screen Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: true });
    let grid = page.grid(`L6 M12 S12`).content(`layout`);
    grid = grid.text(client._bind_edit({ val: this.lv_text, view: client.cs_view.main }));
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ id: `ppvr`, text: `Open Popover`, press: client._event(`BUTTON_POPOVER`, [`${$source>/sId}`]), type: `Ghost` })
      .button({ text: `Open Popup`, press: client._event(`BUTTON_SEND`), type: `Success` });
    client.view_display(page.stringify());
  }

  popover_display({ id, client } = {}) {
    const popover = z2ui5_cl_xml_view.factory_popup().popover({ placement: `Top` });
    popover.text(`this is popover in middle with timer auto refresh`);
    client.popover_display(popover.stringify(), id);
  }

  popup_display_view({ client } = {}) {
    const dialog = z2ui5_cl_xml_view.factory_popup().dialog();
    dialog.text(`this is popup in middle with timer auto refresh`);
    dialog.button({ text: `close`, press: client._event_client(client.cs_event.popup_close) });
    client.popup_display(dialog.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_129_0;
