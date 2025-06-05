const ingestionStore = require('../models/ingestionStore');

function processBatch(batch) {
    batch.status = 'triggered';
    setTimeout(() => {
        batch.status = 'completed';
    }, 1000); // Simulate processing time
}

setInterval(() => {
    const allIngestions = ingestionStore.getAllIngestions();
    for (const ingestionId in allIngestions) {
        const ingestion = allIngestions[ingestionId];
        const nextBatch = ingestion.batches.find(b => b.status === 'yet_to_start');
        if (nextBatch) {
            processBatch(nextBatch);
            break; // Only process one batch per interval
        }
    }
}, 5000); // 1 batch per 5 seconds

module.exports = {};