# ES Key Value
> Node library to save key value pairs in ES just like redis.


<table>
    <thead>
        <tr>
            <th>Linux</th>
            <th>OS X</th>
            <th>Windows</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" align="center">Passed</td>
            <td align="center">Passed</td>
        </tr>
    </tbody>
</table>

## Have a problem? Come chat with us! ##

[LinkedIn](https://www.linkedin.com/in/yogeshyadav108098)<br />
[Twitter](https://twitter.com/Yogeshyadav098)<br />
[Github](https://github.com/yogeshyadav108098)<br />
[Gmail](<mailto:yogeshyadav108098@gmail.com>)

## Maintained by ##
[Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098/)

## Getting started. ##
Es-Key-Value will work on all systems.

## Install

```bash
npm install --save es-key-value
```

## Usage

For now ttl is not supported, but will be added soon

```javascript

const Q = require('q');
const Time = require('sleep');
const EsKeyValue = require('es-key-value');
const Elasticsearch = require('elasticsearch');
let client = new Elasticsearch.Client({
    host: {
        host: '127.0.0.1',
        port: 9200
    },
    log: 'trace'
});

// 2nd Param is optional but its better if you provide
let keyValueClient = new EsKeyValue(client, {
    index: 'customindex',
    type: 'customtype',
    logger: console
});

new Q(undefined)
        .then(function(result) {
            return keyValueClient.init();
        })
        .then(function() {
            return keyValueClient.get('key123');
        })
        .then(function() {
            return keyValueClient.set('key123', 1211);
        })
        .then(function() {
            Time.sleep(1);
            return Q.resolve();
        })
        .then(function() {
            return keyValueClient.get('key123');
        })
        .then(function() {
            return keyValueClient.set('key123', 21);
        })
        .then(function() {
            Time.sleep(1);
            return Q.resolve();
        })
        .then(function() {
            return keyValueClient.get('key123');
        })
        .then(function() {
            return Q.resolve();
        })
        .fail(function(error) {
            logger.error(error);
        });
```

## Note
> ES takes around 1 sec to index after write, so while using this library we should take that in consideration too. Read is pretty fast as ES search, but still it can not match Redis.