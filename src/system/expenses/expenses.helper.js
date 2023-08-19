const { Table } = require("../../utilities/builder.utility")

const expenses = new Table("pos_archive_expenses", {
    id: 'expn_id',
    time: 'expn_time',
    inclusion: 'expn_inclusion',
    particulars: 'expn_particulars',
    purchase: 'expn_purchase',
    cash: 'expn_cash',
    change: 'expn_change',
    remarks: 'expn_remarks',
    notes: 'expn_notes',
    account: 'expn_account',
    store: 'expn_store',
    date: 'expn_date'
}, [
    {
        key: "expn_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
])

module.exports = expenses