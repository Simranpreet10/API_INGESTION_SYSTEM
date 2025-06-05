class StatusController {
    constructor(ingestionStore) {
        this.ingestionStore = ingestionStore;
    }

    getStatus = (req, res) => {
        const { ingestion_id } = req.params;
        // Use the correct method name from your ingestionStore
        const ingestionData = this.ingestionStore.getIngestionStatus(ingestion_id);

        if (!ingestionData) {
            return res.status(404).json({ error: "Ingestion ID not found" });
        }

        const batches = ingestionData.batches.map(batch => ({
            batch_id: batch.batch_id,
            ids: batch.ids,
            status: batch.status
        }));

        const overallStatus = this.calculateOverallStatus(batches);

        return res.json({
            ingestion_id: ingestion_id,
            status: overallStatus,
            batches: batches
        });
    }

    calculateOverallStatus(batches) {
        const statuses = batches.map(batch => batch.status);
        if (statuses.every(status => status === "yet_to_start")) {
            return "yet_to_start";
        }
        if (statuses.some(status => status === "triggered")) {
            return "triggered";
        }
        return "completed";
    }
}

module.exports = StatusController;