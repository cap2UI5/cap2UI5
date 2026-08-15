
class z2ui5_cl_ui5_view_builder {
  name = ``;
  prefix = ``;
  t_pair = [];
  t_child = [];
  parent = null;
  root = null;

  static factory() {
    let result = null;
    result = new z2ui5_cl_ui5_view_builder();
    result.root = z2ui5_cl_util.abap_tab_assign(result.root, z2ui5_cl_util.abap_copy(result));
    return result;
  }

  ele({ n, ns = `` } = {}) {
    let result = null;
    result = new z2ui5_cl_ui5_view_builder();
    result.root = this.root;
    result.parent = z2ui5_cl_util.abap_tab_assign(result.parent, z2ui5_cl_util.abap_copy(this));
    result.name = z2ui5_cl_util.abap_tab_assign(result.name, z2ui5_cl_util.abap_copy(n));
    result.prefix = z2ui5_cl_util.abap_tab_assign(result.prefix, z2ui5_cl_util.abap_copy(ns));
    this.t_child.push(z2ui5_cl_util.abap_copy(result));
    return result;
  }

  tag({ n, ns = `` } = {}) {
    let result = null;
    this.ele({ n, ns });
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(this));
    return result;
  }

  a({ n, v = ``, b } = {}) {
    let result = null;
    let target;
    if (!(!z2ui5_cl_util.abap_is_initial(this.name) || !z2ui5_cl_util.abap_is_initial(this.t_child))) throw new Error(`ASSERT failed`);
    let val = z2ui5_cl_util.abap_copy(v);
    if (b !== undefined) {
      if (!(z2ui5_cl_util.abap_is_initial(v))) throw new Error(`ASSERT failed`);
      val = ((b === true || b === `X`) ? `true` : `false`);
    }
    if (z2ui5_cl_util.abap_is_initial(this.t_child)) {
      if (!(!this.t_pair.some((row) => row.n === n))) throw new Error(`ASSERT failed`);
      this.t_pair.push(z2ui5_cl_util.abap_copy({ n: n, v: val }));
    } else {
      target = z2ui5_cl_util.abap_copy(this.t_child[(this.t_child.length) - 1]);
      if (!(!target.t_pair.some((row) => row.n === n))) throw new Error(`ASSERT failed`);
      target.t_pair.push(z2ui5_cl_util.abap_copy({ n: n, v: val }));
    }
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(this));
    return result;
  }

  end() {
    let result = null;
    if (!(this.parent != null)) throw new Error(`ASSERT failed`);
    result = this.parent;
    return result;
  }

  render() {
    let result = ``;
    let sy_tabix = 0;
    let lt_inner = [];
    sy_tabix = 0;
    for (const child of this.t_child) {
      sy_tabix++;
      lt_inner.push(z2ui5_cl_util.abap_copy(child.render()));
    }
    const inner = lt_inner.join(``);
    if (z2ui5_cl_util.abap_is_initial(this.name)) {
      result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(inner));
      return result;
    }
    const qname = (z2ui5_cl_util.abap_is_initial(this.prefix) ? this.name : `${this.prefix}:${this.name}`);
    let attrs = ``;
    sy_tabix = 0;
    for (const pair of this.t_pair) {
      sy_tabix++;
      attrs = `${attrs} ${pair.n}="${this.xml_escape({ val: pair.v })}"`;
    }
    if (z2ui5_cl_util.abap_is_initial(this.t_child)) {
      result = `<${qname}${attrs}/>`;
    } else {
      result = `<${qname}${attrs}>${inner}</${qname}>`;
    }
    return result;
  }

  xml_escape({ val } = {}) {
    let result = ``;
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(val));
    result = result.replaceAll(`&`, `&amp;`);
    result = result.replaceAll(`<`, `&lt;`);
    result = result.replaceAll(`>`, `&gt;`);
    result = result.replaceAll(`"`, `&quot;`);
    result = result.replaceAll(z2ui5_cl_ui5_util_context.cv_char_util_newline, `&#xA;`);
    result = result.replaceAll(String(z2ui5_cl_ui5_util_context.cv_char_util_cr_lf).substr(0, 1), `&#xD;`);
    result = result.replaceAll(z2ui5_cl_ui5_util_context.cv_char_util_horizontal_tab, `&#x9;`);
    return result;
  }

  stringify() {
    let result = ``;
    result = this.root.render();
    return result;
  }
}

module.exports = z2ui5_cl_ui5_view_builder;

const z2ui5_cl_ui5_util_context = require("abap2UI5/z2ui5_cl_ui5_util_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("abap2UI5/z2ui5_pop_preferred_param")(z2ui5_cl_ui5_view_builder, {
  ele: { preferred: `n`, params: [`n`, `ns`] },
  tag: { preferred: `n`, params: [`n`, `ns`] },
  a: { preferred: `n`, params: [`n`, `v`, `b`] },
  xml_escape: { preferred: `val`, params: [`val`] },
});

