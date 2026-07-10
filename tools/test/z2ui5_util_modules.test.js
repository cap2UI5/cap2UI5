// Tests for the abap2UI5-mirrored util modules added in the CAP port.
// Each block exercises the same surface the abap test classes hit.

const z2ui5_cl_util       = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util");
const z2ui5_cl_util_log   = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_log");
const z2ui5_cl_util_msg   = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_msg");
const z2ui5_cl_util_range = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_range");
const z2ui5_cl_util_xml   = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_xml");
const z2ui5_cl_util_http  = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cl_util_http");
const z2ui5_cx_util_error = require("../../cap2UI5/srv/z2ui5/00/03/z2ui5_cx_util_error");
const z2ui5_cl_util_db    = require("../../cap2UI5/srv/z2ui5/00/03/01/z2ui5_cl_util_db");
const z2ui5_cl_util_api   = require("../../cap2UI5/srv/z2ui5/00/03/02/z2ui5_cl_util_api");

const z2ui5_if_client     = require("../../cap2UI5/srv/z2ui5/02/z2ui5_if_client");
const z2ui5_if_exit       = require("../../cap2UI5/srv/z2ui5/02/z2ui5_if_exit");
const z2ui5_cl_exit       = require("../../cap2UI5/srv/z2ui5/02/z2ui5_cl_exit");

const { firstSampleName } = require("./helpers/samples");

// A representative sample app, picked dynamically so the rtti checks track
// the mirrored samples set instead of a hardcoded class name.
const SAMPLE = firstSampleName();

// =============================================================
//  z2ui5_cl_util — string / url / boolean / itab / range / time
// =============================================================
describe("z2ui5_cl_util", () => {
  test("c_* string helpers", () => {
    expect(z2ui5_cl_util.c_trim("  ab  ")).toBe("ab");
    expect(z2ui5_cl_util.c_trim_upper("  ab  ")).toBe("AB");
    expect(z2ui5_cl_util.c_trim_lower("  AB  ")).toBe("ab");
    expect(z2ui5_cl_util.c_contains("hello", "ell")).toBe(true);
    expect(z2ui5_cl_util.c_starts_with("hello", "he")).toBe(true);
    expect(z2ui5_cl_util.c_ends_with("hello", "lo")).toBe(true);
    expect(z2ui5_cl_util.c_split("a,b,c", ",")).toEqual(["a", "b", "c"]);
    expect(z2ui5_cl_util.c_join(["a", "b"], "-")).toBe("a-b");
  });

  test("boolean abap_2_json maps abap_true → 'X'", () => {
    expect(z2ui5_cl_util.boolean_abap_2_json(true)).toBe("X");
    expect(z2ui5_cl_util.boolean_abap_2_json("X")).toBe("X");
    expect(z2ui5_cl_util.boolean_abap_2_json(false)).toBe("");
    expect(z2ui5_cl_util.boolean_abap_2_json("")).toBe("");
  });

  test("rtti_get_class finds classes in the bundled samples folder", () => {
    // only the top-level samples of the upstream src/ are mirrored, so the
    // bundled tree under srv/app/samples is flat.
    const Cls = z2ui5_cl_util.rtti_get_class(SAMPLE);
    expect(typeof Cls).toBe("function");
    expect(z2ui5_cl_util.rtti_check_class_exists(SAMPLE)).toBe(true);
    expect(z2ui5_cl_util.rtti_get_class("z2ui5_cl_does_not_exist")).toBeNull();
  });

  test("rtti_get_classes_impl_intf sees bundled sample classes", () => {
    const z2ui5_if_app = require("../../cap2UI5/srv/z2ui5/02/z2ui5_if_app");
    const names = z2ui5_cl_util.rtti_get_classes_impl_intf(z2ui5_if_app).map((r) => r.classname);
    expect(names).toContain(SAMPLE);
  });

  test("rtti_get_type_kind classification", () => {
    expect(z2ui5_cl_util.rtti_get_type_kind([])).toBe("TABLE");
    expect(z2ui5_cl_util.rtti_get_type_kind("x")).toBe("STRING");
    expect(z2ui5_cl_util.rtti_get_type_kind(42)).toBe("NUMERIC");
    expect(z2ui5_cl_util.rtti_get_type_kind(true)).toBe("BOOLEAN");
    expect(z2ui5_cl_util.rtti_get_type_kind({ value: 1 })).toBe("DREF");
    expect(z2ui5_cl_util.rtti_get_type_kind({ a: 1 })).toBe("STRUCT");
  });

  test("ui5_get_msg_type maps abap message types", () => {
    expect(z2ui5_cl_util.ui5_get_msg_type("E")).toBe("Error");
    expect(z2ui5_cl_util.ui5_get_msg_type("W")).toBe("Warning");
    expect(z2ui5_cl_util.ui5_get_msg_type("S")).toBe("Success");
    expect(z2ui5_cl_util.ui5_get_msg_type("I")).toBe("Information");
    expect(z2ui5_cl_util.ui5_get_msg_type("Z")).toBe("None");
  });

  test("url_param_get_tab + url_param_set", () => {
    const tab = z2ui5_cl_util.url_param_get_tab("http://x?a=1&b=2");
    expect(tab).toEqual([{ n: "a", v: "1" }, { n: "b", v: "2" }]);
    expect(z2ui5_cl_util.url_param_set("http://x?a=1", "a", "9")).toBe("http://x?a=9");
  });

  test("itab_filter_by_t_range with EQ/GE/CP", () => {
    const tab = [{ k: "a", v: 1 }, { k: "b", v: 5 }, { k: "ab", v: 9 }];
    expect(z2ui5_cl_util.itab_filter_by_t_range(tab, "v", [{ sign: "I", option: "GE", low: 5 }])).toHaveLength(2);
    expect(z2ui5_cl_util.itab_filter_by_t_range(tab, "k", [{ sign: "I", option: "CP", low: "a*" }])).toHaveLength(2);
  });

  test("uuid_get_c32 returns 32-char hex without dashes", () => {
    const u = z2ui5_cl_util.uuid_get_c32();
    expect(u).toMatch(/^[a-f0-9]{32}$/);
  });

  test("x_raise throws z2ui5_cx_util_error", () => {
    expect(() => z2ui5_cl_util.x_raise("boom")).toThrow(z2ui5_cx_util_error);
  });
});

