const router = require('express').Router()
const service = require('./transfer.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/transfer')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/transfer/id', secure, service._findone)
router.get('/transfer/search', secure, service._search)
router.post('/transfer/specify', service._specify)

module.exports = router