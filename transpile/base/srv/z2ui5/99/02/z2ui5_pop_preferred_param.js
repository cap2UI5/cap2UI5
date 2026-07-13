/**
 * abap PREFERRED PARAMETER semantics for the z2ui5_cl_pop_* factories —
 * `z2ui5_cl_pop_textedit.factory(`text`)` ≡ `factory({ i_textarea: `text` })`.
 *
 * abap callers (and code transpiled 1:1 from abap) pass the preferred (or
 * single mandatory) parameter positionally; the JS factories destructure an
 * options object. Destructuring a positional value silently yields undefined
 * for every parameter (strings even pick up String.prototype members), so the
 * popup opens empty — e.g. pop_bal with no messages, pop_textedit without its
 * text.
 *
 * Usage (bottom of each pop class file):
 *
 *   shim(z2ui5_cl_pop_bal, {
 *     factory:       { preferred: "i_messages", params: [...] },
 *     factory_by_db: { preferred: "i_object",   params: [...] },
 *   });
 *
 * A call's first argument is treated as the positional preferred parameter
 * unless it is a plain options object whose own keys all match declared
 * parameter names — that heuristic keeps both call styles working, including
 * positional structs/tables (arrays, class instances and foreign-keyed plain
 * objects are wrapped; `{ i_title: ... }`-style bags pass through).
 */
"use strict";

function isOptionsBag(args, params) {
  if (args === null || typeof args !== "object") return false;
  if (Array.isArray(args)) return false;
  const proto = Object.getPrototypeOf(args);
  if (proto !== Object.prototype && proto !== null) return false;
  return Object.keys(args).every((k) => params.includes(k));
}

module.exports = function shim(cls, map) {
  for (const [meth, { preferred, params }] of Object.entries(map)) {
    const orig = cls[meth];
    if (typeof orig !== "function") continue;
    cls[meth] = function (args, ...rest) {
      if (args !== undefined && !isOptionsBag(args, params)) {
        args = { [preferred]: args };
      }
      return orig.call(this, args, ...rest);
    };
  }
};
