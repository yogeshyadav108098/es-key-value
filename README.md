# es-key-value
Save key value pairs in elastic search

## Install

```
npm install --save es-key-value
```

## Usage

For now ttl is not supported, but will be added soon

```js

const Q = require('q');
const EsKeyValue = require('es-key-value');
const Elasticsearch = require('elasticsearch');
let elasticClientC = new Elasticsearch.Client({
    host: {
        host: '127.0.0.1',
        port: 9200
    },
    log: 'trace'
});
let elasticClient = new EsKeyValue(elasticClientC);

new Q(undefined)
    .then(function(result) {
        return elasticClient.init();
    })
    .then(function() {
        return elasticClient.set('key1', 1123);
    })
    .then(function() {
        return elasticClient.get('key');
    })
    .then(function() {
        return elasticClient.get('key1');
    })
    .then(function() {
        return elasticClient.get('key3');
    })
    .then(function() {
        return Q.resolve();
    })
    .fail(function(error) {
        console.log(error);
    });
```