class z2ui5_cl_core_client {

    oApp = {};
    oModel = {};
    oEditModel = {
        MS_HOME: { CLASSNAME: "" }
    };
    width;
    aBind = [];

    display_view(val) {
        this.view_xml = val;
    }

    _bind(val) {

        for (var prop in this.oApp) {
            if (Object.is(this.oApp[prop], val)) {
                this.aBind.push({ name: prop, val: val, type: 'BIND' });
                return `{/${prop}}`;
            }
        }

    }

    message_toast_display(val) {

        this.S_MSG_TOAST = {
            "AUTOCLOSE": "X",
            "CLOSEONBROWSERNAVIGATION": "X",
            "TEXT": val
        };
    }

    get() {
        return {
            EVENT: this.oReq.S_FRONT.EVENT
        }
    }

    _event(val) {
        return `.eB(['${val}'])`;
    }

    _bind_edit(val) {

        for (var prop in this.oApp) {
            if (Object.is(this.oApp[prop], val)) {
                this.aBind.push({ name: prop, val: val, type: 'BIND_EDIT' });
                return `{/XX/${prop}}`;
            }
        }

    }
}

module.exports = z2ui5_cl_core_client;
