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
import { post, serve } from "./server.mjs";

const { defineApp, t } = createRequire(import.meta.url)("@cap2ui5/cds-plugin");

const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const toast = (r) => {
  const a = [...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []), ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? [])]
    .find((x) => x[0] === "MESSAGE_TOAST");
  assert.ok(a, `no toast: ${r.text.slice(0, 400)}`);
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

// ---- how a field reads and writes, by what declares it

test("t.float( ), t.char( n ) and t.bool( ) read as a number, a trimmed string and a boolean - and take them", async () => {
  // Read as generic boxes, a float answered open-abap's external format
  // ("5,0000000000000000E-01", and ratio * 2 was NaN), a CHAR its padding
  // ("ab   " !== "ab") and t.bool( ) " " - truthy - while `this.flag = true`
  // threw "value.get is not a function".
  defineApp("ZCL_JS_MODEL_TYPES", class {
    ratio = 0.5;
    f = t.float();
    code = t.char(5);
    flag = t.bool();
    s = { code: t.char(3), flag: t.bool(), f: t.float() };
    out = "";
    main(client) {
      if (client.check_on_init()) {
        this.f = 1.25;
        this.code = "ab";
        this.flag = true;
        this.s = { code: "x", flag: true, f: 0.25 };
      }
      const s = this.s;
      this.out = JSON.stringify([this.ratio * 2, this.f * 2, this.code, this.code === "ab", this.flag,
        s.code, s.flag, s.f * 2]);
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<Text text="${client._bind("out")}"/><CheckBox selected="${client._bind("flag")}"/></mvc:View>`);
      }
    }
  });
  const start = await P({ app: "ZCL_JS_MODEL_TYPES" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  const expected = [1, 2.5, "ab", true, true, "x", true, 0.5];
  assert.deepEqual(JSON.parse(start.json.MODEL.OUT), expected);
  assert.equal(start.json.MODEL.FLAG, true);

  // and the same after the draft restore, with the checkbox unticked in the browser
  const again = await P({ app: "ZCL_JS_MODEL_TYPES", id: start.json.S_FRONT.ID, event: "X", model: { FLAG: false } });
  assert.equal(again.status, 200, again.text.slice(0, 300));
  assert.deepEqual(JSON.parse(again.json.MODEL.OUT), [1, 2.5, "ab", true, false, "x", true, 0.5]);
});

test("a field cleared to its initial value stays cleared, whatever its initializer said", async () => {
  // The initializer's value used to be in the box `new` built, and the draft
  // restore - which builds the instance with `new` and leaves an initial
  // value out - brought it back: name = "Alice", cleared to "", was "Alice"
  // again on the next roundtrip. The initializer is constructor_( )'s now,
  // which the restore does not run.
  defineApp("ZCL_JS_MODEL_CLEAR", class {
    name = "Alice";
    count = 5;
    flag = true;
    code = t.char(3).set("abc");
    addr = { city: "London", zip: 1234 };
    rows = [{ id: 1, title: "first" }, { id: 2, title: "second" }];
    main(client) {
      if (client.check_on_event("CLEAR")) {
        this.count = 0;
        this.flag = false;
        this.code = "";
        this.addr = { city: "", zip: 0 };
        this.rows = [{ id: 3 }];          // a row that leaves title out has it initial
      }
      client.message_toast_display(JSON.stringify([this.name, this.count, this.flag, this.code, this.addr, this.rows]));
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Input value="${client._bind("name")}"/></mvc:View>`);
      }
    }
  });
  const start = await P({ app: "ZCL_JS_MODEL_CLEAR" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.deepEqual(JSON.parse(toast(start)), ["Alice", 5, true, "abc", { city: "London", zip: 1234 }, [{ id: 1, title: "first" }, { id: 2, title: "second" }]]);
  assert.deepEqual(start.json.MODEL, { NAME: "Alice" });

  // the browser clears the bound name, the app clears the rest
  const cleared = await P({ app: "ZCL_JS_MODEL_CLEAR", id: start.json.S_FRONT.ID, event: "CLEAR", model: { NAME: "" } });
  assert.equal(cleared.status, 200, cleared.text.slice(0, 300));
  const empty = ["", 0, false, "", { city: "", zip: 0 }, [{ id: 3, title: "" }]];
  assert.deepEqual(JSON.parse(toast(cleared)), empty);

  // and a roundtrip later - out of the draft - they are still what they were set to
  let r = cleared;
  for (let i = 0; i < 2; i++) {
    r = await P({ app: "ZCL_JS_MODEL_CLEAR", id: r.json.S_FRONT.ID, event: "LOOK" });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.deepEqual(JSON.parse(toast(r)), empty, `roundtrip ${i + 1} after the clear`);
  }
});
