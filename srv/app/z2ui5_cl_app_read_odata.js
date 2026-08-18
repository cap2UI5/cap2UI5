const cds = require("@sap/cds");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_odata extends z2ui5_if_app {
  customers = [];

  // The builder writes raw XML — every element names its namespace and every
  // attribute is spelled exactly as UI5 expects it (`showIcon`, not
  // `showicon`). Table, Column, ColumnListItem, Text and Input all live in
  // sap.m, so they ride the default namespace declared on the root.
  _view() {
    return z2ui5_cl_ui5_view_builder
      .factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` });
  }

  async main(client) {
    if (client.check_on_init()) {
      // The remote demo service may be unreachable (offline, proxy, service
      // down) — show the error in the UI instead of breaking the app init.
      try {
        const northwind = await cds.connect.to(`northwind`);
        this.customers = await northwind.run(
          SELECT.from(`Customers`).columns(`CompanyName`, `ContactName`).limit(20)
        );
      } catch (e) {
        const view = this._view();
        view
          .ele({ n: `Shell` })
          .ele({ n: `Page` })
          .a({ n: `title`, v: `abap2UI5 - Table with Data Fetched via Remote OData` })
          .tag({ n: `MessageStrip` })
          .a({ n: `text`, v: `Remote Northwind service not reachable: ${e.message}` })
          .a({ n: `type`, v: `Error` })
          .a({ n: `showIcon`, b: true })
          .a({ n: `class`, v: `sapUiSmallMargin` });
        client.view_display(view.stringify());
        client.message_box_display(`Remote Northwind service not reachable: ${e.message}`, `error`);
        return;
      }

      const view = this._view();
      const tab = view
        .ele({ n: `Shell` })
        .ele({ n: `Page` })
        .a({ n: `title`, v: `abap2UI5 - Table with Data Fetched via Remote OData` })
        .ele({ n: `Table` })
        .a({ n: `items`, v: client._bind_edit(this.customers) });

      const columns = tab.ele({ n: `columns` });
      columns.ele({ n: `Column` }).tag({ n: `Text` }).a({ n: `text`, v: `CompanyName` });
      columns.ele({ n: `Column` }).tag({ n: `Text` }).a({ n: `text`, v: `ContactName` });

      tab
        .ele({ n: `items` })
        .ele({ n: `ColumnListItem` })
        .ele({ n: `cells` })
        .tag({ n: `Input` })
        .a({ n: `value`, v: `{COMPANYNAME}` })
        .a({ n: `enabled`, b: true })
        .tag({ n: `Input` })
        .a({ n: `value`, v: `{CONTACTNAME}` })
        .a({ n: `enabled`, b: true });

      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_app_read_odata;
