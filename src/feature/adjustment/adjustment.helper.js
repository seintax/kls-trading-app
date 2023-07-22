const { Table } = require("../../utilities/builder.utility")

const adjustment = new Table("pos_stock_adjustment", {
    id: 'adjt_id',
    time: 'adjt_time',
    item: 'adjt_item',
    product: 'adjt_product',
    variant: 'adjt_variant',
    quantity: 'adjt_quantity',
    pricing: 'adjt_pricing',
    operator: 'adjt_operator',
    details: 'adjt_details',
    remarks: 'adjt_remarks',
    by: 'adjt_by',
    store: 'adjt_store',
}, [
    {
        key: "adjt_item",
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
        key: "adjt_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
        }
    },
    {
        key: "adjt_variant",
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

module.exports = adjustment