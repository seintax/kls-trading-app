const router = require('express').Router()
const service = require('./database.query')
const { secure } = require('../../../res/secure/secure')

router.get('/database', secure, service.getData)

module.exports = router