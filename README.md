# API Ingestion System

This project implements a simple API system for submitting data ingestion requests and checking their status. It is built using Node.js and Express, and it simulates the processing of data in batches while respecting rate limits and prioritizing requests.

## Project Structure

```
api-ingestion-system
├── src
│   ├── app.js                  # Entry point of the application
│   ├── routes
│   │   ├── ingest.js           # Defines the POST /ingest endpoint
│   │   └── status.js           # Defines the GET /status/<ingestion_id> endpoint
│   ├── controllers
│   │   ├── ingestController.js  # Handles ingestion requests
│   │   └── statusController.js  # Handles status requests
│   ├── services
│   │   ├── batchProcessor.js    # Processes batches of IDs asynchronously
│   │   └── queueManager.js       # Manages the queue of ingestion requests
│   ├── models
│   │   └── ingestionStore.js     # Persists and retrieves ingestion and batch statuses
│   └── utils
│       └── uuid.js              # Utility function for generating unique UUIDs
├── tests
│   └── api.test.js              # Extensive tests for the APIs
├── package.json                  # Configuration file for npm
├── README.md                     # Documentation for the project
└── .gitignore                    # Specifies files to be ignored by Git
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd api-ingestion-system
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

   The application will be running on `http://localhost:5000`.

## API Endpoints

### Ingestion API

- **Endpoint:** `POST /ingest`
- **Request Body:**
  ```json
  {
    "ids": [1, 2, 3, 4, 5],
    "priority": "HIGH"
  }
  ```
- **Response:**
  ```json
  {
    "ingestion_id": "abc123"
  }
  ```

### Status API

- **Endpoint:** `GET /status/<ingestion_id>`
- **Response:**
  ```json
  {
    "ingestion_id": "abc123",
    "status": "triggered",
    "batches": [
      {"batch_id": "1", "ids": [1, 2, 3], "status": "completed"},
      {"batch_id": "2", "ids": [4, 5], "status": "triggered"}
    ]
  }
  ```

## Design Choices

- The application uses an in-memory store to persist ingestion and batch statuses for simplicity.
- Asynchronous processing is implemented to handle batch jobs without blocking the main thread.
- A queue manager ensures that higher priority requests are processed before lower priority ones.
- Rate limiting is enforced to simulate the behavior of an external API.

## Testing

Extensive tests are provided in `tests/api.test.js` to verify the functionality of the ingestion and status APIs, ensuring that they honor rate limits and priorities correctly.

## License

This project is licensed under the MIT License.