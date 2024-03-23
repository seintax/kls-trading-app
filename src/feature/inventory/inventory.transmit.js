const { Table } = require("../../utilities/builder.utility")

const inventory = new Table("pos_stock_inventory", {
    id: 'invt_id',
    time: 'invt_time',
    product: 'invt_product',
    variant: 'invt_variant',
    category: 'invt_category',
    delivery: 'invt_delivery',
    purchase: 'invt_purchase',
    receipt: 'invt_receipt',
    orderno: 'invt_orderno',
    supplier: 'invt_supplier',
    store: 'invt_store',
    sku: 'invt_sku',
    received: 'invt_received',
    stocks: 'invt_stocks',
    cost: 'invt_cost',
    base: 'invt_base',
    price: 'invt_price',
    barcode: 'invt_barcode',
    alert: 'invt_alert',
    acquisition: 'invt_acquisition',
    source: 'invt_source',
    transfer: 'invt_transfer',
    transmit: 'invt_transmit',
    dispensedtotal: 'invt_sold_total',
    transferredtotal: 'invt_trni_total',
    adjustmenttotal: 'invt_adjt_total',
    additionaltotal: 'invt_apnd_total',
}, [
    {
        key: "invt_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
        }
    },
    {
        key: "invt_variant",
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
        key: "invt_supplier",
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
    {
        key: "invt_transmit",
        reference: { table: "pos_transfer_receipt", key: "trni_id" },
        include: {
            transmit_time: 'trni_time',
            transmit_transfer: 'trni_transfer',
            transmit_item: 'trni_item',
            transmit_product: 'trni_product',
            transmit_variant: 'trni_variant',
            transmit_quantity: 'trni_quantity',
            transmit_pricing: 'trni_pricing',
            transmit_received: 'trni_received',
            transmit_arrival: 'trni_arrival',
        }
    },
])

module.exports = inventory