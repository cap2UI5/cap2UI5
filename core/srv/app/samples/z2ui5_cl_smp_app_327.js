const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_327 extends z2ui5_if_app {
  s_storage = { type: ``, prefix: ``, key: ``, value: { field1: ``, field2: `` } };
  s_stored_value = { field1: ``, field2: `` };
  t_types = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.t_types = z2ui5_cl_util.abap_tab_assign(this.t_types, [{ type: `local` }, { type: `session` }]);
    this.s_storage = { type: `local`, prefix: `prefix1`, key: `key1`, value: { field1: `1`, field2: `textfld1` } };
    this.view_display();
  }

  on_event() {
    let lv_json;
    switch (this.client.get_event()) {
      case `LOCAL_STORAGE_LOADED`:
        lv_json = this.client.get_event_arg(4);
        this.s_storage.value = { field1: this.json_get_value({ json: lv_json, name: `FIELD1` }), field2: this.json_get_value({ json: lv_json, name: `FIELD2` }) };
        break;
      case `GET_STORED_VALUE`:
        this.s_storage.value = z2ui5_cl_util.abap_tab_assign(this.s_storage.value, z2ui5_cl_util.abap_copy(this.s_stored_value));
        break;
    }
  }

  json_get_value({ json, name } = {}) {
    let result = ``;
    const lv_marker = `"${name}":"`;
    const lv_off = this.find({ val: json, sub: lv_marker, case: false });
    if (lv_off < 0) {
      return result;
    }
    result = (($v, $s) => { const $i = $v.indexOf($s); return $i < 0 ? `` : $v.slice(0, $i); })(json.substr(lv_off + lv_marker.length), `"`);
    return result;
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Browser - Local and Session Storage` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Reads and writes the browser's local or session storage. The ` + `value is a whole ABAP structure, not just a string: the write ` + `side sends it with the STORE_DATA frontend action, the invisible ` + `z2ui5:Storage control reads it back and reports it as JSON.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Local/Session Storage` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Type` })
      .ele(`Select`)
      .a({ n: `forceSelection`, b: true })
      .a({ n: `selectedKey`, v: this.client._bind(this.s_storage.type, { name: `s_storage-type` }) })
      .a({ n: `items`, v: this.client._bind(this.t_types) })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `{TYPE}` })
      .a({ n: `text`, v: `{TYPE}` })
      .end()
      .tag(`Label`)
      .a({ n: `text`, v: `Prefix` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.s_storage.prefix, { name: `s_storage-prefix` }) })
      .tag(`Label`)
      .a({ n: `text`, v: `Key` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.s_storage.key, { name: `s_storage-key` }) })
      .tag(`Label`)
      .a({ n: `text`, v: `Value - Field 1` })
      .tag(`Input`)
      .a({ n: `type`, v: `Number` })
      .a({ n: `value`, v: this.client._bind(this.s_storage.value.field1, { name: `s_storage-value-field1` }) })
      .tag(`Label`)
      .a({ n: `text`, v: `Value - Field 2` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.s_storage.value.field2, { name: `s_storage-value-field2` }) })
      .tag(`Label`)
      .a({ n: `text`, v: `` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client.follow_up_action(z2ui5_if_client.cs_event.store_data, [`$${this.client._bind(this.s_storage)}`]) })
      .a({ n: `text`, v: `store` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`GET_STORED_VALUE`) })
      .a({ n: `text`, v: `get` });
    page.tag({ n: `Storage`, ns: `z2ui5` })
      .a({ n: `finished`, v: this.client._event(`LOCAL_STORAGE_LOADED`, [`\${$parameters>/type}`, `\${$parameters>/prefix}`, `\${$parameters>/key}`, `\${$parameters>/value}`]) })
      .a({ n: `type`, v: this.client._bind(this.s_storage.type, { name: `s_storage-type` }) })
      .a({ n: `prefix`, v: this.client._bind(this.s_storage.prefix, { name: `s_storage-prefix` }) })
      .a({ n: `key`, v: this.client._bind(this.s_storage.key, { name: `s_storage-key` }) })
      .a({ n: `value`, v: this.client._bind(this.s_stored_value) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_327;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

