const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_363 extends z2ui5_if_app {
  field_01 = ``;
  field_02 = ``;
  field_03 = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let target = this.client.get().EVENT;
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
        if (!this.field_02) {
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
    this.client.action.gen({ val: z2ui5_if_client.cs_event.scroll_into_view, t_arg: [target, behavior, block] });
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `scroll_into_view - jump to a control`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Use the toolbar to scroll to a control by id, or press Validate - if the middle field is empty it scrolls to it automatically.`, type: `Information` });
    const form = page.simple_form({ editable: true, title: `Long form` }).content(`form`);
    form.label(`Top field (id = top_input)`);
    form.input({ id: `top_input`, value: this.client._bind_edit(this.field_01) });
    for (let sy_index = 1; sy_index <= 25; sy_index++) {
      form.label(`spacer`);
      form.text(` spacer line ${sy_index}`);
    }
    form.label(`Middle field - required (id = middle_input)`);
    form.input({ id: `middle_input`, value: this.client._bind_edit(this.field_02) });
    for (let sy_index = 1; sy_index <= 25; sy_index++) {
      form.label(`spacer`);
      form.text(` spacer line ${sy_index}`);
    }
    form.label(`Bottom field (id = bottom_input)`);
    form.input({ id: `bottom_input`, value: this.client._bind_edit(this.field_03) });
    page.footer()
      .overflow_toolbar()
      .button({ text: `Jump to Top`, press: this.client._event(`JUMP_TOP`) })
      .button({ text: `Jump to Middle`, press: this.client._event(`JUMP_MIDDLE`) })
      .button({ text: `Jump to Bottom`, press: this.client._event(`JUMP_BOTTOM`) })
      .button({ text: `Validate`, press: this.client._event(`VALIDATE`), type: `Emphasized` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_363;
