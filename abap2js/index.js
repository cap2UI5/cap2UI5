// @cap2ui5/abap2js - an abap2UI5 app class as a cap2UI5 app module.
// lib/abap2js.js says what is translated and what is refused;
// bin/cap2ui5.js is `npx --no-install cap2ui5 abap2js`.
const { abap2js, library, Abap2jsError } = require("./lib/abap2js");

module.exports = { abap2js, library, Abap2jsError };
