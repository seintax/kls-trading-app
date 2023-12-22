const router = require('express').Router()
const service = require('./purchase.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/purchase')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/purchase/id', secure, service._findone)
router.get('/purchase/search', secure, service._search)
router.get('/purchase/specify', service._specify)
router.get('/purchase/bydate', service.byDate)

module.exports = router