const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_messages extends z2ui5_if_app {
  mt_msg = [];
  client = null;
  title = ``;

  static factory({ i_messages, i_title = `abap2UI5 - Message Popup` } = {}) {
    let r_result = null;
    let sy_tabix = 0;
    r_result = new z2ui5_cl_pop_messages();
    sy_tabix = 0;
    for (const lr_row of z2ui5_cl_util.msg_get_t(i_messages)) {
      sy_tabix++;
      r_result.mt_msg.push({ type: z2ui5_cl_util.ui5_get_msg_type(lr_row.type), title: lr_row.text, subtitle: `${lr_row.id} ${lr_row.no}` });
    }
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    return r_result;
  }

  view_display() {
    let popup = z2ui5_cl_xml_view.factory_popup();
    popup = popup.dialog({ title: this.title, contentheight: `50%`, contentwidth: `50%`, verticalscrolling: false, afterclose: this.client._event(`BUTTON_CONTINUE`) });
    popup.message_view({ items: this.client._bind(this.mt_msg) })
      .message_item({ type: `{TYPE}`, title: `{TITLE}`, subtitle: `{SUBTITLE}` });
    popup.buttons().button({ text: `Continue`, press: this.client._event(`BUTTON_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`BUTTON_CONTINUE`)) {
      client.popup_destroy();
      client.nav_app_leave();
    }
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_messages, {
  factory: { preferred: `i_messages`, params: [`i_messages`, `i_title`] },
});

module.exports = z2ui5_cl_pop_messages;
