const { Table } = require("../../utilities/builder.utility")

const config = new Table("sys_config", {
    id: 'conf_id',
    account: 'conf_account',
    json: 'conf_json',
})

module.exports = config