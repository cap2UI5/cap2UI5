/**
 * cl_abap_tstmp — native shim over ABAP TIMESTAMP values (YYYYMMDDhhmmss,
 * UTC). Accepts number or string; returns the same shape (number).
 */
"use strict";

function toDate(tstmp) {
  const s = String(tstmp ?? "").padEnd(14, "0");
  return Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12), +s.slice(12, 14));
}

function toTstmp(ms) {
  const d = new Date(ms);
  const p = (n, l = 2) => String(n).padStart(l, "0");
  return Number(`${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`);
}

class cl_abap_tstmp {
  static add({ tstmp, secs } = {}) { return toTstmp(toDate(tstmp) + Number(secs || 0) * 1000); }
  static subtractsecs({ tstmp, secs } = {}) { return toTstmp(toDate(tstmp) - Number(secs || 0) * 1000); }
  /** seconds between two timestamps (tstmp1 - tstmp2) */
  static subtract({ tstmp1, tstmp2 } = {}) { return (toDate(tstmp1) - toDate(tstmp2)) / 1000; }
}

module.exports = cl_abap_tstmp;
