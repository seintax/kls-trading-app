const handler = require("express-async-handler")
const helper = require('./income.helper')
const { mysqlpool, proceed, force, distinct } = require("../../utilities/callback.utility")

const sales = handler(async (req, res) => {
    const sql = helper.sales.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
        category: req.query.category,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(distinct(ans, req))
    })
})

const purchases = handler(async (req, res) => {
    const sql = helper.purchases.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
        category: req.query.category,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(distinct(ans, req))
    })
})

const goods_in = handler(async (req, res) => {
    const sql = helper.goods_in.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
        category: req.query.category,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const goods_out = handler(async (req, res) => {
    const sql = helper.goods_out.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
        category: req.query.category,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const expenses = handler(async (req, res) => {
    const sql = helper.expenses.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

module.exports = {
    sales,
    purchases,
    goods_in,
    goods_out,
    expenses,
}