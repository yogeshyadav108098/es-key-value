![ES Key Value](assets/esKeyValue.png?raw=true "ES Key Value")

# ES Key Value
> Node library to save key value pairs in ES just like redis.

## Preface
In normal scenario, ES is used for documents saving, but for a different point of view it can also be used as key value pairs as like redis or some other DBs

## Features
1. Converts Document saving to Key-Value Pair
2. Can work as fallback for redis if your redis is not running in cluster mode, even if in cluster mode can work as fallback
3. Behaves same as Redis

## Getting started. ##

## Install
```bash
npm install --save es-key-value
```

## Usage
For now ttl is not supported, but will be added soon

1. Get Key

```javascript

const Q = require('q');
const Sleep = require('sleep');
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
        .then(function(result) {
            return Q.resolve();
        })
        .fail(function(error) {
            logger.error(error);
        });
```

2. Set Key With Value

```javascript

const Q = require('q');
const Sleep = require('sleep');
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
            return keyValueClient.set('key123', 21);
        })
        .then(function(result) {
            return Q.resolve();
        })
        .fail(function(error) {
            logger.error(error);
        });
```

## Note
> ES takes around 1 sec to index after write, so while using this library we should take that in consideration too. Read is pretty fast as ES search, but still it can not match Redis.

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Have a problem? Come chat with us! ##
[LinkedIn](https://www.linkedin.com/in/yogeshyadav108098)<br />
[Twitter](https://twitter.com/Yogeshyadav098)<br />
[Github](https://github.com/yogeshyadav108098)<br />
[Gmail](<mailto:yogeshyadav108098@gmail.com>)

## Maintained by ##
[Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098/)

## Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like
 - **Paytm** You can make one-time donations via Paytm (+91-7411000282). I'll probably buy a coffee.
 - **UPI** You can make one-time donations via UPI (7411000282@paytm).
 - **Bitcoin** You can send me bitcoins at this address (or scanning the code below): `3BKvX4Rck6B69JZMuPFFCPif4dSctSxJQ5`

Thanks!


## Where is this library used?
If you are using this library in one of your projects, add it here.


## License
MIT © [Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098/)

[contributing]: /CONTRIBUTING.md