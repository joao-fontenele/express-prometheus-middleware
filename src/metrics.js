const Prometheus = require('prom-client');


const requestCount = new Prometheus.Counter({
  name: 'http_requests',
  help: 'Counter for total requests received',
  labelNames: ['route', 'method', 'status'],
});

const requestDuration = new Prometheus.Histogram({
  name: 'http_requests_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route', 'method', 'status'],
  // buckets for response time from 0.1ms to 2500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2500],
});

module.exports = {
  requestCount,
  requestDuration,
};
