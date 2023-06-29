const my = require('../../../data/mysql')
const handler = require("express-async-handler")
const { proceed, poolwrap, poolarray } = require("../../utilities/callback.utility")
const { match, tokenize } = require("../../../secure/secure")
const helper = require('./account.helper')

const _create = handler(async (req, res) => {
    const builder = helper.insert(req.body)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(err)
        res.status(200).json(proceed({ result: ans }))
    })
})

const _update = handler(async (req, res) => {
    const builder = helper.update(req.body)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(err)
        res.status(200).json(proceed({ result: ans }))
    })
})

const _delete = handler(async (req, res) => {
    const builder = helper.delete(req.body)
    await poolwrap(builder, (err, ans) => {
        if (err) return res.status(401).json(err)
        res.status(200).json(proceed({ result: ans }))
    })
})

const _record = handler(async (req, res) => {
    // const builder = helper.inquiry(req.body)
    // await poolwrap(builder, (err, ans) => {
    //     if (err) return res.status(401).json(err)
    //     res.status(200).json(proceed({ result: ans }))
    // })
})

const _search = handler(async (req, res) => {
    res.status(200).json(proceed({
        message: "hi"
    }))
})

const _findone = handler(async (req, res) => {
    res.status(200).json(proceed({
        message: sample.id,
        data: sample - 2
    }))
})

const authenticate = handler(async (req, res) => {
    // login
    const { user, pass } = req.body
    const builder = helper.findone({ user: user })
    await poolwrap(builder, handler(async (err, ans) => {
        if (err) return res.status(401).json(err)
        if (ans.single) {
            let authentic = await match(pass, ans.data.pass)
            if (authentic) {
                const payload = { id: ans.data.id, access: ans.data.time }
                tokenize(res, payload)

                return res.status(200).json(proceed({
                    message: "Authorized.",
                    data: {
                        id: ans.data.id,
                        user: ans.data.user
                    }
                }))
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
    _update,
    _delete,
    _record,
    _search,
    _findone,
    logout
}