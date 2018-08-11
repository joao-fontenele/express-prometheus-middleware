const UrlValueParser = require('url-value-parser');

const urlParser = new UrlValueParser();

function normalizePath (path, placeholder = '#val') {
  return urlParser.replacePathValues(path, placeholder);
}

function normalizeStatusCode (status) {
  if (status >= 200 && status < 300) {
    return '2XX';
  }

  if (status >= 300 && status < 400) {
    return '3XX';
  }

  if (status >= 400 && status < 500) {
    return '4XX';
  }

  return '5XX';
}

module.exports = {
  normalizePath,
  normalizeStatusCode,
};
