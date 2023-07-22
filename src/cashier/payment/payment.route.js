const router = require('express').Router()
const service = require('./payment.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/payment')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/payment/id', secure, service._findone)
router.get('/payment/search', secure, service._search)
router.post('/payment/specify', service._specify)
router.get('/payment/bycode', service.byCode)
router.get('/payment/bycheque', service.byCheque)

module.exports = router