const express = require('express');
const Prometheus = require('prom-client');
const ResponseTime = require('response-time');

const {
  requestCount,
  requestDurationGenerator,
} = require('./metrics');

const {
  normalizeStatusCode,
  normalizePath,
} = require('./normalizers');

const defaultOptions = {
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  // buckets for response time from 0.05s to 2.5s
  // these are aribtrary values since i dont know any better ¯\_(ツ)_/¯
  requestDurationBuckets: Prometheus.exponentialBuckets(0.05, 1.75, 8),
};

module.exports = (userOptions = {}) => {
  const app = express();
  app.disable('x-powered-by');
  const options = Object.assign({}, defaultOptions, userOptions);

  const { metricsPath } = options;
  const requestDuration = requestDurationGenerator(options.requestDurationBuckets);

  /**
   * Corresponds to the R(equest rate), E(error rate), and D(uration of requests),
   * of the RED metrics.
   */
  const redMiddleware = ResponseTime((req, res, time) => {
    const { originalUrl, method } = req;
    // will replace ids from the route with `#val` placeholder this serves to
    // measure the same routes, e.g., /image/id1, and /image/id2, will be
    // treated as the same route
    const route = normalizePath(originalUrl);

    if (route !== metricsPath) {
      const status = normalizeStatusCode(res.statusCode);

      requestCount.inc({ route, method, status });

      // observe normalizing to seconds
      requestDuration.labels(route, method, status).observe(time / 1000);
    }
  });

  if (options.collectDefaultMetrics) {
    // when this file is required, we will start to collect automatically
    // default metrics include common cpu and head usage metrics that can be
    // used to calculate saturation of the service
    Prometheus.collectDefaultMetrics();
  }

  app.use(redMiddleware);

  /**
   * Metrics route to be used by prometheus to scrape metrics
   */
  app.get(metricsPath, (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
  });

  return app;
};
