// Hand-port of z2ui5_cx_ajson_error (upstream zcx_ajson_error clone).
// ABAP semantics kept: raise() builds the instance, stamps the location and
// throws; set_location chunks "<message> @<location>" into the four 50-char
// t100 attributes a1..a4 (MOVE of a string into ty_message_parts); get_text
// (if_message) renders those chunks back into the display text.

const cx_static_check = class {};

class z2ui5_cx_ajson_error extends cx_static_check {
  static zcx_ajson_error = { msgid: `00`, msgno: `001`, attr1: `A1`, attr2: `A2`, attr3: `A3`, attr4: `A4` };

  rc = null;
  message = ``;
  location = ``;
  a1 = null;
  a2 = null;
  a3 = null;
  a4 = null;

  constructor({ textid, previous, rc, message, location, a1, a2, a3, a4 } = {}) {
    super();
    this.previous = previous ?? null;
    this.rc = rc;
    this.message = message ?? ``;
    this.location = location ?? ``;
    this.a1 = a1;
    this.a2 = a2;
    this.a3 = a3;
    this.a4 = a4;
    this.textid = null;
    if (!textid) {
      this.t100key = z2ui5_cx_ajson_error.zcx_ajson_error;
    } else {
      this.t100key = textid;
    }
  }

  // transpiled callers pass a lone positional message (raise('…')) as well
  // as the named form — accept both
  static raise(arg = {}) {
    const { iv_msg, iv_location, is_node } = typeof arg === "string" ? { iv_msg: arg } : arg;
    const lx = new z2ui5_cx_ajson_error({ message: iv_msg });
    lx.set_location({ iv_location, is_node });
    throw lx;
  }

  set_location(arg = {}) {
    // positional string (set_location('loc')) and named form both occur
    const { iv_location, is_node } = typeof arg === "string" ? { iv_location: arg } : arg;
    let lv_location = ``;
    if (iv_location) {
      lv_location = iv_location;
    } else if (is_node) {
      const path = is_node.path ?? is_node.PATH;
      const name = is_node.name ?? is_node.NAME;
      if (path != null && name != null) {
        lv_location = `${path}${name}`;
      }
    }
    const lv_tmp = lv_location ? `${this.message} @${lv_location}` : `${this.message}`;
    this.location = lv_location;
    // ls_msg = lv_tmp: a string MOVEd into ty_message_parts (4 × symsgv-like
    // 50-char components) splits into consecutive 50-char chunks
    this.a1 = lv_tmp.slice(0, 50);
    this.a2 = lv_tmp.slice(50, 100);
    this.a3 = lv_tmp.slice(100, 150);
    this.a4 = lv_tmp.slice(150, 200);
  }

  // if_message~get_text: the t100 message rendered from attrs a1..a4
  get_text() {
    return `${this.a1 ?? ``}${this.a2 ?? ``}${this.a3 ?? ``}${this.a4 ?? ``}`;
  }
}

module.exports = z2ui5_cx_ajson_error;
