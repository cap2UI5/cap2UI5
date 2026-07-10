const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_bal extends z2ui5_if_app {
  mt_msg = [];
  mt_msg_bal = [];
  mv_object = ``;
  mv_subobject = ``;
  mv_extnumber = ``;
  mv_check_save = false;
  client = null;
  title = ``;

  static factory({ i_messages, i_title = `abap2UI5 - Business Application Log`, i_object, i_subobject, i_extnumber, i_check_save = false } = {}) {
    let r_result = null;
    let sy_tabix = 0;
    r_result = new z2ui5_cl_pop_bal();
    r_result.mt_msg_bal = z2ui5_cl_util.msg_get_t(i_messages);
    sy_tabix = 0;
    for (const lr_row of r_result.mt_msg_bal) {
      sy_tabix++;
      r_result.mt_msg.push({ type: z2ui5_cl_util.ui5_get_msg_type(lr_row.type), title: lr_row.text, id: lr_row.id, number: lr_row.no, message_v1: lr_row.v1, message_v2: lr_row.v2, message_v3: lr_row.v3, message_v4: lr_row.v4, message: lr_row.text, subtitle: `${lr_row.id} ${lr_row.no}`, date: z2ui5_cl_util.time_get_date_by_stampl(lr_row.timestampl), time: z2ui5_cl_util.time_get_time_by_stampl(lr_row.timestampl) });
    }
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    r_result.mv_object = z2ui5_cl_util.abap_copy(i_object);
    r_result.mv_subobject = z2ui5_cl_util.abap_copy(i_subobject);
    r_result.mv_extnumber = z2ui5_cl_util.abap_copy(i_extnumber);
    r_result.mv_check_save = z2ui5_cl_util.abap_copy(i_check_save);
    return r_result;
  }

  static factory_by_db({ i_object, i_subobject, i_extnumber, i_title = `abap2UI5 - Business Application Log`, i_check_save = false } = {}) {
    let r_result = null;
    r_result = z2ui5_cl_pop_bal.factory({ i_messages: z2ui5_cl_util.bal_read({ object: i_object, subobject: i_subobject, id: i_extnumber }), i_title, i_object, i_subobject, i_extnumber, i_check_save });
    return r_result;
  }

  view_display() {
    let popup = z2ui5_cl_xml_view.factory_popup();
    popup = popup.dialog({ title: this.title, contentheight: `50%`, contentwidth: `50%`, verticalscrolling: false, afterclose: this.client._event(`BUTTON_CONTINUE`) });
    if ((this.mv_check_save === true || this.mv_check_save === `X`)) {
      popup.overflow_toolbar()
        .label(`Object`)
        .input({ value: this.client._bind_edit(this.mv_object), width: `10rem` })
        .label(`Subobject`)
        .input({ value: this.client._bind_edit(this.mv_subobject), width: `10rem` })
        .label(`External Number`)
        .input({ value: this.client._bind_edit(this.mv_extnumber), width: `10rem` });
    }
    const table = popup.table(this.client._bind(this.mt_msg));
    table.columns()
      .column()
      .text(`Date`)
      .get_parent()
      .column()
      .text(`Time`)
      .get_parent()
      .column()
      .text(`Type`)
      .get_parent()
      .column()
      .text(`ID`)
      .get_parent()
      .column()
      .text(`No`)
      .get_parent()
      .column()
      .text(`Message`);
    table.items()
      .column_list_item()
      .cells()
      .text(`{DATE}`)
      .text(`{TIME}`)
      .text(`{TYPE}`)
      .text(`{ID}`)
      .text(`{NUMBER}`)
      .text(`{MESSAGE}`);
    const buttons = popup.buttons();
    if ((this.mv_check_save === true || this.mv_check_save === `X`)) {
      buttons.button({ text: `Save`, press: this.client._event(`BUTTON_SAVE`) });
    }
    buttons.button({ text: `Continue`, press: this.client._event(`BUTTON_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  on_event_save() {
    if (!this.mv_object) {
      this.client.message_box_display(`Enter an object before saving the log`, `error`);
      return;
    }
    try {
      z2ui5_cl_util.bal_create({ object: this.mv_object, subobject: this.mv_subobject, id: this.mv_extnumber, t_log: this.mt_msg_bal });
      this.client.message_toast_display(`Business Application Log saved`);
    } catch (x) {
      this.client.message_box_display(x.get_text(), `error`);
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`BUTTON_SAVE`)) {
      this.on_event_save();
      return;
    }
    if (client.check_on_event(`BUTTON_CONTINUE`)) {
      client.popup_destroy();
      client.nav_app_leave();
    }
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_bal, {
  factory: { preferred: `i_messages`, params: [`i_messages`, `i_title`, `i_object`, `i_subobject`, `i_extnumber`, `i_check_save`] },
  factory_by_db: { preferred: `i_object`, params: [`i_object`, `i_subobject`, `i_extnumber`, `i_title`, `i_check_save`] },
});

module.exports = z2ui5_cl_pop_bal;
