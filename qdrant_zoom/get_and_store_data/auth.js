const axios = require('axios');
const qs = require('querystring');
const config = require('./config');
const querystring = require('querystring');

let cachedToken = null;
let tokenExpiration = null;

async function getToken() {
  const tokenUrl = 'https://zoom.us/oauth/token';
  const payload = querystring.stringify({
    grant_type: 'account_credentials',
    account_id: process.env.ZOOM_ACCOUNT_ID,
  });

  try {
    const response = await axios.post(tokenUrl, payload, {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.response.data);
    throw error;
  }
}

module.exports = { getToken };