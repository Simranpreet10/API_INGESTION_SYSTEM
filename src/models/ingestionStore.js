class IngestionStore {
    constructor() {
        this.ingestions = {};
    }

    addIngestion(ingestionId, priority, batches) {
        this.ingestions[ingestionId] = {
            status: 'yet_to_start',
            priority: priority,
            batches: batches
        };
    }

    updateBatchStatus(ingestionId, batchId, status) {
        if (this.ingestions[ingestionId]) {
            const batch = this.ingestions[ingestionId].batches.find(b => b.batch_id === batchId);
            if (batch) {
                batch.status = status;
            }
        }
    }

    getIngestionStatus(ingestionId) {
        return this.ingestions[ingestionId] || null;
    }

    getAllIngestions() {
        return this.ingestions;
    }
}

module.exports = new IngestionStore();