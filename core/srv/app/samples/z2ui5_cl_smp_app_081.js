const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_081 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  mv_placement = ``;
  mt_tab = [];
  client = null;

  popover_display({ id } = {}) {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    view.ele(`Popover`)
      .a({ n: `title`, v: `Popover Title` })
      .a({ n: `placement`, v: this.mv_placement })
      .ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_CANCEL`) })
      .a({ n: `text`, v: `Cancel` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_CONFIRM`) })
      .a({ n: `text`, v: `Confirm` })
      .a({ n: `type`, v: `Emphasized` })
      .end()
      .end()
      .tag(`Text`)
      .a({ n: `text`, v: `make an input here:` })
      .tag(`Input`)
      .a({ n: `value`, v: `abcd` });
    this.client.popover_display(view.stringify(), id);
  }

  popover_list_display({ id } = {}) {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    view.ele(`Popover`)
      .a({ n: `title`, v: `Popover Title` })
      .a({ n: `placement`, v: this.mv_placement })
      .ele(`List`)
      .a({ n: `items`, v: this.client._bind(this.mt_tab) })
      .a({ n: `mode`, v: `SingleSelectMaster` })
      .a({ n: `selectionChange`, v: this.client._event(`SEL_CHANGE`) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{ID}` })
      .a({ n: `description`, v: `{NAME}` })
      .a({ n: `selected`, v: `{SELECTED}` });
    this.client.popover_display(view.stringify(), id);
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Popover - Select from a List` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Opens a Popover anchored to a button, showing a selectable list inside it; the ` + `segmented button chooses on which side the popover appears.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Popover` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `Input` })
      .tag(`Label`)
      .a({ n: `text`, v: `Link` })
      .tag(`Link`)
      .a({ n: `text`, v: `Documentation UI5 Popover Control` })
      .a({ n: `href`, v: `https://openui5.hana.ondemand.com/entity/sap.m.Popover` })
      .tag(`Label`)
      .a({ n: `text`, v: `placement` })
      .ele(`SegmentedButton`)
      .a({ n: `selectedKey`, v: this.client._bind(this.mv_placement) })
      .ele(`items`)
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://add-favorite` })
      .a({ n: `key`, v: `Left` })
      .a({ n: `text`, v: `Left` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://accept` })
      .a({ n: `key`, v: `Top` })
      .a({ n: `text`, v: `Top` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://accept` })
      .a({ n: `key`, v: `Bottom` })
      .a({ n: `text`, v: `Bottom` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://attachment` })
      .a({ n: `key`, v: `Right` })
      .a({ n: `text`, v: `Right` })
      .end()
      .end()
      .tag(`Label`)
      .a({ n: `text`, v: `popover` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPOVER_LIST`) })
      .a({ n: `text`, v: `show popover with list` })
      .a({ n: `id`, v: `TEST` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lt_sel;
    switch (this.client.get_event()) {
      case `SEL_CHANGE`:
        lt_sel = z2ui5_cl_util.abap_copy(this.mt_tab);
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (z2ui5_cl_util.abap_is_initial(row.selected)) lt_sel.splice(_i, 1); }
        break;
      case `POPOVER_LIST`:
        this.popover_list_display({ id: `TEST` });
        break;
      case `POPOVER`:
        this.popover_display({ id: `TEST` });
        break;
      case `BUTTON_CONFIRM`:
        this.client.message_toast_display(`confirm`);
        this.client.popover_destroy();
        break;
      case `BUTTON_CANCEL`:
        this.client.message_toast_display(`cancel`);
        this.client.popover_destroy();
        break;
    }
  }

  on_init() {
    this.mv_placement = `Left`;
    this.product = `tomato`;
    this.quantity = `500`;
    this.mt_tab = z2ui5_cl_util.abap_tab_assign(this.mt_tab, [{ id: `1`, name: `name1` }, { id: `2`, name: `name2` }, { id: `3`, name: `name3` }, { id: `4`, name: `name4` }]);
  }
}

module.exports = z2ui5_cl_smp_app_081;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

