const Client = require("../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_client");

describe("z2ui5_cl_core_client", () => {
  let client;
  let mockApp;

  beforeEach(() => {
    client = new Client();
    mockApp = { NAME: "Alice", AGE: 30, ITEMS: [1, 2, 3] };
    client.oApp = mockApp;
    client.oReq = {
      S_FRONT: {
        EVENT: "",
        T_EVENT_ARG: [],
      },
    };
  });

  // ===== Lifecycle Check Methods =====

  describe("check_on_init", () => {
    test("returns true when event is empty", () => {
      expect(client.check_on_init()).toBe(true);
    });

    test("returns false when event is set", () => {
      client.oReq = { S_FRONT: { EVENT: "CLICK", T_EVENT_ARG: [] } };
      expect(client.check_on_init()).toBe(false);
    });
  });

  describe("check_on_event", () => {
    test("returns false when no event and no argument", () => {
      expect(client.check_on_event()).toBe(false);
    });

    test("returns true when any event and no argument", () => {
      client.oReq = { S_FRONT: { EVENT: "CLICK", T_EVENT_ARG: [] } };
      expect(client.check_on_event()).toBe(true);
    });

    test("returns true when event matches argument", () => {
      client.oReq = { S_FRONT: { EVENT: "SUBMIT", T_EVENT_ARG: [] } };
      expect(client.check_on_event("SUBMIT")).toBe(true);
    });

    test("returns false when event does not match argument", () => {
      client.oReq = { S_FRONT: { EVENT: "SUBMIT", T_EVENT_ARG: [] } };
      expect(client.check_on_event("CLICK")).toBe(false);
    });
  });

  describe("check_on_navigated", () => {
    test("returns false by default", () => {
      expect(client.check_on_navigated()).toBe(false);
    });

    test("returns true when flag is set", () => {
      client._check_on_navigated = true;
      expect(client.check_on_navigated()).toBe(true);
    });
  });

  describe("check_app_prev_stack", () => {
    test("returns false when stack is empty", () => {
      expect(client.check_app_prev_stack()).toBe(false);
    });

    test("returns true when stack has items", () => {
      client._navStack.push({ name: "prev" });
      expect(client.check_app_prev_stack()).toBe(true);
    });
  });

  // ===== view_display =====

  describe("view_display", () => {
    test("sets S_VIEW with XML", () => {
      client.view_display("<mvc:View/>");
      expect(client.S_VIEW).toEqual({ XML: "<mvc:View/>" });
    });
  });

  describe("view_model_update", () => {
    test("sets CHECK_UPDATE_MODEL flag", () => {
      client.view_model_update();
      expect(client.S_VIEW.CHECK_UPDATE_MODEL).toBe(true);
    });
  });

  describe("view_destroy", () => {
    test("sets CHECK_DESTROY flag", () => {
      client.view_destroy();
      expect(client.S_VIEW).toEqual({ CHECK_DESTROY: true });
    });
  });

  // ===== popup =====

  describe("popup_display / popup_destroy", () => {
    test("popup_display sets S_POPUP with XML", () => {
      client.popup_display("<Dialog/>");
      expect(client.S_POPUP).toEqual({ XML: "<Dialog/>" });
    });

    test("popup_destroy sets CHECK_DESTROY flag", () => {
      client.popup_destroy();
      expect(client.S_POPUP).toEqual({ CHECK_DESTROY: true });
    });

    test("popup_model_update sets MODEL_UPDATE flag", () => {
      client.popup_model_update();
      expect(client.S_POPUP.CHECK_UPDATE_MODEL).toBe(true);
    });
  });

  // ===== popover =====

  describe("popover_display / popover_destroy", () => {
    test("popover_display sets S_POPOVER with XML and OPEN_BY_ID", () => {
      client.popover_display("<Popover/>", "myBtn");
      expect(client.S_POPOVER).toEqual({ XML: "<Popover/>", OPEN_BY_ID: "myBtn" });
    });

    test("popover_destroy sets CHECK_DESTROY flag", () => {
      client.popover_destroy();
      expect(client.S_POPOVER).toEqual({ CHECK_DESTROY: true });
    });

    test("popover_model_update sets MODEL_UPDATE flag", () => {
      client.popover_model_update();
      expect(client.S_POPOVER.CHECK_UPDATE_MODEL).toBe(true);
    });
  });

  // ===== nested views =====

  describe("nest_view_display / nest_view_destroy", () => {
    test("nest_view_display sets S_VIEW_NEST", () => {
      client.nest_view_display("<View/>", "container1", "addPage", "destroyPage");
      expect(client.S_VIEW_NEST).toEqual({
        XML: "<View/>",
        ID: "container1",
        METHOD_INSERT: "addPage",
        METHOD_DESTROY: "destroyPage",
      });
    });

    test("nest_view_destroy sets DESTROY flag", () => {
      client.nest_view_destroy();
      expect(client.S_VIEW_NEST).toEqual({ CHECK_DESTROY: true });
    });
  });

  describe("nest2_view_display / nest2_view_destroy", () => {
    test("nest2_view_display sets S_VIEW_NEST2", () => {
      client.nest2_view_display("<View/>", "container2", "addPage");
      expect(client.S_VIEW_NEST2).toEqual({
        XML: "<View/>",
        ID: "container2",
        METHOD_INSERT: "addPage",
        METHOD_DESTROY: "",
      });
    });

    test("nest2_view_destroy sets DESTROY flag", () => {
      client.nest2_view_destroy();
      expect(client.S_VIEW_NEST2).toEqual({ CHECK_DESTROY: true });
    });
  });

  // ===== _bind =====

  describe("_bind", () => {
    test("returns binding path for known property (string)", () => {
      const result = client._bind(mockApp.NAME);
      expect(result).toBe("{/NAME}");
    });

    test("registers binding in aBind array", () => {
      client._bind(mockApp.NAME);
      expect(client.aBind).toHaveLength(1);
      expect(client.aBind[0]).toEqual({
        name: "NAME",
        val: "Alice",
        type: "ONE_WAY",
      });
    });

    test("returns binding path for array reference", () => {
      const result = client._bind(mockApp.ITEMS);
      expect(result).toBe("{/ITEMS}");
    });

    test("fallback: creates dynamic binding for unknown value", () => {
      const result = client._bind("unknown_value_xyz");
      expect(result).toMatch(/^\{\/(__BIND_\d+)\}$/);
      expect(client.aBind).toHaveLength(1);
      expect(client.aBind[0].type).toBe("ONE_WAY");
    });
  });

  // ===== _bind_edit =====

  describe("_bind_edit", () => {
    test("returns two-way binding path with /XX/ prefix", () => {
      const result = client._bind_edit(mockApp.NAME);
      expect(result).toBe("{/XX/NAME}");
    });

    test("registers BIND_EDIT type in aBind", () => {
      client._bind_edit(mockApp.AGE);
      expect(client.aBind[0].type).toBe("TWO_WAY");
    });

    test("fallback: creates dynamic edit binding for unknown value", () => {
      const result = client._bind_edit("unknown_edit_xyz");
      expect(result).toMatch(/^\{\/XX\/(__EDIT_\d+)\}$/);
    });
  });

  // ===== _bind_local =====

  describe("_bind_local", () => {
    test("creates local binding with auto-generated name", () => {
      const result = client._bind_local("temp_value");
      expect(result).toMatch(/^\{\/(__local_\d+)\}$/);
      expect(client.aBind[0].type).toBe("ONE_WAY");
      expect(client.aBind[0].val).toBe("temp_value");
    });
  });

  // ===== _isEqual =====

  describe("_isEqual", () => {
    test("same object reference returns true", () => {
      const obj = { a: 1 };
      expect(client._isEqual(obj, obj)).toBe(true);
    });

    test("same string value returns true", () => {
      expect(client._isEqual("hello", "hello")).toBe(true);
    });

    test("same number value returns true", () => {
      expect(client._isEqual(42, 42)).toBe(true);
    });

    test("different values return false", () => {
      expect(client._isEqual("a", "b")).toBe(false);
    });

    test("different types return false", () => {
      expect(client._isEqual("1", 1)).toBe(false);
    });

    test("different objects return false", () => {
      expect(client._isEqual({ a: 1 }, { a: 1 })).toBe(false);
    });
  });

  // ===== _event =====

  describe("_event", () => {
    test("single event name (no t_arg)", () => {
      expect(client._event("CLICK")).toBe(".eB(['CLICK','','',''])");
    });

    test("event with t_arg array (modern signature)", () => {
      expect(client._event("NAV", ["app1"])).toBe(".eB(['NAV','','',''],'app1')");
    });

    test("event with multiple t_arg values", () => {
      expect(client._event("DO", ["a", "b", "c"])).toBe(
        ".eB(['DO','','',''],'a','b','c')"
      );
    });

    test("legacy single string arg is auto-wrapped to t_arg", () => {
      expect(client._event("NAV", "app1")).toBe(".eB(['NAV','','',''],'app1')");
    });

    test("s_ctrl flags set positions [2] and [3]", () => {
      expect(client._event("CLICK", [], { bypass_busy: true, force_main_model: true })).toBe(
        ".eB(['CLICK','','X','X'])"
      );
    });
  });

  // ===== _event_client =====

  describe("_event_client", () => {
    test("single client event name", () => {
      expect(client._event_client("POPUP_CLOSE")).toBe(".eF('POPUP_CLOSE')");
    });

    test("client event with arguments", () => {
      expect(client._event_client("DOWNLOAD", "file.pdf")).toBe(
        ".eF('DOWNLOAD','file.pdf')"
      );
    });
  });

  // ===== get =====

  describe("get", () => {
    test("returns EVENT from request", () => {
      client.oReq = { S_FRONT: { EVENT: "SUBMIT", T_EVENT_ARG: [] } };
      expect(client.get().EVENT).toBe("SUBMIT");
    });

    test("returns empty string when no event", () => {
      client.oReq = {};
      expect(client.get().EVENT).toBe("");
    });

    test("returns T_EVENT_ARG", () => {
      client.oReq = {
        S_FRONT: { EVENT: "NAV", T_EVENT_ARG: ["arg1", "arg2"] },
      };
      const result = client.get();
      expect(result.T_EVENT_ARG).toEqual(["arg1", "arg2"]);
    });

    test("get_event_arg returns argument by index", () => {
      client.oReq = {
        S_FRONT: { EVENT: "E", T_EVENT_ARG: ["first", "second"] },
      };
      expect(client.get().get_event_arg(0)).toBe("first");
      expect(client.get().get_event_arg(1)).toBe("second");
      expect(client.get().get_event_arg(5)).toBe("");
    });
  });

  // ===== get_event_arg (direct, ABAP-compatible 1-based) =====

  describe("get_event_arg", () => {
    test("returns first argument with 1-based index", () => {
      client.oReq = {
        S_FRONT: { EVENT: "E", T_EVENT_ARG: ["first", "second"] },
      };
      expect(client.get_event_arg(1)).toBe("first");
      expect(client.get_event_arg(2)).toBe("second");
    });

    test("returns empty string for out-of-range index", () => {
      client.oReq = {
        S_FRONT: { EVENT: "E", T_EVENT_ARG: ["only"] },
      };
      expect(client.get_event_arg(5)).toBe("");
    });
  });

  // ===== Messages =====

  describe("messages", () => {
    test("message_toast_display sets S_MSG_TOAST", () => {
      client.message_toast_display("Success!");
      expect(client.S_MSG_TOAST).toEqual({
        AUTOCLOSE: "X",
        CLOSEONBROWSERNAVIGATION: "X",
        TEXT: "Success!",
      });
    });

    test("message_box_display sets S_MSG_BOX with defaults", () => {
      client.message_box_display("Error occurred");
      expect(client.S_MSG_BOX.TEXT).toBe("Error occurred");
      expect(client.S_MSG_BOX.TYPE).toBe("information");
      expect(client.S_MSG_BOX.CLOSEONNAVIGATION).toBe("X");
    });

    test("message_box_display accepts custom type and title", () => {
      client.message_box_display("Oops", "error", "Error Title");
      expect(client.S_MSG_BOX.TYPE).toBe("error");
      expect(client.S_MSG_BOX.TITLE).toBe("Error Title");
    });
  });

  // ===== Navigation =====

  describe("navigation", () => {
    test("nav_app_call sets _navTarget", () => {
      const targetApp = { main: jest.fn() };
      client.nav_app_call(targetApp);
      expect(client._navTarget).toBe(targetApp);
    });

    test("nav_app_home sets _navTarget to startup app", () => {
      client.nav_app_home();
      expect(client._navTarget).not.toBeNull();
      expect(client._navTarget.constructor.name).toBe("z2ui5_cl_app_startup");
    });

    test("nav_app_back pops from stack", () => {
      const prevApp = { name: "prev" };
      client._navStack.push(prevApp);
      client.nav_app_back();
      expect(client._navTarget).toBe(prevApp);
      expect(client._navStack).toHaveLength(0);
    });

    test("nav_app_back falls back to home when stack empty", () => {
      client.nav_app_back();
      expect(client._navTarget).not.toBeNull();
      expect(client._navTarget.constructor.name).toBe("z2ui5_cl_app_startup");
    });

    test("nav_app_leave without arg pops from stack", () => {
      const prevApp = { name: "prev" };
      client._navStack.push(prevApp);
      client.nav_app_leave();
      expect(client._navTarget).toBe(prevApp);
    });

    test("nav_app_leave with app navigates to that app", () => {
      const targetApp = { name: "target" };
      client.nav_app_leave(targetApp);
      expect(client._navTarget).toBe(targetApp);
    });

    test("nav_app_leave without arg and empty stack goes home", () => {
      client.nav_app_leave();
      expect(client._navTarget.constructor.name).toBe("z2ui5_cl_app_startup");
    });
  });

  // ===== Utility =====

  describe("utility", () => {
    test("get_app returns the app reference", () => {
      expect(client.get_app()).toBe(mockApp);
    });

    test("get_app with id returns null when DB lookup fails", async () => {
      // db_load is async + guarded — when CDS isn't initialised in the test
      // env it falls back to null instead of crashing.
      await expect(client.get_app("some-id")).resolves.toBeNull();
    });

    test("get_app_prev returns last item from nav stack", () => {
      const prevApp = { name: "prev" };
      client._navStack.push(prevApp);
      expect(client.get_app_prev()).toBe(prevApp);
    });

    test("get_app_prev returns null when stack empty", () => {
      expect(client.get_app_prev()).toBeNull();
    });

    test("get_frontend_data returns S_FRONT", () => {
      client.oReq = { S_FRONT: { EVENT: "E", ID: "123" } };
      expect(client.get_frontend_data()).toEqual({ EVENT: "E", ID: "123" });
    });

    test("get_frontend_data returns empty object when no S_FRONT", () => {
      client.oReq = {};
      expect(client.get_frontend_data()).toEqual({});
    });

    test("follow_up_action pushes JS string onto array", () => {
      client.follow_up_action(".eF('FOO')");
      client.follow_up_action(".eF('BAR')");
      expect(client._follow_up_actions).toEqual([".eF('FOO')", ".eF('BAR')"]);
    });

    test("set_push_state stores state", () => {
      client.set_push_state("/my/path");
      expect(client._push_state).toBe("/my/path");
    });
  });

  // ===== frontend action convenience methods =====

  describe("action convenience methods", () => {
    test("clipboard_copy queues CLIPBOARD_COPY eF", () => {
      client.clipboard_copy("hello");
      expect(client._follow_up_actions).toEqual([".eF(['CLIPBOARD_COPY','hello'])"]);
    });

    test("clipboard_copy escapes apostrophes", () => {
      client.clipboard_copy("it's");
      expect(client._follow_up_actions[0]).toBe(".eF(['CLIPBOARD_COPY','it\\'s'])");
    });

    test("history_back queues no-arg eF", () => {
      client.history_back();
      expect(client._follow_up_actions).toEqual([".eF('HISTORY_BACK')"]);
    });

    test("file_download queues two args", () => {
      client.file_download("data:text/plain;base64,SGk=", "hi.txt");
      expect(client._follow_up_actions[0]).toBe(
        ".eF(['DOWNLOAD_B64_FILE','data:text/plain;base64,SGk=','hi.txt'])"
      );
    });

    test("system_logout without arg", () => {
      client.system_logout();
      expect(client._follow_up_actions).toEqual([".eF('SYSTEM_LOGOUT')"]);
    });

    test("system_logout with custom URL", () => {
      client.system_logout("/my/logoff");
      expect(client._follow_up_actions[0]).toBe(".eF(['SYSTEM_LOGOUT','/my/logoff'])");
    });

    test("multiple convenience calls accumulate in order", () => {
      client.clipboard_copy("x");
      client.popup_close();
      client.history_back();
      expect(client._follow_up_actions).toHaveLength(3);
      expect(client._follow_up_actions[0]).toContain("CLIPBOARD_COPY");
      expect(client._follow_up_actions[1]).toContain("POPUP_CLOSE");
      expect(client._follow_up_actions[2]).toContain("HISTORY_BACK");
    });

    test("CS_EVENT constants are exposed on the class", () => {
      const Client = require("../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_client");
      expect(Client.CS_EVENT.CLIPBOARD_COPY).toBe("CLIPBOARD_COPY");
      expect(Client.CS_EVENT.HISTORY_BACK).toBe("HISTORY_BACK");
    });
  });
});
