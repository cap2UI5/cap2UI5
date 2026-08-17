const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_160 extends z2ui5_if_app {
  mt_output = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.model_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  model_init() {
    this.mt_output = {};
    for (let sy_index = 1; sy_index <= 10; sy_index++) {
      this.mt_output.push(z2ui5_cl_util.abap_copy({ index: sy_index, set_sk: `Test`, matnr: `1234567`, description: `Test`, pl_01: 0, pl_02: 0, is_total: 0, pl_total: 0, per_cent_total: 0, is_01_prev: 0, per_cent_01: 0, is_02_prev: 0, per_cent_02: 0, is_03_prev: 0, pl_03: 0, per_cent_03: 0, is_q01_prev: 0, pl_q01: 0, per_cent_q01: 0, is_q02_prev: 0, pl_q02: 0, per_cent_q02: 0, is_q03_prev: 0, pl_q03: 0, per_cent_q03: 0, is_q04_prev: 0, pl_q04: 0, per_cent_q04: 0 }));
    }
  }

  on_event() {
    if (this.client.check_on_event(`PL_TOTAL_CHANGE`)) {
      this.client.message_box_display(`Id of Input via source object: ` + this.client.get_event_arg() + z2ui5_cl_smp_context.cv_char_util_newline + `Id of Input via event.oSource.sId: ` + this.client.get_event_arg(2) + z2ui5_cl_smp_context.cv_char_util_newline + `Value of same row, index: ` + this.client.get_event_arg(3) + z2ui5_cl_smp_context.cv_char_util_newline + `Id of parent (row) via event.oSource.oParent.sId: ` + this.client.get_event_arg(4) + z2ui5_cl_smp_context.cv_char_util_newline + `Attribute of parameters.value: ` + this.client.get_event_arg(5));
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Grid Table - Events on Cell Level` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .ele(`headerContent`)
      .tag(`Link`)
      .end();
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Pressing ENTER in a sap.ui.table cell input fires a backend event that carries the cell id, ` + `its row index and the parent row id as event arguments, shown here in a message box.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`Text`).a({ n: `text`, v: `Make an input and press ENTER` });
    const table = page.ele(`FlexBox`)
      .a({ n: `height`, v: `85vh` })
      .ele({ n: `Table`, ns: `table` })
      .a({ n: `rows`, v: this.client._bind(this.mt_output) })
      .a({ n: `alternateRowColors`, v: `true` })
      .a({ n: `selectionMode`, v: `None` });
    const columns = table.ele({ n: `columns`, ns: `table` });
    columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `5.2rem` })
      .a({ n: `sortProperty`, v: `SET_SK` })
      .a({ n: `filterProperty`, v: `SET_SK` })
      .tag(`Text`)
      .a({ n: `text`, v: `Column 1` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{SET_SK}` });
    columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `5rem` })
      .a({ n: `sortProperty`, v: `MATNR` })
      .a({ n: `filterProperty`, v: `MATNR` })
      .tag(`Text`)
      .a({ n: `text`, v: `Column 2` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{MATNR}` });
    columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `5rem` })
      .a({ n: `sortProperty`, v: `PL_TOTAL` })
      .a({ n: `filterProperty`, v: `PL_TOTAL` })
      .tag(`Text`)
      .a({ n: `text`, v: `Column 5` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Input`)
      .a({ n: `type`, v: `Number` })
      .a({ n: `editable`, b: true })
      .a({ n: `value`, v: `{PL_TOTAL}` })
      .a({ n: `submit`, v: this.client._event(`PL_TOTAL_CHANGE`, [`\${$source>/id}`, `$event.oSource.sId`, `\${INDEX}`, `$event.oSource.oParent.sId`, `\${$parameters>/value}`]) });
    columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `4rem` })
      .a({ n: `sortProperty`, v: `per_cent_total` })
      .a({ n: `filterProperty`, v: `per_cent_total` })
      .tag(`Text`)
      .a({ n: `text`, v: `Column 6` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{PL_TOTAL} %` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_160;

const z2ui5_cl_smp_context = require("./z2ui5_cl_smp_context");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