// =============================================================
//  z2ui5_cx_util_error
// =============================================================
describe("z2ui5_cx_util_error", () => {
  test("constructor accepts a string", () => {
    const e = new z2ui5_cx_util_error("msg");
    expect(e.ms_error.text).toBe("msg");
    expect(e.ms_error.uuid).toMatch(/^[a-f0-9]{32}$/);
    expect(e.get_text()).toBe("msg");
  });

  test("constructor wraps an Error in x_root", () => {
    const inner = new Error("inner");
    const e = new z2ui5_cx_util_error(inner);
    expect(e.ms_error.x_root).toBe(inner);
    expect(e.get_text()).toBe("inner");
  });

  test("get_text walks previous chain", () => {
    const a = new z2ui5_cx_util_error("a");
    const b = new z2ui5_cx_util_error("b", a);
    expect(b.get_text()).toContain("b");
    expect(b.get_text()).toContain("a");
  });

  test("get_text returns UNKNOWN_ERROR when no text", () => {
    const e = new z2ui5_cx_util_error(new Error(""));
    expect(e.get_text()).toBe("UNKNOWN_ERROR");
  });
});

// =============================================================
//  z2ui5_cl_util_log — fluent API
// =============================================================
describe("z2ui5_cl_util_log", () => {
  test("info/warning/error chain + count + has_error", () => {
    const log = new z2ui5_cl_util_log();
    log.info("a").warning("b").error("c").success("d");
    expect(log.count()).toBe(4);
    expect(log.has_error()).toBe(true);
  });

  test("clear empties the log", () => {
    const log = new z2ui5_cl_util_log().info("a").error("b");
    log.clear();
    expect(log.count()).toBe(0);
    expect(log.has_error()).toBe(false);
  });

  test("to_string renders [TYPE] text per row", () => {
    const log = new z2ui5_cl_util_log().info("a").error("b");
    expect(log.to_string()).toBe("[I] a\n[E] b");
  });

  test("to_csv has header + rows", () => {
    const log = new z2ui5_cl_util_log().error("oops");
    const csv = log.to_csv();
    expect(csv.split("\n")[0]).toBe("type,id,no,text,v1,v2,v3,v4");
    expect(csv.split("\n")[1]).toContain("oops");
  });

  test("add ingests a struct via msg_get", () => {
    const log = new z2ui5_cl_util_log().add({ MSGTY: "E", TEXT: "x" });
    expect(log.has_error()).toBe(true);
    expect(log.count()).toBe(1);
  });
});

