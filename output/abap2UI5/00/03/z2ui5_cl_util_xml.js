
class z2ui5_cl_util_xml {
  mv_name = ``;
  mv_ns = ``;
  mt_prop = [];
  mo_root = null;
  mo_previous = null;
  mo_parent = null;
  mt_child = null;

  constructor() {
  }

  static factory() {
    let result = null;
    result = new z2ui5_cl_util_xml();
    result.mo_root = result;
    result.mo_parent = result;
    return result;
  }

  __({ n, ns, a, v, p } = {}) {
    let result = null;
    const lo_child = new z2ui5_cl_util_xml();
    lo_child.mv_name = n;
    lo_child.mv_ns = ns;
    lo_child.mt_prop = p;
    if (a) {
      lo_child.mt_prop.push({ n: a, v: v });
    }
    lo_child.mo_parent = this;
    lo_child.mo_root = this.mo_root;
    this.mt_child.push(lo_child);
    this.mo_root.mo_previous = lo_child;
    result = lo_child;
    return result;
  }

  _({ n, ns, a, v, p } = {}) {
    let result = null;
    result = this;
    this.__({ n, ns, a, v, p });
    return result;
  }

  _if({ when, n, ns, a, v, p } = {}) {
    let result = null;
    if (when === true) {
      this.__({ n, ns, a, v, p });
    }
    result = this;
    return result;
  }

  __if({ when, n, ns, a, v, p } = {}) {
    let result = null;
    if (when === true) {
      result = this.__({ n, ns, a, v, p });
    } else {
      result = this;
    }
    return result;
  }

  p({ n, v } = {}) {
    let result = null;
    this.mt_prop.push({ n: n, v: v });
    result = this;
    return result;
  }

  n({ name } = {}) {
    let result = null;
    if (!name) {
      result = this.mo_parent;
      return result;
    }
    if (this.mo_parent.mv_name === name) {
      result = this.mo_parent;
    } else if (this === this.mo_root) {
      result = this;
    } else {
      result = this.mo_parent.n(name);
    }
    return result;
  }

  n_prev() {
    let result = null;
    result = this.mo_root.mo_previous;
    return result;
  }

  n_root() {
    let result = null;
    result = this.mo_root;
    return result;
  }

  stringify({ from_root = true, indent = false } = {}) {
    let result = ``;
    let lt_parts = [];
    if (indent === true) {
      if (from_root === true) {
        this.mo_root.xml_get_parts_indent(/* TODO(abap2js): out-params */ CHANGING ct_parts = lt_parts);
      } else {
        this.xml_get_parts_indent({ iv_depth: /* TODO(abap2js): out-params */ CHANGING ct_parts = lt_parts });
      }
      result = lt_parts.join(`\\n`);
    } else {
      if (from_root === true) {
        this.mo_root.xml_get_parts(/* TODO(abap2js): out-params */ CHANGING ct_parts = lt_parts);
      } else {
        this.xml_get_parts(/* TODO(abap2js): out-params */ CHANGING ct_parts = lt_parts);
      }
      result = /* TODO(abap2js) */ concat_lines_of(lt_parts);
    }
    return result;
  }

  xml_get_parts() {
    if (!this.mv_name) {
      let sy_tabix = 0;
      for (const lr_root of this.mt_child) {
        sy_tabix++;
        (lr_root).xml_get_parts(/* TODO(abap2js): out-params */ CHANGING ct_parts = ct_parts);
      }
      return;
    }
    const lv_tmp2 = (this.mv_ns !== `` ? `${this.mv_ns}:` : null);
    const lv_tmp3 = /* TODO(abap2js): REDUCE */ null;
    if (!this.mt_child) {
      ct_parts.push(` <${lv_tmp2}${this.mv_name}${lv_tmp3}/>`);
      return;
    }
    ct_parts.push(` <${lv_tmp2}${this.mv_name}${lv_tmp3}>`);
    let sy_tabix = 0;
    for (const lr_child of this.mt_child) {
      sy_tabix++;
      (lr_child).xml_get_parts(/* TODO(abap2js): out-params */ CHANGING ct_parts = ct_parts);
    }
    ct_parts.push(`</${lv_tmp2}${this.mv_name}>`);
  }

  xml_get_parts_indent({ iv_depth = 0 } = {}) {
    if (!this.mv_name) {
      let sy_tabix = 0;
      for (const lr_root of this.mt_child) {
        sy_tabix++;
        (lr_root)
          .xml_get_parts_indent(/* TODO(abap2js): out-params */ EXPORTING iv_depth = iv_depth CHANGING ct_parts = ct_parts);
      }
      return;
    }
    const lv_pad = ` `.repeat(iv_depth * 2);
    const lv_ns = (this.mv_ns !== `` ? `${this.mv_ns}:` : null);
    const lv_attr = /* TODO(abap2js): REDUCE */ null;
    if (!this.mt_child) {
      ct_parts.push(`${lv_pad}<${lv_ns}${this.mv_name}${lv_attr}/>`);
      return;
    }
    ct_parts.push(`${lv_pad}<${lv_ns}${this.mv_name}${lv_attr}>`);
    let sy_tabix = 0;
    for (const lr_child of this.mt_child) {
      sy_tabix++;
      (lr_child)
        .xml_get_parts_indent(/* TODO(abap2js): out-params */ EXPORTING iv_depth = iv_depth + 1 CHANGING ct_parts = ct_parts);
    }
    ct_parts.push(`${lv_pad}</${lv_ns}${this.mv_name}>`);
  }
}

module.exports = z2ui5_cl_util_xml;
