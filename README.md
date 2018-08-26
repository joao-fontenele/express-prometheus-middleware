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
| collectDefaultMetrics | Whether or not to collect `prom-client` default metrics. These metrics are usefull for collecting saturation metrics, for example. | `true` |
| requestDurationBuckets | Buckets for the request duration metrics (in milliseconds) histogram | Uses `prom-client` utility: `Prometheus.exponentialBuckets(0.05, 1.75, 8)` |

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
