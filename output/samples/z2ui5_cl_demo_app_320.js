const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_320 extends z2ui5_if_app {
  viewportpercentwidth = 100;
  item = {};
  items = null;
  group_items = null;
  content_height = ``;
  content_width = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.items = [{ mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `1`, initials: `JD`, name: `John Doe`, tooltip: `1`, jobposition: `Marketing Manager` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `2`, initials: `SP`, name: `Sarah Parker`, tooltip: `2`, jobposition: `Visual Designer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `3`, initials: `JG`, name: `Jason Goldwell`, tooltip: `3`, jobposition: `Software Developer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `4`, name: `Christian Bow`, jobposition: `Marketing Manager`, tooltip: `4` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `5`, src: `https://sapui5.hana.ondemand.com/test-resources/sap/f/images/Woman_avatar_01.png`, tooltip: `5`, name: `Jessica Parker`, jobposition: `Visual Designer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `6`, initials: `JB`, name: `Jonathan Bale`, jobposition: `Software Developer`, tooltip: `6` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `7`, initials: `GS`, name: `Gordon Smith`, jobposition: `Marketing Manager`, tooltip: `7` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `8`, fallbackicon: `sap-icon =//person-placeholder`, name: `Simon Jason`, tooltip: `8`, jobposition: `Visual Designer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `9`, initials: `JS`, name: `Jason Swan`, jobposition: `Software Developer`, tooltip: `9` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `10`, initials: `JC`, name: `John Carter`, jobposition: `Marketing Manager`, tooltip: `10` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `11`, src: `https://sapui5.hana.ondemand.com/test-resources/sap/f/images/Woman_avatar_02.png`, name: `Whitney Parker`, tooltip: `11`, jobposition: `Visual Designer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `12`, fallbackicon: `sap-icon =//person-placeholder`, name: `Jason Goldwell`, tooltip: `12`, jobposition: `Software Developer` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `13`, initials: `CD`, name: `Chris Doe`, jobposition: `Marketing Manager`, tooltip: `13` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `14`, initials: `SS`, name: `Sarah Smith`, jobposition: `Visual Designer`, tooltip: `14` }, { mobile: `+89181818181`, phone: `+2828282828`, email: `blabla@blabla`, id: `15`, initials: `DC`, name: `David Copper`, jobposition: `Software Developer`, tooltip: `15` }];
      this.display_avatar_group_view();
    }
    this.on_event();
  }

  display_avatar_group_view() {
    const view = z2ui5_cl_xml_view.factory();
    view.page({ title: `abap2UI5 - Sample: Avatar Group`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .slider({ value: this.client._bind_edit(this.viewportpercentwidth) })
      .vertical_layout({ id: `vl1`, width: `${this.client._bind_edit(this.viewportpercentwidth)}%`, class: `sapUiContentPadding` })
      .label({ text: `AvatarGroup control in Individual mode`, class: `sapUiSmallMarginBottom sapUiMediumMarginTop` })
      .avatar_group({ id: `avatarGroup1`, grouptype: `Individual`, avatardisplaysize: `S`, press: this.client._event(`onIndividualPress`, [`\${$source>/id}`, `\${$parameters>/groupType}`, `\${$parameters>/overflowButtonPressed}`, `\${$parameters>/avatarsDisplayed}`, `$event.getParameter("eventSource").getId()`, `$event.oSource.indexOfItem($event.getParameter("eventSource"))`]), items: this.client._bind(this.items) })
      .avatar_group_item({ initials: `{INITIALS}`, fallbackicon: `{FALLBACKICON}`, src: `{SRC}`, tooltip: `{NAME}` })
      .get_parent()
      .label({ text: `AvatarGroup control in Group mode`, class: `sapUiSmallMarginBottom sapUiMediumMarginTop` })
      .avatar_group({ id: `avatarGroup2`, grouptype: `Group`, tooltip: `Avatar Group`, avatardisplaysize: `M`, press: this.client._event(`onGroupPress`, [`\${$source>/id}`, `\${$parameters>/groupType}`, `\${$parameters>/overflowButtonPressed}`, `\${$parameters>/avatarsDisplayed}`]), items: this.client._bind(this.items) })
      .avatar_group_item({ initials: `{INITIALS}`, fallbackicon: `{FALLBACKICON}`, src: `{SRC}` });
    this.client.view_display(view.stringify());
    this.client.action.gen({ val: z2ui5_if_client.cs_event.set_title, t_arg: [`Avatar Group Sample`] });
  }

  display_individual_popover({ id } = {}) {
    const individual_popover = z2ui5_cl_xml_view.factory_popup();
    individual_popover.popover({ id: `individualPopover`, class: `sapFAvatarGroupPopover`, title: `Business card`, titlealignment: `Center`, placement: `Bottom`, contentwidth: `250px`, contentheight: `332px` })
      .card()
      .content(`f`)
      .vertical_layout({ class: `sapUiContentPadding` })
      .hbox({ alignitems: `Center` })
      .avatar({ src: this.client._bind(this.item.src, { name: `item-src` }), initials: this.client._bind(this.item.initials, { name: `item-initials` }), badgetooltip: this.client._bind(this.item.tooltip, { name: `item-tooltip` }), fallbackicon: this.client._bind(this.item.fallbackicon, { name: `item-fallbackicon` }) })
      .vbox(`sapUiTinyMarginBegin`)
      .title(this.client._bind(this.item.name, { name: `item-name` }))
      .text(this.client._bind(this.item.jobposition, { name: `item-jobposition` }))
      .get_parent()
      .get_parent()
      .title(`Contact Details`)
      .label(`Mobile`)
      .text(this.client._bind(this.item.mobile, { name: `item-mobile` }))
      .label(`Phone`)
      .text(this.client._bind(this.item.phone, { name: `item-phone` }))
      .label(`Email`)
      .text(this.client._bind(this.item.email, { name: `item-email` }));
    this.client.popover_display(individual_popover.stringify(), id);
  }

  display_group_popover({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    const nav_container = view.popover({ id: `groupPopover`, class: `sapFAvatarGroupPopover`, showheader: false, contentwidth: this.client._bind(this.content_width), contentheight: this.client._bind(this.content_height), placement: `Bottom` })
      .nav_container({ id: `navContainer` });
    nav_container.page({ id: `main`, titlealignment: `Center`, title: `Team Members (${this.group_items.length})` })
      .vertical_layout({ class: `sapUiTinyMarginTop`, width: `100%` })
      .grid({ default_span: `XL6 L6 M6 S12`, content: this.client._bind(this.group_items) })
      .hbox({ alignitems: `Center` })
      .vbox()
      .avatar({ class: `sapUiTinyMarginEnd`, initials: `{INITIALS}`, fallbackicon: `{FALLBACKICON}`, src: `{SRC}`, badgetooltip: `{NAME}`, backgroundcolor: `{BACKGROUNDCOLOR}`, press: this.client._event(`onAvatarPress`, [`\${ID}`]) })
      .get_parent()
      .vbox()
      .text(`{NAME}`)
      .text(`{JOBPOSITION}`);
    nav_container.page({ id: `detail`, shownavbutton: this.client.check_app_prev_stack(), navbuttonpress: this.client._event(`onNavBack`), titlealignment: `Center`, title: `Team Members (${this.group_items.length})` })
      .card()
      .content(`f`)
      .vertical_layout({ class: `sapUiContentPadding` })
      .hbox({ alignitems: `Center` })
      .avatar({ src: this.client._bind(this.item.src, { name: `item-src` }), initials: this.client._bind(this.item.initials, { name: `item-initials` }), badgetooltip: this.client._bind(this.item.tooltip, { name: `item-tooltip` }), fallbackicon: this.client._bind(this.item.fallbackicon, { name: `item-fallbackicon` }) })
      .vbox(`sapUiTinyMarginBegin`)
      .title(this.client._bind(this.item.name, { name: `item-name` }))
      .text(this.client._bind(this.item.jobposition, { name: `item-jobposition` }))
      .get_parent()
      .get_parent()
      .title(`Contact Details`)
      .label(`Mobile`)
      .text(this.client._bind(this.item.mobile, { name: `item-mobile` }))
      .label(`Phone`)
      .text(this.client._bind(this.item.phone, { name: `item-phone` }))
      .label(`Email`)
      .text(this.client._bind(this.item.email, { name: `item-email` }));
    this.client.popover_display(view.stringify(), id);
  }

  on_event() {
    let group_id;
    let overflow_button_pressed;
    let items_displayed;
    let item_id;
    let item_table_index;
    let id;
    const lt_arg = this.client.get().T_EVENT_ARG;
    switch (this.client.get().EVENT) {
      case `onGroupPress`:
        group_id = z2ui5_cl_util.abap_copy(lt_arg[(1) - 1]);
        this.group_items = z2ui5_cl_util.abap_copy(this.items);
        this.content_height = this.calculate_content_height({ lines: this.group_items.length });
        this.content_width = `450px`;
        this.display_group_popover({ id: group_id });
        this.client.popover_destroy();
        break;
      case `onIndividualPress`:
        overflow_button_pressed = z2ui5_cl_util.abap_copy(lt_arg[(3) - 1]);
        items_displayed = z2ui5_cl_util.abap_copy(lt_arg[(4) - 1]);
        item_id = z2ui5_cl_util.abap_copy(lt_arg[(5) - 1]);
        item_table_index = z2ui5_cl_util.abap_copy(lt_arg[(6) - 1]);
        this.group_items = /* TODO(abap2js): VALUE FOR/BASE */ [];
        this.content_height = this.calculate_content_height({ lines: this.group_items.length });
        this.content_width = `450px`;
        if ((overflow_button_pressed === true || overflow_button_pressed === `X`)) {
          this.display_group_popover({ id: item_id });
        } else {
          this.item = (() => { try { return this.items[(item_table_index + 1) - 1] ?? null; } catch { return null; } })();
          this.display_individual_popover({ id: item_id });
        }
        this.client.popover_destroy();
        break;
      case `onAvatarPress`:
        id = z2ui5_cl_util.abap_copy(lt_arg[(1) - 1]);
        this.item = (() => { try { return this.items.find((row) => row.id === id) ?? null; } catch { return null; } })();
        this.content_height = `370px`;
        this.content_width = `250px`;
        this.client.popover_model_update();
        this.client.action.gen({ val: `POPOVER_NAV_CONTAINER_TO`, t_arg: [`navContainer`, `detail`] });
        break;
      case `onNavBack`:
        this.content_height = this.calculate_content_height({ lines: this.group_items.length });
        this.content_width = `450px`;
        this.client.popover_model_update();
        this.client.action.gen({ val: `POPOVER_NAV_CONTAINER_TO`, t_arg: [`navContainer`, `main`] });
        break;
    }
  }

  calculate_content_height({ lines } = {}) {
    let result = ``;
    const lv_floor = this.floor((z2ui5_cl_util.abap_div(lines, 2))) * 68 + 48;
    const lv_string = (lv_floor);
    result = `${lv_string.trim()}px`;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_320;
