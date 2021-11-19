// const Prometheus = require('prom-client');
const Prometheus = require('/home/andrei/dev/prom-client');

/**
 * @param prefix - metrics name prefix
 * request counter
 */
function requestCountGenerator(labelNames, prefix = '', enableExemplars = false) {
  return new Prometheus.Counter({
    name: `${prefix}http_requests_total`,
    help: 'Counter for total requests received',
    enableExemplars: enableExemplars,
    labelNames,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request duration
 */
function requestDurationGenerator(labelNames, buckets, prefix = '', enableExemplars = false) {
  return new Prometheus.Histogram({
    name: `${prefix}http_request_duration_seconds`,
    help: 'Duration of HTTP requests in seconds',
    enableExemplars: enableExemplars,
    labelNames,
    buckets,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request length
 */
function requestLengthGenerator(labelNames, buckets, prefix = '', enableExemplars = false) {
  return new Prometheus.Histogram({
    name: `${prefix}http_request_length_bytes`,
    help: 'Content-Length of HTTP request',
    enableExemplars: enableExemplars,
    labelNames,
    buckets,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * response length
 */
function responseLengthGenerator(labelNames, buckets, prefix = '', enableExemplars = false) {
  return new Prometheus.Histogram({
    name: `${prefix}http_response_length_bytes`,
    help: 'Content-Length of HTTP response',
    enableExemplars: enableExemplars,
    labelNames,
    buckets,
  });
}

module.exports = {
  requestCountGenerator,
  requestDurationGenerator,
  requestLengthGenerator,
  responseLengthGenerator,
};
