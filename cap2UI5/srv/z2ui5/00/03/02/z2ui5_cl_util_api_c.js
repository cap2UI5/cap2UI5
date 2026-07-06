/**
 * z2ui5_cl_util_api_c — JS port of abap2UI5 z2ui5_cl_util_api_c (cloud).
 *
 * In ABAP this is the cloud-platform implementation of the util_api surface
 * (DDIC access works differently on cloud vs. on-prem). JS has no platform
 * distinction, so this re-exports z2ui5_cl_util_api unchanged. Kept as a
 * separate module so call sites that already reference it stay 1:1.
 */
module.exports = require("./z2ui5_cl_util_api");
