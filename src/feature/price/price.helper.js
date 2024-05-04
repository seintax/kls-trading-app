const { Table } = require("../../utilities/builder.utility")

const price = new Table("pos_stock_price", {
    id: 'prce_id',
    time: 'prce_time',
    item: 'prce_item',
    product: 'prce_product',
    variant: 'prce_variant',
    stocks: 'prce_stocks',
    old_price: 'prce_old_price',
    new_price: 'prce_new_price',
    details: 'prce_details',
    account: 'prce_account',
    store: 'prce_store',
}, [
    {
        key: "prce_item",
        reference: { table: "pos_stock_inventory", key: "invt_id" },
        include: {
            inventory_supplier: 'invt_supplier',
            inventory_sku: 'invt_sku',
            inventory_received: 'invt_received',
            inventory_stocks: 'invt_stocks',
            inventory_cost: 'invt_cost',
            inventory_base: 'invt_base',
            inventory_price: 'invt_price',
            inventory_barcode: 'invt_barcode',
            inventory_alert: 'invt_alert',
            inventory_acquisition: 'invt_acquisition',
            inventory_source: 'invt_source',
        }
    },
    {
        key: "prce_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
            product_category: 'prod_category',
        }
    },
    {
        key: "prce_variant",
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
        key: "prce_account",
        reference: { table: "sys_account", key: "acct_id" },
        include: {
            account_name: 'acct_fullname',
            account_store: 'acct_store',
        }
    },
])

module.exports = price