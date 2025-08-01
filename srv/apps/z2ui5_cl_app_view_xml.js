class z2ui5_cl_app_read_view {

  async main(client) {

    this.client = client;
    const fs = require("fs");
    const path = require("path");
    const viewPath = path.join(__dirname, "View1.view.xml");
    const viewContent = fs.readFileSync(viewPath, "utf8");
    client.display_view(viewContent);
  }
}

module.exports = z2ui5_cl_app_read_view;
