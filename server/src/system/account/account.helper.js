const { Table } = require("../../utilities/builder.utility")

const account = new Table("sys_account", {
    id: 'acct_id',
    name: 'acct_fullname',
    user: 'acct_email',
    pass: 'acct_password',
    store: 'acct_store',
    confirm: 'acct_confirmed',
    blocked: 'acct_isblocked',
})

module.exports = account