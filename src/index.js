const express = require('express');
const Prometheus = require('prom-client');
const ResponseTime = require('response-time');

const {
  requestCountGenerator,
  requestDurationGenerator,
} = require('./metrics');

const {
  normalizeStatusCode,
  normalizePath,
} = require('./normalizers');

const defaultOptions = {
  metricsPath: '/metrics',
  metricsApp: null,
  authenticate: null,
  collectDefaultMetrics: true,
  // buckets for response time from 0.05s to 2.5s
  // these are aribtrary values since i dont know any better ¯\_(ツ)_/¯
  requestDurationBuckets: Prometheus.exponentialBuckets(0.05, 1.75, 8),
  extraMasks: [],
  normalizeStatus,
};

module.exports = (userOptions = {}) => {
  const options = { ...defaultOptions, ...userOptions };

  const { metricsPath, metricsApp, normalizeStatus } = options;

  // if no app is provided, instantiate one
  const app = metricsApp || express();
  app.disable('x-powered-by');

  const requestDuration = requestDurationGenerator(options.requestDurationBuckets, options.prefix);
  const requestCount = requestCountGenerator(options.prefix);

  /**
   * Corresponds to the R(equest rate), E(error rate), and D(uration of requests),
   * of the RED metrics.
   */
  const redMiddleware = ResponseTime((req, res, time) => {
    const { originalUrl, method } = req;
    // will replace ids from the route with `#val` placeholder this serves to
    // measure the same routes, e.g., /image/id1, and /image/id2, will be
    // treated as the same route
    const route = normalizePath(originalUrl, options.extraMasks);

    if (route !== metricsPath) {
      const status = normalizeStatus ? normalizeStatusCode(res.statusCode) : res.statusCode;

      requestCount.inc({ route, method, status });

      // observe normalizing to seconds
      requestDuration.labels(route, method, status).observe(time / 1000);
    }
  });

  if (options.collectDefaultMetrics) {
    // when this file is required, we will start to collect automatically
    // default metrics include common cpu and head usage metrics that can be
    // used to calculate saturation of the service
    Prometheus.collectDefaultMetrics({
      prefix: options.prefix,
    });
  }

  app.use(redMiddleware);

  /**
   * Metrics route to be used by prometheus to scrape metrics
   */
  app.get(metricsPath, async (req, res, next) => {
    if (typeof options.authenticate === 'function') {
      let result = null;
      try {
        result = await options.authenticate(req);
      } catch (err) {
        // treat errors as failures to authenticate
      }

      // the requester failed to authenticate, then return next, so we don't
      // hint at the existance of this route
      if (!result) {
        return next();
      }
    }
    res.set('Content-Type', Prometheus.register.contentType);
    return res.end(Prometheus.register.metrics());
  });

  return app;
};
