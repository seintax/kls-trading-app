const { Table } = require("../../utilities/builder.utility")

const refund = new Table("pos_return_transaction", {
    id: 'rtrn_id',
    code: 'rtrn_trans',
    time: 'rtrn_time',
    purchase_vat: 'rtrn_p_vat',
    purchase_total: 'rtrn_p_total',
    purchase_less: 'rtrn_p_less',
    purchase_markdown: 'rtrn_p_markdown',
    purchase_net: 'rtrn_p_net',
    return_vat: 'rtrn_r_vat',
    return_total: 'rtrn_r_total',
    return_less: 'rtrn_r_less',
    return_markdown: 'rtrn_r_markdown',
    return_net: 'rtrn_r_net',
    discount: 'rtrn_discount',
    account: 'rtrn_account',
    status: 'rtrn_status',
}, [
    {
        key: "rtrn_trans",
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
        key: "rtrn_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    }
])

module.exports = refund