const router = require('express').Router()
const service = require('./refund.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/refund')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/refund/id', secure, service._findone)
router.get('/refund/search', secure, service._search)
router.post('/refund/specify', service._specify)

module.exports = router