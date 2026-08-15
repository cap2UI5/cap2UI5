const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_325 extends z2ui5_if_app {
  input = ``;
  text = ``;

  async main(client) {
    let view;
    let page;
    let obj_page;
    let header_title;
    let sections;
    if (client.check_on_init()) {
      view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: `View`, ns: `mvc` })
        .a({ n: `displayBlock`, v: `true` })
        .a({ n: `height`, v: `100%` })
        .a({ n: `xmlns`, v: `sap.m` })
        .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
        .a({ n: `xmlns:core`, v: `sap.ui.core` })
        .a({ n: `xmlns:uxap`, v: `sap.uxap` });
      page = view.ele(`Shell`)
        .ele(`Page`)
        .a({ n: `title`, v: `abap2UI5 - Browser - Copy to Clipboard` })
        .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
        .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
      page.tag(`MessageStrip`)
        .a({ n: `text`, v: `Copy the input field or text-area content to the system clipboard via the clipboard_copy follow-up action.` })
        .a({ n: `type`, v: `Information` })
        .a({ n: `showIcon`, b: true })
        .a({ n: `class`, v: `sapUiSmallMargin` });
      obj_page = page.ele({ n: `ObjectPageLayout`, ns: `uxap` })
        .a({ n: `showTitleInHeaderContent`, b: true })
        .a({ n: `showEditHeaderButton`, b: true })
        .a({ n: `upperCaseAnchorBar`, b: false });
      header_title = obj_page.ele({ n: `headerTitle`, ns: `uxap` })
        .ele({ n: `ObjectPageDynamicHeaderTitle`, ns: `uxap` });
      header_title.ele({ n: `expandedHeading`, ns: `uxap` })
        .ele(`HBox`)
        .tag(`Title`)
        .a({ n: `text`, v: `Test` })
        .a({ n: `wrapping`, b: true });
      header_title.ele({ n: `snappedHeading`, ns: `uxap` })
        .ele(`FlexBox`)
        .a({ n: `alignItems`, v: `Center` })
        .tag(`Title`)
        .a({ n: `text`, v: `Test` })
        .a({ n: `wrapping`, b: true });
      sections = obj_page.ele({ n: `sections`, ns: `uxap` });
      sections.ele({ n: `ObjectPageSection`, ns: `uxap` })
        .a({ n: `titleUppercase`, b: false })
        .a({ n: `title`, v: `...` })
        .a({ n: `id`, v: `id_sec1` })
        .ele({ n: `subSections`, ns: `uxap` })
        .ele({ n: `ObjectPageSubSection`, ns: `uxap` })
        .a({ n: `id`, v: `id_input` })
        .a({ n: `title`, v: `Input field` })
        .ele({ n: `blocks`, ns: `uxap` })
        .ele(`VBox`)
        .tag(`Input`)
        .a({ n: `value`, v: client._bind(this.input) })
        .a({ n: `width`, v: `50%` })
        .tag(`Button`)
        .a({ n: `press`, v: client._event(`COPY_INPUT`) })
        .a({ n: `text`, v: `Copy input` })
        .a({ n: `type`, v: `Emphasized` });
      sections.ele({ n: `ObjectPageSection`, ns: `uxap` })
        .a({ n: `titleUppercase`, b: false })
        .a({ n: `title`, v: `...` })
        .a({ n: `id`, v: `id_sec2` })
        .ele({ n: `subSections`, ns: `uxap` })
        .ele({ n: `ObjectPageSubSection`, ns: `uxap` })
        .a({ n: `id`, v: `id_text_area` })
        .a({ n: `title`, v: `Text area` })
        .ele({ n: `blocks`, ns: `uxap` })
        .ele(`VBox`)
        .tag(`Button`)
        .a({ n: `press`, v: client._event(`COPY_TEXT_AREA`) })
        .a({ n: `text`, v: `Copy text area` })
        .a({ n: `type`, v: `Emphasized` })
        .tag(`TextArea`)
        .a({ n: `value`, v: client._bind(this.text) })
        .a({ n: `rows`, v: `15` })
        .a({ n: `width`, v: `100%` })
        .a({ n: `valueLiveUpdate`, b: true })
        .a({ n: `editable`, b: true })
        .a({ n: `id`, v: `text_id` })
        .a({ n: `growing`, b: true })
        .a({ n: `growingMaxLines`, v: `50` });
      client.view_display(view.stringify());
    }
    switch (client.get_event()) {
      case `COPY_INPUT`:
        client.follow_up_action(z2ui5_if_client.cs_event.clipboard_copy, [this.input]);
        client.message_toast_display(`input field copied: ${this.input}`);
        break;
      case `COPY_TEXT_AREA`:
        client.follow_up_action(z2ui5_if_client.cs_event.clipboard_copy, [this.text]);
        client.message_toast_display(`text area copied: ${this.text}`);
        break;
    }
  }
}

module.exports = z2ui5_cl_smp_app_325;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

