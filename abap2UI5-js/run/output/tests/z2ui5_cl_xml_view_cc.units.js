// GENERATED from run/input/abap2UI5/src/02/z2ui5_cl_xml_view_cc.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_cl_xml_view_cc = require("abap2UI5/z2ui5_cl_xml_view_cc");


class ltcl_test_cc {
  test_constructor() {
    let lo_view = null;
    let lo_cc = null;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    cl_abap_unit_assert.assert_bound(lo_cc);
  }

  test_timer() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp1 = false;
    let temp2 = false;
    let temp3 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.timer({ finished: `onTimerFinished`, delayms: `2000`, checkrepeat: true });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp1 = (String(lv_xml).toLowerCase().includes(String(`Timer`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp1);
    temp2 = (String(lv_xml).toLowerCase().includes(String(`z2ui5`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp2);
    temp3 = (String(lv_xml).toLowerCase().includes(String(`2000`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp3);
  }

  test_focus() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp4 = false;
    let temp5 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.focus(`myInput`);
    lv_xml = lo_result.stringify();
    temp4 = (String(lv_xml).toLowerCase().includes(String(`Focus`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp4);
    temp5 = (String(lv_xml).toLowerCase().includes(String(`myInput`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp5);
  }

  test_camera_picture() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp6 = false;
    let temp7 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.camera_picture({ id: `cam1`, press: `onSnap`, autoplay: true });
    lv_xml = lo_result.stringify();
    temp6 = (String(lv_xml).toLowerCase().includes(String(`CameraPicture`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp6);
    temp7 = (String(lv_xml).toLowerCase().includes(String(`cam1`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp7);
  }

  test_bwip_js() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp8 = false;
    let temp9 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.bwip_js({ bcid: `qrcode`, text: `Hello`, scale: `3`, height: `10` });
    lv_xml = lo_result.stringify();
    temp8 = (String(lv_xml).toLowerCase().includes(String(`bwipjs`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp8);
    temp9 = (String(lv_xml).toLowerCase().includes(String(`qrcode`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp9);
  }

  test_geolocation() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp10 = false;
    let temp11 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.geolocation({ finished: `onGeoFinished`, longitude: `{/LON}`, latitude: `{/LAT}` });
    lv_xml = lo_result.stringify();
    temp10 = (String(lv_xml).toLowerCase().includes(String(`Geolocation`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp10);
    temp11 = (String(lv_xml).toLowerCase().includes(String(`{/LON}`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp11);
  }

  test_file_uploader() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp12 = false;
    let temp13 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.file_uploader({ placeholder: `Choose file`, upload: `onUpload`, buttontext: `Browse` });
    lv_xml = lo_result.stringify();
    temp12 = (String(lv_xml).toLowerCase().includes(String(`FileUploader`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp12);
    temp13 = (String(lv_xml).toLowerCase().includes(String(`Choose file`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp13);
  }

  test_favicon() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp14 = false;
    let temp15 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.favicon(`icon.png`);
    lv_xml = lo_result.stringify();
    temp14 = (String(lv_xml).toLowerCase().includes(String(`Favicon`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp14);
    temp15 = (String(lv_xml).toLowerCase().includes(String(`icon.png`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp15);
  }

  test_title() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp16 = false;
    let temp17 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.title(`My App`);
    lv_xml = lo_result.stringify();
    temp16 = (String(lv_xml).toLowerCase().includes(String(`Title`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp16);
    temp17 = (String(lv_xml).toLowerCase().includes(String(`My App`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp17);
  }

  test_dirty() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp18 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.dirty(true);
    lv_xml = lo_result.stringify();
    temp18 = (String(lv_xml).toLowerCase().includes(String(`Dirty`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp18);
  }

  test_history() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp19 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.history(`{/SEARCH}`);
    lv_xml = lo_result.stringify();
    temp19 = (String(lv_xml).toLowerCase().includes(String(`History`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp19);
  }

  test_messaging() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp20 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.messaging(`{/MESSAGES}`);
    lv_xml = lo_result.stringify();
    temp20 = (String(lv_xml).toLowerCase().includes(String(`Messaging`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp20);
  }

  test_storage() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp21 = false;
    let temp22 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.storage({ finished: `onStorageDone`, type: `local`, key: `myKey`, value: `myVal` });
    lv_xml = lo_result.stringify();
    temp21 = (String(lv_xml).toLowerCase().includes(String(`Storage`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp21);
    temp22 = (String(lv_xml).toLowerCase().includes(String(`myKey`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp22);
  }

  test_info_frontend() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp23 = false;
    let temp24 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.info_frontend(`onInfoDone`);
    lv_xml = lo_result.stringify();
    temp23 = (String(lv_xml).toLowerCase().includes(String(`Info`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp23);
    temp24 = (String(lv_xml).toLowerCase().includes(String(`onInfoDone`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp24);
  }

  test_lp_title() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp25 = false;
    let temp26 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.lp_title(`Launchpad Title`);
    lv_xml = lo_result.stringify();
    temp25 = (String(lv_xml).toLowerCase().includes(String(`LPTitle`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp25);
    temp26 = (String(lv_xml).toLowerCase().includes(String(`Launchpad Title`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp26);
  }

  test_z2ui5_namespace() {
    let lo_view = null;
    let lo_cc = null;
    let lv_xml = ``;
    let temp27 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_cc.timer(`onDone`);
    lo_cc.focus(`id1`);
    lv_xml = lo_view.stringify();
    temp27 = (String(lv_xml).toLowerCase().includes(String(`z2ui5`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp27);
  }

  test_smartmultiinput_ext() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp1 = false;
    let temp2 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.smartmultiinput_ext({ multiinputid: `input1`, rangedata: `{/RANGE}` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp1 = (String(lv_xml).toLowerCase().includes(String(`SmartMultiInputExt`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp1);
    temp2 = (String(lv_xml).toLowerCase().includes(String(`input1`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp2);
  }

  test_multiinput_ext() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp3 = false;
    let temp4 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.multiinput_ext({ multiinputid: `myInput`, multiinputname: `tokens`, change: `onChanged` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp3 = (String(lv_xml).toLowerCase().includes(String(`MultiInputExt`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp3);
    temp4 = (String(lv_xml).toLowerCase().includes(String(`myInput`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp4);
  }

  test_uploadset_ext() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp_a = false;
    let temp_b = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.uploadset_ext({ uploadsetid: `myUploadSet`, filedata: `{/data}`, filename: `{/name}`, change: `onUpload` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp_a = (String(lv_xml).toLowerCase().includes(String(`UploadSetExt`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp_a);
    temp_b = (String(lv_xml).toLowerCase().includes(String(`myUploadSet`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp_b);
  }

  test_uitableext() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp5 = false;
    let temp6 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.uitableext(`myTable`);
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp5 = (String(lv_xml).toLowerCase().includes(String(`UITableExt`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp5);
    temp6 = (String(lv_xml).toLowerCase().includes(String(`myTable`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp6);
  }

  test_camera_selector() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp7 = false;
    let temp8 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.camera_selector({ selectedkey: `{/CAMERA}`, placeholder: `Select camera` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp7 = (String(lv_xml).toLowerCase().includes(String(`CameraSelector`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp7);
    temp8 = (String(lv_xml).toLowerCase().includes(String(`Select camera`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp8);
  }

  test_spreadsheet_export() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp9 = false;
    let temp10 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.spreadsheet_export({ tableid: `exportTable`, text: `Export`, icon: `sap-icon://excel-attachment` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp9 = (String(lv_xml).toLowerCase().includes(String(`ExportSpreadsheet`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp9);
    temp10 = (String(lv_xml).toLowerCase().includes(String(`exportTable`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp10);
  }

  test_message_manager() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp11 = false;
    let temp12 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.message_manager(`{/MESSAGES}`);
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp11 = (String(lv_xml).toLowerCase().includes(String(`MessageManager`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp11);
    temp12 = (String(lv_xml).toLowerCase().includes(String(`{/MESSAGES}`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp12);
  }

  test_scrolling() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp13 = false;
    let temp14 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.scrolling({ setupdate: `onScroll`, items: `{/ITEMS}` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp13 = (String(lv_xml).toLowerCase().includes(String(`Scrolling`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp13);
    temp14 = (String(lv_xml).toLowerCase().includes(String(`onScroll`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp14);
  }

  test_tree() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp15 = false;
    let temp16 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.tree(`myTree`);
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp15 = (String(lv_xml).toLowerCase().includes(String(`Tree`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp15);
    temp16 = (String(lv_xml).toLowerCase().includes(String(`myTree`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp16);
  }

  test_websocket() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp17 = false;
    let temp18 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.websocket({ received: `onReceived`, path: `/ws/mypath`, checkrepeat: true });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp17 = (String(lv_xml).toLowerCase().includes(String(`Websocket`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp17);
    temp18 = (String(lv_xml).toLowerCase().includes(String(`/ws/mypath`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp18);
  }

  test_binding_update() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp19 = false;
    let temp20 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.binding_update({ changed: `onChanged`, path: `/XX/name` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp19 = (String(lv_xml).toLowerCase().includes(String(`BindingUpdate`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp19);
    temp20 = (String(lv_xml).toLowerCase().includes(String(`onChanged`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp20);
  }

  test_chartjs() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp21 = false;
    let temp22 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.chartjs({ canvas_id: `chart1`, height: `300`, width: `400` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp21 = (String(lv_xml).toLowerCase().includes(String(`chartjs`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp21);
    temp22 = (String(lv_xml).toLowerCase().includes(String(`chart1`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp22);
  }

  test_approve_popover() {
    let lo_view = null;
    let lo_cc = null;
    let lo_result = null;
    let lv_xml = ``;
    let temp23 = false;
    let temp24 = false;
    let temp25 = false;
    lo_view = z2ui5_cl_xml_view.factory().page(`Test`);
    lo_cc = new z2ui5_cl_xml_view_cc({ view: lo_view });
    lo_result = lo_cc.approve_popover({ text: `Are you sure?`, btn_txt: `Confirm`, btn_type: `Emphasized`, btn_event: `onConfirm` });
    cl_abap_unit_assert.assert_bound(lo_result);
    lv_xml = lo_result.stringify();
    temp23 = (String(lv_xml).toLowerCase().includes(String(`Popover`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp23);
    temp24 = (String(lv_xml).toLowerCase().includes(String(`Are you sure?`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp24);
    temp25 = (String(lv_xml).toLowerCase().includes(String(`onConfirm`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp25);
  }
}



module.exports = {
  __main: "z2ui5_cl_xml_view_cc",
  __classes: { ltcl_test_cc },
  __tests: {"ltcl_test_cc":["test_constructor","test_timer","test_focus","test_camera_picture","test_bwip_js","test_geolocation","test_file_uploader","test_favicon","test_title","test_dirty","test_history","test_messaging","test_storage","test_info_frontend","test_lp_title","test_z2ui5_namespace","test_smartmultiinput_ext","test_multiinput_ext","test_uploadset_ext","test_uitableext","test_camera_selector","test_spreadsheet_export","test_message_manager","test_scrolling","test_tree","test_websocket","test_binding_update","test_chartjs","test_approve_popover"]},
};
