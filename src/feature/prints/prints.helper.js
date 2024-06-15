const { Table } = require("../../utilities/builder.utility")

const prints = new Table("pos_income_statement_print", {
    id: 'prnt_id',
    time: 'prnt_time',
    hash: 'prnt_hash',
    data: 'prnt_data',
    by: 'prnt_by',
})

module.exports = prints