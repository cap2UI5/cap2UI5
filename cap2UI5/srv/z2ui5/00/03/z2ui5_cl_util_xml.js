/**
 * z2ui5_cl_util_xml — JS port of abap2UI5 z2ui5_cl_util_xml.
 *
 * Fluent XML builder. Mirrors the ABAP API exactly:
 *
 *   const root = z2ui5_cl_util_xml.factory();
 *   root.__("Page", { p: [{n: "title", v: "Hello"}] })
 *       ._("Button", { a: "text", v: "Click me" })
 *       .n("Page")
 *       ._("Footer");
 *   const xml = root.stringify();
 *
 * Method semantics:
 *   __  — append child + descend into it
 *   _   — append child without descending (returns self)
 *   _if / __if — conditional variants
 *   p(n,v) — add an attribute to the current element
 *   n(name?) — climb up; with no name returns parent, otherwise climbs until
 *              a parent with that name, falling back to root.
 *   n_prev — last node added anywhere in the tree
 *   n_root — the synthetic root holder
 *   stringify({ from_root, indent }) — serialise
 */
class z2ui5_cl_util_xml {

  // Constructor matches abap CREATE PROTECTED — use factory().
  constructor() {
    this.mv_name = ``;
    this.mv_ns   = ``;
    this.mt_prop = [];                 // [{n, v}]
    this.mo_root     = null;
    this.mo_previous = null;
    this.mo_parent   = null;
    this.mt_child    = [];             // [z2ui5_cl_util_xml]
  }

  static factory() {
    const r = new z2ui5_cl_util_xml();
    r.mo_root   = r;
    r.mo_parent = r;
    return r;
  }

  /** Append child + descend. */
  __({ n, ns = ``, a = ``, v = ``, p = [] } = {}) {
    if (typeof arguments[0] === `string`) {
      // overload: __("name", {…}) — convenience JS form
      const name = arguments[0];
      const opts = arguments[1] || {};
      return this.__({ n: name, ns: opts.ns, a: opts.a, v: opts.v, p: opts.p });
    }
    const child = new z2ui5_cl_util_xml();
    child.mv_name   = n;
    child.mv_ns     = ns;
    child.mt_prop   = Array.isArray(p) ? p.slice() : [];
    if (a) child.mt_prop.push({ n: a, v });
    child.mo_parent = this;
    child.mo_root   = this.mo_root;
    this.mt_child.push(child);
    this.mo_root.mo_previous = child;
    return child;
  }

  /** Append child without descending. */
  _({ n, ns = ``, a = ``, v = ``, p = [] } = {}) {
    if (typeof arguments[0] === `string`) {
      const name = arguments[0];
      const opts = arguments[1] || {};
      return this._({ n: name, ns: opts.ns, a: opts.a, v: opts.v, p: opts.p });
    }
    this.__({ n, ns, a, v, p });
    return this;
  }

  /** Conditional descend variant of __. */
  _if(when, opts) {
    if (when) return this.__(opts);
    return this;
  }

  /** Conditional non-descend variant of _. */
  __if(when, opts) {
    if (when) this._(opts);
    return this;
  }

  /** Add attribute to current node. */
  p(n, v) {
    this.mt_prop.push({ n, v });
    return this;
  }

  /** Climb up; with no name → parent. With name → walk parents until match. */
  n(name) {
    if (!name) return this.mo_parent || this;
    if (this.mo_parent?.mv_name === name) return this.mo_parent;
    if (this === this.mo_root) return this;
    return this.mo_parent.n(name);
  }

  n_prev() { return this.mo_root?.mo_previous || null; }
  n_root() { return this.mo_root; }

  stringify({ from_root = true, indent = false } = {}) {
    const target = from_root && this.mo_root ? this.mo_root : this;
    const parts = [];
    if (indent) {
      target._xml_get_parts_indent(0, parts);
      return parts.join(`\n`);
    }
    target._xml_get_parts(parts);
    return parts.join(``);
  }

  // --- internals ---

  _xml_get_parts(parts) {
    if (!this.mv_name) {
      for (const c of this.mt_child) c._xml_get_parts(parts);
      return;
    }
    const ns   = this.mv_ns ? `${this.mv_ns}:` : ``;
    const attr = z2ui5_cl_util_xml._build_attrs(this.mt_prop);
    if (this.mt_child.length === 0) {
      parts.push(` <${ns}${this.mv_name}${attr}/>`);
      return;
    }
    parts.push(` <${ns}${this.mv_name}${attr}>`);
    for (const c of this.mt_child) c._xml_get_parts(parts);
    parts.push(`</${ns}${this.mv_name}>`);
  }

  _xml_get_parts_indent(depth, parts) {
    if (!this.mv_name) {
      for (const c of this.mt_child) c._xml_get_parts_indent(depth, parts);
      return;
    }
    const pad  = ` `.repeat(depth * 2);
    const ns   = this.mv_ns ? `${this.mv_ns}:` : ``;
    const attr = z2ui5_cl_util_xml._build_attrs(this.mt_prop);
    if (this.mt_child.length === 0) {
      parts.push(`${pad}<${ns}${this.mv_name}${attr}/>`);
      return;
    }
    parts.push(`${pad}<${ns}${this.mv_name}${attr}>`);
    for (const c of this.mt_child) c._xml_get_parts_indent(depth + 1, parts);
    parts.push(`${pad}</${ns}${this.mv_name}>`);
  }

  static _build_attrs(props) {
    let out = ``;
    // Skip empties — abap impl does WHERE ( v <> `` ).
    // ABAP also escapes for cl_abap_format=>e_xml_attr. We match the same set
    // (& < > " '), and convert abap_true → "true".
    for (const row of props) {
      if (row?.v === undefined || row?.v === null || row?.v === ``) continue;
      const v = row.v === true ? `true` : String(row.v);
      out += ` ${row.n}="${z2ui5_cl_util_xml._xml_attr_escape(v)}"`;
    }
    return out;
  }

  static _xml_attr_escape(s) {
    return String(s)
      .replace(/&/g,  `&amp;`)
      .replace(/</g,  `&lt;`)
      .replace(/>/g,  `&gt;`)
      .replace(/"/g,  `&quot;`)
      .replace(/'/g,  `&apos;`);
  }
}

module.exports = z2ui5_cl_util_xml;
