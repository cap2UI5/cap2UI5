const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_099 extends z2ui5_if_app {
  t_tab = [];
  t_tab_sort = [];
  t_tab_group = [];
  t_tab_filter = [];
  mv_sorter_group = ``;
  mv_filter = ``;
  mv_sort_descending = false;
  mv_group_descending = false;
  mv_group_desc_str = `false`;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let sy_tabix = 0;
    switch (this.client.get().EVENT) {
      case `ALL`:
        this.view_display_settings_popup();
        break;
      case `SORT`:
        this.view_display_sort_popup();
        break;
      case `FILTER`:
        this.view_display_filter_popup();
        break;
      case `GROUP`:
        this.view_display_group_popup();
        break;
      case `CONFIRM_SORT`:
        let lt_arg = this.client.get().T_EVENT_ARG;
        if (lt_arg) {
          const sort_field = lt_arg[(1) - 1];
          if (this.mv_sort_descending === true) {
            { const _f = String(sort_field)
              .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0) * -1); }
          } else {
            { const _f = String(sort_field)
              .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)); }
          }
          this.client.view_model_update();
        }
        break;
      case `CONFIRM_FILTER`:
        this.mv_filter = {};
        lt_arg = this.client.get().T_EVENT_ARG;
        if (lt_arg) {
          const filter_string = lt_arg[(1) - 1];
          let lv_dummy;
          [lv_dummy, filter_string] = filter_string.split(`:`);
          // TODO(abap2js): CONDENSE filter_string NO-GAPS.
          let [lv_field, lv_values] = filter_string.split(`(`);
          // TODO(abap2js): TRANSLATE lv_field TO UPPER CASE.
          const lv_values_len = lv_values.length - 1;
          lv_values = String(lv_values).substr(0, lv_values_len);
          let lt_values = lv_values.split(`,`);
          if (sy_subrc === 0) {
            sy_tabix = 0;
            for (const lv_val of lt_values) {
              sy_tabix++;
              this.mv_filter = this.mv_filter + `{path:'` + lv_field + `',operator: 'EQ',value1:'` + lv_val + `'},`;
            }
          }
          const mv_filter_len = this.mv_filter.length - 1;
          this.mv_filter = String(this.mv_filter).substr(0, mv_filter_len);
          this.view_display();
        }
        break;
      case `CONFIRM_GROUP`:
        lt_arg = this.client.get().T_EVENT_ARG;
        if (lt_arg) {
          const group_field = lt_arg[(1) - 1];
          if (group_field) {
            if (this.mv_group_descending === true) {
              { const _f = String(group_field)
                .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0) * -1); }
            } else {
              { const _f = String(group_field)
                .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)); }
            }
            this.mv_sorter_group = group_field;
            // TODO(abap2js): TRANSLATE mv_sorter_group TO UPPER CASE.
          } else {
            if (this.mv_group_descending === true) {
              { const _f = String(group_field)
                .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0) * -1); }
            } else {
              { const _f = String(group_field)
                .toLowerCase(); this.t_tab.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)); }
            }
            this.mv_sorter_group = {};
          }
          this.view_display();
        }
        break;
      case `RESET_GROUP`:
        break;
    }
  }

  set_data() {
    this.t_tab = [{ title: `row_01`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_02`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_03`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_04`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_05`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_06`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }];
    this.t_tab_group = [{ text: `Title`, key: `title` }, { text: `Info`, key: `info` }, { text: `Description`, key: `descr` }];
    this.t_tab_sort = [{ text: `Title`, key: `title` }, { text: `Info`, key: `info` }, { text: `Description`, key: `descr` }];
    this.t_tab_filter = [{ text: `Title`, key: `Title` }, { text: `Descr`, key: `Descr` }, { text: `Info`, key: `Info` }];
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - List`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true })
      .header_content()
      .link()
      .get_parent();
    page.table({ headertext: `Table Output`, items: `{path:'` + this.client._bind_edit({ val: this.t_tab, path: true }) + `',sorter:{path:'` + this.mv_sorter_group + `',group:` + `true` + `}` + `,filters:[` + this.mv_filter + `] }` })
      .header_toolbar()
      .overflow_toolbar()
      .title({ text: `Table`, level: `H2` })
      .toolbar_spacer()
      .button({ icon: `sap-icon://sort`, tooltip: `Sort`, press: this.client._event(`SORT`) })
      .button({ icon: `sap-icon://filter`, tooltip: `Filter`, press: this.client._event(`FILTER`) })
      .button({ icon: `sap-icon://group-2`, tooltip: `Group`, press: this.client._event(`GROUP`) })
      .button({ icon: `sap-icon://action-settings`, tooltip: `Settings`, press: this.client._event(`ALL`) })
      .get_parent()
      .get_parent()
      .columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Info`)
      .get_parent()
      .column()
      .text(`Descr`)
      .get_parent()
      .column()
      .text(`Icon`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ valign: `Middle` })
      .cells()
      .text(`{TITLE}`)
      .text(`{INFO}`)
      .text(`{DESCR}`)
      .avatar({ src: `{ICON}` });
    this.client.view_display(view.stringify());
  }

  view_display_filter_popup() {
    const popup_filter = z2ui5_cl_xml_view.factory_popup();
    const filter_view = popup_filter.view_settings_dialog({ filteritems: this.client._bind_edit(this.t_tab_filter), confirm: this.client._event(`CONFIRM_FILTER`, [`\${$parameters>/filterString}`]) })
      .filter_items()
      .view_settings_filter_item({ multiselect: true, text: `{TEXT}`, key: `{KEY}` })
      .items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}` })
      .get_parent();
    this.client.popup_display(filter_view.stringify());
  }

  view_display_group_popup() {
    const popup_group = z2ui5_cl_xml_view.factory_popup();
    const group_view = popup_group.view_settings_dialog({ confirm: this.client._event(`CONFIRM_GROUP`, [`\${$parameters>/groupItem/mProperties/key}`]), reset: this.client._event(`RESET_GROUP`), groupdescending: this.client._bind_edit(this.mv_group_descending), groupitems: this.client._bind_edit(this.t_tab_group) })
      .group_items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}`, selected: `{SELECTED}` });
    this.client.popup_display(group_view.stringify());
  }

  view_display_settings_popup() {
    let popup_settings = z2ui5_cl_xml_view.factory_popup();
    popup_settings = popup_settings.view_settings_dialog({ confirm: this.client._event(`ALL_EVENT`), sortitems: this.client._bind_edit(this.t_tab_sort), groupitems: this.client._bind_edit(this.t_tab_group), filteritems: this.client._bind_edit(this.t_tab_filter) })
      .sort_items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}`, selected: `{SELECTED}` })
      .get_parent()
      .get_parent()
      .group_items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}`, selected: `{SELECTED}` })
      .get_parent()
      .get_parent()
      .filter_items()
      .view_settings_filter_item({ text: `{TEXT}`, key: `{KEY}`, multiselect: true })
      .items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}` });
    this.client.popup_display(popup_settings.stringify());
  }

  view_display_sort_popup() {
    const popup_sort = z2ui5_cl_xml_view.factory_popup();
    const sort_view = popup_sort.view_settings_dialog({ confirm: this.client._event(`CONFIRM_SORT`, [`\${$parameters>/sortItem/mProperties/key}`]), sortitems: this.client._bind_edit(this.t_tab_sort), sortdescending: this.client._bind_edit(this.mv_sort_descending) })
      .sort_items()
      .view_settings_item({ text: `{TEXT}`, key: `{KEY}`, selected: `{SELECTED}` });
    this.client.popup_display(sort_view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_099;
