const router = require('express').Router()
const service = require('./masterlist.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/masterlist')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/masterlist/id', secure, service._findone)
router.get('/masterlist/search', secure, service._search)
router.post('/masterlist/specify', service._specify)
router.get('/masterlist/bycategory', service.byCategory)

module.exports = router