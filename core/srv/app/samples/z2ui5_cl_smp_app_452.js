const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_452 extends z2ui5_if_app {
  t_msg = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    const description = `First Error message description. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ` + `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ` + `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ` + `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    this.t_msg = z2ui5_cl_util.abap_tab_assign(this.t_msg, [{ type: `Error`, title: `Account 801 requires an assignment`, subtitle: `Role is invalid`, description: description, group: `Purchase Order 450001` }, { type: `Warning`, title: `Account 821 requires a check`, subtitle: `Undefined task`, description: description, group: `Purchase Order 450001` }, { type: `Warning`, title: `Enter a text with maximum 6 characters length`, description: description, group: `Purchase Order 450002` }, { type: `Warning`, title: `Enter a text with maximum 8 characters length`, description: description, group: `Purchase Order 450002` }, { type: `Error`, title: `Account 802 requires an assignment`, subtitle: `Role is invalid`, description: description, group: `Purchase Order 450002` }, { type: `Information`, title: `Account 804 requires an assignment`, subtitle: `Information type subtitle`, description: description, group: `Purchase Order 450002` }, { type: `Error`, title: `Technical message without object relation`, description: description, group: `General` }, { type: `Warning`, title: `Global System will be down on Sunday`, description: description, group: `General` }, { type: `Error`, title: `Global System will be down on Sunday`, description: description, group: `General` }, { type: `Error`, title: `An Error`, subtitle: `Ungrouped message`, description: description }, { type: `Warning`, title: `A Warning`, subtitle: `Ungrouped message`, description: description }]);
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
      case `POPUP`:
        this.popup_display();
        break;
      case `POPOVER`:
        this.popover_display({ id: `messagePopoverBtn` });
        break;
      case `POPOVER_CLOSE`:
        this.client.popover_destroy();
        break;
    }
  }

  view_display() {
    let sy_tabix = 0;
    let error_count = 0;
    sy_tabix = 0;
    for (const row of this.t_msg) {
      sy_tabix++;
      if (!(row.type === `Error`)) continue;
      error_count = error_count + 1;
    }
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Message - MessageView and MessagePopover` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This free-style demo combines the sap.m message controls: one bound message table is rendered three ways - as a full-page MessageView with grouped items, ` + `inside a dialog and as a MessagePopover. It is not a 1:1 demo kit rebuild (those live in the samples-controls repository) ` + `and stays within the UI5 1.71 control set.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`MessageView`)
      .a({ n: `items`, v: this.client._bind(this.t_msg) })
      .a({ n: `groupItems`, b: true })
      .ele(`MessageItem`)
      .a({ n: `type`, v: `{TYPE}` })
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `subtitle`, v: `{SUBTITLE}` })
      .a({ n: `description`, v: `{DESCRIPTION}` })
      .a({ n: `groupName`, v: `{GROUP}` })
      .tag(`Link`)
      .a({ n: `text`, v: `Show more information` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `http://sap.com` });
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP`) })
      .a({ n: `text`, v: `${error_count}` })
      .a({ n: `icon`, v: `sap-icon://message-error` })
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPOVER`) })
      .a({ n: `text`, v: `Message Popover` })
      .a({ n: `id`, v: `messagePopoverBtn` });
    this.client.view_display(view.stringify());
  }

  popup_display() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const dialog = popup.ele(`Dialog`)
      .a({ n: `title`, v: `Publish order` })
      .a({ n: `contentWidth`, v: `50%` })
      .a({ n: `contentHeight`, v: `50%` })
      .a({ n: `verticalScrolling`, b: false })
      .a({ n: `afterClose`, v: this.client.follow_up_action(this.client.cs_event.popup_close) });
    dialog.ele(`MessageView`)
      .a({ n: `items`, v: this.client._bind(this.t_msg) })
      .a({ n: `groupItems`, b: true })
      .ele(`MessageItem`)
      .a({ n: `type`, v: `{TYPE}` })
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `subtitle`, v: `{SUBTITLE}` })
      .a({ n: `description`, v: `{DESCRIPTION}` })
      .a({ n: `groupName`, v: `{GROUP}` })
      .tag(`Link`)
      .a({ n: `text`, v: `Show more information` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `http://sap.com` });
    dialog.ele(`endButton`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client.follow_up_action(this.client.cs_event.popup_close) })
      .a({ n: `text`, v: `Close` });
    this.client.popup_display(popup.stringify());
  }

  popover_display({ id } = {}) {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    popup.ele(`MessagePopover`)
      .a({ n: `items`, v: this.client._bind(this.t_msg) })
      .a({ n: `placement`, v: `Top` })
      .a({ n: `beforeClose`, v: this.client._event(`POPOVER_CLOSE`) })
      .ele(`MessageItem`)
      .a({ n: `type`, v: `{TYPE}` })
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `subtitle`, v: `{SUBTITLE}` })
      .a({ n: `description`, v: `{DESCRIPTION}` })
      .a({ n: `groupName`, v: `{GROUP}` })
      .tag(`Link`)
      .a({ n: `text`, v: `Show more information` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `http://sap.com` });
    this.client.popover_display(popup.stringify(), id);
  }
}

module.exports = z2ui5_cl_smp_app_452;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

