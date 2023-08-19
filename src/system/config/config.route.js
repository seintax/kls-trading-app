const router = require('express').Router()
const service = require('./config.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/config')
    .post(secure, service._create)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/config/byaccount', service.byAccount)

module.exports = router