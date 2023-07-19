const { Table } = require("../../utilities/builder.utility")

const expenses = new Table("pos_archive_expenses", {
    id: 'expn_id',
    time: 'expn_time',
    particulars: 'expn_particulars',
    purchase: 'expn_purchase',
    cash: 'expn_cash',
    change: 'expn_change',
    remarks: 'expn_remarks',
    notes: 'expn_notes',
    account: 'expn_account',
})

module.exports = expenses