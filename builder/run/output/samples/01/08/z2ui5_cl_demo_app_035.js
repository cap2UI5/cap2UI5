const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_035 extends z2ui5_if_app {
  mv_type = ``;
  mv_path = ``;
  mv_editor = ``;
  mv_check_editable = false;
  lt_types = [];
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - File Editor`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const temp = page.simple_form({ title: `File`, editable: true })
      .content(`form`)
      .label(`path`)
      .input(this.client._bind_edit(this.mv_path))
      .label(`Option`);
    this.lt_types = {};
    const temp3 = temp.input({ value: this.client._bind_edit(this.mv_type), suggestionitems: this.client._bind(this.lt_types) })
      .get();
    temp3.suggestion_items().list_item({ text: `{N}`, additionaltext: `{V}` });
    temp.label(``)
      .button({ text: `Download`, press: this.client._event(`DB_LOAD`), icon: `sap-icon://download-from-cloud` });
    page.code_editor({ type: this.client._bind_edit(this.mv_type), editable: this.client._bind(this.mv_check_editable), value: this.client._bind_edit(this.mv_editor) });
    page.footer()
      .overflow_toolbar()
      .button({ text: `Clear`, press: this.client._event(`CLEAR`), icon: `sap-icon://delete` })
      .toolbar_spacer()
      .button({ text: `Edit`, press: this.client._event(`EDIT`), icon: `sap-icon://edit` })
      .button({ text: `Upload`, press: this.client._event(`DB_SAVE`), type: `Emphasized`, icon: `sap-icon://upload-to-cloud`, enabled: (this.mv_editor) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.mv_path = `../../demo/text`;
      this.mv_type = `plain_text`;
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `DB_LOAD`:
        this.mv_editor = (String(this.mv_path).toLowerCase().includes(String(`abap`).toLowerCase()) ? this.read_abap() : String(this.mv_path).toLowerCase().includes(String(`json`).toLowerCase()) ? this.read_json() : String(this.mv_path).toLowerCase().includes(String(`yaml`).toLowerCase()) ? this.read_yaml() : String(this.mv_path).toLowerCase().includes(String(`text`).toLowerCase()) ? this.read_text() : String(this.mv_path).toLowerCase().includes(String(`js`).toLowerCase()) ? this.read_js() : null);
        client.message_toast_display(`Download successful`);
        client.view_model_update();
        break;
      case `DB_SAVE`:
        client.message_box_display(`Upload successful. File saved!`, `success`);
        break;
      case `EDIT`:
        this.mv_check_editable = (!(this.mv_check_editable === true || this.mv_check_editable === `X`));
        client.view_model_update();
        break;
      case `CLEAR`:
        this.mv_editor = ``;
        break;
    }
  }

  read_abap() {
    let r_result = ``;
    let sy_subrc = 0;
    r_result = `METHOD SELECT_FILES.` + `
` + `
` + `    DATA: LV_RET_CODE TYPE I,` + `
` + `          LV_USR_AXN  TYPE I.` + `
` + `
` + `    CL_GUI_FRONTEND_SERVICES=>FILE_OPEN_DIALOG(` + `
` + `      EXPORTING` + `
` + `        WINDOW_TITLE            = 'Select file'` + `
` + `        MULTISELECTION          = 'X'` + `
` + `      CHANGING` + `
` + `        FILE_TABLE              = ME->PT_FILETAB` + `
` + `        RC                      = LV_RET_CODE` + `
` + `        USER_ACTION             = LV_USR_AXN` + `
` + `      EXCEPTIONS` + `
` + `        FILE_OPEN_DIALOG_FAILED = 1` + `
` + `        CNTL_ERROR              = 2` + `
` + `        ERROR_NO_GUI            = 3` + `
` + `        NOT_SUPPORTED_BY_GUI    = 4` + `
` + `        OTHERS                  = 5` + `
` + `           ).` + `
` + `    IF SY-SUBRC <> 0 OR` + `
` + `       LV_USR_AXN = CL_GUI_FRONTEND_SERVICES=>ACTION_CANCEL.` + `
` + `      RAISE EX_FILE_SEL_ERR.` + `
` + `    ENDIF.` + `
` + `
` + `  ENDMETHOD.   `;
    return r_result;
  }

  read_json() {
    let r_result = ``;
    r_result = `{` + `
` + `    "quiz": {` + `
` + `        "sport": {` + `
` + `            "q1": {` + `
` + `                "test" : false,` + `
` + `                "question": "Which one is correct team name in NBA?",` + `
` + `                "options": [` + `
` + `                    "New York Bulls",` + `
` + `                    "Los Angeles Kings",` + `
` + `                    "Golden State Warriros",` + `
` + `                    "Huston Rocket"` + `
` + `                ],` + `
` + `                "answer": "Huston Rocket"` + `
` + `            }` + `
` + `        },` + `
` + `        "maths": {` + `
` + `            "q1": {` + `
` + `                "question": "5 + 7 = ?",` + `
` + `                "options": [` + `
` + `                    "10",` + `
` + `                    "11",` + `
` + `                    "12",` + `
` + `                    "13"` + `
` + `                ],` + `
` + `                "answer": "12"` + `
` + `            },` + `
` + `            "q2": {` + `
` + `                "question": true,` + `
` + `                "options": [` + `
` + `                    "1",` + `
` + `                    "2",` + `
` + `                    "3",` + `
` + `                    "4"` + `
` + `                ],` + `
` + `                "answer": 487829` + `
` + `            }` + `
` + `        }` + `
` + `    }` + `
` + `}`;
    return r_result;
  }

  read_js() {
    let r_result = ``;
    r_result = `function showAlert() {` + `
` + `    alert("Alert from JS file");` + `
` + `}` + `
` + `
` + `function updateHeading() {` + `
` + `    document.getElementById('heading').innerHTML = 'Heading changed with JS';` + `
` + `}`;
    return r_result;
  }

  read_yaml() {
    let r_result = ``;
    r_result = `# Employee records` + `
` + `- martin:` + `
` + `    name: Martin Developer` + `
` + `    job: Developer` + `
` + `    skills:` + `
` + `      - python` + `
` + `      - perl` + `
` + `      - pascal` + `
` + `- tabitha:` + `
` + `    name: Tabitha Bitumen` + `
` + `    job: Developer` + `
` + `    skills:` + `
` + `      - lisp` + `
` + `      - fortran` + `
` + `      - erlang`;
    return r_result;
  }

  read_text() {
    let r_result = ``;
    r_result = `TXT test file` + `
` + `Purpose: Provide example of this file type` + `
` + `Document file type: TXT` + `
` + `Version: 1.0` + `
` + `Remark:` + `
` + `
` + `Example content:` + `
` + `The names "John Doe" for males, "Jane Doe" or "Jane Roe" for females, or "Jonnie Doe" and "Janie Doe" for children, or just ` + ` "Doe" non-gender-specifically are used as placeholder names for a party whose true identity is unknown or must ` + `be withheld in a legal action, case, or discussion. The names are also used to refer to a corpse or hospital patient whose ` + `identity is unknown. This practice is widely used in the United States and Canada, but is rarely used in other ` + `English-speaking countries including the United Kingdom itself, from where the use of "John Doe" in a legal context ` + `originates. The names Joe Bloggs or John Smith are used in the UK instead, as well as in Australia and New Zealand.` + `
` + `
` + `John Doe is sometimes used to refer to a typical male in other contexts as well, in a similar manner to John Q. Public,` + ` known in Great Britain as Joe Public, John Smith or Joe Bloggs. For example, the first name listed on a form is often ` + `John Doe, along with a fictional address or other fictional information to provide an example of how to fill in the form` + `. The name is also used frequently in popular culture, for example in the Frank Capra film Meet John Doe. John Doe was ` + `also the name of a 2002 American television series.`;
    return r_result;
  }
}

module.exports = z2ui5_cl_demo_app_035;
