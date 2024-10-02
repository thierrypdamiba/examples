# Qdrant Zoom Deploying

This directory contains the deployment configuration and code for the Qdrant Zoom project, which is a part of the larger EmbedEval application.

## 📁 Directory Structure

- `app/`: Contains the Next.js application code
  - `layout.tsx`: Defines the main layout for the application
  - `page.tsx`: The main page component
- `.yarnrc.yml`: Yarn configuration file
- `README.md`: This file, containing deployment instructions

## 🚀 Deployment Instructions

To deploy this part of the project:

1. Ensure all dependencies are installed:
   ```bash
   yarn install
   ```

2. Set up your environment variables:
   - Create a `.env.local` file in this directory
   - Add necessary API keys and configuration values

3. Build the project:
   ```bash
   yarn build
   ```

4. Start the production server:
   ```bash
   yarn start
   ```

## 🔧 Configuration

Make sure to configure the following in your deployment environment:

- Node.js version (as specified in the project root, if applicable)
- Environment variables
- Any necessary build commands or scripts

## 📚 Project Structure

This Next.js application uses the App Router structure:

- `app/`: The main application directory
  - `layout.tsx`: The root layout component that wraps all pages
  - `page.tsx`: The home page component

This structure allows for easy addition of new routes and pages in the future by adding new directories and `page.tsx` files within the `app/` directory.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)

## 🤝 Contributing

For contribution guidelines, please refer to the main project README in the root directory.

## 📄 License

This project is licensed under the terms specified in the main EmbedEval project. See the root directory for license information.
