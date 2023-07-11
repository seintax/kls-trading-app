const router = require('express').Router()
const service = require('./category.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/category')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/category/id', secure, service._findone)
router.get('/category/search', secure, service._search)

module.exports = router