// =============================================================
//  z2ui5_cl_util_msg
// =============================================================
describe("z2ui5_cl_util_msg", () => {
  test("msg_get on string", () => {
    expect(z2ui5_cl_util_msg.msg_get("hello")).toEqual([{ text: "hello" }]);
  });

  test("msg_get on Error wraps in {type:E, text}", () => {
    const out = z2ui5_cl_util_msg.msg_get(new Error("boom"));
    expect(out[0].type).toBe("E");
    expect(out[0].text).toBe("boom");
  });

  test("msg_get on array recurses per row", () => {
    const out = z2ui5_cl_util_msg.msg_get([
      { TYPE: "I", TEXT: "a" },
      { TYPE: "E", TEXT: "b" },
    ]);
    expect(out).toHaveLength(2);
    expect(out[1].type).toBe("E");
  });

  test("msg_map handles abap aliases (MSGV1, V1, MESSAGE_V1)", () => {
    const m = z2ui5_cl_util_msg.msg_map("MSGV1", "x", {});
    expect(m.v1).toBe("x");
    expect(z2ui5_cl_util_msg.msg_map("V2", "y", {}).v2).toBe("y");
    expect(z2ui5_cl_util_msg.msg_map("MESSAGE_V3", "z", {}).v3).toBe("z");
  });

  test("msg_get_text returns first message's text", () => {
    expect(z2ui5_cl_util_msg.msg_get_text("hi")).toBe("hi");
    expect(z2ui5_cl_util_msg.msg_get_text(null)).toBe("");
  });
});

// =============================================================
//  z2ui5_cl_util_range — DSL + SQL emitter
// =============================================================
describe("z2ui5_cl_util_range", () => {
  test("static factories produce abap-shaped entries", () => {
    expect(z2ui5_cl_util_range.eq("X")).toEqual({ sign: "I", option: "EQ", low: "X", high: "" });
    expect(z2ui5_cl_util_range.bt(1, 9)).toEqual({ sign: "I", option: "BT", low: 1, high: 9 });
    expect(z2ui5_cl_util_range.ne("X", "E")).toEqual({ sign: "E", option: "NE", low: "X", high: "" });
  });

  test("get_sql renders parens + OR + NOT + LIKE", () => {
    const r = new z2ui5_cl_util_range("NAME", [
      z2ui5_cl_util_range.eq("A"),
      z2ui5_cl_util_range.cp("B*"),
      z2ui5_cl_util_range.ne("Z", "E"),
    ]);
    expect(r.get_sql()).toBe("( NAME EQ 'A' OR NAME LIKE 'B%' OR NOT NAME NE 'Z' )");
  });

  test("get_sql_multi joins fragments with AND", () => {
    expect(z2ui5_cl_util_range.get_sql_multi(["A=1", "", "B=2"])).toBe("A=1 AND B=2");
  });
});

// =============================================================
//  z2ui5_cl_util_xml — fluent builder
// =============================================================
describe("z2ui5_cl_util_xml", () => {
  test("factory + nested __ + stringify (compact)", () => {
    const root = z2ui5_cl_util_xml.factory();
    root.__({ n: "Page", p: [{ n: "title", v: "Hi" }] })
        ._({  n: "Button", a: "text", v: "OK" });
    const out = root.stringify();
    expect(out).toContain("<Page");
    expect(out).toContain('title="Hi"');
    expect(out).toContain('<Button text="OK"/>');
    expect(out).toContain("</Page>");
  });

  test("stringify with indent emits one element per line", () => {
    const root = z2ui5_cl_util_xml.factory();
    root.__({ n: "Page" })._({ n: "X" });
    const out = root.stringify({ indent: true });
    expect(out.split("\n").length).toBeGreaterThan(2);
  });

  test("attr escape replaces &<>\"'", () => {
    const root = z2ui5_cl_util_xml.factory();
    root._({ n: "X", a: "v", v: '<&>"\'' });
    expect(root.stringify()).toContain('v="&lt;&amp;&gt;&quot;&apos;"');
  });
});

