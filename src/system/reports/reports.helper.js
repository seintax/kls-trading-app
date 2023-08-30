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
            sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            invt_store LIKE '%@store%' 
        GROUP BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category,invt_store
        ORDER BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category
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
            sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
            invt_store LIKE '%@store%' 
        GROUP BY invt_category,invt_store
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
            paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
            acct_store LIKE '%@store%'
        GROUP BY paym_type,paym_method,acct_store
        ORDER BY paym_type,paym_method
        `
    ),
    sales_summary: new Query("sales_summary", `
        SELECT
            DATE(sale_time) AS day,
            SUM(sale_total) AS gross_sales,
            SUM(sale_price * sale_returned) AS refunds,
            SUM(sale_less) AS discounts,
            SUM(sale_net) AS net_sales,
            SUM(sale_dispense * invt_cost) AS goods_cost,
            SUM(sale_net - (sale_dispense * invt_cost)) AS gross_profit,
            invt_store AS branch
        FROM 
            pos_sales_dispensing
                LEFT JOIN pos_sales_transaction
                    ON trns_code=sale_trans,
            pos_stock_inventory
        WHERE 
            sale_item=invt_id AND 
            sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            invt_store LIKE '%@store%' 
        GROUP BY DATE(sale_time),invt_store
        ORDER BY DATE(sale_time)
        `
    ),
    expenses: new Query("expenses", `
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
            expn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            expn_store LIKE '%@store%' 
        GROUP BY DATE(expn_time),expn_store,expn_inclusion
        ORDER BY DATE(expn_time),expn_store,expn_inclusion
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
            expn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND
            acct_store LIKE '%@store%' 
        GROUP BY DATE(expn_time),acct_store
        ORDER BY DATE(expn_time)
        `
    ),
}

module.exports = reports