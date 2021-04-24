# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v1.1.0...v1.2.0) (2021-04-24)


### Features

* add metrics for request length and response length ([30ec2ed](https://github.com/joao-fontenele/express-prometheus-middleware/commit/30ec2eddf660858a22a6677571d8f3afd022d241))


### Bug Fixes

* commitlint misreporting release commit ([cbd4101](https://github.com/joao-fontenele/express-prometheus-middleware/commit/cbd410192dd7bf8003a56471ecae145274377267))

## [1.1.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v1.0.0...v1.1.0) (2021-02-19)


### Features

* alter to normalization of status code to an function optional ([09cfa46](https://github.com/joao-fontenele/express-prometheus-middleware/commit/09cfa46b9cfc6c61260f4cb3e7a9b59a81b8e489))
* extend compatibility with prom-client v13.x ([e18732b](https://github.com/joao-fontenele/express-prometheus-middleware/commit/e18732bc11fef7474b7dd0bad50b52982ea11edc))

## [1.0.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.6...v1.0.0) (2020-10-26)


### ⚠ BREAKING CHANGES

* The /metrics route will not be exposed through the middleware if the 'metricsApp' option is provided.

### Features

* allow metrics route to be exposed on separate port ([69af583](https://github.com/joao-fontenele/express-prometheus-middleware/commit/69af583b24d40bbec5bfd1181d806832052669b1))

### [0.9.6](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.5...v0.9.6) (2020-05-18)

### [0.9.5](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.4...v0.9.5) (2020-05-15)


### Features

* add posibility to add custom labels ([7e48758](https://github.com/joao-fontenele/express-prometheus-middleware/commit/7e487584d8ebe073de4f87bb478eba1e8cdd2205))

### [0.9.4](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.3...v0.9.4) (2020-05-13)


### Features

* add optional dependency to collect garbage collector metrics too ([6a1eb87](https://github.com/joao-fontenele/express-prometheus-middleware/commit/6a1eb875c097269661a0d2c36530b6188bb256ae))

### [0.9.3](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.2...v0.9.3) (2020-05-13)

### [0.9.2](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.1...v0.9.2) (2020-05-13)

### [0.9.1](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.9.0...v0.9.1) (2020-05-06)

## [0.9.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.5...v0.9.0) (2020-05-06)


### ⚠ BREAKING CHANGES

* to migrate, install express and prom-client as dependencies in
your own project

### Bug Fixes

* use prom-client and express as peer dependencies ([4825c8c](https://github.com/joao-fontenele/express-prometheus-middleware/commit/4825c8c409f391d0797e5c02ddb03868c108db6e)), closes [#22](https://github.com/joao-fontenele/express-prometheus-middleware/issues/22)

### [0.8.5](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.4...v0.8.5) (2019-11-23)


### Features

* **prefix:** Allow adding metrics prefix name ([ead5c1a](https://github.com/joao-fontenele/express-prometheus-middleware/commit/ead5c1a4ecf1ba2888784050589c4ed359b8f182))

### [0.8.4](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.3...v0.8.4) (2019-11-15)


### Features

* Allow specifying extraMasks for URL normalizer ([428a767](https://github.com/joao-fontenele/express-prometheus-middleware/commit/428a767048c6405347595c48b73e73efcfcad817))

### [0.8.3](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.2...v0.8.3) (2019-11-10)

<a name="0.8.2"></a>
## [0.8.2](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.1...v0.8.2) (2019-11-10)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.8.0...v0.8.1) (2019-11-10)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.7.0...v0.8.0) (2019-11-10)


### Features

* allow metrics to be served under a custom app ([06bbdba](https://github.com/joao-fontenele/express-prometheus-middleware/commit/06bbdba))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.6.3...v0.7.0) (2019-10-23)


### Features

* add an authetication option callback to the metrics route ([4df5fe9](https://github.com/joao-fontenele/express-prometheus-middleware/commit/4df5fe9))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.6.2...v0.6.3) (2019-10-20)



<a name="0.6.2"></a>
## [0.6.2](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.6.1...v0.6.2) (2019-10-07)


### Bug Fixes

* Removes `x-powered-by` header ([f13a3a5](https://github.com/joao-fontenele/express-prometheus-middleware/commit/f13a3a5)), closes [#3](https://github.com/joao-fontenele/express-prometheus-middleware/issues/3)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.6.0...v0.6.1) (2018-08-26)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.5.1...v0.6.0) (2018-08-24)


### Features

* change http duration metric from milliseconds to seconds ([fda644c](https://github.com/joao-fontenele/express-prometheus-middleware/commit/fda644c))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.5.0...v0.5.1) (2018-08-23)


### Bug Fixes

* route was wrong when mounting from another route ([c3bb869](https://github.com/joao-fontenele/express-prometheus-middleware/commit/c3bb869))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.4.0...v0.5.0) (2018-08-23)


### Features

* add keywords for package.json ([f66b7fa](https://github.com/joao-fontenele/express-prometheus-middleware/commit/f66b7fa))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.3.1...v0.4.0) (2018-08-19)


### Features

* allow more options for the user ([226d6b0](https://github.com/joao-fontenele/express-prometheus-middleware/commit/226d6b0))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.3.0...v0.3.1) (2018-08-17)


### Bug Fixes

* return middleware ([50bae3f](https://github.com/joao-fontenele/express-prometheus-middleware/commit/50bae3f))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.2.0...v0.3.0) (2018-08-17)


### Features

* allow user to configure scrape metrics route ([18c9576](https://github.com/joao-fontenele/express-prometheus-middleware/commit/18c9576))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/joao-fontenele/express-prometheus-middleware/compare/v0.1.0...v0.2.0) (2018-08-14)


### Features

* export a middleware factory ([af1acd6](https://github.com/joao-fontenele/express-prometheus-middleware/commit/af1acd6))



<a name="0.1.0"></a>
# 0.1.0 (2018-08-11)


### Features

* initial commit ([7beaad4](https://github.com/joao-fontenele/express-prometheus-middleware/commit/7beaad4))
* initial version of the middleware ([bbf50fb](https://github.com/joao-fontenele/express-prometheus-middleware/commit/bbf50fb))
