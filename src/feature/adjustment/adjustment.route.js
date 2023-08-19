const router = require('express').Router()
const service = require('./adjustment.query')
const complex = require('./adjustment.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/adjustment')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/adjustment/id', secure, service._findone)
router.get('/adjustment/search', secure, service._search)
router.post('/adjustment/specify', service._specify)
router.get('/adjustment/byinventory', service.byInventory)

router.post('/adjustment/sqladjustment', complex.sqlAdjustment)

module.exports = router