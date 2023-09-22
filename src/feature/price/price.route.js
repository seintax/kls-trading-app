const router = require('express').Router()
const service = require('./price.query')
const complex = require('./price.logic')
const { secure } = require('../../../res/secure/secure')

router
    .route('/price')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/price/id', secure, service._findone)
router.get('/price/search', secure, service._search)
router.post('/price/specify', service._specify)
router.get('/price/byinventory', secure, service.byInventory)

router.post('/price/sqladjustprice', complex.sqlAdjustPrice)

module.exports = router