const { Table } = require("../../utilities/builder.utility")

const permission = new Table("sys_permission", {
    id: 'perm_id',
    name: 'perm_name',
    json: 'perm_json',
})

module.exports = permission