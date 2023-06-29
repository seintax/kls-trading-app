const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const handler = require("express-async-handler")
const helper = require('../../src/system/account/account.helper')
const { poolwrap } = require('../../src/utilities/callback.utility')

const authorize = handler(async (param, callback) => {
    // check for authorization
    const builder = helper.findone({ id: param.id })
    await poolwrap(builder, (err, ans) => {
        if (err) return callback(err)
        if (ans.single) {
            return callback(null, {
                id: ans.data.id,
                user: ans.data.user
            })
        }
        return callback({ err: "Invalid credentials." })
    })
})

const secure = handler(async (req, res, next) => {
    let token
    token = req.cookies.jwt
    if (token) {
        try {
            let decoded = await jwt.verify(token, process.env.JWT_SECRET)
            await authorize(decoded, async (err, ans) => {
                if (err) return res.status(401).json({
                    err: "Unauthorized: Invalid token."
                })
                req.user = ans
            })
            next()
        }
        catch (err) {
            res.status(401)
            throw new Error('Unauthorized: Token failed.')
        }
    }
    else {
        res.status(401)
        throw new Error("Unauthorized: No token.")
    }
})

const tokenize = (res, payload) => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    )

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000
    })
}

const hash = handler(async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    let hashed = await bcrypt.hash(req.body.pass, salt)
    req.body.pass = hashed
    next()
})

const match = handler(async (enteredpassword, storedpassword) => {
    return await bcrypt.compare(enteredpassword, storedpassword)
})

module.exports = {
    hash,
    match,
    secure,
    tokenize,
}