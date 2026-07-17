const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_381 extends z2ui5_if_app {
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
    this.client = z2ui5_cl_util.abap_copy(client);
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
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Message Toast`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MessageToast/sample/sap.m.sample.MessageToast` });
    const form = page.panel({ headertext: `Message Toast Configuration` })
      .simple_form({ title: `Settings`, editable: true })
      .content(`form`);
    form.label(`Message`)
      .input(this.client._bind_edit(this.message))
      .label(`Duration (ms)`)
      .input({ value: this.client._bind_edit(this.duration), type: `Number` })
      .label(`Width`)
      .input(this.client._bind_edit(this.width));
    const select_my = form.label(`my`).select({ selectedkey: this.client._bind_edit(this.my) });
    const select_at = form.label(`at`).select({ selectedkey: this.client._bind_edit(this.at) });
    sy_tabix = 0;
    for (const position of this.get_positions()) {
      sy_tabix++;
      select_my.item({ key: position, text: position });
      select_at.item({ key: position, text: position });
    }
    form.label(`offset`);
    form.input(this.client._bind_edit(this.offset));
    const select_animation = form.label(`animationTimingFunction`)
      .select({ selectedkey: this.client._bind_edit(this.animation_timing) });
    select_animation.item({ key: `ease`, text: `ease` })
      .item({ key: `linear`, text: `linear` })
      .item({ key: `ease-in`, text: `ease-in` })
      .item({ key: `ease-out`, text: `ease-out` })
      .item({ key: `ease-in-out`, text: `ease-in-out` });
    form.label(`animationDuration (ms)`)
      .input({ value: this.client._bind_edit(this.animation_duration), type: `Number` })
      .label(`autoClose`)
      .checkbox(this.client._bind_edit(this.autoclose));
    form.button({ text: `Show Message Toast`, type: `Emphasized`, press: this.client._event(`SHOW`) });
    page.footer()
      .overflow_toolbar()
      .button({ text: `Back`, icon: `sap-icon://nav-back`, press: this.client._event_nav_app_leave() });
    this.client.view_display(page.stringify());
  }

  get_positions() {
    let result = [];
    result = [`begin top`, `begin center`, `begin bottom`, `left top`, `left center`, `left bottom`, `center top`, `center center`, `center bottom`, `right top`, `right center`, `right bottom`, `end top`, `end center`, `end bottom`];
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_381;
