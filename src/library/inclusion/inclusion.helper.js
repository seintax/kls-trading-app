const { Table } = require("../../utilities/builder.utility")

const inlcusion = new Table("lib_inclusion", {
    id: 'incl_id',
    name: 'incl_name',
    status: 'incl_status',
})

module.exports = inlcusion