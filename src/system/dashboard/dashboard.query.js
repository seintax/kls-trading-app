const handler = require("express-async-handler")
const { proceed, force, mysqlpool } = require("../../utilities/callback.utility")
const helper = require('./dashboard.helper')
const inclusion = ["DevOp", "SysAd", "Admin"]

const _weekly = handler(async (req, res) => {
    const sql = helper.weekly.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store ? req.query.store : "",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const weekly_gross_sales = handler(async (req, res) => {
    const sql = helper.weekly_gross_sales.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(sale_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(sale_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(sale_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_credit_sales = handler(async (req, res) => {
    const sql = helper.weekly_credit_sales.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(sale_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(sale_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(sale_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_refunds = handler(async (req, res) => {
    const sql = helper.weekly_refunds.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(rtrn_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(rtrn_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(rtrn_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_discounts = handler(async (req, res) => {
    const sql = helper.weekly_discounts.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(sale_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(sale_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(sale_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_net_sales = handler(async (req, res) => {
    const sql = helper.weekly_net_sales.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(sale_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(sale_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(sale_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_gross_profit = handler(async (req, res) => {
    const sql = helper.weekly_gross_profit.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(sale_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(sale_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(sale_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_collectibles = handler(async (req, res) => {
    const sql = helper.weekly_collectibles.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(cred_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(cred_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(cred_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const weekly_credit_collection = handler(async (req, res) => {
    const sql = helper.weekly_credit_collection.inject({
        fr: req.query.fr,
        to: req.query.to,
        date: req.query.total ? "" : "DATE(paym_time + INTERVAL 8 HOUR) AS day, ",
        store: req.query.store ? req.query.store : "",
        group: req.query.total ? "" : "GROUP BY DATE(paym_time + INTERVAL 8 HOUR) ",
        order: req.query.total ? "" : "ORDER BY DATE(paym_time + INTERVAL 8 HOUR)",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: req.query.total
                ? (
                    ans.length
                        ? ans[0]
                        : { total: 0 }
                )
                : ans
        }, req))
    })
})

const collectibles = handler(async (req, res) => {
    const sql = helper.collectibles.inject({
        store: req.query.store ? req.query.store : "",
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({
            data: ans.length ? ans[0] : { total: 0 }
        }, req))
    })
})

module.exports = {
    _weekly,
    weekly_gross_sales,
    weekly_credit_sales,
    weekly_refunds,
    weekly_discounts,
    weekly_net_sales,
    weekly_gross_profit,
    weekly_collectibles,
    weekly_credit_collection,
    collectibles
}