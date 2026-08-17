const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_363 extends z2ui5_if_app {
  field_01 = ``;
  field_02 = ``;
  field_03 = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let target = this.client.get_event();
    const behavior = `smooth`;
    let block = `start`;
    switch (target) {
      case `JUMP_BOTTOM`:
        target = `bottom_input`;
        break;
      case `JUMP_MIDDLE`:
        target = `middle_input`;
        block = `center`;
        break;
      case `JUMP_TOP`:
        target = `top_input`;
        break;
      case `VALIDATE`:
        if (z2ui5_cl_util.abap_is_initial(this.field_02)) {
          target = `middle_input`;
          block = `center`;
          this.client.message_toast_display(`Middle field is required`);
        } else {
          this.client.message_toast_display(`All fields ok`);
          return;
        }
        break;
      default:
        return;
        break;
    }
    this.client.follow_up_action(z2ui5_if_client.cs_event.scroll_into_view, [target, behavior, block]);
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
      .a({ n: `title`, v: `abap2UI5 - Scroll - Scroll a Control into View` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Use the toolbar to scroll to a control by id, or press Validate - if the middle field is empty it scrolls to it automatically.` })
      .a({ n: `type`, v: `Information` });
    const form = page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Long form` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`).a({ n: `text`, v: `Top field (id = top_input)` });
    form.tag(`Input`).a({ n: `id`, v: `top_input` }).a({ n: `value`, v: this.client._bind(this.field_01) });
    for (let sy_index = 1; sy_index <= 25; sy_index++) {
      form.tag(`Label`).a({ n: `text`, v: `spacer` });
      form.tag(`Text`).a({ n: `text`, v: ` spacer line ${sy_index}` });
    }
    form.tag(`Label`).a({ n: `text`, v: `Middle field - required (id = middle_input)` });
    form.tag(`Input`).a({ n: `id`, v: `middle_input` }).a({ n: `value`, v: this.client._bind(this.field_02) });
    for (let sy_index = 1; sy_index <= 25; sy_index++) {
      form.tag(`Label`).a({ n: `text`, v: `spacer` });
      form.tag(`Text`).a({ n: `text`, v: ` spacer line ${sy_index}` });
    }
    form.tag(`Label`).a({ n: `text`, v: `Bottom field (id = bottom_input)` });
    form.tag(`Input`).a({ n: `id`, v: `bottom_input` }).a({ n: `value`, v: this.client._bind(this.field_03) });
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`JUMP_TOP`) })
      .a({ n: `text`, v: `Jump to Top` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`JUMP_MIDDLE`) })
      .a({ n: `text`, v: `Jump to Middle` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`JUMP_BOTTOM`) })
      .a({ n: `text`, v: `Jump to Bottom` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`VALIDATE`) })
      .a({ n: `text`, v: `Validate` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_363;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

