const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_306 extends z2ui5_if_app {
  mt_picture = [];
  mt_picture_out = [];
  mv_pic_display = ``;
  mv_picture_base = ``;
  mv_picture_thumb = ``;
  facing_mode = ``;
  facing_modes = [];
  device = ``;
  devices = [];
  selected_picture = { time: ``, id: ``, name: ``, data: ``, thumbnail: ``, selected: false };
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.facing_modes = z2ui5_cl_util.abap_tab_assign(this.facing_modes, [{ key: ``, text: `` }, { key: `environment`, text: `environment` }, { key: `user`, text: `user` }, { key: `left`, text: `left` }, { key: `right`, text: `right` }]);
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const cont = view.ele(`Shell`);
    const page = cont.ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Device - Camera, Take Photos` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Capture photos from the device camera custom control; pick the facing mode and camera, then select ` + `a captured picture from the list to display it in full resolution.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Label`)
      .a({ n: `text`, v: `facingMode: ` })
      .a({ n: `labelFor`, v: `ComboFacingMode` })
      .ele(`ComboBox`)
      .a({ n: `selectedKey`, v: this.client._bind(this.facing_mode) })
      .a({ n: `items`, v: `{path:'${this.client._bind(this.facing_modes, { path: true })}', sorter: { path: 'TEXT' } }` })
      .a({ n: `id`, v: `ComboFacingMode` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `{KEY}` })
      .a({ n: `text`, v: `{TEXT}` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Label`)
      .a({ n: `text`, v: `device: ` })
      .a({ n: `labelFor`, v: `ComboDevice` })
      .ele({ n: `CameraSelector`, ns: `z2ui5` })
      .a({ n: `selectedKey`, v: this.client._bind(this.device) })
      .a({ n: `items`, v: `{path:'${this.client._bind(this.devices, { path: true })}', sorter: { path: 'TEXT' } }` })
      .a({ n: `id`, v: `ComboDevice` })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `{KEY}` })
      .a({ n: `text`, v: `{TEXT}` });
    page.tag({ n: `CameraPicture`, ns: `z2ui5` })
      .a({ n: `value`, v: this.client._bind(this.mv_picture_base) })
      .a({ n: `thumbnail`, v: this.client._bind(this.mv_picture_thumb) })
      .a({ n: `OnPhoto`, v: this.client._event(`CAPTURE`) })
      .a({ n: `facingMode`, v: this.client._bind(this.facing_mode) })
      .a({ n: `deviceId`, v: this.client._bind(this.device) });
    const lo_list = page.ele(`List`)
      .a({ n: `headerText`, v: `List Output` })
      .a({ n: `items`, v: this.client._bind(this.mt_picture_out) })
      .a({ n: `mode`, v: `SingleSelectMaster` })
      .a({ n: `selectionChange`, v: this.client._event(`DISPLAY`) });
    const lo_item = lo_list.ele(`CustomListItem`).a({ n: `selected`, v: `{SELECTED}` });
    const lo_hbox = lo_item.ele(`HBox`).a({ n: `alignItems`, v: `Center` });
    lo_hbox.tag(`Image`).a({ n: `src`, v: `{THUMBNAIL}` }).a({ n: `height`, v: `80px` });
    lo_hbox.tag(`Text`).a({ n: `text`, v: `{NAME}` });
    if (!z2ui5_cl_util.abap_is_initial(this.mv_pic_display)) {
      page.tag(`Image`)
        .a({ n: `src`, v: this.client._bind(this.mv_pic_display) })
        .a({ n: `class`, v: `sapUiSmallMargin` })
        .a({ n: `height`, v: `200px` });
    }
    this.client.view_display(view.stringify());
  }

  on_event() {
    let sy_uzeit = "";
    switch (this.client.get_event()) {
      case `CAPTURE`:
        this.mt_picture.push(z2ui5_cl_util.abap_copy({ data: this.mv_picture_base, thumbnail: this.mv_picture_thumb, time: sy_uzeit, id: ``, name: ``, selected: false }));
        this.mv_picture_base = {};
        this.mv_picture_thumb = {};
        this.rebuild_output();
        break;
      case `DISPLAY`:
        this.selected_picture = this.mt_picture_out.find((row) => row.selected === true);
        this.mv_pic_display = z2ui5_cl_util.abap_tab_assign(this.mv_pic_display, z2ui5_cl_util.abap_copy(this.mt_picture[(this.selected_picture.id) - 1].data));
        this.rebuild_output();
        this.view_display();
        break;
    }
  }

  rebuild_output() {
    let sy_tabix = 0;
    this.mt_picture_out = z2ui5_cl_util.abap_tab_assign(this.mt_picture_out, []);
    sy_tabix = 0;
    for (const ls_pic of this.mt_picture) {
      sy_tabix++;
      this.mt_picture_out.push(z2ui5_cl_util.abap_copy({ name: `picture ${sy_tabix}`, id: sy_tabix, thumbnail: ls_pic.thumbnail, selected: (sy_tabix === this.selected_picture.id), time: ``, data: `` }));
    }
  }
}

module.exports = z2ui5_cl_smp_app_306;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

