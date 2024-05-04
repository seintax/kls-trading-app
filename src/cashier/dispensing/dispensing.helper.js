const { Table } = require("../../utilities/builder.utility")

const dispensing = new Table("pos_sales_dispensing", {
    id: 'sale_id',
    code: 'sale_trans',
    index: 'sale_index',
    time: 'sale_time',
    item: 'sale_item',
    product: 'sale_product',
    variant: 'sale_variant',
    supplier: 'sale_supplier',
    purchase: 'sale_purchase',
    dispense: 'sale_dispense',
    price: 'sale_price',
    vat: 'sale_vat',
    total: 'sale_total',
    less: 'sale_less',
    markdown: 'sale_markdown',
    net: 'sale_net',
    discount: 'sale_discount',
    taxrated: 'sale_taxrated',
    toreturn: 'sale_toreturn',
    returned: 'sale_returned',
    store: 'sale_store'
}, [
    {
        key: "sale_trans",
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
        key: "sale_item",
        reference: { table: "pos_stock_inventory", key: "invt_id" },
        include: {
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
        key: "sale_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
            product_category: 'prod_category',
            product_status: 'prod_status',
        }
    },
    {
        key: "sale_variant",
        reference: { table: "lib_variant", key: "vrnt_id" },
        include: {
            variant_serial: 'vrnt_serial',
            variant_option1: 'vrnt_option1',
            variant_model: 'vrnt_model',
            variant_option2: 'vrnt_option2',
            variant_brand: 'vrnt_brand',
            variant_option3: 'vrnt_option3',
            variant_alert: 'vrnt_alert',
        }
    },
    {
        key: "sale_supplier",
        reference: { table: "pos_archive_supplier", key: "supp_id" },
        include: {
            supplier_name: 'supp_name',
            supplier_address: 'supp_address',
            supplier_details: 'supp_details',
            supplier_telephone: 'supp_telephone',
            supplier_cellphone: 'supp_cellphone',
            supplier_email: 'supp_email',
        }
    },
])

dispensing.register('dispensing_stock_audit',
    `
    SELECT 
        invt_store AS branch,
        CONCAT(sale_trans,IF(sale_returned>0,CONCAT(' (Returned: ',REPLACE(sale_returned,'.00',''),')'),'')) AS reference,
        (sale_time + INTERVAL 8 HOUR) AS time,
        sale_dispense AS quantity
    FROM 
        pos_sales_dispensing,
        pos_stock_inventory
    WHERE
        sale_item=invt_id AND                                 
        DATE(sale_time + INTERVAL 8 HOUR) < '@asof' AND 
        sale_product='@product' AND
        sale_variant='@variant' AND
        invt_cost='@cost' AND
        invt_store LIKE '%@store%'`)

module.exports = dispensing