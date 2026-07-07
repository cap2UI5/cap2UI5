const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_354 extends z2ui5_if_app {
  t_files = [];
  filedata = ``;
  filename = ``;
  mediatype = ``;
  filesize = ``;
  removedfilename = ``;

  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `abap2UI5 - UploadSet Custom Control`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack(), class: `sapUiContentPadding` });
      page._z2ui5()
        .uploadset_ext({ uploadsetid: `myUploadSet`, filedata: client._bind_edit(this.filedata), filename: client._bind_edit(this.filename), mediatype: client._bind_edit(this.mediatype), filesize: client._bind_edit(this.filesize), removedfilename: client._bind_edit(this.removedfilename), change: client._event(`FILE_ADDED`), remove: client._event(`FILE_REMOVED`) });
      page.upload_set({ id: `myUploadSet`, instantupload: true, showicons: true, uploadenabled: true, mode: `MultiSelect`, items: client._bind_edit(this.t_files) })
        .items(`upload`)
        .upload_set_item({ filename: `{FILENAME}`, mediatype: `{MEDIATYPE}` });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`FILE_ADDED`)) {
      this.t_files.push({ filename: this.filename, mediatype: this.mediatype, size: this.filesize, data: this.filedata });
      this.filedata = ``;
      this.filename = ``;
      this.mediatype = ``;
      this.filesize = ``;
      client.view_model_update();
    } else if (client.check_on_event(`FILE_REMOVED`)) {
      for (let _i = this.t_files.length - 1; _i >= 0; _i--) { const row = this.t_files[_i]; if (this.filename === this.removedfilename) this.t_files.splice(_i, 1); }
      this.removedfilename = ``;
      client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_354;
