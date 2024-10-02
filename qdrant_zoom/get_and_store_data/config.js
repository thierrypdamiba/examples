require('dotenv').config();

const config = {
  accountId: process.env.ZOOM_ACCOUNT_ID || 'HPAxVVZtQiuaOo4gyi2sag',
  clientId: process.env.ZOOM_CLIENT_ID || 'foKtlPVXQkm29O4738MrzA',
  clientSecret: process.env.ZOOM_CLIENT_SECRET,
  zoomApiBaseUrl: process.env.ZOOM_API_BASE_URL || 'https://api-endpoint-0f24e0ac73d6.herokuapp.com',
  anthropic_api_key: process.env.ANTHROPIC_API_KEY,
  qdrant_url: process.env.QDRANT_URL,
  qdrant_api_key: process.env.QDRANT_API_KEY
};

module.exports = config;