class z2ui5_cl_app_read_odata {

              features = [
                "Enterprise-Ready Web Toolkit",
                "Powerful Development Concepts",
                "Feature-Rich UI Controls",
                "Consistent User Experience",
                "Free and Open Source",
                "Responsive Across Browsers and Devices"
              ];
   
  async main(client) {
    try {
      this.client = client;


      "read xml and display"


      switch (client.get().EVENT) {
        case "BUTTON_POST":
          this.fetchData();
          client.message_toast_display(`this is a test`);
          break;

        default:
          await this.fetchData();
          this.displayView(client);
          break;
      }
    } catch (e) {
      client.message_toast_display(JSON.stringify(e));
    }
  }
}

module.exports = z2ui5_cl_app_read_odata;
