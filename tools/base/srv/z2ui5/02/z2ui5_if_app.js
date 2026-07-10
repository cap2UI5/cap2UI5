/**
 * Base class — JS port of abap2UI5 z2ui5_if_app interface.
 *
 * Subclass and implement `async main(client)`. Instance fields below mirror the
 * abap DATA declarations; the constants mirror INTERFACE CONSTANTS.
 */
class z2ui5_if_app {

  static version = `1.142.0`;
  static origin  = `https://github.com/abap2UI5/abap2UI5`;
  static authors = `https://github.com/abap2UI5/abap2UI5/graphs/contributors`;
  static license = `MIT`;

  id_draft          = ``;
  id_app            = ``;
  check_initialized = false;
  check_sticky      = false;

  constructor() {
    if (new.target === z2ui5_if_app) {
      throw new Error("z2ui5_if_app cannot be instantiated directly - extend it and implement main(client)");
    }
    if (typeof this.main !== "function") {
      throw new Error(`${this.constructor.name} must implement async main(client) [z2ui5_if_app]`);
    }
  }
}

module.exports = z2ui5_if_app;
