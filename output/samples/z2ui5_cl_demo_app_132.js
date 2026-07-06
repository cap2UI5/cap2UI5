// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_132 extends z2ui5_if_app {
  mv_view_display = false;
  mo_parent_view = null;
  mv_perc = ``;
  client = null;

  get_comp() {
    let result = [];
    let index = 0;
    try {
      try {
        cl_abap_typedescr.describe_by_name(/* TODO(abap2js): out-params */ EXPORTING p_name = `Z2UI5_T_01` RECEIVING p_descr_ref = DATA ( typedesc ) EXCEPTIONS type_not_found = 1 OTHERS = 2);
        const structdesc = (typedesc);
        const comp = structdesc.get_components();
        let sy_tabix = 0;
        for (const com of comp) {
          sy_tabix++;
          if (com.as_include === false) {
            result.push(com);
          }
        }
      } catch (error) {
      }
      const component = value cl_abap_structdescr.component_table((name === `ROW_ID` type === (cl_abap_datadescr.describe_by_data(index))));
      result.push(...component);
    } catch (error) {
    }
    return result;
  }

  view_display() {
    if (!this.mo_parent_view) {
      let page = z2ui5_cl_xml_view.factory();
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    page.label(`ProgressIndicator`)
      .progress_indicator({ percentvalue: this.mv_perc, displayvalue: `0,44GB of 32GB used`, showvalue: true, state: `Success` });
    if (!this.mo_parent_view) {
      this.client.view_display(page.stringify());
    } else {
      this.mv_view_display = true;
    }
  }

  set_app_data({ count } = {}) {
    this.mv_perc = count;
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_132;
