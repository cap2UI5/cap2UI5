/**
 * z2ui5_if_exit — JS port of abap2UI5 z2ui5_if_exit.intf.abap.
 *
 * Hook contract for user-defined exits. A class implementing this interface
 * lives outside the core and may be discovered & instantiated by
 * z2ui5_cl_exit.get_user_exit_class.
 *
 * METHOD_NAMES is used by z2ui5_cl_util.rtti_get_classes_impl_intf to find
 * candidate exit classes — same role as the ABAP interface declaration.
 *
 * Method signatures:
 *
 *   set_config_http_get(s_context, s_config) → s_config
 *     IN  s_context: ty_s_http_context (path, app_start, t_params)
 *     IO  s_config:  ty_s_http_config  (title, theme, src, css, csp, headers, …)
 *     The implementation may mutate s_config in place AND/OR return it.
 *     The framework treats both styles as equivalent (the ABAP CHANGING
 *     semantics map to either one in JS).
 *
 *   set_config_http_post(s_context, s_config) → s_config
 *     IN  s_context: ty_s_http_context
 *     IO  s_config:  ty_s_http_config_post (draft_exp_time_in_hours)
 */

const METHOD_NAMES = Object.freeze([
  `set_config_http_get`,
  `set_config_http_post`,
]);

function check_implements(obj) {
  const missing = METHOD_NAMES.filter((m) => typeof obj?.[m] !== `function`);
  if (missing.length) {
    throw new Error(`z2ui5_if_exit: implementation missing methods: ${missing.join(`, `)}`);
  }
}

const z2ui5_if_exit = Object.freeze({
  METHOD_NAMES,
  check_implements,
});

module.exports = z2ui5_if_exit;
