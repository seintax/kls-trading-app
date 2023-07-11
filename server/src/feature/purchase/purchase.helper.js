const { Table } = require("../../utilities/builder.utility")

const purchase = new Table("pos_purchase_order", {
    id: 'pord_id',
    time: 'pord_time',
    date: 'pord_date',
    supplier: 'pord_supplier',
    store: 'pord_store',
    category: 'pord_category',
    itemcount: 'pord_item_count',
    ordertotal: 'pord_order_total',
    requesttotal: 'pord_request_total',
    receivedtotal: 'pord_received_total',
    progress: 'pord_progress',
    status: 'pord_status',
    expected: 'pord_expected',
    by: 'pord_by',
}, [
    {
        key: "pord_supplier",
        reference: { table: "pos_archive_supplier", key: "supp_id" },
        include: {
            supplier_name: 'supp_name',
            supplier_address: 'supp_address',
            supplier_details: 'supp_details',
            supplier_telephone: 'supp_telephone',
            supplier_cellphone: 'supp_cellphone',
            supplier_email: 'supp_email',
            supplier_rating: 'supp_rating',
            supplier_status: 'supp_status',
        }
    }
])

module.exports = purchase