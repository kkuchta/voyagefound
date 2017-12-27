import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Redirect www to non-www.  This should be done in infrastructure, but I got
// tired of trying to get route 53, s3 website redirects, and cloudfront to work
// together correctly.
if (window.location.hostname.match(/^www/)) {
  window.location.href = window.location.href.replace('www.', '');
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
