const { Table } = require("../../utilities/builder.utility")

const receivable = new Table("pos_purchase_receivable", {
    id: 'rcvb_id',
    purchase: 'rcvb_purchase',
    product: 'rcvb_product',
    variant: 'rcvb_variant',
    costing: 'rcvb_costing',
    ordered: 'rcvb_ordered',
    balance: 'rcvb_balance',
    received: 'rcvb_received',
})

module.exports = receivable