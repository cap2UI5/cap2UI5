class z2ui5_cl_xml_view {

    oRoot = {};
    oParent;
    aChild = [];

    name;
    ns;
    aProp = [];

    constructor() {
        this.oRoot = this;
    }

    stringify() {

        if (this === this.oRoot) {
            var result = `<mvc:View xmlns:m="sap.m" xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" height="100%"`;
        } else {

            if (this.ns && this.ns != ``) {
                result = `<${this.ns}:${this.name} `;
            } else {
                result = `<${this.name} `;
            }

            for (var i = 0; i < this.aProp.length; i++) {
                result += `${this.aProp[i].n}="${this.aProp[i].v}" `;
            }

        }

        if (this.aChild.length > 0) {
            result += `>`;
            for (var i = 0; i < this.aChild.length; i++) {
                result += this.aChild[i].stringify();
            }
            if (this === this.oRoot) { } else {
                if (this.ns && this.ns != ``) {
                    result += `</${this.ns}:${this.name}>`;
                } else {
                    result += `</${this.name}>`;
                }
            }

        } else {
            result += `/>`;
        }

        if (this === this.oRoot) {
            result += `</mvc:View>`;
        }

        return result;

    }

    get_parent(){
        return this.oParent;
    }

    generic(val) {

        let oResult = new z2ui5_cl_xml_view();
        oResult.oParent = this;
        oResult.oRoot = this.oRoot;
        this.aChild.push(oResult);

        oResult.name = val.name;
        oResult.ns = val.ns;
        for (var i = 0; i < val.aProp.length; i++) {
            oResult.aProp.push(val.aProp[i]);
        }

        return oResult;

    }

    ColumnListItem({

    } = {}) {
        return this.generic({
            name: "ColumnListItem",
            ns: "m",
            aProp: [
      
            ],
        });

    }

    items({

    } = {}) {
        return this.generic({
            name: "items",
            ns: "m",
            aProp: [
      
            ],
        });

    }

    cells({

    } = {}) {
        return this.generic({
            name: "cells",
            ns: "m",
            aProp: [
      
            ],
        });

    }

    Page({
        title,
    } = {}) {
        return this.generic({
            name: "Page",
            ns: "m",
            aProp: [
                { n: "title", v: title },
            ],
        });

    }

    Table({
        items,
    } = {}) {
        return this.generic({
            name: "Table",
            ns: "m",
            aProp: [
                { n: "items", v: items },
            ],
        });

    }

    columns({
    } = {}) {
        return this.generic({
            name: "columns",
            ns: "m",
            aProp: [
            ],
        });

    }

    Column({
    } = {}) {
        return this.generic({
            name: "Column",
            ns: "m",
            aProp: [
            ],
        });

    }

    Title({
        text,
        enabled,
    } = {}) {
        this.generic({
            name: "Title",
            ns: "m",
            aProp: [
                { n: "text", v: text },
                { n: "enabled", v: this.boolean_abap_2_json(enabled) },
            ],
        });
        return this;

    }

    Input({
        value,
        placeholder,
        enabled,
    } = {}) {
        this.generic({
            name: "Input",
            ns: "m",
            aProp: [
                { n: "value", v: value },
                { n: "placeholder", v: placeholder },
                { n: "enabled", v: this.boolean_abap_2_json(enabled) },
            ],
        });
        return this;
    }

    Text({
        text,
    } = {}) {
        this.generic({
            name: "Text",
            ns: "m",
            aProp: [
                { n: "text", v: text },
            ],
        });
        return this;
    }

    Button({
        press,
        text,
    } = {}) {
        this.generic({
            name: "Button",
            ns: "m",
            aProp: [
                { n: "press", v: press },
                { n: "text", v: text },
            ],
        });
        return this;
    }

    boolean_abap_2_json(value) {
        return value ? "true" : "false";
    }

}

module.exports = z2ui5_cl_xml_view;