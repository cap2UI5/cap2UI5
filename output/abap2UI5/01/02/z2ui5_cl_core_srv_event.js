const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_srv_event {
  get_event({ val, t_arg, s_cnt } = {}) {
    let result = ``;
    result = `${z2ui5_if_core_types.cs_ui5.event_backend_function}(['${val}'`;
    if (s_cnt.check_allow_multi_req === true) {
      result = `${result},false,true`;
    }
    result = `${result}]${this.get_t_arg({ val: t_arg })}`;
    return result;
  }

  get_event_client({ val, t_arg } = {}) {
    let result = ``;
    result = `${z2ui5_if_core_types.cs_ui5.event_frontend_function}('${val}'${this.get_t_arg({ val: t_arg })}`;
    return result;
  }

  get_t_arg({ val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let lv_new = ``;
    sy_tabix = 0;
    for (const lr_arg of val) {
      sy_tabix++;
      lv_new = lr_arg;
      if (!lv_new) {
        continue;
      }
      if (lv_new (1) !== `$` && lv_new (1) !== `{` && !String(lv_new).includes(String(`.eB(*`).replace(/\*/g, ""))) {
        lv_new = `'${lv_new}'`;
      }
      result = `${result}, ${lv_new}`;
    }
    result = `${result})`;
    return result;
  }
}

module.exports = z2ui5_cl_core_srv_event;
