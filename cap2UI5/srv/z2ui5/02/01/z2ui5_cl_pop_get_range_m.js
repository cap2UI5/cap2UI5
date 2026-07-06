const z2ui5_if_app          = require("../z2ui5_if_app");
const z2ui5_cl_xml_view     = require("../z2ui5_cl_xml_view");
const z2ui5_cl_util         = require("../../00/03/z2ui5_cl_util");
const z2ui5_cl_pop_get_range = require("./z2ui5_cl_pop_get_range");

/**
 * z2ui5_cl_pop_get_range_m — JS port of abap2UI5 z2ui5_cl_pop_get_range_m.
 *
 * Multi-field range editor. Shows one row per filter entry; each row opens
 * a `pop_get_range` popup for the field's individual ranges.
 *
 * Input/output shape:
 *   t_filter: [{ name, t_range: [...], t_token: [...] }]
 *
 * Usage:
 *   const pop = z2ui5_cl_pop_get_range_m.factory({ val: filters });
 *   client.nav_app_call(pop);
 */
class z2ui5_cl_pop_get_range_m extends z2ui5_if_app {

  client = null;
  mv_popup_name = ``;
  ms_result = { t_filter: [], check_confirmed: false };

  static factory({ val = [] } = {}) {
    const r_result = new z2ui5_cl_pop_get_range_m();
    r_result.ms_result.t_filter = (val || []).map((f) => ({
      name:    f.name || ``,
      t_range: (f.t_range || []).slice(),
      t_token: (f.t_token || []).slice(),
    }));
    return r_result;
  }

  result() { return this.ms_result; }

  popup_display() {
    const c = this.client;

    const popup = z2ui5_cl_xml_view.factory_popup()
      .Dialog({
        afterClose:    c._event(`BUTTON_CANCEL`),
        contentHeight: `50%`,
        contentWidth:  `50%`,
        title:         `Define Filter Conditions`,
      });

    const vbox = popup.VBox({ height: `100%`, justifyContent: `SpaceBetween` });

    const item = vbox.List({
      noDataText:      `No conditions defined`,
      items:           c._bind(this.ms_result.t_filter),
      selectionChange: c._event(`SELCHANGE`),
    }).CustomListItem();

    const grid = item.Grid({
      class: `sapUiSmallMarginTop sapUiSmallMarginBottom sapUiSmallMarginBegin`,
    });
    grid.Text({ text: `{NAME}` });

    grid.MultiInput({
      tokens:           `{T_TOKEN}`,
      enabled:          false,
      valueHelpRequest: c._event(`LIST_OPEN`, [`{NAME}`]),
    })
      .tokens()
        .Token({
          key:      `{KEY}`,
          text:     `{TEXT}`,
          visible:  `{VISIBLE}`,
          selected: `{SELKZ}`,
          editable: `{EDITABLE}`,
        });

    grid.Button({
      text:  `Select`,
      press: c._event(`LIST_OPEN`, [`{NAME}`]),
    });
    grid.Button({
      icon:  `sap-icon://delete`,
      type:  `Transparent`,
      text:  `Clear`,
      press: c._event(`LIST_DELETE`, [`{NAME}`]),
    });

    popup.get_parent()
      .buttons()
        .Button({
          text:  `Clear All`,
          icon:  `sap-icon://delete`,
          type:  `Transparent`,
          press: c._event(`POPUP_DELETE_ALL`),
        })
        .Button({
          text:  `Cancel`,
          press: c._event(`BUTTON_CANCEL`),
        })
        .Button({
          text:  `OK`,
          press: c._event(`BUTTON_CONFIRM`),
          type:  `Emphasized`,
        });

    c.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.popup_display();
      return;
    }

    if (client.check_on_navigated()) {
      // Coming back from a per-field pop_get_range — copy its result onto
      // the matching row of t_filter.
      const prev = client.get_app_prev();
      if (prev instanceof z2ui5_cl_pop_get_range) {
        const r = prev.result();
        if (r.check_confirmed) {
          const row = this.ms_result.t_filter.find((f) => f.name === this.mv_popup_name);
          if (row) {
            row.t_range = r.t_range;
            row.t_token = z2ui5_cl_util.filter_get_token_t_by_range_t(r.t_range);
          }
        }
      }
      this.popup_display();
    }

    switch (client.get().EVENT) {
      case `LIST_DELETE`: {
        const name = client.get_event_arg(1);
        const row = this.ms_result.t_filter.find((f) => f.name === name);
        if (row) { row.t_token = []; row.t_range = []; }
        client.popup_model_update();
        break;
      }
      case `LIST_OPEN`: {
        this.mv_popup_name = client.get_event_arg(1);
        const row = this.ms_result.t_filter.find((f) => f.name === this.mv_popup_name);
        client.nav_app_call(z2ui5_cl_pop_get_range.factory({ t_range: row?.t_range || [] }));
        break;
      }
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `POPUP_DELETE_ALL`:
        for (const row of this.ms_result.t_filter) {
          row.t_range = [];
          row.t_token = [];
        }
        client.popup_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_get_range_m;