// =============================================================
//  z2ui5_cl_util_http
// =============================================================
describe("z2ui5_cl_util_http", () => {
  test("factory_cloud wires req + res", () => {
    const fakeReq = { method: "GET", url: "/x?a=1", headers: { foo: "bar" }, body: "hi" };
    const fakeRes = { setHeader: jest.fn(), status: jest.fn() };
    const h = z2ui5_cl_util_http.factory_cloud(fakeReq, fakeRes);
    expect(h.get_method()).toBe("GET");
    expect(h.get_cdata()).toBe("hi");
    expect(h.get_header_field("foo")).toBe("bar");
    expect(h.get_header_field("~path")).toBe("/x");
  });

  test("get_req_info parses query into t_params", () => {
    const fakeReq = { method: "POST", url: "/x?a=1&b=2", headers: {}, body: "{}" };
    const h = z2ui5_cl_util_http.factory_cloud(fakeReq, {});
    const info = h.get_req_info();
    expect(info.method).toBe("POST");
    expect(info.path).toBe("/x");
    expect(info.t_params).toEqual([{ n: "a", v: "1" }, { n: "b", v: "2" }]);
  });

  test("set_status / set_header_field forward to res", () => {
    const fakeRes = { setHeader: jest.fn(), status: jest.fn() };
    const h = z2ui5_cl_util_http.factory_cloud({ method: "GET", headers: {} }, fakeRes);
    h.set_status(200, "OK");
    h.set_header_field("X-Foo", "bar");
    expect(fakeRes.status).toHaveBeenCalledWith(200);
    expect(fakeRes.setHeader).toHaveBeenCalledWith("X-Foo", "bar");
  });
});

// =============================================================
//  z2ui5_cl_util_db
// =============================================================
describe("z2ui5_cl_util_db", () => {
  beforeEach(() => {
    // Reset the in-memory store to keep tests isolated.
    z2ui5_cl_util_db._store = new Map();
    z2ui5_cl_util_db._by_id = new Map();
  });

  test("save returns id, load_by_id retrieves data", () => {
    const id = z2ui5_cl_util_db.save({ uname: "u", handle: "h", data: { a: 1 } });
    expect(id).toMatch(/^[a-f0-9]{32}$/);
    expect(z2ui5_cl_util_db.load_by_id({ id })).toEqual({ a: 1 });
  });

  test("load_by_handle returns the saved data", () => {
    z2ui5_cl_util_db.save({ uname: "u", handle: "h", data: 42 });
    expect(z2ui5_cl_util_db.load_by_handle({ uname: "u", handle: "h" })).toBe(42);
  });

  test("delete_by_handle removes the entry", () => {
    z2ui5_cl_util_db.save({ uname: "u", handle: "h", data: 1 });
    z2ui5_cl_util_db.delete_by_handle({ uname: "u", handle: "h" });
    expect(() => z2ui5_cl_util_db.load_by_handle({ uname: "u", handle: "h" })).toThrow();
  });

  test("save with same handle re-uses the same id", () => {
    const id1 = z2ui5_cl_util_db.save({ uname: "u", handle: "h", data: 1 });
    const id2 = z2ui5_cl_util_db.save({ uname: "u", handle: "h", data: 2 });
    expect(id1).toBe(id2);
    expect(z2ui5_cl_util_db.load_by_id({ id: id1 })).toBe(2);
  });
});

