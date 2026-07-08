class z2ui5_cl_xml_view {

  oRoot = {};
  oParent;
  aChild = [];

  name;
  ns;
  aProp = [];
  _isPopup = false;  // root-only flag — toggled by factory_popup()
  _usedNs = new Set();  // root-only — every ns prefix used anywhere in the tree

  constructor(opts = {}) {
    this.oRoot = this;
    this._isPopup = !!opts.popup;
  }

  /** Default: full XMLView root (for use with client.view_display). */
  static factory() {
    return new z2ui5_cl_xml_view();
  }

  /**
   * Popup/Fragment root (for use with client.popup_display / popover_display).
   * Frontend Fragment.load expects a <core:FragmentDefinition> root so it can
   * return the wrapped Dialog/Popover (with .open()) directly — wrapping in
   * <mvc:View> would return a View instance which has no .open() method.
   */
  static factory_popup() {
    return new z2ui5_cl_xml_view({ popup: true });
  }

  // --- Core ---

  // Prefix → namespace URI map, mirrored from the abap original's st_ns_map
  // (z2ui5_cl_xml_view->xml_get_parts). Baseline prefixes (see
  // _renderRootOpen) are always declared; any further prefix used in the tree
  // is collected in the root's _usedNs and declared on demand from this map.
  static NS_MAP = {
    m: `sap.m`,
    mvc: `sap.ui.core.mvc`,
    core: `sap.ui.core`,
    l: `sap.ui.layout`,
    u: `sap.ui.unified`,
    unified: `sap.ui.unified`,
    z2ui5: `z2ui5`,
    layout: `sap.ui.layout`,
    networkgraph: `sap.suite.ui.commons.networkgraph`,
    nglayout: `sap.suite.ui.commons.networkgraph.layout`,
    ngcustom: `sap.suite.ui.commons.sample.NetworkGraphCustomRendering`,
    table: `sap.ui.table`,
    template: `http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1`,
    customData: `http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1`,
    f: `sap.f`,
    columnmenu: `sap.m.table.columnmenu`,
    card: `sap.f.cards`,
    dnd: `sap.ui.core.dnd`,
    "dnd-grid": `sap.f.dnd`,
    grid: `sap.ui.layout.cssgrid`,
    form: `sap.ui.layout.form`,
    editor: `sap.ui.codeeditor`,
    mchart: `sap.suite.ui.microchart`,
    smartFilterBar: `sap.ui.comp.smartfilterbar`,
    smartVariantManagement: `sap.ui.comp.smartvariants`,
    smartTable: `sap.ui.comp.smarttable`,
    webc: `sap.ui.webc.main`,
    uxap: `sap.uxap`,
    sap: `sap`,
    text: `sap.ui.richtexteditor`,
    html: `http://www.w3.org/1999/xhtml`,
    fb: `sap.ui.comp.filterbar`,
    gantt: `sap.gantt.simple`,
    axistime: `sap.gantt.axistime`,
    config: `sap.gantt.config`,
    shapes: `sap.gantt.simple.shapes`,
    commons: `sap.suite.ui.commons`,
    si: `sap.suite.ui.commons.statusindicator`,
    vm: `sap.ui.comp.variants`,
    viz: `sap.viz.ui5.controls`,
    "viz.data": `sap.viz.ui5.data`,
    "viz.feeds": `sap.viz.ui5.controls.common.feeds`,
    vk: `sap.ui.vk`,
    vbm: `sap.ui.vbm`,
    ndc: `sap.ndc`,
    svm: `sap.ui.comp.smartvariants`,
    flvm: `sap.ui.fl.variants`,
    p13n: `sap.m.p13n`,
    upload: `sap.m.upload`,
    fl: `sap.ui.fl`,
    plugins: `sap.m.plugins`,
    tnt: `sap.tnt`,
    mdc: `sap.ui.mdc`,
    trm: `sap.ui.table.rowmodes`,
    smi: `sap.ui.comp.smartmultiinput`,
    ie: `sap.suite.ui.commons.imageeditor`,
  };

  // Prefixes declared unconditionally on every root (kept from the previous
  // hardcoded list so existing output stays stable).
  static BASE_NS = ["m", "core", "f", "form", "l", "mvc", "table", "unified", "upload", "uxap", "z2ui5"];

  _renderExtraNs() {
    let result = "";
    for (const prefix of [...this.oRoot._usedNs].sort()) {
      if (z2ui5_cl_xml_view.BASE_NS.includes(prefix)) continue;
      const uri = z2ui5_cl_xml_view.NS_MAP[prefix];
      if (!uri) {
        throw new Error(`XML_VIEW_ERROR_NO_NAMESPACE_FOUND_FOR: ${prefix}`);
      }
      result += ` xmlns:${prefix}="${uri}"`;
    }
    return result;
  }

  _renderRootOpen() {
    // xmlns="sap.m" mirrors the abap original's default namespace — any
    // un-prefixed tag resolves to sap.m instead of the null namespace (which
    // UI5 would try to load as a module, e.g. `null/content.js`).
    if (this._isPopup) {
      return `<core:FragmentDefinition xmlns="sap.m" xmlns:m="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.f" xmlns:form="sap.ui.layout.form" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:table="sap.ui.table" xmlns:unified="sap.ui.unified" xmlns:upload="sap.m.upload" xmlns:uxap="sap.uxap" xmlns:z2ui5="z2ui5"${this._renderExtraNs()}`;
    }
    return `<mvc:View xmlns="sap.m" xmlns:m="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.f" xmlns:form="sap.ui.layout.form" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:table="sap.ui.table" xmlns:unified="sap.ui.unified" xmlns:upload="sap.m.upload" xmlns:uxap="sap.uxap" xmlns:z2ui5="z2ui5"${this._renderExtraNs()} displayBlock="true" height="100%"`;
  }

  _renderRootClose() {
    return this._isPopup ? `</core:FragmentDefinition>` : `</mvc:View>`;
  }

  /**
   * Escapes the 3 chars XML requires inside double-quoted attribute values.
   * `>` and `'` are technically valid unescaped in this context per XML 1.0,
   * so we leave them readable. UI5's XML parser unescapes the rest back during
   * view parsing — URLs with `&`, expressions with `<` etc. survive the trip.
   */
  static _xmlAttrEscape(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  // Always renders the full tree from the root, regardless of which node it's
  // called on — so the abap-style chain `view = factory().Shell().Page(...)...;
  // view.stringify()` produces the same output as keeping a separate root ref.
  stringify() {
    return this.oRoot._renderXml();
  }

  _renderXml() {
    // Raw XML/CSS/JS injection (_cc_plain_xml) — the abap original emits the
    // VALUE untouched instead of rendering a <ZZPLAIN> tag.
    if (this.name === "ZZPLAIN") {
      const value = this.aProp.find((prop) => prop.n === "VALUE");
      return value?.v ?? "";
    }
    let result;
    if (this === this.oRoot) {
      result = this._renderRootOpen();
    } else {
      if (this.ns && this.ns !== "") {
        result = `<${this.ns}:${this.name} `;
      } else {
        result = `<${this.name} `;
      }
      for (const prop of this.aProp) {
        if (prop.v !== undefined && prop.v !== null) {
          result += `${prop.n}="${z2ui5_cl_xml_view._xmlAttrEscape(prop.v)}" `;
        }
      }
    }

    if (this.aChild.length > 0) {
      result += `>`;
      for (const child of this.aChild) {
        result += child._renderXml();
      }
      if (this !== this.oRoot) {
        if (this.ns && this.ns !== "") {
          result += `</${this.ns}:${this.name}>`;
        } else {
          result += `</${this.name}>`;
        }
      }
    } else {
      result += `/>`;
    }

    if (this === this.oRoot) {
      result += this._renderRootClose();
    }

    return result;
  }

  get_parent() {
    return this.oParent;
  }

  /**
   * Returns a z2ui5_cl_xml_view_cc wrapper bound to this view — mirrors abap
   * z2ui5_cl_xml_view->_z2ui5( ). Use as `view._z2ui5().info({...})`.
   */
  _z2ui5() {
    const Cc = require("./z2ui5_cl_xml_view_cc");
    return new Cc(this);
  }

  /**
   * Returns the most recently added child — mirrors abap2UI5 z2ui5_cl_xml_view->get( ).
   *
   * Useful after a "leaf" call (Input, CheckBox, Button, …) which returns the
   * parent for chaining; .get() then dives back into the just-created leaf so
   * one can attach an aggregation. Example:
   *
   *   form.Input({ ..., suggestionItems: bind, showSuggestion: true })
   *       .get().suggestionItems().ListItem({ ... });
   */
  get() {
    return this.aChild[this.aChild.length - 1] || this;
  }

  generic(val) {
    const oResult = new z2ui5_cl_xml_view();
    oResult.oParent = this;
    oResult.oRoot = this.oRoot;
    this.aChild.push(oResult);

    oResult.name = val.name;
    oResult.ns = val.ns || "";
    if (oResult.ns) this.oRoot._usedNs.add(oResult.ns);
    for (const prop of val.aProp) {
      oResult.aProp.push(prop);
    }

    return oResult;
  }

  // Helper: add child and return PARENT (for leaf elements like Input, Button, Text)
  _leaf(val) {
    this.generic(val);
    return this;
  }

  // Helper: add child and return CHILD (for container elements like Page, VBox)
  _container(val) {
    return this.generic(val);
  }

  _filterProps(props) {
    return props.filter((p) => p.v !== undefined && p.v !== null);
  }

  /**
   * Resolves the namespace of an aggregation accessor (content, items,
   * footer, …). Transpiled abap call sites pass the ns positionally as a
   * string (`content(`form`)`), JS call sites pass `{ ns }`, and bare calls
   * inherit the parent element's namespace — aggregation tags must live in
   * the same namespace as their parent control, otherwise UI5 resolves them
   * as controls of the null namespace and requests e.g. `null/content.js`.
   */
  _aggNs(args) {
    const ns = typeof args === "string" ? args : args?.ns;
    return ns || this.ns || "m";
  }

  boolean_abap_2_json(value) {
    if (value === undefined || value === null) return undefined;
    if (value === true || value === "true" || value === "X") return "true";
    if (value === false || value === "false" || value === "") return "false";
    return value;
  }

  // ========================================================
  // LAYOUT CONTAINERS
  // ========================================================

  Shell(props = {}) {
    return this._container({
      name: "Shell", 
      ns: "m",
      aProp: this._filterProps([]),
    });
  }

  Page({ id, title, showNavButton, showHeader, navButtonPress, class: cssClass } = {}) {
    return this._container({
      name: "Page",
      ns: "m",
      aProp: this._filterProps([
        { n: "id", v: id },
        { n: "title", v: title },
        { n: "showNavButton", v: this.boolean_abap_2_json(showNavButton) },
        { n: "showHeader", v: this.boolean_abap_2_json(showHeader) },
        { n: "navButtonPress", v: navButtonPress },
        { n: "class", v: cssClass },
      ]),
    });
  }

  VBox({ class: cssClass, alignItems, justifyContent, width, height, visible } = {}) {
    return this._container({
      name: "VBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "class", v: cssClass },
        { n: "alignItems", v: alignItems },
        { n: "justifyContent", v: justifyContent },
        { n: "width", v: width },
        { n: "height", v: height },
        { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  HBox({ class: cssClass, alignItems, justifyContent, width, visible } = {}) {
    return this._container({
      name: "HBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "class", v: cssClass },
        { n: "alignItems", v: alignItems },
        { n: "justifyContent", v: justifyContent },
        { n: "width", v: width },
        { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  FlexBox({ class: cssClass, alignItems, justifyContent, direction, wrap, width, height } = {}) {
    return this._container({
      name: "FlexBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "class", v: cssClass },
        { n: "alignItems", v: alignItems },
        { n: "justifyContent", v: justifyContent },
        { n: "direction", v: direction },
        { n: "wrap", v: wrap },
        { n: "width", v: width },
        { n: "height", v: height },
      ]),
    });
  }

  ScrollContainer({ height, width, vertical, horizontal } = {}) {
    return this._container({
      name: "ScrollContainer",
      ns: "m",
      aProp: this._filterProps([
        { n: "height", v: height },
        { n: "width", v: width },
        { n: "vertical", v: this.boolean_abap_2_json(vertical) },
        { n: "horizontal", v: this.boolean_abap_2_json(horizontal) },
      ]),
    });
  }

  Panel({ headerText, expandable, expanded, width } = {}) {
    return this._container({
      name: "Panel",
      ns: "m",
      aProp: this._filterProps([
        { n: "headerText", v: headerText },
        { n: "expandable", v: this.boolean_abap_2_json(expandable) },
        { n: "expanded", v: this.boolean_abap_2_json(expanded) },
        { n: "width", v: width },
      ]),
    });
  }

  IconTabBar({ select, selectedKey, class: cssClass } = {}) {
    return this._container({
      name: "IconTabBar",
      ns: "m",
      aProp: this._filterProps([
        { n: "select", v: select },
        { n: "selectedKey", v: selectedKey },
        { n: "class", v: cssClass },
      ]),
    });
  }

  IconTabFilter({ text, key, icon, count } = {}) {
    return this._container({
      name: "IconTabFilter",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "key", v: key },
        { n: "icon", v: icon },
        { n: "count", v: count },
      ]),
    });
  }

  // ========================================================
  // FORM LAYOUTS
  // ========================================================

  SimpleForm({
    title,
    editable,
    layout,
    columnsL,
    columnsM,
    columnsXL,
    labelSpanL,
    labelSpanM,
    labelSpanS,
    labelSpanXL,
    emptySpanL,
    emptySpanM,
    emptySpanS,
    emptySpanXL,
    singleContainerFullSize,
  } = {}) {
    return this._container({
      name: "SimpleForm",
      ns: "form",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
        { n: "layout", v: layout || "ResponsiveGridLayout" },
        { n: "columnsL", v: columnsL },
        { n: "columnsM", v: columnsM },
        { n: "columnsXL", v: columnsXL },
        { n: "labelSpanL", v: labelSpanL },
        { n: "labelSpanM", v: labelSpanM },
        { n: "labelSpanS", v: labelSpanS },
        { n: "labelSpanXL", v: labelSpanXL },
        { n: "emptySpanL", v: emptySpanL },
        { n: "emptySpanM", v: emptySpanM },
        { n: "emptySpanS", v: emptySpanS },
        { n: "emptySpanXL", v: emptySpanXL },
        { n: "singleContainerFullSize", v: this.boolean_abap_2_json(singleContainerFullSize) },
      ]),
    });
  }

  Grid({ defaultSpan, class: cssClass } = {}) {
    return this._container({
      name: "Grid",
      ns: "l",
      aProp: this._filterProps([
        { n: "defaultSpan", v: defaultSpan },
        { n: "class", v: cssClass },
      ]),
    });
  }

  // ========================================================
  // HEADER / TOOLBAR
  // ========================================================

  Toolbar(props = {}) {
    return this._container({
      name: "Toolbar",
      ns: "m",
      aProp: [],
    });
  }

  OverflowToolbar(props = {}) {
    return this._container({
      name: "OverflowToolbar",
      ns: "m",
      aProp: [],
    });
  }

  ToolbarSpacer(props = {}) {
    this.generic({
      name: "ToolbarSpacer",
      ns: "m",
      aProp: [],
    });
    return this;
  }

  ToolbarSeparator(props = {}) {
    this.generic({
      name: "ToolbarSeparator",
      ns: "m",
      aProp: [],
    });
    return this;
  }

  headerContent(props = {}) {
    return this._container({
      name: "headerContent",
      ns: "m",
      aProp: [],
    });
  }

  suggestionItems(props = {}) {
    return this._container({
      name: "suggestionItems",
      ns: "m",
      aProp: [],
    });
  }

  contentLeft(props = {}) {
    return this._container({
      name: "contentLeft",
      ns: "m",
      aProp: [],
    });
  }

  contentMiddle(props = {}) {
    return this._container({
      name: "contentMiddle",
      ns: "m",
      aProp: [],
    });
  }

  contentRight(props = {}) {
    return this._container({
      name: "contentRight",
      ns: "m",
      aProp: [],
    });
  }

  subHeader(props = {}) {
    return this._container({
      name: "subHeader",
      ns: "m",
      aProp: [],
    });
  }

  headerToolbar(props = {}) {
    return this._container({
      name: "headerToolbar",
      ns: this.ns || "m",
      aProp: [],
    });
  }

  // ========================================================
  // TEXT / LABEL / TITLE
  // ========================================================

  Title({ text, level, wrapping } = {}) {
    this.generic({
      name: "Title",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "level", v: level },
        { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      ]),
    });
    return this;
  }

  Label({ text, required, design, width } = {}) {
    this.generic({
      name: "Label",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "required", v: this.boolean_abap_2_json(required) },
        { n: "design", v: design },
        { n: "width", v: width },
      ]),
    });
    return this;
  }

  Text({ text, wrapping, maxLines, width } = {}) {
    this.generic({
      name: "Text",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
        { n: "maxLines", v: maxLines },
        { n: "width", v: width },
      ]),
    });
    return this;
  }

  FormattedText({ htmlText } = {}) {
    this.generic({
      name: "FormattedText",
      ns: "m",
      aProp: this._filterProps([{ n: "htmlText", v: htmlText }]),
    });
    return this;
  }

  Link({ text, href, target, press, enabled } = {}) {
    this.generic({
      name: "Link",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "href", v: href },
        { n: "target", v: target },
        { n: "press", v: press },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      ]),
    });
    return this;
  }

  ObjectHeader({ title, number, numberUnit, intro, icon } = {}) {
    return this._container({
      name: "ObjectHeader",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "number", v: number },
        { n: "numberUnit", v: numberUnit },
        { n: "intro", v: intro },
        { n: "icon", v: icon },
      ]),
    });
  }

  ObjectAttribute({ title, text } = {}) {
    this.generic({
      name: "ObjectAttribute",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "text", v: text },
      ]),
    });
    return this;
  }

  ObjectStatus({ text, state, icon } = {}) {
    this.generic({
      name: "ObjectStatus",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "state", v: state },
        { n: "icon", v: icon },
      ]),
    });
    return this;
  }

  ObjectNumber({ number, unit, state } = {}) {
    this.generic({
      name: "ObjectNumber",
      ns: "m",
      aProp: this._filterProps([
        { n: "number", v: number },
        { n: "unit", v: unit },
        { n: "state", v: state },
      ]),
    });
    return this;
  }

  // ========================================================
  // INPUT CONTROLS
  // ========================================================

  Input({ id, value, placeholder, enabled, type, width, submit, valueState, valueStateText, showValueHelp, valueHelpRequest, description, editable, maxLength, suggestionItems, showSuggestion } = {}) {
    this.generic({
      name: "Input",
      ns: "m",
      aProp: this._filterProps([
        { n: "id", v: id },
        { n: "value", v: value },
        { n: "placeholder", v: placeholder },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "type", v: type },
        { n: "width", v: width },
        { n: "submit", v: submit },
        { n: "valueState", v: valueState },
        { n: "valueStateText", v: valueStateText },
        { n: "showValueHelp", v: this.boolean_abap_2_json(showValueHelp) },
        { n: "valueHelpRequest", v: valueHelpRequest },
        { n: "description", v: description },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
        { n: "maxLength", v: maxLength },
        { n: "suggestionItems", v: suggestionItems },
        { n: "showSuggestion", v: this.boolean_abap_2_json(showSuggestion) },
      ]),
    });
    return this;
  }

  TextArea({ value, rows, cols, growing, growingMaxLines, width, placeholder, enabled, editable } = {}) {
    this.generic({
      name: "TextArea",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "rows", v: rows },
        { n: "cols", v: cols },
        { n: "growing", v: this.boolean_abap_2_json(growing) },
        { n: "growingMaxLines", v: growingMaxLines },
        { n: "width", v: width },
        { n: "placeholder", v: placeholder },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
      ]),
    });
    return this;
  }

  SearchField({ value, placeholder, search, width, liveChange } = {}) {
    this.generic({
      name: "SearchField",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "placeholder", v: placeholder },
        { n: "search", v: search },
        { n: "width", v: width },
        { n: "liveChange", v: liveChange },
      ]),
    });
    return this;
  }

  DatePicker({ value, displayFormat, valueFormat, placeholder, change } = {}) {
    this.generic({
      name: "DatePicker",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "displayFormat", v: displayFormat },
        { n: "valueFormat", v: valueFormat },
        { n: "placeholder", v: placeholder },
        { n: "change", v: change },
      ]),
    });
    return this;
  }

  DateTimePicker({ value, displayFormat, valueFormat, placeholder, change } = {}) {
    this.generic({
      name: "DateTimePicker",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "displayFormat", v: displayFormat },
        { n: "valueFormat", v: valueFormat },
        { n: "placeholder", v: placeholder },
        { n: "change", v: change },
      ]),
    });
    return this;
  }

  TimePicker({ value, displayFormat, valueFormat, placeholder, change } = {}) {
    this.generic({
      name: "TimePicker",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "displayFormat", v: displayFormat },
        { n: "valueFormat", v: valueFormat },
        { n: "placeholder", v: placeholder },
        { n: "change", v: change },
      ]),
    });
    return this;
  }

  CheckBox({ text, selected, select, enabled } = {}) {
    this.generic({
      name: "CheckBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "selected", v: selected },
        { n: "select", v: select },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      ]),
    });
    return this;
  }

  Switch({ state, change, type, enabled, customTextOn, customTextOff } = {}) {
    this.generic({
      name: "Switch",
      ns: "m",
      aProp: this._filterProps([
        { n: "state", v: state },
        { n: "change", v: change },
        { n: "type", v: type },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "customTextOn", v: customTextOn },
        { n: "customTextOff", v: customTextOff },
      ]),
    });
    return this;
  }

  Select({ selectedKey, change, forceSelection, width, items: itemsPath } = {}) {
    return this._container({
      name: "Select",
      ns: "m",
      aProp: this._filterProps([
        { n: "selectedKey", v: selectedKey },
        { n: "change", v: change },
        { n: "forceSelection", v: this.boolean_abap_2_json(forceSelection) },
        { n: "width", v: width },
        { n: "items", v: itemsPath },
      ]),
    });
  }

  ComboBox({ selectedKey, value, change, placeholder, width, items: itemsPath } = {}) {
    return this._container({
      name: "ComboBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "selectedKey", v: selectedKey },
        { n: "value", v: value },
        { n: "change", v: change },
        { n: "placeholder", v: placeholder },
        { n: "width", v: width },
        { n: "items", v: itemsPath },
      ]),
    });
  }

  MultiComboBox({ selectedKeys, selectionChange, placeholder, width, items: itemsPath } = {}) {
    return this._container({
      name: "MultiComboBox",
      ns: "m",
      aProp: this._filterProps([
        { n: "selectedKeys", v: selectedKeys },
        { n: "selectionChange", v: selectionChange },
        { n: "placeholder", v: placeholder },
        { n: "width", v: width },
        { n: "items", v: itemsPath },
      ]),
    });
  }

  Item({ key, text } = {}) {
    this.generic({
      name: "Item",
      ns: "core",
      aProp: this._filterProps([
        { n: "key", v: key },
        { n: "text", v: text },
      ]),
    });
    return this;
  }

  ListItem({ text, additionalText, icon } = {}) {
    this.generic({
      name: "ListItem",
      ns: "core",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "additionalText", v: additionalText },
        { n: "icon", v: icon },
      ]),
    });
    return this;
  }

  Slider({ value, min, max, step, width, change } = {}) {
    this.generic({
      name: "Slider",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "min", v: min },
        { n: "max", v: max },
        { n: "step", v: step },
        { n: "width", v: width },
        { n: "change", v: change },
      ]),
    });
    return this;
  }

  RatingIndicator({ value, maxValue, change, editable } = {}) {
    this.generic({
      name: "RatingIndicator",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "maxValue", v: maxValue },
        { n: "change", v: change },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
      ]),
    });
    return this;
  }

  StepInput({ value, min, max, step, change, editable } = {}) {
    this.generic({
      name: "StepInput",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "min", v: min },
        { n: "max", v: max },
        { n: "step", v: step },
        { n: "change", v: change },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
      ]),
    });
    return this;
  }

  // ========================================================
  // BUTTONS
  // ========================================================

  Button({ text, press, icon, type, enabled, visible, width } = {}) {
    this.generic({
      name: "Button",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "press", v: press },
        { n: "icon", v: icon },
        { n: "type", v: type },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "visible", v: this.boolean_abap_2_json(visible) },
        { n: "width", v: width },
      ]),
    });
    return this;
  }

  SegmentedButton({ selectedKey, selectionChange } = {}) {
    return this._container({
      name: "SegmentedButton",
      ns: "m",
      aProp: this._filterProps([
        { n: "selectedKey", v: selectedKey },
        { n: "selectionChange", v: selectionChange },
      ]),
    });
  }

  SegmentedButtonItem({ key, text, icon } = {}) {
    this.generic({
      name: "SegmentedButtonItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "key", v: key },
        { n: "text", v: text },
        { n: "icon", v: icon },
      ]),
    });
    return this;
  }

  // ========================================================
  // TABLE (sap.m.Table)
  // ========================================================

  Table({ items, mode, headerText, sticky, growing, growingThreshold, width, alternateRowColors } = {}) {
    return this._container({
      name: "Table",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: items },
        { n: "mode", v: mode },
        { n: "headerText", v: headerText },
        { n: "sticky", v: sticky },
        { n: "growing", v: this.boolean_abap_2_json(growing) },
        { n: "growingThreshold", v: growingThreshold },
        { n: "width", v: width },
        { n: "alternateRowColors", v: this.boolean_abap_2_json(alternateRowColors) },
      ]),
    });
  }

  Column({ width, hAlign, vAlign, minScreenWidth, demandPopin, popinDisplay } = {}) {
    return this._container({
      name: "Column",
      ns: "m",
      aProp: this._filterProps([
        { n: "width", v: width },
        { n: "hAlign", v: hAlign },
        { n: "vAlign", v: vAlign },
        { n: "minScreenWidth", v: minScreenWidth },
        { n: "demandPopin", v: this.boolean_abap_2_json(demandPopin) },
        { n: "popinDisplay", v: popinDisplay },
      ]),
    });
  }

  ColumnListItem({ type, press, selected } = {}) {
    return this._container({
      name: "ColumnListItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "type", v: type },
        { n: "press", v: press },
        { n: "selected", v: selected },
      ]),
    });
  }

  cells(props = {}) {
    return this._container({
      name: "cells",
      ns: "m",
      aProp: [],
    });
  }

  // ========================================================
  // LIST
  // ========================================================

  List({ items: itemsPath, mode, headerText, selectionChange } = {}) {
    return this._container({
      name: "List",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: itemsPath },
        { n: "mode", v: mode },
        { n: "headerText", v: headerText },
        { n: "selectionChange", v: selectionChange },
      ]),
    });
  }

  StandardListItem({ title, description, icon, type, press, info, infoState } = {}) {
    this.generic({
      name: "StandardListItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "description", v: description },
        { n: "icon", v: icon },
        { n: "type", v: type },
        { n: "press", v: press },
        { n: "info", v: info },
        { n: "infoState", v: infoState },
      ]),
    });
    return this;
  }

  CustomListItem({ type, press } = {}) {
    return this._container({
      name: "CustomListItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "type", v: type },
        { n: "press", v: press },
      ]),
    });
  }

  ObjectListItem({ title, number, numberUnit, type, press, icon } = {}) {
    return this._container({
      name: "ObjectListItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "number", v: number },
        { n: "numberUnit", v: numberUnit },
        { n: "type", v: type },
        { n: "press", v: press },
        { n: "icon", v: icon },
      ]),
    });
  }

  // ========================================================
  // DIALOG / POPUP
  // ========================================================

  Dialog({ title, icon, type, state, contentWidth, contentHeight, verticalScrolling, draggable, resizable, stretch, afterClose } = {}) {
    return this._container({
      name: "Dialog",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "icon", v: icon },
        { n: "type", v: type },
        { n: "state", v: state },
        { n: "contentWidth", v: contentWidth },
        { n: "contentHeight", v: contentHeight },
        { n: "verticalScrolling", v: this.boolean_abap_2_json(verticalScrolling) },
        { n: "draggable", v: this.boolean_abap_2_json(draggable) },
        { n: "resizable", v: this.boolean_abap_2_json(resizable) },
        { n: "stretch", v: this.boolean_abap_2_json(stretch) },
        { n: "afterClose", v: afterClose },
      ]),
    });
  }

  TableSelectDialog({ title, items, cancel, search, confirm, growing, contentWidth, contentHeight, growingThreshold, multiSelect } = {}) {
    return this._container({
      name: "TableSelectDialog",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "items", v: items },
        { n: "cancel", v: cancel },
        { n: "search", v: search },
        { n: "confirm", v: confirm },
        { n: "growing", v: this.boolean_abap_2_json(growing) },
        { n: "contentWidth", v: contentWidth },
        { n: "contentHeight", v: contentHeight },
        { n: "growingThreshold", v: growingThreshold },
        { n: "multiSelect", v: this.boolean_abap_2_json(multiSelect) },
      ]),
    });
  }

  buttons(props = {}) {
    return this._container({
      name: "buttons",
      ns: this.ns || "m",
      aProp: [],
    });
  }

  beginButton(props = {}) {
    return this._container({
      name: "beginButton",
      ns: this.ns || "m",
      aProp: [],
    });
  }

  endButton(props = {}) {
    return this._container({
      name: "endButton",
      ns: this.ns || "m",
      aProp: [],
    });
  }

  Popover({ title, placement, contentWidth, contentHeight } = {}) {
    return this._container({
      name: "Popover",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "placement", v: placement },
        { n: "contentWidth", v: contentWidth },
        { n: "contentHeight", v: contentHeight },
      ]),
    });
  }

  // ========================================================
  // MESSAGES / INDICATORS
  // ========================================================

  MessageStrip({ text, type, showIcon, showCloseButton } = {}) {
    this.generic({
      name: "MessageStrip",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "type", v: type },
        { n: "showIcon", v: this.boolean_abap_2_json(showIcon) },
        { n: "showCloseButton", v: this.boolean_abap_2_json(showCloseButton) },
      ]),
    });
    return this;
  }

  BusyIndicator({ size, text } = {}) {
    this.generic({
      name: "BusyIndicator",
      ns: "m",
      aProp: this._filterProps([
        { n: "size", v: size },
        { n: "text", v: text },
      ]),
    });
    return this;
  }

  ProgressIndicator({ percentValue, displayValue, state, showValue } = {}) {
    this.generic({
      name: "ProgressIndicator",
      ns: "m",
      aProp: this._filterProps([
        { n: "percentValue", v: percentValue },
        { n: "displayValue", v: displayValue },
        { n: "state", v: state },
        { n: "showValue", v: this.boolean_abap_2_json(showValue) },
      ]),
    });
    return this;
  }

  // ========================================================
  // ICONS / IMAGES / AVATARS
  // ========================================================

  Icon({ src, size, color, press } = {}) {
    this.generic({
      name: "Icon",
      ns: "core",
      aProp: this._filterProps([
        { n: "src", v: src },
        { n: "size", v: size },
        { n: "color", v: color },
        { n: "press", v: press },
      ]),
    });
    return this;
  }

  Image({ src, width, height, alt, mode } = {}) {
    this.generic({
      name: "Image",
      ns: "m",
      aProp: this._filterProps([
        { n: "src", v: src },
        { n: "width", v: width },
        { n: "height", v: height },
        { n: "alt", v: alt },
        { n: "mode", v: mode },
      ]),
    });
    return this;
  }

  Avatar({ src, initials, displaySize, displayShape, press } = {}) {
    this.generic({
      name: "Avatar",
      ns: "m",
      aProp: this._filterProps([
        { n: "src", v: src },
        { n: "initials", v: initials },
        { n: "displaySize", v: displaySize },
        { n: "displayShape", v: displayShape },
        { n: "press", v: press },
      ]),
    });
    return this;
  }

  // ========================================================
  // FIORI ELEMENTS (sap.f)
  // ========================================================

  DynamicPage({ headerExpanded, toggleHeaderOnTitleClick } = {}) {
    return this._container({
      name: "DynamicPage",
      ns: "f",
      aProp: this._filterProps([
        { n: "headerExpanded", v: this.boolean_abap_2_json(headerExpanded) },
        { n: "toggleHeaderOnTitleClick", v: this.boolean_abap_2_json(toggleHeaderOnTitleClick) },
      ]),
    });
  }

  DynamicPageTitle(props = {}) {
    return this._container({
      name: "DynamicPageTitle",
      ns: "f",
      aProp: [],
    });
  }

  DynamicPageHeader({ pinnable } = {}) {
    return this._container({
      name: "DynamicPageHeader",
      ns: "f",
      aProp: this._filterProps([
        { n: "pinnable", v: this.boolean_abap_2_json(pinnable) },
      ]),
    });
  }

  // Title control — ns `f` is the DynamicPage title aggregation instead
  title({ ns, text, wrapping, level, class: cssClass, id, textalign, textdirection, titlestyle, width, wrappingtype, visible } = {}) {
    if (ns === "f") return this._container({ name: "title", ns: "f", aProp: [] });
    return this._leaf({
      name: "Title",
      ns: ns || "",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "class", v: cssClass },
        { n: "id", v: id },
        { n: "wrappingType", v: wrappingtype },
        { n: "textAlign", v: textalign },
        { n: "textDirection", v: textdirection },
        { n: "titleStyle", v: titlestyle },
        { n: "width", v: width },
        { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
        { n: "visible", v: this.boolean_abap_2_json(visible) },
        { n: "level", v: level },
      ]),
    });
  }

  expandedHeading(props = {}) {
    return this._container({ name: "expandedHeading", ns: this.ns || "m", aProp: [] });
  }

  snappedHeading(props = {}) {
    return this._container({ name: "snappedHeading", ns: this.ns || "m", aProp: [] });
  }

  // ========================================================
  // GENERIC ELEMENT
  // ========================================================

  cc(name, { ns, ...props } = {}) {
    const aProp = [];
    for (const [key, val] of Object.entries(props)) {
      if (val !== undefined && val !== null) {
        aProp.push({ n: key, v: val });
      }
    }
    return this._container({
      name: name,
      ns: ns || "",
      aProp: aProp,
    });
  }

  // Leaf version (returns parent)
  ccl(name, { ns, ...props } = {}) {
    const aProp = [];
    for (const [key, val] of Object.entries(props)) {
      if (val !== undefined && val !== null) {
        aProp.push({ n: key, v: val });
      }
    }
    this.generic({
      name: name,
      ns: ns || "",
      aProp: aProp,
    });
    return this;
  }

  // ========================================================
  // OBJECT PAGE LAYOUT (uxap namespace)
  // ========================================================

  ObjectPageLayout({ showTitleInHeaderContent, upperCaseAnchorBar, useIconTabBar } = {}) {
    return this._container({
      name: "ObjectPageLayout",
      ns: "uxap",
      aProp: this._filterProps([
        { n: "showTitleInHeaderContent", v: this.boolean_abap_2_json(showTitleInHeaderContent) },
        { n: "upperCaseAnchorBar", v: this.boolean_abap_2_json(upperCaseAnchorBar) },
        { n: "useIconTabBar", v: this.boolean_abap_2_json(useIconTabBar) },
      ]),
    });
  }

  ObjectPageSection({ title, titleUppercase } = {}) {
    return this._container({
      name: "ObjectPageSection",
      ns: "uxap",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "titleUppercase", v: this.boolean_abap_2_json(titleUppercase) },
      ]),
    });
  }

  ObjectPageSubSection({ title } = {}) {
    return this._container({
      name: "ObjectPageSubSection",
      ns: "uxap",
      aProp: this._filterProps([{ n: "title", v: title }]),
    });
  }

  // ========================================================
  // ILLUSTRATED + MESSAGE
  // ========================================================

  IllustratedMessage({ illustrationType, illustrationSize, title, description, enableVerticalResponsiveness, enableFormattedText } = {}) {
    return this._container({
      name: "IllustratedMessage",
      ns: "m",
      aProp: this._filterProps([
        { n: "illustrationType", v: illustrationType },
        { n: "illustrationSize", v: illustrationSize },
        { n: "title", v: title },
        { n: "description", v: description },
        { n: "enableVerticalResponsiveness", v: this.boolean_abap_2_json(enableVerticalResponsiveness) },
        { n: "enableFormattedText", v: this.boolean_abap_2_json(enableFormattedText) },
      ]),
    });
  }

  MessagePopover({ items, headerButton, asyncDescriptionHandler } = {}) {
    return this._container({
      name: "MessagePopover",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: items },
        { n: "headerButton", v: headerButton },
        { n: "asyncDescriptionHandler", v: asyncDescriptionHandler },
      ]),
    });
  }

  MessageView({ items, asyncDescriptionHandler } = {}) {
    return this._container({
      name: "MessageView",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: items },
        { n: "asyncDescriptionHandler", v: asyncDescriptionHandler },
      ]),
    });
  }

  MessagePage({ title, text, description, icon, showHeader, showNavButton, navButtonPress } = {}) {
    return this._container({
      name: "MessagePage",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "text", v: text },
        { n: "description", v: description },
        { n: "icon", v: icon },
        { n: "showHeader", v: this.boolean_abap_2_json(showHeader) },
        { n: "showNavButton", v: this.boolean_abap_2_json(showNavButton) },
        { n: "navButtonPress", v: navButtonPress },
      ]),
    });
  }

  MessageItem({ type, title, subtitle, description, longtextUrl, groupName, counter, activeTitle } = {}) {
    return this._leaf({
      name: "MessageItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "type", v: type },
        { n: "title", v: title },
        { n: "subtitle", v: subtitle },
        { n: "description", v: description },
        { n: "longtextUrl", v: longtextUrl },
        { n: "groupName", v: groupName },
        { n: "counter", v: counter },
        { n: "activeTitle", v: this.boolean_abap_2_json(activeTitle) },
      ]),
    });
  }

  // ========================================================
  // TABLES (advanced — sap.ui.table namespace)
  // ========================================================

  AnalyticalTable({ rows, selectionMode, visibleRowCount, threshold, enableColumnReordering, enableGrouping, enableSelectAll } = {}) {
    return this._container({
      name: "AnalyticalTable",
      ns: "table",
      aProp: this._filterProps([
        { n: "rows", v: rows },
        { n: "selectionMode", v: selectionMode },
        { n: "visibleRowCount", v: visibleRowCount },
        { n: "threshold", v: threshold },
        { n: "enableColumnReordering", v: this.boolean_abap_2_json(enableColumnReordering) },
        { n: "enableGrouping", v: this.boolean_abap_2_json(enableGrouping) },
        { n: "enableSelectAll", v: this.boolean_abap_2_json(enableSelectAll) },
      ]),
    });
  }

  TreeTable({ rows, selectionMode, visibleRowCount, threshold, enableColumnReordering } = {}) {
    return this._container({
      name: "TreeTable",
      ns: "table",
      aProp: this._filterProps([
        { n: "rows", v: rows },
        { n: "selectionMode", v: selectionMode },
        { n: "visibleRowCount", v: visibleRowCount },
        { n: "threshold", v: threshold },
        { n: "enableColumnReordering", v: this.boolean_abap_2_json(enableColumnReordering) },
      ]),
    });
  }

  // ========================================================
  // TILES
  // ========================================================

  GenericTile({ header, subheader, frameType, press, mode, state, scope, class: cssClass } = {}) {
    return this._container({
      name: "GenericTile",
      ns: "m",
      aProp: this._filterProps([
        { n: "header", v: header },
        { n: "subheader", v: subheader },
        { n: "frameType", v: frameType },
        { n: "press", v: press },
        { n: "mode", v: mode },
        { n: "state", v: state },
        { n: "scope", v: scope },
        { n: "class", v: cssClass },
      ]),
    });
  }

  TileContent({ unit, footer, footerColor } = {}) {
    return this._container({
      name: "TileContent",
      ns: "m",
      aProp: this._filterProps([
        { n: "unit", v: unit },
        { n: "footer", v: footer },
        { n: "footerColor", v: footerColor },
      ]),
    });
  }

  NumericContent({ value, scale, indicator, valueColor, icon, withMargin, animateTextChange } = {}) {
    return this._leaf({
      name: "NumericContent",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "scale", v: scale },
        { n: "indicator", v: indicator },
        { n: "valueColor", v: valueColor },
        { n: "icon", v: icon },
        { n: "withMargin", v: this.boolean_abap_2_json(withMargin) },
        { n: "animateTextChange", v: this.boolean_abap_2_json(animateTextChange) },
      ]),
    });
  }

  ImageContent({ src, description, press } = {}) {
    return this._leaf({
      name: "ImageContent",
      ns: "m",
      aProp: this._filterProps([
        { n: "src", v: src },
        { n: "description", v: description },
        { n: "press", v: press },
      ]),
    });
  }

  // ========================================================
  // AVATAR GROUP
  // ========================================================

  AvatarGroup({ groupType, items, press } = {}) {
    return this._container({
      name: "AvatarGroup",
      ns: "m",
      aProp: this._filterProps([
        { n: "groupType", v: groupType },
        { n: "items", v: items },
        { n: "press", v: press },
      ]),
    });
  }

  AvatarGroupItem({ src, initials, fallbackIcon } = {}) {
    return this._leaf({
      name: "AvatarGroupItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "src", v: src },
        { n: "initials", v: initials },
        { n: "fallbackIcon", v: fallbackIcon },
      ]),
    });
  }

  // ========================================================
  // TAB CONTAINER + CAROUSEL + WIZARD
  // ========================================================

  TabContainer({ items, itemSelect, itemClose, addNewButtonPress, showAddNewButton } = {}) {
    return this._container({
      name: "TabContainer",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: items },
        { n: "itemSelect", v: itemSelect },
        { n: "itemClose", v: itemClose },
        { n: "addNewButtonPress", v: addNewButtonPress },
        { n: "showAddNewButton", v: this.boolean_abap_2_json(showAddNewButton) },
      ]),
    });
  }

  TabContainerItem({ name, key, icon, modified } = {}) {
    return this._container({
      name: "TabContainerItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "name", v: name },
        { n: "key", v: key },
        { n: "icon", v: icon },
        { n: "modified", v: this.boolean_abap_2_json(modified) },
      ]),
    });
  }

  Carousel({ pages, activePage, pageChanged, loop, showPageIndicator } = {}) {
    return this._container({
      name: "Carousel",
      ns: "m",
      aProp: this._filterProps([
        { n: "pages", v: pages },
        { n: "activePage", v: activePage },
        { n: "pageChanged", v: pageChanged },
        { n: "loop", v: this.boolean_abap_2_json(loop) },
        { n: "showPageIndicator", v: this.boolean_abap_2_json(showPageIndicator) },
      ]),
    });
  }

  Wizard({ steps, complete, currentStep, showNextButton, finishButtonText } = {}) {
    return this._container({
      name: "Wizard",
      ns: "m",
      aProp: this._filterProps([
        { n: "steps", v: steps },
        { n: "complete", v: complete },
        { n: "currentStep", v: currentStep },
        { n: "showNextButton", v: this.boolean_abap_2_json(showNextButton) },
        { n: "finishButtonText", v: finishButtonText },
      ]),
    });
  }

  WizardStep({ title, validated, complete, activate } = {}) {
    return this._container({
      name: "WizardStep",
      ns: "m",
      aProp: this._filterProps([
        { n: "title", v: title },
        { n: "validated", v: this.boolean_abap_2_json(validated) },
        { n: "complete", v: complete },
        { n: "activate", v: activate },
      ]),
    });
  }

  // ========================================================
  // LAYOUT DATA
  // ========================================================

  FlexItemData({ growFactor, shrinkFactor, baseSize, alignSelf, order, styleClass } = {}) {
    return this._leaf({
      name: "FlexItemData",
      ns: "m",
      aProp: this._filterProps([
        { n: "growFactor", v: growFactor },
        { n: "shrinkFactor", v: shrinkFactor },
        { n: "baseSize", v: baseSize },
        { n: "alignSelf", v: alignSelf },
        { n: "order", v: order },
        { n: "styleClass", v: styleClass },
      ]),
    });
  }

  GridData({ span, indent, linebreak, visibleL, visibleM, visibleS } = {}) {
    return this._leaf({
      name: "GridData",
      ns: "l",
      aProp: this._filterProps([
        { n: "span", v: span },
        { n: "indent", v: indent },
        { n: "linebreak", v: this.boolean_abap_2_json(linebreak) },
        { n: "visibleL", v: this.boolean_abap_2_json(visibleL) },
        { n: "visibleM", v: this.boolean_abap_2_json(visibleM) },
        { n: "visibleS", v: this.boolean_abap_2_json(visibleS) },
      ]),
    });
  }

  // ========================================================
  // MENU + MORE BUTTONS
  // ========================================================

  MenuButton({ text, icon, type, defaultAction, menuPosition, useDefaultActionOnly } = {}) {
    return this._container({
      name: "MenuButton",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "icon", v: icon },
        { n: "type", v: type },
        { n: "defaultAction", v: defaultAction },
        { n: "menuPosition", v: menuPosition },
        { n: "useDefaultActionOnly", v: this.boolean_abap_2_json(useDefaultActionOnly) },
      ]),
    });
  }

  Menu({ items, itemSelected } = {}) {
    return this._container({
      name: "Menu",
      ns: "m",
      aProp: this._filterProps([
        { n: "items", v: items },
        { n: "itemSelected", v: itemSelected },
      ]),
    });
  }

  MenuItem({ text, icon, press, enabled } = {}) {
    return this._container({
      name: "MenuItem",
      ns: "m",
      aProp: this._filterProps([
        { n: "text", v: text },
        { n: "icon", v: icon },
        { n: "press", v: press },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      ]),
    });
  }

  BarcodeScannerButton({ scanSuccess, scanFail, dialogTitle, type, provideFallback } = {}) {
    return this._leaf({
      name: "BarcodeScannerButton",
      ns: "m",
      aProp: this._filterProps([
        { n: "scanSuccess", v: scanSuccess },
        { n: "scanFail", v: scanFail },
        { n: "dialogTitle", v: dialogTitle },
        { n: "type", v: type },
        { n: "provideFallback", v: this.boolean_abap_2_json(provideFallback) },
      ]),
    });
  }

  // ========================================================
  // MULTI INPUT + TOKENS
  // ========================================================

  MultiInput({ value, valueState, valueStateText, tokens, suggestionItems, tokenUpdate, submit, change, placeholder, enabled } = {}) {
    return this._container({
      name: "MultiInput",
      ns: "m",
      aProp: this._filterProps([
        { n: "value", v: value },
        { n: "valueState", v: valueState },
        { n: "valueStateText", v: valueStateText },
        { n: "tokens", v: tokens },
        { n: "suggestionItems", v: suggestionItems },
        { n: "tokenUpdate", v: tokenUpdate },
        { n: "submit", v: submit },
        { n: "change", v: change },
        { n: "placeholder", v: placeholder },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      ]),
    });
  }

  Token({ key, text, editable, selected } = {}) {
    return this._leaf({
      name: "Token",
      ns: "m",
      aProp: this._filterProps([
        { n: "key", v: key },
        { n: "text", v: text },
        { n: "editable", v: this.boolean_abap_2_json(editable) },
        { n: "selected", v: this.boolean_abap_2_json(selected) },
      ]),
    });
  }

  // ========================================================
  // BAR + BREADCRUMBS
  // ========================================================

  Bar({ contentLeft, contentMiddle, contentRight, design, translucent } = {}) {
    return this._container({
      name: "Bar",
      ns: "m",
      aProp: this._filterProps([
        { n: "contentLeft", v: contentLeft },
        { n: "contentMiddle", v: contentMiddle },
        { n: "contentRight", v: contentRight },
        { n: "design", v: design },
        { n: "translucent", v: this.boolean_abap_2_json(translucent) },
      ]),
    });
  }

  Breadcrumbs({ links, currentLocationText, separatorStyle } = {}) {
    return this._container({
      name: "Breadcrumbs",
      ns: "m",
      aProp: this._filterProps([
        { n: "links", v: links },
        { n: "currentLocationText", v: currentLocationText },
        { n: "separatorStyle", v: separatorStyle },
      ]),
    });
  }

  RangeSlider({ min, max, step, startValue, endValue, value, value2, showTickmarks, labelInterval, width, change, enabled, class: cssClass } = {}) {
    return this._leaf({
      name: "RangeSlider",
      ns: "m",
      aProp: this._filterProps([
        { n: "min", v: min },
        { n: "max", v: max },
        { n: "step", v: step },
        { n: "startValue", v: startValue },
        { n: "endValue", v: endValue },
        { n: "value", v: value },
        { n: "value2", v: value2 },
        { n: "showTickmarks", v: this.boolean_abap_2_json(showTickmarks) },
        { n: "enableTickmarks", v: this.boolean_abap_2_json(showTickmarks) },
        { n: "labelInterval", v: labelInterval },
        { n: "width", v: width },
        { n: "change", v: change },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "class", v: cssClass },
      ]),
    });
  }

  // ============================================================
  //  abap2UI5 mirror methods — generated from z2ui5_cl_xml_view.clas.abap
  //
  //  These methods use the abap lower_snake_case naming and emit the same
  //  XML elements as the existing PascalCase wrappers above. Both forms
  //  are kept so apps ported 1:1 from abap2UI5 (which use snake_case) and
  //  apps written in JS-idiomatic style (which use PascalCase) work.
  // ============================================================

  horizontal_layout({ class: cssClass, visible, allowwrapping, id } = {}) {
    return this._container({
      name: "HorizontalLayout",
      ns: "layout",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "allowWrapping", v: this.boolean_abap_2_json(allowwrapping) },
      { n: "id", v: id },
      { n: "visible", v: visible },
      ]),
    });
  }

  icon({ src, press, size, color, class: cssClass, id, width, useicontooltip, notabstop, hovercolor, hoverbackgroundcolor, height, decorative, backgroundcolor, alt, activecolor, activebackgroundcolor, visible } = {}) {
    return this._leaf({
      name: "Icon",
      ns: "core",
      aProp: this._filterProps([
      { n: "size", v: size },
      { n: "color", v: color },
      { n: "class", v: cssClass },
      { n: "src", v: src },
      { n: "activeColor", v: activecolor },
      { n: "activeBackgroundColor", v: activebackgroundcolor },
      { n: "alt", v: alt },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "press", v: press },
      { n: "hoverBackgroundColor", v: hoverbackgroundcolor },
      { n: "hoverColor", v: hovercolor },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "decorative", v: this.boolean_abap_2_json(decorative) },
      { n: "noTabStop", v: this.boolean_abap_2_json(notabstop) },
      { n: "useIconTooltip", v: this.boolean_abap_2_json(useicontooltip) },
      ]),
    });
  }

  dynamic_page({ headerexpanded, showfooter, headerpinned, toggleheaderontitleclick, class: cssClass } = {}) {
    return this._container({
      name: "DynamicPage",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  dynamic_page_title() {
    return this._container({
      name: "DynamicPageTitle",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  dynamic_page_header({ pinnable } = {}) {
    return this._container({
      name: "DynamicPageHeader",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  html({ content, afterrendering, preferdom, sanitizecontent, visible, id } = {}) {
    return this._container({
      name: "HTML",
      ns: "core",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "content", v: content },
      { n: "afterRendering", v: afterrendering },
      { n: "preferDOM", v: this.boolean_abap_2_json(preferdom) },
      { n: "sanitizeContent", v: this.boolean_abap_2_json(sanitizecontent) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  illustrated_message({ enableverticalresponsiveness, enableformattedtext, illustrationtype, title, description, illustrationsize } = {}) {
    return this._container({
      name: "IllustratedMessage",
      aProp: this._filterProps([
      { n: "enableVerticalResponsiveness", v: enableverticalresponsiveness },
      { n: "illustrationType", v: illustrationtype },
      { n: "enableFormattedText", v: this.boolean_abap_2_json(enableformattedtext) },
      { n: "illustrationSize", v: illustrationsize },
      { n: "description", v: description },
      { n: "title", v: title },
      ]),
    });
  }

  p_cell_selector({ id } = {}) {
    return this._leaf({
      name: "CellSelector",
      ns: "plugins",
      aProp: this._filterProps([
      { n: "id", v: id },
      ]),
    });
  }

  p_copy_provider({ id, extract_data, copy } = {}) {
    return this._leaf({
      name: "CopyProvider",
      ns: "plugins",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "copy", v: copy },
      { n: "extractData", v: extract_data },
      ]),
    });
  }

  flex_box({ class: cssClass, rendertype, width, fitcontainer, height, alignitems, justifycontent, wrap, visible, direction, displayinline, backgrounddesign, aligncontent, items, id } = {}) {
    return this._container({
      name: "FlexBox",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "id", v: id },
      { n: "renderType", v: rendertype },
      { n: "width", v: width },
      { n: "height", v: height },
      { n: "alignItems", v: alignitems },
      { n: "fitContainer", v: this.boolean_abap_2_json(fitcontainer) },
      { n: "justifyContent", v: justifycontent },
      { n: "wrap", v: wrap },
      { n: "items", v: items },
      { n: "direction", v: direction },
      { n: "alignContent", v: aligncontent },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "displayInline", v: this.boolean_abap_2_json(displayinline) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  popover({ id, title, class: cssClass, placement, initialfocus, contentwidth, contentheight, showheader, showarrow, resizable, modal, horizontalscrolling, verticalscrolling, visible, offsetx, offsety, contentminwidth, titlealignment, beforeopen, beforeclose, afteropen, afterclose } = {}) {
    return this._container({
      name: "Popover",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "title", v: title },
      { n: "class", v: cssClass },
      { n: "placement", v: placement },
      { n: "initialFocus", v: initialfocus },
      { n: "contentHeight", v: contentheight },
      { n: "showHeader", v: this.boolean_abap_2_json(showheader) },
      { n: "showArrow", v: this.boolean_abap_2_json(showarrow) },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      { n: "modal", v: this.boolean_abap_2_json(modal) },
      { n: "horizontalScrolling", v: this.boolean_abap_2_json(horizontalscrolling) },
      { n: "verticalScrolling", v: this.boolean_abap_2_json(verticalscrolling) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "offsetX", v: offsetx },
      { n: "offsetY", v: offsety },
      { n: "contentMinWidth", v: contentminwidth },
      { n: "titleAlignment", v: titlealignment },
      { n: "contentWidth", v: contentwidth },
      { n: "afterClose", v: afterclose },
      { n: "afterOpen", v: afteropen },
      { n: "beforeClose", v: beforeclose },
      { n: "beforeOpen", v: beforeopen },
      ]),
    });
  }

  list_item({ text, additionaltext, key, icon, enabled, textdirection } = {}) {
    return this._leaf({
      name: "ListItem",
      ns: "core",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "icon", v: icon },
      { n: "key", v: key },
      { n: "textDirection", v: textdirection },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "additionalText", v: additionaltext },
      ]),
    });
  }

  overflow_toolbar_layout_data({ priority, group, closeoverflowoninteraction } = {}) {
    return this._container({
      name: "OverflowToolbarLayoutData",
      aProp: this._filterProps([
      { n: "closeOverflowOnInteraction", v: this.boolean_abap_2_json(closeoverflowoninteraction) },
      { n: "group", v: group },
      { n: "priority", v: priority },
      ]),
    });
  }

  table({ id, items, class: cssClass, growing, growingthreshold, growingscrolltoload, headertext, sticky, mode, width, selectionchange, alternaterowcolors, autopopinmode, inset, showseparators, showoverlay, hiddeninpopin, popinlayout, fixedlayout, backgrounddesign, visible } = {}) {
    return this._container({
      name: "Table",
      aProp: this._filterProps([
      { n: "items", v: items },
      { n: "headerText", v: headertext },
      { n: "class", v: cssClass },
      { n: "growing", v: growing },
      { n: "growingThreshold", v: growingthreshold },
      { n: "growingScrollToLoad", v: growingscrolltoload },
      { n: "sticky", v: sticky },
      { n: "showSeparators", v: showseparators },
      { n: "mode", v: mode },
      { n: "inset", v: inset },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "hiddenInPopin", v: hiddeninpopin },
      { n: "popinLayout", v: popinlayout },
      { n: "selectionChange", v: selectionchange },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "alternateRowColors", v: this.boolean_abap_2_json(alternaterowcolors) },
      { n: "fixedLayout", v: this.boolean_abap_2_json(fixedlayout) },
      { n: "showOverlay", v: this.boolean_abap_2_json(showoverlay) },
      { n: "autoPopinMode", v: this.boolean_abap_2_json(autopopinmode) },
      ]),
    });
  }

  analytical_table({ ns, selectionmode, rowmode, toolbar, columns } = {}) {
    return this._container({
      name: "AnalyticalTable",
      aProp: this._filterProps([
      { n: "selectionMode", v: selectionmode },
      { n: "rowMode", v: rowmode },
      { n: "toolbar", v: toolbar },
      { n: "columns", v: columns },
      ]),
    });
  }

  rowmode(args = {}) {
    return this._container({
      name: "rowMode",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  breadcrumbs({ ns, link, id, class: cssClass, currentlocationtext, separatorstyle, visible } = {}) {
    return this._container({
      name: "Breadcrumbs",
      aProp: this._filterProps([
      { n: "link", v: link },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "currentLocationText", v: currentlocationtext },
      { n: "separatorStyle", v: separatorstyle },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  current_location({ ns, link } = {}) {
    return this._container({
      name: "currentLocation",
      aProp: this._filterProps([
      { n: "link", v: link },
      ]),
    });
  }

  color_palette({ ns, colorselect } = {}) {
    return this._container({
      name: "ColorPalette",
      aProp: this._filterProps([
      { n: "colorSelect", v: colorselect },
      ]),
    });
  }

  auto({ ns, rowcontentheight } = {}) {
    return this._container({
      name: "Auto",
      aProp: this._filterProps([
      { n: "rowContentHeight", v: rowcontentheight },
      ]),
    });
  }

  message_strip({ text, type, showicon, customicon, class: cssClass, visible, showclosebutton, enableformattedtext } = {}) {
    return this._leaf({
      name: "MessageStrip",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "type", v: type },
      { n: "showIcon", v: this.boolean_abap_2_json(showicon) },
      { n: "customIcon", v: customicon },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "showCloseButton", v: this.boolean_abap_2_json(showclosebutton) },
      { n: "class", v: cssClass },
      { n: "enableFormattedText", v: this.boolean_abap_2_json(enableformattedtext) },
      ]),
    });
  }

  footer(args = {}) {
    return this._container({
      name: "footer",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  message_page({ show_header, text, enableformattedtext, description, icon } = {}) {
    return this._container({
      name: "MessagePage",
      aProp: this._filterProps([
      { n: "showHeader", v: this.boolean_abap_2_json(show_header) },
      { n: "description", v: description },
      { n: "icon", v: icon },
      { n: "text", v: text },
      { n: "enableFormattedText", v: this.boolean_abap_2_json(enableformattedtext) },
      ]),
    });
  }

  object_page_layout({ showtitleinheadercontent, showeditheaderbutton, editheaderbuttonpress, uppercaseanchorbar, showfooter, alwaysshowcontentheader, enablelazyloading, flexenabled, headercontentpinnable, headercontentpinned, ischildpage, preserveheaderstateonscroll, showanchorbar, showanchorbarpopover, showheadercontent, showonlyhighimportance, subsectionlayout, toggleheaderontitleclick, useicontabbar, usetwocolumnsforlargescreen, visible, backgrounddesignanchorbar, height, sectiontitlelevel, beforenavigate, headercontentpinnedstatechange, navigate, sectionchange, subsectionvisibilitychange, toggleanchorbar, class: cssClass } = {}) {
    return this._container({
      name: "ObjectPageLayout",
      ns: "uxap",
      aProp: this._filterProps([
      { n: "showTitleInHeaderContent", v: this.boolean_abap_2_json(showtitleinheadercontent) },
      { n: "showEditHeaderButton", v: this.boolean_abap_2_json(showeditheaderbutton) },
      { n: "alwaysShowContentHeader", v: this.boolean_abap_2_json(alwaysshowcontentheader) },
      { n: "enableLazyLoading", v: this.boolean_abap_2_json(enablelazyloading) },
      { n: "flexEnabled", v: this.boolean_abap_2_json(flexenabled) },
      { n: "headerContentPinnable", v: this.boolean_abap_2_json(headercontentpinnable) },
      { n: "headerContentPinned", v: this.boolean_abap_2_json(headercontentpinned) },
      { n: "isChildPage", v: this.boolean_abap_2_json(ischildpage) },
      { n: "preserveHeaderStateOnScroll", v: this.boolean_abap_2_json(preserveheaderstateonscroll) },
      { n: "showAnchorBar", v: this.boolean_abap_2_json(showanchorbar) },
      { n: "showAnchorBarPopover", v: this.boolean_abap_2_json(showanchorbarpopover) },
      { n: "showHeaderContent", v: this.boolean_abap_2_json(showheadercontent) },
      { n: "showOnlyHighImportance", v: this.boolean_abap_2_json(showonlyhighimportance) },
      { n: "subSectionLayout", v: subsectionlayout },
      { n: "toggleHeaderOnTitleClick", v: this.boolean_abap_2_json(toggleheaderontitleclick) },
      { n: "useIconTabBar", v: this.boolean_abap_2_json(useicontabbar) },
      { n: "useTwoColumnsForLargeScreen", v: this.boolean_abap_2_json(usetwocolumnsforlargescreen) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "backgroundDesignAnchorBar", v: backgrounddesignanchorbar },
      { n: "height", v: height },
      { n: "sectionTitleLevel", v: sectiontitlelevel },
      { n: "editHeaderButtonPress", v: editheaderbuttonpress },
      { n: "upperCaseAnchorBar", v: this.boolean_abap_2_json(uppercaseanchorbar) },
      { n: "beforeNavigate", v: beforenavigate },
      { n: "headerContentPinnedStateChange", v: headercontentpinnedstatechange },
      { n: "navigate", v: navigate },
      { n: "sectionChange", v: sectionchange },
      { n: "subSectionVisibilityChange", v: subsectionvisibilitychange },
      { n: "toggleAnchorBar", v: toggleanchorbar },
      { n: "showFooter", v: this.boolean_abap_2_json(showfooter) },
      { n: "class", v: cssClass },
      ]),
    });
  }

  object_page_header({ isactionareaalwaysvisible, isobjecticonalwaysvisible, isobjectsubtitlealwaysvisible, isobjecttitlealwaysvisible, markchanges, markfavorite, markflagged, marklocked, objectimagealt, objectimagebackgroundcolor, objectimagedensityaware, objectimageshape, objectimageuri, objectsubtitle, objecttitle, showmarkers, showplaceholder, showtitleselector, visible, markchangespress, marklockedpress, titleselectorpress } = {}) {
    return this._leaf({
      name: "ObjectPageHeader",
      ns: "uxap",
      aProp: this._filterProps([
      { n: "isActionAreaAlwaysVisible", v: this.boolean_abap_2_json(isactionareaalwaysvisible) },
      { n: "isObjectIconAlwaysVisible", v: this.boolean_abap_2_json(isobjecticonalwaysvisible) },
      { n: "isObjectSubtitleAlwaysVisible", v: this.boolean_abap_2_json(isobjectsubtitlealwaysvisible) },
      { n: "isObjectTitleAlwaysVisible", v: this.boolean_abap_2_json(isobjecttitlealwaysvisible) },
      { n: "markChanges", v: this.boolean_abap_2_json(markchanges) },
      { n: "markFavorite", v: this.boolean_abap_2_json(markfavorite) },
      { n: "markFlagged", v: this.boolean_abap_2_json(markflagged) },
      { n: "markLocked", v: this.boolean_abap_2_json(marklocked) },
      { n: "objectImageDensityAware", v: this.boolean_abap_2_json(objectimagedensityaware) },
      { n: "showMarkers", v: this.boolean_abap_2_json(showmarkers) },
      { n: "showPlaceholder", v: this.boolean_abap_2_json(showplaceholder) },
      { n: "showTitleSelector", v: this.boolean_abap_2_json(showtitleselector) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "objectImageAlt", v: objectimagealt },
      { n: "objectImageBackgroundColor", v: objectimagebackgroundcolor },
      { n: "objectImageURI", v: objectimageuri },
      { n: "objectSubtitle", v: objectsubtitle },
      { n: "objectTitle", v: objecttitle },
      { n: "markChangesPress", v: markchangespress },
      { n: "markLockedPress", v: marklockedpress },
      { n: "titleSelectorPress", v: titleselectorpress },
      { n: "objectImageShape", v: objectimageshape },
      ]),
    });
  }

  object_page_header_action_btn({ activeicon, ariahaspopup, enabled, hideicon, hidetext, icon, icondensityaware, iconfirst, importance, text, textdirection, visible, width, type, press } = {}) {
    return this._leaf({
      name: "ObjectPageHeaderActionButton",
      ns: "uxap",
      aProp: this._filterProps([
      { n: "activeIcon", v: activeicon },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "icon", v: icon },
      { n: "importance", v: importance },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "type", v: type },
      { n: "width", v: width },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "hideIcon", v: this.boolean_abap_2_json(hideicon) },
      { n: "hideText", v: this.boolean_abap_2_json(hidetext) },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "iconFirst", v: this.boolean_abap_2_json(iconfirst) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "press", v: press },
      ]),
    });
  }

  object_page_dyn_header_title() {
    return this._container({
      name: "ObjectPageDynamicHeaderTitle",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  generic_tile({ class: cssClass, id, header, mode, additionaltooltip, appshortcut, backgroundcolor, backgroundimage, dropareaoffset, press, frametype, failedtext, headerimage, scope, sizebehavior, state, systeminfo, tilebadge, tileicon, url, valuecolor, width, wrappingtype, imagedescription, navigationbuttontext, visible, renderonthemechange, enablenavigationbutton, pressenabled, iconloaded, subheader } = {}) {
    return this._container({
      name: "GenericTile",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "id", v: id },
      { n: "header", v: header },
      { n: "mode", v: mode },
      { n: "additionalTooltip", v: additionaltooltip },
      { n: "appShortcut", v: appshortcut },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "backgroundImage", v: backgroundimage },
      { n: "dropAreaOffset", v: dropareaoffset },
      { n: "press", v: press },
      { n: "frameType", v: frametype },
      { n: "failedText", v: failedtext },
      { n: "headerImage", v: headerimage },
      { n: "scope", v: scope },
      { n: "sizeBehavior", v: sizebehavior },
      { n: "state", v: state },
      { n: "systemInfo", v: systeminfo },
      { n: "tileBadge", v: tilebadge },
      { n: "tileIcon", v: tileicon },
      { n: "url", v: url },
      { n: "valueColor", v: valuecolor },
      { n: "width", v: width },
      { n: "wrappingType", v: wrappingtype },
      { n: "imageDescription", v: imagedescription },
      { n: "navigationButtonText", v: navigationbuttontext },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "renderOnThemeChange", v: this.boolean_abap_2_json(renderonthemechange) },
      { n: "enableNavigationButton", v: this.boolean_abap_2_json(enablenavigationbutton) },
      { n: "pressEnabled", v: this.boolean_abap_2_json(pressenabled) },
      { n: "iconLoaded", v: this.boolean_abap_2_json(iconloaded) },
      { n: "subheader", v: subheader },
      ]),
    });
  }

  numeric_content({ icon, withmargin, adaptivefontsize, animatetextchange, formattervalue, icondescription, indicator, nullifyvalue, scale, state, truncatevalueto, valuecolor, visible, width, class: cssClass, press, value } = {}) {
    return this._container({
      name: "NumericContent",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "icon", v: icon },
      { n: "width", v: width },
      { n: "valueColor", v: valuecolor },
      { n: "truncateValueTo", v: truncatevalueto },
      { n: "state", v: state },
      { n: "scale", v: scale },
      { n: "indicator", v: indicator },
      { n: "iconDescription", v: icondescription },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "nullifyValue", v: this.boolean_abap_2_json(nullifyvalue) },
      { n: "formatterValue", v: this.boolean_abap_2_json(formattervalue) },
      { n: "animateTextChange", v: this.boolean_abap_2_json(animatetextchange) },
      { n: "adaptiveFontSize", v: this.boolean_abap_2_json(adaptivefontsize) },
      { n: "withMargin", v: this.boolean_abap_2_json(withmargin) },
      { n: "class", v: cssClass },
      { n: "press", v: press },
      ]),
    });
  }

  link_tile_content({ linkhref, linktext, iconsrc, linkpress } = {}) {
    return this._container({
      name: "LinkTileContent",
      aProp: this._filterProps([
      { n: "iconSrc", v: iconsrc },
      { n: "linkHref", v: linkhref },
      { n: "linkText", v: linktext },
      { n: "linkPress", v: linkpress },
      ]),
    });
  }

  image_content({ src, description, visible, class: cssClass, press } = {}) {
    return this._container({
      name: "ImageContent",
      aProp: this._filterProps([
      { n: "src", v: src },
      { n: "description", v: description },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "class", v: cssClass },
      { n: "press", v: press },
      ]),
    });
  }

  tile_content({ unit, footercolor, blocked, frametype, priority, prioritytext, state, disabled, visible, footer, class: cssClass } = {}) {
    return this._container({
      name: "TileContent",
      aProp: this._filterProps([
      { n: "unit", v: unit },
      { n: "footerColor", v: footercolor },
      { n: "blocked", v: this.boolean_abap_2_json(blocked) },
      { n: "frameType", v: frametype },
      { n: "priority", v: priority },
      { n: "priorityText", v: prioritytext },
      { n: "state", v: state },
      { n: "disabled", v: this.boolean_abap_2_json(disabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "footer", v: footer },
      { n: "class", v: cssClass },
      ]),
    });
  }

  expanded_heading() {
    return this._container({
      name: "expandedHeading",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  snapped_heading() {
    return this._leaf({
      name: "snappedHeading",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  expanded_content(args = {}) {
    return this._container({
      name: "expandedContent",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  snapped_content(args = {}) {
    return this._container({
      name: "snappedContent",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  heading(args = {}) {
    return this._container({
      name: "heading",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  actions(args = {}) {
    return this._container({
      name: "actions",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  snapped_title_on_mobile() {
    return this._container({
      name: "snappedTitleOnMobile",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  header(args = {}) {
    return this._container({
      name: "header",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  navigation_actions() {
    return this._container({
      name: "navigationActions",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  avatar({ ns, id, src, class: cssClass, displaysize, ariahaspopup, backgroundcolor, badgeicon, badgetooltip, badgevaluestate, customdisplaysize, customfontsize, displayshape, fallbackicon, imagefittype, initials, showborder, decorative, enabled, press } = {}) {
    return this._leaf({
      name: "Avatar",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "src", v: src },
      { n: "class", v: cssClass },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "badgeIcon", v: badgeicon },
      { n: "badgeTooltip", v: badgetooltip },
      { n: "badgeValueState", v: badgevaluestate },
      { n: "customDisplaySize", v: customdisplaysize },
      { n: "customFontSize", v: customfontsize },
      { n: "displayShape", v: displayshape },
      { n: "fallbackIcon", v: fallbackicon },
      { n: "imageFitType", v: imagefittype },
      { n: "initials", v: initials },
      { n: "showBorder", v: this.boolean_abap_2_json(showborder) },
      { n: "decorative", v: this.boolean_abap_2_json(decorative) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "displaySize", v: displaysize },
      { n: "press", v: press },
      ]),
    });
  }

  avatar_group({ id, avatarcustomdisplaysize, avatarcustomfontsize, avatardisplaysize, blocked, busy, busyindicatordelay, busyindicatorsize, fieldgroupids, grouptype, visible, tooltip, items, press } = {}) {
    return this._container({
      name: "AvatarGroup",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "avatarCustomDisplaySize", v: avatarcustomdisplaysize },
      { n: "avatarCustomDispavatarCustomFontSizelaySize", v: avatarcustomfontsize },
      { n: "avatarDisplaySize", v: avatardisplaysize },
      { n: "blocked", v: this.boolean_abap_2_json(blocked) },
      { n: "busy", v: this.boolean_abap_2_json(busy) },
      { n: "busyIndicatorDelay", v: busyindicatordelay },
      { n: "busyIndicatorSize", v: busyindicatorsize },
      { n: "fieldGroupIds", v: fieldgroupids },
      { n: "groupType", v: grouptype },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "tooltip", v: tooltip },
      { n: "items", v: items },
      { n: "press", v: press },
      ]),
    });
  }

  avatar_group_item({ id, busy, busyindicatordelay, busyindicatorsize, fallbackicon, fieldgroupids, initials, src, visible, tooltip } = {}) {
    return this._leaf({
      name: "AvatarGroupItem",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "busy", v: busy },
      { n: "busyIndicatorDelay", v: busyindicatordelay },
      { n: "busyIndicatorSize", v: busyindicatorsize },
      { n: "fallbackIcon", v: fallbackicon },
      { n: "fieldGroupIds", v: fieldgroupids },
      { n: "initials", v: initials },
      { n: "src", v: src },
      { n: "visible", v: visible },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  header_title() {
    return this._container({
      name: "headerTitle",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  sections() {
    return this._container({
      name: "sections",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  object_page_section({ titleuppercase, title, importance, id, titlelevel, showtitle, visible, wraptitle, anchorbarbuttoncolor, titlevisible } = {}) {
    return this._container({
      name: "ObjectPageSection",
      ns: "uxap",
      aProp: this._filterProps([
      { n: "titleUppercase", v: this.boolean_abap_2_json(titleuppercase) },
      { n: "title", v: title },
      { n: "id", v: id },
      { n: "anchorBarButtonColor", v: anchorbarbuttoncolor },
      { n: "titleLevel", v: titlelevel },
      { n: "titleVisible", v: this.boolean_abap_2_json(titlevisible) },
      { n: "showTitle", v: this.boolean_abap_2_json(showtitle) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "wrapTitle", v: this.boolean_abap_2_json(wraptitle) },
      { n: "importance", v: importance },
      ]),
    });
  }

  sub_sections() {
    return this._container({
      name: "subSections",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  object_page_sub_section({ id, title, mode, importance, titlelevel, showtitle, titleuppercase, visible, titlevisible } = {}) {
    return this._container({
      name: "ObjectPageSubSection",
      ns: "uxap",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "mode", v: mode },
      { n: "importance", v: importance },
      { n: "titleLevel", v: titlelevel },
      { n: "titleVisible", v: this.boolean_abap_2_json(titlevisible) },
      { n: "showTitle", v: this.boolean_abap_2_json(showtitle) },
      { n: "titleUppercase", v: this.boolean_abap_2_json(titleuppercase) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "title", v: title },
      ]),
    });
  }

  shell({ ns, appwidthlimited } = {}) {
    return this._container({
      name: "Shell",
      aProp: this._filterProps([
      { n: "appWidthLimited", v: this.boolean_abap_2_json(appwidthlimited) },
      ]),
    });
  }

  shell_bar({ homeicon, homeicontooltip, notificationsnumber, secondtitle, showcopilot, showmenubutton, shownavbutton, shownotifications, showproductswitcher, showsearch, title, avatarpressed, copilotpressed, homeiconpressed, menubuttonpressed, navbuttonpressed, notificationspressed, productswitcherpressed, searchbuttonpressed } = {}) {
    return this._container({
      name: "ShellBar",
      ns: "f",
      aProp: this._filterProps([
      { n: "homeIcon", v: homeicon },
      { n: "homeIconTooltip", v: homeicontooltip },
      { n: "title", v: title },
      { n: "secondTitle", v: secondtitle },
      { n: "showCopilot", v: this.boolean_abap_2_json(showcopilot) },
      { n: "showMenuButton", v: this.boolean_abap_2_json(showmenubutton) },
      { n: "showNavButton", v: this.boolean_abap_2_json(shownavbutton) },
      { n: "showNotifications", v: this.boolean_abap_2_json(shownotifications) },
      { n: "showProductSwitcher", v: this.boolean_abap_2_json(showproductswitcher) },
      { n: "showSearch", v: this.boolean_abap_2_json(showsearch) },
      { n: "notificationsNumber", v: notificationsnumber },
      { n: "avatarPressed", v: avatarpressed },
      { n: "copilotPressed", v: copilotpressed },
      { n: "homeIconPressed", v: homeiconpressed },
      { n: "menuButtonPressed", v: menubuttonpressed },
      { n: "navButtonPressed", v: navbuttonpressed },
      { n: "notificationsPressed", v: notificationspressed },
      { n: "productSwitcherPressed", v: productswitcherpressed },
      { n: "searchButtonPressed", v: searchbuttonpressed },
      ]),
    });
  }

  blocks() {
    return this._container({
      name: "blocks",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  more_blocks() {
    return this._container({
      name: "moreBlocks",
      ns: "uxap",
      aProp: this._filterProps([

      ]),
    });
  }

  layout_data(args = {}) {
    return this._container({
      name: "layoutData",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  flex_item_data({ growfactor, basesize, backgrounddesign, styleclass, order, shrinkfactor } = {}) {
    return this._leaf({
      name: "FlexItemData",
      aProp: this._filterProps([
      { n: "growFactor", v: growfactor },
      { n: "baseSize", v: basesize },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "styleClass", v: styleclass },
      { n: "order", v: order },
      { n: "shrinkFactor", v: shrinkfactor },
      ]),
    });
  }

  code_editor({ type, height, width, editable, value } = {}) {
    return this._leaf({
      name: "CodeEditor",
      ns: "editor",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "type", v: type },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "height", v: height },
      { n: "width", v: width },
      ]),
    });
  }

  suggestion_item({ description, icon, key, text, textdirection } = {}) {
    return this._leaf({
      name: "SuggestionItem",
      aProp: this._filterProps([
      { n: "description", v: description },
      { n: "icon", v: icon },
      { n: "key", v: key },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      ]),
    });
  }

  vertical_layout({ class: cssClass, width, enabled, visible, id } = {}) {
    return this._container({
      name: "VerticalLayout",
      ns: "layout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "class", v: cssClass },
      { n: "width", v: width },
      ]),
    });
  }

  multi_input({ showclearicon, showvaluehelp, valuehelponly, name, suggestionitems, tokenupdate, width, id, tokens, submit, valuehelprequest, enabled, class: cssClass, change, required, valuestate, valuestatetext, placeholder, showsuggestion, visible, value } = {}) {
    return this._container({
      name: "MultiInput",
      aProp: this._filterProps([
      { n: "tokens", v: tokens },
      { n: "showClearIcon", v: this.boolean_abap_2_json(showclearicon) },
      { n: "name", v: name },
      { n: "valueHelpOnly", v: this.boolean_abap_2_json(valuehelponly) },
      { n: "showValueHelp", v: this.boolean_abap_2_json(showvaluehelp) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "suggestionItems", v: suggestionitems },
      { n: "tokenUpdate", v: tokenupdate },
      { n: "submit", v: submit },
      { n: "width", v: width },
      { n: "value", v: value },
      { n: "id", v: id },
      { n: "change", v: change },
      { n: "valueHelpRequest", v: valuehelprequest },
      { n: "class", v: cssClass },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "required", v: required },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "placeholder", v: placeholder },
      { n: "showSuggestion", v: this.boolean_abap_2_json(showsuggestion) },
      ]),
    });
  }

  tokens(args = {}) {
    return this._container({
      name: "tokens",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  token({ key, text, selected, visible, editable } = {}) {
    return this._leaf({
      name: "Token",
      aProp: this._filterProps([
      { n: "key", v: key },
      { n: "text", v: text },
      { n: "selected", v: selected },
      { n: "visible", v: visible },
      { n: "editable", v: editable },
      ]),
    });
  }

  // positional arg = value (abap PREFERRED PARAMETER)
  input(args = {}) {
    const { value, id, placeholder, type, showclearicon, valuestate, valuestatetext, showtablesuggestionvaluehelp, description, editable, enabled, suggestionitems, suggestionrows, showsuggestion, showvaluehelp, valuehelprequest, required, suggest, class: cssClass, visible, submit, valueliveupdate, autocomplete, maxsuggestionwidth, fieldwidth, valuehelponly, width, change, valuehelpiconsrc, textformatter, textformatmode, maxlength, startsuggestion, enablesuggestionshighlighting, enabletableautopopinmode, arialabelledby, ariadescribedby } = typeof args === "string" ? { value: args } : args || {};
    return this._leaf({
      name: "Input",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "placeholder", v: placeholder },
      { n: "type", v: type },
      { n: "maxLength", v: maxlength },
      { n: "showClearIcon", v: this.boolean_abap_2_json(showclearicon) },
      { n: "description", v: description },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "enableTableAutoPopinMode", v: this.boolean_abap_2_json(enabletableautopopinmode) },
      { n: "enableSuggestionsHighlighting", v: this.boolean_abap_2_json(enablesuggestionshighlighting) },
      { n: "showTableSuggestionValueHelp", v: this.boolean_abap_2_json(showtablesuggestionvaluehelp) },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "value", v: value },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "suggest", v: suggest },
      { n: "suggestionItems", v: suggestionitems },
      { n: "suggestionRows", v: suggestionrows },
      { n: "showSuggestion", v: this.boolean_abap_2_json(showsuggestion) },
      { n: "valueHelpRequest", v: valuehelprequest },
      { n: "autocomplete", v: this.boolean_abap_2_json(autocomplete) },
      { n: "valueLiveUpdate", v: this.boolean_abap_2_json(valueliveupdate) },
      { n: "submit", v: this.boolean_abap_2_json(submit) },
      { n: "showValueHelp", v: this.boolean_abap_2_json(showvaluehelp) },
      { n: "valueHelpOnly", v: this.boolean_abap_2_json(valuehelponly) },
      { n: "class", v: cssClass },
      { n: "change", v: change },
      { n: "maxSuggestionWidth", v: maxsuggestionwidth },
      { n: "width", v: width },
      { n: "textFormatter", v: textformatter },
      { n: "startSuggestion", v: startsuggestion },
      { n: "valueHelpIconSrc", v: valuehelpiconsrc },
      { n: "textFormatMode", v: textformatmode },
      { n: "fieldWidth", v: fieldwidth },
      { n: "ariaLabelledBy", v: arialabelledby },
      { n: "ariaDescribedBy", v: ariadescribedby },
      ]),
    });
  }

  dialog({ title, icon, showheader, stretch, contentheight, contentwidth, resizable, horizontalscrolling, verticalscrolling, afterclose, beforeopen, beforeclose, afteropen, draggable, closeonnavigation, escapehandler, type, titlealignment, state } = {}) {
    return this._container({
      name: "Dialog",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "icon", v: icon },
      { n: "stretch", v: stretch },
      { n: "state", v: state },
      { n: "titleAlignment", v: titlealignment },
      { n: "type", v: type },
      { n: "showHeader", v: showheader },
      { n: "contentWidth", v: contentwidth },
      { n: "contentHeight", v: contentheight },
      { n: "escapeHandler", v: escapehandler },
      { n: "closeOnNavigation", v: this.boolean_abap_2_json(closeonnavigation) },
      { n: "draggable", v: this.boolean_abap_2_json(draggable) },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      { n: "horizontalScrolling", v: this.boolean_abap_2_json(horizontalscrolling) },
      { n: "verticalScrolling", v: this.boolean_abap_2_json(verticalscrolling) },
      { n: "afterOpen", v: afteropen },
      { n: "beforeClose", v: beforeclose },
      { n: "beforeOpen", v: beforeopen },
      { n: "afterClose", v: afterclose },
      ]),
    });
  }

  carousel({ height, class: cssClass, loop, id, arrowsplacement, backgrounddesign, pageindicatorbackgrounddesign, pageindicatorborderdesign, pageindicatorplacement, width, showpageindicator, visible, pages } = {}) {
    return this._container({
      name: "Carousel",
      aProp: this._filterProps([
      { n: "loop", v: this.boolean_abap_2_json(loop) },
      { n: "class", v: cssClass },
      { n: "height", v: height },
      { n: "id", v: id },
      { n: "arrowsPlacement", v: arrowsplacement },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "pageIndicatorBackgroundDesign", v: pageindicatorbackgrounddesign },
      { n: "pageIndicatorBorderDesign", v: pageindicatorborderdesign },
      { n: "pageIndicatorPlacement", v: pageindicatorplacement },
      { n: "width", v: width },
      { n: "showPageIndicator", v: showpageindicator },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "pages", v: pages },
      ]),
    });
  }

  columns(args = {}) {
    return this._container({
      name: "columns",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  analytical_column(args = {}) {
    return this._container({
      name: "AnalyticalColumn",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  column({ width, id, minscreenwidth, demandpopin, halign, visible, valign, styleclass, sortindicator, popindisplay, mergefunctionname, mergeduplicates, importance, autopopinwidth, class: cssClass, headermenu } = {}) {
    return this._container({
      name: "Column",
      aProp: this._filterProps([
      { n: "width", v: width },
      { n: "minScreenWidth", v: minscreenwidth },
      { n: "hAlign", v: halign },
      { n: "headerMenu", v: headermenu },
      { n: "autoPopinWidth", v: autopopinwidth },
      { n: "vAlign", v: valign },
      { n: "importance", v: importance },
      { n: "mergeFunctionName", v: mergefunctionname },
      { n: "popinDisplay", v: popindisplay },
      { n: "sortIndicator", v: sortindicator },
      { n: "styleClass", v: styleclass },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "mergeDuplicates", v: this.boolean_abap_2_json(mergeduplicates) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "demandPopin", v: this.boolean_abap_2_json(demandpopin) },
      ]),
    });
  }

  items(args = {}) {
    return this._container({
      name: "items",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  interact_donut_chart({ selectionchanged, errormessage, errormessagetitle, showerror, displayedsegments, press, segments, selectionenabled } = {}) {
    return this._container({
      name: "InteractiveDonutChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "selectionChanged", v: selectionchanged },
      { n: "selectionEnabled", v: this.boolean_abap_2_json(selectionenabled) },
      { n: "showError", v: this.boolean_abap_2_json(showerror) },
      { n: "errorMessageTitle", v: errormessagetitle },
      { n: "errorMessage", v: errormessage },
      { n: "displayedSegments", v: displayedsegments },
      { n: "segments", v: segments },
      { n: "press", v: press },
      ]),
    });
  }

  segments() {
    return this._container({
      name: "segments",
      ns: "mchart",
      aProp: this._filterProps([

      ]),
    });
  }

  interact_donut_chart_segment({ label, displayedvalue, selected, color, value } = {}) {
    return this._container({
      name: "InteractiveDonutChartSegment",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "label", v: label },
      { n: "displayedValue", v: displayedvalue },
      { n: "value", v: value },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "color", v: color },
      ]),
    });
  }

  interact_bar_chart({ selectionchanged, selectionenabled, press, labelwidth, errormessage, errormessagetitle, showerror, displayedbars, bars, max, min } = {}) {
    return this._container({
      name: "InteractiveBarChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "selectionChanged", v: selectionchanged },
      { n: "selectionEnabled", v: this.boolean_abap_2_json(selectionenabled) },
      { n: "showError", v: this.boolean_abap_2_json(showerror) },
      { n: "press", v: press },
      { n: "labelWidth", v: labelwidth },
      { n: "bars", v: bars },
      { n: "errorMessageTitle", v: errormessagetitle },
      { n: "displayedBars", v: displayedbars },
      { n: "min", v: min },
      { n: "max", v: max },
      { n: "errorMessage", v: errormessage },
      ]),
    });
  }

  bars() {
    return this._container({
      name: "bars",
      ns: "mchart",
      aProp: this._filterProps([

      ]),
    });
  }

  interact_bar_chart_bar({ label, displayedvalue, selected, color, value } = {}) {
    return this._container({
      name: "InteractiveBarChartBar",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "label", v: label },
      { n: "displayedValue", v: displayedvalue },
      { n: "value", v: value },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "color", v: color },
      ]),
    });
  }

  interact_line_chart({ selectionchanged, press, precedingpoint, succeedingpoint, errormessage, errormessagetitle, showerror, displayedpoints, selectionenabled, points } = {}) {
    return this._container({
      name: "InteractiveLineChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "selectionChanged", v: selectionchanged },
      { n: "showError", v: this.boolean_abap_2_json(showerror) },
      { n: "press", v: press },
      { n: "errorMessageTitle", v: errormessagetitle },
      { n: "errorMessage", v: errormessage },
      { n: "precedingPoint", v: precedingpoint },
      { n: "points", v: points },
      { n: "succeedingPoint", v: succeedingpoint },
      { n: "displayedPoints", v: displayedpoints },
      { n: "selectionEnabled", v: selectionenabled },
      ]),
    });
  }

  points() {
    return this._container({
      name: "points",
      ns: "mchart",
      aProp: this._filterProps([

      ]),
    });
  }

  interact_line_chart_point({ label, secondarylabel, displayedvalue, selected, value } = {}) {
    return this._container({
      name: "InteractiveLineChartPoint",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "label", v: label },
      { n: "secondaryLabel", v: secondarylabel },
      { n: "value", v: value },
      { n: "displayedValue", v: displayedvalue },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      ]),
    });
  }

  radial_micro_chart({ size, percentage, press, valuecolor, height, aligncontent, hideonnodata } = {}) {
    return this._leaf({
      name: "RadialMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "percentage", v: percentage },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "alignContent", v: aligncontent },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "valueColor", v: valuecolor },
      ]),
    });
  }

  column_list_item({ id, valign, selected, type, press, counter, highlight, highlighttext, navigated, unread, visible, detailpress } = {}) {
    return this._container({
      name: "ColumnListItem",
      aProp: this._filterProps([
      { n: "vAlign", v: valign },
      { n: "id", v: id },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "unread", v: this.boolean_abap_2_json(unread) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "type", v: type },
      { n: "counter", v: counter },
      { n: "highlight", v: highlight },
      { n: "highlightText", v: highlighttext },
      { n: "detailPress", v: detailpress },
      { n: "navigated", v: this.boolean_abap_2_json(navigated) },
      { n: "press", v: press },
      ]),
    });
  }

  action_list_item({ id, text } = {}) {
    return this._container({
      name: "ActionListItem",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "text", v: text },
      ]),
    });
  }

  content_areas(args = {}) {
    return this._container({
      name: "contentAreas",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  field({ ns, id, editmode, showemptyindicator, value } = {}) {
    return this._container({
      name: "Field",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "value", v: value },
      { n: "editMode", v: editmode },
      { n: "showEmptyIndicator", v: this.boolean_abap_2_json(showemptyindicator) },
      ]),
    });
  }

  header_content(args = {}) {
    return this._container({
      name: "headerContent",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  sub_header(args = {}) {
    return this._container({
      name: "subHeader",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  custom_data(args = {}) {
    return this._container({
      name: "customData",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  core_custom_data({ key, writetodom, value } = {}) {
    return this._leaf({
      name: "CustomData",
      ns: "core",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "key", v: key },
      { n: "writeToDom", v: this.boolean_abap_2_json(writetodom) },
      ]),
    });
  }

  badge_custom_data({ key, visible, value } = {}) {
    return this._leaf({
      name: "BadgeCustomData",
      aProp: this._filterProps([
      { n: "key", v: key },
      { n: "value", v: value },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  toggle_button({ text, icon, type, enabled, press, class: cssClass, pressed } = {}) {
    return this._leaf({
      name: "ToggleButton",
      aProp: this._filterProps([
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "icon", v: icon },
      { n: "type", v: type },
      { n: "class", v: cssClass },
      { n: "pressed", v: this.boolean_abap_2_json(pressed) },
      ]),
    });
  }

  button({ text, icon, type, enabled, visible, press, class: cssClass, id, ns, tooltip, width, iconfirst, icondensityaware, ariahaspopup, activeicon, accessiblerole, textdirection, arialabelledby, ariadescribedby } = {}) {
    return this._leaf({
      name: "Button",
      aProp: this._filterProps([
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "iconFirst", v: this.boolean_abap_2_json(iconfirst) },
      { n: "icon", v: icon },
      { n: "type", v: type },
      { n: "id", v: id },
      { n: "width", v: width },
      { n: "tooltip", v: tooltip },
      { n: "textDirection", v: textdirection },
      { n: "accessibleRole", v: accessiblerole },
      { n: "activeIcon", v: activeicon },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "class", v: cssClass },
      { n: "ariaLabelledBy", v: arialabelledby },
      { n: "ariaDescribedBy", v: ariadescribedby },
      ]),
    });
  }

  search_field({ search, width, id, class: cssClass, change, livechange, suggest, enabled, enablesuggestions, maxlength, placeholder, showrefreshbutton, showsearchbutton, visible, value } = {}) {
    return this._leaf({
      name: "SearchField",
      aProp: this._filterProps([
      { n: "width", v: width },
      { n: "search", v: search },
      { n: "value", v: value },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "change", v: change },
      { n: "maxLength", v: maxlength },
      { n: "placeholder", v: placeholder },
      { n: "suggest", v: suggest },
      { n: "enableSuggestions", v: this.boolean_abap_2_json(enablesuggestions) },
      { n: "showRefreshButton", v: this.boolean_abap_2_json(showrefreshbutton) },
      { n: "showSearchButton", v: this.boolean_abap_2_json(showsearchbutton) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "liveChange", v: livechange },
      ]),
    });
  }

  message_view({ items, groupitems } = {}) {
    return this._container({
      name: "MessageView",
      aProp: this._filterProps([
      { n: "items", v: items },
      { n: "groupItems", v: this.boolean_abap_2_json(groupitems) },
      ]),
    });
  }

  barcode_scanner_button({ id, scansuccess, scanfail, inputliveupdate, dialogtitle, disablebarcodeinputdialog, framerate, keepcamerascan, preferfrontcamera, providefallback, width, zoom } = {}) {
    return this._container({
      name: "BarcodeScannerButton",
      ns: "ndc",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "scanSuccess", v: scansuccess },
      { n: "scanFail", v: scanfail },
      { n: "inputLiveUpdate", v: inputliveupdate },
      { n: "dialogTitle", v: dialogtitle },
      { n: "disableBarcodeInputDialog", v: disablebarcodeinputdialog },
      { n: "frameRate", v: framerate },
      { n: "keepCameraScan", v: keepcamerascan },
      { n: "preferFrontCamera", v: preferfrontcamera },
      { n: "provideFallback", v: providefallback },
      { n: "width", v: width },
      { n: "zoom", v: zoom },
      ]),
    });
  }

  message_popover({ items, groupitems, listselect, activetitlepress, placement, afterclose, beforeclose, initiallyexpanded } = {}) {
    return this._container({
      name: "MessagePopover",
      aProp: this._filterProps([
      { n: "items", v: items },
      { n: "activeTitlePress", v: activetitlepress },
      { n: "placement", v: placement },
      { n: "listSelect", v: listselect },
      { n: "afterClose", v: afterclose },
      { n: "beforeClose", v: beforeclose },
      { n: "initiallyExpanded", v: this.boolean_abap_2_json(initiallyexpanded) },
      { n: "groupItems", v: this.boolean_abap_2_json(groupitems) },
      ]),
    });
  }

  message_item({ type, title, subtitle, description, groupname, markupdescription, textdirection, longtexturl, counter, activetitle } = {}) {
    return this._container({
      name: "MessageItem",
      aProp: this._filterProps([
      { n: "type", v: type },
      { n: "title", v: title },
      { n: "subtitle", v: subtitle },
      { n: "description", v: description },
      { n: "longtextUrl", v: longtexturl },
      { n: "textDirection", v: textdirection },
      { n: "groupName", v: groupname },
      { n: "activeTitle", v: this.boolean_abap_2_json(activetitle) },
      { n: "counter", v: counter },
      { n: "markupDescription", v: this.boolean_abap_2_json(markupdescription) },
      ]),
    });
  }

  page({ title, navbuttonpress, shownavbutton, showheader, id, class: cssClass, ns, backgrounddesign, contentonlybusy, enablescrolling, navbuttontooltip, floatingfooter, showfooter, showsubheader, titlealignment, titlelevel } = {}) {
    return this._container({
      name: "Page",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "showNavButton", v: this.boolean_abap_2_json(shownavbutton) },
      { n: "navButtonPress", v: navbuttonpress },
      { n: "showHeader", v: this.boolean_abap_2_json(showheader) },
      { n: "class", v: cssClass },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "navButtonTooltip", v: navbuttontooltip },
      { n: "titleAlignment", v: titlealignment },
      { n: "titleLevel", v: titlelevel },
      { n: "contentOnlyBusy", v: this.boolean_abap_2_json(contentonlybusy) },
      { n: "enableScrolling", v: this.boolean_abap_2_json(enablescrolling) },
      { n: "floatingFooter", v: this.boolean_abap_2_json(floatingfooter) },
      { n: "showFooter", v: this.boolean_abap_2_json(showfooter) },
      { n: "showSubHeader", v: this.boolean_abap_2_json(showsubheader) },
      { n: "id", v: id },
      ]),
    });
  }

  menu_button({ text, activeicon, buttonmode, type, enabled, defaultaction } = {}) {
    return this._container({
      name: "MenuButton",
      aProp: this._filterProps([
      { n: "buttonMode", v: buttonmode },
      { n: "defaultAction", v: defaultaction },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "activeIcon", v: activeicon },
      { n: "type", v: type },
      ]),
    });
  }

  panel({ expandable, expanded, headertext, stickyheader, height, class: cssClass, id, width, backgrounddesign, expandanimation, visible, expand } = {}) {
    return this._container({
      name: "Panel",
      aProp: this._filterProps([
      { n: "expandable", v: this.boolean_abap_2_json(expandable) },
      { n: "expanded", v: this.boolean_abap_2_json(expanded) },
      { n: "stickyHeader", v: this.boolean_abap_2_json(stickyheader) },
      { n: "expandAnimation", v: this.boolean_abap_2_json(expandanimation) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "height", v: height },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "expand", v: expand },
      { n: "headerText", v: headertext },
      ]),
    });
  }

  vbox({ id, height, justifycontent, class: cssClass, rendertype, aligncontent, direction, alignitems, width, wrap, backgrounddesign, displayinline, fitcontainer, visible } = {}) {
    return this._container({
      name: "VBox",
      aProp: this._filterProps([
      { n: "height", v: height },
      { n: "id", v: id },
      { n: "justifyContent", v: justifycontent },
      { n: "renderType", v: rendertype },
      { n: "alignContent", v: aligncontent },
      { n: "alignItems", v: alignitems },
      { n: "width", v: width },
      { n: "wrap", v: wrap },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "direction", v: direction },
      { n: "displayInline", v: this.boolean_abap_2_json(displayinline) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "fitContainer", v: this.boolean_abap_2_json(fitcontainer) },
      { n: "class", v: cssClass },
      ]),
    });
  }

  hbox({ id, class: cssClass, justifycontent, aligncontent, alignitems, width, height, rendertype, wrap, backgrounddesign, direction, displayinline, fitcontainer, visible } = {}) {
    return this._container({
      name: "HBox",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "alignContent", v: aligncontent },
      { n: "alignItems", v: alignitems },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "renderType", v: rendertype },
      { n: "height", v: height },
      { n: "wrap", v: wrap },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "direction", v: direction },
      { n: "displayInline", v: this.boolean_abap_2_json(displayinline) },
      { n: "fitContainer", v: this.boolean_abap_2_json(fitcontainer) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "justifyContent", v: justifycontent },
      ]),
    });
  }

  scroll_container({ height, width, vertical, horizontal, id, focusable, visible } = {}) {
    return this._container({
      name: "ScrollContainer",
      aProp: this._filterProps([
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "vertical", v: this.boolean_abap_2_json(vertical) },
      { n: "horizontal", v: this.boolean_abap_2_json(horizontal) },
      { n: "focusable", v: this.boolean_abap_2_json(focusable) },
      ]),
    });
  }

  simple_form({ title, layout, class: cssClass, editable, columnsxl, columnsl, columnsm, id, adjustlabelspan, backgrounddesign, breakpointl, breakpointm, breakpointxl, emptyspanl, emptyspanm, emptyspans, emptyspanxl, labelspans, labelspanm, labelspanl, labelspanxl, maxcontainercols, minwidth, singlecontainerfullsize, visible, width } = {}) {
    return this._container({
      name: "SimpleForm",
      ns: "form",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "layout", v: layout },
      { n: "class", v: cssClass },
      { n: "adjustLabelSpan", v: adjustlabelspan },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "breakpointL", v: breakpointl },
      { n: "breakpointM", v: breakpointm },
      { n: "breakpointXL", v: breakpointxl },
      { n: "emptySpanL", v: emptyspanl },
      { n: "emptySpanM", v: emptyspanm },
      { n: "emptySpanS", v: emptyspans },
      { n: "emptySpanXL", v: emptyspanxl },
      { n: "labelSpanL", v: labelspanl },
      { n: "labelSpanM", v: labelspanm },
      { n: "labelSpanS", v: labelspans },
      { n: "labelSpanXL", v: labelspanxl },
      { n: "maxContainerCols", v: maxcontainercols },
      { n: "minWidth", v: minwidth },
      { n: "singleContainerFullSize", v: this.boolean_abap_2_json(singlecontainerfullsize) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "columnsXL", v: columnsxl },
      { n: "columnsL", v: columnsl },
      { n: "columnsM", v: columnsm },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      ]),
    });
  }

  /**
   * Raw XML/CSS/JS injection — mirrors abap _cc_plain_xml( val ). Transpiled
   * call sites pass the value positionally as a string; { val } also works.
   * Rendered as the raw VALUE (see _renderXml), never as a tag.
   */
  _cc_plain_xml(args = {}) {
    const val = typeof args === "string" ? args : args?.val;
    return this._leaf({
      name: "ZZPLAIN",
      aProp: this._filterProps([{ n: "VALUE", v: val }]),
    });
  }

  /**
   * Generic element — mirrors abap _generic( name, ns, t_prop ). Returns the
   * newly created child element.
   */
  _generic({ name, ns, t_prop } = {}) {
    return this._container({
      name: name,
      ns: ns || "",
      aProp: this._filterProps(t_prop || []),
    });
  }

  content(args = {}) {
    return this._container({
      name: "content",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  header_toolbar(args = {}) {
    return this._container({
      name: "headerToolbar",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  suggestion_items(args = {}) {
    return this._container({
      name: "suggestionItems",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  custom_header(args = {}) {
    return this._container({
      name: "customHeader",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  custom_list_item(args = {}) {
    return this._container({
      name: "CustomListItem",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  /** add a single raw property onto the current element — abap parity */
  _generic_property({ n, v } = {}) {
    this.aProp.push({ n, v });
    return this;
  }

  tab_container() {
    return this._container({
      name: "TabContainer",
      ns: "webc",
      aProp: this._filterProps([

      ]),
    });
  }

  tab({ text, selected } = {}) {
    return this._container({
      name: "Tab",
      ns: "webc",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "selected", v: selected },
      ]),
    });
  }

  overflow_toolbar({ press, text, active, visible, asyncmode, enabled, design, type, style, width, height, class: cssClass, id } = {}) {
    return this._container({
      name: "OverflowToolbar",
      aProp: this._filterProps([
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "active", v: this.boolean_abap_2_json(active) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "asyncMode", v: this.boolean_abap_2_json(asyncmode) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "design", v: design },
      { n: "type", v: type },
      { n: "style", v: style },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "width", v: width },
      { n: "height", v: height },
      ]),
    });
  }

  overflow_toolbar_toggle_button({ text, icon, type, enabled, press, tooltip } = {}) {
    return this._leaf({
      name: "OverflowToolbarToggleButton",
      aProp: this._filterProps([
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "icon", v: icon },
      { n: "type", v: type },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  overflow_toolbar_button({ id, text, icon, type, enabled, press, tooltip } = {}) {
    return this._leaf({
      name: "OverflowToolbarButton",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "icon", v: icon },
      { n: "type", v: type },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  overflow_toolbar_menu_button({ text, icon, buttonmode, type, enabled, tooltip, defaultaction } = {}) {
    return this._container({
      name: "OverflowToolbarMenuButton",
      aProp: this._filterProps([
      { n: "buttonMode", v: buttonmode },
      { n: "defaultAction", v: defaultaction },
      { n: "text", v: text },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "icon", v: icon },
      { n: "type", v: type },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  menu_item({ press, text, icon } = {}) {
    return this._leaf({
      name: "MenuItem",
      aProp: this._filterProps([
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "icon", v: icon },
      ]),
    });
  }

  // sap.m.Toolbar control — or the `toolbar` aggregation for ns table/form
  toolbar({ ns, id, press, width, active, ariahaspopup, design, enabled, height, style, visible } = {}) {
    return this._container({
      name: ns === "table" || ns === "form" ? "toolbar" : "Toolbar",
      ns: ns || "",
      aProp: this._filterProps([
        { n: "active", v: this.boolean_abap_2_json(active) },
        { n: "ariaHasPopup", v: ariahaspopup },
        { n: "design", v: design },
        { n: "enabled", v: this.boolean_abap_2_json(enabled) },
        { n: "visible", v: this.boolean_abap_2_json(visible) },
        { n: "height", v: height },
        { n: "style", v: style },
        { n: "width", v: width },
        { n: "id", v: id },
        { n: "press", v: press },
      ]),
    });
  }

  toolbar_spacer({ ns, width } = {}) {
    return this._leaf({
      name: "ToolbarSpacer",
      aProp: this._filterProps([
      { n: "width", v: width },
      ]),
    });
  }

  label({ text, labelfor, design, displayonly, required, showcolon, textalign, textdirection, valign, width, wrapping, wrappingtype, id, class: cssClass, visible } = {}) {
    return this._leaf({
      name: "Label",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "displayOnly", v: this.boolean_abap_2_json(displayonly) },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "showColon", v: this.boolean_abap_2_json(showcolon) },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "vAlign", v: valign },
      { n: "width", v: width },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "wrappingType", v: wrappingtype },
      { n: "design", v: design },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "labelFor", v: labelfor },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  image({ src, class: cssClass, height, width, usemap, mode, lazyloading, densityaware, decorative, backgroundsize, backgroundrepeat, backgroundposition, ariahaspopup, alt, activesrc, press, load, error, id } = {}) {
    return this._leaf({
      name: "Image",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "src", v: src },
      { n: "class", v: cssClass },
      { n: "height", v: height },
      { n: "alt", v: alt },
      { n: "activeSrc", v: activesrc },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "backgroundPosition", v: backgroundposition },
      { n: "backgroundRepeat", v: backgroundrepeat },
      { n: "backgroundSize", v: backgroundsize },
      { n: "mode", v: mode },
      { n: "useMap", v: usemap },
      { n: "width", v: width },
      { n: "error", v: error },
      { n: "press", v: press },
      { n: "load", v: load },
      { n: "decorative", v: this.boolean_abap_2_json(decorative) },
      { n: "densityAware", v: this.boolean_abap_2_json(densityaware) },
      { n: "lazyLoading", v: this.boolean_abap_2_json(lazyloading) },
      ]),
    });
  }

  date_picker({ placeholder, displayformat, valueformat, required, valuestate, valuestatetext, enabled, showcurrentdatebutton, change, hideinput, showfooter, visible, showvaluestatemessage, mindate, maxdate, editable, width, id, calendarweeknumbering, displayformattype, class: cssClass, textdirection, textalign, name, datevalue, initialfocuseddatevalue, value } = {}) {
    return this._leaf({
      name: "DatePicker",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "displayFormat", v: displayformat },
      { n: "displayFormatType", v: displayformattype },
      { n: "valueFormat", v: valueformat },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "placeholder", v: placeholder },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "change", v: change },
      { n: "maxDate", v: maxdate },
      { n: "minDate", v: mindate },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "dateValue", v: datevalue },
      { n: "name", v: name },
      { n: "class", v: cssClass },
      { n: "calendarWeekNumbering", v: calendarweeknumbering },
      { n: "initialFocusedDateValue", v: initialfocuseddatevalue },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "hideInput", v: this.boolean_abap_2_json(hideinput) },
      { n: "showFooter", v: this.boolean_abap_2_json(showfooter) },
      { n: "showValueStateMessage", v: this.boolean_abap_2_json(showvaluestatemessage) },
      { n: "showCurrentDateButton", v: this.boolean_abap_2_json(showcurrentdatebutton) },
      ]),
    });
  }

  time_picker({ placeholder, enabled, valuestate, displayformat, valueformat, required, width, datevalue, localeid, mask, maskmode, minutesstep, name, placeholdersymbol, secondsstep, textalign, textdirection, title, showcurrenttimebutton, showvaluestatemessage, support2400, initialfocuseddatevalue, hideinput, editable, visible, valuestatetext, livechange, change, aftervaluehelpopen, aftervaluehelpclose, value } = {}) {
    return this._leaf({
      name: "TimePicker",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "dateValue", v: datevalue },
      { n: "localeId", v: localeid },
      { n: "placeholder", v: placeholder },
      { n: "mask", v: mask },
      { n: "maskMode", v: maskmode },
      { n: "minutesStep", v: minutesstep },
      { n: "name", v: name },
      { n: "placeholderSymbol", v: placeholdersymbol },
      { n: "secondsStep", v: secondsstep },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "title", v: title },
      { n: "showCurrentTimeButton", v: this.boolean_abap_2_json(showcurrenttimebutton) },
      { n: "showValueStateMessage", v: this.boolean_abap_2_json(showvaluestatemessage) },
      { n: "support2400", v: this.boolean_abap_2_json(support2400) },
      { n: "initialFocusedDateValue", v: this.boolean_abap_2_json(initialfocuseddatevalue) },
      { n: "hideInput", v: this.boolean_abap_2_json(hideinput) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "displayFormat", v: displayformat },
      { n: "afterValueHelpClose", v: aftervaluehelpclose },
      { n: "afterValueHelpOpen", v: aftervaluehelpopen },
      { n: "change", v: change },
      { n: "liveChange", v: livechange },
      { n: "valueFormat", v: valueformat },
      ]),
    });
  }

  date_time_picker({ placeholder, enabled, valuestate, value } = {}) {
    return this._leaf({
      name: "DateTimePicker",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "placeholder", v: placeholder },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "valueState", v: valuestate },
      ]),
    });
  }

  link({ text, href, target, enabled, press, id, ns, wrapping, width, validateurl, textdirection, textalign, subtle, rel, emptyindicatormode, emphasized, ariahaspopup, accessiblerole, class: cssClass, endicon, icon } = {}) {
    return this._leaf({
      name: "Link",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "target", v: target },
      { n: "href", v: href },
      { n: "press", v: press },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "accessibleRole", v: accessiblerole },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "rel", v: rel },
      { n: "subtle", v: this.boolean_abap_2_json(subtle) },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "validateUrl", v: this.boolean_abap_2_json(validateurl) },
      { n: "width", v: width },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "emphasized", v: this.boolean_abap_2_json(emphasized) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "endIcon", v: endicon },
      { n: "icon", v: icon },
      ]),
    });
  }

  list({ headertext, items, mode, selectionchange, showseparators, footertext, growingdirection, growingthreshold, growingtriggertext, headerlevel, multiselectmode, nodatatext, sticky, modeanimationon, growingscrolltoload, includeiteminselection, growing, inset, backgrounddesign, rememberselections, showunread, visible, nodata, id, itempress, select, delete: del, class: cssClass } = {}) {
    return this._container({
      name: "List",
      aProp: this._filterProps([
      { n: "headerText", v: headertext },
      { n: "items", v: items },
      { n: "mode", v: mode },
      { n: "class", v: cssClass },
      { n: "itemPress", v: itempress },
      { n: "select", v: select },
      { n: "selectionChange", v: selectionchange },
      { n: "showSeparators", v: showseparators },
      { n: "footerText", v: footertext },
      { n: "growingDirection", v: growingdirection },
      { n: "growingThreshold", v: growingthreshold },
      { n: "growingTriggerText", v: growingtriggertext },
      { n: "headerLevel", v: headerlevel },
      { n: "multiSelectMode", v: multiselectmode },
      { n: "noDataText", v: nodatatext },
      { n: "id", v: id },
      { n: "sticky", v: sticky },
      { n: "delete", v: del },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "modeAnimationOn", v: this.boolean_abap_2_json(modeanimationon) },
      { n: "growingScrollToLoad", v: this.boolean_abap_2_json(growingscrolltoload) },
      { n: "includeItemInSelection", v: this.boolean_abap_2_json(includeiteminselection) },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "inset", v: this.boolean_abap_2_json(inset) },
      { n: "rememberSelections", v: this.boolean_abap_2_json(rememberselections) },
      { n: "showUnread", v: this.boolean_abap_2_json(showunread) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "noData", v: nodata },
      ]),
    });
  }

  input_list_item({ label } = {}) {
    return this._container({
      name: "InputListItem",
      aProp: this._filterProps([
      { n: "label", v: label },
      ]),
    });
  }

  standard_list_item({ title, description, icon, info, press, type, selected, counter, wrapping, wrapcharlimit, infostateinverted, infostate, iconinset, adapttitlesize, activeicon, unread, highlight } = {}) {
    return this._leaf({
      name: "StandardListItem",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "description", v: description },
      { n: "icon", v: icon },
      { n: "info", v: info },
      { n: "press", v: press },
      { n: "type", v: type },
      { n: "counter", v: counter },
      { n: "activeIcon", v: activeicon },
      { n: "adaptTitleSize", v: this.boolean_abap_2_json(adapttitlesize) },
      { n: "unread", v: this.boolean_abap_2_json(unread) },
      { n: "iconInset", v: this.boolean_abap_2_json(iconinset) },
      { n: "infoStateInverted", v: this.boolean_abap_2_json(infostateinverted) },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "infoState", v: infostate },
      { n: "highlight", v: highlight },
      { n: "wrapCharLimit", v: wrapcharlimit },
      { n: "selected", v: selected },
      ]),
    });
  }

  item({ key, text } = {}) {
    return this._leaf({
      name: "Item",
      ns: "core",
      aProp: this._filterProps([
      { n: "key", v: key },
      { n: "text", v: text },
      ]),
    });
  }

  segmented_button_item({ icon, key, text, width, visible, textdirection, enabled, press } = {}) {
    return this._leaf({
      name: "SegmentedButtonItem",
      aProp: this._filterProps([
      { n: "icon", v: icon },
      { n: "press", v: press },
      { n: "width", v: width },
      { n: "key", v: key },
      { n: "textDirection", v: textdirection },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "text", v: text },
      ]),
    });
  }

  combobox({ selectedkey, showclearicon, selectionchange, selecteditem, items, change, width, showsecondaryvalues, placeholder, selecteditemid, name, valuestate, valuestatetext, textalign, visible, showvaluestatemessage, showbutton, required, editable, enabled, filtersecondaryvalues, id, class: cssClass } = {}) {
    return this._container({
      name: "ComboBox",
      aProp: this._filterProps([

      ]),
    });
  }

  multi_combobox({ selectionchange, selectedkeys, selecteditems, items, selectionfinish, width, showclearicon, showsecondaryvalues, placeholder, selecteditemid, selectedkey, name, valuestate, valuestatetext, textalign, visible, showvaluestatemessage, showbutton, required, editable, enabled, filtersecondaryvalues, showselectall, id, class: cssClass } = {}) {
    return this._container({
      name: "MultiComboBox",
      aProp: this._filterProps([

      ]),
    });
  }

  grid({ class: cssClass, default_span, containerquery, hspacing, vspacing, width, content } = {}) {
    return this._container({
      name: "Grid",
      ns: "layout",
      aProp: this._filterProps([
      { n: "defaultSpan", v: default_span },
      { n: "class", v: cssClass },
      { n: "containerQuery", v: this.boolean_abap_2_json(containerquery) },
      { n: "hSpacing", v: hspacing },
      { n: "vSpacing", v: vspacing },
      { n: "width", v: width },
      { n: "content", v: content },
      ]),
    });
  }

  grid_box_layout({ boxesperrowconfig, boxminwidth, boxwidth } = {}) {
    return this._leaf({
      name: "GridBoxLayout",
      ns: "grid",
      aProp: this._filterProps([
      { n: "boxesPerRowConfig", v: boxesperrowconfig },
      { n: "boxMinWidth", v: boxminwidth },
      { n: "boxWidth", v: boxwidth },
      ]),
    });
  }

  grid_data({ span, linebreak, indentl, indentm } = {}) {
    return this._leaf({
      name: "GridData",
      ns: "layout",
      aProp: this._filterProps([
      { n: "span", v: span },
      { n: "linebreak", v: this.boolean_abap_2_json(linebreak) },
      { n: "indentL", v: indentl },
      { n: "indentM", v: indentm },
      ]),
    });
  }

  grid_drop_info({ targetaggregation, dropposition, droplayout, drop, dragenter, dragover } = {}) {
    return this._leaf({
      name: "GridDropInfo",
      ns: "dnd-grid",
      aProp: this._filterProps([
      { n: "targetAggregation", v: targetaggregation },
      { n: "dropPosition", v: dropposition },
      { n: "dropLayout", v: droplayout },
      { n: "drop", v: drop },
      { n: "dragEnter", v: dragenter },
      { n: "dragOver", v: dragover },
      ]),
    });
  }

  grid_list({ id, busy, busyindicatordelay, busyindicatorsize, enablebusyindicator, fieldgroupids, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, shownodata, showseparators, showunread, sticky, swipedirection, visible, width, items } = {}) {
    return this._container({
      name: "GridList",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "busy", v: this.boolean_abap_2_json(busy) },
      { n: "busyIndicatorDelay", v: busyindicatordelay },
      { n: "busyIndicatorSize", v: busyindicatorsize },
      { n: "enableBusyIndicator", v: this.boolean_abap_2_json(enablebusyindicator) },
      { n: "fieldGroupIds", v: fieldgroupids },
      { n: "footerText", v: footertext },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "growingDirection", v: growingdirection },
      { n: "growingScrollToLoad", v: this.boolean_abap_2_json(growingscrolltoload) },
      { n: "growingThreshold", v: growingthreshold },
      { n: "growingTriggerText", v: growingtriggertext },
      { n: "headerLevel", v: headerlevel },
      { n: "headerText", v: headertext },
      { n: "includeItemInSelection", v: this.boolean_abap_2_json(includeiteminselection) },
      { n: "inset", v: this.boolean_abap_2_json(inset) },
      { n: "keyboardMode", v: keyboardmode },
      { n: "mode", v: mode },
      { n: "modeAnimationOn", v: modeanimationon },
      { n: "multiSelectMode", v: multiselectmode },
      { n: "noDataText", v: nodatatext },
      { n: "rememberSelections", v: this.boolean_abap_2_json(rememberselections) },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "showSeparators", v: showseparators },
      { n: "showUnread", v: this.boolean_abap_2_json(showunread) },
      { n: "sticky", v: sticky },
      { n: "swipeDirection", v: swipedirection },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      { n: "items", v: items },
      ]),
    });
  }

  grid_list_item({ busy, busyindicatordelay, busyindicatorsize, counter, fieldgroupids, highlight, highlighttext, navigated, selected, type, unread, visible, detailpress, detailtap, press, tap } = {}) {
    return this._container({
      name: "GridListItem",
      ns: "f",
      aProp: this._filterProps([
      { n: "busy", v: busy },
      { n: "busyIndicatorDelay", v: busyindicatordelay },
      { n: "busyIndicatorSize", v: busyindicatorsize },
      { n: "counter", v: counter },
      { n: "fieldGroupIds", v: fieldgroupids },
      { n: "highlight", v: highlight },
      { n: "highlightText", v: highlighttext },
      { n: "navigated", v: navigated },
      { n: "selected", v: selected },
      { n: "type", v: type },
      { n: "unread", v: unread },
      { n: "visible", v: visible },
      { n: "detailPress", v: detailpress },
      { n: "detailTap", v: detailtap },
      { n: "press", v: press },
      { n: "tap", v: tap },
      ]),
    });
  }

  text_area({ rows, cols, height, class: cssClass, width, valueliveupdate, editable, enabled, growing, growingmaxlines, id, required, placeholder, valuestate, valuestatetext, wrapping, maxlength, textalign, textdirection, showvaluestatemessage, showexceededtext, value } = {}) {
    return this._leaf({
      name: "TextArea",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "rows", v: rows },
      { n: "cols", v: cols },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "wrapping", v: wrapping },
      { n: "maxLength", v: maxlength },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "showValueStateMessage", v: this.boolean_abap_2_json(showvaluestatemessage) },
      { n: "showExceededText", v: this.boolean_abap_2_json(showexceededtext) },
      { n: "valueLiveUpdate", v: this.boolean_abap_2_json(valueliveupdate) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "class", v: cssClass },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "id", v: id },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "growingMaxLines", v: growingmaxlines },
      { n: "required", v: required },
      { n: "valueState", v: valuestate },
      { n: "placeholder", v: placeholder },
      { n: "valueStateText", v: valuestatetext },
      ]),
    });
  }

  range_slider({ max, min, step, startvalue, endvalue, showtickmarks, labelinterval, width, class: cssClass, id, value2, change, value } = {}) {
    return this._leaf({
      name: "RangeSlider",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "endValue", v: endvalue },
      { n: "id", v: id },
      { n: "labelInterval", v: labelinterval },
      { n: "max", v: max },
      { n: "min", v: min },
      { n: "showTickmarks", v: this.boolean_abap_2_json(showtickmarks) },
      { n: "startValue", v: startvalue },
      { n: "step", v: step },
      { n: "width", v: width },
      { n: "value", v: value },
      { n: "value2", v: value2 },
      { n: "change", v: change },
      ]),
    });
  }

  generic_tag({ id, arialabelledby, text, design, status, class: cssClass, press, valuestate } = {}) {
    return this._container({
      name: "GenericTag",
      aProp: this._filterProps([
      { n: "ariaLabelledBy", v: arialabelledby },
      { n: "class", v: cssClass },
      { n: "design", v: design },
      { n: "status", v: status },
      { n: "id", v: id },
      { n: "press", v: press },
      { n: "text", v: text },
      { n: "valueState", v: valuestate },
      ]),
    });
  }

  object_attribute({ title, text, active, ariahaspopup, textdirection, visible, press } = {}) {
    return this._leaf({
      name: "ObjectAttribute",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "textDirection", v: textdirection },
      { n: "ariaHasPopup", v: ariahaspopup },
      { n: "press", v: press },
      { n: "active", v: this.boolean_abap_2_json(active) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "text", v: text },
      ]),
    });
  }

  object_number({ state, emphasized, number, textdirection, textalign, numberunit, inverted, emptyindicatormode, active, unit, visible, class: cssClass, id } = {}) {
    return this._leaf({
      name: "ObjectNumber",
      aProp: this._filterProps([
      { n: "emphasized", v: this.boolean_abap_2_json(emphasized) },
      { n: "number", v: number },
      { n: "state", v: state },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "numberunit", v: numberunit },
      { n: "active", v: this.boolean_abap_2_json(active) },
      { n: "inverted", v: this.boolean_abap_2_json(inverted) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "unit", v: unit },
      ]),
    });
  }

  switch({ state, customtexton, customtextoff, enabled, change, type } = {}) {
    return this._leaf({
      name: "Switch",
      aProp: this._filterProps([
      { n: "type", v: type },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "state", v: state },
      { n: "change", v: change },
      { n: "customTextOff", v: customtextoff },
      { n: "customTextOn", v: customtexton },
      ]),
    });
  }

  harveyballmicrochartitem({ id, color, fraction, fractionscale, class: cssClass } = {}) {
    return this._container({
      name: "HarveyBallMicroChartItem",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "fraction", v: fraction },
      { n: "color", v: color },
      { n: "fractionScale", v: fractionscale },
      ]),
    });
  }

  step_input({ id, min, max, step, width, valuestate, enabled, description, displayvalueprecision, largerstep, stepmode, editable, fieldwidth, textalign, validationmode, change, value } = {}) {
    return this._leaf({
      name: "StepInput",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "max", v: max },
      { n: "min", v: min },
      { n: "step", v: step },
      { n: "width", v: width },
      { n: "value", v: value },
      { n: "valueState", v: valuestate },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "description", v: description },
      { n: "displayValuePrecision", v: displayvalueprecision },
      { n: "largerStep", v: largerstep },
      { n: "stepMode", v: stepmode },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "fieldWidth", v: fieldwidth },
      { n: "textalign", v: textalign },
      { n: "validationMode", v: validationmode },
      { n: "change", v: change },
      ]),
    });
  }

  progress_indicator({ class: cssClass, percentvalue, displayvalue, showvalue, state, visible } = {}) {
    return this._leaf({
      name: "ProgressIndicator",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "percentValue", v: percentvalue },
      { n: "displayValue", v: displayvalue },
      { n: "showValue", v: this.boolean_abap_2_json(showvalue) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "state", v: state },
      ]),
    });
  }

  segmented_button({ selected_key, selection_change, id, visible, enabled } = {}) {
    return this._container({
      name: "SegmentedButton",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "selectedKey", v: selected_key },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "selectionChange", v: selection_change },
      ]),
    });
  }

  checkbox({ text, selected, enabled, select, id, class: cssClass, textalign, textdirection, width, activehandling, visible, displayonly, editable, partiallyselected, useentirewidth, wrapping, name, valuestate, required } = {}) {
    return this._leaf({
      name: "CheckBox",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "name", v: name },
      { n: "selected", v: selected },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "valueState", v: valuestate },
      { n: "width", v: width },
      { n: "activeHandling", v: this.boolean_abap_2_json(activehandling) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "displayOnly", v: this.boolean_abap_2_json(displayonly) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "partiallySelected", v: this.boolean_abap_2_json(partiallyselected) },
      { n: "useEntireWidth", v: this.boolean_abap_2_json(useentirewidth) },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "select", v: select },
      { n: "required", v: this.boolean_abap_2_json(required) },
      ]),
    });
  }

  text({ text, class: cssClass, ns, emptyindicatormode, maxlines, renderwhitespace, textalign, textdirection, width, wrapping, wrappingtype, id, visible } = {}) {
    return this._leaf({
      name: "Text",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "maxLines", v: maxlines },
      { n: "renderWhitespace", v: renderwhitespace },
      { n: "textAlign", v: textalign },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "textDirection", v: textdirection },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "wrappingType", v: wrappingtype },
      { n: "class", v: cssClass },
      ]),
    });
  }

  formatted_text({ htmltext, convertedlinksdefaulttarget, convertlinkstoanchortags, height, textalign, textdirection, visible, width, id, class: cssClass, controls } = {}) {
    return this._leaf({
      name: "FormattedText",
      aProp: this._filterProps([
      { n: "htmlText", v: htmltext },
      { n: "convertedLinksDefaultTarget", v: convertedlinksdefaulttarget },
      { n: "convertLinksToAnchorTags", v: convertlinkstoanchortags },
      { n: "height", v: height },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      { n: "class", v: cssClass },
      { n: "id", v: id },
      { n: "controls", v: controls },
      ]),
    });
  }

  tree_table({ rows, selectionmode, enablecolumnreordering, expandfirstlevel, columnselect, rowselectionchange, selectionbehavior, id, alternaterowcolors, columnheadervisible, enablecellfilter, enablecolumnfreeze, enablecustomfilter, enableselectall, shownodata, showoverlay, visible, columnheaderheight, firstvisiblerow, fixedcolumncount, threshold, width, usegroupmode, groupheaderproperty, rowactioncount, selectedindex, visiblerowcount, visiblerowcountmode, minautorowcount, fixedbottomrowcount, fixedrowcount, rowheight, toggleopenstate } = {}) {
    return this._container({
      name: "TreeTable",
      ns: "table",
      aProp: this._filterProps([
      { n: "rows", v: rows },
      { n: "selectionMode", v: selectionmode },
      { n: "enableColumnReordering", v: this.boolean_abap_2_json(enablecolumnreordering) },
      { n: "expandFirstLevel", v: this.boolean_abap_2_json(expandfirstlevel) },
      { n: "columnSelect", v: columnselect },
      { n: "rowSelectionChange", v: rowselectionchange },
      { n: "selectionBehavior", v: selectionbehavior },
      { n: "id", v: id },
      { n: "alternateRowColors", v: this.boolean_abap_2_json(alternaterowcolors) },
      { n: "columnHeaderVisible", v: this.boolean_abap_2_json(columnheadervisible) },
      { n: "enableCellFilter", v: this.boolean_abap_2_json(enablecellfilter) },
      { n: "enableColumnFreeze", v: this.boolean_abap_2_json(enablecolumnfreeze) },
      { n: "enableCustomFilter", v: this.boolean_abap_2_json(enablecustomfilter) },
      { n: "enableSelectAll", v: this.boolean_abap_2_json(enableselectall) },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "showOverlay", v: this.boolean_abap_2_json(showoverlay) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "columnHeaderHeight", v: columnheaderheight },
      { n: "firstVisibleRow", v: firstvisiblerow },
      { n: "fixedColumnCount", v: fixedcolumncount },
      { n: "threshold", v: threshold },
      { n: "width", v: width },
      { n: "useGroupMode", v: this.boolean_abap_2_json(usegroupmode) },
      { n: "groupHeaderProperty", v: groupheaderproperty },
      { n: "rowActionCount", v: rowactioncount },
      { n: "selectedIndex", v: selectedindex },
      { n: "rowHeight", v: rowheight },
      { n: "fixedRowCount", v: fixedrowcount },
      { n: "fixedBottomRowCount", v: fixedbottomrowcount },
      { n: "minAutoRowCount", v: minautorowcount },
      { n: "visibleRowCount", v: visiblerowcount },
      { n: "toggleOpenState", v: toggleopenstate },
      { n: "visibleRowCountMode", v: visiblerowcountmode },
      ]),
    });
  }

  tree_columns() {
    return this._container({
      name: "columns",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  tree_column({ label, template, halign } = {}) {
    return this._container({
      name: "Column",
      ns: "table",
      aProp: this._filterProps([
      { n: "label", v: label },
      { n: "template", v: template },
      { n: "hAlign", v: halign },
      ]),
    });
  }

  tree_template() {
    return this._container({
      name: "template",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  tree_extension() {
    return this._container({
      name: "extension",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  filter_bar({ usetoolbar, search, id, persistencykey, aftervariantload, aftervariantsave, assignedfilterschanged, beforevariantfetch, cancel, clear, filterchange, filtersdialogbeforeopen, filtersdialogcancel, filtersdialogclosed, initialise, initialized, reset, filtercontainerwidth, header, advancedmode, isrunninginvaluehelpdialog, showallfilters, showclearonfb, showfilterconfiguration, showgoonfb, showrestorebutton, showrestoreonfb, usesnapshot, searchenabled, considergrouptitle, deltavariantmode, disablesearchmatchespatternw, filterbarexpanded } = {}) {
    return this._container({
      name: "FilterBar",
      ns: "fb",
      aProp: this._filterProps([
      { n: "useToolbar", v: this.boolean_abap_2_json(usetoolbar) },
      { n: "search", v: search },
      { n: "id", v: id },
      { n: "persistencyKey", v: persistencykey },
      { n: "afterVariantLoad", v: aftervariantload },
      { n: "afterVariantSave", v: aftervariantsave },
      { n: "assignedFiltersChanged", v: assignedfilterschanged },
      { n: "beforeVariantFetch", v: beforevariantfetch },
      { n: "cancel", v: cancel },
      { n: "clear", v: clear },
      { n: "filtersDialogBeforeOpen", v: filtersdialogbeforeopen },
      { n: "filtersDialogCancel", v: filtersdialogcancel },
      { n: "filtersDialogClosed", v: filtersdialogclosed },
      { n: "initialise", v: initialise },
      { n: "initialized", v: initialized },
      { n: "reset", v: reset },
      { n: "filterContainerWidth", v: filtercontainerwidth },
      { n: "header", v: header },
      { n: "advancedMode", v: this.boolean_abap_2_json(advancedmode) },
      { n: "isRunningInValueHelpDialog", v: this.boolean_abap_2_json(isrunninginvaluehelpdialog) },
      { n: "showAllFilters", v: this.boolean_abap_2_json(showallfilters) },
      { n: "showClearOnFB", v: this.boolean_abap_2_json(showclearonfb) },
      { n: "showFilterConfiguration", v: this.boolean_abap_2_json(showfilterconfiguration) },
      { n: "showGoOnFB", v: this.boolean_abap_2_json(showgoonfb) },
      { n: "showRestoreButton", v: this.boolean_abap_2_json(showrestorebutton) },
      { n: "showRestoreOnFB", v: this.boolean_abap_2_json(showrestoreonfb) },
      { n: "useSnapshot", v: this.boolean_abap_2_json(usesnapshot) },
      { n: "searchEnabled", v: this.boolean_abap_2_json(searchenabled) },
      { n: "considerGroupTitle", v: this.boolean_abap_2_json(considergrouptitle) },
      { n: "deltaVariantMode", v: this.boolean_abap_2_json(deltavariantmode) },
      { n: "disableSearchMatchesPatternWarning", v: this.boolean_abap_2_json(disablesearchmatchespatternw) },
      { n: "filterBarExpanded", v: this.boolean_abap_2_json(filterbarexpanded) },
      { n: "filterChange", v: filterchange },
      ]),
    });
  }

  filter_group_items() {
    return this._container({
      name: "filterGroupItems",
      ns: "fb",
      aProp: this._filterProps([

      ]),
    });
  }

  filter_group_item({ name, label, groupname, visibleinfilterbar, mandatory, controltooltip, entitysetname, entitytypename, grouptitle, hiddenfilter, labeltooltip, visible, change } = {}) {
    return this._container({
      name: "FilterGroupItem",
      ns: "fb",
      aProp: this._filterProps([
      { n: "name", v: name },
      { n: "label", v: label },
      { n: "groupName", v: groupname },
      { n: "controlTooltip", v: controltooltip },
      { n: "entitySetName", v: entitysetname },
      { n: "entityTypeName", v: entitytypename },
      { n: "groupTitle", v: grouptitle },
      { n: "labelTooltip", v: labeltooltip },
      { n: "change", v: change },
      { n: "visibleInFilterBar", v: this.boolean_abap_2_json(visibleinfilterbar) },
      { n: "mandatory", v: this.boolean_abap_2_json(mandatory) },
      { n: "hiddenFilter", v: this.boolean_abap_2_json(hiddenfilter) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  filter_control() {
    return this._container({
      name: "control",
      ns: "fb",
      aProp: this._filterProps([

      ]),
    });
  }

  flexible_column_layout({ layout, id, backgrounddesign, defaulttransitionnamebegincol, defaulttransitionnameendcol, defaulttransitionnamemidcol, autofocus, restorefocusonbacknavigation, class: cssClass, afterbegincolumnnavigate, afterendcolumnnavigate, aftermidcolumnnavigate, begincolumnnavigate, columnresize, endcolumnnavigate, midcolumnnavigate, statechange } = {}) {
    return this._container({
      name: "FlexibleColumnLayout",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  begin_column_pages() {
    return this._container({
      name: "beginColumnPages",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  mid_column_pages({ id } = {}) {
    return this._container({
      name: "midColumnPages",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      ]),
    });
  }

  ui_table({ rows, columnheadervisible, editable, class: cssClass, enablecellfilter, enablegrouping, enableselectall, firstvisiblerow, fixedbottomrowcount, fixedcolumncount, fixedrowcount, minautorowcount, rowactioncount, rowheight, selectionmode, showcolumnvisibilitymenu, shownodata, selectedindex, threshold, visiblerowcount, visiblerowcountmode, alternaterowcolors, footer, filter, sort, rowselectionchange, customfilter, id, flex, selectionbehavior, rowmode } = {}) {
    return this._container({
      name: "Table",
      ns: "table",
      aProp: this._filterProps([
      { n: "rows", v: rows },
      { n: "alternateRowColors", v: this.boolean_abap_2_json(alternaterowcolors) },
      { n: "columnHeaderVisible", v: columnheadervisible },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "class", v: cssClass },
      { n: "enableCellFilter", v: this.boolean_abap_2_json(enablecellfilter) },
      { n: "enableGrouping", v: this.boolean_abap_2_json(enablegrouping) },
      { n: "enableSelectAll", v: this.boolean_abap_2_json(enableselectall) },
      { n: "firstVisibleRow", v: firstvisiblerow },
      { n: "fixedBottomRowCount", v: fixedbottomrowcount },
      { n: "fixedColumnCount", v: fixedcolumncount },
      { n: "rowActionCount", v: rowactioncount },
      { n: "fixedRowCount", v: fixedrowcount },
      { n: "minAutoRowCount", v: minautorowcount },
      { n: "rowHeight", v: rowheight },
      { n: "selectedIndex", v: selectedindex },
      { n: "selectionMode", v: selectionmode },
      { n: "selectionBehavior", v: selectionbehavior },
      { n: "showColumnVisibilityMenu", v: this.boolean_abap_2_json(showcolumnvisibilitymenu) },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "threshold", v: threshold },
      { n: "visibleRowCount", v: visiblerowcount },
      { n: "visibleRowCountMode", v: visiblerowcountmode },
      { n: "footer", v: footer },
      { n: "filter", v: filter },
      { n: "sort", v: sort },
      { n: "customFilter", v: customfilter },
      { n: "id", v: id },
      { n: "fl:flexibility", v: flex },
      { n: "rowSelectionChange", v: rowselectionchange },
      { n: "rowMode", v: rowmode },
      ]),
    });
  }

  ui_column({ id, width, showsortmenuentry, sortproperty, autoresizable, filterproperty, showfiltermenuentry, defaultfilteroperator, filtertype, halign, minwidth, resizable, visible } = {}) {
    return this._container({
      name: "Column",
      ns: "table",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "width", v: width },
      { n: "showSortMenuEntry", v: showsortmenuentry },
      { n: "sortProperty", v: sortproperty },
      { n: "showFilterMenuEntry", v: showfiltermenuentry },
      { n: "autoresizable", v: this.boolean_abap_2_json(autoresizable) },
      { n: "defaultFilterOperator", v: defaultfilteroperator },
      { n: "filterProperty", v: filterproperty },
      { n: "filterType", v: filtertype },
      { n: "hAlign", v: halign },
      { n: "minWidth", v: minwidth },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      { n: "visible", v: visible },
      ]),
    });
  }

  ui_columns() {
    return this._container({
      name: "columns",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  ui_custom_data() {
    return this._container({
      name: "customData",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  ui_extension() {
    return this._container({
      name: "extension",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  ui_template() {
    return this._container({
      name: "template",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  currency({ currency, usesymbol, maxprecision, stringvalue, value } = {}) {
    return this._container({
      name: "Currency",
      ns: "u",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "currency", v: currency },
      { n: "useSymbol", v: this.boolean_abap_2_json(usesymbol) },
      { n: "maxPrecision", v: maxprecision },
      { n: "stringValue", v: stringvalue },
      ]),
    });
  }

  ui_row_action() {
    return this._container({
      name: "RowAction",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  ui_row_action_template() {
    return this._container({
      name: "rowActionTemplate",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  ui_row_action_item({ icon, text, type, press, visible } = {}) {
    return this._container({
      name: "RowActionItem",
      ns: "table",
      aProp: this._filterProps([
      { n: "icon", v: icon },
      { n: "text", v: text },
      { n: "type", v: type },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  radio_button({ id, activehandling, editable, enabled, groupname, selected, text, textalign, textdirection, useentirewidth, valuestate, width, select, visible } = {}) {
    return this._container({
      name: "RadioButton",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "activeHandling", v: this.boolean_abap_2_json(activehandling) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "useEntireWidth", v: this.boolean_abap_2_json(useentirewidth) },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "textAlign", v: textalign },
      { n: "groupName", v: groupname },
      { n: "valueState", v: valuestate },
      { n: "width", v: width },
      { n: "select", v: select },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  radio_button_group({ id, columns, editable, enabled, selectedindex, textdirection, valuestate, width, select, class: cssClass } = {}) {
    return this._container({
      name: "RadioButtonGroup",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "columns", v: columns },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "selectedIndex", v: selectedindex },
      { n: "textDirection", v: textdirection },
      { n: "valueState", v: valuestate },
      { n: "select", v: select },
      { n: "width", v: width },
      { n: "class", v: cssClass },
      ]),
    });
  }

  dynamic_side_content({ id, class: cssClass, sidecontentvisibility, showsidecontent, containerquery } = {}) {
    return this._container({
      name: "DynamicSideContent",
      ns: "layout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "sideContentVisibility", v: sidecontentvisibility },
      { n: "showSideContent", v: showsidecontent },
      { n: "containerQuery", v: containerquery },
      ]),
    });
  }

  side_content({ width } = {}) {
    return this._container({
      name: "sideContent",
      ns: "layout",
      aProp: this._filterProps([
      { n: "width", v: width },
      ]),
    });
  }

  planning_calendar({ rows, id, class: cssClass, startdate, appointmentsvisualization, appointmentselect, showemptyintervalheaders, showweeknumbers, showdaynamesline, legend, appointmentheight, appointmentroundwidth, builtinviews, calendarweeknumbering, firstdayofweek, height, groupappointmentsmode, iconshape, maxdate, mindate, nodatatext, primarycalendartype, secondarycalendartype, intervalselect, rowheaderpress, rowselectionchange, startdatechange, viewchange, stickyheader, viewkey, width, singleselection, showrowheaders, multipleappointmentsselection, showintervalheaders } = {}) {
    return this._container({
      name: "PlanningCalendar",
      aProp: this._filterProps([
      { n: "rows", v: rows },
      { n: "startDate", v: startdate },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "appointmentHeight", v: appointmentheight },
      { n: "appointmentRoundWidth", v: appointmentroundwidth },
      { n: "builtInViews", v: builtinviews },
      { n: "calendarWeekNumbering", v: calendarweeknumbering },
      { n: "firstDayOfWeek", v: firstdayofweek },
      { n: "groupAppointmentsMode", v: groupappointmentsmode },
      { n: "height", v: height },
      { n: "iconShape", v: iconshape },
      { n: "maxDate", v: maxdate },
      { n: "minDate", v: mindate },
      { n: "noDataText", v: nodatatext },
      { n: "primaryCalendarType", v: primarycalendartype },
      { n: "secondaryCalendarType", v: secondarycalendartype },
      { n: "appointmentsVisualization", v: appointmentsvisualization },
      { n: "appointmentSelect", v: appointmentselect },
      { n: "intervalSelect", v: intervalselect },
      { n: "rowHeaderPress", v: rowheaderpress },
      { n: "rowSelectionChange", v: rowselectionchange },
      { n: "startDateChange", v: startdatechange },
      { n: "viewChange", v: viewchange },
      { n: "stickyHeader", v: stickyheader },
      { n: "viewKey", v: viewkey },
      { n: "width", v: width },
      { n: "singleSelection", v: this.boolean_abap_2_json(singleselection) },
      { n: "showRowHeaders", v: this.boolean_abap_2_json(showrowheaders) },
      { n: "multipleAppointmentsSelection", v: this.boolean_abap_2_json(multipleappointmentsselection) },
      { n: "showIntervalHeaders", v: this.boolean_abap_2_json(showintervalheaders) },
      { n: "showEmptyIntervalHeaders", v: this.boolean_abap_2_json(showemptyintervalheaders) },
      { n: "showWeekNumbers", v: this.boolean_abap_2_json(showweeknumbers) },
      { n: "legend", v: legend },
      { n: "showDayNamesLine", v: this.boolean_abap_2_json(showdaynamesline) },
      ]),
    });
  }

  planning_calendar_view({ appointmentheight, description, intervallabelformatter, intervalsize, intervalsl, intervalsm, intervalss, intervaltype, key, relative, showsubintervals } = {}) {
    return this._container({
      name: "PlanningCalendarView",
      aProp: this._filterProps([
      { n: "appointmentHeight", v: appointmentheight },
      { n: "description", v: description },
      { n: "intervalLabelFormatter", v: intervallabelformatter },
      { n: "intervalSize", v: intervalsize },
      { n: "intervalsL", v: intervalsl },
      { n: "intervalsM", v: intervalsm },
      { n: "intervalsS", v: intervalss },
      { n: "intervalType", v: intervaltype },
      { n: "key", v: key },
      { n: "relative", v: this.boolean_abap_2_json(relative) },
      { n: "showSubIntervals", v: this.boolean_abap_2_json(showsubintervals) },
      ]),
    });
  }

  planning_calendar_row({ appointments, intervalheaders, icon, title, key, text, enableappointmentscreate, enableappointmentsdraganddrop, enableappointmentsresize, noappointmentstext, nonworkinghours, rowheaderdescription, nonworkingdays, selected, appointmentcreate, appointmentdragenter, appointmentdrop, appointmentresize, id, class: cssClass } = {}) {
    return this._container({
      name: "PlanningCalendarRow",
      aProp: this._filterProps([
      { n: "appointments", v: appointments },
      { n: "intervalHeaders", v: intervalheaders },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "icon", v: icon },
      { n: "title", v: title },
      { n: "key", v: key },
      { n: "noAppointmentsText", v: noappointmentstext },
      { n: "nonWorkingHours", v: nonworkinghours },
      { n: "rowHeaderDescription", v: rowheaderdescription },
      { n: "nonworkingdays", v: nonworkingdays },
      { n: "enableAppointmentsCreate", v: this.boolean_abap_2_json(enableappointmentscreate) },
      { n: "appointmentResize", v: appointmentresize },
      { n: "appointmentDrop", v: appointmentdrop },
      { n: "appointmentDragEnter", v: appointmentdragenter },
      { n: "appointmentCreate", v: appointmentcreate },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "nonWorkingDays", v: nonworkingdays },
      { n: "enableAppointmentsResize", v: this.boolean_abap_2_json(enableappointmentsresize) },
      { n: "enableAppointmentsDragAndDrop", v: this.boolean_abap_2_json(enableappointmentsdraganddrop) },
      { n: "text", v: text },
      ]),
    });
  }

  planning_calendar_legend({ items, id, appointmentitems, standarditems, columnwidth, visible } = {}) {
    return this._container({
      name: "PlanningCalendarLegend",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "items", v: items },
      { n: "appointmentItems", v: appointmentitems },
      { n: "columnWidth", v: columnwidth },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "standardItems", v: standarditems },
      ]),
    });
  }

  calendar_legend_item({ text, type, tooltip, color } = {}) {
    return this._container({
      name: "CalendarLegendItem",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "type", v: type },
      { n: "tooltip", v: tooltip },
      { n: "color", v: color },
      ]),
    });
  }

  info_label({ id, text, rendermode, colorscheme, icon, displayonly, textdirection, width, visible, class: cssClass } = {}) {
    return this._container({
      name: "InfoLabel",
      ns: "tnt",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "text", v: text },
      { n: "renderMode ", v: rendermode },
      { n: "colorScheme", v: colorscheme },
      { n: "displayOnly", v: this.boolean_abap_2_json(displayonly) },
      { n: "icon", v: icon },
      { n: "textDirection", v: textdirection },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      ]),
    });
  }

  calendar_appointment({ startdate, enddate, icon, title, text, type, tentative, key, selected } = {}) {
    return this._container({
      name: "CalendarAppointment",
      ns: "u",
      aProp: this._filterProps([
      { n: "startDate", v: startdate },
      { n: "endDate", v: enddate },
      { n: "icon", v: icon },
      { n: "title", v: title },
      { n: "text", v: text },
      { n: "type", v: type },
      { n: "key", v: key },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "tentative", v: this.boolean_abap_2_json(tentative) },
      ]),
    });
  }

  block_layout({ background, id } = {}) {
    return this._container({
      name: "BlockLayout",
      ns: "layout",
      aProp: this._filterProps([
      { n: "background", v: background },
      { n: "id", v: id },
      ]),
    });
  }

  block_layout_row({ rowcolorset, id } = {}) {
    return this._container({
      name: "BlockLayoutRow",
      ns: "layout",
      aProp: this._filterProps([
      { n: "rowColorSet", v: rowcolorset },
      { n: "id", v: id },
      ]),
    });
  }

  block_layout_cell({ backgroundcolorset, backgroundcolorshade, title, titlealignment, titlelevel, width, class: cssClass, id } = {}) {
    return this._container({
      name: "BlockLayoutCell",
      ns: "layout",
      aProp: this._filterProps([
      { n: "backgroundColorSet", v: backgroundcolorset },
      { n: "backgroundColorShade", v: backgroundcolorshade },
      { n: "title", v: title },
      { n: "titleAlignment", v: titlealignment },
      { n: "width", v: width },
      { n: "class", v: cssClass },
      { n: "id", v: id },
      { n: "titleLevel", v: titlelevel },
      ]),
    });
  }

  object_identifier({ emptyindicatormode, text, textdirection, title, titleactive, visible, titlepress } = {}) {
    return this._container({
      name: "ObjectIdentifier",
      aProp: this._filterProps([
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "title", v: title },
      { n: "titleActive", v: titleactive },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "titlePress", v: titlepress },
      ]),
    });
  }

  object_status({ active, emptyindicatormode, icon, icondensityaware, inverted, state, stateannouncementtext, text, textdirection, title, press, visible, id, class: cssClass } = {}) {
    return this._container({
      name: "ObjectStatus",
      aProp: this._filterProps([
      { n: "active", v: this.boolean_abap_2_json(active) },
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "icon", v: icon },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "inverted", v: this.boolean_abap_2_json(inverted) },
      { n: "state", v: state },
      { n: "stateAnnouncementText", v: stateannouncementtext },
      { n: "text", v: text },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "textDirection", v: textdirection },
      { n: "title", v: title },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "press", v: press },
      ]),
    });
  }

  tree({ id, items, headertext, headerlevel, footertext, mode, includeiteminselection, inset, width, toggleopenstate, selectionchange, itempress, select, multiselectmode, nodatatext, shownodata } = {}) {
    return this._container({
      name: "Tree",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "items", v: items },
      { n: "headerText", v: headertext },
      { n: "footerText", v: footertext },
      { n: "mode", v: mode },
      { n: "toggleOpenState", v: toggleopenstate },
      { n: "width", v: width },
      { n: "selectionChange", v: selectionchange },
      { n: "itemPress", v: itempress },
      { n: "select", v: select },
      { n: "multiSelectMode", v: multiselectmode },
      { n: "noDataText", v: nodatatext },
      { n: "headerLevel", v: headerlevel },
      { n: "includeItemInSelection", v: this.boolean_abap_2_json(includeiteminselection) },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "inset", v: this.boolean_abap_2_json(inset) },
      ]),
    });
  }

  standard_tree_item({ title, icon, press, detailpress, type, selected, counter, tooltip } = {}) {
    return this._leaf({
      name: "StandardTreeItem",
      aProp: this._filterProps([
      { n: "title", v: title },
      { n: "icon", v: icon },
      { n: "press", v: press },
      { n: "detailPress", v: detailpress },
      { n: "type", v: type },
      { n: "counter", v: counter },
      { n: "selected", v: selected },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  icon_tab_bar({ class: cssClass, select, expand, expandable, expanded, selectedkey, uppercase, tabsoverflowmode, tabdensitymode, stretchcontentheight, maxnestinglevel, headermode, headerbackgrounddesign, enabletabreordering, backgrounddesign, applycontentpadding, items, content, id } = {}) {
    return this._container({
      name: "IconTabBar",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "select", v: select },
      { n: "expand", v: expand },
      { n: "expandable", v: this.boolean_abap_2_json(expandable) },
      { n: "expanded", v: this.boolean_abap_2_json(expanded) },
      { n: "applyContentPadding", v: this.boolean_abap_2_json(applycontentpadding) },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "enableTabReordering", v: this.boolean_abap_2_json(enabletabreordering) },
      { n: "headerBackgroundDesign", v: headerbackgrounddesign },
      { n: "stretchContentHeight", v: this.boolean_abap_2_json(stretchcontentheight) },
      { n: "headerMode", v: headermode },
      { n: "maxNestingLevel", v: maxnestinglevel },
      { n: "tabDensityMode", v: tabdensitymode },
      { n: "tabsOverflowMode", v: tabsoverflowmode },
      { n: "items", v: items },
      { n: "id", v: id },
      { n: "content", v: content },
      { n: "upperCase", v: this.boolean_abap_2_json(uppercase) },
      { n: "selectedKey", v: selectedkey },
      ]),
    });
  }

  icon_tab_filter({ items, showall, icon, iconcolor, count, text, key, design, icondensityaware, visible, textdirection, class: cssClass, id } = {}) {
    return this._container({
      name: "IconTabFilter",
      aProp: this._filterProps([
      { n: "icon", v: icon },
      { n: "iconColor", v: iconcolor },
      { n: "showAll", v: this.boolean_abap_2_json(showall) },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "count", v: count },
      { n: "text", v: text },
      { n: "id", v: id },
      { n: "textDirection", v: textdirection },
      { n: "class", v: cssClass },
      { n: "key", v: key },
      ]),
    });
  }

  icon_tab_separator({ icon, icondensityaware, visible, id, class: cssClass } = {}) {
    return this._container({
      name: "IconTabSeparator",
      aProp: this._filterProps([
      { n: "icon", v: icon },
      { n: "iconDensityAware", v: icondensityaware },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  gantt_chart_container() {
    return this._container({
      name: "GanttChartContainer",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  container_toolbar({ showsearchbutton, aligncustomcontenttoright, findmode, findbuttonpress, infoofselectitems, showbirdeyebutton, showdisplaytypebutton, showlegendbutton, showsettingbutton, showtimezoomcontrol, stepcountofslider, zoomcontroltype, zoomlevel } = {}) {
    return this._container({
      name: "ContainerToolbar",
      ns: "gantt",
      aProp: this._filterProps([
      { n: "showSearchButton", v: showsearchbutton },
      { n: "alignCustomContentToRight", v: this.boolean_abap_2_json(aligncustomcontenttoright) },
      { n: "findMode", v: findmode },
      { n: "infoOfSelectItems", v: infoofselectitems },
      { n: "findbuttonpress", v: findbuttonpress },
      { n: "showBirdEyeButton", v: this.boolean_abap_2_json(showbirdeyebutton) },
      { n: "showDisplayTypeButton", v: this.boolean_abap_2_json(showdisplaytypebutton) },
      { n: "showLegendButton", v: this.boolean_abap_2_json(showlegendbutton) },
      { n: "showSettingButton", v: this.boolean_abap_2_json(showsettingbutton) },
      { n: "showTimeZoomControl", v: this.boolean_abap_2_json(showtimezoomcontrol) },
      { n: "stepCountOfSlider", v: stepcountofslider },
      { n: "zoomControlType", v: zoomcontroltype },
      { n: "zoomLevel", v: zoomlevel },
      ]),
    });
  }

  gantt_chart_with_table({ id, shapeselectionmode, isconnectordetailsvisible } = {}) {
    return this._container({
      name: "GanttChartWithTable",
      ns: "gantt",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "shapeSelectionMode", v: shapeselectionmode },
      { n: "isConnectorDetailsVisible", v: this.boolean_abap_2_json(isconnectordetailsvisible) },
      ]),
    });
  }

  axis_time_strategy() {
    return this._container({
      name: "axisTimeStrategy",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  proportion_zoom_strategy({ zoomlevel } = {}) {
    return this._container({
      name: "ProportionZoomStrategy",
      ns: "axistime",
      aProp: this._filterProps([
      { n: "zoomLevel", v: zoomlevel },
      ]),
    });
  }

  total_horizon() {
    return this._container({
      name: "totalHorizon",
      ns: "axistime",
      aProp: this._filterProps([

      ]),
    });
  }

  time_horizon({ starttime, endtime } = {}) {
    return this._container({
      name: "TimeHorizon",
      ns: "config",
      aProp: this._filterProps([
      { n: "startTime", v: starttime },
      { n: "endTime", v: endtime },
      ]),
    });
  }

  visible_horizon() {
    return this._container({
      name: "visibleHorizon",
      ns: "axistime",
      aProp: this._filterProps([

      ]),
    });
  }

  row_settings_template() {
    return this._container({
      name: "rowSettingsTemplate",
      ns: "table",
      aProp: this._filterProps([

      ]),
    });
  }

  gantt_row_settings({ rowid, shapes1, relationships, shapes2 } = {}) {
    return this._container({
      name: "GanttRowSettings",
      ns: "gantt",
      aProp: this._filterProps([
      { n: "rowId", v: rowid },
      { n: "shapes1", v: shapes1 },
      { n: "shapes2", v: shapes2 },
      { n: "relationships", v: relationships },
      ]),
    });
  }

  shapes1() {
    return this._container({
      name: "shapes1",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  shapes2() {
    return this._container({
      name: "shapes2",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  task({ id, type, color, endtime, time, title, showtitle, connectable } = {}) {
    return this._container({
      name: "Task",
      ns: "shapes",
      aProp: this._filterProps([
      { n: "time", v: time },
      { n: "endTime", v: endtime },
      { n: "id", v: id },
      { n: "type", v: type },
      { n: "connectable", v: connectable },
      { n: "title", v: title },
      { n: "showTitle", v: this.boolean_abap_2_json(showtitle) },
      { n: "color", v: color },
      ]),
    });
  }

  gantt_table() {
    return this._container({
      name: "table",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  rating_indicator({ maxvalue, enabled, class: cssClass, iconsize, tooltip, displayonly, change, id, editable, value } = {}) {
    return this._container({
      name: "RatingIndicator",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "maxValue", v: maxvalue },
      { n: "displayOnly", v: this.boolean_abap_2_json(displayonly) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "iconSize", v: iconsize },
      { n: "value", v: value },
      { n: "id", v: id },
      { n: "change", v: change },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "tooltip", v: tooltip },
      ]),
    });
  }

  gantt_toolbar() {
    return this._container({
      name: "toolbar",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  base_rectangle({ time, shapeid, endtime, selectable, selectedfill, fill, height, title, animationsettings, alignshape, color, fontsize, connectable, fontfamily, filter, transform, countinbirdeye, fontweight, showtitle, selected, resizable, horizontaltextalignment, highlighted, highlightable } = {}) {
    return this._container({
      name: "BaseRectangle",
      ns: "gantt",
      aProp: this._filterProps([
      { n: "time", v: time },
      { n: "endTime", v: endtime },
      { n: "selectable", v: this.boolean_abap_2_json(selectable) },
      { n: "selectedFill", v: selectedfill },
      { n: "fill", v: fill },
      { n: "height", v: height },
      { n: "title", v: title },
      { n: "animationSettings", v: animationsettings },
      { n: "alignShape", v: alignshape },
      { n: "color", v: color },
      { n: "fontSize", v: fontsize },
      { n: "connectable", v: this.boolean_abap_2_json(connectable) },
      { n: "fontFamily", v: fontfamily },
      { n: "filter", v: filter },
      { n: "transform", v: transform },
      { n: "countInBirdEye", v: this.boolean_abap_2_json(countinbirdeye) },
      { n: "fontWeight", v: fontweight },
      { n: "showTitle", v: this.boolean_abap_2_json(showtitle) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      { n: "horizontalTextAlignment", v: horizontaltextalignment },
      { n: "shapeId", v: shapeid },
      { n: "highlighted", v: this.boolean_abap_2_json(highlighted) },
      { n: "highlightable", v: this.boolean_abap_2_json(highlightable) },
      ]),
    });
  }

  tool_page() {
    return this._container({
      name: "ToolPage",
      ns: "tnt",
      aProp: this._filterProps([

      ]),
    });
  }

  tool_header() {
    return this._container({
      name: "ToolHeader",
      ns: "tnt",
      aProp: this._filterProps([

      ]),
    });
  }

  icon_tab_header({ selectedkey, items, select, mode, ariatexts, backgrounddesign, enabletabreordering, maxnestinglevel, tabdensitymode, tabsoverflowmode, visible, id } = {}) {
    return this._container({
      name: "IconTabHeader",
      aProp: this._filterProps([

      ]),
    });
  }

  nav_container({ initialpage, id, defaulttransitionname, autofocus, height, width, visible } = {}) {
    return this._container({
      name: "NavContainer",
      aProp: this._filterProps([
      { n: "initialPage", v: initialpage },
      { n: "id", v: id },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "autoFocus", v: this.boolean_abap_2_json(autofocus) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "defaultTransitionName", v: defaulttransitionname },
      ]),
    });
  }

  main_contents() {
    return this._container({
      name: "mainContents",
      ns: "tnt",
      aProp: this._filterProps([

      ]),
    });
  }

  table_select_dialog({ confirmbuttontext, contentheight, contentwidth, draggable, growing, growingthreshold, multiselect, nodatatext, rememberselections, resizable, searchplaceholder, showclearbutton, title, titlealignment, visible, items, livechange, cancel, search, confirm, selectionchange } = {}) {
    return this._container({
      name: "TableSelectDialog",
      aProp: this._filterProps([
      { n: "confirmButtonText", v: confirmbuttontext },
      { n: "contentHeight", v: contentheight },
      { n: "contentWidth", v: contentwidth },
      { n: "draggable", v: this.boolean_abap_2_json(draggable) },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "growingThreshold", v: growingthreshold },
      { n: "multiSelect", v: this.boolean_abap_2_json(multiselect) },
      { n: "noDataText", v: nodatatext },
      { n: "rememberSelections", v: this.boolean_abap_2_json(rememberselections) },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      { n: "searchPlaceholder", v: searchplaceholder },
      { n: "showClearButton", v: this.boolean_abap_2_json(showclearbutton) },
      { n: "title", v: title },
      { n: "titleAlignment", v: titlealignment },
      { n: "items", v: items },
      { n: "search", v: search },
      { n: "confirm", v: confirm },
      { n: "cancel", v: cancel },
      { n: "liveChange", v: livechange },
      { n: "selectionChange", v: selectionchange },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  process_flow({ id, foldedcorners, scrollable, showlabels, visible, wheelzoomable, headerpress, labelpress, nodepress, onerror, lanes, nodes } = {}) {
    return this._container({
      name: "ProcessFlow",
      ns: "commons",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "foldedCorners", v: this.boolean_abap_2_json(foldedcorners) },
      { n: "scrollable", v: this.boolean_abap_2_json(scrollable) },
      { n: "showLabels", v: this.boolean_abap_2_json(showlabels) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "wheelZoomable", v: this.boolean_abap_2_json(wheelzoomable) },
      { n: "headerPress", v: headerpress },
      { n: "labelPress", v: labelpress },
      { n: "nodePress", v: nodepress },
      { n: "onError", v: onerror },
      { n: "lanes", v: lanes },
      { n: "nodes", v: nodes },
      ]),
    });
  }

  nodes(args = {}) {
    return this._container({
      name: "nodes",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  node({ id, class: cssClass, alttext, collapsed, corenodesize, description, descriptionlinesize, group, headercheckboxstate, height, title, icon, iconsize, key, maxwidth, selected, shape, showactionlinksbutton, showdetailbutton, showexpandbutton, statusicon, titlelinesize, visible, width, x, y, collapseexpand, headercheckboxpress, hover, press, attributes, actionbuttons } = {}) {
    return this._container({
      name: "Node",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "altText", v: alttext },
      { n: "coreNodeSize", v: corenodesize },
      { n: "description", v: description },
      { n: "descriptionLineSize", v: descriptionlinesize },
      { n: "group", v: group },
      { n: "headerCheckBoxState", v: headercheckboxstate },
      { n: "height", v: height },
      { n: "icon", v: icon },
      { n: "iconSize", v: iconsize },
      { n: "iconSize", v: iconsize },
      { n: "key", v: key },
      { n: "maxWidth", v: maxwidth },
      { n: "title", v: title },
      { n: "shape", v: shape },
      { n: "statusIcon", v: statusicon },
      { n: "titleLineSize", v: titlelinesize },
      { n: "width", v: width },
      { n: "x", v: x },
      { n: "y", v: y },
      { n: "attributes", v: attributes },
      { n: "actionButtons", v: actionbuttons },
      { n: "collapseExpand", v: collapseexpand },
      { n: "headerCheckBoxPress", v: headercheckboxpress },
      { n: "hover", v: hover },
      { n: "press", v: press },
      { n: "collapsed", v: this.boolean_abap_2_json(collapsed) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "showActionLinksButton", v: this.boolean_abap_2_json(showactionlinksbutton) },
      { n: "showDetailButton", v: this.boolean_abap_2_json(showdetailbutton) },
      { n: "showExpandButton", v: this.boolean_abap_2_json(showexpandbutton) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  node_image({ id, class: cssClass, height, src, width } = {}) {
    return this._container({
      name: "NodeImage",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "src", v: src },
      ]),
    });
  }

  lanes() {
    return this._container({
      name: "lanes",
      ns: "commons",
      aProp: this._filterProps([

      ]),
    });
  }

  process_flow_node({ laneid, nodeid, title, titleabbreviation, children, state, statetext, texts, highlighted, focused, selected, tag, type } = {}) {
    return this._container({
      name: "ProcessFlowNode",
      ns: "commons",
      aProp: this._filterProps([
      { n: "laneId", v: laneid },
      { n: "nodeId", v: nodeid },
      { n: "title", v: title },
      { n: "titleAbbreviation", v: titleabbreviation },
      { n: "children", v: children },
      { n: "state", v: state },
      { n: "stateText", v: statetext },
      { n: "texts", v: texts },
      { n: "highlighted", v: this.boolean_abap_2_json(highlighted) },
      { n: "focused", v: this.boolean_abap_2_json(focused) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "tag", v: tag },
      { n: "texts", v: texts },
      { n: "type", v: type },
      ]),
    });
  }

  process_flow_lane_header({ iconsrc, laneid, position, state, text, zoomlevel } = {}) {
    return this._container({
      name: "ProcessFlowLaneHeader",
      ns: "commons",
      aProp: this._filterProps([
      { n: "iconSrc", v: iconsrc },
      { n: "laneId", v: laneid },
      { n: "position", v: position },
      { n: "state", v: state },
      { n: "text", v: text },
      { n: "zoomLevel", v: zoomlevel },
      ]),
    });
  }

  view_settings_dialog({ confirm, cancel, filterdetailpageopened, reset, resetfilters, filtersearchoperator, groupdescending, sortdescending, title, titlealignment, selectedgroupitem, selectedpresetfilteritem, selectedsortitem, filteritems, sortitems, groupitems } = {}) {
    return this._container({
      name: "ViewSettingsDialog",
      aProp: this._filterProps([
      { n: "confirm", v: confirm },
      { n: "cancel", v: cancel },
      { n: "filterDetailPageOpened", v: filterdetailpageopened },
      { n: "reset", v: reset },
      { n: "resetFilters", v: resetfilters },
      { n: "filterSearchOperator", v: filtersearchoperator },
      { n: "groupDescending", v: this.boolean_abap_2_json(groupdescending) },
      { n: "sortDescending", v: this.boolean_abap_2_json(sortdescending) },
      { n: "title", v: title },
      { n: "selectedGroupItem", v: selectedgroupitem },
      { n: "selectedPresetFilterItem", v: selectedpresetfilteritem },
      { n: "selectedSortItem", v: selectedsortitem },
      { n: "selectedSortItem", v: selectedsortitem },
      { n: "filterItems", v: filteritems },
      { n: "sortItems", v: sortitems },
      { n: "groupItems", v: groupitems },
      { n: "titleAlignment", v: titlealignment },
      ]),
    });
  }

  view_settings_filter_item({ enabled, key, multiselect, selected, text, textdirection } = {}) {
    return this._container({
      name: "ViewSettingsFilterItem",
      aProp: this._filterProps([
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "key", v: key },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "multiSelect", v: this.boolean_abap_2_json(multiselect) },
      ]),
    });
  }

  view_settings_item({ enabled, key, selected, text, textdirection } = {}) {
    return this._container({
      name: "ViewSettingsItem",
      aProp: this._filterProps([
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "key", v: key },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      ]),
    });
  }

  variant_management({ defaultvariantkey, enabled, inerrorstate, initialselectionkey, lifecyclesupport, selectionkey, showcreatetile, showexecuteonselection, showsetasdefault, showshare, standarditemauthor, standarditemtext, usefavorites, visible, variantitems, manage, save, select, uservarcreate, id } = {}) {
    return this._container({
      name: "VariantManagement",
      ns: "vm",
      aProp: this._filterProps([
      { n: "defaultVariantKey", v: defaultvariantkey },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "inErrorState", v: this.boolean_abap_2_json(inerrorstate) },
      { n: "initialSelectionKey", v: initialselectionkey },
      { n: "lifecycleSupport", v: this.boolean_abap_2_json(lifecyclesupport) },
      { n: "selectionKey", v: selectionkey },
      { n: "showCreateTile", v: this.boolean_abap_2_json(showcreatetile) },
      { n: "showExecuteOnSelection", v: this.boolean_abap_2_json(showexecuteonselection) },
      { n: "showSetAsDefault", v: this.boolean_abap_2_json(showsetasdefault) },
      { n: "showShare", v: this.boolean_abap_2_json(showshare) },
      { n: "standardItemAuthor", v: standarditemauthor },
      { n: "standardItemText", v: standarditemtext },
      { n: "useFavorites", v: this.boolean_abap_2_json(usefavorites) },
      { n: "variantItems", v: variantitems },
      { n: "manage", v: manage },
      { n: "save", v: save },
      { n: "select", v: select },
      { n: "id", v: id },
      { n: "variantCreationByUserAllowed", v: uservarcreate },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  variant_items() {
    return this._container({
      name: "variantItems",
      ns: "vm",
      aProp: this._filterProps([

      ]),
    });
  }

  variant_item({ executeonselection, global, labelreadonly, lifecyclepackage, lifecycletransportid, namespace, readonly, executeonselect, author, changeable, enabled, favorite, key, text, title, textdirection, originaltitle, originalexecuteonselect, remove, rename, originalfavorite, sharing, change } = {}) {
    return this._container({
      name: "VariantItem",
      ns: "vm",
      aProp: this._filterProps([
      { n: "executeOnSelection", v: this.boolean_abap_2_json(executeonselection) },
      { n: "global", v: this.boolean_abap_2_json(global) },
      { n: "labelReadOnly", v: this.boolean_abap_2_json(labelreadonly) },
      { n: "lifecyclePackage", v: lifecyclepackage },
      { n: "lifecycleTransportId", v: lifecycletransportid },
      { n: "namespace", v: namespace },
      { n: "readOnly", v: readonly },
      { n: "executeOnSelect", v: this.boolean_abap_2_json(executeonselect) },
      { n: "author", v: author },
      { n: "changeable", v: this.boolean_abap_2_json(changeable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "favorite", v: this.boolean_abap_2_json(favorite) },
      { n: "key", v: key },
      { n: "text", v: text },
      { n: "title", v: title },
      { n: "textDirection", v: textdirection },
      { n: "originalTitle", v: originaltitle },
      { n: "originalExecuteOnSelect", v: this.boolean_abap_2_json(originalexecuteonselect) },
      { n: "remove", v: this.boolean_abap_2_json(remove) },
      { n: "rename", v: this.boolean_abap_2_json(rename) },
      { n: "originalFavorite", v: this.boolean_abap_2_json(originalfavorite) },
      { n: "sharing", v: this.boolean_abap_2_json(sharing) },
      { n: "change", v: change },
      ]),
    });
  }

  variant_management_sapm({ creationallowed, defaultkey, inerrorstate, level, maxwidth, modified, popovertitle, selectedkey, showfooter, showsaveas, supportapplyautomatically, supportcontexts, supportdefault, supportfavorites, supportpublic, titlestyle, visible, items, cancel, manage, managecancel, save, select, id } = {}) {
    return this._container({
      name: "VariantManagement",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "defaultKey", v: defaultkey },
      { n: "level", v: level },
      { n: "maxWidth", v: maxwidth },
      { n: "popoverTitle", v: popovertitle },
      { n: "selectedKey", v: selectedkey },
      { n: "titleStyle", v: titlestyle },
      { n: "cancel", v: cancel },
      { n: "manage", v: manage },
      { n: "manageCancel", v: managecancel },
      { n: "save", v: save },
      { n: "select", v: select },
      { n: "items", v: items },
      { n: "creationAllowed", v: this.boolean_abap_2_json(creationallowed) },
      { n: "inErrorState", v: this.boolean_abap_2_json(inerrorstate) },
      { n: "modified", v: this.boolean_abap_2_json(modified) },
      { n: "showFooter", v: this.boolean_abap_2_json(showfooter) },
      { n: "showSaveAs", v: this.boolean_abap_2_json(showsaveas) },
      { n: "supportApplyAutomatically", v: this.boolean_abap_2_json(supportapplyautomatically) },
      { n: "supportContexts", v: this.boolean_abap_2_json(supportcontexts) },
      { n: "supportDefault", v: this.boolean_abap_2_json(supportdefault) },
      { n: "supportFavorites", v: this.boolean_abap_2_json(supportfavorites) },
      { n: "supportPublic", v: this.boolean_abap_2_json(supportpublic) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  variant_item_sapm({ author, changeable, contexts, executeonselect, favorite, key, remove, rename, sharing, title, visible, id, textdirection, text, enabled } = {}) {
    return this._container({
      name: "VariantItem",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "author", v: author },
      { n: "changeable", v: this.boolean_abap_2_json(changeable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "favorite", v: this.boolean_abap_2_json(favorite) },
      { n: "remove", v: this.boolean_abap_2_json(remove) },
      { n: "rename", v: this.boolean_abap_2_json(rename) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "contexts", v: contexts },
      { n: "key", v: key },
      { n: "sharing", v: sharing },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "title", v: title },
      { n: "executeOnSelect", v: this.boolean_abap_2_json(executeonselect) },
      ]),
    });
  }

  feed_input({ buttontooltip, enabled, growing, growingmaxlines, icon, icondensityaware, icondisplayshape, iconinitials, iconsize, maxlength, placeholder, rows, showexceededtext, showicon, post, class: cssClass, value } = {}) {
    return this._container({
      name: "FeedInput",
      aProp: this._filterProps([
      { n: "buttonTooltip", v: buttontooltip },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "growingMaxLines", v: growingmaxlines },
      { n: "icon", v: icon },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "iconDisplayShape", v: icondisplayshape },
      { n: "iconInitials", v: iconinitials },
      { n: "iconSize", v: iconsize },
      { n: "maxLength", v: maxlength },
      { n: "placeholder", v: placeholder },
      { n: "rows", v: rows },
      { n: "showExceededText", v: this.boolean_abap_2_json(showexceededtext) },
      { n: "showIcon", v: this.boolean_abap_2_json(showicon) },
      { n: "value", v: value },
      { n: "class", v: cssClass },
      { n: "post", v: post },
      ]),
    });
  }

  feed_list_item({ activeicon, convertedlinksdefaulttarget, convertlinkstoanchortags, icon, iconactive, icondensityaware, icondisplayshape, iconinitials, iconsize, info, lesslabel, maxcharacters, morelabel, sender, senderactive, showicon, text, timestamp, iconpress, senderpress } = {}) {
    return this._container({
      name: "FeedListItem",
      aProp: this._filterProps([
      { n: "activeIcon", v: activeicon },
      { n: "convertedLinksDefaultTarget", v: convertedlinksdefaulttarget },
      { n: "convertLinksToAnchorTags", v: convertlinkstoanchortags },
      { n: "iconActive", v: this.boolean_abap_2_json(iconactive) },
      { n: "icon", v: icon },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "iconDisplayShape", v: icondisplayshape },
      { n: "iconInitials", v: iconinitials },
      { n: "iconSize", v: iconsize },
      { n: "info", v: info },
      { n: "lessLabel", v: lesslabel },
      { n: "maxCharacters", v: maxcharacters },
      { n: "moreLabel", v: morelabel },
      { n: "sender", v: sender },
      { n: "senderActive", v: this.boolean_abap_2_json(senderactive) },
      { n: "showIcon", v: this.boolean_abap_2_json(showicon) },
      { n: "text", v: text },
      { n: "senderPress", v: senderpress },
      { n: "iconPress", v: iconpress },
      { n: "timestamp", v: timestamp },
      ]),
    });
  }

  feed_list_item_action({ enabled, icon, key, text, visible, press } = {}) {
    return this._container({
      name: "FeedListItemAction",
      aProp: this._filterProps([
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "icon", v: icon },
      { n: "key", v: key },
      { n: "text", v: text },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  feed_content({ contenttext, subheader, class: cssClass, press, value } = {}) {
    return this._container({
      name: "FeedContent",
      aProp: this._filterProps([
      { n: "contentText", v: contenttext },
      { n: "subheader", v: subheader },
      { n: "value", v: value },
      { n: "class", v: cssClass },
      { n: "press", v: press },
      ]),
    });
  }

  news_content({ contenttext, subheader, press } = {}) {
    return this._container({
      name: "NewsContent",
      aProp: this._filterProps([
      { n: "contentText", v: contenttext },
      { n: "subheader", v: subheader },
      { n: "press", v: press },
      ]),
    });
  }

  color_picker({ colorstring, displaymode, change, livechange } = {}) {
    return this._leaf({
      name: "ColorPicker",
      ns: "u",
      aProp: this._filterProps([
      { n: "colorString", v: colorstring },
      { n: "displayMode", v: displaymode },
      { n: "change", v: change },
      { n: "liveChange", v: livechange },
      ]),
    });
  }

  mask_input({ placeholder, mask, name, textalign, textdirection, width, valuestate, valuestatetext, placeholdersymbol, required, showclearicon, showvaluestatemessage, visible, fieldwidth, livechange, change, value } = {}) {
    return this._leaf({
      name: "MaskInput",
      aProp: this._filterProps([
      { n: "placeholder", v: placeholder },
      { n: "mask", v: mask },
      { n: "name", v: name },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "value", v: value },
      { n: "width", v: width },
      { n: "liveChange", v: livechange },
      { n: "change", v: change },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "placeholderSymbol", v: placeholdersymbol },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "showClearIcon", v: this.boolean_abap_2_json(showclearicon) },
      { n: "showValueStateMessage", v: this.boolean_abap_2_json(showvaluestatemessage) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "fieldWidth", v: fieldwidth },
      ]),
    });
  }

  responsive_splitter({ defaultpane, height, width } = {}) {
    return this._container({
      name: "ResponsiveSplitter",
      ns: "layout",
      aProp: this._filterProps([
      { n: "defaultPane", v: defaultpane },
      { n: "height", v: height },
      { n: "width", v: width },
      ]),
    });
  }

  splitter({ height, orientation, width } = {}) {
    return this._container({
      name: "Splitter",
      ns: "layout",
      aProp: this._filterProps([
      { n: "height", v: height },
      { n: "orientation", v: orientation },
      { n: "width", v: width },
      ]),
    });
  }

  invisible_text({ ns, id, text } = {}) {
    return this._container({
      name: "InvisibleText",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "text", v: text },
      ]),
    });
  }

  fix_flex({ ns, class: cssClass, fixcontentsize } = {}) {
    return this._container({
      name: "FixFlex",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "fixContentSize", v: fixcontentsize },
      ]),
    });
  }

  fix_content(args = {}) {
    return this._container({
      name: "fixContent",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  flex_content(args = {}) {
    return this._container({
      name: "flexContent",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  pane_container({ resize, orientation } = {}) {
    return this._container({
      name: "PaneContainer",
      ns: "layout",
      aProp: this._filterProps([
      { n: "resize", v: resize },
      { n: "orientation", v: orientation },
      ]),
    });
  }

  split_pane({ id, requiredparentwidth } = {}) {
    return this._container({
      name: "SplitPane",
      ns: "layout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "requiredParentWidth", v: requiredparentwidth },
      ]),
    });
  }

  splitter_layout_data({ size, minsize, resizable } = {}) {
    return this._container({
      name: "SplitterLayoutData",
      ns: "layout",
      aProp: this._filterProps([
      { n: "size", v: size },
      { n: "minSize", v: minsize },
      { n: "resizable", v: this.boolean_abap_2_json(resizable) },
      ]),
    });
  }

  toolbar_layout_data({ id, maxwidth, minwidth, shrinkable } = {}) {
    return this._container({
      name: "ToolbarLayoutData",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "maxWidth", v: maxwidth },
      { n: "minWidth", v: minwidth },
      { n: "shrinkable", v: this.boolean_abap_2_json(shrinkable) },
      ]),
    });
  }

  object_header({ backgrounddesign, condensed, fullscreenoptimized, icon, iconactive, iconalt, icondensityaware, icontooltip, imageshape, intro, introactive, introhref, introtarget, introtextdirection, number, numberstate, numbertextdirection, numberunit, responsive, showtitleselector, title, titleactive, titlehref, titlelevel, titleselectortooltip, titletarget, titletextdirection, iconpress, intropress, titlepress, titleselectorpress, class: cssClass } = {}) {
    return this._container({
      name: "ObjectHeader",
      aProp: this._filterProps([
      { n: "backgrounddesign", v: backgrounddesign },
      { n: "condensed", v: this.boolean_abap_2_json(condensed) },
      { n: "fullscreenoptimized", v: this.boolean_abap_2_json(fullscreenoptimized) },
      { n: "icon", v: icon },
      { n: "iconactive", v: this.boolean_abap_2_json(iconactive) },
      { n: "iconalt", v: iconalt },
      { n: "icondensityaware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "icontooltip", v: icontooltip },
      { n: "imageShape", v: imageshape },
      { n: "intro", v: intro },
      { n: "introactive", v: this.boolean_abap_2_json(introactive) },
      { n: "introhref", v: introhref },
      { n: "introtarget", v: introtarget },
      { n: "introtextdirection", v: introtextdirection },
      { n: "number", v: number },
      { n: "numberstate", v: numberstate },
      { n: "numbertextdirection", v: numbertextdirection },
      { n: "numberunit", v: numberunit },
      { n: "responsive", v: this.boolean_abap_2_json(responsive) },
      { n: "showtitleselector", v: this.boolean_abap_2_json(showtitleselector) },
      { n: "title", v: title },
      { n: "titleactive", v: this.boolean_abap_2_json(titleactive) },
      { n: "titlehref", v: titlehref },
      { n: "titlelevel", v: titlelevel },
      { n: "titleselectortooltip", v: titleselectortooltip },
      { n: "titletarget", v: titletarget },
      { n: "titletextdirection", v: titletextdirection },
      { n: "iconpress", v: iconpress },
      { n: "intropress", v: intropress },
      { n: "titlepress", v: titlepress },
      { n: "titleselectorpress", v: titleselectorpress },
      { n: "class", v: cssClass },
      ]),
    });
  }

  header_container({ scrollstep, scrolltime, orientation, height } = {}) {
    return this._container({
      name: "HeaderContainer",
      aProp: this._filterProps([
      { n: "scrollStep", v: scrollstep },
      { n: "scrollTime", v: scrolltime },
      { n: "orientation", v: orientation },
      { n: "height", v: height },
      ]),
    });
  }

  markers(args = {}) {
    return this._container({
      name: "markers",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  statuses(args = {}) {
    return this._container({
      name: "statuses",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  status({ id, class: cssClass, backgroundcolor, bordercolor, borderstyle, borderwidth, contentcolor, headercontentcolor, hoverbackgroundcolor, hoverbordercolor, hovercontentcolor, key, legendcolor, selectedbackgroundcolor, selectedbordercolor, selectedcontentcolor, title, usefocuscolorascontentcolor, visible } = {}) {
    return this._container({
      name: "Status",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "borderColor", v: bordercolor },
      { n: "borderStyle", v: borderstyle },
      { n: "borderWidth", v: borderwidth },
      { n: "contentColor", v: contentcolor },
      { n: "headerContentColor", v: headercontentcolor },
      { n: "hoverBackgroundColor", v: hoverbackgroundcolor },
      { n: "hoverBorderColor", v: hoverbordercolor },
      { n: "hoverContentColor", v: hovercontentcolor },
      { n: "key", v: key },
      { n: "legendColor", v: legendcolor },
      { n: "selectedBackgroundColor", v: selectedbackgroundcolor },
      { n: "selectedBorderColor", v: selectedbordercolor },
      { n: "selectedContentColor", v: selectedcontentcolor },
      { n: "title", v: title },
      { n: "useFocusColorAsContentColor", v: this.boolean_abap_2_json(usefocuscolorascontentcolor) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  object_marker({ additionalinfo, type, visibility, visible, press } = {}) {
    return this._container({
      name: "ObjectMarker",
      aProp: this._filterProps([
      { n: "additionalInfo", v: additionalinfo },
      { n: "type", v: type },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "press", v: press },
      { n: "visibility", v: visibility },
      ]),
    });
  }

  object_list_item({ activeicon, icon, icondensityaware, intro, introtextdirection, number, numberstate, numbertextdirection, numberunit, title, titletextdirection, press, selected, type } = {}) {
    return this._container({
      name: "ObjectListItem",
      aProp: this._filterProps([
      { n: "activeIcon", v: activeicon },
      { n: "icon", v: icon },
      { n: "intro", v: intro },
      { n: "introTextDirection", v: introtextdirection },
      { n: "number", v: number },
      { n: "numberState", v: numberstate },
      { n: "numberTextDirection", v: numbertextdirection },
      { n: "numberUnit", v: numberunit },
      { n: "title", v: title },
      { n: "titleTextDirection", v: titletextdirection },
      { n: "iconDensityAware", v: this.boolean_abap_2_json(icondensityaware) },
      { n: "press", v: press },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "type", v: type },
      ]),
    });
  }

  light_box({ id, class: cssClass, visible } = {}) {
    return this._container({
      name: "LightBox",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  light_box_item({ alt, imagesrc, subtitle, title } = {}) {
    return this._container({
      name: "LightBoxItem",
      aProp: this._filterProps([
      { n: "alt", v: alt },
      { n: "imageSrc", v: imagesrc },
      { n: "subtitle", v: subtitle },
      { n: "title", v: title },
      ]),
    });
  }

  line_micro_chart({ color, height, leftbottomlabel, lefttoplabel, maxxvalue, minxvalue, minyvalue, rightbottomlabel, righttoplabel, size, threshold, thresholddisplayvalue, width, press, hideonnodata, showbottomlabels, showpoints, showthresholdline, showthresholdvalue, showtoplabels, maxyvalue } = {}) {
    return this._leaf({
      name: "LineMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "color", v: color },
      { n: "height", v: height },
      { n: "leftBottomLabel", v: leftbottomlabel },
      { n: "leftTopLabel", v: lefttoplabel },
      { n: "maxXValue", v: maxxvalue },
      { n: "minXValue", v: minxvalue },
      { n: "minYValue", v: minyvalue },
      { n: "rightBottomLabel", v: rightbottomlabel },
      { n: "rightTopLabel", v: righttoplabel },
      { n: "size", v: size },
      { n: "threshold", v: threshold },
      { n: "thresholdDisplayValue", v: thresholddisplayvalue },
      { n: "width", v: width },
      { n: "press", v: press },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "showBottomLabels", v: this.boolean_abap_2_json(showbottomlabels) },
      { n: "showPoints", v: this.boolean_abap_2_json(showpoints) },
      { n: "showThresholdLine", v: this.boolean_abap_2_json(showthresholdline) },
      { n: "showThresholdValue", v: this.boolean_abap_2_json(showthresholdvalue) },
      { n: "showTopLabels", v: this.boolean_abap_2_json(showtoplabels) },
      { n: "maxYValue", v: maxyvalue },
      ]),
    });
  }

  line_micro_chart_line({ points, color, type } = {}) {
    return this._container({
      name: "LineMicroChartLine",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "points", v: points },
      { n: "color", v: color },
      { n: "type", v: type },
      ]),
    });
  }

  line_micro_chart_point({ x, y } = {}) {
    return this._container({
      name: "LineMicroChartPoint",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "x", v: x },
      { n: "y", v: y },
      ]),
    });
  }

  line_micro_chart_empszd_point({ x, y, color, show } = {}) {
    return this._container({
      name: "LineMicroChartEmphasizedPoint",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "x", v: x },
      { n: "y", v: y },
      { n: "color", v: color },
      { n: "show", v: this.boolean_abap_2_json(show) },
      ]),
    });
  }

  stacked_bar_micro_chart({ height, press, maxvalue, precision, size, hideonnodata, displayzerovalue, showlabels, width } = {}) {
    return this._leaf({
      name: "StackedBarMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "height", v: height },
      { n: "press", v: press },
      { n: "maxValue", v: maxvalue },
      { n: "precision", v: precision },
      { n: "size", v: size },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "displayZeroValue", v: this.boolean_abap_2_json(displayzerovalue) },
      { n: "showLabels", v: this.boolean_abap_2_json(showlabels) },
      { n: "width", v: width },
      ]),
    });
  }

  column_micro_chart({ width, press, size, aligncontent, hideonnodata, allowcolumnlabels, showbottomlabels, showtoplabels, height } = {}) {
    return this._leaf({
      name: "ColumnMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "width", v: width },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "alignContent", v: aligncontent },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "allowColumnLabels", v: this.boolean_abap_2_json(allowcolumnlabels) },
      { n: "showBottomLabels", v: this.boolean_abap_2_json(showbottomlabels) },
      { n: "showTopLabels", v: this.boolean_abap_2_json(showtoplabels) },
      { n: "height", v: height },
      ]),
    });
  }

  column_micro_chart_data({ label, displayvalue, color, press, value } = {}) {
    return this._leaf({
      name: "ColumnMicroChartData",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "color", v: color },
      { n: "displayValue", v: displayvalue },
      { n: "label", v: label },
      { n: "value", v: value },
      { n: "press", v: press },
      ]),
    });
  }

  comparison_micro_chart({ colorpalette, press, size, height, maxvalue, minvalue, scale, width, hideonnodata, shrinkable, visible, view } = {}) {
    return this._container({
      name: "ComparisonMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "colorPalette", v: colorpalette },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "maxValue", v: maxvalue },
      { n: "minValue", v: minvalue },
      { n: "scale", v: scale },
      { n: "width", v: width },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "shrinkable", v: this.boolean_abap_2_json(shrinkable) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "view", v: view },
      ]),
    });
  }

  comparison_micro_chart_data({ color, press, displayvalue, title, value } = {}) {
    return this._container({
      name: "ComparisonMicroChartData",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "color", v: color },
      { n: "press", v: press },
      { n: "displayValue", v: displayvalue },
      { n: "title", v: title },
      { n: "value", v: value },
      ]),
    });
  }

  delta_micro_chart({ color, press, size, height, width, deltadisplayvalue, displayvalue1, displayvalue2, title2, value1, value2, view, hideonnodata, title1 } = {}) {
    return this._leaf({
      name: "DeltaMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "color", v: color },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "deltaDisplayValue", v: deltadisplayvalue },
      { n: "displayValue1", v: displayvalue1 },
      { n: "displayValue2", v: displayvalue2 },
      { n: "title2", v: title2 },
      { n: "value1", v: value1 },
      { n: "value2", v: value2 },
      { n: "view", v: view },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "title1", v: title1 },
      ]),
    });
  }

  bullet_micro_chart({ actualvaluelabel, press, size, height, width, deltavaluelabel, maxvalue, minvalue, mode, scale, targetvalue, targetvaluelabel, scalecolor, hideonnodata, showactualvalue, showdeltavalue, showtargetvalue, showthresholds, showvaluemarker, smallrangeallowed, forecastvalue, savidm } = {}) {
    return this._leaf({
      name: "BulletMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "actualValueLabel", v: actualvaluelabel },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "deltaValueLabel", v: deltavaluelabel },
      { n: "maxValue", v: maxvalue },
      { n: "minValue", v: minvalue },
      { n: "mode", v: mode },
      { n: "scale", v: scale },
      { n: "targetValue", v: targetvalue },
      { n: "targetValueLabel", v: targetvaluelabel },
      { n: "scaleColor", v: scalecolor },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "showActualValue", v: this.boolean_abap_2_json(showactualvalue) },
      { n: "showActualValueInDeltaMode", v: this.boolean_abap_2_json(savidm) },
      { n: "showDeltaValue", v: this.boolean_abap_2_json(showdeltavalue) },
      { n: "showTargetValue", v: this.boolean_abap_2_json(showtargetvalue) },
      { n: "showThresholds", v: this.boolean_abap_2_json(showthresholds) },
      { n: "showValueMarker", v: this.boolean_abap_2_json(showvaluemarker) },
      { n: "smallRangeAllowed", v: this.boolean_abap_2_json(smallrangeallowed) },
      { n: "forecastValue", v: forecastvalue },
      ]),
    });
  }

  harvey_ball_micro_chart({ colorpalette, press, size, height, width, total, totallabel, aligncontent, hideonnodata, formattedlabel, showfractions, showtotal, totalscale } = {}) {
    return this._container({
      name: "HarveyBallMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "colorPalette", v: colorpalette },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "total", v: total },
      { n: "totalLabel", v: totallabel },
      { n: "alignContent", v: aligncontent },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "formattedLabel", v: this.boolean_abap_2_json(formattedlabel) },
      { n: "showFractions", v: this.boolean_abap_2_json(showfractions) },
      { n: "showTotal", v: this.boolean_abap_2_json(showtotal) },
      { n: "totalScale", v: totalscale },
      ]),
    });
  }

  area_micro_chart({ colorpalette, press, size, height, maxxvalue, maxyvalue, minxvalue, minyvalue, view, aligncontent, hideonnodata, showlabel, width } = {}) {
    return this._leaf({
      name: "AreaMicroChart",
      ns: "mchart",
      aProp: this._filterProps([
      { n: "colorPalette", v: colorpalette },
      { n: "press", v: press },
      { n: "size", v: size },
      { n: "height", v: height },
      { n: "maxXValue", v: maxxvalue },
      { n: "maxYValue", v: maxyvalue },
      { n: "minXValue", v: minxvalue },
      { n: "minYValue", v: minyvalue },
      { n: "view", v: view },
      { n: "alignContent", v: aligncontent },
      { n: "hideOnNoData", v: this.boolean_abap_2_json(hideonnodata) },
      { n: "showLabel", v: this.boolean_abap_2_json(showlabel) },
      { n: "width", v: width },
      ]),
    });
  }

  data() {
    return this._container({
      name: "data",
      ns: "mchart",
      aProp: this._filterProps([

      ]),
    });
  }

  rich_text_editor({ buttongroups, customtoolbar, editable, editortype, height, plugins, required, sanitizevalue, showgroupclipboard, showgroupfont, showgroupfontstyle, showgroupinsert, showgrouplink, showgroupstructure, showgrouptextalign, showgroupundo, textdirection, uselegacytheme, width, wrapping, beforeeditorinit, change, ready, readyrecurring, value } = {}) {
    return this._container({
      name: "RichTextEditor",
      ns: "text",
      aProp: this._filterProps([
      { n: "buttonGroups", v: buttongroups },
      { n: "customToolbar", v: this.boolean_abap_2_json(customtoolbar) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "height", v: height },
      { n: "editorType", v: editortype },
      { n: "plugins", v: plugins },
      { n: "textDirection", v: textdirection },
      { n: "value", v: value },
      { n: "beforeEditorInit", v: beforeeditorinit },
      { n: "change", v: change },
      { n: "ready", v: ready },
      { n: "readyRecurring", v: readyrecurring },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "sanitizeValue", v: this.boolean_abap_2_json(sanitizevalue) },
      { n: "showGroupClipboard", v: this.boolean_abap_2_json(showgroupclipboard) },
      { n: "showGroupFont", v: this.boolean_abap_2_json(showgroupfont) },
      { n: "showGroupFontStyle", v: this.boolean_abap_2_json(showgroupfontstyle) },
      { n: "showGroupInsert", v: this.boolean_abap_2_json(showgroupinsert) },
      { n: "showGroupLink", v: this.boolean_abap_2_json(showgrouplink) },
      { n: "showGroupStructure", v: this.boolean_abap_2_json(showgroupstructure) },
      { n: "showGroupTextAlign", v: this.boolean_abap_2_json(showgrouptextalign) },
      { n: "showGroupUndo", v: this.boolean_abap_2_json(showgroupundo) },
      { n: "useLegacyTheme", v: this.boolean_abap_2_json(uselegacytheme) },
      { n: "wrapping", v: this.boolean_abap_2_json(wrapping) },
      { n: "width", v: width },
      ]),
    });
  }

  slider({ max, min, step, enabletickmarks, width, class: cssClass, id, enabled, change, inputsastooltips, showadvancedtooltip, showhandletooltip, livechange, value } = {}) {
    return this._leaf({
      name: "Slider",
      aProp: this._filterProps([
      { n: "class", v: cssClass },
      { n: "id", v: id },
      { n: "max", v: max },
      { n: "min", v: min },
      { n: "enableTickmarks", v: this.boolean_abap_2_json(enabletickmarks) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "value", v: value },
      { n: "step", v: step },
      { n: "change", v: change },
      { n: "width", v: width },
      { n: "inputsAsTooltips", v: inputsastooltips },
      { n: "showAdvancedTooltip", v: showadvancedtooltip },
      { n: "showHandleTooltip", v: showhandletooltip },
      { n: "liveChange", v: livechange },
      ]),
    });
  }

  upload_set({ id, instantupload, showicons, uploadenabled, terminationenabled, filetypes, maxfilenamelength, maxfilesize, mediatypes, uploadurl, items, mode, selectionchanged, uploadcompleted, afteritemadded, samefilenameallowed, uploadbuttoninvisible, directory, multiple, dragdropdescription, dragdroptext, nodatatext, nodatadescription, nodataillustrationtype, afteritemedited, afteritemremoved, beforeitemadded, beforeitemedited, beforeitemremoved, beforeuploadstarts, beforeuploadtermination, filenamelengthexceeded, filerenamed, filesizeexceeded, filetypemismatch, itemdragstart, itemdrop, mediatypemismatch, uploadterminated } = {}) {
    return this._container({
      name: "UploadSet",
      ns: "upload",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "instantUpload", v: this.boolean_abap_2_json(instantupload) },
      { n: "showIcons", v: this.boolean_abap_2_json(showicons) },
      { n: "uploadEnabled", v: this.boolean_abap_2_json(uploadenabled) },
      { n: "terminationEnabled", v: this.boolean_abap_2_json(terminationenabled) },
      { n: "uploadButtonInvisible", v: this.boolean_abap_2_json(uploadbuttoninvisible) },
      { n: "fileTypes", v: filetypes },
      { n: "maxFileNameLength", v: maxfilenamelength },
      { n: "maxFileSize", v: maxfilesize },
      { n: "mediaTypes", v: mediatypes },
      { n: "items", v: items },
      { n: "uploadUrl", v: uploadurl },
      { n: "mode", v: mode },
      { n: "fileRenamed", v: filerenamed },
      { n: "directory", v: this.boolean_abap_2_json(directory) },
      { n: "multiple", v: this.boolean_abap_2_json(multiple) },
      { n: "dragDropDescription", v: dragdropdescription },
      { n: "dragDropText", v: dragdroptext },
      { n: "noDataText", v: nodatatext },
      { n: "noDataDescription", v: nodatadescription },
      { n: "noDataIllustrationType", v: nodataillustrationtype },
      { n: "afterItemEdited", v: afteritemedited },
      { n: "afterItemRemoved", v: afteritemremoved },
      { n: "beforeItemAdded", v: beforeitemadded },
      { n: "beforeItemEdited", v: beforeitemedited },
      { n: "beforeItemRemoved", v: beforeitemremoved },
      { n: "beforeUploadStarts", v: beforeuploadstarts },
      { n: "beforeUploadTermination", v: beforeuploadtermination },
      { n: "fileNameLengthExceeded", v: filenamelengthexceeded },
      { n: "fileSizeExceeded", v: filesizeexceeded },
      { n: "fileTypeMismatch", v: filetypemismatch },
      { n: "itemDragStart", v: itemdragstart },
      { n: "itemDrop", v: itemdrop },
      { n: "mediaTypeMismatch", v: mediatypemismatch },
      { n: "uploadTerminated", v: uploadterminated },
      { n: "uploadCompleted", v: uploadcompleted },
      { n: "afterItemAdded", v: afteritemadded },
      { n: "sameFilenameAllowed", v: this.boolean_abap_2_json(samefilenameallowed) },
      { n: "selectionChanged", v: selectionchanged },
      ]),
    });
  }

  upload_set_toolbar_placeholder() {
    return this._container({
      name: "UploadSetToolbarPlaceholder",
      ns: "upload",
      aProp: this._filterProps([

      ]),
    });
  }

  upload_set_item({ filename, mediatype, url, thumbnailurl, markers, statuses, enablededit, enabledremove, selected, visibleedit, visibleremove, uploadstate, uploadurl, openpressed, removepressed } = {}) {
    return this._container({
      name: "UploadSetItem",
      ns: "upload",
      aProp: this._filterProps([
      { n: "fileName", v: filename },
      { n: "mediaType", v: mediatype },
      { n: "url", v: url },
      { n: "thumbnailUrl", v: thumbnailurl },
      { n: "markers", v: markers },
      { n: "enabledEdit", v: this.boolean_abap_2_json(enablededit) },
      { n: "enabledRemove", v: this.boolean_abap_2_json(enabledremove) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "visibleEdit", v: this.boolean_abap_2_json(visibleedit) },
      { n: "visibleRemove", v: this.boolean_abap_2_json(visibleremove) },
      { n: "uploadState", v: uploadstate },
      { n: "uploadUrl", v: uploadurl },
      { n: "openPressed", v: openpressed },
      { n: "removePressed", v: removepressed },
      { n: "statuses", v: statuses },
      ]),
    });
  }

  markers_as_status() {
    return this._container({
      name: "markersAsStatus",
      ns: "upload",
      aProp: this._filterProps([

      ]),
    });
  }

  mask_input_rule({ maskformatsymbol, regex } = {}) {
    return this._container({
      name: "MaskInputRule",
      aProp: this._filterProps([
      { n: "maskFormatSymbol", v: maskformatsymbol },
      { n: "regex", v: regex },
      ]),
    });
  }

  side_panel({ actionbarexpanded, arialabel, sidepanelmaxwidth, sidepanelminwidth, sidepanelposition, sidepanelresizable, sidepanelresizelargerstep, sidepanelresizestep, sidepanelwidth, toggle } = {}) {
    return this._container({
      name: "SidePanel",
      ns: "f",
      aProp: this._filterProps([
      { n: "sidePanelWidth", v: sidepanelwidth },
      { n: "sidePanelResizeStep", v: sidepanelresizestep },
      { n: "sidePanelResizeLargerStep", v: sidepanelresizelargerstep },
      { n: "sidePanelPosition", v: sidepanelposition },
      { n: "sidePanelMinWidth", v: sidepanelminwidth },
      { n: "sidePanelMaxWidth", v: sidepanelmaxwidth },
      { n: "sidePanelResizable", v: this.boolean_abap_2_json(sidepanelresizable) },
      { n: "actionBarExpanded", v: this.boolean_abap_2_json(actionbarexpanded) },
      { n: "toggle", v: toggle },
      { n: "ariaLabel", v: arialabel },
      ]),
    });
  }

  side_panel_item({ icon, text, key, enabled } = {}) {
    return this._container({
      name: "SidePanelItem",
      ns: "f",
      aProp: this._filterProps([
      { n: "icon", v: icon },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "key", v: key },
      { n: "text", v: text },
      ]),
    });
  }

  main_content() {
    return this._container({
      name: "mainContent",
      ns: "f",
      aProp: this._filterProps([

      ]),
    });
  }

  quick_view({ placement, width, afterclose, afteropen, beforeclose, beforeopen } = {}) {
    return this._container({
      name: "QuickView",
      aProp: this._filterProps([
      { n: "placement", v: placement },
      { n: "width", v: width },
      { n: "afterClose", v: afterclose },
      { n: "afterOpen", v: afteropen },
      { n: "beforeClose", v: beforeclose },
      { n: "beforeOpen", v: beforeopen },
      ]),
    });
  }

  quick_view_page({ description, header, pageid, title, titleurl } = {}) {
    return this._container({
      name: "QuickViewPage",
      aProp: this._filterProps([
      { n: "description", v: description },
      { n: "header", v: header },
      { n: "pageId", v: pageid },
      { n: "title", v: title },
      { n: "titleUrl", v: titleurl },
      ]),
    });
  }

  quick_view_group({ heading, visible } = {}) {
    return this._container({
      name: "QuickViewGroup",
      aProp: this._filterProps([
      { n: "heading", v: heading },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  quick_view_group_element({ emailsubject, label, pagelinkid, target, type, url, visible, value } = {}) {
    return this._container({
      name: "QuickViewGroupElement",
      aProp: this._filterProps([
      { n: "emailSubject", v: emailsubject },
      { n: "label", v: label },
      { n: "pageLinkId", v: pagelinkid },
      { n: "target", v: target },
      { n: "type", v: type },
      { n: "url", v: url },
      { n: "value", v: value },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  date_range_selection({ placeholder, displayformat, valueformat, required, valuestate, valuestatetext, enabled, showcurrentdatebutton, change, hideinput, showfooter, visible, showvaluestatemessage, mindate, maxdate, editable, width, id, calendarweeknumbering, displayformattype, class: cssClass, textdirection, textalign, name, datevalue, seconddatevalue, initialfocuseddatevalue, delimiter, value } = {}) {
    return this._leaf({
      name: "DateRangeSelection",
      aProp: this._filterProps([
      { n: "value", v: value },
      { n: "displayFormat", v: displayformat },
      { n: "displayFormatType", v: displayformattype },
      { n: "valueFormat", v: valueformat },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "placeholder", v: placeholder },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "change", v: change },
      { n: "maxDate", v: maxdate },
      { n: "minDate", v: mindate },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "dateValue", v: datevalue },
      { n: "secondDateValue", v: seconddatevalue },
      { n: "name", v: name },
      { n: "class", v: cssClass },
      { n: "calendarWeekNumbering", v: calendarweeknumbering },
      { n: "initialFocusedDateValue", v: initialfocuseddatevalue },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "hideInput", v: this.boolean_abap_2_json(hideinput) },
      { n: "showFooter", v: this.boolean_abap_2_json(showfooter) },
      { n: "showValueStateMessage", v: this.boolean_abap_2_json(showvaluestatemessage) },
      { n: "showCurrentDateButton", v: this.boolean_abap_2_json(showcurrentdatebutton) },
      { n: "delimiter", v: delimiter },
      ]),
    });
  }

  variant_management_fl({ displaytextfsv, editable, executeonselectionforstandflt, headerlevel, inerrorstate, maxwidth, modelname, resetoncontextchange, showsetasdefault, titlestyle, updatevariantinurl, for: forr, cancel, initialized, manage, save, select } = {}) {
    return this._container({
      name: "VariantManagement",
      ns: "flvm",
      aProp: this._filterProps([
      { n: "displayTextForExecuteOnSelectionForStandardVariant", v: displaytextfsv },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "executeOnSelectionForStandardDefault", v: this.boolean_abap_2_json(executeonselectionforstandflt) },
      { n: "headerLevel", v: headerlevel },
      { n: "inErrorState", v: this.boolean_abap_2_json(inerrorstate) },
      { n: "maxWidth", v: maxwidth },
      { n: "modelName", v: modelname },
      { n: "resetOnContextChange", v: this.boolean_abap_2_json(resetoncontextchange) },
      { n: "showSetAsDefault", v: this.boolean_abap_2_json(showsetasdefault) },
      { n: "titleStyle", v: titlestyle },
      { n: "updateVariantInURL", v: this.boolean_abap_2_json(updatevariantinurl) },
      { n: "cancel", v: cancel },
      { n: "initialized", v: initialized },
      { n: "manage", v: manage },
      { n: "save", v: save },
      { n: "select", v: select },
      { n: "for", v: forr },
      ]),
    });
  }

  column_element_data({ cellslarge, cellssmall } = {}) {
    return this._container({
      name: "ColumnElementData",
      ns: "form",
      aProp: this._filterProps([
      { n: "cellsLarge", v: cellslarge },
      { n: "cellsSmall", v: cellssmall },
      ]),
    });
  }

  fb_control() {
    return this._container({
      name: "control",
      ns: "fb",
      aProp: this._filterProps([

      ]),
    });
  }

  smart_variant_management({ id, showexecuteonselection, persistencykey } = {}) {
    return this._leaf({
      name: "SmartVariantManagement",
      ns: "smartVariantManagement",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "showExecuteOnSelection", v: this.boolean_abap_2_json(showexecuteonselection) },
      { n: "persistencyKey", v: persistencykey },
      ]),
    });
  }

  smart_filter_bar({ id, persistencykey, entityset } = {}) {
    return this._container({
      name: "SmartFilterBar",
      ns: "smartFilterBar",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "entitySet", v: entityset },
      { n: "persistencyKey", v: persistencykey },
      ]),
    });
  }

  control_configuration({ id, previnitdatafetchinvalhelpdia, visibleinadvancedarea, key } = {}) {
    return this._leaf({
      name: "ControlConfiguration",
      ns: "smartFilterBar",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "key", v: key },
      { n: "visibleInAdvancedArea", v: this.boolean_abap_2_json(visibleinadvancedarea) },
      { n: "preventInitialDataFetchInValueHelpDialog", v: this.boolean_abap_2_json(previnitdatafetchinvalhelpdia) },
      ]),
    });
  }

  _control_configuration() {
    return this._container({
      name: "controlConfiguration",
      ns: "smartFilterBar",
      aProp: this._filterProps([

      ]),
    });
  }

  smart_table({ id, smartfilterid, tabletype, editable, initiallyvisiblefields, entityset, usevariantmanagement, useexporttoexcel, usetablepersonalisation, header, showrowcount, enableexport, enableautobinding } = {}) {
    return this._container({
      name: "SmartTable",
      ns: "smartTable",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "smartFilterId", v: smartfilterid },
      { n: "tableType", v: tabletype },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "initiallyVisibleFields", v: initiallyvisiblefields },
      { n: "entitySet", v: entityset },
      { n: "useVariantManagement", v: this.boolean_abap_2_json(usevariantmanagement) },
      { n: "useExportToExcel", v: this.boolean_abap_2_json(useexporttoexcel) },
      { n: "useTablePersonalisation", v: this.boolean_abap_2_json(usetablepersonalisation) },
      { n: "header", v: header },
      { n: "showRowCount", v: this.boolean_abap_2_json(showrowcount) },
      { n: "enableExport", v: this.boolean_abap_2_json(enableexport) },
      { n: "enableAutoBinding", v: this.boolean_abap_2_json(enableautobinding) },
      ]),
    });
  }

  form_toolbar() {
    return this._container({
      name: "toolbar",
      ns: "form",
      aProp: this._filterProps([

      ]),
    });
  }

  paging_button({ count, nextbuttontooltip, previousbuttontooltip, position } = {}) {
    return this._leaf({
      name: "PagingButton",
      aProp: this._filterProps([
      { n: "count", v: count },
      { n: "nextButtonTooltip", v: nextbuttontooltip },
      { n: "position", v: position },
      { n: "previousButtonTooltip", v: previousbuttontooltip },
      ]),
    });
  }

  timeline({ id, enabledoublesided, groupby, growingthreshold, filtertitle, sortoldestfirst, alignment, axisorientation, content, enablemodelfilter, enablescroll, forcegrowing, group, lazyloading, showheaderbar, showicons, showitemfilter, showsearch, showsort, showtimefilter, sort, groupbytype, textheight, width, height, nodatatext, filterlist, customfilter } = {}) {
    return this._container({
      name: "Timeline",
      ns: "commons",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "enableDoubleSided", v: this.boolean_abap_2_json(enabledoublesided) },
      { n: "groupBy", v: groupby },
      { n: "growingThreshold", v: growingthreshold },
      { n: "filterTitle", v: filtertitle },
      { n: "sortOldestFirst", v: this.boolean_abap_2_json(sortoldestfirst) },
      { n: "enableModelFilter", v: this.boolean_abap_2_json(enablemodelfilter) },
      { n: "enableScroll", v: this.boolean_abap_2_json(enablescroll) },
      { n: "forceGrowing", v: this.boolean_abap_2_json(forcegrowing) },
      { n: "group", v: this.boolean_abap_2_json(group) },
      { n: "lazyLoading", v: this.boolean_abap_2_json(lazyloading) },
      { n: "showHeaderBar", v: this.boolean_abap_2_json(showheaderbar) },
      { n: "showIcons", v: this.boolean_abap_2_json(showicons) },
      { n: "showItemFilter", v: this.boolean_abap_2_json(showitemfilter) },
      { n: "showSearch", v: this.boolean_abap_2_json(showsearch) },
      { n: "showSort", v: this.boolean_abap_2_json(showsort) },
      { n: "showTimeFilter", v: this.boolean_abap_2_json(showtimefilter) },
      { n: "sort", v: this.boolean_abap_2_json(sort) },
      { n: "groupByType", v: groupbytype },
      { n: "textHeight", v: textheight },
      { n: "width", v: width },
      { n: "height", v: height },
      { n: "noDataText", v: nodatatext },
      { n: "alignment", v: alignment },
      { n: "axisOrientation", v: axisorientation },
      { n: "filterList", v: filterlist },
      { n: "customFilter", v: customfilter },
      { n: "content", v: content },
      ]),
    });
  }

  timeline_item({ id, datetime, title, usernameclickable, useicontooltip, usernameclicked, select, userpicture, text, username, filtervalue, icondisplayshape, iconinitials, iconsize, icontooltip, maxcharacters, replycount, status, customactionclicked, press, replylistopen, replypost, icon } = {}) {
    return this._container({
      name: "TimelineItem",
      ns: "commons",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "dateTime", v: datetime },
      { n: "title", v: title },
      { n: "userNameClickable", v: this.boolean_abap_2_json(usernameclickable) },
      { n: "useIconTooltip", v: this.boolean_abap_2_json(useicontooltip) },
      { n: "userNameClicked", v: usernameclicked },
      { n: "userPicture", v: userpicture },
      { n: "select", v: select },
      { n: "text", v: text },
      { n: "userName", v: username },
      { n: "filterValue", v: filtervalue },
      { n: "iconDisplayShape", v: icondisplayshape },
      { n: "iconInitials", v: iconinitials },
      { n: "iconSize", v: iconsize },
      { n: "iconTooltip", v: icontooltip },
      { n: "maxCharacters", v: maxcharacters },
      { n: "replyCount", v: replycount },
      { n: "status", v: status },
      { n: "customActionClicked", v: customactionclicked },
      { n: "press", v: press },
      { n: "replyListOpen", v: replylistopen },
      { n: "replyPost", v: replypost },
      { n: "icon", v: icon },
      ]),
    });
  }

  split_container({ id, initialdetail, initialmaster, backgroundcolor, backgroundimage, backgroundopacity, backgroundrepeat, defaulttransitionnamedetail, defaulttransitionnamemaster, masterbuttontext, masterbuttontooltip, mode, afterdetailnavigate, aftermasterclose, aftermasternavigate, aftermasteropen, beforemasterclose, beforemasteropen, detailnavigate, masterbutton, masternavigate } = {}) {
    return this._leaf({
      name: "SplitContainer",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "initialDetail", v: initialdetail },
      { n: "initialMaster", v: initialmaster },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "backgroundImage", v: backgroundimage },
      { n: "backgroundOpacity", v: backgroundopacity },
      { n: "backgroundRepeat", v: backgroundrepeat },
      { n: "defaultTransitionNameDetail", v: defaulttransitionnamedetail },
      { n: "defaultTransitionNameMaster", v: defaulttransitionnamemaster },
      { n: "masterButtonText", v: masterbuttontext },
      { n: "masterButtonTooltip", v: masterbuttontooltip },
      { n: "afterDetailNavigate", v: afterdetailnavigate },
      { n: "afterMasterClose", v: aftermasterclose },
      { n: "afterMasterNavigate", v: aftermasternavigate },
      { n: "afterMasterOpen", v: aftermasteropen },
      { n: "beforeMasterClose", v: beforemasterclose },
      { n: "beforeMasterOpen", v: beforemasteropen },
      { n: "detailNavigate", v: detailnavigate },
      { n: "masterButton", v: masterbutton },
      { n: "masterNavigate", v: masternavigate },
      { n: "mode", v: mode },
      ]),
    });
  }

  container_content({ id, title, icon } = {}) {
    return this._container({
      name: "ContainerContent",
      ns: "vk",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "title", v: title },
      { n: "icon", v: icon },
      ]),
    });
  }

  map_container({ id, autoadjustheight, showhome } = {}) {
    return this._container({
      name: "MapContainer",
      ns: "vk",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "autoAdjustHeight", v: this.boolean_abap_2_json(autoadjustheight) },
      { n: "showHome", v: this.boolean_abap_2_json(showhome) },
      ]),
    });
  }

  spot({ id, position, contentoffset, type, scale, tooltip, image, icon, click, text } = {}) {
    return this._leaf({
      name: "Spot",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "position", v: position },
      { n: "contentOffset", v: contentoffset },
      { n: "type", v: type },
      { n: "scale", v: scale },
      { n: "tooltip", v: tooltip },
      { n: "image", v: image },
      { n: "icon", v: icon },
      { n: "text", v: text },
      { n: "click", v: click },
      ]),
    });
  }

  analytic_map({ id, initialposition, height, lassoselection, visible, width, initialzoom } = {}) {
    return this._container({
      name: "AnalyticMap",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "initialPosition", v: initialposition },
      { n: "lassoSelection", v: lassoselection },
      { n: "height", v: height },
      { n: "visible", v: visible },
      { n: "width", v: width },
      { n: "initialZoom", v: initialzoom },
      ]),
    });
  }

  spots({ id, items } = {}) {
    return this._container({
      name: "Spots",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "items", v: items },
      ]),
    });
  }

  vos() {
    return this._container({
      name: "vos",
      ns: "vbm",
      aProp: this._filterProps([

      ]),
    });
  }

  action_sheet({ id, cancelbuttontext, placement, showcancelbutton, title, afterclose, afteropen, beforeclose, beforeopen, cancelbuttonpress, visible, class: cssClass } = {}) {
    return this._container({
      name: "ActionSheet",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "cancelbuttontext", v: cancelbuttontext },
      { n: "placement", v: placement },
      { n: "showCancelButton", v: showcancelbutton },
      { n: "title", v: title },
      { n: "afterClose", v: afterclose },
      { n: "afterOpen", v: afteropen },
      { n: "beforeClose", v: beforeclose },
      { n: "beforeOpen", v: beforeopen },
      { n: "cancelButtonPress", v: cancelbuttonpress },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  expandable_text({ id, emptyindicatormode, maxcharacters, overflowmode, renderwhitespace, text, textalign, textdirection, visible, wrappingtype, class: cssClass } = {}) {
    return this._container({
      name: "ExpandableText",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "emptyIndicatorMode", v: emptyindicatormode },
      { n: "maxCharacters", v: maxcharacters },
      { n: "overflowMode", v: overflowmode },
      { n: "renderWhitespace", v: this.boolean_abap_2_json(renderwhitespace) },
      { n: "text", v: text },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "wrappingType", v: wrappingtype },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "class", v: cssClass },
      ]),
    });
  }

  select({ id, autoadjustwidth, columnratio, editable, enabled, forceselection, icon, maxwidth, name, required, resetonmissingkey, selecteditemid, selectedkey, showsecondaryvalues, textalign, textdirection, type, valuestate, valuestatetext, visible, width, wrapitemstext, items, selecteditem, change, livechange, class: cssClass } = {}) {
    return this._container({
      name: "Select",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "autoAdjustWidth", v: this.boolean_abap_2_json(autoadjustwidth) },
      { n: "columnRatio", v: columnratio },
      { n: "editable", v: this.boolean_abap_2_json(editable) },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      { n: "forceSelection", v: this.boolean_abap_2_json(forceselection) },
      { n: "icon", v: icon },
      { n: "maxWidth", v: maxwidth },
      { n: "name", v: name },
      { n: "required", v: this.boolean_abap_2_json(required) },
      { n: "resetOnMissingKey", v: this.boolean_abap_2_json(resetonmissingkey) },
      { n: "selectedItemId", v: selecteditemid },
      { n: "selectedKey", v: selectedkey },
      { n: "showSecondaryValues", v: this.boolean_abap_2_json(showsecondaryvalues) },
      { n: "textAlign", v: textalign },
      { n: "textDirection", v: textdirection },
      { n: "type", v: type },
      { n: "valueState", v: valuestate },
      { n: "valueStateText", v: valuestatetext },
      { n: "width", v: width },
      { n: "wrapItemsText", v: this.boolean_abap_2_json(wrapitemstext) },
      { n: "items", v: items },
      { n: "selectedItem", v: selecteditem },
      { n: "change", v: change },
      { n: "liveChange", v: livechange },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  embedded_control() {
    return this._container({
      name: "embeddedControl",
      ns: "commons",
      aProp: this._filterProps([

      ]),
    });
  }

  header_container_control({ backgrounddesign, gridlayout, height, orientation, scrollstep, scrollstepbyitem, scrolltime, showdividers, showoverflowitem, visible, width, id, scroll, snaptorow } = {}) {
    return this._container({
      name: "HeaderContainer",
      aProp: this._filterProps([
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "gridLayout", v: this.boolean_abap_2_json(gridlayout) },
      { n: "height", v: height },
      { n: "orientation", v: orientation },
      { n: "scrollStep", v: scrollstep },
      { n: "scrollStepByItem", v: scrollstepbyitem },
      { n: "scrollTime", v: scrolltime },
      { n: "showDividers", v: this.boolean_abap_2_json(showdividers) },
      { n: "showOverflowItem", v: this.boolean_abap_2_json(showoverflowitem) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "snapToRow", v: this.boolean_abap_2_json(snaptorow) },
      { n: "width", v: width },
      { n: "id", v: id },
      { n: "scroll", v: scroll },
      ]),
    });
  }

  dependents(args = {}) {
    return this._container({
      name: "dependents",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  card({ id, class: cssClass, headerposition, height, visible, width } = {}) {
    return this._container({
      name: "Card",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "headerPosition", v: headerposition },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  card_header({ id, class: cssClass, iconalt, iconbackgroundcolor, icondisplayshape, iconinitials, iconsize, iconsrc, iconvisible, statustext, statusvisible, subtitle, subtitlemaxlines, title, titlemaxlines, visible, datatimestamp, press } = {}) {
    return this._container({
      name: "Header",
      ns: "card",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "dataTimestamp", v: datatimestamp },
      { n: "iconAlt", v: iconalt },
      { n: "iconBackgroundColor", v: iconbackgroundcolor },
      { n: "iconDisplayShape", v: icondisplayshape },
      { n: "iconInitials", v: iconinitials },
      { n: "iconSize", v: iconsize },
      { n: "iconSrc", v: iconsrc },
      { n: "statusText", v: statustext },
      { n: "statusVisible", v: statusvisible },
      { n: "subtitle", v: subtitle },
      { n: "subtitleMaxLines", v: subtitlemaxlines },
      { n: "title", v: title },
      { n: "press", v: press },
      { n: "titleMaxLines", v: titlemaxlines },
      { n: "iconVisible", v: this.boolean_abap_2_json(iconvisible) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  numeric_header({ id, class: cssClass, visible, datatimestamp, press, details, detailsmaxlines, detailsstate, iconalt, iconbackgroundcolor, icondisplayshape, iconinitials, iconsize, iconsrc, iconvisible, number, numbersize, numbervisible, scale, sideindicatorsalignment, state, statustext, statusvisible, subtitle, subtitlemaxlines, title, titlemaxlines, trend, unitofmeasurement } = {}) {
    return this._container({
      name: "NumericHeader",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "datatimestamp", v: datatimestamp },
      { n: "press", v: press },
      { n: "details", v: details },
      { n: "detailsMaxLines", v: detailsmaxlines },
      { n: "detailsState", v: detailsstate },
      { n: "iconAlt", v: iconalt },
      { n: "iconBackgroundColor", v: iconbackgroundcolor },
      { n: "iconDisplayShape", v: icondisplayshape },
      { n: "iconSize", v: iconsize },
      { n: "iconSrc", v: iconsrc },
      { n: "iconInitials", v: iconinitials },
      { n: "number", v: number },
      { n: "numberSize", v: numbersize },
      { n: "scale", v: scale },
      { n: "sideIndicatorsAlignment", v: sideindicatorsalignment },
      { n: "state", v: state },
      { n: "statusText", v: statustext },
      { n: "subtitle", v: subtitle },
      { n: "subtitleMaxLines", v: subtitlemaxlines },
      { n: "title", v: title },
      { n: "titleMaxLines", v: titlemaxlines },
      { n: "trend", v: trend },
      { n: "unitOfMeasurement", v: unitofmeasurement },
      { n: "statusVisible", v: this.boolean_abap_2_json(statusvisible) },
      { n: "numberVisible", v: this.boolean_abap_2_json(numbervisible) },
      { n: "iconVisible", v: this.boolean_abap_2_json(iconvisible) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  numeric_side_indicator({ id, class: cssClass, visible, number, state, title, unit } = {}) {
    return this._container({
      name: "NumericSideIndicator",
      ns: "f",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "unit", v: unit },
      { n: "title", v: title },
      { n: "state", v: state },
      { n: "number", v: number },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  slide_tile({ displaytime, height, visible, scope, sizebehavior, transitiontime, press, width, class: cssClass } = {}) {
    return this._container({
      name: "SlideTile",
      aProp: this._filterProps([
      { n: "displayTime", v: displaytime },
      { n: "height", v: height },
      { n: "scope", v: scope },
      { n: "sizeBehavior", v: sizebehavior },
      { n: "transitionTime", v: transitiontime },
      { n: "width", v: width },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "class", v: cssClass },
      ]),
    });
  }

  busy_indicator({ id, class: cssClass, customicon, customiconheight, customiconrotationspeed, customiconwidth, size, text, textdirection, customicondensityaware, visible } = {}) {
    return this._container({
      name: "BusyIndicator",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "customIcon", v: customicon },
      { n: "customIconHeight", v: customiconheight },
      { n: "customIconRotationSpeed", v: customiconrotationspeed },
      { n: "customIconWidth", v: customiconwidth },
      { n: "size", v: size },
      { n: "text", v: text },
      { n: "textDirection", v: textdirection },
      { n: "customIconDensityAware", v: this.boolean_abap_2_json(customicondensityaware) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  custom_layout(args = {}) {
    return this._container({
      name: "customLayout",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  carousel_layout({ visiblepagescount } = {}) {
    return this._container({
      name: "CarouselLayout",
      aProp: this._filterProps([
      { n: "visiblePagesCount", v: visiblepagescount },
      ]),
    });
  }

  facet_filter({ id, class: cssClass, livesearch, showpersonalization, showpopoverokbutton, showreset, showsummarybar, type, visible, confirm, reset, lists } = {}) {
    return this._container({
      name: "FacetFilter",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "liveSearch", v: this.boolean_abap_2_json(livesearch) },
      { n: "showPersonalization", v: this.boolean_abap_2_json(showpersonalization) },
      { n: "showPopoverOKButton", v: this.boolean_abap_2_json(showpopoverokbutton) },
      { n: "showReset", v: this.boolean_abap_2_json(showreset) },
      { n: "showSummaryBar", v: this.boolean_abap_2_json(showsummarybar) },
      { n: "type", v: type },
      { n: "confirm", v: confirm },
      { n: "reset", v: reset },
      { n: "lists", v: lists },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  facet_filter_list({ id, class: cssClass, active, allcount, backgrounddesign, datatype, enablebusyindicator, enablecaseinsensitivesearch, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, key, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, retainlistsequence, sequence, shownodata, showremovefaceticon, showseparators, showunread, sticky, swipedirection, title, visible, width, wordwrap, listclose, listopen, search, selectionchange, delete: del, items } = {}) {
    return this._container({
      name: "FacetFilterList",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "active", v: this.boolean_abap_2_json(active) },
      { n: "allCount", v: allcount },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "dataType", v: datatype },
      { n: "enableBusyIndicator", v: this.boolean_abap_2_json(enablebusyindicator) },
      { n: "enableCaseInsensitiveSearch", v: this.boolean_abap_2_json(enablecaseinsensitivesearch) },
      { n: "footerText", v: footertext },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "growingDirection", v: growingdirection },
      { n: "growingScrollToLoad", v: this.boolean_abap_2_json(growingscrolltoload) },
      { n: "growingThreshold", v: growingthreshold },
      { n: "growingTriggerText", v: growingtriggertext },
      { n: "headerLevel", v: headerlevel },
      { n: "includeItemInSelection", v: this.boolean_abap_2_json(includeiteminselection) },
      { n: "inset", v: this.boolean_abap_2_json(inset) },
      { n: "key", v: key },
      { n: "swipedirection", v: swipedirection },
      { n: "headerText", v: headertext },
      { n: "keyboardMode", v: keyboardmode },
      { n: "mode", v: mode },
      { n: "modeAnimationOn", v: this.boolean_abap_2_json(modeanimationon) },
      { n: "multiSelectMode", v: multiselectmode },
      { n: "noDataText", v: nodatatext },
      { n: "rememberSelections", v: this.boolean_abap_2_json(rememberselections) },
      { n: "retainListSequence", v: this.boolean_abap_2_json(retainlistsequence) },
      { n: "sequence", v: sequence },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "showRemoveFacetIcon", v: this.boolean_abap_2_json(showremovefaceticon) },
      { n: "showSeparators", v: showseparators },
      { n: "showUnread", v: this.boolean_abap_2_json(showunread) },
      { n: "sticky", v: sticky },
      { n: "title", v: title },
      { n: "width", v: width },
      { n: "wordWrap", v: this.boolean_abap_2_json(wordwrap) },
      { n: "listClose", v: listclose },
      { n: "listOpen", v: listopen },
      { n: "search", v: search },
      { n: "selectionChange", v: selectionchange },
      { n: "delete", v: del },
      { n: "items", v: items },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  facet_filter_item({ id, class: cssClass, count, counter, highlight, highlighttext, key, navigated, selected, text, type, unread, visible, press, detailpress } = {}) {
    return this._container({
      name: "FacetFilterItem",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "count", v: count },
      { n: "counter", v: counter },
      { n: "highlight", v: highlight },
      { n: "highlightText", v: highlighttext },
      { n: "key", v: key },
      { n: "navigated", v: this.boolean_abap_2_json(navigated) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "unread", v: this.boolean_abap_2_json(unread) },
      { n: "text", v: text },
      { n: "type", v: type },
      { n: "detailPress", v: detailpress },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  draft_indicator({ id, class: cssClass, mindisplaytime, state, visible } = {}) {
    return this._container({
      name: "DraftIndicator",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "minDisplayTime", v: mindisplaytime },
      { n: "state", v: state },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  drag_info({ sourceaggregation } = {}) {
    return this._leaf({
      name: "DragInfo",
      ns: "dnd",
      aProp: this._filterProps([
      { n: "sourceAggregation", v: sourceaggregation },
      ]),
    });
  }

  drag_drop_info({ sourceaggregation, targetaggregation, dragstart, drop } = {}) {
    return this._leaf({
      name: "DragDropInfo",
      ns: "dnd",
      aProp: this._filterProps([
      { n: "sourceAggregation", v: sourceaggregation },
      { n: "targetAggregation", v: targetaggregation },
      { n: "dragStart", v: dragstart },
      { n: "drop", v: drop },
      ]),
    });
  }

  drag_drop_config(args = {}) {
    return this._container({
      name: "dragDropConfig",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  html_map({ id, class: cssClass, name } = {}) {
    return this._container({
      name: "map",
      ns: "html",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "name", v: name },
      ]),
    });
  }

  html_area({ id, shape, coords, alt, target, href, onclick } = {}) {
    return this._container({
      name: "area",
      ns: "html",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "shape", v: shape },
      { n: "coords", v: coords },
      { n: "alt", v: alt },
      { n: "target", v: target },
      { n: "href", v: href },
      { n: "onclick", v: onclick },
      ]),
    });
  }

  html_canvas({ id, width, height, style, class: cssClass } = {}) {
    return this._container({
      name: "canvas",
      ns: "html",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "width", v: width },
      { n: "height", v: height },
      { n: "style", v: style },
      ]),
    });
  }

  notification_list({ id, class: cssClass, footertext, growing, growingdirection, growingscrolltoload, growingthreshold, growingtriggertext, headerlevel, headertext, includeiteminselection, inset, keyboardmode, mode, modeanimationon, multiselectmode, nodatatext, rememberselections, shownodata, showseparators, showunread, sticky, swipedirection, visible, width, beforeopencontextmenu, delete: del, growingfinished, growingstarted, itempress, select, selectionchange, swipe, updatefinished, updatestarted } = {}) {
    return this._container({
      name: "NotificationList",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "footerText", v: footertext },
      { n: "growingDirection", v: growingdirection },
      { n: "growingThreshold", v: growingthreshold },
      { n: "growingTriggerText", v: growingtriggertext },
      { n: "headerLevel", v: headerlevel },
      { n: "headerText", v: headertext },
      { n: "keyboardMode", v: keyboardmode },
      { n: "mode", v: mode },
      { n: "multiSelectMode", v: multiselectmode },
      { n: "noDataText", v: nodatatext },
      { n: "sticky", v: sticky },
      { n: "swipeDirection", v: swipedirection },
      { n: "width", v: width },
      { n: "showSeparators", v: showseparators },
      { n: "beforeOpenContextMenu", v: beforeopencontextmenu },
      { n: "delete", v: del },
      { n: "growingFinished", v: growingfinished },
      { n: "growingStarted", v: growingstarted },
      { n: "itemPress", v: itempress },
      { n: "select", v: select },
      { n: "selectionChange", v: selectionchange },
      { n: "swipe", v: swipe },
      { n: "updateFinished", v: updatefinished },
      { n: "updateStarted", v: updatestarted },
      { n: "growingScrollToLoad", v: this.boolean_abap_2_json(growingscrolltoload) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "growing", v: this.boolean_abap_2_json(growing) },
      { n: "includeItemInSelection", v: this.boolean_abap_2_json(includeiteminselection) },
      { n: "inset", v: this.boolean_abap_2_json(inset) },
      { n: "modeAnimationOn", v: this.boolean_abap_2_json(modeanimationon) },
      { n: "rememberSelections", v: this.boolean_abap_2_json(rememberselections) },
      { n: "showNoData", v: this.boolean_abap_2_json(shownodata) },
      { n: "showUnread", v: this.boolean_abap_2_json(showunread) },
      ]),
    });
  }

  notification_list_group({ id, autopriority, collapsed, enablecollapsebuttonwhenempty, highlight, highlighttext, navigated, priority, selected, showbuttons, showclosebutton, showemptygroup, showitemscounter, title, type, unread, visible, class: cssClass, oncollapse } = {}) {
    return this._container({
      name: "NotificationListGroup",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "highlight", v: highlight },
      { n: "highlightText", v: highlighttext },
      { n: "priority", v: priority },
      { n: "title", v: title },
      { n: "type", v: type },
      { n: "onCollapse", v: oncollapse },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "autoPriority", v: this.boolean_abap_2_json(autopriority) },
      { n: "collapsed", v: this.boolean_abap_2_json(collapsed) },
      { n: "enableCollapseButtonWhenEmpty", v: this.boolean_abap_2_json(enablecollapsebuttonwhenempty) },
      { n: "navigated", v: this.boolean_abap_2_json(navigated) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "showButtons", v: this.boolean_abap_2_json(showbuttons) },
      { n: "showCloseButton", v: this.boolean_abap_2_json(showclosebutton) },
      { n: "showEmptyGroup", v: this.boolean_abap_2_json(showemptygroup) },
      { n: "showItemsCounter", v: this.boolean_abap_2_json(showitemscounter) },
      { n: "unread", v: this.boolean_abap_2_json(unread) },
      ]),
    });
  }

  notification_list_item({ id, visible, class: cssClass, authoravatarcolor, authorinitials, description, hideshowmorebutton, truncate, authorname, authorpicture, counter, datetime, highlight, highlighttext, navigated, priority, selected, showbuttons, showclosebutton, title, type, unread, close, detailpress, press } = {}) {
    return this._container({
      name: "NotificationListItem",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "authorAvatarColor", v: authoravatarcolor },
      { n: "authorInitials", v: authorinitials },
      { n: "description", v: description },
      { n: "authorName", v: authorname },
      { n: "authorPicture", v: authorpicture },
      { n: "datetime", v: datetime },
      { n: "counter", v: counter },
      { n: "highlightText", v: highlighttext },
      { n: "priority", v: priority },
      { n: "title", v: title },
      { n: "type", v: type },
      { n: "close", v: close },
      { n: "detailPress", v: detailpress },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "hideShowMoreButton", v: this.boolean_abap_2_json(hideshowmorebutton) },
      { n: "truncate", v: this.boolean_abap_2_json(truncate) },
      { n: "highlight", v: this.boolean_abap_2_json(highlight) },
      { n: "navigated", v: this.boolean_abap_2_json(navigated) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "showButtons", v: this.boolean_abap_2_json(showbuttons) },
      { n: "showCloseButton", v: this.boolean_abap_2_json(showclosebutton) },
      { n: "truncate", v: this.boolean_abap_2_json(truncate) },
      { n: "unread", v: this.boolean_abap_2_json(unread) },
      ]),
    });
  }

  wizard({ id, class: cssClass, backgrounddesign, busy, busyindicatordelay, busyindicatorsize, enablebranching, fieldgroupids, finishbuttontext, height, rendermode, shownextbutton, steptitlelevel, visible, width, complete, navigationchange, stepactivate } = {}) {
    return this._container({
      name: "Wizard",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "backgroundDesign", v: backgrounddesign },
      { n: "busy", v: this.boolean_abap_2_json(busy) },
      { n: "busyIndicatorDelay", v: busyindicatordelay },
      { n: "busyIndicatorSize", v: busyindicatorsize },
      { n: "enableBranching", v: this.boolean_abap_2_json(enablebranching) },
      { n: "fieldGroupIds", v: fieldgroupids },
      { n: "finishButtonText", v: finishbuttontext },
      { n: "height", v: height },
      { n: "renderMode", v: rendermode },
      { n: "showNextButton", v: this.boolean_abap_2_json(shownextbutton) },
      { n: "stepTitleLevel", v: steptitlelevel },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "width", v: width },
      { n: "complete", v: complete },
      { n: "navigationChange", v: navigationchange },
      { n: "stepActivate", v: stepactivate },
      ]),
    });
  }

  wizard_step({ id, busy, busyindicatordelay, busyindicatorsize, fieldgroupids, icon, title, validated, visible, activate, subsequentsteps, nextstep, complete } = {}) {
    return this._container({
      name: "WizardStep",
      aProp: this._filterProps([

      ]),
    });
  }

  template_repeat({ list, var: vr } = {}) {
    return this._container({
      name: "repeat",
      ns: "template",
      aProp: this._filterProps([
      { n: "list", v: list },
      { n: "var", v: vr },
      ]),
    });
  }

  template_with({ path, helper, var: vr } = {}) {
    return this._container({
      name: "with",
      ns: "template",
      aProp: this._filterProps([
      { n: "path", v: path },
      { n: "helper", v: helper },
      { n: "var", v: vr },
      ]),
    });
  }

  template_if({ test } = {}) {
    return this._container({
      name: "if",
      ns: "template",
      aProp: this._filterProps([
      { n: "test", v: test },
      ]),
    });
  }

  template_then() {
    return this._container({
      name: "then",
      ns: "template",
      aProp: this._filterProps([

      ]),
    });
  }

  template_else() {
    return this._container({
      name: "else",
      ns: "template",
      aProp: this._filterProps([

      ]),
    });
  }

  template_elseif({ test } = {}) {
    return this._container({
      name: "elseif",
      ns: "template",
      aProp: this._filterProps([
      { n: "test", v: test },
      ]),
    });
  }

  relationship({ shapeid, type, successor, predecessor } = {}) {
    return this._container({
      name: "Relationship",
      ns: "gantt",
      aProp: this._filterProps([
      { n: "shapeId", v: shapeid },
      { n: "type", v: type },
      { n: "successor", v: successor },
      { n: "predecessor", v: predecessor },
      ]),
    });
  }

  relationships() {
    return this._container({
      name: "relationships",
      ns: "gantt",
      aProp: this._filterProps([

      ]),
    });
  }

  no_data(args = {}) {
    return this._container({
      name: "noData",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  lines(args = {}) {
    return this._container({
      name: "lines",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  line({ id, class: cssClass, arroworientation, arrowposition, description, from, linetype, selected, status, stretchtocenter, title, visible, press, hover, to } = {}) {
    return this._container({
      name: "Line",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "arrowOrientation", v: arroworientation },
      { n: "arrowPosition", v: arrowposition },
      { n: "description", v: description },
      { n: "from", v: from },
      { n: "lineType", v: linetype },
      { n: "status", v: status },
      { n: "title", v: title },
      { n: "to", v: to },
      { n: "hover", v: hover },
      { n: "press", v: press },
      { n: "stretchToCenter", v: this.boolean_abap_2_json(stretchtocenter) },
      { n: "selected", v: this.boolean_abap_2_json(selected) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  groups(args = {}) {
    return this._container({
      name: "groups",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  group({ id, class: cssClass, collapsed, description, headercheckboxstate, icon, key, minwidth, parentgroupkey, status, title, visible, collapseexpand, headercheckboxpress, showdetail } = {}) {
    return this._container({
      name: "group",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "collapsed", v: this.boolean_abap_2_json(collapsed) },
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "description", v: description },
      { n: "headerCheckBoxState", v: headercheckboxstate },
      { n: "icon", v: icon },
      { n: "key", v: key },
      { n: "minWidth", v: minwidth },
      { n: "parentGroupKey", v: parentgroupkey },
      { n: "status", v: status },
      { n: "title", v: title },
      { n: "collapseExpand", v: collapseexpand },
      { n: "showDetail", v: showdetail },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "headerCheckBoxPress", v: headercheckboxpress },
      ]),
    });
  }

  network_graph({ id, class: cssClass, layout, height, width, nodes, lines, groups, backgroundcolor, backgroundimage, nodatatext, orientation, rendertype, enablewheelzoom, enablezoom, nodata, visible, afterlayouting, beforelayouting, failure, graphready, search, searchsuggest, selectionchange, zoomchanged } = {}) {
    return this._container({
      name: "Graph",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "layout", v: layout },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "nodes", v: nodes },
      { n: "lines", v: lines },
      { n: "groups", v: groups },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "backgroundImage", v: backgroundimage },
      { n: "noDataText", v: nodatatext },
      { n: "orientation", v: orientation },
      { n: "renderType", v: rendertype },
      { n: "afterLayouting", v: afterlayouting },
      { n: "beforeLayouting", v: beforelayouting },
      { n: "failure", v: failure },
      { n: "graphReady", v: graphready },
      { n: "search", v: search },
      { n: "searchSuggest", v: searchsuggest },
      { n: "selectionChange", v: selectionchange },
      { n: "zoomChanged", v: zoomchanged },
      { n: "enableWheelZoom", v: this.boolean_abap_2_json(enablewheelzoom) },
      { n: "enableZoom", v: this.boolean_abap_2_json(enablezoom) },
      { n: "noData", v: this.boolean_abap_2_json(nodata) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  layout_algorithm() {
    return this._container({
      name: "layoutAlgorithm",
      ns: "networkgraph",
      aProp: this._filterProps([

      ]),
    });
  }

  layered_layout({ id, class: cssClass, linespacingfactor, mergeedges, nodeplacement, nodespacing } = {}) {
    return this._container({
      name: "LayeredLayout",
      ns: "nglayout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "lineSpacingFactor", v: linespacingfactor },
      { n: "nodePlacement", v: nodeplacement },
      { n: "nodeSpacing", v: nodespacing },
      { n: "mergeEdges", v: this.boolean_abap_2_json(mergeedges) },
      ]),
    });
  }

  force_based_layout({ id, class: cssClass, alpha, charge, friction, maximumduration } = {}) {
    return this._container({
      name: "ForceBasedLayout",
      ns: "nglayout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "alpha", v: alpha },
      { n: "charge", v: charge },
      { n: "friction", v: friction },
      { n: "maximumDuration", v: maximumduration },
      ]),
    });
  }

  force_directed_layout({ id, class: cssClass, cooldownstep, initialtemperature, maxiterations, maxtime, optimaldistanceconstant, staticnodes } = {}) {
    return this._container({
      name: "ForceDirectedLayout",
      ns: "nglayout",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "coolDownStep", v: cooldownstep },
      { n: "initialTemperature", v: initialtemperature },
      { n: "maxIterations", v: maxiterations },
      { n: "maxTime", v: maxtime },
      { n: "optimalDistanceConstant", v: optimaldistanceconstant },
      { n: "staticNodes", v: staticnodes },
      ]),
    });
  }

  noop_layout() {
    return this._container({
      name: "NoopLayout",
      ns: "nglayout",
      aProp: this._filterProps([

      ]),
    });
  }

  swim_lane_chain_layout() {
    return this._container({
      name: "SwimLaneChainLayout",
      ns: "nglayout",
      aProp: this._filterProps([

      ]),
    });
  }

  two_columns_layout() {
    return this._container({
      name: "TwoColumnsLayout",
      ns: "nglayout",
      aProp: this._filterProps([

      ]),
    });
  }

  attributes(args = {}) {
    return this._container({
      name: "attributes",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  element_attribute({ ns, label, value } = {}) {
    return this._container({
      name: "ElementAttribute",
      aProp: this._filterProps([
      { n: "label", v: label },
      { n: "value", v: value },
      ]),
    });
  }

  action_buttons(args = {}) {
    return this._container({
      name: "actionButtons",
      ns: this._aggNs(args),
      aProp: [],
    });
  }

  action_button({ id, class: cssClass, enabled, icon, position, title, press } = {}) {
    return this._container({
      name: "ActionButton",
      ns: "networkgraph",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "icon", v: icon },
      { n: "position", v: position },
      { n: "title", v: title },
      { n: "press", v: press },
      { n: "enabled", v: this.boolean_abap_2_json(enabled) },
      ]),
    });
  }

  routes({ id, items } = {}) {
    return this._container({
      name: "Routes",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "items", v: items },
      ]),
    });
  }

  legend_area() {
    return this._container({
      name: "legend",
      ns: "vbm",
      aProp: this._filterProps([

      ]),
    });
  }

  legenditem({ id, text, color } = {}) {
    return this._container({
      name: "LegendItem",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "text", v: text },
      { n: "color", v: color },
      ]),
    });
  }

  legend({ id, items, caption } = {}) {
    return this._container({
      name: "Legend",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "caption", v: caption },
      { n: "items", v: items },
      ]),
    });
  }

  route({ id, position, routetype, linedash, color, colorborder, linewidth } = {}) {
    return this._leaf({
      name: "Route",
      ns: "vbm",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "position", v: position },
      { n: "routetype", v: routetype },
      { n: "lineDash", v: linedash },
      { n: "linewidth", v: linewidth },
      { n: "color", v: color },
      { n: "colorBorder", v: colorborder },
      ]),
    });
  }

  column_menu({ id, class: cssClass, visible, afterclose, beforeopen } = {}) {
    return this._container({
      name: "Menu",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "afterClose", v: afterclose },
      { n: "beforeOpen", v: beforeopen },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_item({ id, class: cssClass, icon, label, resetbuttonenabled, showcancelbutton, showconfirmbutton, showresetbutton, visible, cancel, confirm, reset } = {}) {
    return this._container({
      name: "Item",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "icon", v: icon },
      { n: "label", v: label },
      { n: "cancel", v: cancel },
      { n: "confirm", v: confirm },
      { n: "reset", v: reset },
      { n: "resetButtonEnabled", v: this.boolean_abap_2_json(resetbuttonenabled) },
      { n: "showCancelButton", v: this.boolean_abap_2_json(showcancelbutton) },
      { n: "showConfirmButton", v: this.boolean_abap_2_json(showconfirmbutton) },
      { n: "showResetButton", v: this.boolean_abap_2_json(showresetbutton) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_action_item({ id, class: cssClass, icon, label, visible, press } = {}) {
    return this._container({
      name: "ActionItem",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "icon", v: icon },
      { n: "label", v: label },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_action({ id, class: cssClass, category, label, visible } = {}) {
    return this._container({
      name: "QuickAction",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "category", v: category },
      { n: "label", v: label },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_action_item({ id, class: cssClass, key, label, visible } = {}) {
    return this._container({
      name: "QuickActionItem",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "key", v: key },
      { n: "label", v: label },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_group({ id, class: cssClass, change, visible } = {}) {
    return this._container({
      name: "QuickGroup",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "change", v: change },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_group_item({ id, class: cssClass, grouped, key, label, visible } = {}) {
    return this._container({
      name: "QuickGroupItem",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "key", v: key },
      { n: "label", v: label },
      { n: "grouped", v: this.boolean_abap_2_json(grouped) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_sort({ id, class: cssClass, change, visible } = {}) {
    return this._container({
      name: "QuickSort",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "change", v: change },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_sort_item({ id, class: cssClass, sortorder, key, label, visible } = {}) {
    return this._container({
      name: "QuickSortItem",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "key", v: key },
      { n: "label", v: label },
      { n: "sortOrder", v: sortorder },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_total({ id, class: cssClass, change, visible } = {}) {
    return this._container({
      name: "QuickTotal",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "change", v: change },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  column_menu_quick_total_item({ id, class: cssClass, totaled, key, label, visible } = {}) {
    return this._container({
      name: "QuickTotalItem",
      ns: "columnmenu",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "key", v: key },
      { n: "label", v: label },
      { n: "totaled", v: this.boolean_abap_2_json(totaled) },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  micro_process_flow({ id, class: cssClass, arialabel, width, rendertype } = {}) {
    return this._container({
      name: "MicroProcessFlow",
      ns: "commons",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "renderType", v: rendertype },
      { n: "width", v: width },
      { n: "ariaLabel", v: arialabel },
      ]),
    });
  }

  micro_process_flow_item({ id, class: cssClass, icon, key, showintermediary, showseparator, state, stepwidth, title, press } = {}) {
    return this._container({
      name: "MicroProcessFlowItem",
      ns: "commons",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "press", v: press },
      { n: "title", v: title },
      { n: "stepWidth", v: stepwidth },
      { n: "state", v: state },
      { n: "key", v: key },
      { n: "icon", v: icon },
      { n: "showSeparator", v: this.boolean_abap_2_json(showseparator) },
      { n: "showIntermediary", v: this.boolean_abap_2_json(showintermediary) },
      ]),
    });
  }

  intermediary() {
    return this._container({
      name: "intermediary",
      ns: "commons",
      aProp: this._filterProps([

      ]),
    });
  }

  custom_control() {
    return this._container({
      name: "customControl",
      ns: "commons",
      aProp: this._filterProps([

      ]),
    });
  }

  responsive_scale({ id, class: cssClass, tickmarksbetweenlabels } = {}) {
    return this._container({
      name: "ResponsiveScale",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "tickmarksBetweenLabels", v: tickmarksbetweenlabels },
      ]),
    });
  }

  status_indicator({ id, class: cssClass, height, labelposition, showlabel, size, viewbox, width, visible, press, value } = {}) {
    return this._container({
      name: "StatusIndicator",
      ns: "si",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "height", v: height },
      { n: "labelPosition", v: labelposition },
      { n: "showLabel", v: this.boolean_abap_2_json(showlabel) },
      { n: "size", v: size },
      { n: "value", v: value },
      { n: "viewBox", v: viewbox },
      { n: "width", v: width },
      { n: "press", v: press },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  property_thresholds() {
    return this._container({
      name: "propertyThresholds",
      ns: "si",
      aProp: this._filterProps([

      ]),
    });
  }

  property_threshold({ id, class: cssClass, fillcolor, tovalue, arialabel, visible } = {}) {
    return this._container({
      name: "PropertyThreshold",
      ns: "si",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "ariaLabel", v: arialabel },
      { n: "fillColor", v: fillcolor },
      { n: "toValue", v: tovalue },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  shape_group() {
    return this._container({
      name: "ShapeGroup",
      ns: "si",
      aProp: this._filterProps([

      ]),
    });
  }

  library_shape({ id, class: cssClass, animationonchange, definition, fillcolor, fillingangle, fillingdirection, fillingtype, height, horizontalalignment, shapeid, strokecolor, strokewidth, verticalalignment, visible, width, x, y, aftershapeloaded } = {}) {
    return this._container({
      name: "LibraryShape",
      ns: "si",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "animationOnChange", v: this.boolean_abap_2_json(animationonchange) },
      { n: "definition", v: definition },
      { n: "fillColor", v: fillcolor },
      { n: "fillingAngle", v: fillingangle },
      { n: "fillingDirection", v: fillingdirection },
      { n: "fillingType", v: fillingtype },
      { n: "height", v: height },
      { n: "horizontalAlignment", v: horizontalalignment },
      { n: "shapeId", v: shapeid },
      { n: "strokeColor", v: strokecolor },
      { n: "strokeWidth", v: strokewidth },
      { n: "verticalAlignment", v: verticalalignment },
      { n: "width", v: width },
      { n: "x", v: x },
      { n: "y", v: y },
      { n: "afterShapeLoaded", v: aftershapeloaded },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      ]),
    });
  }

  tile_info({ id, class: cssClass, backgroundcolor, bordercolor, src, text, textcolor } = {}) {
    return this._container({
      name: "TileInfo",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "backgroundColor", v: backgroundcolor },
      { n: "borderColor", v: bordercolor },
      { n: "src", v: src },
      { n: "text", v: text },
      { n: "textColor", v: textcolor },
      ]),
    });
  }

  side_navigation({ id, class: cssClass, selectedkey } = {}) {
    return this._container({
      name: "SideNavigation",
      ns: "tnt",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "class", v: cssClass },
      { n: "selectedKey", v: selectedkey },
      ]),
    });
  }

  navigation_list() {
    return this._container({
      name: "NavigationList",
      ns: "tnt",
      aProp: this._filterProps([

      ]),
    });
  }

  navigation_list_item({ text, icon, select, href, key } = {}) {
    return this._leaf({
      name: "NavigationListItem",
      ns: "tnt",
      aProp: this._filterProps([
      { n: "text", v: text },
      { n: "icon", v: icon },
      { n: "href", v: href },
      { n: "key", v: key },
      { n: "select", v: select },
      ]),
    });
  }

  fixed_item() {
    return this._container({
      name: "fixedItem",
      ns: "tnt",
      aProp: this._filterProps([

      ]),
    });
  }

  viz_frame({ id, legendvisible, vizcustomizations, vizproperties, vizscales, viztype, height, width, uiconfig, visible, selectdata } = {}) {
    return this._container({
      name: "VizFrame",
      ns: "viz",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "legendVisible", v: legendvisible },
      { n: "vizCustomizations", v: vizcustomizations },
      { n: "vizProperties", v: vizproperties },
      { n: "vizScales", v: vizscales },
      { n: "vizType", v: viztype },
      { n: "height", v: height },
      { n: "width", v: width },
      { n: "uiConfig", v: uiconfig },
      { n: "visible", v: this.boolean_abap_2_json(visible) },
      { n: "selectData", v: selectdata },
      ]),
    });
  }

  viz_dataset() {
    return this._container({
      name: "dataset",
      ns: "viz",
      aProp: this._filterProps([

      ]),
    });
  }

  viz_flattened_dataset({ data } = {}) {
    return this._container({
      name: "FlattenedDataset",
      ns: "viz.data",
      aProp: this._filterProps([
      { n: "data", v: data },
      ]),
    });
  }

  viz_dimensions() {
    return this._container({
      name: "dimensions",
      ns: "viz.data",
      aProp: this._filterProps([

      ]),
    });
  }

  viz_dimension_definition({ axis, datatype, displayvalue, identity, name, sorter, value } = {}) {
    return this._container({
      name: "DimensionDefinition",
      ns: "viz.data",
      aProp: this._filterProps([
      { n: "axis", v: axis },
      { n: "dataType", v: datatype },
      { n: "displayValue", v: displayvalue },
      { n: "identity", v: identity },
      { n: "name", v: name },
      { n: "sorter", v: sorter },
      { n: "value", v: value },
      ]),
    });
  }

  viz_measures() {
    return this._container({
      name: "measures",
      ns: "viz.data",
      aProp: this._filterProps([

      ]),
    });
  }

  viz_measure_definition({ format, group, identity, name, range, unit, value } = {}) {
    return this._container({
      name: "MeasureDefinition",
      ns: "viz.data",
      aProp: this._filterProps([
      { n: "format", v: format },
      { n: "group", v: group },
      { n: "identity", v: identity },
      { n: "name", v: name },
      { n: "range", v: range },
      { n: "unit", v: unit },
      { n: "value", v: value },
      ]),
    });
  }

  viz_feeds() {
    return this._container({
      name: "feeds",
      ns: "viz",
      aProp: this._filterProps([

      ]),
    });
  }

  viz_feed_item({ id, uid, type, values } = {}) {
    return this._container({
      name: "FeedItem",
      ns: "viz.feeds",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "uid", v: uid },
      { n: "type", v: type },
      { n: "values", v: values },
      ]),
    });
  }

  smart_multi_input({ id, entityset, supportranges, enableodataselect, requestatleastfields, singletokenmode, supportmultiselect, textseparator, textlabel, tooltiplabel, textineditmodesource, mandatory, maxlength, value } = {}) {
    return this._container({
      name: "SmartMultiInput",
      ns: "smi",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "value", v: value },
      { n: "entitySet", v: entityset },
      { n: "supportRanges", v: supportranges },
      { n: "enableODataSelect", v: enableodataselect },
      { n: "requestAtLeastFields", v: requestatleastfields },
      { n: "singleTokenMode", v: singletokenmode },
      { n: "supportMultiSelect", v: supportmultiselect },
      { n: "textSeparator", v: textseparator },
      { n: "textLabel", v: textlabel },
      { n: "tooltipLabel", v: tooltiplabel },
      { n: "textInEditModeSource", v: textineditmodesource },
      { n: "mandatory", v: mandatory },
      { n: "maxLength", v: maxlength },
      ]),
    });
  }

  row_settings({ highlight, highlighttext, navigated } = {}) {
    return this._container({
      name: "RowSettings",
      ns: "table",
      aProp: this._filterProps([
      { n: "highlight", v: highlight },
      { n: "highlightText", v: highlighttext },
      { n: "navigated", v: this.boolean_abap_2_json(navigated) },
      ]),
    });
  }

  image_editor({ id, customshapesrc, keepcropaspectratio, keepresizeaspectratio, scalecroparea, customshapesrctype, src } = {}) {
    return this._container({
      name: "ImageEditor",
      ns: "ie",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "customShapeSrc", v: customshapesrc },
      { n: "keepCropAspectRatio", v: this.boolean_abap_2_json(keepcropaspectratio) },
      { n: "keepResizeAspectRatio", v: this.boolean_abap_2_json(keepresizeaspectratio) },
      { n: "scaleCropArea", v: scalecroparea },
      { n: "customShapeSrcType", v: customshapesrctype },
      { n: "src", v: src },
      ]),
    });
  }

  image_editor_container({ id, enabledbuttons, mode } = {}) {
    return this._container({
      name: "ImageEditorContainer",
      ns: "ie",
      aProp: this._filterProps([
      { n: "id", v: id },
      { n: "enabledButtons", v: enabledbuttons },
      { n: "mode", v: mode },
      ]),
    });
  }
}

