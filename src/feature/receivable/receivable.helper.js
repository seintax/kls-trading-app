const { Table } = require("../../utilities/builder.utility")

const receivable = new Table("pos_purchase_receivable", {
    id: 'rcvb_id',
    purchase: 'rcvb_purchase',
    product: 'rcvb_product',
    variant: 'rcvb_variant',
    costing: 'rcvb_costing',
    rawcost: 'rcvb_rawcost',
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
    {
        key: "rcvb_id",
        reference: { table: "pos_delivery_receipt", key: "rcpt_receivable" },
        include: {
            receipt_id: 'rcpt_id',
            receipt_time: 'rcpt_time',
            receipt_delivery: 'rcpt_delivery',
            receipt_receivable: 'rcpt_receivable',
            receipt_purchase: 'rcpt_purchase',
            receipt_product: 'rcpt_product',
            receipt_variant: 'rcpt_variant',
            receipt_quantity: 'rcpt_quantity',
            receipt_pricing: 'rcpt_pricing',
        }
    },
])

receivable.register("receivable_update_delivery",
    `UPDATE pos_purchase_receivable SET 
        rcvb_received=(
                SELECT IFNULL(SUM(rcpt_quantity),0) 
                FROM pos_delivery_receipt 
                WHERE rcpt_receivable=rcvb_id 
            ), 
        rcvb_balance=@remaining 
        WHERE rcvb_id=@id`)

module.exports = receivable