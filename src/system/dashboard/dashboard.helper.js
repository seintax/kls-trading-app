const { Query } = require("../../utilities/builder.utility")

const dashboard = {
    weekly: new Query("weekly", `
    SELECT 
        DATE(paym_time) AS day, 
        SUM(IF(paym_method='CASH',paym_amount,0)) AS cash,
        SUM(IF(paym_method='CHEQUE',paym_amount,0)) AS cheque,
        SUM(IF(paym_method='GCASH',paym_amount,0)) AS gcash
    FROM 
        pos_payment_collection 
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = paym_trans
    WHERE 
        paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    GROUP BY DATE(paym_time) 
    ORDER BY DATE(paym_time) ASC
    `),
    weekly_gross_sales: new Query("weekly_gross_sales", `
    SELECT
        @date
        SUM(sale_total) AS total
    FROM 
        pos_sales_dispensing 
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = sale_trans
    WHERE 
        sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    @group 
    @order
    `),
    weekly_refunds: new Query("weekly_refunds", `
    SELECT 
        @date
        SUM(rtrn_r_net) AS total
    FROM 
        pos_return_transaction
            LEFT JOIN sys_account 
                ON acct_id = rtrn_account
    WHERE 
        rtrn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    @group 
    @order
    `),
    weekly_discounts: new Query("weekly_discounts", `
    SELECT 
        @date
        SUM(sale_less) AS total
    FROM 
        pos_sales_dispensing
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = sale_trans
    WHERE 
        sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    @group 
    @order
    `),
    weekly_net_sales: new Query("net_weekly_sales", `
    SELECT 
        @date
        SUM(sale_net) AS total
    FROM 
        pos_sales_dispensing
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = sale_trans
    WHERE 
        sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    @group 
    @order
    `),
    weekly_gross_profit: new Query("weekly_gross_profit", `
    SELECT 
        @date
        SUM(sale_net - invt_cost) AS total
    FROM 
        pos_sales_dispensing, 
        pos_stock_inventory
    WHERE 
        sale_item=invt_id AND 
        sale_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        invt_store LIKE '%@store%'
    @group 
    @order
    `),
    weekly_collectibles: new Query("collectibles", `
    SELECT 
        @date
        SUM(cred_outstand) AS total 
    FROM 
        pos_sales_credit
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = cred_trans
    WHERE 
        cred_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' AND 
        acct_store LIKE '%@store%'
    @group 
    @order
    `),
    collectibles: new Query("collectibles", `
    SELECT 
        SUM(cred_outstand) AS total 
    FROM 
        pos_sales_credit 
            LEFT JOIN (
                SELECT 
                    acct_store,trns_code 
                FROM 
                    pos_sales_transaction, 
                    sys_account 
                WHERE acct_id=trns_account
            ) a 
            ON a.trns_code = cred_trans
    WHERE
        acct_store LIKE '%@store%';
    `),
}

module.exports = dashboard