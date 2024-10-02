# Qdrant Zoom Meeting Search Deployment

You can view the deployed website here: https://qdrant-zoom-aws.vercel.app/

This directory contains the deployment configuration and code for the Qdrant Zoom Meeting Search project. This project demonstrates how to create a website where users can interact with their own data collection through a chat interface. While this example uses Zoom meeting data, the approach can be adapted for other types of data as well.

## 🎯 Project Overview

1. Collect and process data (in this case, from Zoom meetings)
2. Store the processed data in a Qdrant collection
3. Deploy a website that allows users to chat with and search through the stored data

## 📁 Directory Structure

- `app/`: Contains the Next.js application code
  - `layout.tsx`: Defines the main layout for the application
  - `page.tsx`: The main page component for the chat interface
- `.yarnrc.yml`: Yarn configuration file
- `README.md`: This file, containing deployment instructions

## 🚀 Deployment Instructions

To deploy your own data chat website:

1. Ensure you have processed your data and stored it in a Qdrant collection (refer to the data collection and storage instructions in the project root)

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in this directory
   - Add necessary API keys for Qdrant and your data source (e.g., Zoom), along with other configuration values

4. Build the project:
   ```bash
   npm i 
   ```

5. Start the server:
   ```bash
   npm run dev 
   ```

6. Deploy to a hosting platform (e.g., Vercel, Netlify) for public access
   ```bash
   vercel
   ```
## 🔧 Configuration

Ensure your deployment environment is configured with:

- Appropriate Node.js version
- Environment variables for Qdrant and model API access

## 📚 Project Structure

This Next.js application uses the App Router structure:

- `app/`: The main application directory
  - `layout.tsx`: The root layout component that wraps the chat interface
  - `page.tsx`: The home page component containing the chat functionality

This structure allows for easy customization and addition of new features related to your specific data chat application.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Qdrant Documentation](https://qdrant.tech/documentation/)

## 🤝 Contributing

For contribution guidelines, please refer to the main project README in the root directory.

## 📄 License

This project is licensed under the terms specified in the main project. See the root directory for license information.

Remember, while this example uses Zoom meeting data, you can adapt this approach to create a chat interface for any type of data stored in a Qdrant collection. The key steps are: collect and process your data, store it in Qdrant, and then deploy this web application to provide a user-friendly interface for interacting with your data.
