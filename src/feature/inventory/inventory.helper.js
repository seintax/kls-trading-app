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
    sold_total: 'invt_sold_total',
    trni_total: 'invt_trni_total',
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
        key: "invt_delivery",
        reference: { table: "pos_delivery_request", key: "dlvr_id" },
        include: {
            delivery_refcode: 'dlvr_refcode',
            delivery_date: 'dlvr_date',
            delivery_remarks: 'dlvr_remarks',
            delivery_count: 'dlvr_count',
            delivery_value: 'dlvr_value',
            delivery_by: 'dlvr_by',
            delivery_store: 'dlvr_store',
        }
    },
    {
        key: "invt_purchase",
        reference: { table: "pos_purchase_order", key: "pord_id" },
        include: {
            purchase_date: 'pord_date',
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
])

inventory.register("running_via_transfer_receipt",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks@operator@qty,
        invt_trni_total=(SELECT IFNULL(SUM(trni_quantity),0) FROM pos_transfer_receipt WHERE trni_item=invt_id)
            WHERE invt_id=@id`)

inventory.register("running_via_dispensing",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks@operator@qty,
        invt_sold_total=(SELECT IFNULL(SUM(sale_dispense),0) FROM pos_sales_dispensing WHERE sale_item=invt_id)
            WHERE invt_id=@id`)

module.exports = inventory