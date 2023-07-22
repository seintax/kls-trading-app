const { Table } = require("../../utilities/builder.utility")

const cheque = new Table("pos_payment_cheque", {
    id: 'chqe_id',
    payment: 'chqe_payment',
    amount: 'chqe_amount',
    oldcode: 'chqe_oldcode',
    olddate: 'chqe_olddate',
    refcode: 'chqe_refcode',
    refdate: 'chqe_refdate',
    details: 'chqe_details',
    account: 'chqe_account',
}, [
    {
        key: "chqe_payment",
        reference: { table: "pos_payment_collection", key: "paym_id" },
        include: {
            payment_code: 'paym_trans',
            payment_time: 'paym_time',
            payment_type: 'paym_type',
            payment_method: 'paym_method',
            payment_total: 'paym_total',
            payment_amount: 'paym_amount',
            payment_refcode: 'paym_refcode',
            payment_refdate: 'paym_refdate',
            payment_refstat: 'paym_refstat',
            payment_returned: 'paym_returned',
            payment_reimburse: 'paym_reimburse',
        }
    },
    {
        key: "chqe_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
])

module.exports = cheque