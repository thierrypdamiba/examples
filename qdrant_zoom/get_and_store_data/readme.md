# QDrant / Zoom Meeting 

This project is a Node.js application designed to fetch and process data from the Zoom API, including user information, meeting recordings, and meeting summaries. It stores the processed data in a Qdrant Cloud collection and implements Qdrant for vector search capabilities.

## Table of Contents

- [Zoom / QDrant Sample App](#zoom--qdrant-sample-app)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Setup](#setup)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Key Features](#key-features)
  - [API Endpoints Used](#api-endpoints-used)
  - [Error Handling](#error-handling)
  - [Contributing](#contributing)

## Project Structure

```
.
├── env.local
├── auth.js
├── config.js
├── server.js
├── utils
│   ├── apiutils.js
│   ├── dateutils.js
│   └── fileutils.js
├── zoomapi.js
└── vector
    ├── insert.py
    └── query.py
```

- `auth.js`: Handles OAuth 2.0 authentication with Zoom API.
- `config.js`: Contains configuration settings for the application.
- `.env.sample`: Contains sample environment variables. Copy this file to `.env.local` and update with your actual values. Ensure `.env.local` is not tracked by git.
- `env.local`: Contains environment variables for local development, including API keys and URLs. Make sure this file is not tracked by git.
- `server.js`: The main entry point of the application.
- `utils/`: Directory containing utility functions.
- `zoomapi.js`: Core logic for fetching and processing Zoom data.
- `vector/`: Directory containing Python scripts for Qdrant operations.

## Setup

1. Clone the repository:
    ```
    git clone https://github.com/ojusave/qdrant_example_zoom.git
    cd qdrant_example_zoom
    ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Install Python dependencies with virtual env:
   ```
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. Set up your `env.local` file with the necessary credentials and settings.
   1. Set up Qdrant Cloud:
      1. Sign up for a Qdrant Cloud account at [https://cloud.qdrant.io/](https://cloud.qdrant.io/).
      2. Create a new cluster in your preferred region.
      3. Once the cluster is created, note down the cluster URL and API key.
      4. Update your `env.local` file with the Qdrant Cloud URL and API key:
         ```
         QDRANT_URL=your_qdrant_cloud_cluster_url
         QDRANT_API_KEY=your_qdrant_cloud_api_key
         ```
   2. Get zoom API credentials from [Zoom Marketplace](https://marketplace.zoom.us/develop/apps) 
      1. Develop -> Build App -> Server to Server OAuth App
      2. Select these scopes
      3. Activate your app
      4. Copy account ID, client ID, and client secret
      5. Paste into `config.js`
6. Run the application `node server.js`
## Configuration

Edit the `.env.local` file to include your Qdrant, Zoom and Anthropic API credentials

## Usage

To run the application:

```
node server.js
```

This will start the process of fetching data from the Zoom API, processing it, saving it to local files, and inserting it into Qdrant. After the data is processed, you can enter queries to search the vector database.

## Key Features

- Fetches user data, meeting recordings, and meeting summaries from Zoom API
- Processes and cleans the fetched data
- Stores processed data in local files
- Inserts data into Qdrant for vector search capabilities
- Provides an interactive query interface for searching the processed data

## API Endpoints Used

- `/users`: To fetch user data
- `/users/{userId}/recordings`: To fetch recording data for each user
- `/meetings/{meetingId}/meeting_summary`: To fetch meeting summaries

## Error Handling

The application includes error handling for API calls, file operations, and data processing. Errors are logged to the console for debugging purposes.

## Contributing

Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a new Pull Request
```

