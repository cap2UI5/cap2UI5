const Handler = require("../../core/srv/z2ui5/01/02/z2ui5_cl_core_handler");
const DB = require("../../core/srv/z2ui5/01/01/z2ui5_cl_core_srv_draft");

// Mock only the async DB methods that need CDS runtime;
// keep static utility methods (findAppClass, serialize, etc.) from the real module
jest.mock("../../core/srv/z2ui5/01/01/z2ui5_cl_core_srv_draft", () => {
  const actual = jest.requireActual("../../core/srv/z2ui5/01/01/z2ui5_cl_core_srv_draft");
  actual.loadApp = jest.fn().mockResolvedValue(null);
  actual.saveApp = jest.fn().mockResolvedValue("mock-uuid-123");
  actual.loadPreviousApp = jest.fn().mockResolvedValue(null);
  return actual;
});

// Returns the raw body — same shape as what the abap2UI5 wire format puts into
// the request payload. handler.main(body) consumes it directly.
function makeRequest({ event = "", id = "", xx = {}, args = [] } = {}) {
  return {
    S_FRONT: {
      EVENT: event,
      ID: id,
      CONFIG: {},
      ORIGIN: "http://localhost:4004",
      PATHNAME: "/index.html",
      SEARCH: "",
      VIEW: "",
      HASH: "",
      T_EVENT_ARG: args,
    },
    XX: xx,
  };
}

describe("z2ui5_cl_core_handler", () => {
  let handler;

  beforeEach(() => {
    handler = new Handler();
    jest.clearAllMocks();
  });

  // ===== Initial request =====

  describe("initial request (no ID)", () => {
    test("returns startup app when no ID given", async () => {
      const req = makeRequest();
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_startup");
      expect(result.S_FRONT.ID).toBe("mock-uuid-123");
      expect(result.S_FRONT.PARAMS.S_VIEW.XML).toBeTruthy();
    });

    test("returns valid XML view", async () => {
      const req = makeRequest();
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.PARAMS.S_VIEW.XML).toContain("<mvc:View");
      expect(result.S_FRONT.PARAMS.S_VIEW.XML).toContain("</mvc:View>");
    });

    test("calls DB.saveApp", async () => {
      const req = makeRequest();
      await handler.main(req);

      expect(DB.saveApp).toHaveBeenCalled();
    });
  });

  // ===== App loading =====

  describe("app loading from DB", () => {
    test("loads app from DB when ID is provided", async () => {
      const HelloWorld = require("../../core/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const app = new HelloWorld();
      app.NAME = "Loaded";
      DB.loadApp.mockResolvedValueOnce(app);

      const req = makeRequest({ id: "existing-id" });
      const result = JSON.parse(await handler.main(req));

      expect(DB.loadApp).toHaveBeenCalledWith("existing-id");
      expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_hello_world");
    });

    test("falls back to startup when DB returns null", async () => {
      DB.loadApp.mockResolvedValueOnce(null);

      const req = makeRequest({ id: "missing-id" });
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_startup");
    });
  });

  // ===== Two-way binding =====

  describe("two-way binding (XX data)", () => {
    test("XX data is applied to loaded app", async () => {
      const HelloWorld = require("../../core/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const app = new HelloWorld();
      DB.loadApp.mockResolvedValueOnce(app);

      const req = makeRequest({
        id: "some-id",
        event: "BUTTON_POST",
        xx: { name: "World" },
      });

      const result = JSON.parse(await handler.main(req));

      // The app should have received the XX data
      expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_hello_world");
      // MessageBox should contain the name
      expect(result.S_FRONT.PARAMS.S_MSG_BOX.TEXT).toContain("World");
    });
  });

  // ===== Navigation =====

  describe("navigation", () => {
    test("nav_app_call from previous-app handler navigates correctly", async () => {
      // Simulate: a custom app (running in DB) navigates to hello_world via nav_app_call.
      const HelloWorld = require("../../core/srv/z2ui5/02/z2ui5_cl_app_hello_world");
      const z2ui5_if_app = require("../../core/srv/z2ui5/02/z2ui5_if_app");

      // Use a one-off caller app whose only behavior is to push HelloWorld
      class CallerApp extends z2ui5_if_app {
        async main(client) {
          if (client.check_on_event("GO")) {
            client.nav_app_call(new HelloWorld());
          }
        }
      }
      DB.loadApp.mockResolvedValueOnce(new CallerApp());

      const req = makeRequest({ id: "caller-id", event: "GO" });
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.APP).toBe("z2ui5_cl_app_hello_world");
      expect(result.S_FRONT.PARAMS.S_VIEW.XML).toMatch(/Hello World|Send/);
    });
  });

  // ===== Response structure =====

  describe("response structure", () => {
    test("response has required S_FRONT fields", async () => {
      const req = makeRequest();
      const result = JSON.parse(await handler.main(req));

      expect(result).toHaveProperty("S_FRONT");
      expect(result.S_FRONT).toHaveProperty("APP");
      expect(result.S_FRONT).toHaveProperty("ID");
      expect(result.S_FRONT).toHaveProperty("PARAMS");
      // PARAMS only contains the slots that were actually set this roundtrip
      // — abap mirror, response_abap_to_json drops null/empty entries via
      // z2ui5_cl_util_json_fltr=>create_no_empty_values. The startup app
      // displays a view, so S_VIEW must be present; the rest stay absent.
      expect(result.S_FRONT.PARAMS).toHaveProperty("S_VIEW");
    });

    test("response has MODEL with XX", async () => {
      const req = makeRequest();
      const result = JSON.parse(await handler.main(req));

      expect(result).toHaveProperty("MODEL");
      expect(result.MODEL).toHaveProperty("XX");
    });

    test("response is valid JSON string", async () => {
      const req = makeRequest();
      const rawResult = await handler.main(req);
      expect(typeof rawResult).toBe("string");
      expect(() => JSON.parse(rawResult)).not.toThrow();
    });
  });

  // ===== Messages =====

  describe("messages in response", () => {
    // A minimal in-test app that exercises the client message API directly,
    // so the plumbing check does not depend on a specific mirrored sample.
    const z2ui5_if_app = require("../../core/srv/z2ui5/02/z2ui5_if_app");
    class MsgApp extends z2ui5_if_app {
      async main(client) {
        if (client.check_on_event("TOAST")) {
          client.message_toast_display("this is a message toast");
        } else if (client.check_on_event("BOX")) {
          client.message_box_display("Your booking will be reserved for 24 hours.");
        }
      }
    }

    test("toast message appears in response", async () => {
      DB.loadApp.mockResolvedValueOnce(new MsgApp());

      const req = makeRequest({ id: "msg-id", event: "TOAST" });
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.PARAMS.S_MSG_TOAST).not.toBeNull();
      expect(result.S_FRONT.PARAMS.S_MSG_TOAST.TEXT).toContain("toast");
    });

    test("message box appears in response", async () => {
      DB.loadApp.mockResolvedValueOnce(new MsgApp());

      const req = makeRequest({ id: "msg-id", event: "BOX" });
      const result = JSON.parse(await handler.main(req));

      expect(result.S_FRONT.PARAMS.S_MSG_BOX).not.toBeNull();
      expect(result.S_FRONT.PARAMS.S_MSG_BOX.TEXT).toContain("Your booking");
    });
  });
});
