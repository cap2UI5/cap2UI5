/**
 * z2ui5_cl_util_http — JS port of abap2UI5 z2ui5_cl_util_http.
 *
 * Thin facade over an HTTP request/response pair. ABAP supports two server
 * backends (on-prem ICF object vs. cloud IF_WEB_HTTP_REQUEST). In Node we
 * have one shape: the Express req/res objects. The class still distinguishes
 * the two via factory() / factory_cloud() so call sites stay identical.
 *
 * For CAP, callers construct via factory_cloud(req, res) — the request and
 * response objects are Express-style, and CAP's middleware has already
 * parsed body / cookies before this class touches them.
 *
 * ty_s_http_req shape — same field names as the abap TYPES block:
 *   { method, body, path, t_params: [{n, v}, ...] }
 */
class z2ui5_cl_util_http {

  constructor() {
    this.mo_server_onprem  = null;
    this.mo_request_cloud  = null;
    this.mo_response_cloud = null;
  }

  static factory(server) {
    const r = new z2ui5_cl_util_http();
    r.mo_server_onprem = server;
    return r;
  }

  static factory_cloud(req, res) {
    const r = new z2ui5_cl_util_http();
    r.mo_request_cloud  = req;
    r.mo_response_cloud = res;
    return r;
  }

  // ---- Request side ----

  /**
   * @returns {{ method:string, body:string, path:string, t_params:Array<{n:string,v:string}>}}
   */
  get_req_info() {
    const url = this._req_url();
    const t_params = z2ui5_cl_util_http.url_param_get_tab(url);
    return {
      body:     this.get_cdata(),
      method:   this.get_method(),
      path:     this._req_path(),
      t_params,
    };
  }

  get_method() {
    if (this.mo_server_onprem) return String(this.mo_server_onprem?.request?.method || ``);
    return String(this.mo_request_cloud?.method || ``);
  }

  get_cdata() {
    if (this.mo_server_onprem) {
      const b = this.mo_server_onprem?.request?.body;
      return typeof b === `string` ? b : JSON.stringify(b ?? ``);
    }
    const b = this.mo_request_cloud?.body;
    if (b == null) return ``;
    return typeof b === `string` ? b : JSON.stringify(b);
  }

  /**
   * Mirrors abap get_header_field. Special-cases the abap pseudo-headers
   * `~path` and `~request_uri` since express exposes them differently.
   */
  get_header_field(val) {
    const key = String(val || ``);
    if (key === `~path`)        return this._req_path();
    if (key === `~request_uri`) return this._req_url();

    const req = this.mo_request_cloud || this.mo_server_onprem?.request;
    if (!req) return ``;
    const headers = req.headers || {};
    return String(headers[key.toLowerCase()] || ``);
  }

  // ---- Response side ----

  set_cdata(val) {
    const res = this.mo_response_cloud || this.mo_server_onprem?.response;
    if (res?.send) res.send(val);
    else if (res) res.body = val;
  }

  set_status(code, reason) {
    const res = this.mo_response_cloud || this.mo_server_onprem?.response;
    if (res?.status) {
      res.status(code);
      if (reason && res.statusMessage !== undefined) res.statusMessage = reason;
    } else if (res) {
      res.statusCode = code;
      res.statusMessage = reason;
    }
  }

  set_header_field(n, v) {
    const res = this.mo_response_cloud || this.mo_server_onprem?.response;
    if (res?.setHeader) res.setHeader(String(n), String(v));
  }

  /**
   * Sticky-session toggle. ABAP forwards `stateful` (0/1/2) to ICF. Node has
   * no native sticky-session concept — apps may use the value for routing
   * affinity or session stores. For now we record on the response object so
   * a custom middleware can pick it up.
   */
  set_session_stateful(val) {
    const res = this.mo_response_cloud || this.mo_server_onprem?.response;
    if (res) res.locals = { ...(res.locals || {}), z2ui5_session_stateful: val };
  }

  get_response_cookie(val) {
    const req = this.mo_request_cloud || this.mo_server_onprem?.request;
    if (!req) return ``;
    if (req.cookies && val in req.cookies) return String(req.cookies[val]);
    const raw = req.headers?.cookie || ``;
    const m = raw.match(new RegExp(`(?:^|;\\s*)${val}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : ``;
  }

  delete_response_cookie(val) {
    const res = this.mo_response_cloud || this.mo_server_onprem?.response;
    if (res?.clearCookie) res.clearCookie(String(val));
  }

  // ---- helpers ----

  _req_url() {
    return this.mo_request_cloud?.originalUrl
      || this.mo_request_cloud?.url
      || this.mo_server_onprem?.request?.originalUrl
      || this.mo_server_onprem?.request?.url
      || ``;
  }

  _req_path() {
    const url = this._req_url();
    const idx = url.indexOf(`?`);
    return idx >= 0 ? url.slice(0, idx) : url;
  }

  /**
   * Parses URL query string into [{n, v}, …]. Mirrors
   * z2ui5_cl_util=>url_param_get_tab. Lives on this class as a static so it
   * stays usable without instantiating; z2ui5_cl_util re-exports the same
   * implementation under that name.
   */
  static url_param_get_tab(url) {
    const out = [];
    const q = String(url || ``).split(`?`)[1];
    if (!q) return out;
    for (const pair of q.split(`&`)) {
      if (!pair) continue;
      const eq = pair.indexOf(`=`);
      const n = eq >= 0 ? pair.slice(0, eq) : pair;
      const v = eq >= 0 ? pair.slice(eq + 1) : ``;
      try {
        out.push({ n: decodeURIComponent(n), v: decodeURIComponent(v) });
      } catch {
        out.push({ n, v });
      }
    }
    return out;
  }
}

module.exports = z2ui5_cl_util_http;
