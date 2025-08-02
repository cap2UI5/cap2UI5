class z2ui5_cl_app_read_view {

  features = [
    "Enterprise-Ready Web Toolkit",
    "Powerful Development Concepts",
    "Feature-Rich UI Controls",
    "Consistent User Experience",
    "Free and Open Source",
    "Responsive Across Browsers and Devices",
  ];

  async main(client) {
   
    const fs = require("fs");
    const path = require("path");
    const viewPath = path.join(__dirname, "View1.view.xml");
    const viewContent = fs.readFileSync(viewPath, "utf8");

    client.display_view(viewContent);
    client._bind(this.features);
  }
}

module.exports = z2ui5_cl_app_read_view;
