const z2ui5_if_app      = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");
const z2ui5_cl_util     = require("../../00/03/z2ui5_cl_util");

/**
 * z2ui5_cl_pop_get_range — JS port of abap2UI5 z2ui5_cl_pop_get_range.
 *
 * Single-field range/filter editor. Shows a list of {option, low, high}
 * triples; OK confirms and produces a `t_range` (sign/option/low/high) array
 * compatible with z2ui5_cl_util_range.
 *
 * Usage:
 *   const pop = z2ui5_cl_pop_get_range.factory({ t_range: existing });
 *   client.nav_app_call(pop);
 *   // ...later, after on_navigated:
 *   const r = pop.result();
 *   if (r.check_confirmed) { ...r.t_range... }
 */
class z2ui5_cl_pop_get_range extends z2ui5_if_app {

  client = null;

  // mt_filter holds the in-popup editable shape: [{ option, low, high, key }]
  mt_filter = [];

  // Result has the abap-shaped range list: [{ sign, option, low, high }]
  ms_result = { t_range: [], check_confirmed: false };

  // Mapping: [{ key: "EQ", text: "EQ" }, …] feeds the OPTION ComboBox
  mt_mapping = [];

  static factory({ t_range = [] } = {}) {
    const r_result = new z2ui5_cl_pop_get_range();
    r_result.ms_result.t_range = (t_range || []).map((r) => ({
      sign:   r.sign   || `I`,
      option: r.option || `EQ`,
      low:    r.low    ?? ``,
      high:   r.high   ?? ``,
    }));
    // ABAP appends an empty trailing slot so the user can always add a new row.
    r_result.ms_result.t_range.push({ sign: `I`, option: `EQ`, low: ``, high: `` });
    return r_result;
  }

  result() { return this.ms_result; }

  view_display() {
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
      items:           c._bind_edit(this.mt_filter),
      selectionChange: c._event(`SELCHANGE`),
    }).CustomListItem();

    const grid = item.Grid();

    grid.ComboBox({
      selectedKey: `{OPTION}`,
      items:       c._bind(this.mt_mapping),
    })
      .ListItem({ key: `{N}`, text: `{N}` })
      .get_parent()
      .Input({
        value:  `{LOW}`,
        submit: c._event(`BUTTON_CONFIRM`),
      })
      .Input({
        value:   `{HIGH}`,
        visible: `{= \${OPTION} === 'BT' }`,
        submit:  c._event(`BUTTON_CONFIRM`),
      })
      .Button({
        icon:  `sap-icon://decline`,
        type:  `Transparent`,
        press: c._event(`POPUP_DELETE`, [`{KEY}`]),
      });

    popup.get_parent()
      .buttons()
        .Button({
          text:  `Delete All`,
          icon:  `sap-icon://delete`,
          type:  `Transparent`,
          press: c._event(`POPUP_DELETE_ALL`),
        })
        .Button({
          text:  `Add Item`,
          icon:  `sap-icon://add`,
          press: c._event(`POPUP_ADD`),
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
      // Build the in-popup editable list: one row per existing range entry.
      this.mt_mapping = z2ui5_cl_util.filter_get_token_range_mapping().map(
        (m) => ({ N: m.range, V: m.range })
      );
      this.mt_filter = this.ms_result.t_range.map((r) => ({
        option: r.option,
        low:    r.low,
        high:   r.high,
        key:    z2ui5_cl_util.uuid_get_c32(),
      }));
      this.view_display();
      return;
    }

    switch (client.get().EVENT) {
      case `BUTTON_CONFIRM`: {
        // Convert the editable list back into the abap-shaped t_range result.
        this.ms_result.t_range = [];
        for (const r of this.mt_filter) {
          if ((r.low === `` || r.low == null) && (r.high === `` || r.high == null)) continue;
          this.ms_result.t_range.push({
            sign:   `I`,
            option: r.option || `EQ`,
            low:    r.low,
            high:   r.high,
          });
        }
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      }
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `POPUP_ADD`:
        this.mt_filter.push({
          option: `EQ`, low: ``, high: ``, key: z2ui5_cl_util.uuid_get_c32(),
        });
        client.popup_model_update();
        break;
      case `POPUP_DELETE`: {
        const key = client.get_event_arg(1);
        this.mt_filter = this.mt_filter.filter((r) => r.key !== key);
        client.popup_model_update();
        break;
      }
      case `POPUP_DELETE_ALL`:
        this.mt_filter = [];
        client.popup_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_get_range;
