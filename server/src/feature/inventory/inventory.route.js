const router = require('express').Router()
const service = require('./inventory.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/inventory')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/inventory/id', secure, service._findone)
router.get('/inventory/search', secure, service._search)
router.post('/inventory/specify', service._specify)

module.exports = router