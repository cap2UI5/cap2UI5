// GENERATED from run/input/abap2UI5/src/01/02/z2ui5_cl_core_srv_event.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_core_srv_event = require("abap2UI5/z2ui5_cl_core_srv_event");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");


class ltcl_test {
  event() {
    let lo_event = null;
    let lv_event = ``;
    lo_event = new z2ui5_cl_core_srv_event();
    lv_event = lo_event.get_event(`POST`);
    cl_abap_unit_assert.assert_equals({ exp: `.eB(['POST'])`, act: lv_event });
  }

  event_backend() {
    let lo_event = null;
    let lv_event = ``;
    lo_event = new z2ui5_cl_core_srv_event();
    lv_event = lo_event.get_event_client(z2ui5_if_client.cs_event.popover_close);
    cl_abap_unit_assert.assert_equals({ exp: `.eF('POPOVER_CLOSE')`, act: lv_event });
  }

  event_with_args() {
    let lo_event = null;
    let temp1 = [];
    let lv_event = ``;
    let temp2 = false;
    let temp3 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp1 = null;
    temp1.push(`arg1`);
    lv_event = lo_event.get_event({ val: `MY_EVT`, t_arg: temp1 });
    temp2 = (String(lv_event).toLowerCase().includes(String(`MY_EVT`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp2);
    temp3 = (String(lv_event).toLowerCase().includes(String(`'arg1'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp3);
  }

  event_multi_args() {
    let lo_event = null;
    let temp3 = [];
    let lv_event = ``;
    let temp4 = false;
    let temp5 = false;
    let temp6 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp3 = null;
    temp3.push(`a1`);
    temp3.push(`a2`);
    temp3.push(`a3`);
    lv_event = lo_event.get_event({ val: `EVT`, t_arg: temp3 });
    temp4 = (String(lv_event).toLowerCase().includes(String(`'a1'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp4);
    temp5 = (String(lv_event).toLowerCase().includes(String(`'a2'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp5);
    temp6 = (String(lv_event).toLowerCase().includes(String(`'a3'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp6);
  }

  event_dollar_arg() {
    let lo_event = null;
    let temp5 = [];
    let lv_event = ``;
    let temp7 = false;
    let temp8 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp5 = null;
    temp5.push(`$event`);
    lv_event = lo_event.get_event({ val: `EVT`, t_arg: temp5 });
    temp7 = (String(lv_event).toLowerCase().includes(String(`$event`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp7);
    temp8 = (String(lv_event).toLowerCase().includes(String(`'$event'`).toLowerCase()));
    cl_abap_unit_assert.assert_false(temp8);
  }

  event_binding_arg() {
    let lo_event = null;
    let temp7 = [];
    let lv_event = ``;
    let temp9 = false;
    let temp10 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp7 = null;
    temp7.push(`{/MY_PATH}`);
    lv_event = lo_event.get_event({ val: `EVT`, t_arg: temp7 });
    temp9 = (String(lv_event).toLowerCase().includes(String(`{/MY_PATH}`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp9);
    temp10 = (String(lv_event).toLowerCase().includes(String(`'{/MY_PATH}'`).toLowerCase()));
    cl_abap_unit_assert.assert_false(temp10);
  }

  event_empty_arg() {
    let lo_event = null;
    let temp9 = [];
    let lv_event = ``;
    let temp11 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp9 = null;
    temp9.push(``);
    temp9.push(`real`);
    lv_event = lo_event.get_event({ val: `EVT`, t_arg: temp9 });
    temp11 = (String(lv_event).toLowerCase().includes(String(`'real'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp11);
  }

  event_multi_req() {
    let lo_event = null;
    let temp11 = null;
    let lv_event = ``;
    let temp12 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp11 = null;
    temp11.check_allow_multi_req = true;
    lv_event = lo_event.get_event({ val: `EVT`, s_cnt: temp11 });
    temp12 = (String(lv_event).toLowerCase().includes(String(`false,true`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp12);
  }

  event_client_args() {
    let lo_event = null;
    let temp12 = [];
    let lv_event = ``;
    let temp13 = false;
    let temp14 = false;
    lo_event = new z2ui5_cl_core_srv_event();
    temp12 = null;
    temp12.push(`param1`);
    lv_event = lo_event.get_event_client({ val: `CLOSE`, t_arg: temp12 });
    temp13 = (String(lv_event).toLowerCase().includes(String(`CLOSE`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp13);
    temp14 = (String(lv_event).toLowerCase().includes(String(`'param1'`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp14);
  }
}



module.exports = {
  __main: "z2ui5_cl_core_srv_event",
  __classes: { ltcl_test },
  __tests: {"ltcl_test":["event","event_backend","event_with_args","event_multi_args","event_dollar_arg","event_binding_arg","event_empty_arg","event_multi_req","event_client_args"]},
};
