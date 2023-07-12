const router = require('express').Router()
const service = require('./complex.query')
const { secure } = require('../../res/secure/secure')

router.post('/complex/sqlcreatereceipt', secure, service.sqlCreateReceipt)
router.post('/complex/sqlcreatetransmit', secure, service.sqlCreateTransmit)

module.exports = router