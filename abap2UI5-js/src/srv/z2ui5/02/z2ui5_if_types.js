/**
 * z2ui5_if_types — JS port of abap2UI5 z2ui5_if_types.intf.abap.
 *
 * Public type "shapes" exposed to user apps. abap is statically typed; JS is
 * not, so this file mostly documents the structures via JSDoc @typedefs and
 * exports them on the module so apps can pattern-match if they want.
 *
 * The most-used shape is `ty_s_get` — the return value of `client.get()`.
 */
const z2ui5_if_types = Object.freeze({

  /**
   * @typedef {object} ty_s_name_value
   * @property {string} n
   * @property {string} v
   */

  /**
   * @typedef {ty_s_name_value[]} ty_t_name_value
   */

  /**
   * @typedef {object} ty_s_http_context
   * @property {string} path
   * @property {string} app_start
   * @property {ty_t_name_value} t_params
   */

  /**
   * @typedef {object} ty_s_draft
   * @property {string} id
   * @property {string} id_prev
   * @property {string} id_prev_app
   * @property {string} id_prev_app_stack
   */

  /**
   * @typedef {object} ty_s_http_config
   * @property {string} src
   * @property {string} theme
   * @property {string} content_security_policy
   * @property {string} styles_css
   * @property {string} title
   * @property {ty_t_name_value} t_add_config
   * @property {string} custom_js
   * @property {ty_t_name_value} t_security_header
   */

  /**
   * @typedef {object} ty_s_http_config_post
   * @property {number} draft_exp_time_in_hours
   */

  /**
   * @typedef {object} ty_s_config
   * @property {string} origin
   * @property {string} pathname
   * @property {string} search
   * @property {string} hash
   * @property {ty_t_name_value} t_startup_params
   */

  /**
   * @typedef {object} ty_s_get
   * @property {string}    event
   * @property {string[]}  t_event_arg
   * @property {boolean}   check_launchpad_active
   * @property {boolean}   check_on_navigated
   * @property {string}    viewname
   * @property {ty_s_draft} s_draft
   * @property {ty_s_config} s_config
   * @property {ty_t_name_value} t_comp_params
   * @property {*}         r_event_data
   * @property {{check_leave:boolean, check_call:boolean}} _s_nav
   */

  /**
   * @typedef {object} ty_s_event_control
   * @property {boolean} check_allow_multi_req
   */
});

module.exports = z2ui5_if_types;
