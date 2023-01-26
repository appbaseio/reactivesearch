import { hydrate } from 'react-dom';
import React from 'react';

import App from '../common/App';

import './index.css';

// Grab the state from a global variable injected into the server-generated HTML
const store = window.__PRELOADED_STATE__;

hydrate(<App store={store} />, document.getElementById('root'));
