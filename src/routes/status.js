const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');
const ingestionStore = require('../models/ingestionStore'); // if needed

const statusController = new StatusController(ingestionStore);

router.get('/:ingestion_id', statusController.getStatus);

module.exports = router;