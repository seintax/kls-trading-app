const router = require('express').Router()
const service = require('./transaction.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/transaction')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/transaction/id', secure, service._findone)
router.get('/transaction/search', secure, service._search)
router.post('/transaction/specify', service._specify)
router.get('/transaction/byaccount', service.byAccount)
router.get('/transaction/byadmin', service.byAdmin)
router.get('/transaction/bymaxaccount', service.byMaxAccount)
router.get('/transaction/bycount', service.byCount)

module.exports = router