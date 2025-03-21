const router = require('express').Router()
const service = require('./payment.query')
const complex = require('./payment.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/payment')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/payment/id', secure, service._findone)
router.get('/payment/search', secure, service._search)
router.post('/payment/specify', service._specify)
router.get('/payment/bycode', service.byCode)
router.get('/payment/bycheque', service.byCheque)
router.get('/payment/bysettled', service.bySettled)

router.post('/payment/sqlchequepayment', complex.sqlChequePayment)

module.exports = router