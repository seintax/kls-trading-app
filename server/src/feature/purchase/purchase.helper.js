const { Table } = require("../../utilities/builder.utility")

const purchase = new Table("pos_purchase_order", {
    id: 'pord_id',
    time: 'pord_time',
    date: 'pord_date',
    supplier: 'pord_supplier',
    store: 'pord_store',
    category: 'pord_category',
    itemcount: 'pord_item_count',
    ordertotal: 'pord_ordr_total',
    requesttotal: 'pord_rqst_total',
    receivedtotal: 'pord_rcvd_total',
    progress: 'pord_progress',
    status: 'pord_status',
    expected: 'pord_expected',
    by: 'pord_by',
})

module.exports = purchase