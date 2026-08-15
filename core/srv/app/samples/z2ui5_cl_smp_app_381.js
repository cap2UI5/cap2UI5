const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_381 extends z2ui5_if_app {
  client = null;
  message = ``;
  duration = ``;
  width = ``;
  my = ``;
  at = ``;
  offset = ``;
  animation_timing = ``;
  animation_duration = ``;
  autoclose = false;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_event(`SHOW`)) {
      this.show_toast();
    }
  }

  on_init() {
    this.message = `This is a message toast.`;
    this.duration = `3000`;
    this.width = `15em`;
    this.my = `center bottom`;
    this.at = `center bottom`;
    this.offset = `0 0`;
    this.animation_timing = `ease`;
    this.animation_duration = `1000`;
    this.autoclose = true;
  }

  show_toast() {
    this.client.message_toast_display({ text: this.message, duration: this.duration, width: this.width, my: this.my, at: this.at, offset: this.offset, animationtimingfunction: this.animation_timing, animationduration: this.animation_duration, autoclose: this.autoclose });
  }

  view_display() {
    let sy_tabix = 0;
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Message - MessageToast, Text and Duration` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample demonstrates MessageToast: configure the text, duration, position ` + `and animation, then show a short, non-blocking toast notification.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`headerContent`)
      .tag(`Link`)
      .a({ n: `text`, v: `UI5 Demo Kit` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageToast/sample/sap.m.sample.MessageToast` });
    const form = page.ele(`Panel`)
      .a({ n: `headerText`, v: `Message Toast Configuration` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Settings` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Message` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.message) })
      .tag(`Label`)
      .a({ n: `text`, v: `Duration (ms)` })
      .tag(`Input`)
      .a({ n: `type`, v: `Number` })
      .a({ n: `value`, v: this.client._bind(this.duration) })
      .tag(`Label`)
      .a({ n: `text`, v: `Width` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.width) });
    const select_my = form.tag(`Label`)
      .a({ n: `text`, v: `my` })
      .ele(`Select`)
      .a({ n: `selectedKey`, v: this.client._bind(this.my) });
    const select_at = form.tag(`Label`)
      .a({ n: `text`, v: `at` })
      .ele(`Select`)
      .a({ n: `selectedKey`, v: this.client._bind(this.at) });
    sy_tabix = 0;
    for (const position of this.get_positions()) {
      sy_tabix++;
      select_my.tag({ n: `Item`, ns: `core` }).a({ n: `key`, v: position }).a({ n: `text`, v: position });
      select_at.tag({ n: `Item`, ns: `core` }).a({ n: `key`, v: position }).a({ n: `text`, v: position });
    }
    form.tag(`Label`).a({ n: `text`, v: `offset` });
    form.tag(`Input`).a({ n: `value`, v: this.client._bind(this.offset) });
    const select_animation = form.tag(`Label`)
      .a({ n: `text`, v: `animationTimingFunction` })
      .ele(`Select`)
      .a({ n: `selectedKey`, v: this.client._bind(this.animation_timing) });
    select_animation.tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `ease` })
      .a({ n: `text`, v: `ease` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `linear` })
      .a({ n: `text`, v: `linear` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `ease-in` })
      .a({ n: `text`, v: `ease-in` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `ease-out` })
      .a({ n: `text`, v: `ease-out` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `ease-in-out` })
      .a({ n: `text`, v: `ease-in-out` });
    form.tag(`Label`)
      .a({ n: `text`, v: `animationDuration (ms)` })
      .tag(`Input`)
      .a({ n: `type`, v: `Number` })
      .a({ n: `value`, v: this.client._bind(this.animation_duration) })
      .tag(`Label`)
      .a({ n: `text`, v: `autoClose` })
      .tag(`CheckBox`)
      .a({ n: `selected`, v: this.client._bind(this.autoclose) });
    form.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SHOW`) })
      .a({ n: `text`, v: `Show Message Toast` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.view_display(page.stringify());
  }

  get_positions() {
    let result = [];
    result = z2ui5_cl_util.abap_tab_assign(result, [`begin top`, `begin center`, `begin bottom`, `left top`, `left center`, `left bottom`, `center top`, `center center`, `center bottom`, `right top`, `right center`, `right bottom`, `end top`, `end center`, `end bottom`]);
    return result;
  }
}

module.exports = z2ui5_cl_smp_app_381;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

