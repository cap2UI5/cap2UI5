const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_084 extends z2ui5_if_app {
  screen = { check_is_active: false, colour: ``, combo_key: ``, combo_key2: ``, segment_key: ``, date: ``, date_time: ``, time_start: ``, time_end: ``, check_switch_01: false, check_switch_02: false };
  mt_suggestion = [];
  client = null;

  async main(client) {
    let lv_script;
    this.client = client;
    if (client.check_on_init()) {
      lv_script = `` + `\\n` + `function setInputFIlter(){` + `\\n` + ` var inp = z2ui5.oView.byId('suggInput');` + `\\n` + ` inp.setFilterFunction(function(sValue, oItem){` + `\\n` + ` var aSplit = sValue.split(" ");` + `\\n` + ` if (aSplit.length > 0) {` + `\\n` + ` var sTermNew = aSplit.slice(-1)[0];` + `\\n` + ` sTermNew.trim();` + `\\n` + ` if (sTermNew) {` + `\\n` + ` return oItem.getText().match(new RegExp(sTermNew, "i"));` + `\\n` + ` }` + `\\n` + ` }` + `\\n` + ` });` + `\\n` + `}`;
      client.view_display(z2ui5_cl_xml_view.factory()._z2ui5().timer(client._event(`START`))._generic({ ns: `html`, name: `script` })._cc_plain_xml(lv_script).stringify());
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `START`:
        this.view_display();
        break;
      case `BUTTON_MCUSTOM`:
        this.client.message_box_display(`Custom MessageBox`, ``, `Custom MessageBox`, undefined, `callMessageToast()`, [`First Button`, `Second Button`], `First Button`, undefined, undefined, `SUCCESS`, `<h3>these are details</h3>`);
        break;
      case `BUTTON_MCONFIRM`:
        this.client.message_box_display(`Confirm MessageBox`, `confirm`);
        break;
      case `BUTTON_MALERT`:
        this.client.message_box_display(`Alert MessageBox`, `alert`);
        break;
      case `BUTTON_MERROR`:
        this.client.message_box_display(`Error MessageBox`, `error`);
        break;
      case `BUTTON_MINFO`:
        this.client.message_box_display(`Information MessageBox`, `information`);
        break;
      case `BUTTON_MWARNING`:
        this.client.message_box_display(`Warning MessageBox`, `warning`);
        break;
      case `BUTTON_MSUCCESS`:
        this.client.message_box_display(`Success MessageBox`, `success`, undefined, undefined, undefined, undefined, undefined, undefined, undefined, `sap-icon://accept`);
        break;
      case `BUTTON_SEND`:
        this.client.message_box_display(`success - values sent to the server`);
        break;
      case `BUTTON_CLEAR`:
        this.screen = { check_is_active: false, colour: ``, combo_key: ``, combo_key2: ``, segment_key: ``, date: ``, date_time: ``, time_start: ``, time_end: ``, check_switch_01: false, check_switch_02: false };
        this.client.message_toast_display(`View initialized`);
        break;
    }
  }

  on_init() {
    this.screen = { check_is_active: true, colour: `BLUE`, combo_key: `GRAY`, segment_key: `GREEN`, date: `07.12.22`, date_time: `23.12.2022, 19:27:20`, time_start: `05:24:00`, time_end: `17:23:57` };
    this.mt_suggestion = [{ descr: `Green`, value: `GREEN` }, { descr: `Blue`, value: `BLUE` }, { descr: `Black`, value: `BLACK` }, { descr: `Gray`, value: `GRAY` }, { descr: `Blue2`, value: `BLUE2` }, { descr: `Blue3`, value: `BLUE3` }];
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`function callMessageToast(sAction) { sap.m.MessageToast.show('Hello there !!'); }`);
    const page = view.shell()
      .page({ showheader: (false === this.client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5 - Selection-Screen Example`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const grid = page.grid(`L6 M12 S12`).content(`layout`);
    grid.simple_form({ title: `Input`, editable: true })
      .content(`form`)
      .label(`Input with suggestion items`)
      .input({ id: `suggInput`, value: this.client._bind_edit(this.screen.colour), placeholder: `Fill in your favorite color`, suggestionitems: this.client._bind(this.mt_suggestion), showsuggestion: true })
      .get()
      .suggestion_items()
      .get()
      .list_item({ text: `{VALUE}`, additionaltext: `{DESCR}` });
    page.footer()
      .overflow_toolbar()
      .text(`MessageBox Types`)
      .button({ text: `Confirm`, press: this.client._event(`BUTTON_MCONFIRM`) })
      .button({ text: `Alert`, press: this.client._event(`BUTTON_MALERT`) })
      .button({ text: `Error`, press: this.client._event(`BUTTON_MERROR`) })
      .button({ text: `Information`, press: this.client._event(`BUTTON_MINFO`) })
      .button({ text: `Warning`, press: this.client._event(`BUTTON_MWARNING`) })
      .button({ text: `Success`, press: this.client._event(`BUTTON_MSUCCESS`) })
      .button({ text: `Custom`, press: this.client._event(`BUTTON_MCUSTOM`) })
      .toolbar_spacer()
      .button({ text: `Clear`, press: this.client._event(`BUTTON_CLEAR`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Send to Server`, press: this.client._event(`BUTTON_SEND`), type: `Success` });
    view._generic({ name: `script`, ns: `html` })._cc_plain_xml(`setInputFIlter()`);
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_084;
