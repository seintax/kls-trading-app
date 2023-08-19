const router = require('express').Router()
const service = require('./delivery.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/delivery')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/delivery/id', secure, service._findone)
router.get('/delivery/search', secure, service._search)
router.post('/delivery/specify', service._specify)

module.exports = router