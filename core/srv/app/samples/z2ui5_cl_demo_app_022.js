const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_022 extends z2ui5_if_app {
  percent_animation = ``;
  display_animation = ``;
  percent_no_animation = ``;
  display_no_animation = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.percent_animation = `0`;
    this.display_animation = `0%`;
    this.percent_no_animation = `0`;
    this.display_no_animation = `0%`;
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `ANIMATION_0`:
        this.percent_animation = `0`;
        this.display_animation = `0%`;
        break;
      case `ANIMATION_100`:
        this.percent_animation = `100`;
        this.display_animation = `100%`;
        break;
      case `NO_ANIMATION_0`:
        this.percent_no_animation = `0`;
        this.display_no_animation = `0%`;
        break;
      case `NO_ANIMATION_100`:
        this.percent_no_animation = `100`;
        this.display_no_animation = `100%`;
        break;
    }
    this.client.view_model_update();
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Progress Indicator Example`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ProgressIndicator/sample/sap.m.sample.ProgressIndicator` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.text({ text: `Regular Mode`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `30`, displayvalue: `30%`, showvalue: true, state: `None` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `50`, showvalue: false, state: `Error` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `99`, displayvalue: `0.99GB of 1GB`, showvalue: true, state: `Success` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `25`, displayvalue: `25%`, showvalue: true, state: `Warning` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `40`, displayvalue: `40%`, showvalue: true, state: `Information` })
      .text({ text: `Information Popover Scenario`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `40`, displayvalue: `Reduce container width until this text is truncated, then press the ProgressIndicator`, showvalue: true, state: `Success` })
      .text({ text: `Invalid percent values`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `-20`, displayvalue: `-20`, showvalue: true, state: `None` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `120`, displayvalue: `120`, showvalue: true, state: `None` })
      .text({ text: `Display Only Mode`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `30`, displayvalue: `30%`, showvalue: true, state: `None`, displayonly: true })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `50`, showvalue: false, state: `Error`, displayonly: true })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `99`, displayvalue: `0.99GB of 1GB`, showvalue: true, state: `Success`, displayonly: true })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `25`, displayvalue: `25%`, showvalue: true, state: `Warning`, displayonly: true })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: `40`, displayvalue: `40%`, showvalue: true, state: `Information`, displayonly: true })
      .text({ text: `Set the ProgressIndicator to 100% with animation`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: this.client._bind(this.percent_animation), displayvalue: this.client._bind(this.display_animation), state: `Success`, displayonly: true })
      .flex_box()
      .button({ text: `Set to 0%`, class: `sapUiSmallMarginEnd`, press: this.client._event(`ANIMATION_0`) })
      .button({ text: `Set to 100%`, press: this.client._event(`ANIMATION_100`) });
    layout.text({ text: `Set the ProgressIndicator to 100% without animation`, class: `sapUiSmallMarginBottom` })
      .progress_indicator({ class: `sapUiSmallMarginBottom`, percentvalue: this.client._bind(this.percent_no_animation), displayvalue: this.client._bind(this.display_no_animation), state: `Success`, displayonly: true })
      .flex_box()
      .button({ text: `Set to 0%`, class: `sapUiSmallMarginEnd`, press: this.client._event(`NO_ANIMATION_0`) })
      .button({ text: `Set to 100%`, press: this.client._event(`NO_ANIMATION_100`) });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_022;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

