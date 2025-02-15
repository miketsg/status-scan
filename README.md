# Status-scan

status-scan is a lightweight website monitoring system built with TypeScript. It periodically checks specified websites for content changes, records metrics (HTTP status, loading time, and content hash), logs events, and notifies users via email (SendGrid) and SMS (Twilio). Additionally, it persists historical change events in MongoDB and includes unit tests powered by Jest.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Scheduled Monitoring**: Periodically monitors one or more websites.
- **Metrics Logging**: Records HTTP status, loading time, and content hash.
- **Change Detection**: Detects when website content changes.
- **Notifications**: Alerts users via email (SendGrid) and SMS (Twilio).
- **Persistent Logging**: Stores monitoring state and change events in MongoDB.


## Requirements

- Node.js (v14 or later recommended)
- npm
- A MongoDB instance (local or cloud)
- SendGrid API key
- Twilio credentials (Account SID and Auth Token)

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
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `SENDGRID_API_KEY`
   - `SEND_GRID_SENDER`
   - `EMAIL_RECIPIENTS`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM`
   - `TWILIO_TO`

## Usage

1. Build the project:

   ```sh
   npm run build
   ```

2. Run the application:

   ```sh
   npm start
   ```

   The application will connect to MongoDB, start monitoring the configured websites, and send notifications when changes are detected.

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
│   ├── config.ts                 # Application configuration
│   ├── db.ts                     # Database connection and collection definitions
│   ├── index.ts                  # Application entry point
│   ├── monitor.ts                # Website monitoring logic
│   ├── notifications.ts          # Notification logic (SendGrid & Twilio)
│   └── utils.ts                  # Utility functions (e.g., hashing)
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── jest.config.js                # Jest configuration
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json                 # TypeScript configuration
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
