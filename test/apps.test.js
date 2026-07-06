const Client = require("../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_client");

function createClient(app, { event = "", args = [] } = {}) {
  const client = new Client();
  client.oApp = app;
  client.oReq = {
    S_FRONT: { EVENT: event, T_EVENT_ARG: args },
  };
  return client;
}

describe("sample apps", () => {
  // ===== z2ui5_cl_app_hello_world =====

  describe("z2ui5_cl_app_hello_world", () => {
    let AppClass;

    beforeEach(() => {
      AppClass = require("../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_hello_world");
    });

    test("init renders view with input and button", async () => {
      const app = new AppClass();
      const client = createClient(app);
      await app.main(client);

      expect(client.S_VIEW.XML).toContain("Hello World");
      expect(client.S_VIEW.XML).toContain("<m:Input");
      expect(client.S_VIEW.XML).toContain("<m:Button");
      expect(client.S_VIEW.XML).toContain("BUTTON_POST");
    });

    test("BUTTON_POST shows MessageBox with name", async () => {
      const app = new AppClass();
      app.name = "TestUser";
      const client = createClient(app, { event: "BUTTON_POST" });
      await app.main(client);

      expect(client.S_MSG_BOX.TEXT).toContain("TestUser");
    });
  });

  // ===== z2ui5_cl_app_startup =====

  describe("z2ui5_cl_app_startup", () => {
    let AppClass;

    beforeEach(() => {
      AppClass = require("../cap2UI5/srv/z2ui5/02/z2ui5_cl_app_startup");
    });

    test("default event renders startup view with quickstart sections", async () => {
      const app = new AppClass();
      const client = createClient(app);
      await app.main(client);

      expect(client.S_VIEW.XML).toContain("abap2UI5");
      expect(client.S_VIEW.XML).toContain("Quickstart");
      expect(client.S_VIEW.XML).toContain("What's next?");
      expect(client.S_VIEW.XML).toContain("Contribution");
      expect(client.S_VIEW.XML).toContain("Documentation");
    });

    test("BUTTON_CHECK with valid class flips button to Edit + sets URL", async () => {
      const app = new AppClass();
      app.client = null;  // will be set by main
      app.ms_home.classname = "z2ui5_cl_app_hello_world";
      const client = createClient(app, { event: "BUTTON_CHECK" });
      // ensure init defaults (z2ui5_on_init resets state); manually set classname after
      await app.main(client);

      expect(app.ms_home.btn_text).toBe("Edit");
      expect(app.ms_home.btn_event_id).toBe("BUTTON_CHANGE");
      expect(app.ms_home.class_value_state).toBe("Success");
      expect(app.ms_home.class_editable).toBe(false);
    });

    test("BUTTON_CHECK with invalid class shows error MessageBox", async () => {
      const app = new AppClass();
      app.ms_home.classname = "z2ui5_does_not_exist";
      const client = createClient(app, { event: "BUTTON_CHECK" });
      await app.main(client);

      expect(client.S_MSG_BOX).not.toBeNull();
      expect(client.S_MSG_BOX.TEXT).toMatch(/not found|could not be loaded/i);
      expect(app.ms_home.class_value_state).toBe("Warning");
    });

    test("BUTTON_CHANGE resets the button state", async () => {
      const app = new AppClass();
      app.ms_home.btn_text = "Edit";
      app.ms_home.btn_event_id = "BUTTON_CHANGE";
      app.ms_home.class_editable = false;
      const client = createClient(app, { event: "BUTTON_CHANGE" });
      await app.main(client);

      expect(app.ms_home.btn_text).toBe("Check");
      expect(app.ms_home.btn_event_id).toBe("BUTTON_CHECK");
      expect(app.ms_home.class_editable).toBe(true);
    });

    test("OPEN_DEBUG shows MessageBox with hotkey hint", async () => {
      const app = new AppClass();
      const client = createClient(app, { event: "OPEN_DEBUG" });
      await app.main(client);

      expect(client.S_MSG_BOX).not.toBeNull();
      expect(client.S_MSG_BOX.TEXT).toContain("CTRL+F12");
    });

    test("OPEN_INFO shows the system-info popup", async () => {
      const app = new AppClass();
      const client = createClient(app, { event: "OPEN_INFO" });
      await app.main(client);

      expect(client.S_POPUP).not.toBeNull();
      expect(client.S_POPUP.XML).toContain("System Information");
    });
  });
});