// =============================================================
//  z2ui5_cl_util_api
// =============================================================
describe("z2ui5_cl_util_api", () => {
  test("uuid_get_c32 / _c22 produce valid ids", () => {
    expect(z2ui5_cl_util_api.uuid_get_c32()).toMatch(/^[a-f0-9]{32}$/);
    expect(z2ui5_cl_util_api.uuid_get_c22().length).toBeGreaterThanOrEqual(20);
  });

  test("base64 round-trip via Buffer", () => {
    const b64 = z2ui5_cl_util_api.conv_encode_x_base64("hello");
    expect(z2ui5_cl_util_api.conv_get_string_by_xstring(
      z2ui5_cl_util_api.conv_decode_x_base64(b64))).toBe("hello");
  });

  test("context flags + tenant + user_tech", () => {
    expect(z2ui5_cl_util_api.context_check_abap_cloud()).toBe(false);
    expect(typeof z2ui5_cl_util_api.context_get_tenant()).toBe("string");
    expect(typeof z2ui5_cl_util_api.context_get_user_tech()).toBe("string");
  });

  test("api_c and api_s re-export the same module", () => {
    const c = require("../../cap2UI5/srv/z2ui5/00/03/02/z2ui5_cl_util_api_c");
    const s = require("../../cap2UI5/srv/z2ui5/00/03/02/z2ui5_cl_util_api_s");
    expect(c).toBe(z2ui5_cl_util_api);
    expect(s).toBe(z2ui5_cl_util_api);
  });
});

// =============================================================
//  z2ui5_if_client / z2ui5_if_exit / z2ui5_cl_exit
// =============================================================
describe("z2ui5_if_client", () => {
  test("cs_event has the 31 upstream entries", () => {
    expect(Object.keys(z2ui5_if_client.cs_event)).toHaveLength(31);
    expect(z2ui5_if_client.cs_event.popup_close).toBe("POPUP_CLOSE");
  });

  test("METHOD_NAMES covers all interface methods", () => {
    expect(z2ui5_if_client.METHOD_NAMES).toContain("view_display");
    expect(z2ui5_if_client.METHOD_NAMES).toContain("nav_app_call");
    expect(z2ui5_if_client.METHOD_NAMES).toContain("_event");
    expect(z2ui5_if_client.METHOD_NAMES).toContain("_bind");
    expect(z2ui5_if_client.METHOD_NAMES).toContain("_bind_edit");
  });

  test("check_implements raises on missing methods", () => {
    expect(() => z2ui5_if_client.check_implements({})).toThrow(/missing methods/);
  });

  test("check_implements passes on a real client", () => {
    const Client = require("../../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_client");
    expect(() => z2ui5_if_client.check_implements(new Client())).not.toThrow();
  });
});

describe("z2ui5_if_exit", () => {
  test("METHOD_NAMES = [set_config_http_get, set_config_http_post]", () => {
    expect(z2ui5_if_exit.METHOD_NAMES).toEqual([
      "set_config_http_get", "set_config_http_post",
    ]);
  });

  test("check_implements passes on cl_exit", () => {
    expect(() => z2ui5_if_exit.check_implements(z2ui5_cl_exit.get_instance())).not.toThrow();
  });
});

describe("z2ui5_cl_exit", () => {
  beforeEach(() => {
    z2ui5_cl_exit._gi_me = null;
    z2ui5_cl_exit._gi_user_exit = null;
    z2ui5_cl_exit._context = {};
  });

  test("set_config_http_get fills CSP / theme / title / src / headers", () => {
    const cfg = z2ui5_cl_exit.get_instance().set_config_http_get(undefined, {});
    expect(cfg.title).toBe("abap2UI5");
    expect(cfg.theme).toBe("sap_horizon");
    // UI5 is served locally by the CAP server (see srv/server.js), not a CDN.
    expect(cfg.src).toBe("/resources/sap-ui-core.js");
    expect(cfg.content_security_policy).toContain("Content-Security-Policy");
    expect(cfg.t_security_header.length).toBeGreaterThan(3);
  });

  test("set_config_http_post defaults draft_exp_time_in_hours to 4", () => {
    const cfg = z2ui5_cl_exit.get_instance().set_config_http_post(undefined, {});
    expect(cfg.draft_exp_time_in_hours).toBe(4);
  });

  test("init_context extracts app_start from t_params", () => {
    z2ui5_cl_exit.init_context({
      path: "/x",
      t_params: [{ n: "app_start", v: "FOO" }],
    });
    expect(z2ui5_cl_exit._context.app_start).toBe("FOO");
  });

  test("get_instance is a singleton", () => {
    expect(z2ui5_cl_exit.get_instance()).toBe(z2ui5_cl_exit.get_instance());
  });
});
