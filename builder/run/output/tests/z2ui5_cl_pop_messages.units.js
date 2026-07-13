// GENERATED from run/input/abap2UI5/src/02/01/z2ui5_cl_pop_messages.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_client = require("abap2UI5/z2ui5_cl_core_client");
const z2ui5_cl_pop_messages = require("abap2UI5/z2ui5_cl_pop_messages");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");


class ltcl_test {
  test_factory_w_bapiret() {
    if (sy_sysid === `ABC`) {
      return;
    }
    const lt_msg = [{ type: `E`, id: `MSG1`, number: `001`, message: `Error occurred` }, { type: `I`, id: `MSG2`, number: `002`, message: `Info message` }];
    const lo_pop = z2ui5_cl_pop_messages.factory(lt_msg);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_equals({ exp: 2, act: lo_pop.mt_msg.length });
  }

  test_factory_w_cx() {
    let lv_val;
    try {
      lv_val = z2ui5_cl_util.abap_div(1, 0);
    } catch (lx) {
    }
    const lo_pop = z2ui5_cl_pop_messages.factory(lx);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_not_initial(lo_pop.mt_msg);
  }

  test_factory_msg_type() {
    if (sy_sysid === `ABC`) {
      return;
    }
    const lt_msg = [{ type: `E`, message: `Error` }, { type: `W`, message: `Warning` }, { type: `S`, message: `Success` }];
    const lo_pop = z2ui5_cl_pop_messages.factory(lt_msg);
    cl_abap_unit_assert.assert_equals({ exp: 3, act: lo_pop.mt_msg.length });
    cl_abap_unit_assert.assert_not_initial(lo_pop.mt_msg[(1) - 1].type);
  }

  test_factory_empty_input() {
    const lx = new z2ui5_cx_abap2ui5_error({ val: `test` });
    const lo_pop = z2ui5_cl_pop_messages.factory(lx);
    cl_abap_unit_assert.assert_bound(lo_pop);
    cl_abap_unit_assert.assert_not_initial(lo_pop.mt_msg);
  }
}



class ltcl_test_roundtrip {
  mo_action = null;
  mi_client = null;

  client_create({ io_app } = {}) {
    this.mo_action = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_action.mo_app.mo_app = z2ui5_cl_util.abap_copy(io_app);
    this.mi_client = new z2ui5_cl_core_client(this.mo_action);
  }

  roundtrip_event({ io_app, iv_event } = {}) {
    this.client_create({ io_app: io_app });
    io_app.check_initialized = true;
    this.mo_action.ms_actual.event = z2ui5_cl_util.abap_copy(iv_event);
    io_app.main(this.mi_client);
  }

  test_factory_maps_messages() {
    const lo_pop = z2ui5_cl_pop_messages.factory([`first message`, `second message`]);
    cl_abap_unit_assert.assert_equals({ exp: 2, act: lo_pop.mt_msg.length });
    cl_abap_unit_assert.assert_equals({ exp: `first message`, act: lo_pop.mt_msg[(1) - 1].title });
  }

  test_init_displays_popup() {
    const lo_pop = z2ui5_cl_pop_messages.factory({ i_messages: [`first message`], i_title: `MSG Title` });
    this.client_create({ io_app: lo_pop });
    lo_pop.main(this.mi_client);
    const lv_xml = z2ui5_cl_util.abap_copy(this.mo_action.ms_next.s_set.s_popup.xml);
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`MSG Title`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`MessageView`).toLowerCase())));
  }

  test_continue_closes() {
    const lo_pop = z2ui5_cl_pop_messages.factory([`msg`]);
    this.roundtrip_event({ io_app: lo_pop, iv_event: `BUTTON_CONTINUE` });
    cl_abap_unit_assert.assert_true(this.mo_action.ms_next.s_set.s_popup.check_destroy);
    cl_abap_unit_assert.assert_bound(this.mo_action.ms_next.o_app_leave);
  }
}



module.exports = {
  __main: "z2ui5_cl_pop_messages",
  __classes: { ltcl_test, ltcl_test_roundtrip },
  __tests: {"ltcl_test":["test_factory_w_bapiret","test_factory_w_cx","test_factory_msg_type","test_factory_empty_input"],"ltcl_test_roundtrip":["test_factory_maps_messages","test_init_displays_popup","test_continue_closes"]},
};
