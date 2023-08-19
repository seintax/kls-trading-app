const router = require('express').Router()
const service = require('./inclusion.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/inclusion')
    .post(secure, service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/inclusion/id', secure, service._findone)
router.get('/inclusion/search', secure, service._search)
router.post('/inclusion/specify', service._specify)

module.exports = router