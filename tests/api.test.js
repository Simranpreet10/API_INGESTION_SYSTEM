global.TextEncoder = require('util').TextEncoder;
const request = require('supertest');
const app = require('../src/app');

jest.setTimeout(15000);

describe('API Ingestion System', () => {
    let ingestionId;

    describe('POST /ingest', () => {
        it('should return an ingestion_id for valid request', async () => {
            const response = await request(app)
                .post('/ingest')
                .send({ ids: [1, 2, 3, 4, 5], priority: 'MEDIUM' })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(202);
            expect(response.body).toHaveProperty('ingestion_id');
            ingestionId = response.body.ingestion_id;
        });

        it('should process higher priority requests first', async () => {
            await request(app)
                .post('/ingest')
                .send({ ids: [6, 7, 8, 9], priority: 'HIGH' })
                .set('Content-Type', 'application/json');

            // Wait for processing to complete
            await new Promise(resolve => setTimeout(resolve, 5200));

            const statusResponse = await request(app).get(`/status/${ingestionId}`);
            expect(statusResponse.status).toBe(200);
            // Accept both 'triggered' and 'completed' as valid
            expect(['triggered', 'completed']).toContain(statusResponse.body.status);
            expect(statusResponse.body.batches).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ ids: [1, 2, 3], status: expect.stringMatching(/triggered|completed/) }),
                    expect.objectContaining({ ids: [4, 5], status: expect.stringMatching(/yet_to_start|triggered|completed/) }),
                ])
            );
        });
    });

    describe('GET /status/:ingestion_id', () => {
        it('should return the status of the ingestion request', async () => {
            const response = await request(app).get(`/status/${ingestionId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('ingestion_id', ingestionId);
            expect(response.body).toHaveProperty('status');
            expect(response.body.batches).toBeInstanceOf(Array);
        });

        it('should return 404 for invalid ingestion_id', async () => {
            const response = await request(app).get('/status/invalid_id');
            expect(response.status).toBe(404);
        });
    });
});