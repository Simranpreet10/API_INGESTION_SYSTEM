const express = require('express');
const router = express.Router();
const IngestController = require('../controllers/ingestController');
const queueManager = require('../services/queueManager');
const ingestionStore = require('../models/ingestionStore');

const ingestController = new IngestController(queueManager, ingestionStore);

router.post('/', ingestController.ingestData.bind(ingestController));

module.exports = router;