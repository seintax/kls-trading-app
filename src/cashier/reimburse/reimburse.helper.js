const { Table } = require("../../utilities/builder.utility")

const reimburse = new Table("pos_return_reimbursement", {
    id: 'reim_id',
    code: 'reim_trans',
    time: 'reim_time',
    refund: 'reim_refund',
    method: 'reim_method',
    amount: 'reim_amount',
    refcode: 'reim_refcode',
    account: 'reim_account',
}, [
    {
        key: "reim_refund",
        reference: { table: "pos_return_transaction", key: "rtrn_id" },
        include: {
            refund_time: 'rtrn_time',
            refund_purchase_vat: 'rtrn_p_vat',
            refund_purchase_total: 'rtrn_p_total',
            refund_purchase_less: 'rtrn_p_less',
            refund_purchase_net: 'rtrn_p_net',
            refund_return_vat: 'rtrn_r_vat',
            refund_return_total: 'rtrn_r_total',
            refund_return_less: 'rtrn_r_less',
            refund_return_net: 'rtrn_r_net',
            refund_discount: 'rtrn_discount',
            refund_account: 'rtrn_account',
            refund_status: 'rtrn_status',
        }
    },
    {
        key: "reim_trans",
        reference: { table: "pos_sales_transaction", key: "trns_code" },
        include: {
            transaction_id: 'trns_id',
            transaction_time: 'trns_time',
            transaction_vat: 'trns_vat',
            transaction_total: 'trns_total',
            transaction_less: 'trns_less',
            transaction_net: 'trns_net',
            transaction_return: 'trns_return',
            transaction_discount: 'trns_discount',
            transaction_tended: 'trns_tended',
            transaction_change: 'trns_change',
            transaction_method: 'trns_method',
            transaction_status: 'trns_status',
            transaction_account: 'trns_account',
            transaction_date: 'trns_date',
        }
    },
    {
        key: "reim_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    }
])

module.exports = reimburse