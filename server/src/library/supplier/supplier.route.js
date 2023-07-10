const router = require('express').Router()
const service = require('./supplier.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/supplier')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/supplier/id', secure, service._findone)
router.get('/supplier/search', secure, service._search)
router.post('/supplier/specify', service._specify)

module.exports = router