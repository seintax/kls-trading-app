const { Table } = require("../../utilities/builder.utility")

const transmit = new Table("pos_transfer_receipt", {
    id: 'trni_id',
    time: 'trni_time',
    transfer: 'trni_transfer',
    item: 'trni_item',
    product: 'trni_product',
    variant: 'trni_variant',
    quantity: 'trni_quantity',
    pricing: 'trni_pricing',
    received: 'trni_received',
    arrival: 'trni_arrival',
}, [
    {
        key: "trni_transfer",
        reference: { table: "pos_transfer_request", key: "trnr_id" },
        include: {
            transfer_time: 'trnr_time',
            transfer_source: 'trnr_source',
            transfer_destination: 'trnr_store',
            transfer_category: 'trnr_category',
            transfer_date: 'trnr_date',
            transfer_arrival: 'trnr_arrival',
            transfer_status: 'trnr_status',
            transfer_count: 'trnr_count',
            transfer_value: 'trnr_value',
        }
    },
    {
        key: "trni_id",
        reference: { table: "pos_stock_inventory", key: "invt_transmit" },
        include: {
            destination_id: 'invt_id',
            destination_store: 'invt_store',
            destination_sku: 'invt_sku',
            destination_price: 'invt_price',
            destination_barcode: 'invt_barcode',
            destination_alert: 'invt_alert',
            destination_acquisition: 'invt_acquisition',
            destination_source: 'invt_source',
        }
    },
    {
        key: "trni_product",
        reference: { table: "pos_stock_masterlist", key: "prod_id" },
        include: {
            product_name: 'prod_name',
        }
    },
    {
        key: "trni_variant",
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

module.exports = transmit