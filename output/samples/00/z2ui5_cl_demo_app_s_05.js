const z2ui5_cl_demo_app_s_05_ws = require("./z2ui5_cl_demo_app_s_05_ws");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_05 extends z2ui5_if_app {
  news_input = ``;
  author_input = ``;
  news_list = [];
  connections = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.connections = z2ui5_cl_demo_app_s_05_ws.get_active_connections();
    }
    if ((client.get().EVENT)) {
      this.on_event();
      client.view_model_update();
      return;
    }
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CLEAR`:
        this.news_list = {};
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display();
        break;
    }
  }

  view_display() {
    // TODO(abap2js): SELECT SINGLE FROM icfservloc FIELDS icfactive WHERE icf_name = `Z2UI5_SAMPLE` INTO @DATA(icfactive).
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: News Feed over WebSocket`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    if (icfactive === false) {
      page.message_strip({ text: `ICF Service '/sap/bc/apc/sap/z2ui5_sample' is not active. WebSocket communication will not work. Please activate the ICF Service in transaction SICF.`, type: `Warning`, visible: true });
    }
    const form = page.simple_form({ editable: true, title: `Publish news`, class: `sapUiTinyMarginBottom` })
      .content(`form`);
    form.feed_input({ value: this.client._bind_edit(this.news_input), post: this.client._event_client(`Z2UI5`, [`feedInputPost`]) });
    form.label({ text: `Author` })
      .input({ value: this.client._bind_edit(this.author_input), placeholder: `Anonymous` });
    page.list({ headertext: `News`, items: this.client._bind_edit(this.news_list) })
      .feed_list_item({ sender: `{AUTHOR}`, text: `{TEXT}`, showicon: false });
    const footer = page.footer().overflow_toolbar();
    footer.info_label({ text: this.client._bind_edit(this.connections), colorscheme: `7`, icon: `sap-icon://connected` });
    footer.toolbar_spacer().button({ text: `Clear`, icon: `sap-icon://clear-all`, press: this.client._event(`CLEAR`) });
    if (this.client.check_on_init()) {
      view._generic({ name: `script`, ns: `html` })
        ._cc_plain_xml(`(()=>{ ` + ` const ws_url = (window.location.origin + '/sap/bc/apc/sap/z2ui5_sample').replace('http','ws');` + ` try { ` + ` ws = new WebSocket(ws_url);` + ` } catch (err) {` + ` alert(err);` + ` }` + ` ws.onopen = ()=>{};` + ` ws.onmessage = (msg)=>{` + ` const model = z2ui5.oController.oView.getModel();` + ` const data = model.getData();` + ` if (msg.data === '` + z2ui5_cl_demo_app_s_05_ws.c_msg.__new_connection__ + `') {` + ` data.XX.CONNECTIONS += 1;` + ` } else if (msg.data === '` + z2ui5_cl_demo_app_s_05_ws.c_msg.__closed__ + `') {` + ` data.XX.CONNECTIONS -= 1;` + ` } else {` + ` data.XX.NEWS_LIST.push(JSON.parse(msg.data));` + ` }` + ` model.setData(data);` + ` };` + ` ws.onclose = (msg)=>{};` + `})()`);
      view._generic({ name: `script`, ns: `html` })
        ._cc_plain_xml(`z2ui5.feedInputPost = () => { ` + ` const model = z2ui5.oView.getModel();` + ` const data = model.getData();` + ` ws.send(JSON.stringify({ ` + ` TEXT : data.XX.NEWS_INPUT,` + ` AUTHOR : data.XX.AUTHOR_INPUT ` + ` }));` + ` setTimeout( () => { ` + ` data.XX.NEWS_INPUT = "";` + ` model.setData(data);` + ` }, 10 ); ` + `}`);
    }
    this.client.view_display(view.stringify());
  }

  popover_display() {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample shows how to consume APC messages over websocket. Open the app multiple times and post something.` });
    this.client.popover_display(view.stringify(), `button_hint_id`);
  }
}

module.exports = z2ui5_cl_demo_app_s_05;
