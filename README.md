# Express Prometheus Middleware

[![npm](https://img.shields.io/npm/v/express-prometheus-middleware.svg)](https://www.npmjs.com/package/express-prometheus-middleware)
[![Dependency Status](https://david-dm.org/joao-fontenele/express-prometheus-middleware.svg)](https://david-dm.org/joao-fontenele/express-prometheus-middleware)
[![devDependency Status](https://david-dm.org/joao-fontenele/express-prometheus-middleware/dev-status.svg)](https://david-dm.org/joao-fontenele/express-prometheus-middleware#info=devDependencies)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


This is a middleware for express servers, that expose metrics for prometheus.

The metrics exposed allows to calculate common RED (Request, Error rate, Duration of requests), and USE (Utilisation, Error rate, and Saturation), metrics

## Install

``` bash
yarn add express-prometheus-middleware
# or
npm i --save express-prometheus-middleware
```

## Usage

### Options

| Name | Description | Default |
| :-: | :- | :- |
| metricsPath | Url route that will expose the metrics for scraping. | `/metrics` |
| metricsApp  | Express app that will expose metrics endpoint | `same app as the middleware` |
| collectDefaultMetrics | Whether or not to collect `prom-client` default metrics. These metrics are usefull for collecting saturation metrics, for example. | `true` |
| requestDurationBuckets | Buckets for the request duration metrics (in milliseconds) histogram | Uses `prom-client` utility: `Prometheus.exponentialBuckets(0.05, 1.75, 8)` |
| extraMasks | Optional, list of regexes to be used as argument to [url-value-parser](https://www.npmjs.com/package/url-value-parser), this will cause extra route params,  to be replaced with a `#val` placeholder.  | no extra masks: `[]` |
| authenticate | Optional authentication callback, the function should receive as argument, the `req` object and return truthy for sucessfull authentication, or falsy, otherwise. This option supports Promise results. | `null` |
| prefix | Optional prefix for the metrics name | no prefix added | |

### Example

```js
const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();

const PORT = 9091;
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  /**
   * Uncomenting the `authenticate` callback will make the `metricsPath` route
   * require authentication. This authentication callback can make a simple
   * basic auth test, or even query a remote server to validate access.
   * To access /metrics you could do:
   * curl -X GET user:password@localhost:9091/metrics
   */
  // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
  /**
   * Uncommenting the `extraMasks` config will use the list of regexes to
   * reformat URL path names and replace the values found with a placeholder value
  */
  // extraMasks: [/..:..:..:..:..:../],
  /**
    * Uncommenting the `useOriginalUrl` config will swap using you route label from '/data/1' to '/data/:id'
  /*
  // useOriginalUrl: true,
}));

// curl -X GET localhost:9091/hello?name=Chuck%20Norris
app.get('/hello', (req, res) => {
  console.log('GET /hello');
  const { name = 'Anon' } = req.query;
  res.json({ message: `Hello, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Example api is listening on http://localhost:${PORT}`);
});
```

### Metrics exposed

- Default metrics from [prom-client](https://github.com/siimon/prom-client)
- `http_requests_total`: Counter for total requests received, has labels `route`, `method`, `status`
- `http_request_duration_seconds`: - Duration of HTTP requests in seconds, has labels `route`, `method`, `status`

The labels `route` and `status` are normalized:
- `route`: will normalize id like route params
- `status`: will normalize to status code family groups, like `2XX` or `4XX`.

### Example prometheus queries

In the examples below, Suppose you tagged your application as "myapp".

#### Running instances

```js
sum(up{app="myapp"})
```

#### Overall error rate

Rate of http status code 5XX responses

```js
sum(rate(http_requests_total{status="5XX", app="myapp"}[5m]))
```


#### 95% of requests served within seconds

```js
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{app="myapp"}[5m])) by (le))
```

#### Average response time in seconds

```js
sum(rate(http_request_duration_seconds_sum{app="myapp"}[5m])) by (instance) / sum(rate(http_request_duration_seconds_count{app="myapp"}[5m])) by (instance)
```

#### Overall Request rate

```js
sum(rate(http_requests_total{app="myapp"}[5m])) by (instance)
```

#### Request rate by route

In this example we are removing some health/status-check routes, replace them with your needs.

```js
sum(rate(http_requests_total{app="myapp", route!~"/|/healthz"}[5m])) by (instance, route)
```

#### CPU usage

```js
rate(process_cpu_system_seconds_total{app="myapp"}[5m])
rate(process_cpu_user_seconds_total{app="myapp"}[5m])
```

#### Memory usage
```js
nodejs_heap_size_total_bytes{app="myapp"}
nodejs_heap_size_used_bytes{app="myapp"}
```
