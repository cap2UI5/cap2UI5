// How long an async main( ) may take: cds.requires.cap2ui5.timeout, set by
// the plugin at bootstrap; 0 is no limit.
//
// Roundtrips run one at a time per process (cds-plugin.js, roundtrip( )), so
// a main( ) that waits holds every other user's roundtrip behind it. main( )
// is the one place where giving up is safe: all it touches while it waits is
// its own instance and the recorded commands, neither of which outlives a
// failed roundtrip. The framework around it works on per-process state, so a
// roundtrip abandoned THERE would wake up inside somebody else's.
//
// A synchronous main( ) cannot be interrupted and is not timed.
const { setTimeout, clearTimeout } = require("node:timers");

const MAIN_TIMEOUT = "CAP2UI5_MAIN_TIMEOUT";
const limits = { timeout: 0 };
function configure({ timeout } = {}) {
  if (Number.isFinite(timeout) && timeout >= 0) limits.timeout = timeout;
  return { ...limits };
}
function within(running, ms, app) {
  let timer;
  const late = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(Object.assign(
      new Error(`defineApp ${app}: main( ) did not finish within ${ms} ms (cds.requires.cap2ui5.timeout) - ` +
        `the roundtrip is given up so that the others waiting behind it can run`),
      { code: MAIN_TIMEOUT })), ms);
  });
  running.catch(() => {});                 // what it does after the limit is nobody's to handle
  return Promise.race([running, late]).finally(() => clearTimeout(timer));
}

module.exports = { MAIN_TIMEOUT, limits, configure, within };
