const express = require('express');
const Prometheus = require('prom-client');
const ResponseTime = require('response-time');

const {
  requestCount,
  requestDuration,
} = require('./metrics');

const {
  normalizeStatusCode,
  normalizePath,
} = require('./normalizers');

module.exports = () => {
  const app = express();

  /**
   * Corresponds to the R(equest rate), E(error rate), and D(uration of requests),
   * of the RED metrics.
   */
  const redMiddleware = ResponseTime((req, res, time) => {
    const { path, method } = req;

    if (path !== '/metrics') {
      // will replace ids from the route with `#val` placeholder this serves to
      // measure the same routes, e.g., /image/id1, and /image/id2, will be
      // treated as the same route
      const route = normalizePath(path);
      const status = normalizeStatusCode(res.statusCode);

      requestCount.inc({ route, method, status });

      requestDuration.labels(method, route, status).observe(time);
    }
  });

  // when this file is required, we will start to collect automatically
  Prometheus.collectDefaultMetrics();

  app.use(redMiddleware);

  app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
  });
};
