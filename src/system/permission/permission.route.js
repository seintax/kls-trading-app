const router = require('express').Router()
const service = require('./permission.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/permission')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/permission/id', secure, service._findone)
router.get('/permission/search', secure, service._search)
router.post('/permission/specify', service._specify)

module.exports = router