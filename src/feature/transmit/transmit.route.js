const router = require('express').Router()
const service = require('./transmit.query')
const { secure } = require('../../../res/secure/secure')

router
    .route('/transmit')
    .post(service._create)
    .get(secure, service._record)
    .patch(secure, service._update)
    .delete(secure, service._delete)
router.get('/transmit/id', secure, service._findone)
router.get('/transmit/search', secure, service._search)
router.post('/transmit/specify', service._specify)
router.get('/transmit/bytransfer', service.byTransfer)

module.exports = router