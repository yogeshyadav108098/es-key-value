'use strict';

// 3rd Party
const Q = require('q');
const _ = require('lodash');

// Internal
const EsConfig = require('./config/es');
const LibUtils = require('./lib/utils')();
const ResponseCodes = require('./helpers/responseCode');

let logger;

class ElasticClient {
    constructor(client, options) {
        if (!client) {
            throw LibUtils.genError(
                'Client not provided for connecting es',
                ResponseCodes.PRECONDITION_FAILED.status,
                ResponseCodes.PRECONDITION_FAILED.code
            );
        }

        logger = _.get(options, 'logger') || require('./lib/logger');
        let self = this;
        self.esClient = client;
        logger.debug('Client assigned for key value pairing');

        self.index = _.get(options, 'index') || EsConfig.INDEX;
        self.type = _.get(options, 'type') || EsConfig.TYPE;
        logger.debug('Setting type as', self.index, 'and type as', self.type);
    }

    init() {
        let self = this;
        let deferred = Q.defer();

        // Try to ping client
        self.esClient.ping({
            requestTimeout: 30000
        }, function(error) {
            if (error) {
                logger.error(error);
                return deferred.reject(error);
            }
            logger.warn('ES connection established');
            return deferred.resolve();
        });
        return deferred.promise;
    }

    get(key) {
        let self = this;
        let deferred = Q.defer();
        let searchOptions = {
            index: self.index,
            type: self.type,
            body: {
                query: {
                    term: {
                        _id: key
                    }
                }
            }
        };

        logger.debug(JSON.stringify(searchOptions));
        self.esClient.search(searchOptions).then(function(response) {
            let result = 'undefined';
            let transactions;
            if (response.hits.total > 0 && !_.isEmpty(response.hits.hits)) {
                transactions = _.map(response.hits.hits, function(doc) {
                    return doc._source;
                });
                result = transactions[0].value;
            }
            logger.debug('Retrieved result:', result);
            return deferred.resolve(result);
        }, function(error) {
            logger.error(error);
            return deferred.reject(error);
        });

        return deferred.promise;
    }

    set(key, value) {
        let self = this;
        let deferred = Q.defer();

        let index = self.index;
        let type = self.type;
        let id = key;
        let body = JSON.stringify({
            doc: {
                value: value
            },
            doc_as_upsert: true
        });

        new Q(undefined)
            .then(function() {
                logger.info('Creating or updating key with value', body);
                return update({
                    index,
                    type,
                    id,
                    body,
                    esClient: self.esClient
                });
            })
            .then(function() {
                return deferred.resolve();
            })
            .fail(function(error) {
                logger.error(error);
                return deferred.reject(error);
            });

        return deferred.promise;
    }
};

function update(options) {
    let deferred = Q.defer();

    let updateOptions = {
        index: options.index,
        type: options.type,
        id: options.id,
        body: options.body
    };

    logger.debug('Updating with options:', JSON.stringify(updateOptions));
    options.esClient.update(updateOptions, function(error, response) {
        if (error) {
            logger.error(error);
            return deferred.reject(error);
        }

        logger.debug('Key-Value create success for ID:', response._id);
        return deferred.resolve(response);
    });
    return deferred.promise;
}

module.exports = ElasticClient;


(function(options) {
    if (require.main === module) {
        const Elasticsearch = require('elasticsearch');
        let elasticClientC = new Elasticsearch.Client({
            host: {
                host: '127.0.0.1',
                port: 9200
            }
        });
        // let time = require('sleep');
        let elasticClient = new ElasticClient(elasticClientC);
        new Q(undefined)
            .then(function(result) {
                return elasticClient.init();
            })
            .then(function() {
                return elasticClient.set('key123', 1211);
            })
            .then(function() {
                // time.sleep(1);
                return Q.resolve();
            })
            .then(function() {
                return elasticClient.get('key123');
            })
            .then(function() {
                return elasticClient.set('key123', 21);
            })
            .then(function() {
                // time.sleep(1);
                return Q.resolve();
            })
            .then(function() {
                return elasticClient.get('key123');
            })
            .then(function() {
                return Q.resolve();
            })
            .fail(function(error) {
                logger.error(error);
            });
    }
})();
