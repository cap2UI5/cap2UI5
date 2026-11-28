// Two ways for an app to read the project's data, and what each one checks.
//
//   SERVICE  through a CAP service (cds.connect.to): the service's own
//            authorization applies - @requires, @restrict, its handlers and
//            validations - for the user of the roundtrip, as for an OData
//            call. AdminService requires `admin`.
//   DIRECT   straight from the database (cds.ql on a cds.entities( ) entity),
//            as a service's own handler reads: NOTHING of a service applies.
//            Whoever may open the app reads the table.
//
// Neither is wrong; an app is server-side code, like a handler. But the door
// the app's users come through is cds.requires.cap2ui5.roles, not the
// service's, so an app that shows what a service guards reads through the
// service - or checks client.get( ) and cds.context.user itself.
const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const { defineApp } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_VIA_SERVICE", class {
  hits = 0;

  async main(client) {
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Page title="via service"><Text text="${client._bind("hits")} books"/>` +
        `<Button text="Through AdminService" press="${client._event("SERVICE")}"/>` +
        `<Button text="From the database" press="${client._event("DIRECT")}"/></Page></mvc:View>`);
      return;
    }
    if (client.check_on_event("SERVICE")) {
      const admin = await cds.connect.to("AdminService");
      try {
        this.hits = (await admin.run(SELECT.from(admin.entities.Books))).length;
      } catch (e) {
        // CAP's refusal, told to the user instead of failing the roundtrip
        if (Number(e.code ?? e.status) !== 403) throw e;
        client.message_box_display("You are not allowed to read the books");
        return;
      }
      client.message_toast_display(`${this.hits} through the service`);
    }
    if (client.check_on_event("DIRECT")) {
      const { Books } = cds.entities("my.bookshop");
      this.hits = (await SELECT.from(Books)).length;
      client.message_toast_display(`${this.hits} from the database`);
    }
  }
});
