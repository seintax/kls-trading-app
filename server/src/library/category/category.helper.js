const { Table } = require("../../utilities/builder.utility")

const category = new Table("lib_category", {
    id: 'ctgy_id',
    name: 'ctgy_name',
    status: 'ctgy_status',
})

module.exports = category