const router = require('express').Router()
const service = require('./transfer.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/transfer')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/transfer/id', secure, service._findone)
router.get('/transfer/search', secure, service._search)
router.post('/transfer/specify', service._specify)

router.get('/transfer/bybranch', service.byBranch)
router.get('/transfer/byfilter', service.byFilter)

module.exports = router