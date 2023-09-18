const handler = require("express-async-handler")
const { proceed, poolwrap, poolarray, poolalter, poolinject, poolremove, force } = require("../../utilities/callback.utility")
const helper = require('./inventory.helper')
const getbranch = require('./inventory.branch')
const { Param, Field } = require("../../utilities/builder.utility")

function p(object) {
    return new Param(object.alias, object.param)
}

function f(object) {
    return new Field(object.alias, object.value)
}

const _create = handler(async (req, res) => {
    const builder = helper.insert(req.body)
    await poolinject(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _update = handler(async (req, res) => {
    const builder = helper.update(req.body)
    await poolalter(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _delete = handler(async (req, res) => {
    const builder = helper.delete(req.body)
    await poolremove(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _record = handler(async (req, res) => {
    const builder = helper.records()
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _branch = handler(async (req, res) => {
    const { branch } = getbranch.parameters(req.query)
    const { acquisition, store, stocks, id } = getbranch.fields
    let params = [p(branch).Contains(), "0", "PROCUREMENT", "TRANSFER", "MIGRATION"]
    let clause = [f(store).Like(), f(stocks).Greater(), f(acquisition).Either(["", "", ""])]
    let series = [f(id).Asc()]
    let limits = undefined
    const builder = getbranch.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _search = handler(async (req, res) => {
    const { search } = helper.parameters(req.query)
    const { name, id } = helper.fields
    let params = [p(search).Exactly()]
    let clause = [f(name).IsEqual()]
    let series = [f(id).Asc()]
    let limits = undefined
    const builder = helper.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _findone = handler(async (req, res) => {
    const builder = helper.findone(req.query)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const _specify = handler(async (req, res) => {
    const builder = helper.specific(req.body)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byStocks = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { stocks, id } = getbranch.fields
    let params = ["0"]
    let clause = [f(stocks).Greater()]
    let series = [f(id).Asc()]
    let limits = undefined
    const builder = getbranch.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byTransmit = handler(async (req, res) => {
    const { branch } = getbranch.parameters(req.query)
    const { acquisition, store, stocks, id } = getbranch.fields
    let params = [p(branch).Contains(), "0", "TRANSMIT"]
    let clause = [f(store).Like(), f(stocks).Greater(), f(acquisition).IsEqual()]
    let series = [f(id).Asc()]
    let limits = undefined
    const builder = getbranch.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byProduct = handler(async (req, res) => {
    const param = getbranch.parameters(req.query)
    const { product, category, acquisition, store, stocks } = getbranch.fields
    const { variant_serial, variant_model, variant_brand } = getbranch.included
    let params = [p(param.product).Exactly(), p(param.category).Exactly(), p(param.branch).Contains(), "0", "PROCUREMENT", "TRANSFER", "MIGRATION"]
    let clause = [f(product).IsEqual(), f(category).IsEqual(), f(store).Like(), f(stocks).Greater(), f(acquisition).Either(["", "", ""])]
    let series = [f(variant_serial).Asc(), f(variant_model).Asc(), f(variant_brand).Asc()]
    let limits = undefined
    const builder = getbranch.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

module.exports = {
    _create,
    _record,
    _branch,
    _update,
    _delete,
    _search,
    _specify,
    _findone,
    byStocks,
    byTransmit,
    byProduct
}