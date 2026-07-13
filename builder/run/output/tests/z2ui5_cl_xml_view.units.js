// GENERATED from run/input/abap2UI5/src/02/z2ui5_cl_xml_view.clas.testclasses.abap — do not edit
const cl_abap_unit_assert = require("abap2UI5/cl_abap_unit_assert");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");


class ltcl_unit_test {
  test_create() {
    let lo_view = null;
    let lv_xml = ``;
    lo_view = z2ui5_cl_xml_view.factory();
    lv_xml = lo_view.page(`test`).stringify();
    if (!lv_xml) {
      cl_abap_unit_assert.fail({ quit: 5 });
    }
  }

  test_factory_popup() {
    let lo_popup = null;
    let lv_xml = ``;
    let temp1 = false;
    lo_popup = z2ui5_cl_xml_view.factory_popup();
    lv_xml = lo_popup.dialog(`Test`).stringify();
    cl_abap_unit_assert.assert_not_initial(lv_xml);
    temp1 = (String(lv_xml).toLowerCase().includes(String(`Dialog`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp1);
  }

  test_shell_page() {
    let lv_xml = ``;
    let temp2 = false;
    let temp3 = false;
    let temp4 = false;
    lv_xml = z2ui5_cl_xml_view.factory().shell().page(`My Page`).stringify();
    temp2 = (String(lv_xml).toLowerCase().includes(String(`Shell`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp2);
    temp3 = (String(lv_xml).toLowerCase().includes(String(`Page`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp3);
    temp4 = (String(lv_xml).toLowerCase().includes(String(`My Page`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp4);
  }

  test_simple_form() {
    let lv_xml = ``;
    let temp5 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).simple_form({ editable: true }).stringify();
    temp5 = (String(lv_xml).toLowerCase().includes(String(`SimpleForm`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp5);
  }

  test_button() {
    let lv_xml = ``;
    let temp6 = false;
    let temp7 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).button({ text: `Click Me`, press: `onPress` }).stringify();
    temp6 = (String(lv_xml).toLowerCase().includes(String(`Button`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp6);
    temp7 = (String(lv_xml).toLowerCase().includes(String(`Click Me`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp7);
  }

  test_input() {
    let lv_xml = ``;
    let temp8 = false;
    let temp9 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).input({ value: `{/NAME}`, placeholder: `Enter name` }).stringify();
    temp8 = (String(lv_xml).toLowerCase().includes(String(`Input`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp8);
    temp9 = (String(lv_xml).toLowerCase().includes(String(`Enter name`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp9);
  }

  test_label() {
    let lv_xml = ``;
    let temp10 = false;
    let temp11 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).label(`My Label`).stringify();
    temp10 = (String(lv_xml).toLowerCase().includes(String(`Label`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp10);
    temp11 = (String(lv_xml).toLowerCase().includes(String(`My Label`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp11);
  }

  test_text() {
    let lv_xml = ``;
    let temp12 = false;
    let temp13 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).text(`Hello World`).stringify();
    temp12 = (String(lv_xml).toLowerCase().includes(String(`Text`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp12);
    temp13 = (String(lv_xml).toLowerCase().includes(String(`Hello World`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp13);
  }

  test_vbox_hbox() {
    let lv_xml = ``;
    let temp14 = false;
    let temp15 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).vbox().hbox().text(`Nested`).stringify();
    temp14 = (String(lv_xml).toLowerCase().includes(String(`VBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp14);
    temp15 = (String(lv_xml).toLowerCase().includes(String(`HBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp15);
  }

  test_table() {
    let lv_xml = ``;
    let temp16 = false;
    let temp17 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).table({ headertext: `My Table` }).stringify();
    temp16 = (String(lv_xml).toLowerCase().includes(String(`Table`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp16);
    temp17 = (String(lv_xml).toLowerCase().includes(String(`My Table`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp17);
  }

  test_dialog() {
    let lv_xml = ``;
    let temp18 = false;
    let temp19 = false;
    lv_xml = z2ui5_cl_xml_view.factory_popup().dialog({ title: `Confirm`, icon: `sap-icon://hint` }).stringify();
    temp18 = (String(lv_xml).toLowerCase().includes(String(`Dialog`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp18);
    temp19 = (String(lv_xml).toLowerCase().includes(String(`Confirm`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp19);
  }

  test_get_parent() {
    let lo_view = null;
    let lo_page = null;
    let lo_vbox = null;
    let lo_parent = null;
    let lv_xml = ``;
    lo_view = z2ui5_cl_xml_view.factory();
    lo_page = lo_view.page(`Test`);
    lo_vbox = lo_page.vbox();
    lo_parent = lo_vbox.get_parent();
    cl_abap_unit_assert.assert_bound(lo_parent);
    lv_xml = lo_parent.stringify();
    cl_abap_unit_assert.assert_not_initial(lv_xml);
  }

  test_content() {
    let lv_xml = ``;
    let temp20 = false;
    let temp21 = false;
    let temp22 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).simple_form().content(`form`).label(`Name`).input(`{/NAME}`).stringify();
    temp20 = (String(lv_xml).toLowerCase().includes(String(`content`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp20);
    temp21 = (String(lv_xml).toLowerCase().includes(String(`Label`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp21);
    temp22 = (String(lv_xml).toLowerCase().includes(String(`Input`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp22);
  }

  test_columns_cells() {
    let lv_xml = ``;
    let temp23 = false;
    let temp24 = false;
    let temp25 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).table().columns().column().header(``).text(`Col1`).get_parent().get_parent().get_parent().items().column_list_item().cells().text(`{COL1}`).stringify();
    temp23 = (String(lv_xml).toLowerCase().includes(String(`columns`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp23);
    temp24 = (String(lv_xml).toLowerCase().includes(String(`Column`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp24);
    temp25 = (String(lv_xml).toLowerCase().includes(String(`ColumnListItem`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp25);
  }

  test_message_page() {
    let lv_xml = ``;
    let temp26 = false;
    let temp27 = false;
    lv_xml = z2ui5_cl_xml_view.factory().message_page({ text: `Page not found`, description: `Check the URL` }).stringify();
    temp26 = (String(lv_xml).toLowerCase().includes(String(`MessagePage`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp26);
    temp27 = (String(lv_xml).toLowerCase().includes(String(`Page not found`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp27);
  }

  test_icon_tab_bar() {
    let lv_xml = ``;
    let temp28 = false;
    let temp29 = false;
    let temp30 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).icon_tab_bar().items().icon_tab_filter({ text: `Tab1` }).content().text(`Content1`).stringify();
    temp28 = (String(lv_xml).toLowerCase().includes(String(`IconTabBar`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp28);
    temp29 = (String(lv_xml).toLowerCase().includes(String(`IconTabFilter`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp29);
    temp30 = (String(lv_xml).toLowerCase().includes(String(`Tab1`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp30);
  }

  test_select() {
    let lv_xml = ``;
    let temp31 = false;
    let temp32 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).select({ selectedkey: `{/SELECTED}`, change: `onSelect` }).stringify();
    temp31 = (String(lv_xml).toLowerCase().includes(String(`Select`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp31);
    temp32 = (String(lv_xml).toLowerCase().includes(String(`{/SELECTED}`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp32);
  }

  test_combobox() {
    let lv_xml = ``;
    let temp33 = false;
    let temp34 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).combobox({ selectedkey: `{/KEY}`, placeholder: `Choose` }).stringify();
    temp33 = (String(lv_xml).toLowerCase().includes(String(`ComboBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp33);
    temp34 = (String(lv_xml).toLowerCase().includes(String(`Choose`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp34);
  }

  test_checkbox() {
    let lv_xml = ``;
    let temp35 = false;
    let temp36 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).checkbox({ text: `Accept`, selected: `{/ACCEPTED}` }).stringify();
    temp35 = (String(lv_xml).toLowerCase().includes(String(`CheckBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp35);
    temp36 = (String(lv_xml).toLowerCase().includes(String(`Accept`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp36);
  }

  test_date_picker() {
    let lv_xml = ``;
    let temp37 = false;
    let temp38 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).date_picker({ value: `{/DATE}`, placeholder: `Pick date` }).stringify();
    temp37 = (String(lv_xml).toLowerCase().includes(String(`DatePicker`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp37);
    temp38 = (String(lv_xml).toLowerCase().includes(String(`Pick date`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp38);
  }

  test_text_area() {
    let lv_xml = ``;
    let temp39 = false;
    let temp40 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).text_area({ value: `{/NOTES}`, rows: `5` }).stringify();
    temp39 = (String(lv_xml).toLowerCase().includes(String(`TextArea`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp39);
    temp40 = (String(lv_xml).toLowerCase().includes(String(`{/NOTES}`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp40);
  }

  test_link() {
    let lv_xml = ``;
    let temp41 = false;
    let temp42 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).link({ text: `Click here`, href: `https://example.com` }).stringify();
    temp41 = (String(lv_xml).toLowerCase().includes(String(`Link`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp41);
    temp42 = (String(lv_xml).toLowerCase().includes(String(`Click here`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp42);
  }

  test_title() {
    let lv_xml = ``;
    let temp43 = false;
    let temp44 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).title(`My Title`).stringify();
    temp43 = (String(lv_xml).toLowerCase().includes(String(`Title`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp43);
    temp44 = (String(lv_xml).toLowerCase().includes(String(`My Title`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp44);
  }

  test_toolbar() {
    let lv_xml = ``;
    let temp45 = false;
    let temp46 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).overflow_toolbar().button({ text: `Action`, press: `onPress` }).stringify();
    temp45 = (String(lv_xml).toLowerCase().includes(String(`OverflowToolbar`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp45);
    temp46 = (String(lv_xml).toLowerCase().includes(String(`Button`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp46);
  }

  test_toolbar_spacer() {
    let lv_xml = ``;
    let temp47 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).toolbar_spacer().stringify();
    temp47 = (String(lv_xml).toLowerCase().includes(String(`ToolbarSpacer`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp47);
  }

  test_scroll_container() {
    let lv_xml = ``;
    let temp48 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).scroll_container({ height: `100%`, vertical: true }).stringify();
    temp48 = (String(lv_xml).toLowerCase().includes(String(`ScrollContainer`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp48);
  }

  test_list() {
    let lv_xml = ``;
    let temp49 = false;
    let temp50 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).list({ headertext: `Items`, items: `{/ITEMS}` }).standard_list_item({ title: `{TITLE}`, description: `{DESC}` }).stringify();
    temp49 = (String(lv_xml).toLowerCase().includes(String(`List`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp49);
    temp50 = (String(lv_xml).toLowerCase().includes(String(`StandardListItem`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp50);
  }

  test_switch() {
    let lv_xml = ``;
    let temp51 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).switch({ state: `{/ACTIVE}`, type: `AcceptReject` }).stringify();
    temp51 = (String(lv_xml).toLowerCase().includes(String(`Switch`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp51);
  }

  test_radio_button() {
    let lv_xml = ``;
    let temp52 = false;
    let temp53 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).radio_button({ text: `Option A`, selected: `{/OPTION_A}` }).stringify();
    temp52 = (String(lv_xml).toLowerCase().includes(String(`RadioButton`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp52);
    temp53 = (String(lv_xml).toLowerCase().includes(String(`Option A`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp53);
  }

  test_progress_ind() {
    let lv_xml = ``;
    let temp54 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).progress_indicator({ percentvalue: `75`, displayvalue: `75%`, state: `Success` }).stringify();
    temp54 = (String(lv_xml).toLowerCase().includes(String(`ProgressIndicator`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp54);
  }

  test_slider() {
    let lv_xml = ``;
    let temp55 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).slider({ value: `{/SLIDER_VAL}`, min: `0`, max: `100` }).stringify();
    temp55 = (String(lv_xml).toLowerCase().includes(String(`Slider`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp55);
  }

  test_deep_nesting() {
    let lv_xml = ``;
    let temp56 = false;
    let temp57 = false;
    let temp58 = false;
    let temp59 = false;
    let temp60 = false;
    lv_xml = z2ui5_cl_xml_view.factory().shell().page(`Deep`).vbox().hbox().vbox().text(`Level4`).stringify();
    temp56 = (String(lv_xml).toLowerCase().includes(String(`Shell`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp56);
    temp57 = (String(lv_xml).toLowerCase().includes(String(`Page`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp57);
    temp58 = (String(lv_xml).toLowerCase().includes(String(`VBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp58);
    temp59 = (String(lv_xml).toLowerCase().includes(String(`HBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp59);
    temp60 = (String(lv_xml).toLowerCase().includes(String(`Level4`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp60);
  }

  test_multi_get_parent() {
    let lo_view = null;
    let lo_page = null;
    let lo_vbox = null;
    let lo_hbox = null;
    let lo_text = null;
    let lo_back = null;
    let lv_xml = ``;
    let temp61 = false;
    let temp62 = false;
    let temp63 = false;
    lo_view = z2ui5_cl_xml_view.factory();
    lo_page = lo_view.page(`Test`);
    lo_vbox = lo_page.vbox();
    lo_hbox = lo_vbox.hbox();
    lo_text = lo_hbox.text(`inner`);
    lo_back = lo_text.get_parent().get_parent().get_parent();
    lv_xml = lo_back.button({ text: `Added to page` }).stringify();
    temp61 = (String(lv_xml).toLowerCase().includes(String(`VBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp61);
    temp62 = (String(lv_xml).toLowerCase().includes(String(`HBox`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp62);
    temp63 = (String(lv_xml).toLowerCase().includes(String(`Added to page`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp63);
  }

  test_xml_ns_decl() {
    let lv_xml = ``;
    let temp64 = false;
    lv_xml = z2ui5_cl_xml_view.factory().shell().page(`NS Test`).stringify();
    temp64 = (String(lv_xml).toLowerCase().includes(String(`xmlns`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp64);
  }

  test_button_props() {
    let lv_xml = ``;
    let temp65 = false;
    let temp66 = false;
    let temp67 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).button({ text: `Save`, press: `onSave`, icon: `sap-icon://save`, type: `Emphasized`, enabled: true }).stringify();
    temp65 = (String(lv_xml).toLowerCase().includes(String(`Save`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp65);
    temp66 = (String(lv_xml).toLowerCase().includes(String(`sap-icon://save`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp66);
    temp67 = (String(lv_xml).toLowerCase().includes(String(`Emphasized`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp67);
  }

  test_generic_method() {
    let temp1 = [];
    let temp2 = null;
    let lv_xml = ``;
    let temp68 = false;
    let temp69 = false;
    let temp70 = false;
    temp1 = null;
    temp2.n = `myProp`;
    temp2.v = `myValue`;
    temp1.push(temp2);
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`)._generic({ name: `MyCustomControl`, ns: ``, t_prop: temp1 }).stringify();
    temp68 = (String(lv_xml).toLowerCase().includes(String(`MyCustomControl`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp68);
    temp69 = (String(lv_xml).toLowerCase().includes(String(`myProp`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp69);
    temp70 = (String(lv_xml).toLowerCase().includes(String(`myValue`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp70);
  }

  test_segmented_button() {
    let lv_xml = ``;
    let temp71 = false;
    let temp72 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).segmented_button(`{/SEG_KEY}`).items().segmented_button_item({ key: `key1`, text: `Seg1` }).stringify();
    temp71 = (String(lv_xml).toLowerCase().includes(String(`SegmentedButton`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp71);
    temp72 = (String(lv_xml).toLowerCase().includes(String(`SegmentedButtonItem`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp72);
  }

  test_object_header() {
    let lv_xml = ``;
    let temp73 = false;
    let temp74 = false;
    lv_xml = z2ui5_cl_xml_view.factory().page(`Test`).object_header({ title: `Order 123`, number: `1000`, numberunit: `EUR` }).stringify();
    temp73 = (String(lv_xml).toLowerCase().includes(String(`ObjectHeader`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp73);
    temp74 = (String(lv_xml).toLowerCase().includes(String(`Order 123`).toLowerCase()));
    cl_abap_unit_assert.assert_true(temp74);
  }
}



class ltcl_test_xml_output {
  test_attribute_escaping() {
    const lv_xml = z2ui5_cl_xml_view.factory().shell().page(`Escape Test`).button({ text: `A & B "quoted" <tag>` }).stringify();
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`&amp;`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`&lt;`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`&quot;`).toLowerCase())));
  }

  test_no_raw_specials() {
    const lv_xml = z2ui5_cl_xml_view.factory().shell().page(`Escape Test`).button({ text: `A & B <tag>` }).stringify();
    cl_abap_unit_assert.assert_false((String(lv_xml).toLowerCase().includes(String(`<tag>`).toLowerCase())));
    cl_abap_unit_assert.assert_false((String(lv_xml).toLowerCase().includes(String(`A & B`).toLowerCase())));
  }

  test_closing_tags() {
    const lv_xml = z2ui5_cl_xml_view.factory().shell().page(`Nest Test`).vbox().button({ text: `Click` }).stringify();
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`</Page>`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`</Shell>`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`<Button`).toLowerCase())));
  }

  test_stringify_idempotent() {
    const lo_view = z2ui5_cl_xml_view.factory().shell().page(`Stable Test`).button({ text: `Click` });
    cl_abap_unit_assert.assert_equals({ exp: lo_view.stringify(), act: lo_view.stringify() });
  }

  test_z2ui5_cc_namespace() {
    const lv_xml = z2ui5_cl_xml_view.factory_popup().dialog(`NS Test`).content()._z2ui5().timer(`MY_EVENT`).stringify();
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`z2ui5:Timer`).toLowerCase())));
    cl_abap_unit_assert.assert_true((String(lv_xml).toLowerCase().includes(String(`z2ui5.cc`).toLowerCase())));
  }
}



module.exports = {
  __main: "z2ui5_cl_xml_view",
  __classes: { ltcl_unit_test, ltcl_test_xml_output },
  __tests: {"ltcl_unit_test":["test_create","test_factory_popup","test_shell_page","test_simple_form","test_button","test_input","test_label","test_text","test_vbox_hbox","test_table","test_dialog","test_get_parent","test_content","test_columns_cells","test_message_page","test_icon_tab_bar","test_select","test_combobox","test_checkbox","test_date_picker","test_text_area","test_link","test_title","test_toolbar","test_toolbar_spacer","test_scroll_container","test_list","test_switch","test_radio_button","test_progress_ind","test_slider","test_deep_nesting","test_multi_get_parent","test_xml_ns_decl","test_button_props","test_generic_method","test_segmented_button","test_object_header"],"ltcl_test_xml_output":["test_attribute_escaping","test_no_raw_specials","test_closing_tags","test_stringify_idempotent","test_z2ui5_cc_namespace"]},
};
