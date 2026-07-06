const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_140 extends z2ui5_if_app {
  gt_multi = [];
  gt_sel_multi = [];
  gt_sel_multi2 = [];
  client = null;

  on_event() {
    try {
      if (this.client.check_on_event(`FILTERBAR`)) {
        this.client.view_model_update();
      }
    } catch (x) {
      this.client.message_box_display(x.get_text(), `error`);
    }
  }

  on_init() {
    this.gt_multi = [{ key: `A01`, text: `T1` }, { key: `A02`, text: `T2` }, { key: `A03`, text: `T3` }, { key: `A04`, text: `T4` }, { key: `A05`, text: `T5` }];
    this.gt_sel_multi2 = [`A01`];
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Multi Combo Box`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `Form Title`, editable: true })
      .content(`form`)
      .multi_combobox({ name: `MultiComboBox`, selectedkeys: this.client._bind_edit(this.gt_sel_multi2), items: this.client._bind_edit(this.gt_multi) })
      .item({ key: `{KEY}`, text: `{TEXT}` })
      .get_parent()
      .button({ text: `post`, press: this.client._event(`BUTTON_POST`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
    this.view_display();
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_140;
