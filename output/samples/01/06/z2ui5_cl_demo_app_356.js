const z2ui5_cl_util_xml = require("abap2UI5/z2ui5_cl_util_xml");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_356 extends z2ui5_if_app {
  input_a = ``;
  input_b = ``;
  input_c = ``;

  async main(client) {
    const view = z2ui5_cl_util_xml.factory();
    const root = view.__({ n: `View`, ns: `mvc`, p: [{ n: `displayBlock`, v: true }, { n: `height`, v: `100%` }, { n: `xmlns`, v: `sap.m` }, { n: `xmlns:l`, v: `sap.ui.layout` }, { n: `xmlns:mvc`, v: `sap.ui.core.mvc` }] });
    const page = root.__(`Shell`)
      .__({ n: `Page`, p: [{ n: `navButtonPress`, v: client._event_nav_app_leave() }, { n: `showNavButton`, v: client.check_app_prev_stack() }, { n: `title`, v: `abap2UI5 - Label` }] });
    page.__(`headerContent`)
      ._({ n: `Link`, p: [{ n: `href`, v: `https://ui5.sap.com/sdk/#/entity/sap.m.Label/sample/sap.m.sample.Label` }, { n: `target`, v: `_blank` }, { n: `text`, v: `UI5 Demo Kit` }] });
    const layout = page.__({ n: `VerticalLayout`, ns: `l`, p: [{ n: `class`, v: `sapUiContentPadding` }, { n: `width`, v: `100%` }] });
    layout._({ n: `Label`, p: [{ n: `labelFor`, v: `input-a` }, { n: `text`, v: `Label A (required)` }] })
      ._({ n: `Input`, p: [{ n: `id`, v: `input-a` }, { n: `required`, v: true }, { n: `value`, v: client._bind_edit(this.input_a) }] })
      ._({ n: `Label`, p: [{ n: `design`, v: `Bold` }, { n: `labelFor`, v: `input-b` }, { n: `text`, v: `Label B (bold)` }] })
      ._({ n: `Input`, p: [{ n: `id`, v: `input-b` }, { n: `value`, v: client._bind_edit(this.input_b) }] })
      ._({ n: `Label`, p: [{ n: `labelFor`, v: `input-c` }, { n: `text`, v: `Label C (normal)` }] })
      ._({ n: `Input`, p: [{ n: `id`, v: `input-c` }, { n: `value`, v: client._bind_edit(this.input_c) }] });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_356;
