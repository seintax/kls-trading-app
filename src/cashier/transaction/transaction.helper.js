const { Table } = require("../../utilities/builder.utility")

const transaction = new Table("pos_sales_transaction", {
    id: 'trns_id',
    code: 'trns_code',
    time: 'trns_time',
    vat: 'trns_vat',
    total: 'trns_total',
    less: 'trns_less',
    net: 'trns_net',
    return: 'trns_return',
    discount: 'trns_discount',
    tended: 'trns_tended',
    change: 'trns_change',
    method: 'trns_method',
    status: 'trns_status',
    account: 'trns_account',
    date: 'trns_date',
}, [
    {
        key: "trns_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    }
])

// transaction.register("test", "SELECT * FROM pos_sales_transaction WHERE @watas")

// console.log(transaction.statement("test").inject([{ watas: "george" }]))

module.exports = transaction