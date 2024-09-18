const { Query } = require("../../utilities/builder.utility")

const reports = {
    sales_by_item: new Query("sales_by_item", `
        SELECT
            prod_name AS product,
            vrnt_serial AS variant1,
            vrnt_model AS variant2,
            vrnt_brand AS variant3,
            invt_category AS category,
            SUM(sale_dispense) AS item_sold,
            SUM(sale_net) AS net_sales,
            SUM(sale_dispense * invt_cost) AS goods_cost,
            SUM(sale_net - (sale_dispense * invt_cost)) AS gross_profit,
            SUM(IF(trns_method='SALES',sale_net,0)) AS sales_type_net,
            SUM(IF(trns_method='CREDIT',sale_net,0)) AS credit_type_net
        FROM 
            pos_sales_dispensing 
                LEFT JOIN pos_sales_transaction
                    ON trns_code=sale_trans,
            pos_stock_inventory 
                LEFT JOIN pos_stock_masterlist 
                    ON prod_id=invt_product 
                LEFT JOIN lib_variant 
                    ON vrnt_id=invt_variant
        WHERE 
            sale_item=invt_id AND 
            (sale_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            invt_store LIKE '%@store%' 
        GROUP BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category,invt_store
        ORDER BY item_sold DESC,prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category
        `
    ),
    sales_by_category: new Query("sales_by_category", `
        SELECT
            invt_category AS category,
            SUM(sale_dispense) AS item_sold,
            SUM(sale_net) AS net_sales,
            SUM(sale_dispense * invt_cost) AS goods_cost,
            SUM(sale_net - (sale_dispense * invt_cost)) AS gross_profit
        FROM 
            pos_sales_dispensing,
            pos_stock_inventory 
        WHERE 
            sale_item=invt_id AND 
            (sale_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
            invt_store LIKE '%@store%' 
        GROUP BY invt_category
        ORDER BY invt_category
        `
    ),
    sales_collection: new Query("sales_collection", `
        SELECT
            acct_store AS store,
            paym_type AS trans_type,
            paym_method AS payment_method,
            COUNT(paym_id) AS transaction_count,
            SUM(paym_total) AS payment_total,
            SUM(IF(paym_returned>0, 1, 0)) AS refund_count,
            SUM(paym_returned) AS payment_refund,
            SUM(paym_amount) AS payment_net
        FROM 
            pos_payment_collection,
            sys_account
        WHERE 
            paym_account=acct_id AND 
            (paym_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
            acct_store LIKE '%@store%'
        GROUP BY paym_type,paym_method,acct_store
        ORDER BY paym_type,paym_method
        `
    ),
    sales_summary: new Query("sales_summary", `
        SELECT
            DATE(sale_time + INTERVAL 8 HOUR) AS day,
            SUM(sale_total) AS gross_sales,
            SUM(rtrn_r_net) AS refunds,
            SUM(IFNULL(sale_less,0) + IFNULL(sale_markdown,0)) AS discounts,
            SUM(IFNULL(sale_net,0)) AS net_sales,
            SUM(IFNULL(sale_dispense,0) * IFNULL(invt_cost,0)) AS goods_cost,
            SUM(IFNULL(sale_net,0) - (IFNULL(sale_dispense,0) * IFNULL(invt_cost,0))) AS gross_profit,
            invt_store AS branch
        FROM 
            pos_sales_dispensing
                LEFT JOIN pos_sales_transaction
                    ON trns_code=sale_trans
                LEFT JOIN pos_return_transaction 
                    ON rtrn_trans=sale_trans AND sale_returned>0,
            pos_stock_inventory
        WHERE 
            sale_item=invt_id AND 
            (sale_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            invt_store LIKE '%@store%' 
        GROUP BY DATE(sale_time + INTERVAL 8 HOUR),invt_store
        ORDER BY DATE(sale_time + INTERVAL 8 HOUR) DESC
        `
    ),
    expenses: new Query("expenses", `
        SELECT
            expn_inclusion AS expense_name,
            expn_store AS branch_name,
            COUNT(expn_id) AS expense_count,
            SUM(expn_purchase) AS expense_value,
            expn_date AS expense_date
        FROM 
            pos_archive_expenses,
            sys_account
        WHERE 
            expn_account=acct_id AND 
            expn_date BETWEEN '@fr' AND '@to' AND
            expn_store LIKE '%@store%' 
        GROUP BY expn_date,expn_store,expn_inclusion
        ORDER BY expn_date DESC,expn_store,expn_inclusion
        `
    ),
    expenses_summary: new Query("expenses_summary", `
        SELECT
            expn_inclusion AS expense_name,
            expn_store AS branch_name,
            COUNT(expn_id) AS expense_count,
            SUM(expn_purchase) AS expense_value
        FROM 
            pos_archive_expenses,
            sys_account
        WHERE 
            expn_account=acct_id AND 
            expn_date BETWEEN '@fr' AND '@to' AND
            expn_store LIKE '%@store%' 
        GROUP BY expn_store,expn_inclusion
        ORDER BY expn_store,expn_inclusion
        `
    ),
    purchases: new Query("purchases", `
        SELECT
            expn_inclusion AS expense_name,
            COUNT(expn_id) AS expense_count,
            SUM(expn_purchase) AS expense_value
        FROM 
            pos_archive_expenses,
            sys_account
        WHERE 
            expn_account=acct_id AND 
            (expn_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            acct_store LIKE '%@store%' 
        GROUP BY DATE(expn_time + INTERVAL 8 HOUR),acct_store
        ORDER BY DATE(expn_time + INTERVAL 8 HOUR)
        `
    ),
    cashier_summary: new Query("cashier_summary", `
        SELECT
            DATE(trns_time + INTERVAL 8 HOUR) AS day,
            SUM(IFNULL(trns_total,0)) AS gross_sales,
            SUM(IFNULL(trns_less,0) + IFNULL(trns_markdown,0) + IFNULL(rtrn_discount,0)) AS discounts,
            SUM(IFNULL(trns_net,0)) AS net_sales,
            SUM(IF(trns_method='CREDIT', IFNULL(trns_net,0) - IFNULL(trns_partial,0), 0)) AS credit_sales,
            SUM(IFNULL(trns_partial,0)) AS partial,
            acct_store AS branch,
            (
                SELECT 
                    SUM(IFNULL(rtrn_r_net,0))
                FROM 
                    pos_return_transaction,
                    sys_account  
                WHERE 
                    acct_id=rtrn_account 
                        AND
                    acct_store=branch
                        AND
                    DATE(rtrn_time + INTERVAL 8 HOUR)=day
            ) AS refunds,
            (
                SELECT 
                    SUM(IFNULL(paym_amount,0))
                FROM pos_payment_collection 
                WHERE 
                    paym_type='SALES' 
                        AND
                    paym_store=branch
                        AND
                    DATE(paym_time + INTERVAL 8 HOUR)=day
            ) AS cash_sales,
            (
                SELECT 
                    SUM(IFNULL(paym_amount,0))
                FROM pos_payment_collection 
                WHERE 
                    paym_type='CREDIT' 
                        AND
                    paym_store=branch
                        AND
                    DATE(paym_time + INTERVAL 8 HOUR)=day
            ) AS credit_collection
        FROM 
            pos_sales_transaction
                LEFT JOIN (
                    SELECT 
                        rtrn_trans,
                        rtrn_p_total,
                        rtrn_p_less,
                        rtrn_p_markdown,
                        rtrn_p_net
                    FROM pos_return_transaction 
                    GROUP BY rtrn_trans,rtrn_p_total,rtrn_p_less,rtrn_p_markdown,rtrn_p_net
                ) a ON a.rtrn_trans=trns_code
                LEFT JOIN (
                    SELECT 
                        rtrn_trans,
                        SUM(IFNULL(rtrn_r_less,0) + IFNULL(rtrn_r_markdown,0)) AS rtrn_discount
                    FROM pos_return_transaction 
                    WHERE DATE(rtrn_time + INTERVAL 8 HOUR)>'@to 23:59:59'
                    GROUP BY rtrn_trans
                ) b ON b.rtrn_trans=trns_code,
            sys_account
        WHERE 
            trns_account=acct_id AND 
            (trns_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            acct_store LIKE '%@store%' 
        GROUP BY DATE(trns_time + INTERVAL 8 HOUR),refunds,acct_store,cash_sales,credit_collection
        ORDER BY DATE(trns_time + INTERVAL 8 HOUR) DESC
        `
    ),
    by_store_item: new Query("inventory_stocks_by_store_item", `
        SELECT
            stre_code AS code,
            stre_name AS name,
            SUM(invt_stocks) AS stocks
        FROM 
            pos_archive_store
                LEFT JOIN 
                    pos_stock_inventory
                        ON
                            invt_product='@product' AND
                            invt_variant='@variant' AND
                            invt_cost='@cost' AND                            
                            invt_price='@price' AND
                            invt_store=stre_code 
        WHERE
            stre_code<>'JT-TESTING'
        GROUP BY stre_code,stre_name
        ORDER BY stre_name;
        `
    ),
    inventory_valuation: new Query("inventory_valuation", `
        SELECT
            CONCAT(prod_name, ' - ', IFNULL(vrnt_serial,''), '/', IFNULL(vrnt_model,''), '/', IFNULL(vrnt_brand,'')) AS inventory,
            prod_name AS product,
            vrnt_serial AS variant1,
            vrnt_model AS variant2,
            vrnt_brand AS variant3,
            invt_product AS productid,
            invt_variant AS variantid,
            invt_cost AS cost,
            invt_price AS price,
            (MAX(invt_time) + INTERVAL 8 HOUR) AS date,
            SUM(invt_stocks + IFNULL(dispensed,0) + IFNULL(transfered,0) - IFNULL(returned,0)) AS stocks,
            SUM((invt_stocks + IFNULL(dispensed,0) + IFNULL(transfered,0) - IFNULL(returned,0)) * IFNULL(invt_cost,0)) AS value,
            SUM((invt_stocks + IFNULL(dispensed,0) + IFNULL(transfered,0) - IFNULL(returned,0)) * invt_price) AS retail,
            SUM(((invt_stocks + IFNULL(dispensed,0) + IFNULL(transfered,0) - IFNULL(returned,0)) * invt_price) - ((invt_stocks + IFNULL(dispensed,0) + IFNULL(transfered,0) - IFNULL(returned,0)) * IFNULL(invt_cost,0))) AS profit
        FROM 
            pos_stock_inventory a 
                LEFT JOIN 
                    pos_stock_masterlist
                        ON prod_id=invt_product 
                LEFT JOIN
                    lib_variant 
                        ON vrnt_id=invt_variant
                LEFT JOIN 
                    (
                        SELECT 
                            sale_product, 
                            sale_variant, 
                            invt_cost AS sale_cost,
                            invt_price AS sale_price,
                            SUM(sale_dispense) AS dispensed
                        FROM 
                            pos_sales_dispensing,
                            pos_stock_inventory
                        WHERE
                            sale_item=invt_id AND 
                            (sale_time + INTERVAL 8 HOUR) > '@asof 23:59:59' AND 
                            invt_store='@store'
                        GROUP BY sale_product,sale_variant,invt_cost,invt_price
                    ) b 
                        ON b.sale_product=a.invt_product AND 
                        b.sale_variant=a.invt_variant AND
                        b.sale_cost=a.invt_cost AND
                        b.sale_price=a.invt_price
                LEFT JOIN 
                    (
                        SELECT 
                            rsal_product, 
                            rsal_variant, 
                            invt_cost AS rsal_cost,
                            invt_price AS rsal_price,
                            SUM(rsal_quantity) AS returned
                        FROM 
                            pos_return_dispensing,
                            pos_stock_inventory
                        WHERE
                            rsal_item=invt_id AND 
                            (rsal_time + INTERVAL 8 HOUR) > '@asof 23:59:59' AND 
                            invt_store='@store'
                        GROUP BY rsal_product,rsal_variant,rsal_cost,invt_price
                    ) c 
                        ON c.rsal_product=invt_product AND 
                        c.rsal_variant=invt_variant AND 
                        c.rsal_cost=invt_cost AND
                        c.rsal_price=invt_price
                LEFT JOIN 
                    (
                        SELECT 
                            trni_product, 
                            trni_variant,
                            invt_cost AS trni_cost,
                            invt_price AS trni_price,
                            SUM(trni_quantity) AS transfered
                        FROM 
                            pos_transfer_receipt,
                            pos_stock_inventory
                        WHERE
                            trni_item=invt_id AND                                 
                            (trni_time + INTERVAL 8 HOUR) > '@asof 23:59:59' AND 
                            invt_store='@store'
                        GROUP BY trni_product,trni_variant,trni_cost,invt_price
                    ) d 
                        ON d.trni_product=invt_product AND 
                        d.trni_variant=invt_variant AND 
                        d.trni_cost=invt_cost AND
                        d.trni_price=invt_price
        WHERE 
            invt_store LIKE '%@store%' AND
            invt_category LIKE '%@category%' AND
            (invt_time + INTERVAL 8 HOUR) < '@asof 23:59:59'
        GROUP BY inventory,invt_cost,invt_price,invt_product,invt_variant,dispensed
        ORDER BY inventory,invt_cost,invt_price,invt_product,invt_variant;
        `
    ),
    inventory_report: new Query("inventory_report", `
        SELECT
            CONCAT(prod_name, ' ', IFNULL(vrnt_serial,''), ' ', IFNULL(vrnt_model,''), ' ', IFNULL(vrnt_brand,'')) AS inventory,
            prod_name AS product,
            vrnt_serial AS variant1,
            vrnt_model AS variant2,
            vrnt_brand AS variant3,
            invt_product AS productid,
            invt_variant AS variantid,
            invt_cost AS cost,
            SUM(IF(invt_acquisition='MIGRATION',invt_received,0)) AS beginning,
            SUM(IF(invt_acquisition='TRANSFER',invt_received,0)) AS goodsin,
            IFNULL(received,0) AS purchase,
            IFNULL(adjusted,0) AS adjustment,
            IFNULL(dispensed,0) AS sold,
            IFNULL(transfered,0) AS goodsout,
            IFNULL(loses,0) AS deducted,
            IFNULL(returned,0) AS return,
            IFNULL(ontransit,0) AS pending,
            SUM(IF(invt_acquisition='TRANSMIT',invt_received,0)) AS unreceived,
            SUM(invt_stocks) AS endbalance
        FROM 
            pos_stock_inventory a
                LEFT JOIN 
                    pos_stock_masterlist
                        ON prod_id=invt_product 
                LEFT JOIN
                    lib_variant 
                        ON vrnt_id=invt_variant                
                LEFT JOIN
                    (
                        SELECT 
                            rcpt_product,
                            rcpt_variant,
                            IFNULL(invt_cost,0) AS rcpt_cost,
                            SUM(rcpt_quantity) AS received
                        FROM 
                            pos_delivery_receipt, 
                            pos_stock_inventory  
                        WHERE
                            invt_receipt=rcpt_id AND
                            DATE(rcpt_time + INTERVAL 8 HOUR) <= '@asof' AND
                            invt_store LIKE '%@store%'
                        GROUP BY rcpt_product,rcpt_variant,invt_cost
                    ) b
                        ON b.rcpt_product=a.invt_product AND 
                        b.rcpt_variant=a.invt_variant AND 
                        b.rcpt_cost=IFNULL(a.invt_cost,0)
                LEFT JOIN
                    (
                        SELECT 
                            sale_product, 
                            sale_variant, 
                            IFNULL(invt_cost,0) AS sale_cost,
                            SUM(sale_dispense) AS dispensed
                        FROM 
                            pos_sales_dispensing,
                            pos_stock_inventory
                        WHERE
                            sale_item=invt_id AND 
                            DATE(sale_time + INTERVAL 8 HOUR) <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY sale_product,sale_variant,invt_cost
                    ) c 
                        ON c.sale_product=a.invt_product AND 
                        c.sale_variant=a.invt_variant AND
                        c.sale_cost=IFNULL(a.invt_cost,0)                
                LEFT JOIN 
                    (
                        SELECT 
                            trni_product, 
                            trni_variant,
                            IFNULL(invt_cost,0) AS trni_cost,
                            SUM(trni_received) AS transfered
                        FROM 
                            pos_transfer_receipt,
                            pos_stock_inventory
                        WHERE
                            trni_item=invt_id AND                    
                            trni_arrival <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY trni_product,trni_variant,trni_cost
                    ) d 
                        ON d.trni_product=a.invt_product AND 
                        d.trni_variant=a.invt_variant AND 
                        d.trni_cost=IFNULL(a.invt_cost,0)
                LEFT JOIN 
                    (
                        SELECT 
                            rsal_product, 
                            rsal_variant, 
                            IFNULL(invt_cost,0) AS rsal_cost,
                            SUM(rsal_quantity) AS returned
                        FROM 
                            pos_return_dispensing,
                            pos_stock_inventory
                        WHERE
                            rsal_item=invt_id AND 
                            DATE(rsal_time + INTERVAL 8 HOUR) <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY rsal_product,rsal_variant,rsal_cost
                    ) e 
                        ON e.rsal_product=a.invt_product AND 
                        e.rsal_variant=a.invt_variant AND 
                        e.rsal_cost=IFNULL(a.invt_cost,0)
                LEFT JOIN 
                    (
                        SELECT 
                            adjt_product, 
                            adjt_variant, 
                            IFNULL(invt_cost,0) AS adjt_cost,
                            SUM(adjt_quantity) AS adjusted
                        FROM 
                            pos_stock_adjustment,
                            pos_stock_inventory
                        WHERE
                            adjt_item=invt_id AND 
                            adjt_details='Add Inventory' AND
                            DATE(adjt_time + INTERVAL 8 HOUR) <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY adjt_product,adjt_variant,adjt_cost
                    ) f 
                        ON f.adjt_product=a.invt_product AND 
                        f.adjt_variant=a.invt_variant AND 
                        f.adjt_cost=IFNULL(a.invt_cost,0)           
                LEFT JOIN 
                    (
                        SELECT 
                            trni_product, 
                            trni_variant,
                            IFNULL(invt_cost,0) AS trni_cost,
                            SUM(trni_quantity) AS ontransit
                        FROM 
                            pos_transfer_receipt,
                            pos_stock_inventory
                        WHERE
                            trni_item=invt_id AND 
                            (trni_received IS NULL OR trni_received=0) AND                   
                            DATE(trni_time + INTERVAL 8 HOUR) <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY trni_product,trni_variant,trni_cost
                    ) g 
                        ON g.trni_product=a.invt_product AND 
                        g.trni_variant=a.invt_variant AND 
                        g.trni_cost=IFNULL(a.invt_cost,0)
                LEFT JOIN 
                    (
                        SELECT 
                            adjt_product, 
                            adjt_variant, 
                            IFNULL(invt_cost,0) AS adjt_cost,
                            SUM(adjt_quantity) AS loses
                        FROM 
                            pos_stock_adjustment,
                            pos_stock_inventory
                        WHERE
                            adjt_item=invt_id AND 
                            adjt_details<>'Add Inventory' AND
                            DATE(adjt_time + INTERVAL 8 HOUR) <= '@asof' AND 
                            invt_store LIKE '%@store%'
                        GROUP BY adjt_product,adjt_variant,adjt_cost
                    ) h 
                        ON h.adjt_product=a.invt_product AND 
                        h.adjt_variant=a.invt_variant AND 
                        h.adjt_cost=IFNULL(a.invt_cost,0)  
        WHERE 
            invt_store LIKE '%@store%' AND
            invt_category LIKE '%@category%' 
        GROUP BY inventory,invt_cost,invt_store,invt_product,invt_variant,received,dispensed,transfered,returned,adjusted,ontransit,loses
        ORDER BY inventory,invt_cost,invt_product,invt_variant;
        `
    ),
    stock_alert: new Query("stock_alert", `
        SELECT
            prod_name AS product,
            CONCAT(IFNULL(vrnt_serial, '-'), '/', IFNULL(vrnt_model, '-'), '/', IFNULL(vrnt_brand, '-')) AS variant,
            SUM(IFNULL(invt_stocks,0)) AS stocks,
            vrnt_alert AS alert,
            invt_category AS category
        FROM 
            pos_stock_inventory 
            LEFT JOIN pos_stock_masterlist 
                ON prod_id=invt_product 
            LEFT JOIN lib_variant 
                ON vrnt_id=invt_variant
        WHERE 
            invt_store LIKE '%@store%' AND
            invt_category LIKE '%@category%' AND 
            vrnt_alert > 0 
        GROUP BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,vrnt_id,invt_category,vrnt_alert
        ORDER BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category,vrnt_alert;
    `)
}

module.exports = reports