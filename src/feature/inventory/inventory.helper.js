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

inventory.register("inventory_update_transfer",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks@operator@qty,
        invt_trni_total=(
                SELECT IFNULL(SUM(trni_quantity),0) 
                FROM pos_transfer_receipt 
                WHERE trni_item=invt_id
            )
        WHERE invt_id=@id`)

inventory.register("inventory_update_dispensing",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks@operator@qty,
        invt_sold_total=(
                SELECT IFNULL(SUM(sale_dispense),0) 
                FROM pos_sales_dispensing 
                WHERE sale_item=invt_id
            )
        WHERE invt_id=@id`)

inventory.register("inventory_update_deduction_adjustment",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks-@qty,
        invt_adjt_total=(
                SELECT IFNULL(SUM(adjt_quantity),0) 
                FROM pos_stock_adjustment 
                WHERE adjt_item=invt_id 
                    AND adjt_operator='DEDUCTION'
            )
        WHERE invt_id=@id`)

inventory.register("inventory_update_addition_adjustment",
    `UPDATE pos_stock_inventory SET 
        invt_stocks=invt_stocks+@qty,
        invt_apnd_total=(
                SELECT IFNULL(SUM(adjt_quantity),0) 
                FROM pos_stock_adjustment 
                WHERE adjt_item=invt_id 
                    AND adjt_operator='ADDITION'
            )
        WHERE invt_id=@id`)

inventory.register("inventory_by_product_variant",
    `
    SELECT 
        REPLACE(CONCAT(prod_name, ' ', IFNULL(vrnt_serial,''), ' ', IFNULL(vrnt_model,''), ' ', IFNULL(vrnt_brand,'')), '  ', ' ') AS inventory,
        invt_cost AS cost,
        invt_price AS price
    FROM pos_stock_inventory 
    LEFT JOIN pos_stock_masterlist
        ON prod_id=invt_product
    LEFT JOIN lib_variant
        ON vrnt_id=invt_variant
    WHERE
        CONCAT(prod_name, ' ', IFNULL(vrnt_serial,''), ' ', IFNULL(vrnt_model,''), ' ', IFNULL(vrnt_brand,'')) LIKE '%@search%'
    GROUP BY inventory,invt_cost,invt_price,invt_product,invt_variant
    `)

module.exports = inventory