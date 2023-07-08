const router = require('express').Router()
const service = require('./account.query')
const { secure, hash } = require('../../../res/secure/secure')

router
    .route('/account')
    .post(hash, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/account/id', secure, service._findone)
router.get('/account/search', secure, service._search)
router.post('/account/specify', secure, service._specify)
router.post('/auth', service.authenticate)
router.post('/logout', service.logout)

module.exports = router