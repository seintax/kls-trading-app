const { Table, Field, Query, Param } = require("../../utilities/builder.utility")

const account = new Table("sys_account", {
    id: 'acct_id',
    name: 'acct_fullname',
    user: 'acct_username',
    pass: 'acct_password',
    time: 'acct_duration',
    token: 'acct_keytoken',
})

module.exports = account