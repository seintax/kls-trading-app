const handler = require("express-async-handler")
const { proceed, force, mysqlpool } = require("../../utilities/callback.utility")
const helper = require('./reports.helper')

const sales_by_item = handler(async (req, res) => {
    const sql = helper.sales_by_item.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const sales_by_category = handler(async (req, res) => {
    const sql = helper.sales_by_category.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const sales_collection = handler(async (req, res) => {
    const sql = helper.sales_collection.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
    })
    await mysqlpool.query(sql, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed({ data: ans }, req))
    })
})

const sales_summary = handler(async (req, res) => {
    const sql = helper.sales_summary.inject({
        fr: req.query.fr,
        to: req.query.to,
        store: req.query.store,
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

const expenses_summary = handler(async (req, res) => {
    const sql = helper.expenses_summary.inject({
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
    sales_by_item,
    sales_by_category,
    sales_collection,
    sales_summary,
    expenses,
    expenses_summary
}