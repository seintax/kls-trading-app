const router = require('express').Router()
const service = require('./customer.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/customer')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/customer/id', secure, service._findone)
router.get('/customer/search', secure, service._search)
router.post('/customer/specify', service._specify)

module.exports = router