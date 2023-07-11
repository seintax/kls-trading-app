const router = require('express').Router()
const service = require('./complex.query')
const { secure } = require('../../res/secure/secure')

router.post('/complex/sqlcreatereceipt', secure, service.sqlCreateReceipt)

module.exports = router