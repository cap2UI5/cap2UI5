const z2ui5_cl_pop_image_editor = require("abap2UI5/z2ui5_cl_pop_image_editor");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_306 extends z2ui5_if_app {
  mt_picture = [];
  mt_picture_out = [];
  mv_pic_display = ``;
  mv_picture_base = ``;
  mv_picture_thumb = ``;
  facing_mode = ``;
  facing_modes = [];
  device = ``;
  devices = [];
  selected_picture = {};
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const cont = view.shell();
    const page = cont.page({ title: `abap2UI5 - Device Camera Picture`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.vbox(`sapUiSmallMargin`)
      .label({ text: `facingMode: `, labelfor: `ComboFacingMode` })
      .combobox({ id: `ComboFacingMode`, selectedkey: this.client._bind_edit(this.facing_mode), items: `{path:'${this.client._bind_edit({ val: this.facing_modes, path: true })}', sorter: { path: 'TEXT' } }` })
      .get()
      .item({ key: `{KEY}`, text: `{TEXT}` });
    page.vbox(`sapUiSmallMargin`)
      .label({ text: `device: `, labelfor: `ComboDevice` })
      ._z2ui5()
      .camera_selector({ id: `ComboDevice`, selectedkey: this.client._bind_edit(this.device), items: `{path:'${this.client._bind_edit({ val: this.devices, path: true })}', sorter: { path: 'TEXT' } }` })
      .get()
      .item({ key: `{KEY}`, text: `{TEXT}` });
    page._z2ui5()
      .camera_picture({ value: this.client._bind_edit(this.mv_picture_base), thumbnail: this.client._bind_edit(this.mv_picture_thumb), onphoto: this.client._event(`CAPTURE`), facingmode: this.client._bind_edit(this.facing_mode), deviceid: this.client._bind_edit(this.device) });
    const lo_list = page.list({ headertext: `List Output`, items: this.client._bind_edit(this.mt_picture_out), mode: `SingleSelectMaster`, selectionchange: this.client._event(`DISPLAY`) });
    const lo_item = lo_list._generic({ name: `CustomListItem`, t_prop: [{ n: `selected`, v: `{SELECTED}` }] });
    const lo_hbox = lo_item.hbox({ alignitems: `Center` });
    lo_hbox.image({ src: `{THUMBNAIL}`, height: `80px` });
    lo_hbox.text(`{NAME}`);
    if (this.mv_pic_display) {
      page.button({ text: `Edit`, icon: `sap-icon://edit`, press: this.client._event(`EDIT`) });
    }
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.facing_modes = [{ key: ``, text: `` }, { key: `environment`, text: `environment` }, { key: `user`, text: `user` }, { key: `left`, text: `left` }, { key: `right`, text: `right` }];
      this.view_display();
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.on_navigation();
      this.rebuild_output();
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `CAPTURE`:
        this.mt_picture.push({ data: this.mv_picture_base, thumbnail: this.mv_picture_thumb, time: sy_uzeit });
        this.mv_picture_base = {};
        this.mv_picture_thumb = {};
        client.view_model_update();
        break;
      case `DISPLAY`:
        this.selected_picture = this.mt_picture_out.find((row) => row.selected === true);
        this.mv_pic_display = this.mt_picture[(this.selected_picture.id) - 1].data;
        this.rebuild_output();
        this.view_display();
        return;
        break;
      case `EDIT`:
        this.edit_image();
        break;
    }
    this.rebuild_output();
  }

  edit_image() {
    this.client.nav_app_call(z2ui5_cl_pop_image_editor.factory(this.mv_pic_display));
  }

  rebuild_output() {
    let sy_tabix = 0;
    this.mt_picture_out = {};
    sy_tabix = 0;
    for (const ls_pic of this.mt_picture) {
      sy_tabix++;
      this.mt_picture_out.push({ name: `picture ${sy_tabix}`, id: sy_tabix, thumbnail: ls_pic.thumbnail, selected: (sy_tabix === this.selected_picture.id ? true : null) });
    }
  }

  on_navigation() {
    let sy_subrc = 0;
    let fs_picture = null;
    let _fs$fs_picture = null;
    let lo_prev;
    let result;
    try {
      lo_prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      result = (lo_prev).result();
      if (result.check_confirmed === true) {
        this.mv_pic_display = result.image;
        fs_picture = this.mt_picture[(this.selected_picture.id) - 1];
        _fs$fs_picture = null;
        sy_subrc = 0;
        if (sy_subrc === 0) {
          fs_picture.data = this.mv_pic_display;
          fs_picture.thumbnail = this.mv_pic_display;
        }
      }
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_306;
