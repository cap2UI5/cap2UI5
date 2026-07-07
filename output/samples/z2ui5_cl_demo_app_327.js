const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_327 extends z2ui5_if_app {
  storage = {};
  stored_value = ``;
  storage_types = [];

  async main(client) {
    let view;
    if (client.check_on_init()) {
      this.storage_types = [{ type: `local` }, { type: `session` }];
      this.storage = { type: `local`, prefix: `prefix1`, key: `key1` };
      view = z2ui5_cl_xml_view.factory();
      view.shell()
        .page({ title: `abap2UI5 - Storage`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .simple_form({ title: `Local/Session Storage`, editable: true })
        .content(`form`)
        .label(`Type`)
        .select({ forceselection: true, selectedkey: client._bind_edit(this.storage.type, { name: `storage-type` }), items: client._bind(this.storage_types) })
        .item({ key: `{TYPE}`, text: `{TYPE}` })
        .get_parent()
        .label(`Prefix`)
        .input(client._bind_edit(this.storage.prefix, { name: `storage-prefix` }))
        .label(`Key`)
        .input(client._bind_edit(this.storage.key, { name: `storage-key` }))
        .label(`Value`)
        .input(client._bind_edit(this.storage.value, { name: `storage-value` }))
        .button({ text: `store`, press: client._event_client(z2ui5_if_client.cs_event.store_data, [`$${client._bind_edit(this.storage)}`]) })
        .button({ text: `get`, press: client._event(`GET_STORED_VALUE`) })
        .get_parent()
        .get_parent()
        ._z2ui5()
        .storage({ finished: client._event(`LOCAL_STORAGE_LOADED`, [`\${$parameters>/type}`, `\${$parameters>/prefix}`, `\${$parameters>/key}`, `\${$parameters>/value}`]), type: client._bind_edit(this.storage.type, { name: `storage-type` }), prefix: client._bind_edit(this.storage.prefix, { name: `storage-prefix` }), key: client._bind_edit(this.storage.key, { name: `storage-key` }), value: client._bind_edit(this.stored_value) });
      client.view_display(view.stringify());
    }
    switch (client.get().EVENT) {
      case `LOCAL_STORAGE_LOADED`:
        this.storage.value = client.get_event_arg(4);
        client.view_model_update();
        break;
      case `GET_STORED_VALUE`:
        this.storage.value = z2ui5_cl_util.abap_copy(this.stored_value);
        client.view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_327;
