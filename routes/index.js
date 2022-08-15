const express = require('express');
const router = express.Router();

const V1Router = require('./v1/v1.route')

router.use('/v1', V1Router)

module.exports = router