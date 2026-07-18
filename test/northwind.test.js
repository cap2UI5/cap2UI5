/**
 * NorthwindCustomers READ handler (srv/z2ui5-service.js) — the request must
 * be forwarded to the remote 'northwind' OData service and its rows
 * returned through the AdminService projection. The remote is mocked at
 * cds.connect.to, so the test runs offline and only exercises our wiring.
 */
const path = require("path");
const cds = require("@sap/cds");

const { GET } = cds.test(path.join(__dirname, ".."));

describe("NorthwindCustomers remote proxy", () => {
  test("READ forwards the query to the northwind service", async () => {
    const rows = [
      { CustomerID: "ALFKI", CompanyName: "Alfreds Futterkiste" },
      { CustomerID: "ANATR", CompanyName: "Ana Trujillo Emparedados" },
    ];
    const seen = [];
    const orig = cds.connect.to;
    cds.connect.to = async function (name, ...rest) {
      if (name === "northwind") return { run: async (query) => (seen.push(query), rows) };
      return orig.call(this, name, ...rest);
    };
    try {
      const res = await GET("/odata/v4/admin/NorthwindCustomers");
      expect(res.status).toBe(200);
      expect(res.data.value.map((r) => r.CustomerID)).toEqual(["ALFKI", "ANATR"]);
      expect(res.data.value[0].CompanyName).toBe("Alfreds Futterkiste");
      expect(seen).toHaveLength(1); // exactly one forwarded query
    } finally {
      cds.connect.to = orig;
    }
  });
});
