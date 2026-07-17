const z2ui5_cl_a2ui5_context = require("abap2UI5/z2ui5_cl_a2ui5_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_xml_view_cc {
  mo_view = null;

  approve_popover({ placement, class: class_, text, btn_txt, btn_type, btn_icon, btn_event } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view.popover({ showheader: false, placement, class: class_ })
      .hbox({ justifycontent: `Center` })
      .vbox({ justifycontent: `Center`, alignitems: `Center` })
      .text(text)
      .button({ type: btn_type, text: btn_txt, icon: btn_icon, press: btn_event });
    return result;
  }

  bwip_js({ bcid, text, scale, height } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `bwipjs`, ns: `z2ui5`, t_prop: [{ n: `bcid`, v: bcid }, { n: `text`, v: text }, { n: `scale`, v: scale }, { n: `height`, v: height }] });
    return result;
  }

  camera_picture({ id, value, thumbnail, height, width, press, autoplay, onphoto, facingmode, deviceid } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `CameraPicture`, ns: `z2ui5`, t_prop: [{ n: `id`, v: id }, { n: `value`, v: value }, { n: `thumbnail`, v: thumbnail }, { n: `press`, v: press }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `OnPhoto`, v: onphoto }, { n: `autoplay`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(autoplay) }, { n: `facingMode`, v: facingmode }, { n: `deviceId`, v: deviceid }] });
    return result;
  }

  camera_selector({ selectedkey, showclearicon, selectionchange, selecteditem, items, change, width, showsecondaryvalues, placeholder, selecteditemid, name, value, valuestate, valuestatetext, textalign, visible, showvaluestatemessage, showbutton, required, editable, enabled, filtersecondaryvalues, id, class: class_ } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `CameraSelector`, ns: `z2ui5`, t_prop: [{ n: `showClearIcon`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(showclearicon) }, { n: `selectedKey`, v: selectedkey }, { n: `items`, v: items }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `selectionChange`, v: selectionchange }, { n: `selectedItem`, v: selecteditem }, { n: `selectedItemId`, v: selecteditemid }, { n: `name`, v: name }, { n: `value`, v: value }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `textAlign`, v: textalign }, { n: `showSecondaryValues`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(showsecondaryvalues) }, { n: `visible`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(visible) }, { n: `showValueStateMessage`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(showvaluestatemessage) }, { n: `showButton`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(showbutton) }, { n: `required`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(required) }, { n: `editable`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(enabled) }, { n: `filterSecondaryValues`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(filtersecondaryvalues) }, { n: `width`, v: width }, { n: `placeholder`, v: placeholder }, { n: `change`, v: change }] });
    return result;
  }

  chartjs({ canvas_id, view, config, height, width, style } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `chartjs`, ns: `z2ui5`, t_prop: [{ n: `canvas_id`, v: canvas_id }, { n: `view`, v: view }, { n: `config`, v: config }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `style`, v: style }] });
    return result;
  }

  constructor({ view } = {}) {
    this.mo_view = z2ui5_cl_util.abap_copy(view);
  }

  demo_output({ val } = {}) {
    let result = null;
    let lv_style = ``;
    this.mo_view._generic({ ns: `html`, name: `style` });
    const lv_class = `Z2UI5_CL_CC_DEMO_OUT`;
    // TODO(abap2js): CALL METHOD (lv_class)=>(`GET_STYLE`) RECEIVING result = lv_style.
    result = this.mo_view._cc_plain_xml(lv_style).html(val);
    return result;
  }

  favicon({ favicon } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Favicon`, ns: `z2ui5`, t_prop: [{ n: `favicon`, v: favicon }] });
    return result;
  }

  file_uploader({ value, path, placeholder, upload, icononly, buttononly, buttontext, uploadbuttontext, checkdirectupload, filetype, icon, enabled } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `FileUploader`, ns: `z2ui5`, t_prop: [{ n: `placeholder`, v: placeholder }, { n: `upload`, v: upload }, { n: `path`, v: path }, { n: `value`, v: value }, { n: `iconOnly`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(icononly) }, { n: `buttonOnly`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(buttononly) }, { n: `buttonText`, v: buttontext }, { n: `uploadButtonText`, v: uploadbuttontext }, { n: `fileType`, v: filetype }, { n: `checkDirectUpload`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(checkdirectupload) }, { n: `icon`, v: icon }, { n: `enabled`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(enabled) }] });
    return result;
  }

  focus({ focusid, selectionstart, selectionend, setupdate } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Focus`, ns: `z2ui5`, t_prop: [{ n: `setUpdate`, v: setupdate }, { n: `selectionStart`, v: selectionstart }, { n: `selectionEnd`, v: selectionend }, { n: `focusId`, v: focusid }] });
    return result;
  }

  geolocation({ finished, error, longitude, latitude, altitude, accuracy, altitudeaccuracy, speed, heading, enablehighaccuracy, timeout } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Geolocation`, ns: `z2ui5`, t_prop: [{ n: `finished`, v: finished }, { n: `error`, v: error }, { n: `longitude`, v: longitude }, { n: `latitude`, v: latitude }, { n: `altitude`, v: altitude }, { n: `accuracy`, v: accuracy }, { n: `altitudeAccuracy`, v: altitudeaccuracy }, { n: `speed`, v: speed }, { n: `heading`, v: heading }, { n: `enableHighAccuracy`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(enablehighaccuracy) }, { n: `timeout`, v: timeout }] });
    return result;
  }

  storage({ finished, prefix, value } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Storage`, ns: `z2ui5`, t_prop: [{ n: `finished`, v: finished }, { n: `type`, v: type }, { n: `prefix`, v: prefix }, { n: `key`, v: key }, { n: `value`, v: value }] });
    return result;
  }

  history({ search } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `History`, ns: `z2ui5`, t_prop: [{ n: `search`, v: search }] });
    return result;
  }

  info_frontend({ finished, ui5_version, device_height, device_width, device_phone, device_desktop, device_tablet, device_combi, ui5_gav, ui5_theme, device_os, device_systemtype, device_browser } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Info`, ns: `z2ui5`, t_prop: [{ n: `ui5_version`, v: ui5_version }, { n: `ui5_gav`, v: ui5_gav }, { n: `finished`, v: finished }, { n: `ui5_theme`, v: ui5_theme }, { n: `device_os`, v: device_os }, { n: `device_systemtype`, v: device_systemtype }, { n: `device_browser`, v: device_browser }, { n: `device_phone`, v: device_phone }, { n: `device_desktop`, v: device_desktop }, { n: `device_tablet`, v: device_tablet }, { n: `device_combi`, v: device_combi }, { n: `device_height`, v: device_height }, { n: `device_width`, v: device_width }] });
    return result;
  }

  message_manager({ items } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `MessageManager`, ns: `z2ui5`, t_prop: [{ n: `items`, v: items }] });
    return result;
  }

  messaging({ items } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Messaging`, ns: `z2ui5`, t_prop: [{ n: `items`, v: items }] });
    return result;
  }

  multiinput_ext({ multiinputid, multiinputname, change, addedtokens, removedtokens } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `MultiInputExt`, ns: `z2ui5`, t_prop: [{ n: `MultiInputId`, v: multiinputid }, { n: `MultiInputName`, v: multiinputname }, { n: `change`, v: change }, { n: `addedTokens`, v: addedtokens }, { n: `removedTokens`, v: removedtokens }] });
    return result;
  }

  uploadset_ext({ uploadsetid, filedata, filename, mediatype, filesize, removedfilename, change, remove } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `UploadSetExt`, ns: `z2ui5`, t_prop: [{ n: `uploadSetId`, v: uploadsetid }, { n: `fileData`, v: filedata }, { n: `fileName`, v: filename }, { n: `mediaType`, v: mediatype }, { n: `fileSize`, v: filesize }, { n: `removedFileName`, v: removedfilename }, { n: `change`, v: change }, { n: `remove`, v: remove }] });
    return result;
  }

  tree({ tree_id } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Tree`, ns: `z2ui5`, t_prop: [{ n: `tree_id`, v: tree_id }] });
    return result;
  }

  scrolling({ setupdate, items } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Scrolling`, ns: `z2ui5`, t_prop: [{ n: `setUpdate`, v: setupdate }, { n: `items`, v: items }] });
    return result;
  }

  spreadsheet_export({ tableid, clike, text, icon, tooltip, columnconfig } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `ExportSpreadsheet`, ns: `z2ui5`, t_prop: [{ n: `tableId`, v: tableid }, { n: `text`, v: text }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `tooltip`, v: tooltip }, { n: `columnconfig`, v: columnconfig }] });
    return result;
  }

  timer({ finished, delayms, checkrepeat, checkactive } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Timer`, ns: `z2ui5`, t_prop: [{ n: `delayMS`, v: delayms }, { n: `finished`, v: finished }, { n: `checkActive`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(checkactive) }, { n: `checkRepeat`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(checkrepeat) }] });
    return result;
  }

  binding_update({ changed, path } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `BindingUpdate`, ns: `z2ui5`, t_prop: [{ n: `path`, v: path }, { n: `changed`, v: changed }] });
    return result;
  }

  websocket({ value, received, path, checkrepeat, checkactive } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Websocket`, ns: `z2ui5`, t_prop: [{ n: `value`, v: value }, { n: `path`, v: path }, { n: `received`, v: received }, { n: `checkActive`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(checkactive) }, { n: `checkRepeat`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(checkrepeat) }] });
    return result;
  }

  lp_title({ title, applicationfullwidth } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `LPTitle`, ns: `z2ui5`, t_prop: [{ n: `title`, v: title }, { n: `ApplicationFullWidth`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(applicationfullwidth) }] });
    return result;
  }

  title({ title } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Title`, ns: `z2ui5`, t_prop: [{ n: `title`, v: title }] });
    return result;
  }

  dirty({ isdirty } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `Dirty`, ns: `z2ui5`, t_prop: [{ n: `isDirty`, v: z2ui5_cl_a2ui5_context.boolean_abap_2_json(isdirty) }] });
    return result;
  }

  uitableext({ tableid } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `UITableExt`, ns: `z2ui5`, t_prop: [{ n: `tableId`, v: tableid }] });
    return result;
  }

  smartmultiinput_ext({ multiinputid, change, rangedata, addedtokens, removedtokens } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_view);
    this.mo_view._generic({ name: `SmartMultiInputExt`, ns: `z2ui5`, t_prop: [{ n: `multiInputId`, v: multiinputid }, { n: `rangeData`, v: rangedata }, { n: `change`, v: change }, { n: `addedTokens`, v: addedtokens }, { n: `removedTokens`, v: removedtokens }] });
    return result;
  }
}

module.exports = z2ui5_cl_xml_view_cc;
