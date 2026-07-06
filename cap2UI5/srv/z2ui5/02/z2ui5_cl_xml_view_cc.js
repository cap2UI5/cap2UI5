/**
 * z2ui5_cl_xml_view_cc — JS port of abap2UI5 z2ui5_cl_xml_view_cc.
 *
 * Companion (decorator) class around z2ui5_cl_xml_view. Exposes typed
 * builder methods for the z2ui5 custom-control set (CameraPicture, Scrolling,
 * Info, FileUploader, Geolocation, …). Construct via `view._z2ui5()` — returns
 * a fresh wrapper bound to that view.
 *
 * Each method emits its `<z2ui5:Name>` element on the wrapped view and returns
 * the view for chaining (mirrors abap's `RETURNING VALUE(result) TYPE REF TO
 * z2ui5_cl_xml_view`).
 */
class z2ui5_cl_xml_view_cc {

  constructor(view) {
    this.mo_view = view;
  }

  // ===== helpers =====

  /** Emit a z2ui5:Name control on the wrapped view, return the view. */
  _emit(name, props) {
    this.mo_view.cc(name, { ns: "z2ui5", ...props });
    return this.mo_view;
  }

  // ===== Custom controls (alphabetical) =====

  approve_popover({ placement, class: cssClass, text, btn_type, btn_txt, btn_icon, btn_event } = {}) {
    this.mo_view
      .Popover({ showHeader: false, placement, class: cssClass })
        .HBox({ justifyContent: `Center` })
          .VBox({ justifyContent: `Center`, alignItems: `Center` })
            .Text({ text })
            .Button({ type: btn_type, text: btn_txt, icon: btn_icon, press: btn_event });
    return this.mo_view;
  }

  binding_update({ path, changed } = {}) {
    return this._emit("BindingUpdate", { path, changed });
  }

  bwip_js({ bcid, text, scale, height } = {}) {
    return this._emit("bwipjs", { bcid, text, scale, height });
  }

  camera_picture({ id, value, thumbnail, height, width, press, autoplay, onphoto, facingmode, deviceid } = {}) {
    return this._emit("CameraPicture", {
      id, value, thumbnail, press, height, width,
      OnPhoto:    onphoto,
      autoplay:   this.mo_view.boolean_abap_2_json(autoplay),
      facingMode: facingmode,
      deviceId:   deviceid,
    });
  }

  camera_selector({
    selectedkey, showclearicon, selectionchange, selecteditem, items, change, width,
    showsecondaryvalues, placeholder, selecteditemid, name, value, valuestate,
    valuestatetext, textalign, visible, showvaluestatemessage, showbutton,
    required, editable, enabled, filtersecondaryvalues, id, class: cssClass,
  } = {}) {
    return this._emit("CameraSelector", {
      showClearIcon:        this.mo_view.boolean_abap_2_json(showclearicon),
      selectedKey:          selectedkey,
      items, id,
      class:                cssClass,
      selectionchange,
      selectedItem:         selecteditem,
      selectedItemId:       selecteditemid,
      name, value,
      valueState:           valuestate,
      valueStateText:       valuestatetext,
      textAlign:            textalign,
      showSecondaryValues:  this.mo_view.boolean_abap_2_json(showsecondaryvalues),
      visible:              this.mo_view.boolean_abap_2_json(visible),
      showValueStateMessage:this.mo_view.boolean_abap_2_json(showvaluestatemessage),
      showButton:           this.mo_view.boolean_abap_2_json(showbutton),
      required:             this.mo_view.boolean_abap_2_json(required),
      editable:             this.mo_view.boolean_abap_2_json(editable),
      enabled:              this.mo_view.boolean_abap_2_json(enabled),
      filterSecondaryValues:this.mo_view.boolean_abap_2_json(filtersecondaryvalues),
      width, placeholder, change,
    });
  }

  chartjs({ canvas_id, view, config, height, width, style } = {}) {
    return this._emit("chartjs", { canvas_id, view, config, height, width, style });
  }

  dirty({ isdirty } = {}) {
    return this._emit("Dirty", { isDirty: this.mo_view.boolean_abap_2_json(isdirty) });
  }

  /**
   * demo_output — JS port of abap2UI5 demo_output. Test/demo helper that
   * scopes a `<style>` block from z2ui5_cl_cc_demo_out.get_style() and an
   * `<HTML content="…">` block in one call. JS port emits a static minimal
   * style scope; apps that need the full DemoOutput skin can override.
   */
  demo_output(val = ``) {
    const v = this.mo_view;
    v._generic({ ns: `html`, name: `style` });
    return v._cc_plain_xml(z2ui5_cl_xml_view_cc._demo_output_style())
            .HTML({ content: String(val ?? ``) });
  }

