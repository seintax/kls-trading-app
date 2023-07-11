const { Table } = require("../../utilities/builder.utility")

const receipt = new Table("pos_delivery_receipt", {
    id: 'rcpt_id',
    time: 'rcpt_time',
    delivery: 'rcpt_delivery',
    receivable: 'rcpt_receivable',
    purchase: 'rcpt_purchase',
    product: 'rcpt_product',
    variant: 'rcpt_variant',
    quantity: 'rcpt_quantity',
    pricing: 'rcpt_pricing',
}, [
    {
        key: "rcpt_delivery",
        reference: { table: "pos_delivery_request", key: "dlvr_id" },
        include: {
            delivery_supplier: 'dlvr_supplier',
            delivery_refcode: 'dlvr_refcode',
            delivery_date: 'dlvr_date',
            delivery_by: 'dlvr_by',
            delivery_store: 'dlvr_store',
        }
    },
    {
        key: "rcpt_receivable",
        reference: { table: "pos_purchase_receivable", key: "rcvb_id" },
        include: {
            receivable_costing: 'rcvb_costing',
            receivable_ordered: 'rcvb_ordered',
            receivable_balance: 'rcvb_balance',
            receivable_received: 'rcvb_received',
        }
    },
    {
        key: "rcpt_purchase",
        reference: { table: "pos_purchase_order", key: "pord_id" },
        include: {
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
        key: "rcpt_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
            product_category: 'prod_category',
        }
    },
    {
        key: "rcpt_variant",
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

module.exports = receipt