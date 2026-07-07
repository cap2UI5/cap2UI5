const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_033 extends z2ui5_if_app {
  mv_type = ``;
  mv_html = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Illustrated Messages`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
    page.link({ text: `Documentation`, target: `_blank`, href: `https://openui5.hana.ondemand.com/api/sap.m.IllustratedMessageType#properties` });
    page.button({ text: `NoActivities`, press: this.client._event(`sapIllus-NoActivities`) });
    page.button({ text: `AddPeople`, press: this.client._event(`sapIllus-AddPeople`) });
    page.button({ text: `Connection`, press: this.client._event(`sapIllus-Connection`) });
    page.button({ text: `NoDimensionsSet`, press: this.client._event(`sapIllus-NoDimensionsSet`) });
    page.button({ text: `NoEntries`, press: this.client._event(`sapIllus-NoEntries`) });
    page.illustrated_message({ illustrationtype: this.client._bind(this.mv_type) })
      .additional_content()
      .button({ text: `information`, press: this.client._event(`BUTTON_MESSAGE_BOX`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    this.mv_html = `<p>link: <a href="https://www.sap.com" style="color:green; font-weight:600;">link to sap.com</a> - links open in ` + `a new window.</p><p>paragraph: <strong>strong</strong> and <em>emphasized</em>.</p><p>list:</p><ul` + `><li>list item 1</li><li>list item 2<ul><li>sub item 1</li><li>sub item 2</li></ul></li></ul><p>pre:</p><pre>abc def ` + `ghi</pre><p>code: <code>var el = document.getElementById("myId");</code></p><p>cite: <cite>a reference to a source</cite></p>` + `<dl><dt>definition:</dt><dd>definition list of terms and descriptions</dd>`;
    if (client.check_on_init()) {
      this.mv_type = `sapIllus-NoActivities`;
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `BUTTON_MESSAGE_BOX`:
        client.message_box_display(`Action of illustrated message`);
        break;
      default:
        this.mv_type = z2ui5_cl_util.struct_lower_keys(client.get().EVENT);
        break;
    }
    this.view_display();
  }
}

module.exports = z2ui5_cl_demo_app_033;
