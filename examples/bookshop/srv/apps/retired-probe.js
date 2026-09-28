// A TEST FIXTURE, not a demo app: it exists so nav.test.mjs can prove that the
// names the client no longer answers to throw an explaining error instead of
// quietly answering undefined. A guard rail that does not fire is worse than
// none - `if (client.isDisplay)` would simply be false on every roundtrip and
// the app would never render, with nothing saying why.
//
// It probes each kind: a 0.1.0 name (isDisplay, bind), the two that were gone
// before 0.1.0 (isInitial, modelUpdate) - and next to them a z2ui5_if_client
// method declared obsolete, which does nothing here as in ABAP
// (view_model_update), and the one the client refuses (set_session_stateful).
const { defineApp } = require("cap2ui5");

const PROBES = {
  isDisplay: (client) => client.isDisplay,
  bind: (client) => client.bind("errors"),
  isInitial: (client) => client.isInitial,
  modelUpdate: (client) => client.modelUpdate(),
  view_model_update: (client) => client.view_model_update(),
  set_session_stateful: (client) => client.set_session_stateful(true),
};

defineApp("ZCL_JS_RETIRED", class {
  errors = [{ probe: "", message: "" }];

  main(client) {
    this.errors = Object.entries(PROBES).map(([probe, run]) => {
      try {
        run(client);
        return { probe, message: "" };
      } catch (e) {
        return { probe, message: e.message };
      }
    });
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page title="retired"/></mvc:View>`);
    }
  }
});

// The names the client does answer to, as the wire carries them -
// nav.test.mjs holds them to z2ui5_if_client's own: every method and constant
// of the interface, by its name, and nothing else.
defineApp("ZCL_JS_CLIENT_NAMES", class {
  names = [{ name: "", kind: "" }];

  main(client) {
    this.names = Object.entries(client).map(([name, v]) => ({ name, kind: typeof v }));
  }
});
