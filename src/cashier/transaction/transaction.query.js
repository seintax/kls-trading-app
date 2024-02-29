const handler = require("express-async-handler")
const { proceed, poolwrap, poolarray, poolalter, poolinject, poolremove, force } = require("../../utilities/callback.utility")
const helper = require('./transaction.helper')
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

const byAccount = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { account, date, id } = helper.fields
    let params = [p(param.account).Exactly(), p(param.date).Exactly()]
    let clause = [f(account).IsEqual(), f(date).PSTDate().IsEqual()]
    let series = [f(id).Desc()]
    let limits = undefined
    const builder = helper.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byAdmin = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { date, id } = helper.fields
    let params = [p(param.date).Exactly()]
    let clause = [f(date).PSTDate().IsEqual()]
    let series = [f(id).Desc()]
    let limits = undefined
    const builder = helper.inquiry(clause, params, series, limits)
    console.log(builder.sql)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byDateRange = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { date, time } = helper.fields
    const { account_store } = helper.included
    let params = [p(param.branch).Contains(), p(param.fr).Exactly(), p(param.to).Exactly()]
    let clause = [f(account_store).Like(), f(date).Between()]
    let series = [f(time).Desc()]
    let limits = undefined
    const builder = helper.inquiry(clause, params, series, limits)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byMaxAccount = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { code, account, date } = helper.fields
    let params = [p(param.account).Exactly()]
    let clause = [f(account).IsEqual()]
    let field = [f(code).parameter()]
    const builder = helper.max(field, clause, params)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byCount = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { code, account, date } = helper.fields
    let params = [p(param.account).Exactly(), p(param.date).Exactly()]
    let clause = [f(account).IsEqual(), f(date).IsEqual()]
    const builder = helper.count(clause, params)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const byAllCount = handler(async (req, res) => {
    const param = helper.parameters(req.query)
    const { account } = helper.fields
    let params = [p(param.account).Exactly()]
    let clause = [f(account).IsEqual()]
    const builder = helper.count(clause, params)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

module.exports = {
    _create,
    _record,
    _update,
    _delete,
    _search,
    _specify,
    _findone,
    byAccount,
    byAdmin,
    byDateRange,
    byMaxAccount,
    byCount,
    byAllCount,
}