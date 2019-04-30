// The admin API client is the easiest way to use the API
const GhostAdminAPI = require('@tryghost/admin-api');

// Configure the client
const api = new GhostAdminAPI({
    url: 'http://localhost:2368/',
    // Admin API key goes here
    key: 'YOUR_ADMIN_API_KEY',
    version: 'v2'
});

// Make an authenticated request
api.posts.add({title: 'Hello world'})
    .then(response => console.log(response))
    .catch(error => console.error(error));
