// TODO(abap2js): unresolved reference cl_amc_channel_manager — add require manually
// TODO(abap2js): unresolved reference cl_apc_wsp_ext_stateless_base — add require manually

class z2ui5_cl_demo_app_s_05_ws extends cl_apc_wsp_ext_stateless_base {
  static c_amc_application_id = `Z2UI5_SAMPLE`;
  static c_channel_id = `/news_feed`;
  static c_msg = { __new_connection__: `__NEW_CONNECTION__`, __closed__: `__CLOSED__` };

  static get_producer() {
    let producer = null;
    producer = cl_amc_channel_manager.create_message_producer({ i_application_id: z2ui5_cl_demo_app_s_05_ws.c_amc_application_id, i_channel_id: z2ui5_cl_demo_app_s_05_ws.c_channel_id });
    return producer;
  }

  on_message() {
    try {
      z2ui5_cl_demo_app_s_05_ws.send({ i_message: i_message.get_text() });
    } catch (error) {
      throw error;
    }
  }

  on_start() {
    try {
      i_context.get_binding_manager()
        .bind_amc_message_consumer({ i_application_id: z2ui5_cl_demo_app_s_05_ws.c_amc_application_id, i_channel_id: z2ui5_cl_demo_app_s_05_ws.c_channel_id });
      z2ui5_cl_demo_app_s_05_ws.get_producer().send(z2ui5_cl_demo_app_s_05_ws.c_msg.__new_connection__);
    } catch (error) {
      throw error;
    }
  }

  on_close() {
    try {
      z2ui5_cl_demo_app_s_05_ws.get_producer().send(z2ui5_cl_demo_app_s_05_ws.c_msg.__closed__);
    } catch (error) {
      throw error;
    }
  }

  static get_active_connections() {
    let result = 0;
    // TODO(abap2js): SELECT FROM amc_receiver2 FIELDS COUNT( * ) WHERE channel_id = @( to_lower( |{ c_amc_application_id }{ c_channel_id }| ) ) INTO @result.
    return result;
  }

  static send({ i_message } = {}) {
    z2ui5_cl_demo_app_s_05_ws.get_producer().send(i_message);
  }
}

module.exports = z2ui5_cl_demo_app_s_05_ws;
