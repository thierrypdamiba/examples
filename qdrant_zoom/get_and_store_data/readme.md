# Qdrant / Zoom Meeting Search

This project demonstrates how to build a RAG (Retrieval-Augmented Generation) application using Qdrant and the Zoom API.

Built by Ojus Save and Thierry Damiba

Key features:
- Fetch data from Zoom API (user information, meeting recordings, and summaries)
- Store processed data in a Qdrant Cloud collection
- Implement vector search capabilities using Qdrant

In this project, we will build a website where you can chat with your own collection of data and deploy it on a website. We're using the Zoom API as an example to demonstrate how to fetch and process data, but you can adapt this approach for other data sources as well. If you want to learn more about how to get your data into Qdrant, check out this repo with examples for different data sources: https://github.com/qdrant/examples

The URL https://zoom-qdrant.vercel.app/ showcases a sample of the finished product, giving you an idea of what your deployed application could look like. This example uses sample Zoom meeting data, but remember that you can customize the app to work with your own unique dataset, or your own Zoom meeting data.

This guide will walk you through setting up the environment, fetching and storing data, and building a query system with Qdrant.

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

## How This App Works

When you run `node server.js`, the following sequence of events occurs:

1. **Environment Setup**: 
   - The application loads environment variables from the `.env.local` file, which includes necessary API keys and configuration settings.

2. **Data Fetching**:
   - The `fetchAllData()` function from `zoomapi.js` is called.
   - This function retrieves user information, meeting recordings, and meeting summaries from the Zoom API.
   - The data is processed and formatted for storage.

3. **Data Insertion**:
   - After fetching all the data, the application triggers the Qdrant insertion process.
   - It spawns a Python subprocess to run the `vector/insert.py` script.
   - This script takes the processed Zoom data and inserts it into the specified Qdrant collection.

4. **Error Handling**:
   - Throughout the process, any errors are caught and logged to the console.
   - This includes API request errors, data processing issues, or problems with the Qdrant insertion.
5. **Completion**:
   - Once all data has been successfully fetched and stored, the application logs a completion message.
   - If any errors occurred during the process, they will be displayed in the console output.

6. **Queries**:
   - After the data insertion is complete, you can start querying the stored data using Qdrant.
   - Use the provided query interface to search through the sample Zoom meeting data in the Qdrant collection.

This process allows you to easily fetch your latest Zoom meeting data and store it in a vector database for future querying and analysis.

## Why Use JavaScript and Python Together?

In this project, we use both JavaScript (Node.js) and Python in the same folder. This approach, while unconventional, offers some unique advantages:

1. **Leveraging Strengths**: JavaScript (Node.js) excels at handling asynchronous operations and building web servers, making it ideal for interacting with the Zoom API and managing the overall application flow. Python, on the other hand, has robust libraries for data processing and machine learning tasks, which are crucial for working with vector databases like Qdrant.

2. **Ecosystem Compatibility**: Some libraries and SDKs are better supported or more feature-rich in one language over the other. By using both, we can leverage the best tools for each task without compromise.

3. **Flexibility**: This approach allows developers to work in the language they're most comfortable with for specific tasks. It also provides a pathway for gradually migrating between languages if needed in the future.

4. **Learning Opportunity**: For educational purposes, this setup demonstrates how to integrate different programming languages in a single project, which is a valuable skill in diverse tech stacks.

5. **Rapid Prototyping**: Sometimes, it's faster to prototype certain features in one language over another. This setup allows for quick experimentation and development.

While this approach has its benefits, it's important to note that it can increase complexity in terms of project setup and maintenance. In a production environment, you might consider using language-specific APIs or microservices architecture for a more standardized approach. However, for this example project, the combined use of JavaScript and Python allows for a more flexible approach you can modify for your use case. 

For example, you might want to use the Qdrant JavaScript client to interact with Qdrant in the same way you use the Python SDK in this project. You can find the Qdrant JavaScript client [here](https://github.com/qdrant/qdrant-js). Or you might want to use Python for your server with Django-check out this article from Kacper L about Django.


## Configuration

Edit the `.env.local` file to include your credentials

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

