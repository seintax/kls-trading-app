const { Table } = require("../../utilities/builder.utility")

const roles = new Table("sys_roles", {
    id: 'role_id',
    name: 'role_name',
    permission: 'role_permission',
})

module.exports = roles