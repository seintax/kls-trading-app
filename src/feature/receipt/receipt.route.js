const router = require('express').Router()
const service = require('./receipt.query')
const complex = require('./receipt.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/receipt')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/receipt/id', secure, service._findone)
router.get('/receipt/search', secure, service._search)
router.get('/receipt/specify', service._specify)
router.get('/receipt/bydelivery', service.byDelivery)
router.get('/receipt/byrecent', service.byRecent)
router.get('/receipt/byreceivable', service.byReceivable)

router.post('/receipt/sqlreceipt', complex.sqlReceipt)

module.exports = router