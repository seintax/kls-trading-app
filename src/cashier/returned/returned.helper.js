const { Table } = require("../../utilities/builder.utility")

const returned = new Table("pos_return_dispensing", {
    id: 'rsal_id',
    code: 'rsal_trans',
    time: 'rsal_time',
    item: 'rsal_item',
    product: 'rsal_product',
    variant: 'rsal_variant',
    refund: 'rsal_refund',
    quantity: 'rsal_quantity',
    price: 'rsal_price',
    vat: 'rsal_vat',
    total: 'rsal_total',
    less: 'rsal_less',
    markdown: 'rsal_markdown',
    net: 'rsal_net',
    discount: 'rsal_discount',
    taxrated: 'rsal_taxrated',
    store: 'rsal_store'
}, [
    {
        key: "rsal_refund",
        reference: { table: "pos_return_transaction", key: "rtrn_id" },
        include: {
            refund_time: 'rtrn_time',
            refund_purchase_vat: 'rtrn_p_vat',
            refund_purchase_total: 'rtrn_p_total',
            refund_purchase_less: 'rtrn_p_less',
            refund_purchase_markdown: 'rtrn_p_markdown',
            refund_purchase_net: 'rtrn_p_net',
            refund_return_vat: 'rtrn_r_vat',
            refund_return_total: 'rtrn_r_total',
            refund_return_less: 'rtrn_r_less',
            refund_return_markdown: 'rtrn_r_markdown',
            refund_return_net: 'rtrn_r_net',
            refund_discount: 'rtrn_discount',
            refund_account: 'rtrn_account',
            refund_status: 'rtrn_status',
        }
    },
    {
        key: "rsal_trans",
        reference: { table: "pos_sales_transaction", key: "trns_code" },
        include: {
            transaction_id: 'trns_id',
            transaction_time: 'trns_time',
            transaction_vat: 'trns_vat',
            transaction_total: 'trns_total',
            transaction_less: 'trns_less',
            transaction_markdown: 'trns_markdown',
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
        key: "rsal_item",
        reference: { table: "pos_stock_inventory", key: "invt_id" },
        include: {
            inventory_variant: 'invt_variant',
            inventory_supplier: 'invt_supplier',
            inventory_store: 'invt_store',
            inventory_sku: 'invt_sku',
            inventory_received: 'invt_received',
            inventory_stocks: 'invt_stocks',
            inventory_cost: 'invt_cost',
            inventory_base: 'invt_base',
            inventory_price: 'invt_price',
            inventory_barcode: 'invt_barcode',
            inventory_alert: 'invt_alert',
            inventory_acquisition: 'invt_acquisition',
        }
    },
    {
        key: "rsal_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
            product_category: 'prod_category',
            product_status: 'prod_status',
        }
    },
])

returned.register('returned_stock_audit',
    `
    SELECT 
        invt_store AS branch,
        rsal_trans AS reference,
        (rsal_time + INTERVAL 8 HOUR) AS time,
        rsal_quantity AS quantity
    FROM 
        pos_return_dispensing,
        pos_stock_inventory
    WHERE
        rsal_item=invt_id AND                                 
        DATE(rsal_time + INTERVAL 8 HOUR) < '@asof' AND 
        rsal_product='@product' AND
        rsal_variant='@variant' AND
        invt_cost='@cost' AND
        invt_store LIKE '%@store%'`)

module.exports = returned