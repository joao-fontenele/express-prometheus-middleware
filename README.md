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
| requestDurationBuckets | Buckets for the request duration metrics (in milliseconds) histogram | `[0.10, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2500]` |

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

#### Example prometheus queries

TODO
