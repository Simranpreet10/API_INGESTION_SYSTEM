const express = require('express');
const bodyParser = require('body-parser');
const ingestRoutes = require('./routes/ingest');
const statusRoutes = require('./routes/status');
require('./services/batchProcessor');

const app = express();
app.use(bodyParser.json());
app.use('/ingest', ingestRoutes);
app.use('/status', statusRoutes);

module.exports = app; // <-- Only export the app, do NOT call app.listen() here