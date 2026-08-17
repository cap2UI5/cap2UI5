const z2ui5_if_app = require("../../02/z2ui5_if_app");
const z2ui5_cl_ui5_view_builder = require("../../02/z2ui5_cl_ui5_view_builder");

/**
 * The framework's error dialog — what the engine shows when an app throws.
 *
 * Replaces the built-in z2ui5_cl_pop_error from upstream's frozen src/99/02.
 * Upstream retired those popups in favour of a separate addon repository;
 * this port has no addon to fall back on, and an engine that swallows an
 * exception with no visible dialog is not an option, so the one popup the
 * FRAMEWORK itself needs lives here instead — in the live layer, on the
 * current view builder, owned by this port.
 *
 * It is deliberately minimal: title, message, OK. Anything richer belongs in
 * an application, not in the engine's last-resort error path.
 */
class z2ui5_cl_ui5_app_error extends z2ui5_if_app {

  client = null;
  error = null;
  title = ``;

  static factory(a, b) {
    // abap PREFERRED PARAMETER: factory(x_root) ≡ factory({ x_root })
    const { x_root, i_title = `Error` } =
      a !== null && typeof a === `object` && (`x_root` in a || `i_title` in a)
        ? a
        : { x_root: a, i_title: b };
    const result = new z2ui5_cl_ui5_app_error();
    result.error = x_root;
    result.title = i_title || `Error`;
    return result;
  }

  /** The thrown value's message, whatever shape it arrived in. */
  _text() {
    const x = this.error;
    return String(x?.get_text?.() ?? x?.message ?? x ?? ``);
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` });

    const dialog = view
      .ele({ n: `Dialog` })
      .a({ n: `title`, v: this.title })
      .a({ n: `afterClose`, v: this.client._event(`BUTTON_CONFIRM`) });

    dialog
      .ele({ n: `content` })
      .ele({ n: `VBox` })
      .a({ n: `class`, v: `sapUiMediumMargin` })
      .tag({ n: `Text` })
      .a({ n: `text`, v: this._text() });

    dialog
      .ele({ n: `buttons` })
      .tag({ n: `Button` })
      .a({ n: `text`, v: `OK` })
      .a({ n: `type`, v: `Emphasized` })
      .a({ n: `press`, v: this.client._event(`BUTTON_CONFIRM`) });

    this.client.popup_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`BUTTON_CONFIRM`)) {
      client.popup_destroy();
      client.nav_app_leave();
    }
  }
}

module.exports = z2ui5_cl_ui5_app_error;
