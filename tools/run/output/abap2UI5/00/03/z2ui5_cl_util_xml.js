const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

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
    result.mo_root = z2ui5_cl_util.abap_copy(result);
    result.mo_parent = z2ui5_cl_util.abap_copy(result);
    return result;
  }

  __({ n, ns, a, v, p } = {}) {
    let result = null;
    const lo_child = new z2ui5_cl_util_xml();
    lo_child.mv_name = z2ui5_cl_util.abap_copy(n);
    lo_child.mv_ns = false /* TODO(abap2js): NS */;
    lo_child.mt_prop = z2ui5_cl_util.abap_copy(p);
    if (a) {
      lo_child.mt_prop.push({ n: a, v: v });
    }
    lo_child.mo_parent = z2ui5_cl_util.abap_copy(this);
    lo_child.mo_root = z2ui5_cl_util.abap_copy(this.mo_root);
    this.mt_child.push(lo_child);
    this.mo_root.mo_previous = z2ui5_cl_util.abap_copy(lo_child);
    result = z2ui5_cl_util.abap_copy(lo_child);
    return result;
  }

  _({ n, ns, a, v, p } = {}) {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this);
    this.__({ n, ns: false /* TODO(abap2js): NS */, a, v, p });
    return result;
  }

  _if({ when, n, ns, a, v, p } = {}) {
    let result = null;
    if ((when === true || when === `X`)) {
      this.__({ n, ns: false /* TODO(abap2js): NS */, a, v, p });
    }
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  __if({ when, n, ns, a, v, p } = {}) {
    let result = null;
    if ((when === true || when === `X`)) {
      result = this.__({ n, ns: false /* TODO(abap2js): NS */, a, v, p });
    } else {
      result = z2ui5_cl_util.abap_copy(this);
    }
    return result;
  }

  p({ n, v } = {}) {
    let result = null;
    this.mt_prop.push({ n: n, v: v });
    result = z2ui5_cl_util.abap_copy(this);
    return result;
  }

  n({ name } = {}) {
    let result = null;
    if (!name) {
      result = z2ui5_cl_util.abap_copy(this.mo_parent);
      return result;
    }
    if (this.mo_parent.mv_name === name) {
      result = z2ui5_cl_util.abap_copy(this.mo_parent);
    } else if (this === this.mo_root) {
      result = z2ui5_cl_util.abap_copy(this);
    } else {
      result = this.mo_parent.n(name);
    }
    return result;
  }

  n_prev() {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_root.mo_previous);
    return result;
  }

  n_root() {
    let result = null;
    result = z2ui5_cl_util.abap_copy(this.mo_root);
    return result;
  }

  stringify({ from_root = true, indent = false } = {}) {
    let result = ``;
    let lt_parts = [];
    if ((indent === true || indent === `X`)) {
      if ((from_root === true || from_root === `X`)) {
        this.mo_root.xml_get_parts_indent({ ct_parts: lt_parts });
      } else {
        this.xml_get_parts_indent({ iv_depth: { ct_parts: lt_parts } });
      }
      result = lt_parts.join(` `);
    } else {
      if ((from_root === true || from_root === `X`)) {
        this.mo_root.xml_get_parts({ ct_parts: lt_parts });
      } else {
        this.xml_get_parts({ ct_parts: { ct_parts: lt_parts } });
      }
      result = /* TODO(abap2js) */ concat_lines_of(lt_parts);
    }
    return result;
  }

  xml_get_parts({ ct_parts } = {}) {
    let sy_tabix = 0;
    if (!this.mv_name) {
      sy_tabix = 0;
      for (const lr_root of this.mt_child) {
        sy_tabix++;
        (lr_root).xml_get_parts({ ct_parts });
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
    sy_tabix = 0;
    for (const lr_child of this.mt_child) {
      sy_tabix++;
      (lr_child).xml_get_parts({ ct_parts });
    }
    ct_parts.push(`</${lv_tmp2}${this.mv_name}>`);
  }

  xml_get_parts_indent({ iv_depth = 0, ct_parts } = {}) {
    let sy_tabix = 0;
    if (!this.mv_name) {
      sy_tabix = 0;
      for (const lr_root of this.mt_child) {
        sy_tabix++;
        (lr_root).xml_get_parts_indent({ iv_depth, ct_parts });
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
    sy_tabix = 0;
    for (const lr_child of this.mt_child) {
      sy_tabix++;
      (lr_child).xml_get_parts_indent({ iv_depth: iv_depth + 1, ct_parts });
    }
    ct_parts.push(`${lv_pad}</${lv_ns}${this.mv_name}>`);
  }
}

module.exports = z2ui5_cl_util_xml;
