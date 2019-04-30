/**
 * Demo Generator
 *
 * This file generates all examples in this folder. Rerun to re-generate with latest output from demo.ghost.io
 * Requires dev dependencies. Is currently independent of gatsby build.
 *
 * Usage:
 *  node generator.js
 *
 */

const fs = require('fs').promises;
const path = require('path');

const GhostContentAPI = require('@tryghost/content-api');
const api = new GhostContentAPI({
    url: 'https://demo.ghost.io',
    key: '22444f78447824223cefc48062',
    version: 'v2'
  });


const requests = [];

function writeFile(name, content) {
    return fs.writeFile(path.join(__dirname, name), JSON.stringify(content, null, 2));
}

// At the moment our API clients reduce the response, need to re-wrap them
function writeFileFromResponse(res, type, shortName) {
    let wrapped = { [type]: [res] };

    if (type === 'settings') {
        // Deprecated!
        delete res.ghost_head;
        delete res.ghost_foot;
        wrapped = { [type]: res };
    }

    return writeFile(`${shortName || type}.json`, wrapped);
}

function handleError(typeString, err) {
    if (err.response && err.response.status === 404) {
        console.error(`Unable to fetch ${typeString} - Resource Not Found (404)`);
    } else {
        console.error(`Unable to fetch ${typeString} - Unknown error`, err);
    }
}

// Generate post example
requests.push(api.posts
    .read({ slug: 'welcome-short' })
    .then(res => {
        return writeFileFromResponse(res, 'posts')
    })
    .catch(err => handleError('Post "welcome-short"', err))
);

// Generate post example with tags and authors
requests.push(api.posts
    .read({ slug: 'welcome-short', include: 'tags,authors' })
    .then(res => writeFileFromResponse(res, 'posts', 'posts-with-tags-authors'))
    .catch(err => handleError('Post "welcome-short"', err))
);

// Generate page example
requests.push(api.pages
    .read({ slug: 'about' })
    .then(res => writeFileFromResponse(res, 'pages'))
    .catch(err => handleError('Page "about"', err))
);

// Generate page example with tags anda uthors
requests.push(api.pages
    .read({ slug: 'about', include: 'tags,authors'})
    .then(res => writeFileFromResponse(res, 'pages', 'pages-with-tags-authors'))
    .catch(err => handleError('Page "about"', err))
);


// Generate tag example
requests.push(api.tags
    .read({ slug: 'getting-started' })
    .then(res => writeFileFromResponse(res, 'tags'))
    .catch(err => handleError('Tag "getting-started"', err))
);

// Generate tag with count example
requests.push(api.tags
    .read({ slug: 'getting-started', include: 'count.posts' })
    .then(res => writeFileFromResponse(res, 'tags', 'tags-with-count'))
    .catch(err => handleError('Tag "getting-started"', err))
);

// Generate author example
requests.push(api.authors
    .read({ slug: 'cameron'})
    .then(res => writeFileFromResponse(res, 'authors'))
    .catch(err => handleError('User "cameron"', err))
);

// Generate author with count example
requests.push(api.authors
    .read({ slug: 'cameron', include: 'count.posts'  })
    .then(res => writeFileFromResponse(res, 'authors', 'authors-with-count'))
    .catch(err => handleError('User "cameron"', err))
);

// Generate settings example
requests.push(api.settings
    .browse()
    .then(res => writeFileFromResponse(res, 'settings'))
    .catch(err => handleError('Settings', err))
);

return Promise.all(requests);
