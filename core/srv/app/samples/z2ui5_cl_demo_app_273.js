const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_273 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    let base_url = `https://sapui5.hana.ondemand.com/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: LightBox`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/entity/sap.m.LightBox/sample/sap.m.sample.LightBox` });
    page.message_strip({ text: `Clicking on each of the images will open a LightBox, showing the real size of the image. ` + `Images will be scaled down if their size is bigger than the window size." class="sapUiSmallMargin`, class: `sapUiSmallMargin` })
      .list()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-6100.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-6100-large.jpg`, alt: `Beamer`, title: `This is a beamer`, subtitle: `This is beamer's description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Beamer`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-6120.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-6120-large.jpg`, alt: `USB`, title: `This is a USB`, subtitle: `This is USB's description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`USB`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-7777.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/HT-7777-large.jpg`, alt: `Speakers`, title: `These are speakers`, subtitle: `This is speakers' description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Speakers`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/ALotOfElephants_small.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/ALotOfElephants.jpg`, alt: `Nature image`, title: `This is a sample image`, subtitle: `This is a place for description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Nature image`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/flatFish.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/flatFish.jpg`, alt: `Nature image`, title: `This is a sample image`, subtitle: `This is a place for description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Nature image`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/horses.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/horses.jpg`, alt: `Nature image`, title: `This is a sample image`, subtitle: `This is a place for description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Nature image`)
      .text(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum lectus et tempus blandit.` + `Sed porta ex quis tortor gravida, ut suscipit felis dignissim. Ut iaculis elit vel ligula scelerisque,` + `et porttitor est pretium. Suspendisse purus dolor, fermentum in tortor eu, semper finibus velit.` + `Proin vel lobortis leo, vel eleifend lorem. Etiam ac erat sollicitudin, condimentum magna ac,` + `venenatis lacus. Pellentesque non mauris consectetur, tristique arcu id, aliquet tortor.`)
      .get_parent()
      .get_parent()
      .custom_list_item()
      .hbox({ class: `sapUiSmallMargin` })
      .image({ src: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/elephant.jpg`, decorative: false, width: `170px`, densityaware: false })
      .get()
      .detail_box()
      .light_box()
      .light_box_item({ imagesrc: base_url + `test-resources/sap/ui/documentation/sdk/images/nature/image_does_not_exist.jpg`, alt: `Nature image`, title: `This is a sample image`, subtitle: `This is a place for description` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMarginBegin`)
      .title(`Unavailable image`)
      .text(`Shows an error when an image could not be loaded, or when it takes too much time to load it.`)
      .get_parent()
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Displays several image thumbnails. Clicking on each of them will open a LightBox.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_273;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

