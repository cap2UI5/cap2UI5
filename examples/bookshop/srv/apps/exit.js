// The user exit: everything the framework renders or sends that is not an
// app's business - the theme, the UI5 bootstrap URL, the
// Content-Security-Policy, the security headers, the draft expiry, the CSRF
// gate. One per project; see the docs' User Exit page.
const { defineExit } = require("@cap2ui5/cds-plugin");

defineExit({
  // the bootstrap page: once per full page load, not once per roundtrip
  onPage(cfg, ctx) {
    cfg.theme = "sap_horizon_dark";
    // HSTS on top of the ones the framework already sends, rather than
    // instead of them - cfg.t_security_header arrives fully populated, and
    // is changed IN PLACE, appended to and one entry edited: exit.test.mjs
    // holds that both arrive (they were dropped while the hook got a
    // shallow copy whose arrays were the ones it was compared against).
    cfg.t_security_header.push({ n: "Strict-Transport-Security", v: "max-age=31536000; includeSubDomains" });
    cfg.t_security_header.find((h) => h.n === "Referrer-Policy").v = "no-referrer";
    if (ctx.app_start === "ZCL_JS_HELLO") cfg.theme = "sap_horizon";
  },

  // every roundtrip
  onRoundtrip(cfg) {
    cfg.draft_exp_time_in_hours = 24;
    // cfg.check_csrf_active stays true - the gate the auth test measures
  },
});
