const express = require('express');
const OtelApi = require('@opentelemetry/api');
const Prometheus = require('/home/andrei/dev/prom-client');
const ResponseTime = require('response-time');

const {
  requestCountGenerator,
  requestDurationGenerator,
  requestLengthGenerator,
  responseLengthGenerator,
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
  collectGCMetrics: false,
  enableExemplars: false,
  contentType: Prometheus.Registry.contentType,
  // buckets for response time from 0.05s to 2.5s
  // these are arbitrary values since i dont know any better ¯\_(ツ)_/¯
  requestDurationBuckets: Prometheus.exponentialBuckets(0.05, 1.75, 8),
  requestLengthBuckets: [],
  responseLengthBuckets: [],
  extraMasks: [],
  customLabels: [],
  transformLabels: null,
  normalizeStatus: true,
};

module.exports = (userOptions = {}) => {
  const options = { ...defaultOptions, ...userOptions };
  const originalLabels = ['route', 'method', 'status'];
  options.customLabels = new Set([...originalLabels, ...options.customLabels]);
  options.customLabels = [...options.customLabels];
  const { metricsPath, metricsApp, normalizeStatus } = options;

  const app = express();
  app.disable('x-powered-by');

  Prometheus.register.setContentType(options.contentType);

  const requestDuration = requestDurationGenerator(
    options.customLabels,
    options.requestDurationBuckets,
    options.prefix,
    options.enableExemplars,
  );
  const requestCount = requestCountGenerator(
    options.customLabels,
    options.prefix,
    options.enableExemplars,
  );
  const requestLength = requestLengthGenerator(
    options.customLabels,
    options.requestLengthBuckets,
    options.prefix,
    options.enableExemplars,
  );
  const responseLength = responseLengthGenerator(
    options.customLabels,
    options.responseLengthBuckets,
    options.prefix,
    options.enableExemplars,
  );

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
      let exemplarLabels = null;
      if(options.enableExemplars) {
        exemplarLabels = {};
        let current_span = OtelApi.trace.getSpan(OtelApi.context.active());
        if(current_span) {
          exemplarLabels = {
            'traceId': current_span.spanContext().traceId,
            'spanId': current_span.spanContext().spanId
          };
        }
      }

      const status = normalizeStatus
        ? normalizeStatusCode(res.statusCode) : res.statusCode.toString();

      const labels = { route, method, status };

      if (typeof options.transformLabels === 'function') {
        options.transformLabels(labels, req, res);
      }
      if (exemplarLabels != null) {
        requestCount.inc({ labels: labels, exemplarLabels: exemplarLabels });
      } else {
        requestCount.inc(labels, exemplarLabels);
      }

      // observe normalizing to seconds
      if (exemplarLabels != null) {
        requestDuration.observe({ labels: labels, value: (time/1000), exemplarLabels: exemplarLabels });
      } else {
        requestDuration.observe(labels, time / 1000);
      }

      // observe request length
      if (options.requestLengthBuckets.length) {
        const reqLength = req.get('Content-Length');
        if (reqLength) {
          if (exemplarLabels != null) {
            requestLength.observe({ labels: labels, value: Number(reqLength), exemplarLabels: exemplarLabels });
          } else {
            requestLength.observe(labels, Number(reqLength));
          }
        }
      }

      // observe response length
      if (options.responseLengthBuckets.length) {
        const resLength = res.get('Content-Length');
        if (resLength) {
          if (exemplarLabels != null) {
            responseLength.observe({ labels: labels, value: Number(resLength), exemplarLabels: exemplarLabels });
          } else {
            responseLength.observe(labels, Number(resLength));
          }
        }
      }
    }
  });

  if (options.collectDefaultMetrics) {
    // when this file is required, we will start to collect automatically
    // default metrics include common cpu and head usage metrics that can be
    // used to calculate saturation of the service
    Prometheus.collectDefaultMetrics({
      prefix: options.prefix,
      enableExemplars: options.enableExemplars,
    });
  }

  if (options.collectGCMetrics) {
    // if the option has been turned on, we start collecting garbage
    // collector metrics too. using try/catch because the dependency is
    // optional and it could not be installed
    try {
      /* eslint-disable global-require */
      /* eslint-disable import/no-extraneous-dependencies */
      const gcStats = require('prometheus-gc-stats');
      /* eslint-enable import/no-extraneous-dependencies */
      /* eslint-enable global-require */
      const startGcStats = gcStats(Prometheus.register, {
        prefix: options.prefix,
        enableExemplars: options.enableExemplars
      });
      startGcStats();
    } catch (err) {
      // the dependency has not been installed, skipping
    }
  }

  app.use(redMiddleware);

  /**
   * Metrics route to be used by prometheus to scrape metrics
   */
  const routeApp = metricsApp || app;
  routeApp.get(metricsPath, async (req, res, next) => {
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

    res.set('Content-Type', options.contentType);
    return res.end(await Prometheus.register.metrics());
  });

  return app;
};
