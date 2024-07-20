const router = require('express').Router()
const moment = require('moment')

router.get('/test/connection', (req, res) => {
    res.status(200).json({
        message: "You are successfully connected",
        on: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    })
})

module.exports = router