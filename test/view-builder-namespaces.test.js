const builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

/**
 * Namespace regressions in generated views.
 *
 * The failure mode being guarded is specific and expensive to diagnose: a UI5
 * element that ends up in the wrong XML namespace does not render wrong, it
 * fails to LOAD. XMLTemplateProcessor resolves an unprefixed tag against the
 * view's default xmlns and requests a control module for it, so a
 * `<SimpleForm>` under `xmlns="sap.m"` becomes a request for
 * `sap/m/SimpleForm.js` and the whole view dies with a ModuleError — no
 * partial render, no useful message.
 *
 * (This suite replaces the one that covered the retired z2ui5_cl_xml_view,
 * which resolved namespaces on the app's behalf. The current builder does
 * not: the caller names the namespace, which is why it is worth testing.)
 */
describe("view builder namespaces", () => {
  const root = () =>
    builder
      .factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });

  test("the root declares a default namespace", () => {
    // Without it every unprefixed tag lands in the null namespace and UI5
    // resolves it as `null/<Tag>.js`.
    expect(root().stringify()).toContain(`<mvc:View xmlns="sap.m"`);
  });

  test("a prefixed element keeps its prefix on the closing tag too", () => {
    const view = root();
    view
      .ele({ n: `SimpleForm`, ns: `form` })
      .ele({ n: `content`, ns: `form` })
      .tag({ n: `Label` })
      .a({ n: `text`, v: `x` });
    const xml = view.stringify();

    expect(xml).toContain(`<form:SimpleForm>`);
    expect(xml).toContain(`<form:content>`);
    expect(xml).toContain(`</form:content>`);
    expect(xml).toContain(`</form:SimpleForm>`);
    // an element with no children self-closes, and keeps the prefix there too
    expect(root().ele({ n: `content`, ns: `form` }).stringify()).toContain(`<form:content/>`);
  });

  test("an aggregation must carry its parent's namespace explicitly", () => {
    // SimpleForm lives in sap.ui.layout.form and so does its `content`
    // aggregation. Writing `content` unprefixed is the mistake this suite
    // exists for — it is accepted by the builder and fatal in the browser.
    const wrong = root();
    wrong.ele({ n: `SimpleForm`, ns: `form` }).ele({ n: `content` });
    expect(wrong.stringify()).toMatch(/<content[ />]/);

    const right = root();
    right.ele({ n: `SimpleForm`, ns: `form` }).ele({ n: `content`, ns: `form` });
    expect(right.stringify()).not.toMatch(/<content[ />]/);
  });

  test("the shipped apps render every aggregation namespaced", () => {
    // The real regression guard: whatever the framework's own apps build must
    // not contain an unprefixed aggregation tag. `content` is the one that
    // actually broke; check the family.
    const z2ui5_cl_ui5_app_hi_world = require("abap2UI5/z2ui5_cl_ui5_app_hi_world");
    const captured = {};
    const client = {
      check_on_init: () => true,
      check_on_event: () => false,
      check_on_navigated: () => true,
      view_display: (xml) => { captured.xml = xml; },
      _bind_edit: () => `{/XX/NAME}`,
      _event: (e) => `.eB(['${e}'])`,
    };

    return new z2ui5_cl_ui5_app_hi_world().main(client).then(() => {
      expect(captured.xml).toBeTruthy();
      for (const tag of ["content", "items", "columns", "cells", "headerContent", "footer"]) {
        expect(captured.xml).not.toMatch(new RegExp(`<${tag}[ />]`));
      }
      // …and the namespace it needs is actually declared
      expect(captured.xml).toContain(`xmlns:form="sap.ui.layout.form"`);
      expect(captured.xml).toContain(`<form:content>`);
    });
  });
});
