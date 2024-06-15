const { Query } = require("../../utilities/builder.utility")

const income = {
    sales: new Query("sales", `
        SELECT
            SUM(IFNULL(sale_net,0)) AS sales,
            SUM(IFNULL(sale_dispense,0) * IFNULL(invt_cost,0)) AS goods_cost
        FROM 
            pos_sales_dispensing,
            pos_stock_inventory 
        WHERE
            sale_item=invt_id AND
            (sale_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
            invt_store LIKE '%@store%' AND 
            invt_category LIKE '%@category%'
    `),
    beginning_inventory: new Query("beginning_inventory", `
        
    `),
    purchases: new Query("purchases", `
        SELECT
            SUM(IFNULL(rcvb_rawcost,0) * IFNULL(rcvb_received,0)) AS purchases
        FROM 
            pos_purchase_receivable,
            pos_purchase_order
        WHERE
            rcvb_purchase=pord_id AND
            pord_date BETWEEN '@fr' AND '@to' AND 
            pord_store LIKE '%@store%' AND 
            pord_category LIKE '%@category%'
    `),
    goods_in: new Query("goods_in", `
        SELECT
            trnr_store AS branch,
            SUM(IFNULL(trni_pricing,0) * IFNULL(trni_quantity,0)) AS value
        FROM 
            pos_transfer_receipt,
            pos_transfer_request,
            pos_archive_store
        WHERE
            trni_transfer=trnr_id AND 
            trnr_store=stre_code AND 
            trnr_date BETWEEN '@fr' AND '@to' AND 
            trnr_store LIKE '%@store%' AND 
            trnr_category LIKE '%@category%'
        GROUP BY trnr_store
        ORDER BY stre_id
    `),
    freight_in: new Query('freight_in', `
        
    `),
    goods_out: new Query("goods_out", `
        SELECT
            trnr_source AS branch,
            SUM(IFNULL(trni_pricing,0) * IFNULL(trni_quantity,0)) AS value
        FROM 
            pos_transfer_receipt,
            pos_transfer_request,
            pos_archive_store
        WHERE
            trni_transfer=trnr_id AND 
            trnr_source=stre_code AND 
            trnr_date BETWEEN '@fr' AND '@to' AND 
            trnr_source LIKE '%@store%' AND 
            trnr_category LIKE '%@category%'
        GROUP BY trnr_source
        ORDER BY stre_id
    `),
    expenses: new Query("expenses", `
        SELECT 
            expn_inclusion AS inclusion,
            SUM(IFNULL(expn_purchase,0)) AS expenses
        FROM 
            pos_archive_expenses
        WHERE
            expn_date BETWEEN '@fr' AND '@to' AND 
            expn_store LIKE '%@store%'
        GROUP BY expn_inclusion
        ORDER BY expn_inclusion
    `)
}

module.exports = income