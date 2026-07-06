// TODO(abap2js): unresolved reference z2ui5_cl_ajson — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_319 extends z2ui5_if_app {
  product_type = { tokens_added: null, tokens_removed: null, ranges: null };
  m_client = null;

  async main(client) {
    this.m_client = client;
    if (this.m_client.check_on_init()) {
      this.on_init();
      return;
    }
    this.on_event();
  }

  on_init() {
    const l_view = z2ui5_cl_xml_view.factory();
    const l_page = l_view.shell()
      .page({ title: `SearchPage`, navbuttonpress: this.m_client._event_nav_app_leave(), shownavbutton: this.m_client.check_app_prev_stack() });
    l_page._z2ui5()
      .smartmultiinput_ext({ addedtokens: this.m_client._bind_edit({ val: m_selection.product_type.tokens_added, switch_default_model: true }), removedtokens: this.m_client._bind_edit({ val: m_selection.product_type.tokens_removed, switch_default_model: true }), rangedata: this.m_client._bind_edit({ val: m_selection.product_type.ranges, switch_default_model: true }), change: this.m_client._event(`PRODTYPE_CHANGED`), multiinputid: `ProductTypeMultiInput` });
    l_page.smart_multi_input({ id: `ProductTypeMultiInput`, value: `{CurrencyCode}`, entityset: `Booking`, supportranges: `true`, enableodataselect: `true` });
    this.m_client.view_display({ val: l_page.stringify(), switch_default_model_path: `/sap/opu/odata/DMO/UI_TRAVEL_A_D_O2`, switch_default_model_anno_uri: `/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName='%2FDMO%2FUI_TRAVEL_A_D_O2_VAN',Version='0001')/$value` });
  }

  on_event() {
    if (this.m_client.check_on_event(`PRODTYPE_CHANGED`)) {
      m_selection.product_type.ranges.push({ operation: `EQ`, value1: `EUR`, keyfield: `CurrencyCode`, tokentext: `Euro (auto added line)` });
      this.m_client.view_model_update();
      try {
        this.m_client.message_box_display({ text: z2ui5_cl_ajson.new().set({ iv_path: `/`, iv_val: m_selection.product_type.ranges }).stringify(), title: `range content` });
      } catch (lx_ajson) {
        this.m_client.message_toast_display(lx_ajson.get_text());
      }
    }
  }
}

module.exports = z2ui5_cl_demo_app_319;
