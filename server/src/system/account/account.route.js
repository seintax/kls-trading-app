const router = require('express').Router()
const service = require('./account.query')
const { secure, hash } = require('../../../secure/secure')

router
    .route('/account')
    .get(service._record)
    .post(hash, service._create)
    .patch(secure, service._update)
    .delete(service._delete)
router.get('/account/id', service._findone)
router.get('/account/search', service._search)
router.post('/auth', service.authenticate)
router.post('/logout', service.logout)

module.exports = router