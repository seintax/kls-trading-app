const my = require('../../res/data/mysql')
const handler = require("express-async-handler")
const moment = require('moment')

const createNotification = handler(async () => {
    const today = moment(new Date()).format("YYYY-MM-DD")
    const type = "STOCK ALERT"
    const check = ` SELECT * FROM sys_notification WHERE ntfy_type=? AND ntfy_date=?; `
    console.info(`Scheduled task performed for ${today}: ${type}`)
    await my.pool.query(check, [type, today], async (err, ans) => {
        if (err) return err
        if (!ans?.length) {
            const alerts = `
                SELECT
                    COUNT(*) AS total
                FROM (
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
                        vrnt_alert > 0 
                    GROUP BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,vrnt_id,invt_category,vrnt_alert
                    ORDER BY prod_name,vrnt_serial,vrnt_model,vrnt_brand,invt_category,vrnt_alert
                ) a
                WHERE stocks <= alert
            `
            await my.pool.query(alerts, [], async (err, ans) => {
                if (err) return err
                if (ans?.length) {
                    const total = ans[0].total
                    const message = `${total} items have stocks on critical level.`
                    const url = "https://jallytrading.company/#/reports?id=stock-alert"
                    const create = `
                        INSERT INTO
                            sys_notification (
                                ntfy_date,
                                ntfy_type,
                                ntfy_message,
                                ntfy_url
                            ) 
                        VALUES (?,?,?,?);
                    `
                    await my.pool.query(create, [today, type, message, url], async (err, ans) => {
                        if (err) return err
                        console.info(`Stock alert notification created for ${today}`)
                    })
                }
            })
        }

    })

})

module.exports = {
    createNotification
}