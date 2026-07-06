const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_186 extends z2ui5_if_app {
  file_content_64 = ``;
  file_name = ``;
  mime_type = ``;
  client = null;

  initialize() {
    this.file_name = `Default_File_Name.jpg`;
    this.mime_type = `text/plain`;
    this.file_content_64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAA` + `KYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIp` + `QBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW` + `0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpd` + `mZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoeP` + `PQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKc` + `TNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jc` + `W+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/` + `JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3` + `/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQj` + `LYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=`;
  }

  on_event() {
    if (this.client.check_on_event(`BUTTON_DOWNLOAD`)) {
      this.client.action.gen({ val: this.client.cs_event.download_b64_file, t_arg: [this.file_content_64, this.file_name] });
    }
  }

  view_display() {
    let lv_script = ``;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ showheader: /* TODO(abap2js) */ xsdbool(false === this.client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5 - Download Base64 File`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.flex_box({ width: `100%`, height: `600px`, alignitems: `Center`, justifycontent: `SpaceAround` })
      .vbox()
      .text(`Base64 String:`)
      .text_area({ value: this.client._bind_edit(this.file_content_64), rows: `20`, width: `800px`, wrapping: true })
      .get_parent()
      .vbox({ justifycontent: `Center`, alignitems: `Center` })
      .text(`fill filename:`)
      .input({ value: this.client._bind_edit(this.file_name), class: `sapUiLargeMarginBottom`, width: `15rem` })
      .button({ type: `Emphasized`, text: `Open Download Popup`, press: this.client._event(`BUTTON_DOWNLOAD`) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.initialize();
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_186;
