// What of an app's state is its MODEL - sent to the browser and written back
// by it - and what only its draft.
//
// As in ABAP: a field is part of the model once the app binds it, and only
// then. The plugin used to bind every field before main( ) to learn its path,
// so every field went to the browser and the browser could write every field:
// a forged MODEL { PRICE: 0, IS_ADMIN: true } for fields no view shows was
// taken as if a control had sent it. An abap2UI5 app on the same runtime sends
// and accepts neither. Every field is still in the draft, bound or not.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { action, post, serve } from "./server.mjs";

const { defineApp } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");

const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const toast = (r) => {
  const a = action(r);
  assert.equal(a?.[0], "MESSAGE_TOAST", `no toast: ${r.text.slice(0, 400)}`);
  return a[2];
};

test("only a bound field is sent, and only a bound field is written back - a forged one is ignored", async () => {
  defineApp("ZCL_JS_MODEL_SHOP", class {
    name = "";
    price = 100;
    is_admin = false;
    main(client) {
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<Input value="${client._bind("name")}"/><Button press="${client._event("BUY")}"/></mvc:View>`);
      } else if (client.check_on_event("BUY")) {
        client.message_toast_display(`name=${this.name} price=${this.price} admin=${this.is_admin}`);
      }
    }
  });
  const start = await P({ app: "ZCL_JS_MODEL_SHOP" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.deepEqual(start.json.MODEL, { NAME: "" }, "a field no view binds is not sent to the browser");

  const buy = await P({ app: "ZCL_JS_MODEL_SHOP", id: start.json.S_FRONT.ID, event: "BUY",
    model: { NAME: "eve", PRICE: 0, IS_ADMIN: true } });
  assert.equal(buy.status, 200, buy.text.slice(0, 300));
  assert.equal(toast(buy), "name=eve price=100 admin=false",
    "the bound field took the browser's value, the unbound ones kept theirs");
});

test("a field the app does not bind is kept in the draft all the same", async () => {
  defineApp("ZCL_JS_MODEL_COUNT", class {
    clicks = 0;
    label = "";
    main(client) {
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<Button text="${client._bind("label")}" press="${client._event("CLICK")}"/></mvc:View>`);
      } else if (client.check_on_event("CLICK")) {
        this.clicks += 1;
        client.message_toast_display(`clicks=${this.clicks}`);
      }
    }
  });
  let r = await P({ app: "ZCL_JS_MODEL_COUNT" });
  for (let i = 1; i <= 3; i++) {
    r = await P({ app: "ZCL_JS_MODEL_COUNT", id: r.json.S_FRONT.ID, event: "CLICK", model: { CLICKS: 99 } });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.equal(toast(r), `clicks=${i}`, `roundtrip ${i}`);
    assert.equal("CLICKS" in (r.json.MODEL ?? {}), false, "and it is never sent");
  }
});

test("a field bound once stays in the model on the roundtrips that do not render", async () => {
  defineApp("ZCL_JS_MODEL_LATER", class {
    said = "";
    main(client) {
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<Text text="${client._bind("said")}"/></mvc:View>`);
      } else if (client.check_on_event("SAY")) {
        this.said = "hello";
      }
    }
  });
  const start = await P({ app: "ZCL_JS_MODEL_LATER" });
  const said = await P({ app: "ZCL_JS_MODEL_LATER", id: start.json.S_FRONT.ID, event: "SAY" });
  assert.equal(said.status, 200, said.text.slice(0, 300));
  assert.equal(said.json.MODEL?.SAID, "hello");
});
