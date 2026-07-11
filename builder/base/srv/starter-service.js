const cds = require("@sap/cds");

module.exports = cds.service.impl(async function (srv) {

    const { z2ui5_t_01 } = cds.entities("my.domain");

    // POST /rest/starter/ping with body {message: "..."} — persists the
    // message in my.domain.z2ui5_t_01 and answers with the total row count,
    // so a single roundtrip proves frontend, service layer and database work.
    srv.on("ping", async (req) => {
        const message = req.data.message || "(no message)";

        const storedId = cds.utils.uuid();
        await INSERT.into(z2ui5_t_01).entries({ id: storedId, data: message });

        const [{ rowCount }] = await SELECT.from(z2ui5_t_01)
            .columns("count(*) as rowCount");

        return {
            reply: `Hello from the CAP backend! You sent: "${message}"`,
            storedId,
            rowCount,
        };
    });

});