  static _demo_output_style() {
    // Minimal "demo" wrapper styles — apps can replace via a custom CSS load.
    return `.z2ui5DemoOut { padding: 1rem; border: 1px dashed #888; background:#fafafa; }`;
  }

  favicon({ favicon } = {}) {
    return this._emit("Favicon", { favicon });
  }

  file_uploader({
    placeholder, upload, path, value, icononly, buttononly, buttontext,
    uploadbuttontext, filetype, checkdirectupload, icon, enabled,
  } = {}) {
    return this._emit("FileUploader", {
      placeholder, upload, path, value,
      iconOnly:           this.mo_view.boolean_abap_2_json(icononly),
      buttonOnly:         this.mo_view.boolean_abap_2_json(buttononly),
      buttonText:         buttontext,
      uploadButtonText:   uploadbuttontext,
      fileType:           filetype,
      checkDirectUpload:  this.mo_view.boolean_abap_2_json(checkdirectupload),
      icon,
      enabled:            this.mo_view.boolean_abap_2_json(enabled),
    });
  }

  focus({ setupdate, selectionstart, selectionend, focusid } = {}) {
    return this._emit("Focus", {
      setUpdate:      setupdate,
      selectionStart: selectionstart,
      selectionEnd:   selectionend,
      focusId:        focusid,
    });
  }

  geolocation({
    finished, longitude, latitude, altitude, accuracy, altitudeaccuracy,
    speed, heading, enablehighaccuracy, timeout,
  } = {}) {
    return this._emit("Geolocation", {
      finished, longitude, latitude, altitude, accuracy,
      altitudeAccuracy:   altitudeaccuracy,
      speed, heading,
      enableHighAccuracy: this.mo_view.boolean_abap_2_json(enablehighaccuracy),
      timeout,
    });
  }

  history({ search } = {}) {
    return this._emit("History", { search });
  }

  info_frontend({
    ui5_version, ui5_gav, finished, ui5_theme, device_os, device_systemtype,
    device_browser, device_phone, device_desktop, device_tablet, device_combi,
    device_height, device_width,
  } = {}) {
    return this._emit("Info", {
      ui5_version, ui5_gav, finished, ui5_theme, device_os, device_systemtype,
      device_browser, device_phone, device_desktop, device_tablet, device_combi,
      device_height, device_width,
    });
  }

  lp_title(title, applicationfullwidth) {
    return this._emit("LPTitle", {
      title,
      ApplicationFullWidth: this.mo_view.boolean_abap_2_json(applicationfullwidth),
    });
  }

  message_manager({ items } = {}) {
    return this._emit("MessageManager", { items });
  }

  messaging({ items } = {}) {
    return this._emit("Messaging", { items });
  }

  multiinput_ext({ multiinputid, multiinputname, change, addedtokens, removedtokens } = {}) {
    return this._emit("MultiInputExt", {
      MultiInputId:   multiinputid,
      MultiInputName: multiinputname,
      change,
      addedTokens:    addedtokens,
      removedTokens:  removedtokens,
    });
  }

  scrolling({ setupdate, items } = {}) {
    return this._emit("Scrolling", { setUpdate: setupdate, items });
  }

  smartmultiinput_ext({ multiinputid, rangedata, change, addedtokens, removedtokens } = {}) {
    return this._emit("SmartMultiInputExt", {
      multiInputId:  multiinputid,
      rangeData:     rangedata,
      change,
      addedTokens:   addedtokens,
      removedTokens: removedtokens,
    });
  }

  spreadsheet_export({ tableid, text, icon, type, tooltip, columnconfig } = {}) {
    return this._emit("ExportSpreadsheet", {
      tableId: tableid,
      text, icon, type, tooltip, columnconfig,
    });
  }

  storage({ finished, type, prefix, key, value } = {}) {
    return this._emit("Storage", { finished, type, prefix, key, value });
  }

  timer({ delayms, finished, checkactive, checkrepeat } = {}) {
    return this._emit("Timer", {
      delayMS:     delayms,
      finished,
      checkActive: this.mo_view.boolean_abap_2_json(checkactive),
      checkRepeat: this.mo_view.boolean_abap_2_json(checkrepeat),
    });
  }

  title(title) {
    return this._emit("Title", { title });
  }

  tree({ tree_id } = {}) {
    return this._emit("Tree", { tree_id });
  }

  uitableext({ tableid } = {}) {
    return this._emit("UITableExt", { tableId: tableid });
  }

  websocket({ value, path, received, checkactive, checkrepeat } = {}) {
    return this._emit("Websocket", {
      value, path, received,
      checkActive: this.mo_view.boolean_abap_2_json(checkactive),
      checkRepeat: this.mo_view.boolean_abap_2_json(checkrepeat),
    });
  }
}

module.exports = z2ui5_cl_xml_view_cc;
