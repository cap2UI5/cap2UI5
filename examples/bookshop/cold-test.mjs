// THE COLD TEST — does app state survive a process restart?
//
// Process A boots CAP, runs roundtrip 1, and is KILLED. Process B is a fresh
// boot: new ABAP runtime, empty app_cont buffer, nothing in memory. It gets the
// draft id and must answer correctly. The only thing bridging the two is the
// row in cap2ui5.Drafts - a normal CDS entity in a file-backed database.
//
// This is what the earlier spikes could not show: the JS-serializer probe kept
// the live object in a Map, and the JS-app probe shared one runtime.
import { setTimeout as sleep } from "node:timers/promises";
import { action, boot, post } from "./test/server.mjs";

const USER = "alice";                              // the route requires a login
const show = (r) => JSON.stringify(action(r) ?? r?.text?.slice(0, 400) ?? null)?.slice(0, 130);

const run = async (app, expect) => {
  console.log(`\n=== ${app} ===`);
  let s = await boot("process A");
  console.log(`  [process A] up after ${s.seconds}s`);
  const r1 = await post(s.url, { app, user: USER });
  const id = r1.json?.S_FRONT?.ID;
  console.log(`  A roundtrip 1  MODEL=${JSON.stringify(r1.json?.MODEL)}  id=${id}`);
  console.log(`                 ${show(r1)}`);
  if (s.out().includes("[cap2ui5] drafts")) console.log("  store installed: yes");
  s.kill("SIGKILL");
  await sleep(2500);
  console.log("  --- process A killed, nothing left in memory ---");

  s = await boot("process B");
  console.log(`  [process B] up after ${s.seconds}s`);
  const r2 = await post(s.url, { app, id, event: app.startsWith("ZCL_JS") ? "GO" : "BUTTON_POST",
    model: { NAME: "Ada" }, user: USER });
  console.log(`  B roundtrip 2  ${show(r2)}`);
  s.kill("SIGKILL");
  await sleep(1500);
  const ok = r2.text.includes(expect);
  console.log(`  RESULT: ${ok ? "state SURVIVED the restart" : "state LOST"}`);
  return ok;
};

/** The same question one level harder: does the APP STACK survive?
 *
 *  Process A starts the caller and navigates into the called app - so there
 *  are now two app instances and a stack saying who returns to whom. A is
 *  killed there, INSIDE the called app. Process B has to take the picker's
 *  event, unwind the stack it never built, run the caller's main( ) again and
 *  carry the picked value home. If any of that lived in memory rather than in
 *  the draft, B answers the caller's start state instead. */
const navStack = async () => {
  console.log("\n=== ZCL_JS_PICK (navigation across a restart) ===");
  let s = await boot("process A");
  console.log(`  [process A] up after ${s.seconds}s`);
  const start = await post(s.url, { app: "ZCL_JS_PICK", user: USER });
  const picker = await post(s.url, {
    app: "ZCL_JS_PICK", id: start.json.S_FRONT.ID, event: "CHOOSE", user: USER });
  console.log(`  A navigated into the picker  MODEL=${JSON.stringify(picker.json?.MODEL)}`);
  const id = picker.json?.S_FRONT?.ID;
  s.kill("SIGKILL");
  await sleep(2500);
  console.log("  --- process A killed INSIDE the called app ---");

  s = await boot("process B");
  console.log(`  [process B] up after ${s.seconds}s`);
  const back = await post(s.url, {
    app: "ZCL_JS_PICK_ONE", id, event: "TAKE", args: ["red"], user: USER });
  console.log(`  B roundtrip 2  MODEL=${JSON.stringify(back.json?.MODEL)}`);
  s.kill("SIGKILL");
  await sleep(1500);
  const ok = back.json?.MODEL?.CHOSEN === "red" && back.json?.MODEL?.PICKS === 1;
  console.log(`  RESULT: ${ok ? "the app STACK survived the restart" : "stack LOST"}`);
  return ok;
};

const ctl = await run("z2ui5_cl_ui5_app_hi_world", "Your name is Ada");   // control
const js = await run("ZCL_JS_HELLO", "Hello Ada");                        // subject
const nav = await navStack();

console.log(`\nVERDICT  control=${ctl ? "ok" : "BROKEN"}  js-app-cold-restart=${js}  nav-stack-cold-restart=${nav}`);
process.exit(0);
