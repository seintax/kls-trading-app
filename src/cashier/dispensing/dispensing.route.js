const router = require('express').Router()
const service = require('./dispensing.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/dispensing')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/dispensing/id', secure, service._findone)
router.get('/dispensing/search', secure, service._search)
router.post('/dispensing/specify', service._specify)
router.get('/dispensing/bycode', service.byCode)
router.get('/dispensing/byinventory', service.byInventory)

module.exports = router