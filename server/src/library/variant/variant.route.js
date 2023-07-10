const router = require('express').Router()
const service = require('./variant.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/variant')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/variant/id', secure, service._findone)
router.get('/variant/search', secure, service._search)
router.post('/variant/specify', service._specify)

router.get('/variant/byproduct', service.byProduct)

module.exports = router