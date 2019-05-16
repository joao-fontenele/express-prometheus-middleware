const Prometheus = require('prom-client');

/**
 * @param prefix - metrics name prefix
 * request counter
 */
function requestCountGenerator(prefix = '') {
  return new Prometheus.Counter({
    name: `${prefix}http_requests_total`,
    help: 'Counter for total requests received',
    labelNames: ['route', 'method', 'status'],
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request duration
 */
function requestDurationGenerator (buckets, prefix = '') {
  return new Prometheus.Histogram({
    name: `${prefix}http_request_duration_seconds`,
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['route', 'method', 'status'],
    buckets,
  });
}

module.exports = {
  requestCountGenerator,
  requestDurationGenerator,
};
