const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_002 extends z2ui5_if_app {
  s_screen = { check_is_active: false, colour: ``, combo_key: ``, combo_key2: ``, segment_key: ``, date: ``, date_time: ``, time_start: ``, time_end: ``, check_switch_01: false, check_switch_02: false };
  t_suggestions = [];
  t_combo = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.s_screen = { check_is_active: true, colour: `BLUE`, combo_key: `GRAY`, segment_key: `GREEN`, date: `07.12.22`, date_time: `23.12.2022, 19:27:20`, time_start: `05:24:00`, time_end: `17:23:57` };
    this.t_suggestions = [{ descr: `Green`, value: `GREEN` }, { descr: `Blue`, value: `BLUE` }, { descr: `Black`, value: `BLACK` }, { descr: `Gray`, value: `GRAY` }, { descr: `Blue2`, value: `BLUE2` }, { descr: `Blue3`, value: `BLUE3` }];
    this.t_combo = [{ key: `BLUE`, text: `green` }, { key: `GREEN`, text: `blue` }, { key: `BLACK`, text: `red` }, { key: `GRAY`, text: `gray` }];
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_SEND`:
        this.client.message_box_display(`success - values sent to the server`);
        break;
      case `BUTTON_CLEAR`:
        this.s_screen = {};
        this.client.message_toast_display(`View initialized`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Selection-Screen Example`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const grid = page.grid(`L6 M12 S12`).content(`layout`);
    grid.simple_form({ title: `Input`, editable: true })
      .content(`form`)
      .label(`Input with suggestion items`)
      .input({ id: `suggInput`, value: this.client._bind_edit(this.s_screen.colour), placeholder: `Fill in your favorite color`, suggestionitems: this.client._bind(this.t_suggestions), showsuggestion: true })
      .get()
      .suggestion_items()
      .get()
      .list_item({ text: `{VALUE}`, additionaltext: `{DESCR}` });
    grid.simple_form({ title: `Time Inputs`, editable: true })
      .content(`form`)
      .label(`Date`)
      .date_picker(this.client._bind_edit(this.s_screen.date))
      .label(`Date and Time`)
      .date_time_picker(this.client._bind_edit(this.s_screen.date_time))
      .label(`Time Begin/End`)
      .time_picker(this.client._bind_edit(this.s_screen.time_start))
      .time_picker(this.client._bind_edit(this.s_screen.time_end));
    const content = page.grid(`L12 M12 S12`)
      .content(`layout`)
      .simple_form({ title: `Input with select options`, editable: true })
      .content(`form`);
    content.label(`Checkbox`)
      .checkbox({ selected: this.client._bind_edit(this.s_screen.check_is_active), text: `this is a checkbox`, enabled: true });
    content.label(`Combobox`)
      .combobox({ selectedkey: this.client._bind_edit(this.s_screen.combo_key), items: this.client._bind(this.t_combo) })
      .item({ key: `{KEY}`, text: `{TEXT}` });
    content.label(`Combobox2`)
      .combobox({ selectedkey: this.client._bind_edit(this.s_screen.combo_key2), items: this.client._bind(this.t_combo) })
      .item({ key: `{KEY}`, text: `{TEXT}` });
    content.label(`Segmented Button`)
      .segmented_button(this.client._bind_edit(this.s_screen.segment_key))
      .items()
      .segmented_button_item({ key: `BLUE`, icon: `sap-icon://accept`, text: `blue` })
      .segmented_button_item({ key: `GREEN`, icon: `sap-icon://add-favorite`, text: `green` })
      .segmented_button_item({ key: `BLACK`, icon: `sap-icon://attachment`, text: `black` });
    content.label(`Switch disabled`).switch_({ enabled: false, customtexton: `A`, customtextoff: `B` });
    content.label(`Switch accept/reject`)
      .switch_({ state: this.client._bind_edit(this.s_screen.check_switch_01), customtexton: `on`, customtextoff: `off`, type: `AcceptReject` });
    content.label(`Switch normal`)
      .switch_({ state: this.client._bind_edit(this.s_screen.check_switch_02), customtexton: `YES`, customtextoff: `NO` });
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Clear`, press: this.client._event(`BUTTON_CLEAR`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Send to Server`, press: this.client._event(`BUTTON_SEND`), type: `Success` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_002;
