const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view_cc = require("abap2UI5/z2ui5_cl_xml_view_cc");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

class z2ui5_cl_xml_view {
  static st_ns_map = [];

  mv_name = ``;
  mv_ns = ``;
  mt_prop = [];
  mt_ns = [];
  mo_root = null;
  mo_previous = null;
  mo_parent = null;
  mt_child = null;

  actions({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `actions`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  action_button({ id, class: class_, enabled, icon, position, title, press } = {}) {
    let result = null;
    result = this._generic({ name: `ActionButton`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `icon`, v: icon }, { n: `position`, v: position }, { n: `title`, v: title }, { n: `press`, v: press }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }] });
    return result;
  }

  action_buttons({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `actionButtons`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */) });
    return result;
  }

  action_sheet({ id, cancelbuttontext, placement, showcancelbutton, title, afterclose, afteropen, beforeclose, beforeopen, cancelbuttonpress, visible, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ActionSheet`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `cancelButtonText`, v: cancelbuttontext }, { n: `placement`, v: placement }, { n: `showCancelButton`, v: showcancelbutton }, { n: `title`, v: title }, { n: `afterClose`, v: afterclose }, { n: `afterOpen`, v: afteropen }, { n: `beforeClose`, v: beforeclose }, { n: `beforeOpen`, v: beforeopen }, { n: `cancelButtonPress`, v: cancelbuttonpress }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  additional_content() {
    let result = null;
    result = this._generic({ name: `additionalContent` });
    return result;
  }

  additional_numbers() {
    let result = null;
    result = this._generic({ name: `additionalNumbers` });
    return result;
  }

  analytic_map({ id, initialposition, height, lassoselection, visible, width, initialzoom } = {}) {
    let result = null;
    result = this._generic({ name: `AnalyticMap`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `initialPosition`, v: initialposition }, { n: `lassoSelection`, v: lassoselection }, { n: `height`, v: height }, { n: `visible`, v: visible }, { n: `width`, v: width }, { n: `initialZoom`, v: initialzoom }] });
    return result;
  }

  appointments() {
    let result = null;
    result = this._generic({ name: `appointments` });
    return result;
  }

  appointment_items() {
    let result = null;
    result = this._generic({ name: `appointmentItems` });
    return result;
  }

  area_micro_chart({ colorpalette, press, size, height, maxxvalue, maxyvalue, minxvalue, minyvalue, view, aligncontent, hideonnodata, showlabel, width } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `AreaMicroChart`, ns: `mchart`, t_prop: [{ n: `colorPalette`, v: colorpalette }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `maxXValue`, v: maxxvalue }, { n: `maxYValue`, v: maxyvalue }, { n: `minXValue`, v: minxvalue }, { n: `minYValue`, v: minyvalue }, { n: `view`, v: view }, { n: `alignContent`, v: aligncontent }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `showLabel`, v: z2ui5_cl_util.boolean_abap_2_json(showlabel) }, { n: `width`, v: width }] });
    return result;
  }

  attributes({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `attributes`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */) });
    return result;
  }

  avatar({ ns, id, src, class: class_, displaysize, ariahaspopup, backgroundcolor, badgeicon, badgetooltip, badgevaluestate, customdisplaysize, customfontsize, displayshape, fallbackicon, imagefittype, initials, showborder, decorative, enabled, press } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Avatar`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `id`, v: id }, { n: `src`, v: src }, { n: `class`, v: class_ }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `backgroundColor`, v: backgroundcolor }, { n: `badgeIcon`, v: badgeicon }, { n: `badgeTooltip`, v: badgetooltip }, { n: `badgeValueState`, v: badgevaluestate }, { n: `customDisplaySize`, v: customdisplaysize }, { n: `customFontSize`, v: customfontsize }, { n: `displayShape`, v: displayshape }, { n: `fallbackIcon`, v: fallbackicon }, { n: `imageFitType`, v: imagefittype }, { n: `initials`, v: initials }, { n: `showBorder`, v: z2ui5_cl_util.boolean_abap_2_json(showborder) }, { n: `decorative`, v: z2ui5_cl_util.boolean_abap_2_json(decorative) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `displaySize`, v: displaysize }, { n: `press`, v: press }] });
    return result;
  }

  avatar_group({ id, avatarcustomdisplaysize, avatarcustomfontsize, avatardisplaysize, blocked, busy, busyindicatordelay, busyindicatorsize, fieldgroupids, grouptype, visible = true, tooltip, items, press } = {}) {
    let result = null;
    result = this._generic({ name: `AvatarGroup`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `avatarCustomDisplaySize`, v: avatarcustomdisplaysize }, { n: `avatarCustomFontSize`, v: avatarcustomfontsize }, { n: `avatarDisplaySize`, v: avatardisplaysize }, { n: `blocked`, v: z2ui5_cl_util.boolean_abap_2_json(blocked) }, { n: `busy`, v: z2ui5_cl_util.boolean_abap_2_json(busy) }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `groupType`, v: grouptype }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `tooltip`, v: tooltip }, { n: `items`, v: items }, { n: `press`, v: press }] });
    return result;
  }

  avatar_group_item({ id, busy = `false`, busyindicatordelay, busyindicatorsize, fallbackicon, fieldgroupids, initials, src, visible = `true`, tooltip } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `AvatarGroupItem`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `busy`, v: busy }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `fallbackIcon`, v: fallbackicon }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `initials`, v: initials }, { n: `src`, v: src }, { n: `visible`, v: visible }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  axis_time_strategy() {
    let result = null;
    result = this._generic({ name: `axisTimeStrategy`, ns: `gantt` });
    return result;
  }

  badge() {
    let result = null;
    result = this._generic({ name: `badge` });
    return result;
  }

  badge_custom_data({ value, visible } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `BadgeCustomData`, t_prop: [{ n: `key`, v: key }, { n: `value`, v: value }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  bar() {
    let result = null;
    result = this._generic({ name: `Bar` });
    return result;
  }

  barcode_scanner_button({ id, scansuccess, scanfail, inputliveupdate, dialogtitle, disablebarcodeinputdialog, framerate, keepcamerascan, preferfrontcamera, providefallback, width, zoom } = {}) {
    let result = null;
    result = this._generic({ name: `BarcodeScannerButton`, ns: `ndc`, t_prop: [{ n: `id`, v: id }, { n: `scanSuccess`, v: scansuccess }, { n: `scanFail`, v: scanfail }, { n: `inputLiveUpdate`, v: inputliveupdate }, { n: `dialogTitle`, v: dialogtitle }, { n: `disableBarcodeInputDialog`, v: disablebarcodeinputdialog }, { n: `frameRate`, v: framerate }, { n: `keepCameraScan`, v: keepcamerascan }, { n: `preferFrontCamera`, v: preferfrontcamera }, { n: `provideFallback`, v: providefallback }, { n: `width`, v: width }, { n: `zoom`, v: zoom }] });
    return result;
  }

  bars() {
    let result = null;
    result = this._generic({ name: `bars`, ns: `mchart` });
    return result;
  }

  base_rectangle({ time, shapeid, endtime, selectable, selectedfill, fill, height, title, animationsettings, alignshape, color, fontsize, connectable, fontfamily, filter, transform, countinbirdeye, fontweight, showtitle, selected, resizable, horizontaltextalignment, highlighted, highlightable } = {}) {
    let result = null;
    result = this._generic({ name: `BaseRectangle`, ns: `gantt`, t_prop: [{ n: `time`, v: time }, { n: `endTime`, v: endtime }, { n: `selectable`, v: z2ui5_cl_util.boolean_abap_2_json(selectable) }, { n: `selectedFill`, v: selectedfill }, { n: `fill`, v: fill }, { n: `height`, v: height }, { n: `title`, v: title }, { n: `animationSettings`, v: animationsettings }, { n: `alignShape`, v: alignshape }, { n: `color`, v: color }, { n: `fontSize`, v: fontsize }, { n: `connectable`, v: z2ui5_cl_util.boolean_abap_2_json(connectable) }, { n: `fontFamily`, v: fontfamily }, { n: `filter`, v: filter }, { n: `transform`, v: transform }, { n: `countInBirdEye`, v: z2ui5_cl_util.boolean_abap_2_json(countinbirdeye) }, { n: `fontWeight`, v: fontweight }, { n: `showTitle`, v: z2ui5_cl_util.boolean_abap_2_json(showtitle) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }, { n: `horizontalTextAlignment`, v: horizontaltextalignment }, { n: `shapeId`, v: shapeid }, { n: `highlighted`, v: z2ui5_cl_util.boolean_abap_2_json(highlighted) }, { n: `highlightable`, v: z2ui5_cl_util.boolean_abap_2_json(highlightable) }] });
    return result;
  }

  begin_button() {
    let result = null;
    result = this._generic({ name: `beginButton` });
    return result;
  }

  begin_column_pages() {
    let result = null;
    result = this._generic({ name: `beginColumnPages`, ns: `f` });
    return result;
  }

  blocks() {
    let result = null;
    result = this._generic({ name: `blocks`, ns: `uxap` });
    return result;
  }

  more_blocks() {
    let result = null;
    result = this._generic({ name: `moreBlocks`, ns: `uxap` });
    return result;
  }

  block_layout({ background, id } = {}) {
    let result = null;
    result = this._generic({ name: `BlockLayout`, ns: `layout`, t_prop: [{ n: `background`, v: background }, { n: `id`, v: id }] });
    return result;
  }

  block_layout_cell({ backgroundcolorset, backgroundcolorshade, title, titlealignment, titlelevel, width, class: class_, id } = {}) {
    let result = null;
    result = this._generic({ name: `BlockLayoutCell`, ns: `layout`, t_prop: [{ n: `backgroundColorSet`, v: backgroundcolorset }, { n: `backgroundColorShade`, v: backgroundcolorshade }, { n: `title`, v: title }, { n: `titleAlignment`, v: titlealignment }, { n: `width`, v: width }, { n: `class`, v: class_ }, { n: `id`, v: id }, { n: `titleLevel`, v: titlelevel }] });
    return result;
  }

  block_layout_row({ rowcolorset, id } = {}) {
    let result = null;
    result = this._generic({ name: `BlockLayoutRow`, ns: `layout`, t_prop: [{ n: `rowColorSet`, v: rowcolorset }, { n: `id`, v: id }] });
    return result;
  }

  bullet_micro_chart({ actualvaluelabel, press, size, height, width, deltavaluelabel, maxvalue, minvalue, mode, scale, targetvalue, targetvaluelabel, scalecolor, hideonnodata, showactualvalue, showdeltavalue, showtargetvalue, showthresholds, showvaluemarker, smallrangeallowed, forecastvalue, savidm } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `BulletMicroChart`, ns: `mchart`, t_prop: [{ n: `actualValueLabel`, v: actualvaluelabel }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `deltaValueLabel`, v: deltavaluelabel }, { n: `maxValue`, v: maxvalue }, { n: `minValue`, v: minvalue }, { n: `mode`, v: mode }, { n: `scale`, v: scale }, { n: `targetValue`, v: targetvalue }, { n: `targetValueLabel`, v: targetvaluelabel }, { n: `scaleColor`, v: scalecolor }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `showActualValue`, v: z2ui5_cl_util.boolean_abap_2_json(showactualvalue) }, { n: `showActualValueInDeltaMode`, v: z2ui5_cl_util.boolean_abap_2_json(savidm) }, { n: `showDeltaValue`, v: z2ui5_cl_util.boolean_abap_2_json(showdeltavalue) }, { n: `showTargetValue`, v: z2ui5_cl_util.boolean_abap_2_json(showtargetvalue) }, { n: `showThresholds`, v: z2ui5_cl_util.boolean_abap_2_json(showthresholds) }, { n: `showValueMarker`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluemarker) }, { n: `smallRangeAllowed`, v: z2ui5_cl_util.boolean_abap_2_json(smallrangeallowed) }, { n: `forecastValue`, v: forecastvalue }] });
    return result;
  }

  busy_indicator({ id, class: class_, customicon, customiconheight, customiconrotationspeed, customiconwidth, size, text, textdirection, customicondensityaware, visible } = {}) {
    let result = null;
    result = this._generic({ name: `BusyIndicator`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `customIcon`, v: customicon }, { n: `customIconHeight`, v: customiconheight }, { n: `customIconRotationSpeed`, v: customiconrotationspeed }, { n: `customIconWidth`, v: customiconwidth }, { n: `size`, v: size }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `customIconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(customicondensityaware) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  button({ text, icon, enabled, visible, press, class: class_, id, ns, tooltip, width, iconfirst, icondensityaware, ariahaspopup, activeicon, accessiblerole, textdirection, arialabelledby, ariadescribedby } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Button`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `press`, v: press }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `iconFirst`, v: z2ui5_cl_util.boolean_abap_2_json(iconfirst) }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `id`, v: id }, { n: `width`, v: width }, { n: `tooltip`, v: tooltip }, { n: `textDirection`, v: textdirection }, { n: `accessibleRole`, v: accessiblerole }, { n: `activeIcon`, v: activeicon }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `class`, v: class_ }, { n: `ariaLabelledBy`, v: arialabelledby }, { n: `ariaDescribedBy`, v: ariadescribedby }] });
    return result;
  }

  buttons() {
    let result = null;
    result = this._generic({ name: `buttons` });
    return result;
  }

  calendar_appointment({ startdate, enddate, icon, title, text, tentative, selected } = {}) {
    let result = null;
    result = this._generic({ name: `CalendarAppointment`, ns: `u`, t_prop: [{ n: `startDate`, v: startdate }, { n: `endDate`, v: enddate }, { n: `icon`, v: icon }, { n: `title`, v: title }, { n: `text`, v: text }, { n: `type`, v: type }, { n: `key`, v: key }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `tentative`, v: z2ui5_cl_util.boolean_abap_2_json(tentative) }] });
    return result;
  }

  calendar_legend_item({ text, tooltip, color } = {}) {
    let result = null;
    result = this._generic({ name: `CalendarLegendItem`, t_prop: [{ n: `text`, v: text }, { n: `type`, v: type }, { n: `tooltip`, v: tooltip }, { n: `color`, v: color }] });
    return result;
  }

  card({ id, class: class_, headerposition, height, visible, width } = {}) {
    let result = null;
    result = this._generic({ name: `Card`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `headerPosition`, v: headerposition }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  card_header({ id, class: class_, iconalt, iconbackgroundcolor, icondisplayshape, iconinitials, iconsize, iconsrc, iconvisible, statustext, statusvisible, subtitle, subtitlemaxlines, title, titlemaxlines, visible, datatimestamp, press } = {}) {
    let result = null;
    result = this._generic({ name: `Header`, ns: `card`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `dataTimestamp`, v: datatimestamp }, { n: `iconAlt`, v: iconalt }, { n: `iconBackgroundColor`, v: iconbackgroundcolor }, { n: `iconDisplayShape`, v: icondisplayshape }, { n: `iconInitials`, v: iconinitials }, { n: `iconSize`, v: iconsize }, { n: `iconSrc`, v: iconsrc }, { n: `statusText`, v: statustext }, { n: `statusVisible`, v: statusvisible }, { n: `subtitle`, v: subtitle }, { n: `subtitleMaxLines`, v: subtitlemaxlines }, { n: `title`, v: title }, { n: `press`, v: press }, { n: `titleMaxLines`, v: titlemaxlines }, { n: `iconVisible`, v: z2ui5_cl_util.boolean_abap_2_json(iconvisible) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  carousel({ height, class: class_, loop, id, arrowsplacement, backgrounddesign, pageindicatorbackgrounddesign, pageindicatorborderdesign, pageindicatorplacement, width, showpageindicator, visible, pages } = {}) {
    let result = null;
    result = this._generic({ name: `Carousel`, t_prop: [{ n: `loop`, v: z2ui5_cl_util.boolean_abap_2_json(loop) }, { n: `class`, v: class_ }, { n: `height`, v: height }, { n: `id`, v: id }, { n: `arrowsPlacement`, v: arrowsplacement }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `pageIndicatorBackgroundDesign`, v: pageindicatorbackgrounddesign }, { n: `pageIndicatorBorderDesign`, v: pageindicatorborderdesign }, { n: `pageIndicatorPlacement`, v: pageindicatorplacement }, { n: `width`, v: width }, { n: `showPageIndicator`, v: showpageindicator }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `pages`, v: pages }] });
    return result;
  }

  carousel_layout({ visiblepagescount } = {}) {
    let result = null;
    result = this._generic({ name: `CarouselLayout`, t_prop: [{ n: `visiblePagesCount`, v: visiblepagescount }] });
    return result;
  }

  cells() {
    let result = null;
    result = this._generic({ name: `cells` });
    return result;
  }

  checkbox({ text, selected, enabled, select, id, class: class_, textalign, textdirection, width, activehandling, visible, displayonly, editable, partiallyselected, useentirewidth, wrapping, name, valuestate, required } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `CheckBox`, t_prop: [{ n: `text`, v: text }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `name`, v: name }, { n: `selected`, v: selected }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `valueState`, v: valuestate }, { n: `width`, v: width }, { n: `activeHandling`, v: z2ui5_cl_util.boolean_abap_2_json(activehandling) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `displayOnly`, v: z2ui5_cl_util.boolean_abap_2_json(displayonly) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `partiallySelected`, v: z2ui5_cl_util.boolean_abap_2_json(partiallyselected) }, { n: `useEntireWidth`, v: z2ui5_cl_util.boolean_abap_2_json(useentirewidth) }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `select`, v: select }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }] });
    return result;
  }

  code_editor({ value, height, width, editable } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `CodeEditor`, ns: `editor`, t_prop: [{ n: `value`, v: value }, { n: `type`, v: type }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `height`, v: height }, { n: `width`, v: width }] });
    return result;
  }

  column({ width, id, minscreenwidth, demandpopin, halign, visible, valign, styleclass, sortindicator, popindisplay, mergefunctionname, mergeduplicates, importance, autopopinwidth, class: class_, headermenu } = {}) {
    let result = null;
    result = this._generic({ name: `Column`, t_prop: [{ n: `width`, v: width }, { n: `minScreenWidth`, v: minscreenwidth }, { n: `hAlign`, v: halign }, { n: `headerMenu`, v: headermenu }, { n: `autoPopinWidth`, v: autopopinwidth }, { n: `vAlign`, v: valign }, { n: `importance`, v: importance }, { n: `mergeFunctionName`, v: mergefunctionname }, { n: `popinDisplay`, v: popindisplay }, { n: `sortIndicator`, v: sortindicator }, { n: `styleClass`, v: styleclass }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `mergeDuplicates`, v: z2ui5_cl_util.boolean_abap_2_json(mergeduplicates) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `demandPopin`, v: z2ui5_cl_util.boolean_abap_2_json(demandpopin) }] });
    return result;
  }

  columns({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `columns` });
    return result;
  }

  column_element_data({ cellslarge, cellssmall } = {}) {
    let result = null;
    result = this._generic({ name: `ColumnElementData`, ns: `form`, t_prop: [{ n: `cellsLarge`, v: cellslarge }, { n: `cellsSmall`, v: cellssmall }] });
    return result;
  }

  column_list_item({ id, valign, selected, press, counter, highlight, highlighttext, navigated, unread, visible, detailpress } = {}) {
    let result = null;
    result = this._generic({ name: `ColumnListItem`, t_prop: [{ n: `vAlign`, v: valign }, { n: `id`, v: id }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `unread`, v: z2ui5_cl_util.boolean_abap_2_json(unread) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `type`, v: type }, { n: `counter`, v: counter }, { n: `highlight`, v: highlight }, { n: `highlightText`, v: highlighttext }, { n: `detailPress`, v: detailpress }, { n: `navigated`, v: z2ui5_cl_util.boolean_abap_2_json(navigated) }, { n: `press`, v: press }] });
    return result;
  }

  action_list_item({ id, text } = {}) {
    let result = null;
    result = this._generic({ name: `ActionListItem`, t_prop: [{ n: `id`, v: id }, { n: `text`, v: text }] });
    return result;
  }

  column_menu({ id, class: class_, visible, afterclose, beforeopen } = {}) {
    let result = null;
    result = this._generic({ name: `Menu`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `afterClose`, v: afterclose }, { n: `beforeOpen`, v: beforeopen }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_action_item({ id, class: class_, icon, label, visible, press } = {}) {
    let result = null;
    result = this._generic({ name: `ActionItem`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `icon`, v: icon }, { n: `label`, v: label }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_item({ id, class: class_, icon, label, resetbuttonenabled, showcancelbutton, showconfirmbutton, showresetbutton, visible, cancel, confirm, reset } = {}) {
    let result = null;
    result = this._generic({ name: `Item`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `icon`, v: icon }, { n: `label`, v: label }, { n: `cancel`, v: cancel }, { n: `confirm`, v: confirm }, { n: `reset`, v: reset }, { n: `resetButtonEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(resetbuttonenabled) }, { n: `showCancelButton`, v: z2ui5_cl_util.boolean_abap_2_json(showcancelbutton) }, { n: `showConfirmButton`, v: z2ui5_cl_util.boolean_abap_2_json(showconfirmbutton) }, { n: `showResetButton`, v: z2ui5_cl_util.boolean_abap_2_json(showresetbutton) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_action({ id, class: class_, category, label, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickAction`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `category`, v: category }, { n: `label`, v: label }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_action_item({ id, class: class_, label, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickActionItem`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `key`, v: key }, { n: `label`, v: label }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_group({ id, class: class_, change, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickGroup`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `change`, v: change }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_group_item({ id, class: class_, grouped, label, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickGroupItem`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `key`, v: key }, { n: `label`, v: label }, { n: `grouped`, v: z2ui5_cl_util.boolean_abap_2_json(grouped) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_sort({ id, class: class_, change, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickSort`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `change`, v: change }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_sort_item({ id, class: class_, sortorder, label, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickSortItem`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `key`, v: key }, { n: `label`, v: label }, { n: `sortOrder`, v: sortorder }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_total({ id, class: class_, change, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickTotal`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `change`, v: change }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_menu_quick_total_item({ id, class: class_, totaled, label, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickTotalItem`, ns: `columnmenu`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `key`, v: key }, { n: `label`, v: label }, { n: `totaled`, v: z2ui5_cl_util.boolean_abap_2_json(totaled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  column_micro_chart({ width, press, size, aligncontent, hideonnodata, allowcolumnlabels, showbottomlabels, showtoplabels, height } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ColumnMicroChart`, ns: `mchart`, t_prop: [{ n: `width`, v: width }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `alignContent`, v: aligncontent }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `allowColumnLabels`, v: z2ui5_cl_util.boolean_abap_2_json(allowcolumnlabels) }, { n: `showBottomLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showbottomlabels) }, { n: `showTopLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showtoplabels) }, { n: `height`, v: height }] });
    return result;
  }

  column_micro_chart_data({ value, label, displayvalue, color, press } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ColumnMicroChartData`, ns: `mchart`, t_prop: [{ n: `color`, v: color }, { n: `displayValue`, v: displayvalue }, { n: `label`, v: label }, { n: `value`, v: value }, { n: `press`, v: press }] });
    return result;
  }

  combobox({ selectedkey, showclearicon, selectionchange, selecteditem, items, change, width, showsecondaryvalues, placeholder, selecteditemid, name, value, valuestate, valuestatetext, textalign, visible, showvaluestatemessage, showbutton, required, editable, enabled, filtersecondaryvalues, id, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ComboBox`, t_prop: [{ n: `showClearIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showclearicon) }, { n: `selectedKey`, v: selectedkey }, { n: `items`, v: items }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `selectionChange`, v: selectionchange }, { n: `selectedItem`, v: selecteditem }, { n: `selectedItemId`, v: selecteditemid }, { n: `name`, v: name }, { n: `value`, v: value }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `textAlign`, v: textalign }, { n: `showSecondaryValues`, v: z2ui5_cl_util.boolean_abap_2_json(showsecondaryvalues) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `showButton`, v: z2ui5_cl_util.boolean_abap_2_json(showbutton) }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `filterSecondaryValues`, v: z2ui5_cl_util.boolean_abap_2_json(filtersecondaryvalues) }, { n: `width`, v: width }, { n: `placeholder`, v: placeholder }, { n: `change`, v: change }] });
    return result;
  }

  comparison_micro_chart({ colorpalette, press, size, height, maxvalue, minvalue, scale, width, hideonnodata, shrinkable, visible, view } = {}) {
    let result = null;
    result = this._generic({ name: `ComparisonMicroChart`, ns: `mchart`, t_prop: [{ n: `colorPalette`, v: colorpalette }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `maxValue`, v: maxvalue }, { n: `minValue`, v: minvalue }, { n: `scale`, v: scale }, { n: `width`, v: width }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `shrinkable`, v: z2ui5_cl_util.boolean_abap_2_json(shrinkable) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `view`, v: view }] });
    return result;
  }

  comparison_micro_chart_data({ color, press, displayvalue, title, value } = {}) {
    let result = null;
    result = this._generic({ name: `ComparisonMicroChartData`, ns: `mchart`, t_prop: [{ n: `color`, v: color }, { n: `press`, v: press }, { n: `displayValue`, v: displayvalue }, { n: `title`, v: title }, { n: `value`, v: value }] });
    return result;
  }

  constructor() {
  }

  container_content({ id, title, icon } = {}) {
    let result = null;
    result = this._generic({ name: `ContainerContent`, ns: `vk`, t_prop: [{ n: `id`, v: id }, { n: `title`, v: title }, { n: `icon`, v: icon }] });
    return result;
  }

  container_toolbar({ showsearchbutton, aligncustomcontenttoright, findmode, findbuttonpress, infoofselectitems, showbirdeyebutton, showdisplaytypebutton, showlegendbutton, showsettingbutton, showtimezoomcontrol, stepcountofslider, zoomcontroltype, zoomlevel } = {}) {
    let result = null;
    result = this._generic({ name: `ContainerToolbar`, ns: `gantt`, t_prop: [{ n: `showSearchButton`, v: showsearchbutton }, { n: `alignCustomContentToRight`, v: z2ui5_cl_util.boolean_abap_2_json(aligncustomcontenttoright) }, { n: `findMode`, v: findmode }, { n: `infoOfSelectItems`, v: infoofselectitems }, { n: `findButtonPress`, v: findbuttonpress }, { n: `showBirdEyeButton`, v: z2ui5_cl_util.boolean_abap_2_json(showbirdeyebutton) }, { n: `showDisplayTypeButton`, v: z2ui5_cl_util.boolean_abap_2_json(showdisplaytypebutton) }, { n: `showLegendButton`, v: z2ui5_cl_util.boolean_abap_2_json(showlegendbutton) }, { n: `showSettingButton`, v: z2ui5_cl_util.boolean_abap_2_json(showsettingbutton) }, { n: `showTimeZoomControl`, v: z2ui5_cl_util.boolean_abap_2_json(showtimezoomcontrol) }, { n: `stepCountOfSlider`, v: stepcountofslider }, { n: `zoomControlType`, v: zoomcontroltype }, { n: `zoomLevel`, v: zoomlevel }] });
    return result;
  }

  content({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `content` });
    return result;
  }

  content_left() {
    let result = null;
    result = this._generic({ name: `contentLeft` });
    return result;
  }

  content_middle() {
    let result = null;
    result = this._generic({ name: `contentMiddle` });
    return result;
  }

  content_right() {
    let result = null;
    result = this._generic({ name: `contentRight` });
    return result;
  }

  core_custom_data({ value, writetodom } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `CustomData`, ns: `core`, t_prop: [{ n: `value`, v: value }, { n: `key`, v: key }, { n: `writeToDom`, v: z2ui5_cl_util.boolean_abap_2_json(writetodom) }] });
    return result;
  }

  currency({ value, currency, usesymbol, maxprecision, stringvalue } = {}) {
    let result = null;
    result = this._generic({ name: `Currency`, ns: `u`, t_prop: [{ n: `value`, v: value }, { n: `currency`, v: currency }, { n: `useSymbol`, v: z2ui5_cl_util.boolean_abap_2_json(usesymbol) }, { n: `maxPrecision`, v: maxprecision }, { n: `stringValue`, v: stringvalue }] });
    return result;
  }

  custom_control() {
    let result = null;
    result = this._generic({ name: `customControl`, ns: `commons` });
    return result;
  }

  custom_data({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `customData`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  custom_header() {
    let result = null;
    result = this._generic({ name: `customHeader` });
    return result;
  }

  custom_layout({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `customLayout`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  custom_list_item() {
    let result = null;
    result = this._generic({ name: `CustomListItem` });
    return result;
  }

  data() {
    let result = null;
    result = this._generic({ name: `data`, ns: `mchart` });
    return result;
  }

  date_picker({ value, placeholder, displayformat, valueformat, required, valuestate, valuestatetext, enabled, showcurrentdatebutton, change, hideinput, showfooter, visible, showvaluestatemessage, mindate, maxdate, editable, width, id, calendarweeknumbering, displayformattype, class: class_, textdirection, textalign, name, datevalue, initialfocuseddatevalue } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DatePicker`, t_prop: [{ n: `value`, v: value }, { n: `displayFormat`, v: displayformat }, { n: `displayFormatType`, v: displayformattype }, { n: `valueFormat`, v: valueformat }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `placeholder`, v: placeholder }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `change`, v: change }, { n: `maxDate`, v: maxdate }, { n: `minDate`, v: mindate }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `dateValue`, v: datevalue }, { n: `name`, v: name }, { n: `class`, v: class_ }, { n: `calendarWeekNumbering`, v: calendarweeknumbering }, { n: `initialFocusedDateValue`, v: initialfocuseddatevalue }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `hideInput`, v: z2ui5_cl_util.boolean_abap_2_json(hideinput) }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `showCurrentDateButton`, v: z2ui5_cl_util.boolean_abap_2_json(showcurrentdatebutton) }] });
    return result;
  }

  date_time_picker({ value, placeholder, enabled, valuestate } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DateTimePicker`, t_prop: [{ n: `value`, v: value }, { n: `placeholder`, v: placeholder }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `valueState`, v: valuestate }] });
    return result;
  }

  delta_micro_chart({ color, press, size, height, width, deltadisplayvalue, displayvalue1, displayvalue2, title2, value1, value2, view, hideonnodata, title1 } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DeltaMicroChart`, ns: `mchart`, t_prop: [{ n: `color`, v: color }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `deltaDisplayValue`, v: deltadisplayvalue }, { n: `displayValue1`, v: displayvalue1 }, { n: `displayValue2`, v: displayvalue2 }, { n: `title2`, v: title2 }, { n: `value1`, v: value1 }, { n: `value2`, v: value2 }, { n: `view`, v: view }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `title1`, v: title1 }] });
    return result;
  }

  dependents({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `dependents`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  detail_box() {
    let result = null;
    result = this._generic({ name: `detailBox` });
    return result;
  }

  detail_pages() {
    let result = null;
    result = this._generic({ name: `detailPages` });
    return result;
  }

  dialog({ title, icon, showheader, stretch, contentheight, contentwidth, resizable, horizontalscrolling, verticalscrolling, afterclose, beforeopen, beforeclose, afteropen, draggable, closeonnavigation, escapehandler, titlealignment, state } = {}) {
    let result = null;
    result = this._generic({ name: `Dialog`, t_prop: [{ n: `title`, v: title }, { n: `icon`, v: icon }, { n: `stretch`, v: stretch }, { n: `state`, v: state }, { n: `titleAlignment`, v: titlealignment }, { n: `type`, v: type }, { n: `showHeader`, v: showheader }, { n: `contentWidth`, v: contentwidth }, { n: `contentHeight`, v: contentheight }, { n: `escapeHandler`, v: escapehandler }, { n: `closeOnNavigation`, v: z2ui5_cl_util.boolean_abap_2_json(closeonnavigation) }, { n: `draggable`, v: z2ui5_cl_util.boolean_abap_2_json(draggable) }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }, { n: `horizontalScrolling`, v: z2ui5_cl_util.boolean_abap_2_json(horizontalscrolling) }, { n: `verticalScrolling`, v: z2ui5_cl_util.boolean_abap_2_json(verticalscrolling) }, { n: `afterOpen`, v: afteropen }, { n: `beforeClose`, v: beforeclose }, { n: `beforeOpen`, v: beforeopen }, { n: `afterClose`, v: afterclose }] });
    return result;
  }

  draft_indicator({ id, class: class_, mindisplaytime, state, visible } = {}) {
    let result = null;
    result = this._generic({ name: `DraftIndicator`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `minDisplayTime`, v: mindisplaytime }, { n: `state`, v: state }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  drag_drop_info({ sourceaggregation, targetaggregation, dragstart, drop } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DragDropInfo`, ns: `dnd`, t_prop: [{ n: `sourceAggregation`, v: sourceaggregation }, { n: `targetAggregation`, v: targetaggregation }, { n: `dragStart`, v: dragstart }, { n: `drop`, v: drop }] });
    return result;
  }

  drag_info({ sourceaggregation } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DragInfo`, ns: `dnd`, t_prop: [{ n: `sourceAggregation`, v: sourceaggregation }] });
    return result;
  }

  drag_drop_config({ ns = `f` } = {}) {
    let result = null;
    result = this._generic({ name: `dragDropConfig`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  dynamic_page({ headerexpanded, showfooter, headerpinned, toggleheaderontitleclick, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `DynamicPage`, ns: `f`, t_prop: [{ n: `headerExpanded`, v: z2ui5_cl_util.boolean_abap_2_json(headerexpanded) }, { n: `headerPinned`, v: z2ui5_cl_util.boolean_abap_2_json(headerpinned) }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `toggleHeaderOnTitleClick`, v: toggleheaderontitleclick }, { n: `class`, v: class_ }] });
    return result;
  }

  dynamic_page_header({ pinnable } = {}) {
    let result = null;
    result = this._generic({ name: `DynamicPageHeader`, ns: `f`, t_prop: [{ n: `pinnable`, v: z2ui5_cl_util.boolean_abap_2_json(pinnable) }] });
    return result;
  }

  dynamic_page_title() {
    let result = null;
    result = this._generic({ name: `DynamicPageTitle`, ns: `f` });
    return result;
  }

  dynamic_side_content({ id, class: class_, sidecontentvisibility, showsidecontent, containerquery } = {}) {
    let result = null;
    result = this._generic({ name: `DynamicSideContent`, ns: `layout`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `sideContentVisibility`, v: sidecontentvisibility }, { n: `showSideContent`, v: showsidecontent }, { n: `containerQuery`, v: containerquery }] });
    return result;
  }

  element_attribute({ ns, label, value } = {}) {
    let result = null;
    result = this._generic({ name: `ElementAttribute`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */), t_prop: [{ n: `label`, v: label }, { n: `value`, v: value }] });
    return result;
  }

  embedded_control() {
    let result = null;
    result = this._generic({ name: `embeddedControl`, ns: `commons` });
    return result;
  }

  end_button() {
    let result = null;
    result = this._generic({ name: `endButton` });
    return result;
  }

  end_column_pages() {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  expandable_text({ id, emptyindicatormode, maxcharacters, overflowmode, renderwhitespace, text, textalign, textdirection, visible, wrappingtype, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ExpandableText`, t_prop: [{ n: `id`, v: id }, { n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `maxCharacters`, v: maxcharacters }, { n: `overflowMode`, v: overflowmode }, { n: `renderWhitespace`, v: z2ui5_cl_util.boolean_abap_2_json(renderwhitespace) }, { n: `text`, v: text }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `wrappingType`, v: wrappingtype }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `class`, v: class_ }] });
    return result;
  }

  expanded_content({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `expandedContent`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  expanded_heading() {
    let result = null;
    result = this._generic({ name: `expandedHeading`, ns: `uxap` });
    return result;
  }

  facet_filter({ id, class: class_, livesearch, showpersonalization, showpopoverokbutton, showreset, showsummarybar, visible, confirm, reset, lists } = {}) {
    let result = null;
    result = this._generic({ name: `FacetFilter`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `liveSearch`, v: z2ui5_cl_util.boolean_abap_2_json(livesearch) }, { n: `showPersonalization`, v: z2ui5_cl_util.boolean_abap_2_json(showpersonalization) }, { n: `showPopoverOKButton`, v: z2ui5_cl_util.boolean_abap_2_json(showpopoverokbutton) }, { n: `showReset`, v: z2ui5_cl_util.boolean_abap_2_json(showreset) }, { n: `showSummaryBar`, v: z2ui5_cl_util.boolean_abap_2_json(showsummarybar) }, { n: `type`, v: type }, { n: `confirm`, v: confirm }, { n: `reset`, v: reset }, { n: `lists`, v: lists }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  facet_filter_item({ id, class: class_, count, counter, highlight, highlighttext, navigated, selected, text, unread, visible, press, detailpress } = {}) {
    let result = null;
    result = this._generic({ name: `FacetFilterItem`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `count`, v: count }, { n: `counter`, v: counter }, { n: `highlight`, v: highlight }, { n: `highlightText`, v: highlighttext }, { n: `key`, v: key }, { n: `navigated`, v: z2ui5_cl_util.boolean_abap_2_json(navigated) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `unread`, v: z2ui5_cl_util.boolean_abap_2_json(unread) }, { n: `text`, v: text }, { n: `type`, v: type }, { n: `detailPress`, v: detailpress }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  facet_filter_list({ id, class: class_, active, allcount, backgrounddesign, datatype, enablebusyindicator, enablecaseinsensitivesearch, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, retainlistsequence, sequence, shownodata, showremovefaceticon, showseparators, showunread, sticky, swipedirection, title, visible, width, wordwrap, listclose, listopen, search, selectionchange, delete: delete_, items } = {}) {
    let result = null;
    result = this._generic({ name: `FacetFilterList`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `allCount`, v: allcount }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `dataType`, v: datatype }, { n: `enableBusyIndicator`, v: z2ui5_cl_util.boolean_abap_2_json(enablebusyindicator) }, { n: `enableCaseInsensitiveSearch`, v: z2ui5_cl_util.boolean_abap_2_json(enablecaseinsensitivesearch) }, { n: `footerText`, v: footertext }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `growingDirection`, v: growingdirection }, { n: `growingScrollToLoad`, v: z2ui5_cl_util.boolean_abap_2_json(growingscrolltoload) }, { n: `growingThreshold`, v: growingthreshold }, { n: `growingTriggerText`, v: growingtriggertext }, { n: `headerLevel`, v: headerlevel }, { n: `includeItemInSelection`, v: z2ui5_cl_util.boolean_abap_2_json(includeiteminselection) }, { n: `inset`, v: z2ui5_cl_util.boolean_abap_2_json(inset) }, { n: `key`, v: key }, { n: `swipeDirection`, v: swipedirection }, { n: `headerText`, v: headertext }, { n: `keyboardMode`, v: keyboardmode }, { n: `mode`, v: mode }, { n: `modeAnimationOn`, v: z2ui5_cl_util.boolean_abap_2_json(modeanimationon) }, { n: `multiSelectMode`, v: multiselectmode }, { n: `noDataText`, v: nodatatext }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }, { n: `retainListSequence`, v: z2ui5_cl_util.boolean_abap_2_json(retainlistsequence) }, { n: `sequence`, v: sequence }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `showRemoveFacetIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showremovefaceticon) }, { n: `showSeparators`, v: showseparators }, { n: `showUnread`, v: z2ui5_cl_util.boolean_abap_2_json(showunread) }, { n: `sticky`, v: sticky }, { n: `title`, v: title }, { n: `width`, v: width }, { n: `wordWrap`, v: z2ui5_cl_util.boolean_abap_2_json(wordwrap) }, { n: `listClose`, v: listclose }, { n: `listOpen`, v: listopen }, { n: `search`, v: search }, { n: `selectionChange`, v: selectionchange }, { n: `delete`, v: delete_ }, { n: `items`, v: items }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  static factory({ t_ns } = {}) {
    let result = null;
    result = new z2ui5_cl_xml_view();
    result.mt_prop = z2ui5_cl_util.abap_copy(t_ns);
    result.mt_prop = [...(result.mt_prop ?? []),{ n: `displayBlock`, v: `true` }, { n: `height`, v: `100%` }];
    result.mv_name = `View`;
    result.mv_ns = `mvc`;
    result.mo_root = z2ui5_cl_util.abap_copy(result);
    result.mo_parent = z2ui5_cl_util.abap_copy(result);
    result.mt_prop.push({ n: `xmlns`, v: `sap.m` });
    result.mt_prop.push({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` });
    result.mt_prop.push({ n: `xmlns:core`, v: `sap.ui.core` });
    return result;
  }

  static factory_plain() {
    let result = null;
    result = new z2ui5_cl_xml_view();
    result.mo_root = z2ui5_cl_util.abap_copy(result);
    result.mo_parent = z2ui5_cl_util.abap_copy(result);
    return result;
  }

  static factory_popup({ t_ns } = {}) {
    let result = null;
    result = new z2ui5_cl_xml_view();
    result.mt_prop = z2ui5_cl_util.abap_copy(t_ns);
    result.mv_name = `FragmentDefinition`;
    result.mv_ns = `core`;
    result.mo_root = z2ui5_cl_util.abap_copy(result);
    result.mo_parent = z2ui5_cl_util.abap_copy(result);
    result.mt_prop.push({ n: `xmlns`, v: `sap.m` });
    result.mt_prop.push({ n: `xmlns:core`, v: `sap.ui.core` });
    return result;
  }

  fb_control() {
    let result = null;
    result = this._generic({ name: `control`, ns: `fb` });
    return result;
  }

  feed_input({ buttontooltip, enabled, growing, growingmaxlines, icon, icondensityaware, icondisplayshape, iconinitials, iconsize, maxlength, placeholder, rows, showexceededtext, showicon, value, post, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `FeedInput`, t_prop: [{ n: `buttonTooltip`, v: buttontooltip }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `growingMaxLines`, v: growingmaxlines }, { n: `icon`, v: icon }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `iconDisplayShape`, v: icondisplayshape }, { n: `iconInitials`, v: iconinitials }, { n: `iconSize`, v: iconsize }, { n: `maxLength`, v: maxlength }, { n: `placeholder`, v: placeholder }, { n: `rows`, v: rows }, { n: `showExceededText`, v: z2ui5_cl_util.boolean_abap_2_json(showexceededtext) }, { n: `showIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showicon) }, { n: `value`, v: value }, { n: `class`, v: class_ }, { n: `post`, v: post }] });
    return result;
  }

  feed_list_item({ activeicon, convertedlinksdefaulttarget, convertlinkstoanchortags, icon, iconactive, icondensityaware, icondisplayshape, iconinitials, iconsize, info, lesslabel, maxcharacters, morelabel, sender, senderactive, showicon, text, timestamp, iconpress, senderpress } = {}) {
    let result = null;
    result = this._generic({ name: `FeedListItem`, t_prop: [{ n: `activeIcon`, v: activeicon }, { n: `convertedLinksDefaultTarget`, v: convertedlinksdefaulttarget }, { n: `convertLinksToAnchorTags`, v: convertlinkstoanchortags }, { n: `iconActive`, v: z2ui5_cl_util.boolean_abap_2_json(iconactive) }, { n: `icon`, v: icon }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `iconDisplayShape`, v: icondisplayshape }, { n: `iconInitials`, v: iconinitials }, { n: `iconSize`, v: iconsize }, { n: `info`, v: info }, { n: `lessLabel`, v: lesslabel }, { n: `maxCharacters`, v: maxcharacters }, { n: `moreLabel`, v: morelabel }, { n: `sender`, v: sender }, { n: `senderActive`, v: z2ui5_cl_util.boolean_abap_2_json(senderactive) }, { n: `showIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showicon) }, { n: `text`, v: text }, { n: `senderPress`, v: senderpress }, { n: `iconPress`, v: iconpress }, { n: `timestamp`, v: timestamp }] });
    return result;
  }

  feed_list_item_action({ enabled, icon, text, visible, press } = {}) {
    let result = null;
    result = this._generic({ name: `FeedListItemAction`, t_prop: [{ n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `icon`, v: icon }, { n: `key`, v: key }, { n: `text`, v: text }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  filter_bar({ usetoolbar = `false`, search, id, persistencykey, aftervariantload, aftervariantsave, assignedfilterschanged, beforevariantfetch, cancel, clear, filterchange, filtersdialogbeforeopen, filtersdialogcancel, filtersdialogclosed, initialise, initialized, reset, filtercontainerwidth, header, advancedmode, isrunninginvaluehelpdialog, showallfilters, showclearonfb, showfilterconfiguration, showgoonfb, showrestorebutton, showrestoreonfb, usesnapshot, searchenabled, considergrouptitle, deltavariantmode, disablesearchmatchespatternw, filterbarexpanded } = {}) {
    let result = null;
    result = this._generic({ name: `FilterBar`, ns: `fb`, t_prop: [{ n: `useToolbar`, v: z2ui5_cl_util.boolean_abap_2_json(usetoolbar) }, { n: `search`, v: search }, { n: `id`, v: id }, { n: `persistencyKey`, v: persistencykey }, { n: `afterVariantLoad`, v: aftervariantload }, { n: `afterVariantSave`, v: aftervariantsave }, { n: `assignedFiltersChanged`, v: assignedfilterschanged }, { n: `beforeVariantFetch`, v: beforevariantfetch }, { n: `cancel`, v: cancel }, { n: `clear`, v: clear }, { n: `filtersDialogBeforeOpen`, v: filtersdialogbeforeopen }, { n: `filtersDialogCancel`, v: filtersdialogcancel }, { n: `filtersDialogClosed`, v: filtersdialogclosed }, { n: `initialise`, v: initialise }, { n: `initialized`, v: initialized }, { n: `reset`, v: reset }, { n: `filterContainerWidth`, v: filtercontainerwidth }, { n: `header`, v: header }, { n: `advancedMode`, v: z2ui5_cl_util.boolean_abap_2_json(advancedmode) }, { n: `isRunningInValueHelpDialog`, v: z2ui5_cl_util.boolean_abap_2_json(isrunninginvaluehelpdialog) }, { n: `showAllFilters`, v: z2ui5_cl_util.boolean_abap_2_json(showallfilters) }, { n: `showClearOnFB`, v: z2ui5_cl_util.boolean_abap_2_json(showclearonfb) }, { n: `showFilterConfiguration`, v: z2ui5_cl_util.boolean_abap_2_json(showfilterconfiguration) }, { n: `showGoOnFB`, v: z2ui5_cl_util.boolean_abap_2_json(showgoonfb) }, { n: `showRestoreButton`, v: z2ui5_cl_util.boolean_abap_2_json(showrestorebutton) }, { n: `showRestoreOnFB`, v: z2ui5_cl_util.boolean_abap_2_json(showrestoreonfb) }, { n: `useSnapshot`, v: z2ui5_cl_util.boolean_abap_2_json(usesnapshot) }, { n: `searchEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(searchenabled) }, { n: `considerGroupTitle`, v: z2ui5_cl_util.boolean_abap_2_json(considergrouptitle) }, { n: `deltaVariantMode`, v: z2ui5_cl_util.boolean_abap_2_json(deltavariantmode) }, { n: `disableSearchMatchesPatternWarning`, v: z2ui5_cl_util.boolean_abap_2_json(disablesearchmatchespatternw) }, { n: `filterBarExpanded`, v: z2ui5_cl_util.boolean_abap_2_json(filterbarexpanded) }, { n: `filterChange`, v: filterchange }] });
    return result;
  }

  filter_control() {
    let result = null;
    result = this._generic({ name: `control`, ns: `fb` });
    return result;
  }

  filter_group_item({ name, label, groupname, visibleinfilterbar, mandatory, controltooltip, entitysetname, entitytypename, grouptitle, hiddenfilter, labeltooltip, visible, change } = {}) {
    let result = null;
    result = this._generic({ name: `FilterGroupItem`, ns: `fb`, t_prop: [{ n: `name`, v: name }, { n: `label`, v: label }, { n: `groupName`, v: groupname }, { n: `controlTooltip`, v: controltooltip }, { n: `entitySetName`, v: entitysetname }, { n: `entityTypeName`, v: entitytypename }, { n: `groupTitle`, v: grouptitle }, { n: `labelTooltip`, v: labeltooltip }, { n: `change`, v: change }, { n: `visibleInFilterBar`, v: z2ui5_cl_util.boolean_abap_2_json(visibleinfilterbar) }, { n: `mandatory`, v: z2ui5_cl_util.boolean_abap_2_json(mandatory) }, { n: `hiddenFilter`, v: z2ui5_cl_util.boolean_abap_2_json(hiddenfilter) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  filter_group_items() {
    let result = null;
    result = this._generic({ name: `filterGroupItems`, ns: `fb` });
    return result;
  }

  filter_items() {
    let result = null;
    result = this._generic({ name: `filterItems` });
    return result;
  }

  first_status() {
    let result = null;
    result = this._generic({ name: `firstStatus` });
    return result;
  }

  flexible_column_layout({ layout, id, backgrounddesign, defaulttransitionnamebegincol, defaulttransitionnameendcol, defaulttransitionnamemidcol, autofocus, restorefocusonbacknavigation, class: class_, afterbegincolumnnavigate, afterendcolumnnavigate, aftermidcolumnnavigate, begincolumnnavigate, columnresize, endcolumnnavigate, midcolumnnavigate, statechange } = {}) {
    let result = null;
    result = this._generic({ name: `FlexibleColumnLayout`, ns: `f`, t_prop: [{ n: `layout`, v: layout }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `afterBeginColumnNavigate`, v: afterbegincolumnnavigate }, { n: `afterEndColumnNavigate`, v: afterendcolumnnavigate }, { n: `afterMidColumnNavigate`, v: aftermidcolumnnavigate }, { n: `beginColumnNavigate`, v: begincolumnnavigate }, { n: `columnResize`, v: columnresize }, { n: `endColumnNavigate`, v: endcolumnnavigate }, { n: `midColumnNavigate`, v: midcolumnnavigate }, { n: `stateChange`, v: statechange }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `defaultTransitionNameBeginColumn`, v: defaulttransitionnamebegincol }, { n: `defaultTransitionNameEndColumn`, v: defaulttransitionnameendcol }, { n: `defaultTransitionNameMidColumn`, v: defaulttransitionnamemidcol }, { n: `autoFocus`, v: z2ui5_cl_util.boolean_abap_2_json(autofocus) }, { n: `restoreFocusOnBackNavigation`, v: z2ui5_cl_util.boolean_abap_2_json(restorefocusonbacknavigation) }] });
    return result;
  }

  flex_box({ class: class_, rendertype, width, fitcontainer, height, alignitems, justifycontent, wrap, visible, direction, displayinline, backgrounddesign, aligncontent, items, id } = {}) {
    let result = null;
    result = this._generic({ name: `FlexBox`, t_prop: [{ n: `class`, v: class_ }, { n: `id`, v: id }, { n: `renderType`, v: rendertype }, { n: `width`, v: width }, { n: `height`, v: height }, { n: `alignItems`, v: alignitems }, { n: `fitContainer`, v: z2ui5_cl_util.boolean_abap_2_json(fitcontainer) }, { n: `justifyContent`, v: justifycontent }, { n: `wrap`, v: wrap }, { n: `items`, v: items }, { n: `direction`, v: direction }, { n: `alignContent`, v: aligncontent }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `displayInline`, v: z2ui5_cl_util.boolean_abap_2_json(displayinline) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  flex_item_data({ growfactor, basesize, backgrounddesign, styleclass, order, shrinkfactor } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `FlexItemData`, t_prop: [{ n: `growFactor`, v: growfactor }, { n: `baseSize`, v: basesize }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `styleClass`, v: styleclass }, { n: `order`, v: order }, { n: `shrinkFactor`, v: shrinkfactor }] });
    return result;
  }

  footer({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `footer` });
    return result;
  }

  force_based_layout({ id, class: class_, alpha, charge, friction, maximumduration } = {}) {
    let result = null;
    result = this._generic({ name: `ForceBasedLayout`, ns: `nglayout`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `alpha`, v: alpha }, { n: `charge`, v: charge }, { n: `friction`, v: friction }, { n: `maximumDuration`, v: maximumduration }] });
    return result;
  }

  force_directed_layout({ id, class: class_, cooldownstep, initialtemperature, maxiterations, maxtime, optimaldistanceconstant, staticnodes } = {}) {
    let result = null;
    result = this._generic({ name: `ForceDirectedLayout`, ns: `nglayout`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `coolDownStep`, v: cooldownstep }, { n: `initialTemperature`, v: initialtemperature }, { n: `maxIterations`, v: maxiterations }, { n: `maxTime`, v: maxtime }, { n: `optimalDistanceConstant`, v: optimaldistanceconstant }, { n: `staticNodes`, v: staticnodes }] });
    return result;
  }

  formatted_text({ htmltext, convertedlinksdefaulttarget, convertlinkstoanchortags, height, textalign, textdirection, visible, width, id, class: class_, controls } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `FormattedText`, t_prop: [{ n: `htmlText`, v: htmltext }, { n: `convertedLinksDefaultTarget`, v: convertedlinksdefaulttarget }, { n: `convertLinksToAnchorTags`, v: convertlinkstoanchortags }, { n: `height`, v: height }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }, { n: `class`, v: class_ }, { n: `id`, v: id }, { n: `controls`, v: controls }] });
    return result;
  }

  form_toolbar() {
    let result = null;
    result = this._generic({ name: `toolbar`, ns: `form` });
    return result;
  }

  gantt_chart_container() {
    let result = null;
    result = this._generic({ name: `GanttChartContainer`, ns: `gantt` });
    return result;
  }

  gantt_chart_with_table({ id, shapeselectionmode, isconnectordetailsvisible } = {}) {
    let result = null;
    result = this._generic({ name: `GanttChartWithTable`, ns: `gantt`, t_prop: [{ n: `id`, v: id }, { n: `shapeSelectionMode`, v: shapeselectionmode }, { n: `isConnectorDetailsVisible`, v: z2ui5_cl_util.boolean_abap_2_json(isconnectordetailsvisible) }] });
    return result;
  }

  gantt_row_settings({ rowid, shapes1, relationships, shapes2 } = {}) {
    let result = null;
    result = this._generic({ name: `GanttRowSettings`, ns: `gantt`, t_prop: [{ n: `rowId`, v: rowid }, { n: `shapes1`, v: shapes1 }, { n: `shapes2`, v: shapes2 }, { n: `relationships`, v: relationships }] });
    return result;
  }

  gantt_table() {
    let result = null;
    result = this._generic({ name: `table`, ns: `gantt` });
    return result;
  }

  gantt_toolbar() {
    let result = null;
    result = this._generic({ name: `toolbar`, ns: `gantt` });
    return result;
  }

  generic_tag({ id, arialabelledby, text, design, status, class: class_, press, valuestate } = {}) {
    let result = null;
    result = this._generic({ name: `GenericTag`, t_prop: [{ n: `ariaLabelledBy`, v: arialabelledby }, { n: `class`, v: class_ }, { n: `design`, v: design }, { n: `status`, v: status }, { n: `id`, v: id }, { n: `press`, v: press }, { n: `text`, v: text }, { n: `valueState`, v: valuestate }] });
    return result;
  }

  generic_tile({ class: class_, id, header, mode, additionaltooltip, appshortcut, backgroundcolor, backgroundimage, dropareaoffset, press, frametype, failedtext, headerimage, scope, sizebehavior, state, systeminfo, tilebadge, tileicon, url, valuecolor, width, wrappingtype, imagedescription, navigationbuttontext, visible, renderonthemechange, enablenavigationbutton, pressenabled, iconloaded, subheader } = {}) {
    let result = null;
    result = this._generic({ name: `GenericTile`, ns: ``, t_prop: [{ n: `class`, v: class_ }, { n: `id`, v: id }, { n: `header`, v: header }, { n: `mode`, v: mode }, { n: `additionalTooltip`, v: additionaltooltip }, { n: `appShortcut`, v: appshortcut }, { n: `backgroundColor`, v: backgroundcolor }, { n: `backgroundImage`, v: backgroundimage }, { n: `dropAreaOffset`, v: dropareaoffset }, { n: `press`, v: press }, { n: `frameType`, v: frametype }, { n: `failedText`, v: failedtext }, { n: `headerImage`, v: headerimage }, { n: `scope`, v: scope }, { n: `sizeBehavior`, v: sizebehavior }, { n: `state`, v: state }, { n: `systemInfo`, v: systeminfo }, { n: `tileBadge`, v: tilebadge }, { n: `tileIcon`, v: tileicon }, { n: `url`, v: url }, { n: `valueColor`, v: valuecolor }, { n: `width`, v: width }, { n: `wrappingType`, v: wrappingtype }, { n: `imageDescription`, v: imagedescription }, { n: `navigationButtonText`, v: navigationbuttontext }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `renderOnThemeChange`, v: z2ui5_cl_util.boolean_abap_2_json(renderonthemechange) }, { n: `enableNavigationButton`, v: z2ui5_cl_util.boolean_abap_2_json(enablenavigationbutton) }, { n: `pressEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(pressenabled) }, { n: `iconLoaded`, v: z2ui5_cl_util.boolean_abap_2_json(iconloaded) }, { n: `subheader`, v: subheader }] });
    return result;
  }

  get({ name } = {}) {
    let result = null;
    if (!name) {
      result = z2ui5_cl_util.abap_copy(this.mo_root.mo_previous);
      return result;
    }
    if (this.mo_parent.mv_name === name) {
      result = z2ui5_cl_util.abap_copy(this.mo_parent);
    } else {
      result = this.mo_parent.get(name);
    }
    return result;
  }

  get_child({ index = 1 } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mt_child[(index) - 1]);
    return result;
  }

  get_parent() {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_parent);
    return result;
  }

  get_root() {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_root);
    return result;
  }

  grid({ class: class_, default_span, containerquery, hspacing, vspacing, width, content } = {}) {
    let result = null;
    result = this._generic({ name: `Grid`, ns: `layout`, t_prop: [{ n: `defaultSpan`, v: default_span }, { n: `class`, v: class_ }, { n: `containerQuery`, v: z2ui5_cl_util.boolean_abap_2_json(containerquery) }, { n: `hSpacing`, v: hspacing }, { n: `vSpacing`, v: vspacing }, { n: `width`, v: width }, { n: `content`, v: content }] });
    return result;
  }

  grid_box_layout({ boxesperrowconfig, boxminwidth, boxwidth } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `GridBoxLayout`, ns: `grid`, t_prop: [{ n: `boxesPerRowConfig`, v: boxesperrowconfig }, { n: `boxMinWidth`, v: boxminwidth }, { n: `boxWidth`, v: boxwidth }] });
    return result;
  }

  grid_data({ span, linebreak, indentl, indentm } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `GridData`, ns: `layout`, t_prop: [{ n: `span`, v: span }, { n: `linebreak`, v: z2ui5_cl_util.boolean_abap_2_json(linebreak) }, { n: `indentL`, v: indentl }, { n: `indentM`, v: indentm }] });
    return result;
  }

  grid_drop_info({ targetaggregation, dropposition, droplayout, drop, dragenter, dragover } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `GridDropInfo`, ns: `dnd-grid`, t_prop: [{ n: `targetAggregation`, v: targetaggregation }, { n: `dropPosition`, v: dropposition }, { n: `dropLayout`, v: droplayout }, { n: `drop`, v: drop }, { n: `dragEnter`, v: dragenter }, { n: `dragOver`, v: dragover }] });
    return result;
  }

  grid_list({ id, busy, busyindicatordelay, busyindicatorsize, enablebusyindicator, fieldgroupids, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, shownodata, showseparators, showunread, sticky, swipedirection, visible = true, width, items } = {}) {
    let result = null;
    result = this._generic({ name: `GridList`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `busy`, v: z2ui5_cl_util.boolean_abap_2_json(busy) }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `enableBusyIndicator`, v: z2ui5_cl_util.boolean_abap_2_json(enablebusyindicator) }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `footerText`, v: footertext }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `growingDirection`, v: growingdirection }, { n: `growingScrollToLoad`, v: z2ui5_cl_util.boolean_abap_2_json(growingscrolltoload) }, { n: `growingThreshold`, v: growingthreshold }, { n: `growingTriggerText`, v: growingtriggertext }, { n: `headerLevel`, v: headerlevel }, { n: `headerText`, v: headertext }, { n: `includeItemInSelection`, v: z2ui5_cl_util.boolean_abap_2_json(includeiteminselection) }, { n: `inset`, v: z2ui5_cl_util.boolean_abap_2_json(inset) }, { n: `keyboardMode`, v: keyboardmode }, { n: `mode`, v: mode }, { n: `modeAnimationOn`, v: modeanimationon }, { n: `multiSelectMode`, v: multiselectmode }, { n: `noDataText`, v: nodatatext }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `showSeparators`, v: showseparators }, { n: `showUnread`, v: z2ui5_cl_util.boolean_abap_2_json(showunread) }, { n: `sticky`, v: sticky }, { n: `swipeDirection`, v: swipedirection }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }, { n: `items`, v: items }] });
    return result;
  }

  grid_list_item({ busy, busyindicatordelay, busyindicatorsize, counter, fieldgroupids, highlight, highlighttext, navigated, selected, unread, visible = `true`, detailpress, detailtap, press, tap } = {}) {
    let result = null;
    result = this._generic({ name: `GridListItem`, ns: `f`, t_prop: [{ n: `busy`, v: busy }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `counter`, v: counter }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `highlight`, v: highlight }, { n: `highlightText`, v: highlighttext }, { n: `navigated`, v: navigated }, { n: `selected`, v: selected }, { n: `type`, v: type }, { n: `unread`, v: unread }, { n: `visible`, v: visible }, { n: `detailPress`, v: detailpress }, { n: `detailTap`, v: detailtap }, { n: `press`, v: press }, { n: `tap`, v: tap }] });
    return result;
  }

  group({ id, class: class_, collapsed, description, headercheckboxstate, icon, minwidth, parentgroupkey, status, title, visible, collapseexpand, headercheckboxpress, showdetail } = {}) {
    let result = null;
    result = this._generic({ name: `group`, ns: `networkgraph`, t_prop: [{ n: `collapsed`, v: z2ui5_cl_util.boolean_abap_2_json(collapsed) }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `description`, v: description }, { n: `headerCheckBoxState`, v: headercheckboxstate }, { n: `icon`, v: icon }, { n: `key`, v: key }, { n: `minWidth`, v: minwidth }, { n: `parentGroupKey`, v: parentgroupkey }, { n: `status`, v: status }, { n: `title`, v: title }, { n: `collapseExpand`, v: collapseexpand }, { n: `showDetail`, v: showdetail }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `headerCheckBoxPress`, v: headercheckboxpress }] });
    return result;
  }

  groups({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `groups`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */) });
    return result;
  }

  group_items() {
    let result = null;
    result = this._generic({ name: `groupItems` });
    return result;
  }

  harvey_ball_micro_chart({ colorpalette, press, size, height, width, total, totallabel, aligncontent, hideonnodata, formattedlabel, showfractions, showtotal, totalscale } = {}) {
    let result = null;
    result = this._generic({ name: `HarveyBallMicroChart`, ns: `mchart`, t_prop: [{ n: `colorPalette`, v: colorpalette }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `total`, v: total }, { n: `totalLabel`, v: totallabel }, { n: `alignContent`, v: aligncontent }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `formattedLabel`, v: z2ui5_cl_util.boolean_abap_2_json(formattedlabel) }, { n: `showFractions`, v: z2ui5_cl_util.boolean_abap_2_json(showfractions) }, { n: `showTotal`, v: z2ui5_cl_util.boolean_abap_2_json(showtotal) }, { n: `totalScale`, v: totalscale }] });
    return result;
  }

  hbox({ id, class: class_, justifycontent, aligncontent, alignitems, width, height, rendertype, wrap, backgrounddesign, direction, displayinline, fitcontainer, visible } = {}) {
    let result = null;
    result = this._generic({ name: `HBox`, t_prop: [{ n: `class`, v: class_ }, { n: `alignContent`, v: aligncontent }, { n: `alignItems`, v: alignitems }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `renderType`, v: rendertype }, { n: `height`, v: height }, { n: `wrap`, v: wrap }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `direction`, v: direction }, { n: `displayInline`, v: z2ui5_cl_util.boolean_abap_2_json(displayinline) }, { n: `fitContainer`, v: z2ui5_cl_util.boolean_abap_2_json(fitcontainer) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `justifyContent`, v: justifycontent }] });
    return result;
  }

  header({ ns = `f` } = {}) {
    let result = null;
    result = this._generic({ name: `header`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  header_container({ scrollstep, scrolltime, orientation, height } = {}) {
    let result = null;
    result = this._generic({ name: `HeaderContainer`, t_prop: [{ n: `scrollStep`, v: scrollstep }, { n: `scrollTime`, v: scrolltime }, { n: `orientation`, v: orientation }, { n: `height`, v: height }] });
    return result;
  }

  header_container_control({ backgrounddesign, gridlayout, height, orientation, scrollstep, scrollstepbyitem, scrolltime, showdividers, showoverflowitem, visible, width, id, scroll, snaptorow } = {}) {
    let result = null;
    result = this._generic({ name: `HeaderContainer`, t_prop: [{ n: `backgroundDesign`, v: backgrounddesign }, { n: `gridLayout`, v: z2ui5_cl_util.boolean_abap_2_json(gridlayout) }, { n: `height`, v: height }, { n: `orientation`, v: orientation }, { n: `scrollStep`, v: scrollstep }, { n: `scrollStepByItem`, v: scrollstepbyitem }, { n: `scrollTime`, v: scrolltime }, { n: `showDividers`, v: z2ui5_cl_util.boolean_abap_2_json(showdividers) }, { n: `showOverflowItem`, v: z2ui5_cl_util.boolean_abap_2_json(showoverflowitem) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `snapToRow`, v: z2ui5_cl_util.boolean_abap_2_json(snaptorow) }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `scroll`, v: scroll }] });
    return result;
  }

  header_content({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `headerContent`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  header_title() {
    let result = null;
    result = this._generic({ name: `headerTitle`, ns: `uxap` });
    return result;
  }

  header_toolbar() {
    let result = null;
    result = this._generic({ name: `headerToolbar` });
    return result;
  }

  heading({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `heading`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  horizontal_layout({ class: class_, visible, allowwrapping, id } = {}) {
    let result = null;
    result = this._generic({ name: `HorizontalLayout`, ns: `layout`, t_prop: [{ n: `class`, v: class_ }, { n: `allowWrapping`, v: z2ui5_cl_util.boolean_abap_2_json(allowwrapping) }, { n: `id`, v: id }, { n: `visible`, v: visible }] });
    return result;
  }

  html({ content, afterrendering, preferdom, sanitizecontent, visible, id } = {}) {
    let result = null;
    result = this._generic({ name: `HTML`, ns: `core`, t_prop: [{ n: `id`, v: id }, { n: `content`, v: content }, { n: `afterRendering`, v: afterrendering }, { n: `preferDOM`, v: z2ui5_cl_util.boolean_abap_2_json(preferdom) }, { n: `sanitizeContent`, v: z2ui5_cl_util.boolean_abap_2_json(sanitizecontent) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  html_area({ id, shape, coords, alt, target, href, onclick } = {}) {
    let result = null;
    result = this._generic({ name: `area`, ns: `html`, t_prop: [{ n: `id`, v: id }, { n: `shape`, v: shape }, { n: `coords`, v: coords }, { n: `alt`, v: alt }, { n: `target`, v: target }, { n: `href`, v: href }, { n: `onclick`, v: onclick }] });
    return result;
  }

  html_canvas({ id, width, height, style, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `canvas`, ns: `html`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `width`, v: width }, { n: `height`, v: height }, { n: `style`, v: style }] });
    return result;
  }

  html_map({ id, class: class_, name } = {}) {
    let result = null;
    result = this._generic({ name: `map`, ns: `html`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `name`, v: name }] });
    return result;
  }

  icon({ src, press, size, color, class: class_, id, width, useicontooltip, notabstop, hovercolor, hoverbackgroundcolor, height, decorative, backgroundcolor, alt, activecolor, activebackgroundcolor, visible } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Icon`, ns: `core`, t_prop: [{ n: `size`, v: size }, { n: `color`, v: color }, { n: `class`, v: class_ }, { n: `src`, v: src }, { n: `activeColor`, v: activecolor }, { n: `activeBackgroundColor`, v: activebackgroundcolor }, { n: `alt`, v: alt }, { n: `backgroundColor`, v: backgroundcolor }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `press`, v: press }, { n: `hoverBackgroundColor`, v: hoverbackgroundcolor }, { n: `hoverColor`, v: hovercolor }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `decorative`, v: z2ui5_cl_util.boolean_abap_2_json(decorative) }, { n: `noTabStop`, v: z2ui5_cl_util.boolean_abap_2_json(notabstop) }, { n: `useIconTooltip`, v: z2ui5_cl_util.boolean_abap_2_json(useicontooltip) }] });
    return result;
  }

  icon_tab_bar({ class: class_, select, expand, expandable, expanded, selectedkey, uppercase, tabsoverflowmode, tabdensitymode, stretchcontentheight, maxnestinglevel, headermode, headerbackgrounddesign, enabletabreordering, backgrounddesign, applycontentpadding, items, content, id } = {}) {
    let result = null;
    result = this._generic({ name: `IconTabBar`, t_prop: [{ n: `class`, v: class_ }, { n: `select`, v: select }, { n: `expand`, v: expand }, { n: `expandable`, v: z2ui5_cl_util.boolean_abap_2_json(expandable) }, { n: `expanded`, v: z2ui5_cl_util.boolean_abap_2_json(expanded) }, { n: `applyContentPadding`, v: z2ui5_cl_util.boolean_abap_2_json(applycontentpadding) }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `enableTabReordering`, v: z2ui5_cl_util.boolean_abap_2_json(enabletabreordering) }, { n: `headerBackgroundDesign`, v: headerbackgrounddesign }, { n: `stretchContentHeight`, v: z2ui5_cl_util.boolean_abap_2_json(stretchcontentheight) }, { n: `headerMode`, v: headermode }, { n: `maxNestingLevel`, v: maxnestinglevel }, { n: `tabDensityMode`, v: tabdensitymode }, { n: `tabsOverflowMode`, v: tabsoverflowmode }, { n: `items`, v: items }, { n: `id`, v: id }, { n: `content`, v: content }, { n: `upperCase`, v: z2ui5_cl_util.boolean_abap_2_json(uppercase) }, { n: `selectedKey`, v: selectedkey }] });
    return result;
  }

  icon_tab_filter({ items, showall, icon, iconcolor, count, text, design, icondensityaware, visible, textdirection, class: class_, id } = {}) {
    let result = null;
    result = this._generic({ name: `IconTabFilter`, t_prop: [{ n: `icon`, v: icon }, { n: `items`, v: items }, { n: `design`, v: design }, { n: `iconColor`, v: iconcolor }, { n: `showAll`, v: z2ui5_cl_util.boolean_abap_2_json(showall) }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `count`, v: count }, { n: `text`, v: text }, { n: `id`, v: id }, { n: `textDirection`, v: textdirection }, { n: `class`, v: class_ }, { n: `key`, v: key }] });
    return result;
  }

  icon_tab_header({ selectedkey, items, select, mode, ariatexts, backgrounddesign, enabletabreordering, maxnestinglevel, tabdensitymode, tabsoverflowmode, visible, id } = {}) {
    let result = null;
    result = this._generic({ name: `IconTabHeader`, t_prop: [{ n: `selectedKey`, v: selectedkey }, { n: `items`, v: items }, { n: `select`, v: select }, { n: `ariaTexts`, v: ariatexts }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `enableTabReordering`, v: z2ui5_cl_util.boolean_abap_2_json(enabletabreordering) }, { n: `maxNestingLevel`, v: maxnestinglevel }, { n: `tabDensityMode`, v: tabdensitymode }, { n: `tabsOverflowMode`, v: tabsoverflowmode }, { n: `id`, v: id }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `mode`, v: mode }] });
    return result;
  }

  icon_tab_separator({ icon, icondensityaware, visible, id, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `IconTabSeparator`, t_prop: [{ n: `icon`, v: icon }, { n: `iconDensityAware`, v: icondensityaware }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  illustrated_message({ enableverticalresponsiveness, enableformattedtext, illustrationtype, title, description, illustrationsize } = {}) {
    let result = null;
    result = this._generic({ name: `IllustratedMessage`, t_prop: [{ n: `enableVerticalResponsiveness`, v: enableverticalresponsiveness }, { n: `illustrationType`, v: illustrationtype }, { n: `enableFormattedText`, v: z2ui5_cl_util.boolean_abap_2_json(enableformattedtext) }, { n: `illustrationSize`, v: illustrationsize }, { n: `description`, v: description }, { n: `title`, v: title }] });
    return result;
  }

  image({ src, class: class_, height, width, usemap, mode, lazyloading, densityaware, decorative, backgroundsize, backgroundrepeat, backgroundposition, ariahaspopup, alt, activesrc, press, load, error, id } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Image`, t_prop: [{ n: `id`, v: id }, { n: `src`, v: src }, { n: `class`, v: class_ }, { n: `height`, v: height }, { n: `alt`, v: alt }, { n: `activeSrc`, v: activesrc }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `backgroundPosition`, v: backgroundposition }, { n: `backgroundRepeat`, v: backgroundrepeat }, { n: `backgroundSize`, v: backgroundsize }, { n: `mode`, v: mode }, { n: `useMap`, v: usemap }, { n: `width`, v: width }, { n: `error`, v: error }, { n: `press`, v: press }, { n: `load`, v: load }, { n: `decorative`, v: z2ui5_cl_util.boolean_abap_2_json(decorative) }, { n: `densityAware`, v: z2ui5_cl_util.boolean_abap_2_json(densityaware) }, { n: `lazyLoading`, v: z2ui5_cl_util.boolean_abap_2_json(lazyloading) }] });
    return result;
  }

  image_content({ src, description, visible, class: class_, press } = {}) {
    let result = null;
    result = this._generic({ name: `ImageContent`, t_prop: [{ n: `src`, v: src }, { n: `description`, v: description }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `class`, v: class_ }, { n: `press`, v: press }] });
    return result;
  }

  info_label({ id, text, rendermode, colorscheme, icon, displayonly, textdirection, width, visible, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `InfoLabel`, ns: `tnt`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `text`, v: text }, { n: `renderMode `, v: rendermode }, { n: `colorScheme`, v: colorscheme }, { n: `displayOnly`, v: z2ui5_cl_util.boolean_abap_2_json(displayonly) }, { n: `icon`, v: icon }, { n: `textDirection`, v: textdirection }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }] });
    return result;
  }

  input({ id, value, placeholder, showclearicon, valuestate, valuestatetext, showtablesuggestionvaluehelp, description, editable, enabled, suggestionitems, suggestionrows, showsuggestion, showvaluehelp, valuehelprequest, required, suggest, class: class_, visible, submit, valueliveupdate, autocomplete, maxsuggestionwidth, fieldwidth, valuehelponly, width, change, valuehelpiconsrc, textformatter, textformatmode, maxlength, startsuggestion, enablesuggestionshighlighting, enabletableautopopinmode, arialabelledby, ariadescribedby, name, textalign, textdirection, showvaluestatemessage } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Input`, t_prop: [{ n: `id`, v: id }, { n: `placeholder`, v: placeholder }, { n: `type`, v: type }, { n: `maxLength`, v: maxlength }, { n: `showClearIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showclearicon) }, { n: `description`, v: description }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `enableTableAutoPopinMode`, v: z2ui5_cl_util.boolean_abap_2_json(enabletableautopopinmode) }, { n: `enableSuggestionsHighlighting`, v: z2ui5_cl_util.boolean_abap_2_json(enablesuggestionshighlighting) }, { n: `showTableSuggestionValueHelp`, v: z2ui5_cl_util.boolean_abap_2_json(showtablesuggestionvaluehelp) }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `value`, v: value }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `suggest`, v: suggest }, { n: `suggestionItems`, v: suggestionitems }, { n: `suggestionRows`, v: suggestionrows }, { n: `showSuggestion`, v: z2ui5_cl_util.boolean_abap_2_json(showsuggestion) }, { n: `valueHelpRequest`, v: valuehelprequest }, { n: `autocomplete`, v: z2ui5_cl_util.boolean_abap_2_json(autocomplete) }, { n: `valueLiveUpdate`, v: z2ui5_cl_util.boolean_abap_2_json(valueliveupdate) }, { n: `submit`, v: z2ui5_cl_util.boolean_abap_2_json(submit) }, { n: `showValueHelp`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluehelp) }, { n: `valueHelpOnly`, v: z2ui5_cl_util.boolean_abap_2_json(valuehelponly) }, { n: `class`, v: class_ }, { n: `change`, v: change }, { n: `maxSuggestionWidth`, v: maxsuggestionwidth }, { n: `width`, v: width }, { n: `textFormatter`, v: textformatter }, { n: `startSuggestion`, v: startsuggestion }, { n: `valueHelpIconSrc`, v: valuehelpiconsrc }, { n: `textFormatMode`, v: textformatmode }, { n: `fieldWidth`, v: fieldwidth }, { n: `ariaLabelledBy`, v: arialabelledby }, { n: `ariaDescribedBy`, v: ariadescribedby }, { n: `name`, v: name }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }] });
    return result;
  }

  input_list_item({ label } = {}) {
    let result = null;
    result = this._generic({ name: `InputListItem`, t_prop: [{ n: `label`, v: label }] });
    return result;
  }

  interact_bar_chart({ selectionchanged, selectionenabled, press, labelwidth, errormessage, errormessagetitle, showerror, displayedbars, bars, max, min } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveBarChart`, ns: `mchart`, t_prop: [{ n: `selectionChanged`, v: selectionchanged }, { n: `selectionEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(selectionenabled) }, { n: `showError`, v: z2ui5_cl_util.boolean_abap_2_json(showerror) }, { n: `press`, v: press }, { n: `labelWidth`, v: labelwidth }, { n: `bars`, v: bars }, { n: `errorMessageTitle`, v: errormessagetitle }, { n: `displayedBars`, v: displayedbars }, { n: `min`, v: min }, { n: `max`, v: max }, { n: `errorMessage`, v: errormessage }] });
    return result;
  }

  interact_bar_chart_bar({ label, value, displayedvalue, selected, color } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveBarChartBar`, ns: `mchart`, t_prop: [{ n: `label`, v: label }, { n: `displayedValue`, v: displayedvalue }, { n: `value`, v: value }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `color`, v: color }] });
    return result;
  }

  interact_donut_chart({ selectionchanged, errormessage, errormessagetitle, showerror, displayedsegments, press, segments, selectionenabled } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveDonutChart`, ns: `mchart`, t_prop: [{ n: `selectionChanged`, v: selectionchanged }, { n: `selectionEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(selectionenabled) }, { n: `showError`, v: z2ui5_cl_util.boolean_abap_2_json(showerror) }, { n: `errorMessageTitle`, v: errormessagetitle }, { n: `errorMessage`, v: errormessage }, { n: `displayedSegments`, v: displayedsegments }, { n: `segments`, v: segments }, { n: `press`, v: press }] });
    return result;
  }

  interact_donut_chart_segment({ label, value, displayedvalue, selected, color } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveDonutChartSegment`, ns: `mchart`, t_prop: [{ n: `label`, v: label }, { n: `displayedValue`, v: displayedvalue }, { n: `value`, v: value }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `color`, v: color }] });
    return result;
  }

  interact_line_chart({ selectionchanged, press, precedingpoint, succeedingpoint, errormessage, errormessagetitle, showerror, displayedpoints, selectionenabled, points } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveLineChart`, ns: `mchart`, t_prop: [{ n: `selectionChanged`, v: selectionchanged }, { n: `showError`, v: z2ui5_cl_util.boolean_abap_2_json(showerror) }, { n: `press`, v: press }, { n: `errorMessageTitle`, v: errormessagetitle }, { n: `errorMessage`, v: errormessage }, { n: `precedingPoint`, v: precedingpoint }, { n: `points`, v: points }, { n: `succeedingPoint`, v: succeedingpoint }, { n: `displayedPoints`, v: displayedpoints }, { n: `selectionEnabled`, v: selectionenabled }] });
    return result;
  }

  interact_line_chart_point({ label, value, secondarylabel, displayedvalue, selected } = {}) {
    let result = null;
    result = this._generic({ name: `InteractiveLineChartPoint`, ns: `mchart`, t_prop: [{ n: `label`, v: label }, { n: `secondaryLabel`, v: secondarylabel }, { n: `value`, v: value }, { n: `displayedValue`, v: displayedvalue }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }] });
    return result;
  }

  intermediary() {
    let result = null;
    result = this._generic({ name: `intermediary`, ns: `commons` });
    return result;
  }

  interval_headers() {
    let result = null;
    result = this._generic({ name: `intervalHeaders` });
    return result;
  }

  item({ text } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Item`, ns: `core`, t_prop: [{ n: `key`, v: key }, { n: `text`, v: text }] });
    return result;
  }

  items({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `items`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  label({ text, labelfor, design, displayonly, required, showcolon, textalign, textdirection, valign, width, wrapping, wrappingtype, id, class: class_, visible } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Label`, t_prop: [{ n: `text`, v: text }, { n: `displayOnly`, v: z2ui5_cl_util.boolean_abap_2_json(displayonly) }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `showColon`, v: z2ui5_cl_util.boolean_abap_2_json(showcolon) }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `vAlign`, v: valign }, { n: `width`, v: width }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `wrappingType`, v: wrappingtype }, { n: `design`, v: design }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `labelFor`, v: labelfor }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  lanes() {
    let result = null;
    result = this._generic({ name: `lanes`, ns: `commons` });
    return result;
  }

  layered_layout({ id, class: class_, linespacingfactor, mergeedges, nodeplacement, nodespacing } = {}) {
    let result = null;
    result = this._generic({ name: `LayeredLayout`, ns: `nglayout`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `lineSpacingFactor`, v: linespacingfactor }, { n: `nodePlacement`, v: nodeplacement }, { n: `nodeSpacing`, v: nodespacing }, { n: `mergeEdges`, v: z2ui5_cl_util.boolean_abap_2_json(mergeedges) }] });
    return result;
  }

  layout_algorithm() {
    let result = null;
    result = this._generic({ name: `layoutAlgorithm`, ns: `networkgraph` });
    return result;
  }

  layout_data({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `layoutData` });
    return result;
  }

  legend({ id, items, caption } = {}) {
    let result = null;
    result = this._generic({ name: `Legend`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `caption`, v: caption }, { n: `items`, v: items }] });
    return result;
  }

  legenditem({ id, text, color } = {}) {
    let result = null;
    result = this._generic({ name: `LegendItem`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `text`, v: text }, { n: `color`, v: color }] });
    return result;
  }

  legend_area() {
    let result = null;
    result = this._generic({ name: `legend`, ns: `vbm` });
    return result;
  }

  library_shape({ id, class: class_, animationonchange, definition, fillcolor, fillingangle, fillingdirection, fillingtype, height, horizontalalignment, shapeid, strokecolor, strokewidth, verticalalignment, visible, width, x, y, aftershapeloaded } = {}) {
    let result = null;
    result = this._generic({ name: `LibraryShape`, ns: `si`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `animationOnChange`, v: z2ui5_cl_util.boolean_abap_2_json(animationonchange) }, { n: `definition`, v: definition }, { n: `fillColor`, v: fillcolor }, { n: `fillingAngle`, v: fillingangle }, { n: `fillingDirection`, v: fillingdirection }, { n: `fillingType`, v: fillingtype }, { n: `height`, v: height }, { n: `horizontalAlignment`, v: horizontalalignment }, { n: `shapeId`, v: shapeid }, { n: `strokeColor`, v: strokecolor }, { n: `strokeWidth`, v: strokewidth }, { n: `verticalAlignment`, v: verticalalignment }, { n: `width`, v: width }, { n: `x`, v: x }, { n: `y`, v: y }, { n: `afterShapeLoaded`, v: aftershapeloaded }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  light_box({ id, class: class_, visible } = {}) {
    let result = null;
    result = this._generic({ name: `LightBox`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  light_box_item({ alt, imagesrc, subtitle, title } = {}) {
    let result = null;
    result = this._generic({ name: `LightBoxItem`, t_prop: [{ n: `alt`, v: alt }, { n: `imageSrc`, v: imagesrc }, { n: `subtitle`, v: subtitle }, { n: `title`, v: title }] });
    return result;
  }

  line({ id, class: class_, arroworientation, arrowposition, description, from, linetype, selected, status, stretchtocenter, title, visible, press, hover } = {}) {
    let result = null;
    result = this._generic({ name: `Line`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `arrowOrientation`, v: arroworientation }, { n: `arrowPosition`, v: arrowposition }, { n: `description`, v: description }, { n: `from`, v: from }, { n: `lineType`, v: linetype }, { n: `status`, v: status }, { n: `title`, v: title }, { n: `to`, v: to }, { n: `hover`, v: hover }, { n: `press`, v: press }, { n: `stretchToCenter`, v: z2ui5_cl_util.boolean_abap_2_json(stretchtocenter) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  lines({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `lines`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */) });
    return result;
  }

  line_micro_chart({ color, height, leftbottomlabel, lefttoplabel, maxxvalue, minxvalue, minyvalue, rightbottomlabel, righttoplabel, size, threshold, thresholddisplayvalue, width, press, hideonnodata, showbottomlabels, showpoints, showthresholdline, showthresholdvalue, showtoplabels, maxyvalue } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `LineMicroChart`, ns: `mchart`, t_prop: [{ n: `color`, v: color }, { n: `height`, v: height }, { n: `leftBottomLabel`, v: leftbottomlabel }, { n: `leftTopLabel`, v: lefttoplabel }, { n: `maxXValue`, v: maxxvalue }, { n: `minXValue`, v: minxvalue }, { n: `minYValue`, v: minyvalue }, { n: `rightBottomLabel`, v: rightbottomlabel }, { n: `rightTopLabel`, v: righttoplabel }, { n: `size`, v: size }, { n: `threshold`, v: threshold }, { n: `thresholdDisplayValue`, v: thresholddisplayvalue }, { n: `width`, v: width }, { n: `press`, v: press }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `showBottomLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showbottomlabels) }, { n: `showPoints`, v: z2ui5_cl_util.boolean_abap_2_json(showpoints) }, { n: `showThresholdLine`, v: z2ui5_cl_util.boolean_abap_2_json(showthresholdline) }, { n: `showThresholdValue`, v: z2ui5_cl_util.boolean_abap_2_json(showthresholdvalue) }, { n: `showTopLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showtoplabels) }, { n: `maxYValue`, v: maxyvalue }] });
    return result;
  }

  line_micro_chart_empszd_point({ x, y, color, show } = {}) {
    let result = null;
    result = this._generic({ name: `LineMicroChartEmphasizedPoint`, ns: `mchart`, t_prop: [{ n: `x`, v: x }, { n: `y`, v: y }, { n: `color`, v: color }, { n: `show`, v: z2ui5_cl_util.boolean_abap_2_json(show) }] });
    return result;
  }

  line_micro_chart_line({ points, color } = {}) {
    let result = null;
    result = this._generic({ name: `LineMicroChartLine`, ns: `mchart`, t_prop: [{ n: `points`, v: points }, { n: `color`, v: color }, { n: `type`, v: type }] });
    return result;
  }

  line_micro_chart_point({ x, y } = {}) {
    let result = null;
    result = this._generic({ name: `LineMicroChartPoint`, ns: `mchart`, t_prop: [{ n: `x`, v: x }, { n: `y`, v: y }] });
    return result;
  }

  link({ text, href, target, enabled, press, id, ns, wrapping, width, validateurl, textdirection, textalign, subtle, rel, emptyindicatormode, emphasized, ariahaspopup, accessiblerole, class: class_, endicon, icon } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Link`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `text`, v: text }, { n: `target`, v: target }, { n: `href`, v: href }, { n: `press`, v: press }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `accessibleRole`, v: accessiblerole }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `rel`, v: rel }, { n: `subtle`, v: z2ui5_cl_util.boolean_abap_2_json(subtle) }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `validateUrl`, v: z2ui5_cl_util.boolean_abap_2_json(validateurl) }, { n: `width`, v: width }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `emphasized`, v: z2ui5_cl_util.boolean_abap_2_json(emphasized) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `endIcon`, v: endicon }, { n: `icon`, v: icon }] });
    return result;
  }

  link_tile_content({ linkhref, linktext, iconsrc, linkpress } = {}) {
    let result = null;
    result = this._generic({ name: `LinkTileContent`, t_prop: [{ n: `iconSrc`, v: iconsrc }, { n: `linkHref`, v: linkhref }, { n: `linkText`, v: linktext }, { n: `linkPress`, v: linkpress }] });
    return result;
  }

  list({ headertext, items, mode, selectionchange, showseparators, footertext, growingdirection, growingthreshold, growingtriggertext, headerlevel, multiselectmode, nodatatext, sticky, modeanimationon, growingscrolltoload, includeiteminselection, growing, inset, backgrounddesign, rememberselections, showunread, visible, nodata, id, itempress, select, delete: delete_, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `List`, t_prop: [{ n: `headerText`, v: headertext }, { n: `items`, v: items }, { n: `mode`, v: mode }, { n: `class`, v: class_ }, { n: `itemPress`, v: itempress }, { n: `select`, v: select }, { n: `selectionChange`, v: selectionchange }, { n: `showSeparators`, v: showseparators }, { n: `footerText`, v: footertext }, { n: `growingDirection`, v: growingdirection }, { n: `growingThreshold`, v: growingthreshold }, { n: `growingTriggerText`, v: growingtriggertext }, { n: `headerLevel`, v: headerlevel }, { n: `multiSelectMode`, v: multiselectmode }, { n: `noDataText`, v: nodatatext }, { n: `id`, v: id }, { n: `sticky`, v: sticky }, { n: `delete`, v: delete_ }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `modeAnimationOn`, v: z2ui5_cl_util.boolean_abap_2_json(modeanimationon) }, { n: `growingScrollToLoad`, v: z2ui5_cl_util.boolean_abap_2_json(growingscrolltoload) }, { n: `includeItemInSelection`, v: z2ui5_cl_util.boolean_abap_2_json(includeiteminselection) }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `inset`, v: z2ui5_cl_util.boolean_abap_2_json(inset) }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }, { n: `showUnread`, v: z2ui5_cl_util.boolean_abap_2_json(showunread) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `noData`, v: nodata }] });
    return result;
  }

  list_item({ text, additionaltext, icon, enabled, textdirection } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ListItem`, ns: `core`, t_prop: [{ n: `text`, v: text }, { n: `icon`, v: icon }, { n: `key`, v: key }, { n: `textDirection`, v: textdirection }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `additionalText`, v: additionaltext }] });
    return result;
  }

  main_content() {
    let result = null;
    result = this._generic({ name: `mainContent`, ns: `f` });
    return result;
  }

  main_contents() {
    let result = null;
    result = this._generic({ name: `mainContents`, ns: `tnt` });
    return result;
  }

  map_container({ id, autoadjustheight, showhome } = {}) {
    let result = null;
    result = this._generic({ name: `MapContainer`, ns: `vk`, t_prop: [{ n: `id`, v: id }, { n: `autoAdjustHeight`, v: z2ui5_cl_util.boolean_abap_2_json(autoadjustheight) }, { n: `showHome`, v: z2ui5_cl_util.boolean_abap_2_json(showhome) }] });
    return result;
  }

  markers({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `markers`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  markers_as_status() {
    let result = null;
    result = this._generic({ name: `markersAsStatus`, ns: `upload` });
    return result;
  }

  mask_input({ placeholder, mask, name, textalign, textdirection, value, width, valuestate, valuestatetext, placeholdersymbol, required, showclearicon, showvaluestatemessage, visible, fieldwidth, livechange, change } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `MaskInput`, t_prop: [{ n: `placeholder`, v: placeholder }, { n: `mask`, v: mask }, { n: `name`, v: name }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `value`, v: value }, { n: `width`, v: width }, { n: `liveChange`, v: livechange }, { n: `change`, v: change }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `placeholderSymbol`, v: placeholdersymbol }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `showClearIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showclearicon) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `fieldWidth`, v: fieldwidth }] });
    return result;
  }

  mask_input_rule({ maskformatsymbol, regex } = {}) {
    let result = null;
    result = this._generic({ name: `MaskInputRule`, t_prop: [{ n: `maskFormatSymbol`, v: maskformatsymbol }, { n: `regex`, v: regex }] });
    return result;
  }

  master_pages() {
    let result = null;
    result = this._generic({ name: `masterPages` });
    return result;
  }

  menu_button({ text, activeicon, buttonmode, enabled, defaultaction } = {}) {
    let result = null;
    result = this._generic({ name: `MenuButton`, t_prop: [{ n: `buttonMode`, v: buttonmode }, { n: `defaultAction`, v: defaultaction }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `activeIcon`, v: activeicon }, { n: `type`, v: type }] });
    return result;
  }

  menu_item({ press, text, icon } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `MenuItem`, t_prop: [{ n: `press`, v: press }, { n: `text`, v: text }, { n: `icon`, v: icon }] });
    return result;
  }

  message_item({ title, subtitle, description, groupname, markupdescription, textdirection, longtexturl, counter, activetitle } = {}) {
    let result = null;
    result = this._generic({ name: `MessageItem`, t_prop: [{ n: `type`, v: type }, { n: `title`, v: title }, { n: `subtitle`, v: subtitle }, { n: `description`, v: description }, { n: `longtextUrl`, v: longtexturl }, { n: `textDirection`, v: textdirection }, { n: `groupName`, v: groupname }, { n: `activeTitle`, v: z2ui5_cl_util.boolean_abap_2_json(activetitle) }, { n: `counter`, v: counter }, { n: `markupDescription`, v: z2ui5_cl_util.boolean_abap_2_json(markupdescription) }] });
    return result;
  }

  message_page({ show_header, text, enableformattedtext, description, icon } = {}) {
    let result = null;
    result = this._generic({ name: `MessagePage`, t_prop: [{ n: `showHeader`, v: z2ui5_cl_util.boolean_abap_2_json(show_header) }, { n: `description`, v: description }, { n: `icon`, v: icon }, { n: `text`, v: text }, { n: `enableFormattedText`, v: z2ui5_cl_util.boolean_abap_2_json(enableformattedtext) }] });
    return result;
  }

  message_popover({ items, groupitems, listselect, activetitlepress, placement, afterclose, beforeclose, initiallyexpanded } = {}) {
    let result = null;
    result = this._generic({ name: `MessagePopover`, t_prop: [{ n: `items`, v: items }, { n: `activeTitlePress`, v: activetitlepress }, { n: `placement`, v: placement }, { n: `listSelect`, v: listselect }, { n: `afterClose`, v: afterclose }, { n: `beforeClose`, v: beforeclose }, { n: `initiallyExpanded`, v: z2ui5_cl_util.boolean_abap_2_json(initiallyexpanded) }, { n: `groupItems`, v: z2ui5_cl_util.boolean_abap_2_json(groupitems) }] });
    return result;
  }

  message_strip({ text, showicon, customicon, class: class_, visible, showclosebutton, enableformattedtext } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `MessageStrip`, t_prop: [{ n: `text`, v: text }, { n: `type`, v: type }, { n: `showIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showicon) }, { n: `customIcon`, v: customicon }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `showCloseButton`, v: z2ui5_cl_util.boolean_abap_2_json(showclosebutton) }, { n: `class`, v: class_ }, { n: `enableFormattedText`, v: z2ui5_cl_util.boolean_abap_2_json(enableformattedtext) }] });
    return result;
  }

  message_view({ items, groupitems } = {}) {
    let result = null;
    result = this._generic({ name: `MessageView`, t_prop: [{ n: `items`, v: items }, { n: `groupItems`, v: z2ui5_cl_util.boolean_abap_2_json(groupitems) }] });
    return result;
  }

  micro_process_flow({ id, class: class_, arialabel, width, rendertype } = {}) {
    let result = null;
    result = this._generic({ name: `MicroProcessFlow`, ns: `commons`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `renderType`, v: rendertype }, { n: `width`, v: width }, { n: `ariaLabel`, v: arialabel }] });
    return result;
  }

  micro_process_flow_item({ id, class: class_, icon, showintermediary, showseparator, state, stepwidth, title, press } = {}) {
    let result = null;
    result = this._generic({ name: `MicroProcessFlowItem`, ns: `commons`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `press`, v: press }, { n: `title`, v: title }, { n: `stepWidth`, v: stepwidth }, { n: `state`, v: state }, { n: `key`, v: key }, { n: `icon`, v: icon }, { n: `showSeparator`, v: z2ui5_cl_util.boolean_abap_2_json(showseparator) }, { n: `showIntermediary`, v: z2ui5_cl_util.boolean_abap_2_json(showintermediary) }] });
    return result;
  }

  mid_column_pages({ id } = {}) {
    let result = null;
    result = this._generic({ name: `midColumnPages`, ns: `f`, t_prop: [{ n: `id`, v: id }] });
    return result;
  }

  multi_combobox({ selectionchange, selectedkeys, selecteditems, items, selectionfinish, width, showclearicon, showsecondaryvalues, placeholder, selecteditemid, selectedkey, name, value, valuestate, valuestatetext, textalign, visible, showvaluestatemessage, showbutton, required, editable, enabled, filtersecondaryvalues, showselectall, id, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `MultiComboBox`, t_prop: [{ n: `selectionChange`, v: selectionchange }, { n: `selectedKeys`, v: selectedkeys }, { n: `selectedItems`, v: selecteditems }, { n: `items`, v: items }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `selectionFinish`, v: selectionfinish }, { n: `width`, v: width }, { n: `showSecondaryValues`, v: z2ui5_cl_util.boolean_abap_2_json(showsecondaryvalues) }, { n: `placeholder`, v: placeholder }, { n: `selectedItemId`, v: selecteditemid }, { n: `selectedKey`, v: selectedkey }, { n: `name`, v: name }, { n: `value`, v: value }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `textAlign`, v: textalign }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `showClearIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showclearicon) }, { n: `showButton`, v: z2ui5_cl_util.boolean_abap_2_json(showbutton) }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `filterSecondaryValues`, v: z2ui5_cl_util.boolean_abap_2_json(filtersecondaryvalues) }, { n: `showSelectAll`, v: showselectall }] });
    return result;
  }

  multi_input({ showclearicon, showvaluehelp, valuehelponly, name, suggestionitems, tokenupdate, width, id, value, tokens, submit, valuehelprequest, enabled, class: class_, change, required, valuestate, valuestatetext, placeholder, showsuggestion, visible } = {}) {
    let result = null;
    result = this._generic({ name: `MultiInput`, t_prop: [{ n: `tokens`, v: tokens }, { n: `showClearIcon`, v: z2ui5_cl_util.boolean_abap_2_json(showclearicon) }, { n: `name`, v: name }, { n: `valueHelpOnly`, v: z2ui5_cl_util.boolean_abap_2_json(valuehelponly) }, { n: `showValueHelp`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluehelp) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `suggestionItems`, v: suggestionitems }, { n: `tokenUpdate`, v: tokenupdate }, { n: `submit`, v: submit }, { n: `width`, v: width }, { n: `value`, v: value }, { n: `id`, v: id }, { n: `change`, v: change }, { n: `valueHelpRequest`, v: valuehelprequest }, { n: `class`, v: class_ }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `required`, v: required }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `placeholder`, v: placeholder }, { n: `showSuggestion`, v: z2ui5_cl_util.boolean_abap_2_json(showsuggestion) }] });
    return result;
  }

  navigation_actions() {
    let result = null;
    result = this._generic({ name: `navigationActions`, ns: `f` });
    return result;
  }

  nav_container({ initialpage, id, defaulttransitionname, autofocus, height, width, visible } = {}) {
    let result = null;
    result = this._generic({ name: `NavContainer`, t_prop: [{ n: `initialPage`, v: initialpage }, { n: `id`, v: id }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `autoFocus`, v: z2ui5_cl_util.boolean_abap_2_json(autofocus) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `defaultTransitionName`, v: defaulttransitionname }] });
    return result;
  }

  network_graph({ id, class: class_, layout, height, width, nodes, lines, groups, backgroundcolor, backgroundimage, nodatatext, orientation, rendertype, enablewheelzoom, enablezoom, nodata, visible, afterlayouting, beforelayouting, failure, graphready, search, searchsuggest, selectionchange, zoomchanged } = {}) {
    let result = null;
    result = this._generic({ name: `Graph`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `layout`, v: layout }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `nodes`, v: nodes }, { n: `lines`, v: lines }, { n: `groups`, v: groups }, { n: `backgroundColor`, v: backgroundcolor }, { n: `backgroundImage`, v: backgroundimage }, { n: `noDataText`, v: nodatatext }, { n: `orientation`, v: orientation }, { n: `renderType`, v: rendertype }, { n: `afterLayouting`, v: afterlayouting }, { n: `beforeLayouting`, v: beforelayouting }, { n: `failure`, v: failure }, { n: `graphReady`, v: graphready }, { n: `search`, v: search }, { n: `searchSuggest`, v: searchsuggest }, { n: `selectionChange`, v: selectionchange }, { n: `zoomChanged`, v: zoomchanged }, { n: `enableWheelZoom`, v: z2ui5_cl_util.boolean_abap_2_json(enablewheelzoom) }, { n: `enableZoom`, v: z2ui5_cl_util.boolean_abap_2_json(enablezoom) }, { n: `noData`, v: z2ui5_cl_util.boolean_abap_2_json(nodata) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  node({ id, class: class_, alttext, collapsed, corenodesize, description, descriptionlinesize, group, headercheckboxstate, height, title, icon, iconsize, maxwidth, selected, shape, showactionlinksbutton, showdetailbutton, showexpandbutton, statusicon, titlelinesize, visible, width, x, y, collapseexpand, headercheckboxpress, hover, press, attributes, actionbuttons } = {}) {
    let result = null;
    result = this._generic({ name: `Node`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `altText`, v: alttext }, { n: `coreNodeSize`, v: corenodesize }, { n: `description`, v: description }, { n: `descriptionLineSize`, v: descriptionlinesize }, { n: `group`, v: group }, { n: `headerCheckBoxState`, v: headercheckboxstate }, { n: `height`, v: height }, { n: `icon`, v: icon }, { n: `iconSize`, v: iconsize }, { n: `key`, v: key }, { n: `maxWidth`, v: maxwidth }, { n: `title`, v: title }, { n: `shape`, v: shape }, { n: `statusIcon`, v: statusicon }, { n: `titleLineSize`, v: titlelinesize }, { n: `width`, v: width }, { n: `x`, v: x }, { n: `y`, v: y }, { n: `attributes`, v: attributes }, { n: `actionButtons`, v: actionbuttons }, { n: `collapseExpand`, v: collapseexpand }, { n: `headerCheckBoxPress`, v: headercheckboxpress }, { n: `hover`, v: hover }, { n: `press`, v: press }, { n: `collapsed`, v: z2ui5_cl_util.boolean_abap_2_json(collapsed) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `showActionLinksButton`, v: z2ui5_cl_util.boolean_abap_2_json(showactionlinksbutton) }, { n: `showDetailButton`, v: z2ui5_cl_util.boolean_abap_2_json(showdetailbutton) }, { n: `showExpandButton`, v: z2ui5_cl_util.boolean_abap_2_json(showexpandbutton) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  nodes({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `nodes`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  node_image({ id, class: class_, height, src, width } = {}) {
    let result = null;
    result = this._generic({ name: `NodeImage`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `src`, v: src }] });
    return result;
  }

  noop_layout() {
    let result = null;
    result = this._generic({ name: `NoopLayout`, ns: `nglayout` });
    return result;
  }

  notification_list({ id, class: class_, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, shownodata, showseparators, showunread, sticky, swipedirection, visible, width, beforeopencontextmenu, delete: delete_, growingfinished, growingstarted, itempress, select, selectionchange, swipe, updatefinished, updatestarted } = {}) {
    let result = null;
    result = this._generic({ name: `NotificationList`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `footerText`, v: footertext }, { n: `growingDirection`, v: growingdirection }, { n: `growingThreshold`, v: growingthreshold }, { n: `growingTriggerText`, v: growingtriggertext }, { n: `headerLevel`, v: headerlevel }, { n: `headerText`, v: headertext }, { n: `keyboardMode`, v: keyboardmode }, { n: `mode`, v: mode }, { n: `multiSelectMode`, v: multiselectmode }, { n: `noDataText`, v: nodatatext }, { n: `sticky`, v: sticky }, { n: `swipeDirection`, v: swipedirection }, { n: `width`, v: width }, { n: `showSeparators`, v: showseparators }, { n: `beforeOpenContextMenu`, v: beforeopencontextmenu }, { n: `delete`, v: delete_ }, { n: `growingFinished`, v: growingfinished }, { n: `growingStarted`, v: growingstarted }, { n: `itemPress`, v: itempress }, { n: `select`, v: select }, { n: `selectionChange`, v: selectionchange }, { n: `swipe`, v: swipe }, { n: `updateFinished`, v: updatefinished }, { n: `updateStarted`, v: updatestarted }, { n: `growingScrollToLoad`, v: z2ui5_cl_util.boolean_abap_2_json(growingscrolltoload) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `includeItemInSelection`, v: z2ui5_cl_util.boolean_abap_2_json(includeiteminselection) }, { n: `inset`, v: z2ui5_cl_util.boolean_abap_2_json(inset) }, { n: `modeAnimationOn`, v: z2ui5_cl_util.boolean_abap_2_json(modeanimationon) }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `showUnread`, v: z2ui5_cl_util.boolean_abap_2_json(showunread) }] });
    return result;
  }

  notification_list_group({ id, autopriority, collapsed, enablecollapsebuttonwhenempty, highlight, highlighttext, navigated, priority, selected, showbuttons, showclosebutton, showemptygroup, showitemscounter, title, unread, visible, class: class_, oncollapse } = {}) {
    let result = null;
    result = this._generic({ name: `NotificationListGroup`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `highlight`, v: highlight }, { n: `highlightText`, v: highlighttext }, { n: `priority`, v: priority }, { n: `title`, v: title }, { n: `type`, v: type }, { n: `onCollapse`, v: oncollapse }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `autoPriority`, v: z2ui5_cl_util.boolean_abap_2_json(autopriority) }, { n: `collapsed`, v: z2ui5_cl_util.boolean_abap_2_json(collapsed) }, { n: `enableCollapseButtonWhenEmpty`, v: z2ui5_cl_util.boolean_abap_2_json(enablecollapsebuttonwhenempty) }, { n: `navigated`, v: z2ui5_cl_util.boolean_abap_2_json(navigated) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `showButtons`, v: z2ui5_cl_util.boolean_abap_2_json(showbuttons) }, { n: `showCloseButton`, v: z2ui5_cl_util.boolean_abap_2_json(showclosebutton) }, { n: `showEmptyGroup`, v: z2ui5_cl_util.boolean_abap_2_json(showemptygroup) }, { n: `showItemsCounter`, v: z2ui5_cl_util.boolean_abap_2_json(showitemscounter) }, { n: `unread`, v: z2ui5_cl_util.boolean_abap_2_json(unread) }] });
    return result;
  }

  notification_list_item({ id, visible, class: class_, authoravatarcolor, authorinitials, description, hideshowmorebutton, truncate, authorname, authorpicture, counter, datetime, highlight, highlighttext, navigated, priority, selected, showbuttons, showclosebutton, title, unread, close, detailpress, press } = {}) {
    let result = null;
    result = this._generic({ name: `NotificationListItem`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `authorAvatarColor`, v: authoravatarcolor }, { n: `authorInitials`, v: authorinitials }, { n: `description`, v: description }, { n: `authorName`, v: authorname }, { n: `authorPicture`, v: authorpicture }, { n: `datetime`, v: datetime }, { n: `counter`, v: counter }, { n: `highlightText`, v: highlighttext }, { n: `priority`, v: priority }, { n: `title`, v: title }, { n: `type`, v: type }, { n: `close`, v: close }, { n: `detailPress`, v: detailpress }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `hideShowMoreButton`, v: z2ui5_cl_util.boolean_abap_2_json(hideshowmorebutton) }, { n: `truncate`, v: z2ui5_cl_util.boolean_abap_2_json(truncate) }, { n: `highlight`, v: z2ui5_cl_util.boolean_abap_2_json(highlight) }, { n: `navigated`, v: z2ui5_cl_util.boolean_abap_2_json(navigated) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `showButtons`, v: z2ui5_cl_util.boolean_abap_2_json(showbuttons) }, { n: `showCloseButton`, v: z2ui5_cl_util.boolean_abap_2_json(showclosebutton) }, { n: `unread`, v: z2ui5_cl_util.boolean_abap_2_json(unread) }] });
    return result;
  }

  no_data({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `noData`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  numeric_content({ value, icon, withmargin, adaptivefontsize, animatetextchange, formattervalue, icondescription, indicator, nullifyvalue, scale, state, truncatevalueto, valuecolor, visible, width, class: class_, press } = {}) {
    let result = null;
    result = this._generic({ name: `NumericContent`, t_prop: [{ n: `value`, v: value }, { n: `icon`, v: icon }, { n: `width`, v: width }, { n: `valueColor`, v: valuecolor }, { n: `truncateValueTo`, v: truncatevalueto }, { n: `state`, v: state }, { n: `scale`, v: scale }, { n: `indicator`, v: indicator }, { n: `iconDescription`, v: icondescription }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `nullifyValue`, v: z2ui5_cl_util.boolean_abap_2_json(nullifyvalue) }, { n: `formatterValue`, v: z2ui5_cl_util.boolean_abap_2_json(formattervalue) }, { n: `animateTextChange`, v: z2ui5_cl_util.boolean_abap_2_json(animatetextchange) }, { n: `adaptiveFontSize`, v: z2ui5_cl_util.boolean_abap_2_json(adaptivefontsize) }, { n: `withMargin`, v: z2ui5_cl_util.boolean_abap_2_json(withmargin) }, { n: `class`, v: class_ }, { n: `press`, v: press }] });
    return result;
  }

  numeric_header({ id, class: class_, visible, datatimestamp, press, details, detailsmaxlines, detailsstate, iconalt, iconbackgroundcolor, icondisplayshape, iconinitials, iconsize, iconsrc, iconvisible, number, numbersize, numbervisible, scale, sideindicatorsalignment, state, statustext, statusvisible, subtitle, subtitlemaxlines, title, titlemaxlines, trend, unitofmeasurement } = {}) {
    let result = null;
    result = this._generic({ name: `NumericHeader`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `dataTimestamp`, v: datatimestamp }, { n: `press`, v: press }, { n: `details`, v: details }, { n: `detailsMaxLines`, v: detailsmaxlines }, { n: `detailsState`, v: detailsstate }, { n: `iconAlt`, v: iconalt }, { n: `iconBackgroundColor`, v: iconbackgroundcolor }, { n: `iconDisplayShape`, v: icondisplayshape }, { n: `iconSize`, v: iconsize }, { n: `iconSrc`, v: iconsrc }, { n: `iconInitials`, v: iconinitials }, { n: `number`, v: number }, { n: `numberSize`, v: numbersize }, { n: `scale`, v: scale }, { n: `sideIndicatorsAlignment`, v: sideindicatorsalignment }, { n: `state`, v: state }, { n: `statusText`, v: statustext }, { n: `subtitle`, v: subtitle }, { n: `subtitleMaxLines`, v: subtitlemaxlines }, { n: `title`, v: title }, { n: `titleMaxLines`, v: titlemaxlines }, { n: `trend`, v: trend }, { n: `unitOfMeasurement`, v: unitofmeasurement }, { n: `statusVisible`, v: z2ui5_cl_util.boolean_abap_2_json(statusvisible) }, { n: `numberVisible`, v: z2ui5_cl_util.boolean_abap_2_json(numbervisible) }, { n: `iconVisible`, v: z2ui5_cl_util.boolean_abap_2_json(iconvisible) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  numeric_side_indicator({ id, class: class_, visible, number, state, title, unit } = {}) {
    let result = null;
    result = this._generic({ name: `NumericSideIndicator`, ns: `f`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `unit`, v: unit }, { n: `title`, v: title }, { n: `state`, v: state }, { n: `number`, v: number }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  object_attribute({ title, text, active, ariahaspopup, textdirection, visible, press } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ObjectAttribute`, t_prop: [{ n: `title`, v: title }, { n: `textDirection`, v: textdirection }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `press`, v: press }, { n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `text`, v: text }] });
    return result;
  }

  object_header({ backgrounddesign, condensed, fullscreenoptimized, icon, iconactive, iconalt, icondensityaware, icontooltip, imageshape, intro, introactive, introhref, introtarget, introtextdirection, number, numberstate, numbertextdirection, numberunit, responsive, showtitleselector, title, titleactive, titlehref, titlelevel, titleselectortooltip, titletarget, titletextdirection, iconpress, intropress, titlepress, titleselectorpress, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectHeader`, t_prop: [{ n: `backgroundDesign`, v: backgrounddesign }, { n: `condensed`, v: z2ui5_cl_util.boolean_abap_2_json(condensed) }, { n: `fullScreenOptimized`, v: z2ui5_cl_util.boolean_abap_2_json(fullscreenoptimized) }, { n: `icon`, v: icon }, { n: `iconActive`, v: z2ui5_cl_util.boolean_abap_2_json(iconactive) }, { n: `iconAlt`, v: iconalt }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `iconTooltip`, v: icontooltip }, { n: `imageShape`, v: imageshape }, { n: `intro`, v: intro }, { n: `introActive`, v: z2ui5_cl_util.boolean_abap_2_json(introactive) }, { n: `introHref`, v: introhref }, { n: `introTarget`, v: introtarget }, { n: `introTextDirection`, v: introtextdirection }, { n: `number`, v: number }, { n: `numberState`, v: numberstate }, { n: `numberTextDirection`, v: numbertextdirection }, { n: `numberUnit`, v: numberunit }, { n: `responsive`, v: z2ui5_cl_util.boolean_abap_2_json(responsive) }, { n: `showTitleSelector`, v: z2ui5_cl_util.boolean_abap_2_json(showtitleselector) }, { n: `title`, v: title }, { n: `titleActive`, v: z2ui5_cl_util.boolean_abap_2_json(titleactive) }, { n: `titleHref`, v: titlehref }, { n: `titleLevel`, v: titlelevel }, { n: `titleSelectorTooltip`, v: titleselectortooltip }, { n: `titleTarget`, v: titletarget }, { n: `titleTextDirection`, v: titletextdirection }, { n: `iconPress`, v: iconpress }, { n: `introPress`, v: intropress }, { n: `titlePress`, v: titlepress }, { n: `titleSelectorPress`, v: titleselectorpress }, { n: `class`, v: class_ }] });
    return result;
  }

  object_identifier({ emptyindicatormode, text, textdirection, title, titleactive, visible, titlepress } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectIdentifier`, t_prop: [{ n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `title`, v: title }, { n: `titleActive`, v: titleactive }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `titlePress`, v: titlepress }] });
    return result;
  }

  object_list_item({ activeicon, icon, icondensityaware, intro, introtextdirection, number, numberstate, numbertextdirection, numberunit, title, titletextdirection, press, selected } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectListItem`, t_prop: [{ n: `activeIcon`, v: activeicon }, { n: `icon`, v: icon }, { n: `intro`, v: intro }, { n: `introTextDirection`, v: introtextdirection }, { n: `number`, v: number }, { n: `numberState`, v: numberstate }, { n: `numberTextDirection`, v: numbertextdirection }, { n: `numberUnit`, v: numberunit }, { n: `title`, v: title }, { n: `titleTextDirection`, v: titletextdirection }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `press`, v: press }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `type`, v: type }] });
    return result;
  }

  object_marker({ additionalinfo, visibility, visible, press } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectMarker`, t_prop: [{ n: `additionalInfo`, v: additionalinfo }, { n: `type`, v: type }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `press`, v: press }, { n: `visibility`, v: visibility }] });
    return result;
  }

  object_number({ state, emphasized, number, textdirection, textalign, numberunit, inverted, emptyindicatormode, active, unit, visible, class: class_, id } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ObjectNumber`, t_prop: [{ n: `emphasized`, v: z2ui5_cl_util.boolean_abap_2_json(emphasized) }, { n: `number`, v: number }, { n: `state`, v: state }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `numberUnit`, v: numberunit }, { n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `inverted`, v: z2ui5_cl_util.boolean_abap_2_json(inverted) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `unit`, v: unit }] });
    return result;
  }

  object_page_dyn_header_title() {
    let result = null;
    result = this._generic({ name: `ObjectPageDynamicHeaderTitle`, ns: `uxap` });
    return result;
  }

  object_page_header({ isactionareaalwaysvisible, isobjecticonalwaysvisible, isobjectsubtitlealwaysvisible, isobjecttitlealwaysvisible, markchanges, markfavorite, markflagged, marklocked, objectimagealt, objectimagebackgroundcolor, objectimagedensityaware, objectimageshape, objectimageuri, objectsubtitle, objecttitle, showmarkers, showplaceholder, showtitleselector, visible, markchangespress, marklockedpress, titleselectorpress } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ObjectPageHeader`, ns: `uxap`, t_prop: [{ n: `isActionAreaAlwaysVisible`, v: z2ui5_cl_util.boolean_abap_2_json(isactionareaalwaysvisible) }, { n: `isObjectIconAlwaysVisible`, v: z2ui5_cl_util.boolean_abap_2_json(isobjecticonalwaysvisible) }, { n: `isObjectSubtitleAlwaysVisible`, v: z2ui5_cl_util.boolean_abap_2_json(isobjectsubtitlealwaysvisible) }, { n: `isObjectTitleAlwaysVisible`, v: z2ui5_cl_util.boolean_abap_2_json(isobjecttitlealwaysvisible) }, { n: `markChanges`, v: z2ui5_cl_util.boolean_abap_2_json(markchanges) }, { n: `markFavorite`, v: z2ui5_cl_util.boolean_abap_2_json(markfavorite) }, { n: `markFlagged`, v: z2ui5_cl_util.boolean_abap_2_json(markflagged) }, { n: `markLocked`, v: z2ui5_cl_util.boolean_abap_2_json(marklocked) }, { n: `objectImageDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(objectimagedensityaware) }, { n: `showMarkers`, v: z2ui5_cl_util.boolean_abap_2_json(showmarkers) }, { n: `showPlaceholder`, v: z2ui5_cl_util.boolean_abap_2_json(showplaceholder) }, { n: `showTitleSelector`, v: z2ui5_cl_util.boolean_abap_2_json(showtitleselector) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `objectImageAlt`, v: objectimagealt }, { n: `objectImageBackgroundColor`, v: objectimagebackgroundcolor }, { n: `objectImageURI`, v: objectimageuri }, { n: `objectSubtitle`, v: objectsubtitle }, { n: `objectTitle`, v: objecttitle }, { n: `markChangesPress`, v: markchangespress }, { n: `markLockedPress`, v: marklockedpress }, { n: `titleSelectorPress`, v: titleselectorpress }, { n: `objectImageShape`, v: objectimageshape }] });
    return result;
  }

  object_page_header_action_btn({ activeicon, ariahaspopup, enabled, hideicon, hidetext, icon, icondensityaware, iconfirst, importance, text, textdirection, visible, width, press } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ObjectPageHeaderActionButton`, ns: `uxap`, t_prop: [{ n: `activeIcon`, v: activeicon }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `icon`, v: icon }, { n: `importance`, v: importance }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `type`, v: type }, { n: `width`, v: width }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `hideIcon`, v: z2ui5_cl_util.boolean_abap_2_json(hideicon) }, { n: `hideText`, v: z2ui5_cl_util.boolean_abap_2_json(hidetext) }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `iconFirst`, v: z2ui5_cl_util.boolean_abap_2_json(iconfirst) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `press`, v: press }] });
    return result;
  }

  object_page_layout({ showtitleinheadercontent, showeditheaderbutton, editheaderbuttonpress, uppercaseanchorbar, showfooter, alwaysshowcontentheader, enablelazyloading, flexenabled, headercontentpinnable, headercontentpinned, ischildpage, preserveheaderstateonscroll, showanchorbar, showanchorbarpopover, showheadercontent, showonlyhighimportance, subsectionlayout, toggleheaderontitleclick, useicontabbar, usetwocolumnsforlargescreen, visible, backgrounddesignanchorbar, height, sectiontitlelevel, beforenavigate, headercontentpinnedstatechange, navigate, sectionchange, subsectionvisibilitychange, toggleanchorbar, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectPageLayout`, ns: `uxap`, t_prop: [{ n: `showTitleInHeaderContent`, v: z2ui5_cl_util.boolean_abap_2_json(showtitleinheadercontent) }, { n: `showEditHeaderButton`, v: z2ui5_cl_util.boolean_abap_2_json(showeditheaderbutton) }, { n: `alwaysShowContentHeader`, v: z2ui5_cl_util.boolean_abap_2_json(alwaysshowcontentheader) }, { n: `enableLazyLoading`, v: z2ui5_cl_util.boolean_abap_2_json(enablelazyloading) }, { n: `flexEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(flexenabled) }, { n: `headerContentPinnable`, v: z2ui5_cl_util.boolean_abap_2_json(headercontentpinnable) }, { n: `headerContentPinned`, v: z2ui5_cl_util.boolean_abap_2_json(headercontentpinned) }, { n: `isChildPage`, v: z2ui5_cl_util.boolean_abap_2_json(ischildpage) }, { n: `preserveHeaderStateOnScroll`, v: z2ui5_cl_util.boolean_abap_2_json(preserveheaderstateonscroll) }, { n: `showAnchorBar`, v: z2ui5_cl_util.boolean_abap_2_json(showanchorbar) }, { n: `showAnchorBarPopover`, v: z2ui5_cl_util.boolean_abap_2_json(showanchorbarpopover) }, { n: `showHeaderContent`, v: z2ui5_cl_util.boolean_abap_2_json(showheadercontent) }, { n: `showOnlyHighImportance`, v: z2ui5_cl_util.boolean_abap_2_json(showonlyhighimportance) }, { n: `subSectionLayout`, v: subsectionlayout }, { n: `toggleHeaderOnTitleClick`, v: z2ui5_cl_util.boolean_abap_2_json(toggleheaderontitleclick) }, { n: `useIconTabBar`, v: z2ui5_cl_util.boolean_abap_2_json(useicontabbar) }, { n: `useTwoColumnsForLargeScreen`, v: z2ui5_cl_util.boolean_abap_2_json(usetwocolumnsforlargescreen) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `backgroundDesignAnchorBar`, v: backgrounddesignanchorbar }, { n: `height`, v: height }, { n: `sectionTitleLevel`, v: sectiontitlelevel }, { n: `editHeaderButtonPress`, v: editheaderbuttonpress }, { n: `upperCaseAnchorBar`, v: z2ui5_cl_util.boolean_abap_2_json(uppercaseanchorbar) }, { n: `beforeNavigate`, v: beforenavigate }, { n: `headerContentPinnedStateChange`, v: headercontentpinnedstatechange }, { n: `navigate`, v: navigate }, { n: `sectionChange`, v: sectionchange }, { n: `subSectionVisibilityChange`, v: subsectionvisibilitychange }, { n: `toggleAnchorBar`, v: toggleanchorbar }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `class`, v: class_ }] });
    return result;
  }

  object_page_section({ titleuppercase, title, importance, id, titlelevel, showtitle, visible, wraptitle, anchorbarbuttoncolor, titlevisible } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectPageSection`, ns: `uxap`, t_prop: [{ n: `titleUppercase`, v: z2ui5_cl_util.boolean_abap_2_json(titleuppercase) }, { n: `title`, v: title }, { n: `id`, v: id }, { n: `anchorBarButtonColor`, v: anchorbarbuttoncolor }, { n: `titleLevel`, v: titlelevel }, { n: `titleVisible`, v: z2ui5_cl_util.boolean_abap_2_json(titlevisible) }, { n: `showTitle`, v: z2ui5_cl_util.boolean_abap_2_json(showtitle) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `wrapTitle`, v: z2ui5_cl_util.boolean_abap_2_json(wraptitle) }, { n: `importance`, v: importance }] });
    return result;
  }

  object_page_sub_section({ id, title, mode, importance, titlelevel, showtitle, titleuppercase, visible, titlevisible } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectPageSubSection`, ns: `uxap`, t_prop: [{ n: `id`, v: id }, { n: `mode`, v: mode }, { n: `importance`, v: importance }, { n: `titleLevel`, v: titlelevel }, { n: `titleVisible`, v: z2ui5_cl_util.boolean_abap_2_json(titlevisible) }, { n: `showTitle`, v: z2ui5_cl_util.boolean_abap_2_json(showtitle) }, { n: `titleUppercase`, v: z2ui5_cl_util.boolean_abap_2_json(titleuppercase) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `title`, v: title }] });
    return result;
  }

  object_status({ active, emptyindicatormode, icon, icondensityaware, inverted, state, stateannouncementtext, text, textdirection, title, press, visible, id, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `ObjectStatus`, t_prop: [{ n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `icon`, v: icon }, { n: `iconDensityAware`, v: z2ui5_cl_util.boolean_abap_2_json(icondensityaware) }, { n: `inverted`, v: z2ui5_cl_util.boolean_abap_2_json(inverted) }, { n: `state`, v: state }, { n: `stateAnnouncementText`, v: stateannouncementtext }, { n: `text`, v: text }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `textDirection`, v: textdirection }, { n: `title`, v: title }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `press`, v: press }] });
    return result;
  }

  overflow_toolbar({ press, text, active, visible, asyncmode, enabled, design, style, width, height, class: class_, id } = {}) {
    let result = null;
    result = this._generic({ name: `OverflowToolbar`, t_prop: [{ n: `press`, v: press }, { n: `text`, v: text }, { n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `asyncMode`, v: z2ui5_cl_util.boolean_abap_2_json(asyncmode) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `design`, v: design }, { n: `type`, v: type }, { n: `style`, v: style }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `width`, v: width }, { n: `height`, v: height }] });
    return result;
  }

  overflow_toolbar_button({ id, text, icon, enabled, press, tooltip } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `OverflowToolbarButton`, t_prop: [{ n: `id`, v: id }, { n: `press`, v: press }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  overflow_toolbar_menu_button({ text, icon, buttonmode, enabled, tooltip, defaultaction } = {}) {
    let result = null;
    result = this._generic({ name: `OverflowToolbarMenuButton`, t_prop: [{ n: `buttonMode`, v: buttonmode }, { n: `defaultAction`, v: defaultaction }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  overflow_toolbar_toggle_button({ text, icon, enabled, press, tooltip } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `OverflowToolbarToggleButton`, t_prop: [{ n: `press`, v: press }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  page({ title, navbuttonpress, shownavbutton, showheader, id, class: class_, ns, backgrounddesign, contentonlybusy, enablescrolling, navbuttontooltip, floatingfooter, showfooter, showsubheader, titlealignment, titlelevel } = {}) {
    let result = null;
    result = this._generic({ name: `Page`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `title`, v: title }, { n: `showNavButton`, v: z2ui5_cl_util.boolean_abap_2_json(shownavbutton) }, { n: `navButtonPress`, v: navbuttonpress }, { n: `showHeader`, v: z2ui5_cl_util.boolean_abap_2_json(showheader) }, { n: `class`, v: class_ }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `navButtonTooltip`, v: navbuttontooltip }, { n: `titleAlignment`, v: titlealignment }, { n: `titleLevel`, v: titlelevel }, { n: `contentOnlyBusy`, v: z2ui5_cl_util.boolean_abap_2_json(contentonlybusy) }, { n: `enableScrolling`, v: z2ui5_cl_util.boolean_abap_2_json(enablescrolling) }, { n: `floatingFooter`, v: z2ui5_cl_util.boolean_abap_2_json(floatingfooter) }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `showSubHeader`, v: z2ui5_cl_util.boolean_abap_2_json(showsubheader) }, { n: `id`, v: id }] });
    return result;
  }

  pages() {
    let result = null;
    result = this._generic({ name: `pages` });
    return result;
  }

  paging_button({ count, nextbuttontooltip, previousbuttontooltip, position } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `PagingButton`, t_prop: [{ n: `count`, v: count }, { n: `nextButtonTooltip`, v: nextbuttontooltip }, { n: `position`, v: position }, { n: `previousButtonTooltip`, v: previousbuttontooltip }] });
    return result;
  }

  panel({ expandable, expanded, headertext, stickyheader, height, class: class_, id, width, backgrounddesign, expandanimation, visible, expand } = {}) {
    let result = null;
    result = this._generic({ name: `Panel`, t_prop: [{ n: `expandable`, v: z2ui5_cl_util.boolean_abap_2_json(expandable) }, { n: `expanded`, v: z2ui5_cl_util.boolean_abap_2_json(expanded) }, { n: `stickyHeader`, v: z2ui5_cl_util.boolean_abap_2_json(stickyheader) }, { n: `expandAnimation`, v: z2ui5_cl_util.boolean_abap_2_json(expandanimation) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `height`, v: height }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `expand`, v: expand }, { n: `headerText`, v: headertext }] });
    return result;
  }

  pane_container({ resize, orientation } = {}) {
    let result = null;
    result = this._generic({ name: `PaneContainer`, ns: `layout`, t_prop: [{ n: `resize`, v: resize }, { n: `orientation`, v: orientation }] });
    return result;
  }

  planning_calendar({ rows, id, class: class_, startdate, appointmentsvisualization, appointmentselect, showemptyintervalheaders, showweeknumbers, showdaynamesline, legend, appointmentheight, appointmentroundwidth, builtinviews, calendarweeknumbering, firstdayofweek, height, groupappointmentsmode, iconshape, maxdate, mindate, nodatatext, primarycalendartype, secondarycalendartype, intervalselect, rowheaderpress, rowselectionchange, startdatechange, viewchange, stickyheader, viewkey, width, singleselection, showrowheaders, multipleappointmentsselection, showintervalheaders } = {}) {
    let result = null;
    result = this._generic({ name: `PlanningCalendar`, t_prop: [{ n: `rows`, v: rows }, { n: `startDate`, v: startdate }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `appointmentHeight`, v: appointmentheight }, { n: `appointmentRoundWidth`, v: appointmentroundwidth }, { n: `builtInViews`, v: builtinviews }, { n: `calendarWeekNumbering`, v: calendarweeknumbering }, { n: `firstDayOfWeek`, v: firstdayofweek }, { n: `groupAppointmentsMode`, v: groupappointmentsmode }, { n: `height`, v: height }, { n: `iconShape`, v: iconshape }, { n: `maxDate`, v: maxdate }, { n: `minDate`, v: mindate }, { n: `noDataText`, v: nodatatext }, { n: `primaryCalendarType`, v: primarycalendartype }, { n: `secondaryCalendarType`, v: secondarycalendartype }, { n: `appointmentsVisualization`, v: appointmentsvisualization }, { n: `appointmentSelect`, v: appointmentselect }, { n: `intervalSelect`, v: intervalselect }, { n: `rowHeaderPress`, v: rowheaderpress }, { n: `rowSelectionChange`, v: rowselectionchange }, { n: `startDateChange`, v: startdatechange }, { n: `viewChange`, v: viewchange }, { n: `stickyHeader`, v: stickyheader }, { n: `viewKey`, v: viewkey }, { n: `width`, v: width }, { n: `singleSelection`, v: z2ui5_cl_util.boolean_abap_2_json(singleselection) }, { n: `showRowHeaders`, v: z2ui5_cl_util.boolean_abap_2_json(showrowheaders) }, { n: `multipleAppointmentsSelection`, v: z2ui5_cl_util.boolean_abap_2_json(multipleappointmentsselection) }, { n: `showIntervalHeaders`, v: z2ui5_cl_util.boolean_abap_2_json(showintervalheaders) }, { n: `showEmptyIntervalHeaders`, v: z2ui5_cl_util.boolean_abap_2_json(showemptyintervalheaders) }, { n: `showWeekNumbers`, v: z2ui5_cl_util.boolean_abap_2_json(showweeknumbers) }, { n: `legend`, v: legend }, { n: `showDayNamesLine`, v: z2ui5_cl_util.boolean_abap_2_json(showdaynamesline) }] });
    return result;
  }

  planning_calendar_legend({ items, id, appointmentitems, standarditems, columnwidth, visible } = {}) {
    let result = null;
    result = this._generic({ name: `PlanningCalendarLegend`, t_prop: [{ n: `id`, v: id }, { n: `items`, v: items }, { n: `appointmentItems`, v: appointmentitems }, { n: `columnWidth`, v: columnwidth }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `standardItems`, v: standarditems }] });
    return result;
  }

  planning_calendar_row({ appointments, intervalheaders, icon, title, text, enableappointmentscreate, enableappointmentsdraganddrop, enableappointmentsresize, noappointmentstext, nonworkinghours, rowheaderdescription, nonworkingdays, selected, appointmentcreate, appointmentdragenter, appointmentdrop, appointmentresize, id, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `PlanningCalendarRow`, t_prop: [{ n: `appointments`, v: appointments }, { n: `intervalHeaders`, v: intervalheaders }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `icon`, v: icon }, { n: `title`, v: title }, { n: `key`, v: key }, { n: `noAppointmentsText`, v: noappointmentstext }, { n: `nonWorkingHours`, v: nonworkinghours }, { n: `rowHeaderDescription`, v: rowheaderdescription }, { n: `enableAppointmentsCreate`, v: z2ui5_cl_util.boolean_abap_2_json(enableappointmentscreate) }, { n: `appointmentResize`, v: appointmentresize }, { n: `appointmentDrop`, v: appointmentdrop }, { n: `appointmentDragEnter`, v: appointmentdragenter }, { n: `appointmentCreate`, v: appointmentcreate }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `nonWorkingDays`, v: nonworkingdays }, { n: `enableAppointmentsResize`, v: z2ui5_cl_util.boolean_abap_2_json(enableappointmentsresize) }, { n: `enableAppointmentsDragAndDrop`, v: z2ui5_cl_util.boolean_abap_2_json(enableappointmentsdraganddrop) }, { n: `text`, v: text }] });
    return result;
  }

  planning_calendar_view({ appointmentheight, description, intervallabelformatter, intervalsize, intervalsl, intervalsm, intervalss, intervaltype, relative, showsubintervals } = {}) {
    let result = null;
    result = this._generic({ name: `PlanningCalendarView`, t_prop: [{ n: `appointmentHeight`, v: appointmentheight }, { n: `description`, v: description }, { n: `intervalLabelFormatter`, v: intervallabelformatter }, { n: `intervalSize`, v: intervalsize }, { n: `intervalsL`, v: intervalsl }, { n: `intervalsM`, v: intervalsm }, { n: `intervalsS`, v: intervalss }, { n: `intervalType`, v: intervaltype }, { n: `key`, v: key }, { n: `relative`, v: z2ui5_cl_util.boolean_abap_2_json(relative) }, { n: `showSubIntervals`, v: z2ui5_cl_util.boolean_abap_2_json(showsubintervals) }] });
    return result;
  }

  points() {
    let result = null;
    result = this._generic({ name: `points`, ns: `mchart` });
    return result;
  }

  popover({ id, title, class: class_, placement, initialfocus, contentwidth, contentheight, showheader, showarrow, resizable, modal, horizontalscrolling, verticalscrolling, visible, offsetx, offsety, contentminwidth, titlealignment, beforeopen, beforeclose, afteropen, afterclose } = {}) {
    let result = null;
    result = this._generic({ name: `Popover`, t_prop: [{ n: `id`, v: id }, { n: `title`, v: title }, { n: `class`, v: class_ }, { n: `placement`, v: placement }, { n: `initialFocus`, v: initialfocus }, { n: `contentHeight`, v: contentheight }, { n: `showHeader`, v: z2ui5_cl_util.boolean_abap_2_json(showheader) }, { n: `showArrow`, v: z2ui5_cl_util.boolean_abap_2_json(showarrow) }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }, { n: `modal`, v: z2ui5_cl_util.boolean_abap_2_json(modal) }, { n: `horizontalScrolling`, v: z2ui5_cl_util.boolean_abap_2_json(horizontalscrolling) }, { n: `verticalScrolling`, v: z2ui5_cl_util.boolean_abap_2_json(verticalscrolling) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `offsetX`, v: offsetx }, { n: `offsetY`, v: offsety }, { n: `contentMinWidth`, v: contentminwidth }, { n: `titleAlignment`, v: titlealignment }, { n: `contentWidth`, v: contentwidth }, { n: `afterClose`, v: afterclose }, { n: `afterOpen`, v: afteropen }, { n: `beforeClose`, v: beforeclose }, { n: `beforeOpen`, v: beforeopen }] });
    return result;
  }

  process_flow({ id, foldedcorners, scrollable, showlabels, visible, wheelzoomable, headerpress, labelpress, nodepress, onerror, lanes, nodes } = {}) {
    let result = null;
    result = this._generic({ name: `ProcessFlow`, ns: `commons`, t_prop: [{ n: `id`, v: id }, { n: `foldedCorners`, v: z2ui5_cl_util.boolean_abap_2_json(foldedcorners) }, { n: `scrollable`, v: z2ui5_cl_util.boolean_abap_2_json(scrollable) }, { n: `showLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showlabels) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `wheelZoomable`, v: z2ui5_cl_util.boolean_abap_2_json(wheelzoomable) }, { n: `headerPress`, v: headerpress }, { n: `labelPress`, v: labelpress }, { n: `nodePress`, v: nodepress }, { n: `onError`, v: onerror }, { n: `lanes`, v: lanes }, { n: `nodes`, v: nodes }] });
    return result;
  }

  process_flow_lane_header({ iconsrc, laneid, position, state, text, zoomlevel } = {}) {
    let result = null;
    result = this._generic({ name: `ProcessFlowLaneHeader`, ns: `commons`, t_prop: [{ n: `iconSrc`, v: iconsrc }, { n: `laneId`, v: laneid }, { n: `position`, v: position }, { n: `state`, v: state }, { n: `text`, v: text }, { n: `zoomLevel`, v: zoomlevel }] });
    return result;
  }

  process_flow_node({ laneid, nodeid, title, titleabbreviation, children, state, statetext, texts, highlighted, focused, selected, tag } = {}) {
    let result = null;
    result = this._generic({ name: `ProcessFlowNode`, ns: `commons`, t_prop: [{ n: `laneId`, v: laneid }, { n: `nodeId`, v: nodeid }, { n: `title`, v: title }, { n: `titleAbbreviation`, v: titleabbreviation }, { n: `children`, v: children }, { n: `state`, v: state }, { n: `stateText`, v: statetext }, { n: `texts`, v: texts }, { n: `highlighted`, v: z2ui5_cl_util.boolean_abap_2_json(highlighted) }, { n: `focused`, v: z2ui5_cl_util.boolean_abap_2_json(focused) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `tag`, v: tag }, { n: `type`, v: type }] });
    return result;
  }

  progress_indicator({ class: class_, percentvalue, displayvalue, showvalue, state, visible, width, height, enabled, displayonly, displayanimation } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ProgressIndicator`, t_prop: [{ n: `class`, v: class_ }, { n: `percentValue`, v: percentvalue }, { n: `displayValue`, v: displayvalue }, { n: `showValue`, v: z2ui5_cl_util.boolean_abap_2_json(showvalue) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `state`, v: state }, { n: `width`, v: width }, { n: `height`, v: height }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `displayOnly`, v: z2ui5_cl_util.boolean_abap_2_json(displayonly) }, { n: `displayAnimation`, v: z2ui5_cl_util.boolean_abap_2_json(displayanimation) }] });
    return result;
  }

  property_threshold({ id, class: class_, fillcolor, tovalue, arialabel, visible } = {}) {
    let result = null;
    result = this._generic({ name: `PropertyThreshold`, ns: `si`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `ariaLabel`, v: arialabel }, { n: `fillColor`, v: fillcolor }, { n: `toValue`, v: tovalue }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  property_thresholds() {
    let result = null;
    result = this._generic({ name: `propertyThresholds`, ns: `si` });
    return result;
  }

  proportion_zoom_strategy({ zoomlevel } = {}) {
    let result = null;
    result = this._generic({ name: `ProportionZoomStrategy`, ns: `axistime`, t_prop: [{ n: `zoomLevel`, v: zoomlevel }] });
    return result;
  }

  quick_view({ placement, width, afterclose, afteropen, beforeclose, beforeopen } = {}) {
    let result = null;
    result = this._generic({ name: `QuickView`, t_prop: [{ n: `placement`, v: placement }, { n: `width`, v: width }, { n: `afterClose`, v: afterclose }, { n: `afterOpen`, v: afteropen }, { n: `beforeClose`, v: beforeclose }, { n: `beforeOpen`, v: beforeopen }] });
    return result;
  }

  quick_view_group({ heading, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickViewGroup`, t_prop: [{ n: `heading`, v: heading }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  quick_view_group_element({ emailsubject, label, pagelinkid, target, url, value, visible } = {}) {
    let result = null;
    result = this._generic({ name: `QuickViewGroupElement`, t_prop: [{ n: `emailSubject`, v: emailsubject }, { n: `label`, v: label }, { n: `pageLinkId`, v: pagelinkid }, { n: `target`, v: target }, { n: `type`, v: type }, { n: `url`, v: url }, { n: `value`, v: value }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  quick_view_page({ description, header, pageid, title, titleurl } = {}) {
    let result = null;
    result = this._generic({ name: `QuickViewPage`, t_prop: [{ n: `description`, v: description }, { n: `header`, v: header }, { n: `pageId`, v: pageid }, { n: `title`, v: title }, { n: `titleUrl`, v: titleurl }] });
    return result;
  }

  quick_view_page_avatar() {
    let result = null;
    result = this._generic({ name: `avatar` });
    return result;
  }

  radial_micro_chart({ size, percentage, press, valuecolor, height, aligncontent, hideonnodata } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `RadialMicroChart`, ns: `mchart`, t_prop: [{ n: `percentage`, v: percentage }, { n: `press`, v: press }, { n: `size`, v: size }, { n: `height`, v: height }, { n: `alignContent`, v: aligncontent }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `valueColor`, v: valuecolor }] });
    return result;
  }

  radio_button({ id, activehandling, editable, enabled, groupname, selected, text, textalign, textdirection, useentirewidth, valuestate, width, select, visible } = {}) {
    let result = null;
    result = this._generic({ name: `RadioButton`, t_prop: [{ n: `id`, v: id }, { n: `activeHandling`, v: z2ui5_cl_util.boolean_abap_2_json(activehandling) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `useEntireWidth`, v: z2ui5_cl_util.boolean_abap_2_json(useentirewidth) }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `textAlign`, v: textalign }, { n: `groupName`, v: groupname }, { n: `valueState`, v: valuestate }, { n: `width`, v: width }, { n: `select`, v: select }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  radio_button_group({ id, columns, editable, enabled, selectedindex, textdirection, valuestate, width, select, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `RadioButtonGroup`, t_prop: [{ n: `id`, v: id }, { n: `columns`, v: columns }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `selectedIndex`, v: selectedindex }, { n: `textDirection`, v: textdirection }, { n: `valueState`, v: valuestate }, { n: `select`, v: select }, { n: `width`, v: width }, { n: `class`, v: class_ }] });
    return result;
  }

  range_slider({ max, min, step, startvalue, endvalue, showtickmarks, labelinterval, width, class: class_, id, value, value2, change } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `RangeSlider`, t_prop: [{ n: `class`, v: class_ }, { n: `id`, v: id }, { n: `labelInterval`, v: labelinterval }, { n: `max`, v: max }, { n: `min`, v: min }, { n: `enableTickmarks`, v: z2ui5_cl_util.boolean_abap_2_json(showtickmarks) }, { n: `step`, v: step }, { n: `width`, v: width }, { n: `value`, v: (value ? value : startvalue) }, { n: `value2`, v: (value2 ? value2 : endvalue) }, { n: `change`, v: change }] });
    return result;
  }

  rating_indicator({ maxvalue, enabled, class: class_, value, iconsize, tooltip, displayonly, change, id, editable } = {}) {
    let result = null;
    result = this._generic({ name: `RatingIndicator`, t_prop: [{ n: `class`, v: class_ }, { n: `maxValue`, v: maxvalue }, { n: `displayOnly`, v: z2ui5_cl_util.boolean_abap_2_json(displayonly) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `iconSize`, v: iconsize }, { n: `value`, v: value }, { n: `id`, v: id }, { n: `change`, v: change }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  relationship({ shapeid, successor, predecessor } = {}) {
    let result = null;
    result = this._generic({ name: `Relationship`, ns: `gantt`, t_prop: [{ n: `shapeId`, v: shapeid }, { n: `type`, v: type }, { n: `successor`, v: successor }, { n: `predecessor`, v: predecessor }] });
    return result;
  }

  relationships() {
    let result = null;
    result = this._generic({ name: `relationships`, ns: `gantt` });
    return result;
  }

  responsive_scale({ id, class: class_, tickmarksbetweenlabels } = {}) {
    let result = null;
    result = this._generic({ name: `ResponsiveScale`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `tickmarksBetweenLabels`, v: tickmarksbetweenlabels }] });
    return result;
  }

  responsive_splitter({ defaultpane, height, width } = {}) {
    let result = null;
    result = this._generic({ name: `ResponsiveSplitter`, ns: `layout`, t_prop: [{ n: `defaultPane`, v: defaultpane }, { n: `height`, v: height }, { n: `width`, v: width }] });
    return result;
  }

  rich_text_editor({ buttongroups, customtoolbar, editable, editortype, height, plugins, required, sanitizevalue, showgroupclipboard, showgroupfont, showgroupfontstyle, showgroupinsert, showgrouplink, showgroupstructure, showgrouptextalign, showgroupundo, textdirection, uselegacytheme, value, width, wrapping, beforeeditorinit, change, ready, readyrecurring } = {}) {
    let result = null;
    result = this._generic({ name: `RichTextEditor`, ns: `text`, t_prop: [{ n: `buttonGroups`, v: buttongroups }, { n: `customToolbar`, v: z2ui5_cl_util.boolean_abap_2_json(customtoolbar) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `height`, v: height }, { n: `editorType`, v: editortype }, { n: `plugins`, v: plugins }, { n: `textDirection`, v: textdirection }, { n: `value`, v: value }, { n: `beforeEditorInit`, v: beforeeditorinit }, { n: `change`, v: change }, { n: `ready`, v: ready }, { n: `readyRecurring`, v: readyrecurring }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `sanitizeValue`, v: z2ui5_cl_util.boolean_abap_2_json(sanitizevalue) }, { n: `showGroupClipboard`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupclipboard) }, { n: `showGroupFont`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupfont) }, { n: `showGroupFontStyle`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupfontstyle) }, { n: `showGroupInsert`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupinsert) }, { n: `showGroupLink`, v: z2ui5_cl_util.boolean_abap_2_json(showgrouplink) }, { n: `showGroupStructure`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupstructure) }, { n: `showGroupTextAlign`, v: z2ui5_cl_util.boolean_abap_2_json(showgrouptextalign) }, { n: `showGroupUndo`, v: z2ui5_cl_util.boolean_abap_2_json(showgroupundo) }, { n: `useLegacyTheme`, v: z2ui5_cl_util.boolean_abap_2_json(uselegacytheme) }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `width`, v: width }] });
    return result;
  }

  route({ id, position, routetype, linedash, color, colorborder, linewidth } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Route`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `position`, v: position }, { n: `routetype`, v: routetype }, { n: `lineDash`, v: linedash }, { n: `linewidth`, v: linewidth }, { n: `color`, v: color }, { n: `colorBorder`, v: colorborder }] });
    return result;
  }

  routes({ id, items } = {}) {
    let result = null;
    result = this._generic({ name: `Routes`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `items`, v: items }] });
    return result;
  }

  rows() {
    let result = null;
    result = this._generic({ name: `rows` });
    return result;
  }

  row_settings_template() {
    let result = null;
    result = this._generic({ name: `rowSettingsTemplate`, ns: `table` });
    return result;
  }

  rules() {
    let result = null;
    result = this._generic({ name: `rules` });
    return result;
  }

  scroll_container({ height, width, vertical, horizontal, id, focusable, visible } = {}) {
    let result = null;
    result = this._generic({ name: `ScrollContainer`, t_prop: [{ n: `height`, v: height }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `vertical`, v: z2ui5_cl_util.boolean_abap_2_json(vertical) }, { n: `horizontal`, v: z2ui5_cl_util.boolean_abap_2_json(horizontal) }, { n: `focusable`, v: z2ui5_cl_util.boolean_abap_2_json(focusable) }] });
    return result;
  }

  search_field({ search, width, value, id, class: class_, change, livechange, suggest, enabled, enablesuggestions, maxlength, placeholder, showrefreshbutton, showsearchbutton, visible } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `SearchField`, t_prop: [{ n: `width`, v: width }, { n: `search`, v: search }, { n: `value`, v: value }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `change`, v: change }, { n: `maxLength`, v: maxlength }, { n: `placeholder`, v: placeholder }, { n: `suggest`, v: suggest }, { n: `enableSuggestions`, v: z2ui5_cl_util.boolean_abap_2_json(enablesuggestions) }, { n: `showRefreshButton`, v: z2ui5_cl_util.boolean_abap_2_json(showrefreshbutton) }, { n: `showSearchButton`, v: z2ui5_cl_util.boolean_abap_2_json(showsearchbutton) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `liveChange`, v: livechange }] });
    return result;
  }

  second_status() {
    let result = null;
    result = this._generic({ name: `secondStatus` });
    return result;
  }

  sections() {
    let result = null;
    result = this._generic({ name: `sections`, ns: `uxap` });
    return result;
  }

  segmented_button({ selected_key, selection_change, id, visible, enabled } = {}) {
    let result = null;
    result = this._generic({ name: `SegmentedButton`, t_prop: [{ n: `id`, v: id }, { n: `selectedKey`, v: selected_key }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `selectionChange`, v: selection_change }] });
    return result;
  }

  segmented_button_item({ icon, text, width, visible, textdirection, enabled, press } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `SegmentedButtonItem`, t_prop: [{ n: `icon`, v: icon }, { n: `press`, v: press }, { n: `width`, v: width }, { n: `key`, v: key }, { n: `textDirection`, v: textdirection }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `text`, v: text }] });
    return result;
  }

  segments() {
    let result = null;
    result = this._generic({ name: `segments`, ns: `mchart` });
    return result;
  }

  select({ id, autoadjustwidth, columnratio, editable, enabled, forceselection, icon, maxwidth, name, required, resetonmissingkey, selecteditemid, selectedkey, showsecondaryvalues, textalign, textdirection, valuestate, valuestatetext, visible, width, wrapitemstext, items, selecteditem, change, livechange, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `Select`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `autoAdjustWidth`, v: z2ui5_cl_util.boolean_abap_2_json(autoadjustwidth) }, { n: `columnRatio`, v: columnratio }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `forceSelection`, v: z2ui5_cl_util.boolean_abap_2_json(forceselection) }, { n: `icon`, v: icon }, { n: `maxWidth`, v: maxwidth }, { n: `name`, v: name }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `resetOnMissingKey`, v: z2ui5_cl_util.boolean_abap_2_json(resetonmissingkey) }, { n: `selectedItemId`, v: selecteditemid }, { n: `selectedKey`, v: selectedkey }, { n: `showSecondaryValues`, v: z2ui5_cl_util.boolean_abap_2_json(showsecondaryvalues) }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `type`, v: type }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `width`, v: width }, { n: `wrapItemsText`, v: z2ui5_cl_util.boolean_abap_2_json(wrapitemstext) }, { n: `items`, v: items }, { n: `selectedItem`, v: selecteditem }, { n: `change`, v: change }, { n: `liveChange`, v: livechange }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  shapes1() {
    let result = null;
    result = this._generic({ name: `shapes1`, ns: `gantt` });
    return result;
  }

  shapes2() {
    let result = null;
    result = this._generic({ name: `shapes2`, ns: `gantt` });
    return result;
  }

  shape_group() {
    let result = null;
    result = this._generic({ name: `ShapeGroup`, ns: `si` });
    return result;
  }

  shell({ ns, appwidthlimited } = {}) {
    let result = null;
    result = this._generic({ name: `Shell`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `appWidthLimited`, v: z2ui5_cl_util.boolean_abap_2_json(appwidthlimited) }] });
    return result;
  }

  shell_bar({ homeicon, homeicontooltip, notificationsnumber, secondtitle, showcopilot, showmenubutton, shownavbutton, shownotifications, showproductswitcher, showsearch, title, avatarpressed, copilotpressed, homeiconpressed, menubuttonpressed, navbuttonpressed, notificationspressed, productswitcherpressed, searchbuttonpressed } = {}) {
    let result = null;
    result = this._generic({ name: `ShellBar`, ns: `f`, t_prop: [{ n: `homeIcon`, v: homeicon }, { n: `homeIconTooltip`, v: homeicontooltip }, { n: `title`, v: title }, { n: `secondTitle`, v: secondtitle }, { n: `showCopilot`, v: z2ui5_cl_util.boolean_abap_2_json(showcopilot) }, { n: `showMenuButton`, v: z2ui5_cl_util.boolean_abap_2_json(showmenubutton) }, { n: `showNavButton`, v: z2ui5_cl_util.boolean_abap_2_json(shownavbutton) }, { n: `showNotifications`, v: z2ui5_cl_util.boolean_abap_2_json(shownotifications) }, { n: `showProductSwitcher`, v: z2ui5_cl_util.boolean_abap_2_json(showproductswitcher) }, { n: `showSearch`, v: z2ui5_cl_util.boolean_abap_2_json(showsearch) }, { n: `notificationsNumber`, v: notificationsnumber }, { n: `avatarPressed`, v: avatarpressed }, { n: `copilotPressed`, v: copilotpressed }, { n: `homeIconPressed`, v: homeiconpressed }, { n: `menuButtonPressed`, v: menubuttonpressed }, { n: `navButtonPressed`, v: navbuttonpressed }, { n: `notificationsPressed`, v: notificationspressed }, { n: `productSwitcherPressed`, v: productswitcherpressed }, { n: `searchButtonPressed`, v: searchbuttonpressed }] });
    return result;
  }

  side_content({ width } = {}) {
    let result = null;
    result = this._generic({ name: `sideContent`, ns: `layout`, t_prop: [{ n: `width`, v: width }] });
    return result;
  }

  side_panel({ actionbarexpanded, arialabel, sidepanelmaxwidth, sidepanelminwidth, sidepanelposition, sidepanelresizable, sidepanelresizelargerstep, sidepanelresizestep, sidepanelwidth, toggle } = {}) {
    let result = null;
    result = this._generic({ name: `SidePanel`, ns: `f`, t_prop: [{ n: `sidePanelWidth`, v: sidepanelwidth }, { n: `sidePanelResizeStep`, v: sidepanelresizestep }, { n: `sidePanelResizeLargerStep`, v: sidepanelresizelargerstep }, { n: `sidePanelPosition`, v: sidepanelposition }, { n: `sidePanelMinWidth`, v: sidepanelminwidth }, { n: `sidePanelMaxWidth`, v: sidepanelmaxwidth }, { n: `sidePanelResizable`, v: z2ui5_cl_util.boolean_abap_2_json(sidepanelresizable) }, { n: `actionBarExpanded`, v: z2ui5_cl_util.boolean_abap_2_json(actionbarexpanded) }, { n: `toggle`, v: toggle }, { n: `ariaLabel`, v: arialabel }] });
    return result;
  }

  side_panel_item({ icon, text, enabled } = {}) {
    let result = null;
    result = this._generic({ name: `SidePanelItem`, ns: `f`, t_prop: [{ n: `icon`, v: icon }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `key`, v: key }, { n: `text`, v: text }] });
    return result;
  }

  simple_form({ title, layout, class: class_, editable, columnsxl, columnsl, columnsm, id, adjustlabelspan, backgrounddesign, breakpointl, breakpointm, breakpointxl, emptyspanl, emptyspanm, emptyspans, emptyspanxl, labelspans, labelspanm, labelspanl, labelspanxl, maxcontainercols, minwidth, singlecontainerfullsize, visible, width } = {}) {
    let result = null;
    result = this._generic({ name: `SimpleForm`, ns: `form`, t_prop: [{ n: `title`, v: title }, { n: `layout`, v: layout }, { n: `class`, v: class_ }, { n: `adjustLabelSpan`, v: adjustlabelspan }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `breakpointL`, v: breakpointl }, { n: `breakpointM`, v: breakpointm }, { n: `breakpointXL`, v: breakpointxl }, { n: `emptySpanL`, v: emptyspanl }, { n: `emptySpanM`, v: emptyspanm }, { n: `emptySpanS`, v: emptyspans }, { n: `emptySpanXL`, v: emptyspanxl }, { n: `labelSpanL`, v: labelspanl }, { n: `labelSpanM`, v: labelspanm }, { n: `labelSpanS`, v: labelspans }, { n: `labelSpanXL`, v: labelspanxl }, { n: `maxContainerCols`, v: maxcontainercols }, { n: `minWidth`, v: minwidth }, { n: `singleContainerFullSize`, v: z2ui5_cl_util.boolean_abap_2_json(singlecontainerfullsize) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `columnsXL`, v: columnsxl }, { n: `columnsL`, v: columnsl }, { n: `columnsM`, v: columnsm }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }] });
    return result;
  }

  slider({ max, min, step, value, enabletickmarks, width, class: class_, id, enabled, change, inputsastooltips, showadvancedtooltip, showhandletooltip, livechange } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Slider`, t_prop: [{ n: `class`, v: class_ }, { n: `id`, v: id }, { n: `max`, v: max }, { n: `min`, v: min }, { n: `enableTickmarks`, v: z2ui5_cl_util.boolean_abap_2_json(enabletickmarks) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `value`, v: value }, { n: `step`, v: step }, { n: `change`, v: change }, { n: `width`, v: width }, { n: `inputsAsTooltips`, v: inputsastooltips }, { n: `showAdvancedTooltip`, v: showadvancedtooltip }, { n: `showHandleTooltip`, v: showhandletooltip }, { n: `liveChange`, v: livechange }] });
    return result;
  }

  slide_tile({ displaytime, height, visible, scope, sizebehavior, transitiontime, press, width, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `SlideTile`, t_prop: [{ n: `displayTime`, v: displaytime }, { n: `height`, v: height }, { n: `scope`, v: scope }, { n: `sizeBehavior`, v: sizebehavior }, { n: `transitionTime`, v: transitiontime }, { n: `width`, v: width }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `class`, v: class_ }] });
    return result;
  }

  smart_variant_management({ id, showexecuteonselection, persistencykey } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `SmartVariantManagement`, ns: `smartVariantManagement`, t_prop: [{ n: `id`, v: id }, { n: `showExecuteOnSelection`, v: z2ui5_cl_util.boolean_abap_2_json(showexecuteonselection) }, { n: `persistencyKey`, v: persistencykey }] });
    return result;
  }

  snapped_content({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `snappedContent`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  snapped_heading() {
    let result = null;
    result = this._generic({ name: `snappedHeading`, ns: `uxap` });
    return result;
  }

  snapped_title_on_mobile() {
    let result = null;
    result = this._generic({ name: `snappedTitleOnMobile`, ns: `uxap` });
    return result;
  }

  sort_items() {
    let result = null;
    result = this._generic({ name: `sortItems` });
    return result;
  }

  splitter_layout_data({ size, minsize, resizable } = {}) {
    let result = null;
    result = this._generic({ name: `SplitterLayoutData`, ns: `layout`, t_prop: [{ n: `size`, v: size }, { n: `minSize`, v: minsize }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }] });
    return result;
  }

  split_container({ id, initialdetail, initialmaster, backgroundcolor, backgroundimage, backgroundopacity, backgroundrepeat, defaulttransitionnamedetail, defaulttransitionnamemaster, masterbuttontext, masterbuttontooltip, mode, afterdetailnavigate, aftermasterclose, aftermasternavigate, aftermasteropen, beforemasterclose, beforemasteropen, detailnavigate, masterbutton, masternavigate } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `SplitContainer`, t_prop: [{ n: `id`, v: id }, { n: `initialDetail`, v: initialdetail }, { n: `initialMaster`, v: initialmaster }, { n: `backgroundColor`, v: backgroundcolor }, { n: `backgroundImage`, v: backgroundimage }, { n: `backgroundOpacity`, v: backgroundopacity }, { n: `backgroundRepeat`, v: backgroundrepeat }, { n: `defaultTransitionNameDetail`, v: defaulttransitionnamedetail }, { n: `defaultTransitionNameMaster`, v: defaulttransitionnamemaster }, { n: `masterButtonText`, v: masterbuttontext }, { n: `masterButtonTooltip`, v: masterbuttontooltip }, { n: `afterDetailNavigate`, v: afterdetailnavigate }, { n: `afterMasterClose`, v: aftermasterclose }, { n: `afterMasterNavigate`, v: aftermasternavigate }, { n: `afterMasterOpen`, v: aftermasteropen }, { n: `beforeMasterClose`, v: beforemasterclose }, { n: `beforeMasterOpen`, v: beforemasteropen }, { n: `detailNavigate`, v: detailnavigate }, { n: `masterButton`, v: masterbutton }, { n: `masterNavigate`, v: masternavigate }, { n: `mode`, v: mode }] });
    return result;
  }

  split_pane({ id, requiredparentwidth } = {}) {
    let result = null;
    result = this._generic({ name: `SplitPane`, ns: `layout`, t_prop: [{ n: `id`, v: id }, { n: `requiredParentWidth`, v: requiredparentwidth }] });
    return result;
  }

  spot({ id, position, contentoffset, scale, tooltip, image, icon, click, text } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Spot`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `position`, v: position }, { n: `contentOffset`, v: contentoffset }, { n: `type`, v: type }, { n: `scale`, v: scale }, { n: `tooltip`, v: tooltip }, { n: `image`, v: image }, { n: `icon`, v: icon }, { n: `text`, v: text }, { n: `click`, v: click }] });
    return result;
  }

  spots({ id, items } = {}) {
    let result = null;
    result = this._generic({ name: `Spots`, ns: `vbm`, t_prop: [{ n: `id`, v: id }, { n: `items`, v: items }] });
    return result;
  }

  stacked_bar_micro_chart({ height, press, maxvalue, precision, size, hideonnodata, displayzerovalue, showlabels, width } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `StackedBarMicroChart`, ns: `mchart`, t_prop: [{ n: `height`, v: height }, { n: `press`, v: press }, { n: `maxValue`, v: maxvalue }, { n: `precision`, v: precision }, { n: `size`, v: size }, { n: `hideOnNoData`, v: z2ui5_cl_util.boolean_abap_2_json(hideonnodata) }, { n: `displayZeroValue`, v: z2ui5_cl_util.boolean_abap_2_json(displayzerovalue) }, { n: `showLabels`, v: z2ui5_cl_util.boolean_abap_2_json(showlabels) }, { n: `width`, v: width }] });
    return result;
  }

  standard_list_item({ title, description, icon, info, press, selected, counter, wrapping, wrapcharlimit, infostateinverted, infostate, iconinset, adapttitlesize, activeicon, unread, highlight } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `StandardListItem`, t_prop: [{ n: `title`, v: title }, { n: `description`, v: description }, { n: `icon`, v: icon }, { n: `info`, v: info }, { n: `press`, v: press }, { n: `type`, v: type }, { n: `counter`, v: counter }, { n: `activeIcon`, v: activeicon }, { n: `adaptTitleSize`, v: z2ui5_cl_util.boolean_abap_2_json(adapttitlesize) }, { n: `unread`, v: z2ui5_cl_util.boolean_abap_2_json(unread) }, { n: `iconInset`, v: z2ui5_cl_util.boolean_abap_2_json(iconinset) }, { n: `infoStateInverted`, v: z2ui5_cl_util.boolean_abap_2_json(infostateinverted) }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `infoState`, v: infostate }, { n: `highlight`, v: highlight }, { n: `wrapCharLimit`, v: wrapcharlimit }, { n: `selected`, v: selected }] });
    return result;
  }

  standard_tree_item({ title, icon, press, detailpress, selected, counter, tooltip } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `StandardTreeItem`, t_prop: [{ n: `title`, v: title }, { n: `icon`, v: icon }, { n: `press`, v: press }, { n: `detailPress`, v: detailpress }, { n: `type`, v: type }, { n: `counter`, v: counter }, { n: `selected`, v: selected }, { n: `tooltip`, v: tooltip }] });
    return result;
  }

  status({ id, class: class_, backgroundcolor, bordercolor, borderstyle, borderwidth, contentcolor, headercontentcolor, hoverbackgroundcolor, hoverbordercolor, hovercontentcolor, legendcolor, selectedbackgroundcolor, selectedbordercolor, selectedcontentcolor, title, usefocuscolorascontentcolor, visible } = {}) {
    let result = null;
    result = this._generic({ name: `Status`, ns: `networkgraph`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `backgroundColor`, v: backgroundcolor }, { n: `borderColor`, v: bordercolor }, { n: `borderStyle`, v: borderstyle }, { n: `borderWidth`, v: borderwidth }, { n: `contentColor`, v: contentcolor }, { n: `headerContentColor`, v: headercontentcolor }, { n: `hoverBackgroundColor`, v: hoverbackgroundcolor }, { n: `hoverBorderColor`, v: hoverbordercolor }, { n: `hoverContentColor`, v: hovercontentcolor }, { n: `key`, v: key }, { n: `legendColor`, v: legendcolor }, { n: `selectedBackgroundColor`, v: selectedbackgroundcolor }, { n: `selectedBorderColor`, v: selectedbordercolor }, { n: `selectedContentColor`, v: selectedcontentcolor }, { n: `title`, v: title }, { n: `useFocusColorAsContentColor`, v: z2ui5_cl_util.boolean_abap_2_json(usefocuscolorascontentcolor) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  statuses({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `statuses`, ns: (false /* TODO(abap2js): NS */ === `` ? `networkgraph` : false /* TODO(abap2js): NS */) });
    return result;
  }

  status_indicator({ id, class: class_, height, labelposition, showlabel, size, value, viewbox, width, visible, press } = {}) {
    let result = null;
    result = this._generic({ name: `StatusIndicator`, ns: `si`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `height`, v: height }, { n: `labelPosition`, v: labelposition }, { n: `showLabel`, v: z2ui5_cl_util.boolean_abap_2_json(showlabel) }, { n: `size`, v: size }, { n: `value`, v: value }, { n: `viewBox`, v: viewbox }, { n: `width`, v: width }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  step_input({ id, value, min, max, step, width, valuestate, enabled, description, displayvalueprecision, largerstep, stepmode, editable, fieldwidth, textalign, validationmode, change } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `StepInput`, t_prop: [{ n: `id`, v: id }, { n: `max`, v: max }, { n: `min`, v: min }, { n: `step`, v: step }, { n: `width`, v: width }, { n: `value`, v: value }, { n: `valueState`, v: valuestate }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `description`, v: description }, { n: `displayValuePrecision`, v: displayvalueprecision }, { n: `largerStep`, v: largerstep }, { n: `stepMode`, v: stepmode }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `fieldWidth`, v: fieldwidth }, { n: `textAlign`, v: textalign }, { n: `validationMode`, v: validationmode }, { n: `change`, v: change }] });
    return result;
  }

  stringify() {
    let result = ``;
    let lt_parts = [];
    this.get_root().xml_get_parts({ ct_parts: lt_parts });
    result = /* TODO(abap2js) */ concat_lines_of(lt_parts);
    return result;
  }

  sub_header({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `subHeader`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  sub_sections() {
    let result = null;
    result = this._generic({ name: `subSections`, ns: `uxap` });
    return result;
  }

  suggestion_columns() {
    let result = null;
    result = this._generic({ name: `suggestionColumns` });
    return result;
  }

  suggestion_item({ description, icon, text, textdirection } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `SuggestionItem`, t_prop: [{ n: `description`, v: description }, { n: `icon`, v: icon }, { n: `key`, v: key }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }] });
    return result;
  }

  suggestion_items() {
    let result = null;
    result = this._generic({ name: `suggestionItems` });
    return result;
  }

  suggestion_rows() {
    let result = null;
    result = this._generic({ name: `suggestionRows` });
    return result;
  }

  swim_lane_chain_layout() {
    let result = null;
    result = this._generic({ name: `SwimLaneChainLayout`, ns: `nglayout` });
    return result;
  }

  switch({ state, customtexton, customtextoff, enabled, change, name } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Switch`, t_prop: [{ n: `type`, v: type }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `state`, v: state }, { n: `change`, v: change }, { n: `customTextOff`, v: customtextoff }, { n: `customTextOn`, v: customtexton }, { n: `name`, v: name }] });
    return result;
  }

  tab({ text, selected } = {}) {
    let result = null;
    result = this._generic({ name: `Tab`, ns: `webc`, t_prop: [{ n: `text`, v: text }, { n: `selected`, v: selected }] });
    return result;
  }

  table({ id, items, class: class_, growing, growingthreshold, growingscrolltoload, headertext, sticky, mode, width, selectionchange, alternaterowcolors, autopopinmode, inset, showseparators, showoverlay, hiddeninpopin, popinlayout, fixedlayout, backgrounddesign, visible, footertext, multiselectmode, rememberselections, keyboardmode, contextualwidth } = {}) {
    let result = null;
    result = this._generic({ name: `Table`, t_prop: [{ n: `items`, v: items }, { n: `headerText`, v: headertext }, { n: `class`, v: class_ }, { n: `growing`, v: growing }, { n: `growingThreshold`, v: growingthreshold }, { n: `growingScrollToLoad`, v: growingscrolltoload }, { n: `sticky`, v: sticky }, { n: `showSeparators`, v: showseparators }, { n: `mode`, v: mode }, { n: `inset`, v: inset }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `hiddenInPopin`, v: hiddeninpopin }, { n: `popinLayout`, v: popinlayout }, { n: `selectionChange`, v: selectionchange }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `alternateRowColors`, v: z2ui5_cl_util.boolean_abap_2_json(alternaterowcolors) }, { n: `fixedLayout`, v: z2ui5_cl_util.boolean_abap_2_json(fixedlayout) }, { n: `showOverlay`, v: z2ui5_cl_util.boolean_abap_2_json(showoverlay) }, { n: `autoPopinMode`, v: z2ui5_cl_util.boolean_abap_2_json(autopopinmode) }, { n: `footerText`, v: footertext }, { n: `multiSelectMode`, v: multiselectmode }, { n: `keyboardMode`, v: keyboardmode }, { n: `contextualWidth`, v: contextualwidth }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }] });
    return result;
  }

  table_select_dialog({ confirmbuttontext, contentheight, contentwidth, draggable, growing, growingthreshold, multiselect, nodatatext, rememberselections, resizable, searchplaceholder, showclearbutton, title, titlealignment, visible, items, livechange, cancel, search, confirm, selectionchange } = {}) {
    let result = null;
    result = this._generic({ name: `TableSelectDialog`, t_prop: [{ n: `confirmButtonText`, v: confirmbuttontext }, { n: `contentHeight`, v: contentheight }, { n: `contentWidth`, v: contentwidth }, { n: `draggable`, v: z2ui5_cl_util.boolean_abap_2_json(draggable) }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `growingThreshold`, v: growingthreshold }, { n: `multiSelect`, v: z2ui5_cl_util.boolean_abap_2_json(multiselect) }, { n: `noDataText`, v: nodatatext }, { n: `rememberSelections`, v: z2ui5_cl_util.boolean_abap_2_json(rememberselections) }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }, { n: `searchPlaceholder`, v: searchplaceholder }, { n: `showClearButton`, v: z2ui5_cl_util.boolean_abap_2_json(showclearbutton) }, { n: `title`, v: title }, { n: `titleAlignment`, v: titlealignment }, { n: `items`, v: items }, { n: `search`, v: search }, { n: `confirm`, v: confirm }, { n: `cancel`, v: cancel }, { n: `liveChange`, v: livechange }, { n: `selectionChange`, v: selectionchange }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  tab_container() {
    let result = null;
    result = this._generic({ name: `TabContainer`, ns: `webc` });
    return result;
  }

  task({ id, color, endtime, time, title, showtitle, connectable } = {}) {
    let result = null;
    result = this._generic({ name: `Task`, ns: `shapes`, t_prop: [{ n: `time`, v: time }, { n: `endTime`, v: endtime }, { n: `id`, v: id }, { n: `type`, v: type }, { n: `connectable`, v: connectable }, { n: `title`, v: title }, { n: `showTitle`, v: z2ui5_cl_util.boolean_abap_2_json(showtitle) }, { n: `color`, v: color }] });
    return result;
  }

  template_else() {
    let result = null;
    result = this._generic({ name: `else`, ns: `template` });
    return result;
  }

  template_elseif({ test } = {}) {
    let result = null;
    result = this._generic({ name: `elseif`, ns: `template`, t_prop: [{ n: `test`, v: test }] });
    return result;
  }

  template_if({ test } = {}) {
    let result = null;
    result = this._generic({ name: `if`, ns: `template`, t_prop: [{ n: `test`, v: test }] });
    return result;
  }

  template_repeat({ list, var: var_ } = {}) {
    let result = null;
    result = this._generic({ name: `repeat`, ns: `template`, t_prop: [{ n: `list`, v: list }, { n: `var`, v: var_ }] });
    return result;
  }

  template_then() {
    let result = null;
    result = this._generic({ name: `then`, ns: `template` });
    return result;
  }

  template_with({ path, helper, var: var_ } = {}) {
    let result = null;
    result = this._generic({ name: `with`, ns: `template`, t_prop: [{ n: `path`, v: path }, { n: `helper`, v: helper }, { n: `var`, v: var_ }] });
    return result;
  }

  text({ text, class: class_, ns, emptyindicatormode, maxlines, renderwhitespace, textalign, textdirection, width, wrapping, wrappingtype, id, visible } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Text`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `text`, v: text }, { n: `emptyIndicatorMode`, v: emptyindicatormode }, { n: `maxLines`, v: maxlines }, { n: `renderWhitespace`, v: renderwhitespace }, { n: `textAlign`, v: textalign }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `textDirection`, v: textdirection }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `wrappingType`, v: wrappingtype }, { n: `class`, v: class_ }] });
    return result;
  }

  text_area({ value, rows, cols, height, class: class_, width, valueliveupdate, editable, enabled, growing, growingmaxlines, id, required, placeholder, valuestate, valuestatetext, wrapping, maxlength, textalign, textdirection, showvaluestatemessage, showexceededtext } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `TextArea`, t_prop: [{ n: `value`, v: value }, { n: `rows`, v: rows }, { n: `cols`, v: cols }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `wrapping`, v: wrapping }, { n: `maxLength`, v: maxlength }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `showExceededText`, v: z2ui5_cl_util.boolean_abap_2_json(showexceededtext) }, { n: `valueLiveUpdate`, v: z2ui5_cl_util.boolean_abap_2_json(valueliveupdate) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `class`, v: class_ }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `id`, v: id }, { n: `growing`, v: z2ui5_cl_util.boolean_abap_2_json(growing) }, { n: `growingMaxLines`, v: growingmaxlines }, { n: `required`, v: required }, { n: `valueState`, v: valuestate }, { n: `placeholder`, v: placeholder }, { n: `valueStateText`, v: valuestatetext }] });
    return result;
  }

  tile_content({ unit, footercolor, blocked, frametype, priority, prioritytext, state, disabled, visible, footer, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `TileContent`, ns: ``, t_prop: [{ n: `unit`, v: unit }, { n: `footerColor`, v: footercolor }, { n: `blocked`, v: z2ui5_cl_util.boolean_abap_2_json(blocked) }, { n: `frameType`, v: frametype }, { n: `priority`, v: priority }, { n: `priorityText`, v: prioritytext }, { n: `state`, v: state }, { n: `disabled`, v: z2ui5_cl_util.boolean_abap_2_json(disabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `footer`, v: footer }, { n: `class`, v: class_ }] });
    return result;
  }

  tile_info({ id, class: class_, backgroundcolor, bordercolor, src, text, textcolor } = {}) {
    let result = null;
    result = this._generic({ name: `TileInfo`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `backgroundColor`, v: backgroundcolor }, { n: `borderColor`, v: bordercolor }, { n: `src`, v: src }, { n: `text`, v: text }, { n: `textColor`, v: textcolor }] });
    return result;
  }

  timeline({ id, enabledoublesided, groupby, growingthreshold, filtertitle, sortoldestfirst, alignment, axisorientation, content, enablemodelfilter, enablescroll, forcegrowing, group, lazyloading, showheaderbar, showicons, showitemfilter, showsearch, showsort, showtimefilter, sort, groupbytype, textheight, width, height, nodatatext, filterlist, customfilter } = {}) {
    let result = null;
    result = this._generic({ name: `Timeline`, ns: `commons`, t_prop: [{ n: `id`, v: id }, { n: `enableDoubleSided`, v: z2ui5_cl_util.boolean_abap_2_json(enabledoublesided) }, { n: `groupBy`, v: groupby }, { n: `growingThreshold`, v: growingthreshold }, { n: `filterTitle`, v: filtertitle }, { n: `sortOldestFirst`, v: z2ui5_cl_util.boolean_abap_2_json(sortoldestfirst) }, { n: `enableModelFilter`, v: z2ui5_cl_util.boolean_abap_2_json(enablemodelfilter) }, { n: `enableScroll`, v: z2ui5_cl_util.boolean_abap_2_json(enablescroll) }, { n: `forceGrowing`, v: z2ui5_cl_util.boolean_abap_2_json(forcegrowing) }, { n: `group`, v: z2ui5_cl_util.boolean_abap_2_json(group) }, { n: `lazyLoading`, v: z2ui5_cl_util.boolean_abap_2_json(lazyloading) }, { n: `showHeaderBar`, v: z2ui5_cl_util.boolean_abap_2_json(showheaderbar) }, { n: `showIcons`, v: z2ui5_cl_util.boolean_abap_2_json(showicons) }, { n: `showItemFilter`, v: z2ui5_cl_util.boolean_abap_2_json(showitemfilter) }, { n: `showSearch`, v: z2ui5_cl_util.boolean_abap_2_json(showsearch) }, { n: `showSort`, v: z2ui5_cl_util.boolean_abap_2_json(showsort) }, { n: `showTimeFilter`, v: z2ui5_cl_util.boolean_abap_2_json(showtimefilter) }, { n: `sort`, v: z2ui5_cl_util.boolean_abap_2_json(sort) }, { n: `groupByType`, v: groupbytype }, { n: `textHeight`, v: textheight }, { n: `width`, v: width }, { n: `height`, v: height }, { n: `noDataText`, v: nodatatext }, { n: `alignment`, v: alignment }, { n: `axisOrientation`, v: axisorientation }, { n: `filterList`, v: filterlist }, { n: `customFilter`, v: customfilter }, { n: `content`, v: content }] });
    return result;
  }

  timeline_item({ id, datetime, title, usernameclickable, useicontooltip, usernameclicked, select, userpicture, text, username, filtervalue, icondisplayshape, iconinitials, iconsize, icontooltip, maxcharacters, replycount, status, customactionclicked, press, replylistopen, replypost, icon } = {}) {
    let result = null;
    result = this._generic({ name: `TimelineItem`, ns: `commons`, t_prop: [{ n: `id`, v: id }, { n: `dateTime`, v: datetime }, { n: `title`, v: title }, { n: `userNameClickable`, v: z2ui5_cl_util.boolean_abap_2_json(usernameclickable) }, { n: `useIconTooltip`, v: z2ui5_cl_util.boolean_abap_2_json(useicontooltip) }, { n: `userNameClicked`, v: usernameclicked }, { n: `userPicture`, v: userpicture }, { n: `select`, v: select }, { n: `text`, v: text }, { n: `userName`, v: username }, { n: `filterValue`, v: filtervalue }, { n: `iconDisplayShape`, v: icondisplayshape }, { n: `iconInitials`, v: iconinitials }, { n: `iconSize`, v: iconsize }, { n: `iconTooltip`, v: icontooltip }, { n: `maxCharacters`, v: maxcharacters }, { n: `replyCount`, v: replycount }, { n: `status`, v: status }, { n: `customActionClicked`, v: customactionclicked }, { n: `press`, v: press }, { n: `replyListOpen`, v: replylistopen }, { n: `replyPost`, v: replypost }, { n: `icon`, v: icon }] });
    return result;
  }

  time_horizon({ starttime, endtime } = {}) {
    let result = null;
    result = this._generic({ name: `TimeHorizon`, ns: `config`, t_prop: [{ n: `startTime`, v: starttime }, { n: `endTime`, v: endtime }] });
    return result;
  }

  time_picker({ value, placeholder, enabled, valuestate, displayformat, valueformat, required, width, datevalue, localeid, mask, maskmode, minutesstep, name, placeholdersymbol, secondsstep, textalign, textdirection, title, showcurrenttimebutton, showvaluestatemessage, support2400, initialfocuseddatevalue, hideinput, editable, visible, valuestatetext, livechange, change, aftervaluehelpopen, aftervaluehelpclose } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `TimePicker`, t_prop: [{ n: `value`, v: value }, { n: `dateValue`, v: datevalue }, { n: `localeId`, v: localeid }, { n: `placeholder`, v: placeholder }, { n: `mask`, v: mask }, { n: `maskMode`, v: maskmode }, { n: `minutesStep`, v: minutesstep }, { n: `name`, v: name }, { n: `placeholderSymbol`, v: placeholdersymbol }, { n: `secondsStep`, v: secondsstep }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `title`, v: title }, { n: `showCurrentTimeButton`, v: z2ui5_cl_util.boolean_abap_2_json(showcurrenttimebutton) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `support2400`, v: z2ui5_cl_util.boolean_abap_2_json(support2400) }, { n: `initialFocusedDateValue`, v: z2ui5_cl_util.boolean_abap_2_json(initialfocuseddatevalue) }, { n: `hideInput`, v: z2ui5_cl_util.boolean_abap_2_json(hideinput) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `displayFormat`, v: displayformat }, { n: `afterValueHelpClose`, v: aftervaluehelpclose }, { n: `afterValueHelpOpen`, v: aftervaluehelpopen }, { n: `change`, v: change }, { n: `liveChange`, v: livechange }, { n: `valueFormat`, v: valueformat }] });
    return result;
  }

  title({ ns, text, wrapping, level, class: class_, id, textalign, textdirection, titlestyle, width, wrappingtype, visible } = {}) {
    let result = null;
    const lv_name = (false /* TODO(abap2js): NS */ === `f` ? `title` : `Title`);
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ ns: false /* TODO(abap2js): NS */, name: lv_name, t_prop: [{ n: `text`, v: text }, { n: `class`, v: class_ }, { n: `id`, v: id }, { n: `wrappingType`, v: wrappingtype }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `titleStyle`, v: titlestyle }, { n: `width`, v: width }, { n: `wrapping`, v: z2ui5_cl_util.boolean_abap_2_json(wrapping) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `level`, v: level }] });
    return result;
  }

  toggle_button({ text, icon, enabled, press, class: class_, pressed } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ToggleButton`, t_prop: [{ n: `press`, v: press }, { n: `text`, v: text }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `icon`, v: icon }, { n: `type`, v: type }, { n: `class`, v: class_ }, { n: `pressed`, v: z2ui5_cl_util.boolean_abap_2_json(pressed) }] });
    return result;
  }

  token({ text, selected, visible, editable } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `Token`, t_prop: [{ n: `key`, v: key }, { n: `text`, v: text }, { n: `selected`, v: selected }, { n: `visible`, v: visible }, { n: `editable`, v: editable }] });
    return result;
  }

  tokens({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `tokens`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  toolbar({ ns, id, press, width, active, ariahaspopup, design, enabled, height, style, visible } = {}) {
    let result = null;
    const lv_name = (false /* TODO(abap2js): NS */ === `table` ? `toolbar` : false /* TODO(abap2js): NS */ === `form` ? `toolbar` : `Toolbar`);
    result = this._generic({ name: lv_name, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `active`, v: z2ui5_cl_util.boolean_abap_2_json(active) }, { n: `ariaHasPopup`, v: ariahaspopup }, { n: `design`, v: design }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `height`, v: height }, { n: `style`, v: style }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `press`, v: press }] });
    return result;
  }

  toolbar_spacer({ ns, width } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ToolbarSpacer`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `width`, v: width }] });
    return result;
  }

  tool_header() {
    let result = null;
    result = this._generic({ name: `ToolHeader`, ns: `tnt` });
    return result;
  }

  tool_page() {
    let result = null;
    result = this._generic({ name: `ToolPage`, ns: `tnt` });
    return result;
  }

  total_horizon() {
    let result = null;
    result = this._generic({ name: `totalHorizon`, ns: `axistime` });
    return result;
  }

  tree({ id, items, headertext, headerlevel, footertext, mode, includeiteminselection, inset, width, toggleopenstate, selectionchange, itempress, select, multiselectmode, nodatatext, shownodata } = {}) {
    let result = null;
    result = this._generic({ name: `Tree`, t_prop: [{ n: `id`, v: id }, { n: `items`, v: items }, { n: `headerText`, v: headertext }, { n: `footerText`, v: footertext }, { n: `mode`, v: mode }, { n: `toggleOpenState`, v: toggleopenstate }, { n: `width`, v: width }, { n: `selectionChange`, v: selectionchange }, { n: `itemPress`, v: itempress }, { n: `select`, v: select }, { n: `multiSelectMode`, v: multiselectmode }, { n: `noDataText`, v: nodatatext }, { n: `headerLevel`, v: headerlevel }, { n: `includeItemInSelection`, v: z2ui5_cl_util.boolean_abap_2_json(includeiteminselection) }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `inset`, v: z2ui5_cl_util.boolean_abap_2_json(inset) }] });
    return result;
  }

  tree_column({ label, template, halign = `Begin`, width } = {}) {
    let result = null;
    result = this._generic({ name: `Column`, ns: `table`, t_prop: [{ n: `label`, v: label }, { n: `template`, v: template }, { n: `hAlign`, v: halign }, { n: `width`, v: width }] });
    return result;
  }

  tree_columns() {
    let result = null;
    result = this._generic({ name: `columns`, ns: `table` });
    return result;
  }

  tree_table({ rows, selectionmode, enablecolumnreordering, expandfirstlevel, columnselect, rowselectionchange, selectionbehavior, id, alternaterowcolors, columnheadervisible, enablecellfilter, enablecolumnfreeze, enablecustomfilter, enableselectall, shownodata, showoverlay, visible, columnheaderheight, firstvisiblerow, fixedcolumncount, threshold, width, usegroupmode, groupheaderproperty, rowactioncount, selectedindex, visiblerowcount, visiblerowcountmode, minautorowcount, fixedbottomrowcount, fixedrowcount, rowheight, toggleopenstate } = {}) {
    let result = null;
    result = this._generic({ name: `TreeTable`, ns: `table`, t_prop: [{ n: `rows`, v: rows }, { n: `selectionMode`, v: selectionmode }, { n: `enableColumnReordering`, v: z2ui5_cl_util.boolean_abap_2_json(enablecolumnreordering) }, { n: `expandFirstLevel`, v: z2ui5_cl_util.boolean_abap_2_json(expandfirstlevel) }, { n: `columnSelect`, v: columnselect }, { n: `rowSelectionChange`, v: rowselectionchange }, { n: `selectionBehavior`, v: selectionbehavior }, { n: `id`, v: id }, { n: `alternateRowColors`, v: z2ui5_cl_util.boolean_abap_2_json(alternaterowcolors) }, { n: `columnHeaderVisible`, v: z2ui5_cl_util.boolean_abap_2_json(columnheadervisible) }, { n: `enableCellFilter`, v: z2ui5_cl_util.boolean_abap_2_json(enablecellfilter) }, { n: `enableColumnFreeze`, v: z2ui5_cl_util.boolean_abap_2_json(enablecolumnfreeze) }, { n: `enableCustomFilter`, v: z2ui5_cl_util.boolean_abap_2_json(enablecustomfilter) }, { n: `enableSelectAll`, v: z2ui5_cl_util.boolean_abap_2_json(enableselectall) }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `showOverlay`, v: z2ui5_cl_util.boolean_abap_2_json(showoverlay) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `columnHeaderHeight`, v: columnheaderheight }, { n: `firstVisibleRow`, v: firstvisiblerow }, { n: `fixedColumnCount`, v: fixedcolumncount }, { n: `threshold`, v: threshold }, { n: `width`, v: width }, { n: `useGroupMode`, v: z2ui5_cl_util.boolean_abap_2_json(usegroupmode) }, { n: `groupHeaderProperty`, v: groupheaderproperty }, { n: `rowActionCount`, v: rowactioncount }, { n: `selectedIndex`, v: selectedindex }, { n: `rowHeight`, v: rowheight }, { n: `fixedRowCount`, v: fixedrowcount }, { n: `fixedBottomRowCount`, v: fixedbottomrowcount }, { n: `minAutoRowCount`, v: minautorowcount }, { n: `visibleRowCount`, v: visiblerowcount }, { n: `toggleOpenState`, v: toggleopenstate }, { n: `visibleRowCountMode`, v: visiblerowcountmode }] });
    return result;
  }

  tree_template() {
    let result = null;
    result = this._generic({ name: `template`, ns: `table` });
    return result;
  }

  tree_extension() {
    let result = null;
    result = this._generic({ ns: `table`, name: `extension` });
    return result;
  }

  two_columns_layout() {
    let result = null;
    result = this._generic({ name: `TwoColumnsLayout`, ns: `nglayout` });
    return result;
  }

  ui_column({ id, width, showsortmenuentry, sortproperty, autoresizable, filterproperty, showfiltermenuentry, defaultfilteroperator, filtertype, halign, minwidth, resizable, visible } = {}) {
    let result = null;
    result = this._generic({ name: `Column`, ns: `table`, t_prop: [{ n: `id`, v: id }, { n: `width`, v: width }, { n: `showSortMenuEntry`, v: showsortmenuentry }, { n: `sortProperty`, v: sortproperty }, { n: `showFilterMenuEntry`, v: showfiltermenuentry }, { n: `autoResizable`, v: z2ui5_cl_util.boolean_abap_2_json(autoresizable) }, { n: `defaultFilterOperator`, v: defaultfilteroperator }, { n: `filterProperty`, v: filterproperty }, { n: `filterType`, v: filtertype }, { n: `hAlign`, v: halign }, { n: `minWidth`, v: minwidth }, { n: `resizable`, v: z2ui5_cl_util.boolean_abap_2_json(resizable) }, { n: `visible`, v: visible }] });
    return result;
  }

  ui_columns() {
    let result = null;
    result = this._generic({ name: `columns`, ns: `table` });
    return result;
  }

  ui_custom_data() {
    let result = null;
    result = this._generic({ name: `customData`, ns: `table` });
    return result;
  }

  ui_extension() {
    let result = null;
    result = this._generic({ name: `extension`, ns: `table` });
    return result;
  }

  ui_row_action() {
    let result = null;
    result = this._generic({ name: `RowAction`, ns: `table` });
    return result;
  }

  ui_row_action_item({ icon, text, press, visible } = {}) {
    let result = null;
    result = this._generic({ name: `RowActionItem`, ns: `table`, t_prop: [{ n: `icon`, v: icon }, { n: `text`, v: text }, { n: `type`, v: type }, { n: `press`, v: press }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  ui_row_action_template() {
    let result = null;
    result = this._generic({ name: `rowActionTemplate`, ns: `table` });
    return result;
  }

  ui_table({ rows, columnheadervisible, editable, class: class_, enablecellfilter, enablegrouping, enableselectall, firstvisiblerow, fixedbottomrowcount, fixedcolumncount, fixedrowcount, minautorowcount, rowactioncount, rowheight, selectionmode, showcolumnvisibilitymenu, shownodata, selectedindex, threshold, visiblerowcount, visiblerowcountmode, alternaterowcolors, footer, filter, sort, rowselectionchange, customfilter, id, flex, selectionbehavior, rowmode } = {}) {
    let result = null;
    result = this._generic({ name: `Table`, ns: `table`, t_prop: [{ n: `rows`, v: rows }, { n: `alternateRowColors`, v: z2ui5_cl_util.boolean_abap_2_json(alternaterowcolors) }, { n: `columnHeaderVisible`, v: columnheadervisible }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `class`, v: class_ }, { n: `enableCellFilter`, v: z2ui5_cl_util.boolean_abap_2_json(enablecellfilter) }, { n: `enableGrouping`, v: z2ui5_cl_util.boolean_abap_2_json(enablegrouping) }, { n: `enableSelectAll`, v: z2ui5_cl_util.boolean_abap_2_json(enableselectall) }, { n: `firstVisibleRow`, v: firstvisiblerow }, { n: `fixedBottomRowCount`, v: fixedbottomrowcount }, { n: `fixedColumnCount`, v: fixedcolumncount }, { n: `rowActionCount`, v: rowactioncount }, { n: `fixedRowCount`, v: fixedrowcount }, { n: `minAutoRowCount`, v: minautorowcount }, { n: `rowHeight`, v: rowheight }, { n: `selectedIndex`, v: selectedindex }, { n: `selectionMode`, v: selectionmode }, { n: `selectionBehavior`, v: selectionbehavior }, { n: `showColumnVisibilityMenu`, v: z2ui5_cl_util.boolean_abap_2_json(showcolumnvisibilitymenu) }, { n: `showNoData`, v: z2ui5_cl_util.boolean_abap_2_json(shownodata) }, { n: `threshold`, v: threshold }, { n: `visibleRowCount`, v: visiblerowcount }, { n: `visibleRowCountMode`, v: visiblerowcountmode }, { n: `footer`, v: footer }, { n: `filter`, v: filter }, { n: `sort`, v: sort }, { n: `customFilter`, v: customfilter }, { n: `id`, v: id }, { n: `fl:flexibility`, v: flex }, { n: `rowSelectionChange`, v: rowselectionchange }, { n: `rowMode`, v: rowmode }] });
    return result;
  }

  ui_template() {
    let result = null;
    result = this._generic({ name: `template`, ns: `table` });
    return result;
  }

  upload_set({ id, instantupload, showicons, uploadenabled, terminationenabled, filetypes, maxfilenamelength, maxfilesize, mediatypes, uploadurl, items, mode, selectionchanged, uploadcompleted, afteritemadded, samefilenameallowed, uploadbuttoninvisible, directory, multiple, dragdropdescription, dragdroptext, nodatatext, nodatadescription, nodataillustrationtype, afteritemedited, afteritemremoved, beforeitemadded, beforeitemedited, beforeitemremoved, beforeuploadstarts, beforeuploadtermination, filenamelengthexceeded, filerenamed, filesizeexceeded, filetypemismatch, itemdragstart, itemdrop, mediatypemismatch, uploadterminated } = {}) {
    let result = null;
    result = this._generic({ name: `UploadSet`, ns: `upload`, t_prop: [{ n: `id`, v: id }, { n: `instantUpload`, v: z2ui5_cl_util.boolean_abap_2_json(instantupload) }, { n: `showIcons`, v: z2ui5_cl_util.boolean_abap_2_json(showicons) }, { n: `uploadEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(uploadenabled) }, { n: `terminationEnabled`, v: z2ui5_cl_util.boolean_abap_2_json(terminationenabled) }, { n: `uploadButtonInvisible`, v: z2ui5_cl_util.boolean_abap_2_json(uploadbuttoninvisible) }, { n: `fileTypes`, v: filetypes }, { n: `maxFileNameLength`, v: maxfilenamelength }, { n: `maxFileSize`, v: maxfilesize }, { n: `mediaTypes`, v: mediatypes }, { n: `items`, v: items }, { n: `uploadUrl`, v: uploadurl }, { n: `mode`, v: mode }, { n: `fileRenamed`, v: filerenamed }, { n: `directory`, v: z2ui5_cl_util.boolean_abap_2_json(directory) }, { n: `multiple`, v: z2ui5_cl_util.boolean_abap_2_json(multiple) }, { n: `dragDropDescription`, v: dragdropdescription }, { n: `dragDropText`, v: dragdroptext }, { n: `noDataText`, v: nodatatext }, { n: `noDataDescription`, v: nodatadescription }, { n: `noDataIllustrationType`, v: nodataillustrationtype }, { n: `afterItemEdited`, v: afteritemedited }, { n: `afterItemRemoved`, v: afteritemremoved }, { n: `beforeItemAdded`, v: beforeitemadded }, { n: `beforeItemEdited`, v: beforeitemedited }, { n: `beforeItemRemoved`, v: beforeitemremoved }, { n: `beforeUploadStarts`, v: beforeuploadstarts }, { n: `beforeUploadTermination`, v: beforeuploadtermination }, { n: `fileNameLengthExceeded`, v: filenamelengthexceeded }, { n: `fileSizeExceeded`, v: filesizeexceeded }, { n: `fileTypeMismatch`, v: filetypemismatch }, { n: `itemDragStart`, v: itemdragstart }, { n: `itemDrop`, v: itemdrop }, { n: `mediaTypeMismatch`, v: mediatypemismatch }, { n: `uploadTerminated`, v: uploadterminated }, { n: `uploadCompleted`, v: uploadcompleted }, { n: `afterItemAdded`, v: afteritemadded }, { n: `sameFilenameAllowed`, v: z2ui5_cl_util.boolean_abap_2_json(samefilenameallowed) }, { n: `selectionChanged`, v: selectionchanged }] });
    return result;
  }

  upload_set_item({ filename, mediatype, url, thumbnailurl, markers, statuses, enablededit, enabledremove, selected, visibleedit, visibleremove, uploadstate, uploadurl, openpressed, removepressed } = {}) {
    let result = null;
    result = this._generic({ name: `UploadSetItem`, ns: `upload`, t_prop: [{ n: `fileName`, v: filename }, { n: `mediaType`, v: mediatype }, { n: `url`, v: url }, { n: `thumbnailUrl`, v: thumbnailurl }, { n: `markers`, v: markers }, { n: `enabledEdit`, v: z2ui5_cl_util.boolean_abap_2_json(enablededit) }, { n: `enabledRemove`, v: z2ui5_cl_util.boolean_abap_2_json(enabledremove) }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `visibleEdit`, v: z2ui5_cl_util.boolean_abap_2_json(visibleedit) }, { n: `visibleRemove`, v: z2ui5_cl_util.boolean_abap_2_json(visibleremove) }, { n: `uploadState`, v: uploadstate }, { n: `uploadUrl`, v: uploadurl }, { n: `openPressed`, v: openpressed }, { n: `removePressed`, v: removepressed }, { n: `statuses`, v: statuses }] });
    return result;
  }

  upload_set_toolbar_placeholder() {
    let result = null;
    result = this._generic({ name: `UploadSetToolbarPlaceholder`, ns: `upload` });
    return result;
  }

  variant_item({ executeonselection, global, labelreadonly, lifecyclepackage, lifecycletransportid, namespace, readonly, executeonselect, author, changeable, enabled, favorite, text, title, textdirection, originaltitle, originalexecuteonselect, remove, rename, originalfavorite, sharing, change } = {}) {
    let result = null;
    result = this._generic({ name: `VariantItem`, ns: `vm`, t_prop: [{ n: `executeOnSelection`, v: z2ui5_cl_util.boolean_abap_2_json(executeonselection) }, { n: `global`, v: z2ui5_cl_util.boolean_abap_2_json(global) }, { n: `labelReadOnly`, v: z2ui5_cl_util.boolean_abap_2_json(labelreadonly) }, { n: `lifecyclePackage`, v: lifecyclepackage }, { n: `lifecycleTransportId`, v: lifecycletransportid }, { n: `namespace`, v: namespace }, { n: `readOnly`, v: readonly }, { n: `executeOnSelect`, v: z2ui5_cl_util.boolean_abap_2_json(executeonselect) }, { n: `author`, v: author }, { n: `changeable`, v: z2ui5_cl_util.boolean_abap_2_json(changeable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `favorite`, v: z2ui5_cl_util.boolean_abap_2_json(favorite) }, { n: `key`, v: key }, { n: `text`, v: text }, { n: `title`, v: title }, { n: `textDirection`, v: textdirection }, { n: `originalTitle`, v: originaltitle }, { n: `originalExecuteOnSelect`, v: z2ui5_cl_util.boolean_abap_2_json(originalexecuteonselect) }, { n: `remove`, v: z2ui5_cl_util.boolean_abap_2_json(remove) }, { n: `rename`, v: z2ui5_cl_util.boolean_abap_2_json(rename) }, { n: `originalFavorite`, v: z2ui5_cl_util.boolean_abap_2_json(originalfavorite) }, { n: `sharing`, v: z2ui5_cl_util.boolean_abap_2_json(sharing) }, { n: `change`, v: change }] });
    return result;
  }

  variant_items() {
    let result = null;
    result = this._generic({ name: `variantItems`, ns: `vm` });
    return result;
  }

  variant_item_sapm({ author, changeable, contexts, executeonselect, favorite, remove, rename, sharing, title, visible, id, textdirection, text, enabled } = {}) {
    let result = null;
    result = this._generic({ name: `VariantItem`, t_prop: [{ n: `id`, v: id }, { n: `author`, v: author }, { n: `changeable`, v: z2ui5_cl_util.boolean_abap_2_json(changeable) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `favorite`, v: z2ui5_cl_util.boolean_abap_2_json(favorite) }, { n: `remove`, v: z2ui5_cl_util.boolean_abap_2_json(remove) }, { n: `rename`, v: z2ui5_cl_util.boolean_abap_2_json(rename) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `contexts`, v: contexts }, { n: `key`, v: key }, { n: `sharing`, v: sharing }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `title`, v: title }, { n: `executeOnSelect`, v: z2ui5_cl_util.boolean_abap_2_json(executeonselect) }] });
    return result;
  }

  variant_management({ defaultvariantkey, enabled, inerrorstate, initialselectionkey, lifecyclesupport, selectionkey, showcreatetile, showexecuteonselection, showsetasdefault, showshare, standarditemauthor, standarditemtext, usefavorites, visible, variantitems, manage, save, select, uservarcreate, id } = {}) {
    let result = null;
    result = this._generic({ name: `VariantManagement`, ns: `vm`, t_prop: [{ n: `defaultVariantKey`, v: defaultvariantkey }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `inErrorState`, v: z2ui5_cl_util.boolean_abap_2_json(inerrorstate) }, { n: `initialSelectionKey`, v: initialselectionkey }, { n: `lifecycleSupport`, v: z2ui5_cl_util.boolean_abap_2_json(lifecyclesupport) }, { n: `selectionKey`, v: selectionkey }, { n: `showCreateTile`, v: z2ui5_cl_util.boolean_abap_2_json(showcreatetile) }, { n: `showExecuteOnSelection`, v: z2ui5_cl_util.boolean_abap_2_json(showexecuteonselection) }, { n: `showSetAsDefault`, v: z2ui5_cl_util.boolean_abap_2_json(showsetasdefault) }, { n: `showShare`, v: z2ui5_cl_util.boolean_abap_2_json(showshare) }, { n: `standardItemAuthor`, v: standarditemauthor }, { n: `standardItemText`, v: standarditemtext }, { n: `useFavorites`, v: z2ui5_cl_util.boolean_abap_2_json(usefavorites) }, { n: `variantItems`, v: variantitems }, { n: `manage`, v: manage }, { n: `save`, v: save }, { n: `select`, v: select }, { n: `id`, v: id }, { n: `variantCreationByUserAllowed`, v: uservarcreate }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  variant_management_fl({ displaytextfsv, editable, executeonselectionforstandflt, headerlevel, inerrorstate, maxwidth, modelname, resetoncontextchange, showsetasdefault, titlestyle, updatevariantinurl } = {}) {
    let result = null;
    result = this._generic({ name: `VariantManagement`, ns: `flvm`, t_prop: /* TODO(abap2js): VALUE FOR/BASE */ [] });
    return result;
  }

  variant_management_sapm({ creationallowed, defaultkey, inerrorstate, level, maxwidth, modified, popovertitle, selectedkey, showfooter, showsaveas, supportapplyautomatically, supportcontexts, supportdefault, supportfavorites, supportpublic, titlestyle, visible, items, cancel, manage, managecancel, save, select, id } = {}) {
    let result = null;
    result = this._generic({ name: `VariantManagement`, t_prop: [{ n: `id`, v: id }, { n: `defaultKey`, v: defaultkey }, { n: `level`, v: level }, { n: `maxWidth`, v: maxwidth }, { n: `popoverTitle`, v: popovertitle }, { n: `selectedKey`, v: selectedkey }, { n: `titleStyle`, v: titlestyle }, { n: `cancel`, v: cancel }, { n: `manage`, v: manage }, { n: `manageCancel`, v: managecancel }, { n: `save`, v: save }, { n: `select`, v: select }, { n: `items`, v: items }, { n: `creationAllowed`, v: z2ui5_cl_util.boolean_abap_2_json(creationallowed) }, { n: `inErrorState`, v: z2ui5_cl_util.boolean_abap_2_json(inerrorstate) }, { n: `modified`, v: z2ui5_cl_util.boolean_abap_2_json(modified) }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `showSaveAs`, v: z2ui5_cl_util.boolean_abap_2_json(showsaveas) }, { n: `supportApplyAutomatically`, v: z2ui5_cl_util.boolean_abap_2_json(supportapplyautomatically) }, { n: `supportContexts`, v: z2ui5_cl_util.boolean_abap_2_json(supportcontexts) }, { n: `supportDefault`, v: z2ui5_cl_util.boolean_abap_2_json(supportdefault) }, { n: `supportFavorites`, v: z2ui5_cl_util.boolean_abap_2_json(supportfavorites) }, { n: `supportPublic`, v: z2ui5_cl_util.boolean_abap_2_json(supportpublic) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  vbox({ id, height, justifycontent, class: class_, rendertype, aligncontent, direction, alignitems, width, wrap, backgrounddesign, displayinline, fitcontainer, visible } = {}) {
    let result = null;
    result = this._generic({ name: `VBox`, t_prop: [{ n: `height`, v: height }, { n: `id`, v: id }, { n: `justifyContent`, v: justifycontent }, { n: `renderType`, v: rendertype }, { n: `alignContent`, v: aligncontent }, { n: `alignItems`, v: alignitems }, { n: `width`, v: width }, { n: `wrap`, v: wrap }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `direction`, v: direction }, { n: `displayInline`, v: z2ui5_cl_util.boolean_abap_2_json(displayinline) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `fitContainer`, v: z2ui5_cl_util.boolean_abap_2_json(fitcontainer) }, { n: `class`, v: class_ }] });
    return result;
  }

  vertical_layout({ class: class_, width, enabled, visible, id } = {}) {
    let result = null;
    result = this._generic({ name: `VerticalLayout`, ns: `layout`, t_prop: [{ n: `id`, v: id }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `class`, v: class_ }, { n: `width`, v: width }] });
    return result;
  }

  view_settings_dialog({ confirm, cancel, filterdetailpageopened, reset, resetfilters, filtersearchoperator, groupdescending, sortdescending, title, titlealignment, selectedgroupitem, selectedpresetfilteritem, selectedsortitem, filteritems, sortitems, groupitems } = {}) {
    let result = null;
    result = this._generic({ name: `ViewSettingsDialog`, t_prop: [{ n: `confirm`, v: confirm }, { n: `cancel`, v: cancel }, { n: `filterDetailPageOpened`, v: filterdetailpageopened }, { n: `reset`, v: reset }, { n: `resetFilters`, v: resetfilters }, { n: `filterSearchOperator`, v: filtersearchoperator }, { n: `groupDescending`, v: z2ui5_cl_util.boolean_abap_2_json(groupdescending) }, { n: `sortDescending`, v: z2ui5_cl_util.boolean_abap_2_json(sortdescending) }, { n: `title`, v: title }, { n: `selectedGroupItem`, v: selectedgroupitem }, { n: `selectedPresetFilterItem`, v: selectedpresetfilteritem }, { n: `selectedSortItem`, v: selectedsortitem }, { n: `filterItems`, v: filteritems }, { n: `sortItems`, v: sortitems }, { n: `groupItems`, v: groupitems }, { n: `titleAlignment`, v: titlealignment }] });
    return result;
  }

  view_settings_filter_item({ enabled, multiselect, selected, text, textdirection } = {}) {
    let result = null;
    result = this._generic({ name: `ViewSettingsFilterItem`, t_prop: [{ n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `key`, v: key }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }, { n: `multiSelect`, v: z2ui5_cl_util.boolean_abap_2_json(multiselect) }] });
    return result;
  }

  view_settings_item({ enabled, selected, text, textdirection } = {}) {
    let result = null;
    result = this._generic({ name: `ViewSettingsItem`, t_prop: [{ n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `key`, v: key }, { n: `selected`, v: z2ui5_cl_util.boolean_abap_2_json(selected) }, { n: `text`, v: text }, { n: `textDirection`, v: textdirection }] });
    return result;
  }

  visible_horizon() {
    let result = null;
    result = this._generic({ name: `visibleHorizon`, ns: `axistime` });
    return result;
  }

  vos() {
    let result = null;
    result = this._generic({ name: `vos`, ns: `vbm` });
    return result;
  }

  wizard({ id, class: class_, backgrounddesign, busy, busyindicatordelay, busyindicatorsize, enablebranching, fieldgroupids, finishbuttontext, height, rendermode, shownextbutton, steptitlelevel, visible, width, complete, navigationchange, stepactivate } = {}) {
    let result = null;
    result = this._generic({ name: `Wizard`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `backgroundDesign`, v: backgrounddesign }, { n: `busy`, v: z2ui5_cl_util.boolean_abap_2_json(busy) }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `enableBranching`, v: z2ui5_cl_util.boolean_abap_2_json(enablebranching) }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `finishButtonText`, v: finishbuttontext }, { n: `height`, v: height }, { n: `renderMode`, v: rendermode }, { n: `showNextButton`, v: z2ui5_cl_util.boolean_abap_2_json(shownextbutton) }, { n: `stepTitleLevel`, v: steptitlelevel }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `width`, v: width }, { n: `complete`, v: complete }, { n: `navigationChange`, v: navigationchange }, { n: `stepActivate`, v: stepactivate }] });
    return result;
  }

  wizard_step({ id, busy, busyindicatordelay, busyindicatorsize, fieldgroupids, icon, title, validated, visible, activate, subsequentsteps, nextstep, complete } = {}) {
    let result = null;
    result = this._generic({ name: `WizardStep`, t_prop: [{ n: `id`, v: id }, { n: `busy`, v: z2ui5_cl_util.boolean_abap_2_json(busy) }, { n: `busyIndicatorDelay`, v: busyindicatordelay }, { n: `busyIndicatorSize`, v: busyindicatorsize }, { n: `fieldGroupIds`, v: fieldgroupids }, { n: `icon`, v: icon }, { n: `optional`, v: z2ui5_cl_util.boolean_abap_2_json(optional) }, { n: `title`, v: title }, { n: `validated`, v: z2ui5_cl_util.boolean_abap_2_json(validated) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `activate`, v: activate }, { n: `complete`, v: complete }, { n: `nextStep`, v: nextstep }, { n: `subsequentSteps`, v: subsequentsteps }] });
    return result;
  }

  xml_get() {
    let result = ``;
    let lt_parts = [];
    this.xml_get_parts({ ct_parts: { ct_parts: lt_parts } });
    result = /* TODO(abap2js) */ concat_lines_of(lt_parts);
    return result;
  }

  xml_get_parts({ ct_parts } = {}) {
    let sy_tabix = 0;
    let ls_prop;
    if (this.mv_name === `ZZPLAIN`) {
      ct_parts.push(this.mt_prop.find((row) => row.n === `VALUE`).v);
      return;
    }
    if (this === this.mo_root) {
      if (!z2ui5_cl_xml_view.st_ns_map) {
        z2ui5_cl_xml_view.st_ns_map = [{ n: `z2ui5`, v: `z2ui5.cc` }, { n: `layout`, v: `sap.ui.layout` }, { n: `networkgraph`, v: `sap.suite.ui.commons.networkgraph` }, { n: `nglayout`, v: `sap.suite.ui.commons.networkgraph.layout` }, { n: `ngcustom`, v: `sap.suite.ui.commons.sample.NetworkGraphCustomRendering` }, { n: `table`, v: `sap.ui.table` }, { n: `template`, v: `http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1` }, { n: `customData`, v: `http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1` }, { n: `f`, v: `sap.f` }, { n: `columnmenu`, v: `sap.m.table.columnmenu` }, { n: `card`, v: `sap.f.cards` }, { n: `dnd`, v: `sap.ui.core.dnd` }, { n: `dnd-grid`, v: `sap.f.dnd` }, { n: `grid`, v: `sap.ui.layout.cssgrid` }, { n: `form`, v: `sap.ui.layout.form` }, { n: `editor`, v: `sap.ui.codeeditor` }, { n: `mchart`, v: `sap.suite.ui.microchart` }, { n: `smartFilterBar`, v: `sap.ui.comp.smartfilterbar` }, { n: `smartVariantManagement`, v: `sap.ui.comp.smartvariants` }, { n: `smartTable`, v: `sap.ui.comp.smarttable` }, { n: `webc`, v: `sap.ui.webc.main` }, { n: `uxap`, v: `sap.uxap` }, { n: `sap`, v: `sap` }, { n: `text`, v: `sap.ui.richtexteditor` }, { n: `html`, v: `http://www.w3.org/1999/xhtml` }, { n: `fb`, v: `sap.ui.comp.filterbar` }, { n: `u`, v: `sap.ui.unified` }, { n: `gantt`, v: `sap.gantt.simple` }, { n: `axistime`, v: `sap.gantt.axistime` }, { n: `config`, v: `sap.gantt.config` }, { n: `shapes`, v: `sap.gantt.simple.shapes` }, { n: `commons`, v: `sap.suite.ui.commons` }, { n: `si`, v: `sap.suite.ui.commons.statusindicator` }, { n: `vm`, v: `sap.ui.comp.variants` }, { n: `viz`, v: `sap.viz.ui5.controls` }, { n: `viz.data`, v: `sap.viz.ui5.data` }, { n: `viz.feeds`, v: `sap.viz.ui5.controls.common.feeds` }, { n: `vk`, v: `sap.ui.vk` }, { n: `vbm`, v: `sap.ui.vbm` }, { n: `ndc`, v: `sap.ndc` }, { n: `svm`, v: `sap.ui.comp.smartvariants` }, { n: `flvm`, v: `sap.ui.fl.variants` }, { n: `p13n`, v: `sap.m.p13n` }, { n: `upload`, v: `sap.m.upload` }, { n: `fl`, v: `sap.ui.fl` }, { n: `plugins`, v: `sap.m.plugins` }, { n: `tnt`, v: `sap.tnt` }, { n: `mdc`, v: `sap.ui.mdc` }, { n: `trm`, v: `sap.ui.table.rowmodes` }, { n: `smi`, v: `sap.ui.comp.smartmultiinput` }, { n: `ie`, v: `sap.suite.ui.commons.imageeditor` }];
      }
      sy_tabix = 0;
      for (const lr_ns of this.mt_ns) {
        sy_tabix++;
        if (!(lr_ns.table_line && lr_ns.table_line !== `mvc` && lr_ns.table_line !== `core`)) continue;
        try {
          ls_prop = z2ui5_cl_xml_view.st_ns_map.find((row) => row.n === lr_ns);
          this.mt_prop.push({ n: `xmlns:${ls_prop.n}`, v: ls_prop.v });
        } catch (error) {
          throw new z2ui5_cx_util_error({ val: `XML_VIEW_ERROR_NO_NAMESPACE_FOUND_FOR: ${lr_ns}` });
        }
      }
    }
    const lv_tmp2 = (this.mv_ns !== `` ? `${this.mv_ns}:` : null);
    const lv_tmp3 = /* TODO(abap2js): REDUCE */ null;
    if (!this.mt_child) {
      ct_parts.push(` <${lv_tmp2}${this.mv_name}${lv_tmp3}/>`);
      return;
    }
    ct_parts.push(` <${lv_tmp2}${this.mv_name}${lv_tmp3}>`);
    sy_tabix = 0;
    for (const lr_child of this.mt_child) {
      sy_tabix++;
      (lr_child).xml_get_parts({ ct_parts });
    }
    ct_parts.push(`</${lv_tmp2}${this.mv_name}>`);
  }

  _cc_plain_xml({ val } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ZZPLAIN`, ns: `html`, t_prop: [{ n: `VALUE`, v: val }] });
    return result;
  }

  _generic({ name, ns, t_prop } = {}) {
    let result = null;
    try {
      this.mo_root.mt_ns.push((false /* TODO(abap2js): NS */));
    } catch (error) {
    }
    const result2 = new z2ui5_cl_xml_view();
    result2.mv_name = z2ui5_cl_util.abap_copy(name);
    result2.mv_ns = false /* TODO(abap2js): NS */;
    result2.mt_prop = z2ui5_cl_util.abap_copy(t_prop);
    result2.mo_parent = z2ui5_cl_util.abap_copy(this);
    result2.mo_root = z2ui5_cl_util.abap_copy(this.mo_root);
    this.mt_child.push(result2);
    this.mo_root.mo_previous = z2ui5_cl_util.abap_copy(result2);
    result = z2ui5_cl_util.abap_copy(result2);
    return result;
  }

  _generic_property({ val } = {}) {
    let result = null;
    this.mt_prop.push(val);
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  _z2ui5() {
    let result = null;
    result = new z2ui5_cl_xml_view_cc(this);
    return result;
  }

  p_cell_selector({ id } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `CellSelector`, ns: `plugins`, t_prop: [{ n: `id`, v: id }] });
    return result;
  }

  p_copy_provider({ id, extract_data, copy } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `CopyProvider`, ns: `plugins`, t_prop: [{ n: `id`, v: id }, { n: `copy`, v: copy }, { n: `extractData`, v: extract_data }] });
    return result;
  }

  date_range_selection({ value, placeholder, displayformat, valueformat, required, valuestate, valuestatetext, enabled, showcurrentdatebutton, change, hideinput, showfooter, visible, showvaluestatemessage, mindate, maxdate, editable, width, id, calendarweeknumbering, displayformattype, class: class_, textdirection, textalign, name, datevalue, seconddatevalue, initialfocuseddatevalue, delimiter } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `DateRangeSelection`, t_prop: [{ n: `value`, v: value }, { n: `displayFormat`, v: displayformat }, { n: `displayFormatType`, v: displayformattype }, { n: `valueFormat`, v: valueformat }, { n: `required`, v: z2ui5_cl_util.boolean_abap_2_json(required) }, { n: `valueState`, v: valuestate }, { n: `valueStateText`, v: valuestatetext }, { n: `placeholder`, v: placeholder }, { n: `textAlign`, v: textalign }, { n: `textDirection`, v: textdirection }, { n: `change`, v: change }, { n: `maxDate`, v: maxdate }, { n: `minDate`, v: mindate }, { n: `width`, v: width }, { n: `id`, v: id }, { n: `dateValue`, v: datevalue }, { n: `secondDateValue`, v: seconddatevalue }, { n: `name`, v: name }, { n: `class`, v: class_ }, { n: `calendarWeekNumbering`, v: calendarweeknumbering }, { n: `initialFocusedDateValue`, v: initialfocuseddatevalue }, { n: `enabled`, v: z2ui5_cl_util.boolean_abap_2_json(enabled) }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `hideInput`, v: z2ui5_cl_util.boolean_abap_2_json(hideinput) }, { n: `showFooter`, v: z2ui5_cl_util.boolean_abap_2_json(showfooter) }, { n: `showValueStateMessage`, v: z2ui5_cl_util.boolean_abap_2_json(showvaluestatemessage) }, { n: `showCurrentDateButton`, v: z2ui5_cl_util.boolean_abap_2_json(showcurrentdatebutton) }, { n: `delimiter`, v: delimiter }] });
    return result;
  }

  toolbar_layout_data({ id, maxwidth, minwidth, shrinkable } = {}) {
    let result = null;
    result = this._generic({ name: `ToolbarLayoutData`, t_prop: [{ n: `id`, v: id }, { n: `maxWidth`, v: maxwidth }, { n: `minWidth`, v: minwidth }, { n: `shrinkable`, v: z2ui5_cl_util.boolean_abap_2_json(shrinkable) }] });
    return result;
  }

  feed_content({ contenttext, subheader, value, class: class_, press } = {}) {
    let result = null;
    result = this._generic({ name: `FeedContent`, t_prop: [{ n: `contentText`, v: contenttext }, { n: `subheader`, v: subheader }, { n: `value`, v: value }, { n: `class`, v: class_ }, { n: `press`, v: press }] });
    return result;
  }

  news_content({ contenttext, subheader, press } = {}) {
    let result = null;
    result = this._generic({ name: `NewsContent`, t_prop: [{ n: `contentText`, v: contenttext }, { n: `subheader`, v: subheader }, { n: `press`, v: press }] });
    return result;
  }

  splitter({ height, orientation, width } = {}) {
    let result = null;
    result = this._generic({ name: `Splitter`, ns: `layout`, t_prop: [{ n: `height`, v: height }, { n: `orientation`, v: orientation }, { n: `width`, v: width }] });
    return result;
  }

  invisible_text({ ns, id, text } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `InvisibleText`, t_prop: [{ n: `id`, v: id }, { n: `text`, v: text }] });
    return result;
  }

  fix_content({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `fixContent` });
    return result;
  }

  fix_flex({ ns, class: class_, fixcontentsize } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `FixFlex`, t_prop: [{ n: `class`, v: class_ }, { n: `fixContentSize`, v: fixcontentsize }] });
    return result;
  }

  flex_content({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `flexContent` });
    return result;
  }

  side_navigation({ id, class: class_, selectedkey } = {}) {
    let result = null;
    result = this._generic({ name: `SideNavigation`, ns: `tnt`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `selectedKey`, v: selectedkey }] });
    return result;
  }

  navigation_list() {
    let result = null;
    result = this._generic({ name: `NavigationList`, ns: `tnt` });
    return result;
  }

  navigation_list_item({ text, icon, select, href } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `NavigationListItem`, ns: `tnt`, t_prop: [{ n: `text`, v: text }, { n: `icon`, v: icon }, { n: `href`, v: href }, { n: `key`, v: key }, { n: `select`, v: select }] });
    return result;
  }

  fixed_item() {
    let result = null;
    result = this._generic({ name: `fixedItem`, ns: `tnt` });
    return result;
  }

  content_areas({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `contentAreas`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  field({ ns, id, value, editmode, showemptyindicator } = {}) {
    let result = null;
    result = this._generic({ name: `Field`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `id`, v: id }, { n: `value`, v: value }, { n: `editMode`, v: editmode }, { n: `showEmptyIndicator`, v: z2ui5_cl_util.boolean_abap_2_json(showemptyindicator) }] });
    return result;
  }

  color_picker({ colorstring, displaymode, change, livechange } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ ns: `u`, name: `ColorPicker`, t_prop: [{ n: `colorString`, v: colorstring }, { n: `displayMode`, v: displaymode }, { n: `change`, v: change }, { n: `liveChange`, v: livechange }] });
    return result;
  }

  tiles() {
    let result = null;
    result = this._generic({ name: `tiles` });
    return result;
  }

  analytical_column({ ns } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `AnalyticalColumn` });
    return result;
  }

  analytical_table({ ns, selectionmode, rowmode, toolbar, columns } = {}) {
    let result = null;
    result = this._generic({ name: `AnalyticalTable`, ns: false /* TODO(abap2js): NS */, t_prop: [{ n: `selectionMode`, v: selectionmode }, { n: `rowMode`, v: rowmode }, { n: `toolbar`, v: toolbar }, { n: `columns`, v: columns }] });
    return result;
  }

  auto({ ns, rowcontentheight } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `Auto`, t_prop: [{ n: `rowContentHeight`, v: rowcontentheight }] });
    return result;
  }

  rowmode({ ns } = {}) {
    let result = null;
    result = this._generic({ name: `rowMode`, ns: false /* TODO(abap2js): NS */ });
    return result;
  }

  breadcrumbs({ ns, link, id, class: class_, currentlocationtext, separatorstyle, visible } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `Breadcrumbs`, t_prop: [{ n: `links`, v: link }, { n: `id`, v: id }, { n: `class`, v: class_ }, { n: `currentLocationText`, v: currentlocationtext }, { n: `separatorStyle`, v: separatorstyle }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }] });
    return result;
  }

  current_location({ ns, link } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `currentLocation`, t_prop: [{ n: `link`, v: link }] });
    return result;
  }

  color_palette({ ns, colorselect } = {}) {
    let result = null;
    result = this._generic({ ns: false /* TODO(abap2js): NS */, name: `ColorPalette`, t_prop: [{ n: `colorSelect`, v: colorselect }] });
    return result;
  }

  harveyballmicrochartitem({ id, color, fraction, fractionscale, class: class_ } = {}) {
    let result = null;
    result = this._generic({ name: `HarveyBallMicroChartItem`, ns: `mchart`, t_prop: [{ n: `id`, v: id }, { n: `class`, v: class_ }, { n: `fraction`, v: fraction }, { n: `color`, v: color }, { n: `fractionScale`, v: fractionscale }] });
    return result;
  }

  smart_filter_bar({ id, persistencykey, entityset } = {}) {
    let result = null;
    result = this._generic({ name: `SmartFilterBar`, ns: `smartFilterBar`, t_prop: [{ n: `id`, v: id }, { n: `entitySet`, v: entityset }, { n: `persistencyKey`, v: persistencykey }] });
    return result;
  }

  control_configuration({ id, previnitdatafetchinvalhelpdia, visibleinadvancedarea } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this._generic({ name: `ControlConfiguration`, ns: `smartFilterBar`, t_prop: [{ n: `id`, v: id }, { n: `key`, v: key }, { n: `visibleInAdvancedArea`, v: z2ui5_cl_util.boolean_abap_2_json(visibleinadvancedarea) }, { n: `preventInitialDataFetchInValueHelpDialog`, v: z2ui5_cl_util.boolean_abap_2_json(previnitdatafetchinvalhelpdia) }] });
    return result;
  }

  smart_table({ id, smartfilterid, tabletype, editable, initiallyvisiblefields, entityset, usevariantmanagement, useexporttoexcel, usetablepersonalisation, header, showrowcount, enableexport, enableautobinding } = {}) {
    let result = null;
    result = this._generic({ name: `SmartTable`, ns: `smartTable`, t_prop: [{ n: `id`, v: id }, { n: `smartFilterId`, v: smartfilterid }, { n: `tableType`, v: tabletype }, { n: `editable`, v: z2ui5_cl_util.boolean_abap_2_json(editable) }, { n: `initiallyVisibleFields`, v: initiallyvisiblefields }, { n: `entitySet`, v: entityset }, { n: `useVariantManagement`, v: z2ui5_cl_util.boolean_abap_2_json(usevariantmanagement) }, { n: `useExportToExcel`, v: z2ui5_cl_util.boolean_abap_2_json(useexporttoexcel) }, { n: `useTablePersonalisation`, v: z2ui5_cl_util.boolean_abap_2_json(usetablepersonalisation) }, { n: `header`, v: header }, { n: `showRowCount`, v: z2ui5_cl_util.boolean_abap_2_json(showrowcount) }, { n: `enableExport`, v: z2ui5_cl_util.boolean_abap_2_json(enableexport) }, { n: `enableAutoBinding`, v: z2ui5_cl_util.boolean_abap_2_json(enableautobinding) }] });
    return result;
  }

  _control_configuration() {
    let result = null;
    result = this._generic({ name: `controlConfiguration`, ns: `smartFilterBar` });
    return result;
  }

  viz_dataset() {
    let result = null;
    result = this._generic({ name: `dataset`, ns: `viz` });
    return result;
  }

  viz_dimensions() {
    let result = null;
    result = this._generic({ name: `dimensions`, ns: `viz.data` });
    return result;
  }

  viz_dimension_definition({ axis, datatype, displayvalue, identity, name, sorter, value } = {}) {
    let result = null;
    result = this._generic({ name: `DimensionDefinition`, ns: `viz.data`, t_prop: [{ n: `axis`, v: axis }, { n: `dataType`, v: datatype }, { n: `displayValue`, v: displayvalue }, { n: `identity`, v: identity }, { n: `name`, v: name }, { n: `sorter`, v: sorter }, { n: `value`, v: value }] });
    return result;
  }

  viz_feeds() {
    let result = null;
    result = this._generic({ name: `feeds`, ns: `viz` });
    return result;
  }

  viz_feed_item({ id, uid, values } = {}) {
    let result = null;
    result = this._generic({ name: `FeedItem`, ns: `viz.feeds`, t_prop: [{ n: `id`, v: id }, { n: `uid`, v: uid }, { n: `type`, v: type }, { n: `values`, v: values }] });
    return result;
  }

  viz_flattened_dataset({ data } = {}) {
    let result = null;
    result = this._generic({ name: `FlattenedDataset`, ns: `viz.data`, t_prop: [{ n: `data`, v: data }] });
    return result;
  }

  viz_frame({ id, legendvisible, vizcustomizations, vizproperties, vizscales, viztype, height, width, uiconfig = `{applicationSet:'fiori'}`, visible, selectdata } = {}) {
    let result = null;
    let lv_vizproperties = ``;
    if (!vizproperties) {
      lv_vizproperties = `{` + ` ` + `"plotArea": {` + ` ` + `"dataLabel": {` + ` ` + `"formatString": "",` + ` ` + `"visible": false` + ` ` + `}` + ` ` + `},` + ` ` + `"valueAxis": {` + ` ` + `"label": {` + ` ` + `"formatString": ""` + ` ` + `},` + ` ` + `"title": {` + ` ` + `"visible": false` + ` ` + `}` + ` ` + `},` + ` ` + `"categoryAxis": {` + ` ` + `"title": {` + ` ` + `"visible": false` + ` ` + `}` + ` ` + `},` + ` ` + `"title": {` + ` ` + `"visible": false,` + ` ` + `"text": ""` + ` ` + `}` + ` ` + `}`;
    } else {
      lv_vizproperties = z2ui5_cl_util.abap_copy(vizproperties);
    }
    result = this._generic({ name: `VizFrame`, ns: `viz`, t_prop: [{ n: `id`, v: id }, { n: `legendVisible`, v: legendvisible }, { n: `vizCustomizations`, v: vizcustomizations }, { n: `vizProperties`, v: lv_vizproperties }, { n: `vizScales`, v: vizscales }, { n: `vizType`, v: viztype }, { n: `height`, v: height }, { n: `width`, v: width }, { n: `uiConfig`, v: uiconfig }, { n: `visible`, v: z2ui5_cl_util.boolean_abap_2_json(visible) }, { n: `selectData`, v: selectdata }] });
    return result;
  }

  viz_measures() {
    let result = null;
    result = this._generic({ name: `measures`, ns: `viz.data` });
    return result;
  }

  viz_measure_definition({ format, group, identity, name, range, unit, value } = {}) {
    let result = null;
    result = this._generic({ name: `MeasureDefinition`, ns: `viz.data`, t_prop: [{ n: `format`, v: format }, { n: `group`, v: group }, { n: `identity`, v: identity }, { n: `name`, v: name }, { n: `range`, v: range }, { n: `unit`, v: unit }, { n: `value`, v: value }] });
    return result;
  }

  smart_multi_input({ id, entityset, value, supportranges = `false`, enableodataselect = `false`, requestatleastfields, singletokenmode = `false`, supportmultiselect = `true`, textseparator, textlabel, tooltiplabel, textineditmodesource = `None`, mandatory = `false`, maxlength = `0` } = {}) {
    let result = null;
    result = this._generic({ name: `SmartMultiInput`, ns: `smi`, t_prop: [{ n: `id`, v: id }, { n: `value`, v: value }, { n: `entitySet`, v: entityset }, { n: `supportRanges`, v: supportranges }, { n: `enableODataSelect`, v: enableodataselect }, { n: `requestAtLeastFields`, v: requestatleastfields }, { n: `singleTokenMode`, v: singletokenmode }, { n: `supportMultiSelect`, v: supportmultiselect }, { n: `textSeparator`, v: textseparator }, { n: `textLabel`, v: textlabel }, { n: `tooltipLabel`, v: tooltiplabel }, { n: `textInEditModeSource`, v: textineditmodesource }, { n: `mandatory`, v: mandatory }, { n: `maxLength`, v: maxlength }] });
    return result;
  }

  overflow_toolbar_layout_data({ priority, group, closeoverflowoninteraction } = {}) {
    let result = null;
    result = this._generic({ name: `OverflowToolbarLayoutData`, t_prop: [{ n: `closeOverflowOnInteraction`, v: z2ui5_cl_util.boolean_abap_2_json(closeoverflowoninteraction) }, { n: `group`, v: group }, { n: `priority`, v: priority }] });
    return result;
  }

  row_settings({ highlight, highlighttext, navigated } = {}) {
    let result = null;
    result = this._generic({ name: `RowSettings`, ns: `table`, t_prop: [{ n: `highlight`, v: highlight }, { n: `highlightText`, v: highlighttext }, { n: `navigated`, v: z2ui5_cl_util.boolean_abap_2_json(navigated) }] });
    return result;
  }

  image_editor({ id, customshapesrc, keepcropaspectratio, keepresizeaspectratio, scalecroparea, customshapesrctype, src } = {}) {
    let result = null;
    result = this._generic({ name: `ImageEditor`, ns: `ie`, t_prop: [{ n: `id`, v: id }, { n: `customShapeSrc`, v: customshapesrc }, { n: `keepCropAspectRatio`, v: z2ui5_cl_util.boolean_abap_2_json(keepcropaspectratio) }, { n: `keepResizeAspectRatio`, v: z2ui5_cl_util.boolean_abap_2_json(keepresizeaspectratio) }, { n: `scaleCropArea`, v: scalecroparea }, { n: `customShapeSrcType`, v: customshapesrctype }, { n: `src`, v: src }] });
    return result;
  }

  image_editor_container({ id, enabledbuttons, mode } = {}) {
    let result = null;
    result = this._generic({ name: `ImageEditorContainer`, ns: `ie`, t_prop: [{ n: `id`, v: id }, { n: `enabledButtons`, v: enabledbuttons }, { n: `mode`, v: mode }] });
    return result;
  }
}

module.exports = z2ui5_cl_xml_view;
