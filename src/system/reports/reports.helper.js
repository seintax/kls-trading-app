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
            SUM(sale_less + sale_markdown) AS discounts,
            SUM(sale_net) AS net_sales,
            SUM(sale_dispense * invt_cost) AS goods_cost,
            SUM(sale_net - (sale_dispense * invt_cost)) AS gross_profit,
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
        ORDER BY DATE(sale_time + INTERVAL 8 HOUR)
        `
    ),
    expenses: new Query("expenses", `
        SELECT
            expn_inclusion AS expense_name,
            expn_store AS branch_name,
            COUNT(expn_id) AS expense_count,
            SUM(expn_purchase) AS expense_value,
            DATE(expn_time + INTERVAL 8 HOUR) AS expense_date
        FROM 
            pos_archive_expenses,
            sys_account
        WHERE 
            expn_account=acct_id AND 
            (expn_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            expn_store LIKE '%@store%' 
        GROUP BY DATE(expn_time + INTERVAL 8 HOUR),expn_store,expn_inclusion
        ORDER BY DATE(expn_time + INTERVAL 8 HOUR),expn_store,expn_inclusion
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
            (expn_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
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
            SUM(trns_total) AS gross_sales,
            SUM(trns_less + trns_markdown + IFNULL(rtrn_r_less,0) + IFNULL(rtrn_r_markdown,0)) AS discounts,
            SUM(trns_net) AS net_sales,
            SUM(IF(trns_method='CREDIT', trns_net - trns_partial, 0)) AS credit_sales,
            SUM(trns_partial) AS partial,
            acct_store AS branch,
            (
                SELECT 
                    SUM(rtrn_r_net)
                FROM 
                    pos_return_transaction,
                    sys_account  
                WHERE 
                    acct_id=rtrn_account 
                        AND
                    acct_store=branch
                        AND
                    (rtrn_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
            ) AS refunds,
            (
                SELECT 
                    SUM(paym_amount)
                FROM pos_payment_collection 
                WHERE 
                    paym_type='SALES' 
                        AND
                    paym_store=branch
                        AND
                    (paym_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
            ) AS cash_sales,
            (
                SELECT 
                    SUM(paym_amount)
                FROM pos_payment_collection 
                WHERE 
                    paym_type='CREDIT' 
                        AND
                    paym_store=branch
                        AND
                    (paym_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
            ) AS credit_collection
        FROM 
            pos_sales_transaction
                LEFT JOIN (
                    SELECT 
                        rtrn_trans,
                        rtrn_p_total,
                        rtrn_p_less,
                        rtrn_p_markdown,
                        rtrn_p_net,
                        rtrn_r_less,
                        rtrn_r_markdown,
                        MIN(rtrn_id)
                    FROM pos_return_transaction 
                    GROUP BY rtrn_trans,rtrn_p_total,rtrn_p_less,rtrn_p_markdown,rtrn_p_net,rtrn_r_less,rtrn_r_markdown
                ) a ON a.rtrn_trans=trns_code,
            sys_account
        WHERE 
            trns_account=acct_id AND 
            (trns_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            acct_store LIKE '%@store%' 
        GROUP BY DATE(trns_time + INTERVAL 8 HOUR),refunds,acct_store,cash_sales,credit_collection
        ORDER BY DATE(trns_time + INTERVAL 8 HOUR)
        `
    ),
    inventory_valuation: new Query("inventory_valuation", `
    SELECT
        CONCAT(prod_name, ' - ', IFNULL(vrnt_serial,''), '/', IFNULL(vrnt_model,''), '/', IFNULL(vrnt_brand,'')) AS inventory,
        prod_name AS product,
        vrnt_serial AS variant1,
        vrnt_model AS variant2,
        vrnt_brand AS variant3,
        invt_cost AS cost,
        SUM(invt_stocks) AS stocks,
        SUM(invt_stocks * IFNULL(invt_cost,0)) AS value,
        SUM(invt_stocks * invt_price) AS retail,
        SUM((invt_stocks * invt_price) - (invt_stocks * IFNULL(invt_cost,0))) AS profit
    FROM 
        pos_stock_inventory
            LEFT JOIN 
                pos_stock_masterlist
                    ON prod_id=invt_product 
            LEFT JOIN
                lib_variant 
                    ON vrnt_id=invt_variant
    WHERE 
        invt_store LIKE '%@store%'
    GROUP BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_cost
    ORDER BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_cost;
        `
    ),
    // cashier_summary: new Query("cashier_summary", `
    //     SELECT
    //         DATE(trns_time + INTERVAL 8 HOUR) AS day,
    //         SUM(IFNULL(rtrn_p_total, trns_total)) AS gross_sales,
    //         SUM(IFNULL(rtrn_p_less, trns_less) + IFNULL(rtrn_p_markdown, trns_markdown)) AS discounts,
    //         SUM(IFNULL(rtrn_p_net, trns_net)) AS net_sales,
    //         SUM(IF(trns_method='CREDIT', IFNULL(rtrn_p_net, trns_net) - trns_partial, 0)) AS credit_sales,
    //         SUM(trns_partial) AS partial,
    //         acct_store AS branch,
    //         (
    //             SELECT 
    //                 SUM(rtrn_r_net)
    //             FROM 
    //                 pos_return_transaction,
    //                 sys_account  
    //             WHERE 
    //                 acct_id=rtrn_account 
    //                     AND
    //                 acct_store=branch
    //                     AND
    //                 DATE(rtrn_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
    //         ) AS refunds,
    //         (
    //             SELECT 
    //                 SUM(paym_amount)
    //             FROM pos_payment_collection 
    //             WHERE 
    //                 paym_type='SALES' 
    //                     AND
    //                 paym_store=branch
    //                     AND
    //                 DATE(paym_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
    //         ) AS cash_sales,
    //         (
    //             SELECT 
    //                 SUM(paym_amount)
    //             FROM pos_payment_collection 
    //             WHERE 
    //                 paym_type='CREDIT' 
    //                     AND
    //                 paym_store=branch
    //                     AND
    //                 DATE(paym_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
    //         ) AS credit_collection
    //     FROM 
    //         pos_sales_transaction
    //             LEFT JOIN (
    //                 SELECT 
    //                     rtrn_trans,
    //                     rtrn_p_total,
    //                     rtrn_p_less,
    //                     rtrn_p_markdown,
    //                     rtrn_p_net,
    //                     MIN(rtrn_id)
    //                 FROM pos_return_transaction 
    //                 GROUP BY rtrn_trans,rtrn_p_total,rtrn_p_less,rtrn_p_markdown,rtrn_p_net
    //             ) a ON a.rtrn_trans=trns_code,
    //         sys_account
    //     WHERE 
    //         trns_account=acct_id 
    //             AND 
    //         (trns_time + INTERVAL 8 HOUR) BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
    //             AND
    //         acct_store LIKE '%@store%' 
    //     GROUP BY DATE(trns_time + INTERVAL 8 HOUR),refunds,acct_store,cash_sales,credit_collection
    //     ORDER BY DATE(trns_time + INTERVAL 8 HOUR)
    //     `
    // ),
}

module.exports = reports

// (
//     SELECT
//         SUM(cred_balance)
//     FROM pos_sales_credit
//     WHERE
//         cred_store=invt_store
//             AND
//         DATE(cred_time)=DATE(sale_time)
// ) AS credit_sales,