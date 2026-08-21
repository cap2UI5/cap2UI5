const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_074 extends z2ui5_if_app {
  filepath = ``;
  file = ``;
  upload_name = ``;
  upload_size = 0;
  upload_text = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let raw;
    let error;
    try {
      switch (this.client.get_event()) {
        case `START`:
        case `CHANGE`:
          this.view_display();
          break;
        case `UPLOAD`:
          let [header, base64] = this.file.split(`;`);
          [header, base64] = base64.split(`,`);
          raw = this.base64_decode({ val: base64 });
          this.upload_name = z2ui5_cl_util.abap_tab_assign(this.upload_name, z2ui5_cl_util.abap_copy(this.filepath));
          this.upload_size = this.xstrlen(raw);
          this.upload_text = this.xstring_to_string({ val: raw });
          this.client.message_toast_display(`${this.upload_name} - ${this.upload_size} bytes received`);
          this.file = {};
          this.filepath = {};
          this.view_display();
          break;
      }
    } catch (_caught1) {
      error = _caught1;
      this.client.message_box_display(error.get_text(), `error`);
    }
  }

  base64_decode({ val } = {}) {
    let result = null;
    let lv_class = ``;
    try {
      lv_class = `CL_WEB_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`DECODE_X_BASE64`) EXPORTING encoded = val RECEIVING decoded = result.
    } catch (error) {
      lv_class = `CL_HTTP_UTILITY`;
      // TODO(abap2js): CALL METHOD (lv_class)=>(`DECODE_X_BASE64`) EXPORTING encoded = val RECEIVING decoded = result.
    }
    return result;
  }

  xstring_to_string({ val } = {}) {
    let result = ``;
    let lo_conv = null;
    let lv_class = ``;
    try {
      lv_class = `CL_ABAP_CONV_CODEPAGE`;
      // TODO(abap2js): CALL METHOD (lv_class)=>create_in RECEIVING instance = lo_conv.
      {
        const _dynr = (lo_conv);
        const _dynm = _dynr ? _dynr[String(`IF_ABAP_CONV_IN~CONVERT`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`IF_ABAP_CONV_IN~CONVERT`)} not found`);
        {
          const _dynargs = { source: val };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynret !== undefined ? _dynret : _dynargs.result;
        }
      }
    } catch (error) {
      lv_class = `CL_ABAP_CONV_IN_CE`;
      // TODO(abap2js): CALL METHOD (lv_class)=>create EXPORTING encoding = `UTF-8` RECEIVING conv = lo_conv.
      {
        const _dynr = (lo_conv);
        const _dynm = _dynr ? _dynr[String(`CONVERT`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`CONVERT`)} not found`);
        {
          const _dynargs = { input: val, data: result };
          const _dynret = _dynm.call(_dynr, _dynargs);
          result = _dynargs.data;
        }
      }
    }
    return result;
  }

  view_display() {
    let box;
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - File - Upload to the Backend` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The file_uploader custom control returns the picked file as a base64 data URL; the backend ` + `strips the prefix, decodes the payload and reports what arrived - name, size in bytes and content.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    if (!z2ui5_cl_util.abap_is_initial(this.upload_name)) {
      box = page.ele(`Panel`)
        .a({ n: `headerText`, v: `Received in the backend` })
        .a({ n: `class`, v: `sapUiSmallMargin` })
        .ele(`VBox`)
        .a({ n: `class`, v: `sapUiSmallMargin` });
      box.tag(`ObjectStatus`).a({ n: `title`, v: `File` }).a({ n: `text`, v: this.upload_name });
      box.tag(`ObjectStatus`)
        .a({ n: `title`, v: `Size` })
        .a({ n: `text`, v: `${this.upload_size} bytes` })
        .a({ n: `state`, v: `Success` });
      box.tag(`TextArea`)
        .a({ n: `value`, v: this.upload_text })
        .a({ n: `editable`, b: false })
        .a({ n: `rows`, v: `8` })
        .a({ n: `width`, v: `100%` })
        .a({ n: `class`, v: `sapUiSmallMarginTop` });
    }
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag({ n: `FileUploader`, ns: `z2ui5` })
      .a({ n: `placeholder`, v: `filepath here...` })
      .a({ n: `upload`, v: this.client._event(`UPLOAD`) })
      .a({ n: `path`, v: this.client._bind(this.filepath) })
      .a({ n: `value`, v: this.client._bind(this.file) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_074;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

