// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_unit_assert — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_srt_typedescr — add require manually

class z2ui5_cl_srt_aunit {
  static serialize_deserialize({ variable } = {}) {
    // TODO(abap2js): FIELD-SYMBOLS <variable1> TYPE any.
    let rtti1 = null;
    let srtti1 = null;
    let xstring = null;
    let srtti2 = null;
    let temp1 = null;
    let rtti2 = null;
    let ref_variable2 = null;
    // TODO(abap2js): FIELD-SYMBOLS <variable2> TYPE any.
    // TODO(abap2js): ASSIGN variable TO <variable1>.
    rtti1 = cl_abap_typedescr.describe_by_data(variable1);
    srtti1 = z2ui5_cl_srt_typedescr.create_by_data_object(variable1);
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE srtti = srtti1 dobj = <variable1> RESULT XML xstring OPTIONS data_refs = 'heap-or-create'.
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML xstring RESULT srtti = srtti2.
    temp1 = srtti2.get_rtti();
    rtti2 = temp1;
    // TODO(abap2js): CREATE DATA ref_variable2 TYPE HANDLE rtti2.
    // TODO(abap2js): ASSIGN ref_variable2->* TO <variable2>.
    // TODO(abap2js): CALL TRANSFORMATION id SOURCE XML xstring RESULT dobj = <variable2>.
    cl_abap_unit_assert.assert_equals({ exp: rtti1, act: rtti2 });
    cl_abap_unit_assert.assert_equals({ exp: variable1, act: variable2 });
  }
}

module.exports = z2ui5_cl_srt_aunit;
