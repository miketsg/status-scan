# Status-scan

status-scan is a lightweight website monitoring system built with TypeScript. It periodically checks specified websites for content changes, records metrics (HTTP status, loading time, and content hash), logs events, and persists historical change events in MongoDB.


## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Scheduled Monitoring**: Periodically monitors one or more websites.
- **Metrics Logging**: Records HTTP status, loading time, and content hash.
- **Change Detection**: Detects when website content changes.
- **Persistent Logging**: Stores monitoring state and change events in MongoDB.
- **Unit Testing**: Implements tests using Jest to ensure reliability.

## Requirements

- Node.js (v14 or later recommended)
- npm
- Docker (for running MongoDB)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/miketsg/status-scan.git
   cd status-scan
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Configuration

1. Create a `.env` file:

   ```sh
   cp .env.example .env
   ```

2. Update the `.env` file:
   - `URLS`
   - `SCHEDULE_INTERVAL`
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `EMAIL_RECIPIENTS`

## Docker Setup

To run MongoDB using Docker, execute the following commands:

1. Pull and run the MongoDB Docker image:

   ```sh
   docker run --name status-scan-mongo -d -p 27017:27017 mongo
   ```

2. Check if the MongoDB container is running:

   ```sh
   docker ps
   ```

3. Connect to the running MongoDB container:

   ```sh
   docker exec -it status-scan-mongo mongosh
   ```

## Unified Script for Running status-scan and Test Page

A script has been provided to launch both the monitoring system and a simple HTML test page.

1. Ensure Docker and Node.js are installed.
2. Run the unified script:

   ```sh
   chmod +x run.sh
   ./run.sh
   ```

This script will:

- Start a MongoDB container if not already running.
- Serve a basic HTML test page.
- Run status-scan in development mode.

## Usage

1. Build the project:

   ```sh
   npm run build
   ```

2. Run the application:

   ```sh
   npm start
   ```

   The application will connect to MongoDB, start monitoring the configured websites, and log detected changes.

## Testing

Run the unit tests using Jest:

```sh
npm test
```

This command executes tests located in the `src/__tests__` directory and generates a coverage report.

## Project Structure

```bash
status-scan/
├── src/
│   ├── __tests__/
│   │   └── utils.test.ts         # Unit tests for utility functions
│   ├── assets/
│       ├── basic-html-page.html       # Simple HTML page for testing
│   ├── config.ts                 # Application configuration
│   ├── db.ts                     # Database connection and collection definitions
│   ├── index.ts                  # Application entry point
│   ├── monitor.ts                # Website monitoring logic
│   ├── utils.ts                   # Utility functions (e.g., hashing)
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── Dockerfile                    # Dockerfile for containerizing status-scan
├── jest.config.js                # Jest configuration
├── package-lock.json
├── package.json
├── README.md
├── run.sh                        # Unified script for running MongoDB, test page, and app
└── tsconfig.json                 # TypeScript configuration
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
