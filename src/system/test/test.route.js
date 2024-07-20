const router = require('express').Router()
const moment = require('moment')

router.get('/test/connection', (req, res) => {
    res.status(200).json({
        message: "You are successfully connected",
        on: process.env.NODE_ENV === "development"
            ? moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            : moment(new Date()).add(8, 'HOURS').format("YYYY-MM-DD HH:mm:ss")
    })
})

module.exports = router