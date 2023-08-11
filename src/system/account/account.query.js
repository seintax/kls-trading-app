const handler = require("express-async-handler")
const { proceed, poolwrap, poolarray, poolalter, poolinject, poolremove, force } = require("../../utilities/callback.utility")
const { match, tokenize } = require("../../../res/secure/secure")
const helper = require('./account.helper')
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
    const builder = helper.specific(req.query)
    await poolarray(builder, (err, ans) => {
        if (err) return res.status(401).json(force(err))
        res.status(200).json(proceed(ans, req))
    })
})

const authenticate = handler(async (req, res) => {
    // login
    const { user, pass } = req.body
    const builder = helper.findone({ user: user })
    await poolwrap(builder, handler(async (err, ans) => {
        if (err) return res.status(401).json(force(err))
        if (ans.distinctResult.distinct) {
            let isauthentic = await match(pass, ans.distinctResult.data.pass)
            if (isauthentic) {
                const payload = { id: ans.distinctResult.data.id, store: ans.distinctResult.data.store }
                let token = tokenize(res, payload)
                console.log(token)
                return res.status(200).json(proceed({
                    message: "Authorized.",
                    data: {
                        id: ans.distinctResult.data.id,
                        user: ans.distinctResult.data.user,
                        name: ans.distinctResult.data.name,
                        confirm: ans.distinctResult.data.confirm,
                        store: ans.distinctResult.data.store,
                        role: ans.distinctResult.data.role,
                    },
                    token: token
                }, req))
            }
        }
        res.status(401).json({
            err: "Invalid credentials."
        })
    }))
})

const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: 'Logged out successfully.' })
}

module.exports = {
    authenticate,
    _create,
    _record,
    _update,
    _delete,
    _search,
    _findone,
    _specify,
    logout
}