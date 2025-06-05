class IngestController {
    constructor(queueManager, ingestionStore) {
        this.queueManager = queueManager;
        this.ingestionStore = ingestionStore;
    }

    async ingestData(req, res) {
        const { ids, priority } = req.body;

        if (!Array.isArray(ids) || ids.length === 0 || !['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Generate batches (max 3 ids per batch)
        const batches = [];
        for (let i = 0; i < ids.length; i += 3) {
            batches.push({
                batch_id: require('uuid').v4(),
                ids: ids.slice(i, i + 3),
                status: 'yet_to_start'
            });
        }

        // Enqueue and get ingestionId
        const ingestionId = this.queueManager.enqueue(ids, priority);

        // Add ingestion to the store
        this.ingestionStore.addIngestion(ingestionId, priority, batches);

        return res.status(202).json({ ingestion_id: ingestionId });
    }
}

module.exports = IngestController;