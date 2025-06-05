const { v4: uuidv4 } = require('uuid');

class QueueManager {
    constructor() {
        this.queue = [];
    }

    enqueue(ids, priority) {
        const ingestionId = uuidv4();
        const request = { ingestionId, ids, priority, createdAt: Date.now() };
        this.queue.push(request);
        this.queue.sort((a, b) => this.comparePriority(a, b));
        return ingestionId;
    }

    comparePriority(a, b) {
        const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.createdAt - b.createdAt;
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = new QueueManager();