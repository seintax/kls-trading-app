const { Query } = require("../../utilities/builder.utility")

const reports = {
    weekly: new Query("weekly", `
    SELECT 
        DATE(paym_time) AS day, 
        SUM(IF(paym_method='CASH',paym_amount,0)) AS cash,
        SUM(IF(paym_method='CHEQUE',paym_amount,0)) AS cheque,
        SUM(IF(paym_method='GCASH',paym_amount,0)) AS gcash
    FROM 
        pos_payment_collection 
            LEFT JOIN pos_sales_transaction 
                ON trns_code = paym_trans
    WHERE 
        DATE(paym_time) BETWEEN '@fr' AND '@to' 
    GROUP BY DATE(paym_time) 
    ORDER BY DATE(paym_time) ASC
    `)
}

module.exports = reports