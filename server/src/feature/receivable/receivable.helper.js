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
}, [
    {
        key: "rcvb_purchase",
        reference: { table: "pos_purchase_order", key: "pord_id" },
        include: {
            purchase_time: 'pord_time',
            purchase_date: 'pord_date',
            purchase_supplier: 'pord_supplier',
            purchase_store: 'pord_store',
            purchase_category: 'pord_category',
            purchase_itemcount: 'pord_item_count',
            purchase_ordertotal: 'pord_order_total',
            purchase_requesttotal: 'pord_request_total',
            purchase_receivedtotal: 'pord_received_total',
            purchase_progress: 'pord_progress',
            purchase_status: 'pord_status',
            purchase_expected: 'pord_expected',
            purchase_by: 'pord_by',
        }
    },
    {
        key: "rcvb_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
            product_status: 'prod_status',
        }
    },
    {
        key: "rcvb_variant",
        reference: { table: "lib_variant", key: "vrnt_id" },
        include: {
            variant_serial: 'vrnt_serial',
            variant_option1: 'vrnt_option1',
            variant_model: 'vrnt_model',
            variant_option2: 'vrnt_option2',
            variant_brand: 'vrnt_brand',
            variant_option3: 'vrnt_option3',
        }
    },
])

module.exports = receivable