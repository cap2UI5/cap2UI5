const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_071 extends z2ui5_if_app {
  mv_set_size_limit = 100;
  mv_combo_number = 105;
  t_combo = [];

  async main(client) {
    switch (client.get().EVENT) {
      case `UPDATE`:
        client.follow_up_action({ val: `SET_SIZE_LIMIT`, t_arg: [(this.mv_set_size_limit), client.cs_view.main] });
        client.message_toast_display(`SizeLimitUpdated`);
        return;
        break;
      case `UPDATE_MODEL`:
        this.t_combo = {};
        for (let sy_index = 1; sy_index <= this.mv_combo_number; sy_index++) {
          this.t_combo.push({ key: sy_index, text: sy_index });
        }
        client.message_toast_display(`update number of entries`);
        client.view_model_update();
        return;
        break;
    }
    this.mv_combo_number = 105;
    for (let sy_index = 1; sy_index <= this.mv_combo_number; sy_index++) {
      this.t_combo.push({ key: sy_index, text: sy_index });
    }
    const view = z2ui5_cl_xml_view.factory();
    client.view_display(view.shell().page({ title: `abap2UI5 - First Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).title(`Input`).label(`Link`).label(`setSizeLimit`).input({ value: client._bind_edit(this.mv_set_size_limit) }).button({ text: `update size limit`, press: client._event(`UPDATE`) }).label(`Number of Entries`).input({ value: client._bind_edit(this.mv_combo_number) }).button({ text: `update number entries`, press: client._event(`UPDATE_MODEL`) }).label(`demo`).combobox({ items: client._bind(this.t_combo) }).item({ key: `{KEY}`, text: `{TEXT}` }).get_parent().get_parent().stringify());
  }
}

module.exports = z2ui5_cl_demo_app_071;
