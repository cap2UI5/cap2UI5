const View = require("../core/srv/z2ui5/02/z2ui5_cl_xml_view");

// Regression tests for the frontend module-load error
// `ModuleError: failed to load 'null/content.js'`: aggregation tags rendered
// without a namespace prefix (and without a default xmlns on the root) end up
// in the null XML namespace, which UI5's XMLTemplateProcessor resolves as a
// control module request against the default resource root.
describe("z2ui5_cl_xml_view namespaces", () => {
  test("root declares a default xmlns like the abap original", () => {
    const xml = View.factory().stringify();
    expect(xml).toContain('<mvc:View xmlns="sap.m"');

    const popup = View.factory_popup().stringify();
    expect(popup).toContain('<core:FragmentDefinition xmlns="sap.m"');
  });

  test("aggregation accessors inherit the parent element's namespace", () => {
    const view = View.factory();
    const page = view.Shell().Page({ title: "t" });
    page.simple_form({ editable: true }).content().Label({ text: "Step 1" });
    const xml = view.stringify();

    expect(xml).toContain("<form:content >");
    expect(xml).toContain("</form:content>");
    expect(xml).not.toMatch(/<content[ />]/);
  });

  test("aggregation accessors accept the ns positionally (abap style) and as { ns }", () => {
    const view = View.factory();
    const page = view.Shell().Page({});
    page.simple_form({}).content(`form`);
    page.simple_form({}).content({ ns: `form` });
    const xml = view.stringify();

    expect((xml.match(/<form:content \/>/g) || []).length).toBe(2);
  });

  test("bare aggregation calls on sap.m parents render with the m prefix", () => {
    const view = View.factory();
    const page = view.Shell().Page({});
    page.list({}).items().ColumnListItem();
    page.footer();
    const xml = view.stringify();

    expect(xml).toContain("<m:items >");
    expect(xml).toContain("<m:footer />");
  });

  test("heading and sub_sections return the created child for chaining", () => {
    const view = View.factory();
    const section = view.Shell().object_page_layout({}).sections().object_page_section({ title: "s" });
    section.heading(`uxap`).message_strip?.(`strip`);
    const subSections = section.sub_sections();
    expect(subSections.name).toBe("subSections");
    const xml = view.stringify();
    expect(xml).toContain("<uxap:heading");
  });

  test("namespaces outside the baseline are declared on the root on demand", () => {
    const view = View.factory();
    const page = view.Shell().Page({});
    page.cc("InteractiveBarChart", { ns: "mchart" });
    page._generic({ name: "style", ns: "html" });
    const xml = view.stringify();

    expect(xml).toContain('xmlns:mchart="sap.suite.ui.microchart"');
    expect(xml).toContain('xmlns:html="http://www.w3.org/1999/xhtml"');
  });

  test("unknown namespace prefixes fail fast at stringify", () => {
    const view = View.factory();
    view.Shell().cc("X", { ns: "doesnotexist" });
    expect(() => view.stringify()).toThrow("XML_VIEW_ERROR_NO_NAMESPACE_FOUND_FOR: doesnotexist");
  });

  test("_cc_plain_xml emits the raw value instead of a ZZPLAIN tag", () => {
    const view = View.factory();
    view.Shell().Page({})._generic({ name: "style", ns: "html" })._cc_plain_xml(`.x:hover { color: red }`);
    const xml = view.stringify();

    expect(xml).toContain("<html:style >.x:hover { color: red }</html:style>");
    expect(xml).not.toContain("ZZPLAIN");
  });
});
