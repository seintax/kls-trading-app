const { Table } = require("../../utilities/builder.utility")

const option = new Table("lib_option", {
    id: 'optn_id',
    name: 'optn_name',
    status: 'optn_status',
})

module.exports = option