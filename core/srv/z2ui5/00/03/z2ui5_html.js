/**
 * z2ui5_html — HTML escaping for the bootstrap page.
 *
 * WHY THIS EXISTS
 * ---------------
 * The bootstrap page (z2ui5_cl_ui5f_index_html, and the equivalent builder in
 * z2ui5_cl_ui5_http_handler._http_get) interpolates exit-supplied configuration
 * straight into markup: the tab title into <title>, the favicon URI into a
 * <link href>, the bootstrap src and theme into script attributes, and every
 * t_add_config row into a single-quoted data-sap-ui-* attribute.
 *
 * None of it was escaped. That was survivable only as long as every value is a
 * constant the framework itself sets — but the exit receives the request
 * context (init_context / set_config_http_get see path, params and headers), so
 * the moment an app reflects a query parameter into its title or into an extra
 * config row, the page hands an attacker an injection point. A `'` closes the
 * attribute; a `</title>` closes the element.
 *
 * These helpers make that impossible by construction, and give an exit author
 * something to call for their own interpolation:
 *
 *   const { escape_text, escape_attr } = require("abap2UI5/z2ui5_html");
 *
 * Escaping is deliberately conservative — the same replacements in both
 * helpers plus the quote characters — so a value is safe in element text, in a
 * single-quoted attribute and in a double-quoted one alike, and a caller
 * cannot pick the wrong one.
 */
"use strict";

const REPLACEMENTS = [
  [/&/g, `&amp;`],   // first, or it would double-escape the entities below
  [/</g, `&lt;`],
  [/>/g, `&gt;`],
  [/"/g, `&quot;`],
  [/'/g, `&#39;`],
];

function escape(val) {
  let out = val === null || val === undefined ? `` : String(val);
  for (const [re, to] of REPLACEMENTS) out = out.replace(re, to);
  return out;
}

/** Escape a value for HTML element text (e.g. between <title> and </title>). */
module.exports.escape_text = escape;

/** Escape a value for an HTML attribute, single- or double-quoted. */
module.exports.escape_attr = escape;

/**
 * Escape a URI destined for a DOUBLE-QUOTED attribute (href="…", src="…"),
 * and reject the schemes a URI context makes dangerous: `javascript:` and
 * `vbscript:` execute on click or on load. A rejected value yields the empty
 * string, which callers treat as "not configured" and omit the element
 * entirely rather than emitting a live but broken attribute.
 *
 * Escapes only `&` and `"` — the two characters that can end the attribute or
 * start an entity in this context. It deliberately does NOT escape `<`, `>`
 * or `'`: they are inert inside a double-quoted attribute value, and encoding
 * them would corrupt legitimate URIs. The shipped favicon is the worked
 * example — `data:image/svg+xml,<svg …fill='%23fff'>` has to survive intact,
 * and upstream's own test asserts the page contains `data:image/svg+xml,<svg`
 * literally. Use escape_attr, not this, for a single-quoted attribute.
 */
module.exports.escape_uri = function escape_uri(val) {
  const raw = val === null || val === undefined ? `` : String(val);
  // Strip control characters and whitespace before sniffing the scheme:
  // `java\tscript:` and `java\nscript:` are parsed as javascript: by browsers.
  const sniff = raw.replace(/[\u0000-\u0020]/g, ``).toLowerCase();
  if (sniff.startsWith(`javascript:`) || sniff.startsWith(`vbscript:`)) return ``;
  return raw.replace(/&/g, `&amp;`).replace(/"/g, `&quot;`);
};