// ---------------------------------------------------------------------------
// abap PREFERRED PARAMETER semantics: `page(\`Home\`)` ≡ `page({ title: \`Home\` })`.
// abap callers (and code transpiled 1:1 from abap) pass the preferred
// parameter positionally; the JS methods destructure an options object.
// This shim maps a primitive positional argument onto the preferred name.
// Generated from z2ui5_cl_xml_view.clas.abap — regenerate with:
//   node tools/scripts/abap2js.js --preferred-map <path/to/z2ui5_cl_xml_view.clas.abap>
// ---------------------------------------------------------------------------
z2ui5_cl_xml_view.PREFERRED_PARAM = {
    _cc_plain_xml: `val`,
    _generic_property: `val`,
    action_buttons: `ns`,
    actions: `ns`,
    analytical_column: `ns`,
    attributes: `ns`,
    calendar_appointment: `startdate`,
    calendar_legend_item: `text`,
    carousel_layout: `visiblepagescount`,
    checkbox: `selected`,
    column: `width`,
    columns: `ns`,
    content: `ns`,
    content_areas: `ns`,
    custom_data: `ns`,
    custom_layout: `ns`,
    date_picker: `value`,
    date_range_selection: `value`,
    date_time_picker: `value`,
    dependents: `ns`,
    dialog: `title`,
    drag_drop_config: `ns`,
    drag_info: `sourceaggregation`,
    dynamic_page_header: `pinnable`,
    dynamic_side_content: `id`,
    expanded_content: `ns`,
    fix_content: `ns`,
    flex_content: `ns`,
    footer: `ns`,
    formatted_text: `htmltext`,
    get: `name`,
    get_child: `index`,
    grid: `default_span`,
    grid_data: `span`,
    groups: `ns`,
    header: `ns`,
    header_content: `ns`,
    heading: `ns`,
    html: `content`,
    image_editor: `src`,
    info_label: `text`,
    input: `value`,
    input_list_item: `label`,
    items: `ns`,
    label: `text`,
    layout_data: `ns`,
    legend: `items`,
    legenditem: `text`,
    lines: `ns`,
    list: `items`,
    markers: `ns`,
    message_strip: `text`,
    mid_column_pages: `id`,
    no_data: `ns`,
    nodes: `ns`,
    p_cell_selector: `id`,
    page: `title`,
    planning_calendar: `rows`,
    planning_calendar_legend: `items`,
    planning_calendar_row: `appointments`,
    proportion_zoom_strategy: `zoomlevel`,
    routes: `items`,
    rowmode: `ns`,
    scroll_container: `height`,
    segmented_button: `selected_key`,
    side_content: `width`,
    simple_form: `title`,
    snapped_content: `ns`,
    spots: `items`,
    statuses: `ns`,
    sub_header: `ns`,
    table: `items`,
    template_elseif: `test`,
    template_if: `test`,
    text: `text`,
    text_area: `value`,
    time_picker: `value`,
    title: `text`,
    tokens: `ns`,
    tree: `items`,
    ui_column: `width`,
    ui_table: `rows`,
    vbox: `class`,
    viz_flattened_dataset: `data`,
};

for (const [meth, param] of Object.entries(z2ui5_cl_xml_view.PREFERRED_PARAM)) {
  const orig = z2ui5_cl_xml_view.prototype[meth];
  if (typeof orig !== "function") continue;
  z2ui5_cl_xml_view.prototype[meth] = function (args, ...rest) {
    if (args != null && typeof args !== "object") args = { [param]: args };
    return orig.call(this, args, ...rest);
  };
}

module.exports = z2ui5_cl_xml_view;
