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
    logger: 'customLogger'
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
            time.sleep(1);
            return Q.resolve();
        })
        .then(function() {
            return keyValueClient.get('key123');
        })
        .then(function() {
            return keyValueClient.set('key123', 21);
        })
        .then(function() {
            time.sleep(1);
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