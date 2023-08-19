const router = require('express').Router()
const service = require('./roles.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/roles')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/roles/id', secure, service._findone)
router.get('/roles/search', secure, service._search)
router.post('/roles/specify', service._specify)

router.get('/roles/bydev', service.byDev)

module.exports = router