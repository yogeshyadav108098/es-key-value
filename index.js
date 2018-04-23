'use strict';

// 3rd Party
const Q = require('q');
const _ = require('lodash');

// Internal
const EsConfig = require('./config/es');
const LibUtils = require('./lib/utils').getInstance();
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
                        key: key
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
        let uniqueId = LibUtils.generateUuid();
        let body = {
            key: key,
            value: value
        };

        new Q(undefined)
            .then(function() {
                return self.delete(key);
            })
            .then(function() {
                return create({
                    index,
                    type,
                    id: uniqueId,
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

    delete(key) {
        let self = this;
        let deferred = Q.defer();
        if (key === undefined) {
            return Q.reject(
                LibUtils.genError(
                    'Can not delete without key',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    Response.UNABLE_TO_PROCESS.code
                )
            );
        }

        let index = self.index;
        let type = self.type;

        logger.debug('Deleting key:', key);
        self.esClient.deleteByQuery({
            index,
            type,
            body: {
                query: {
                    term: {
                        key: key
                    }
                }
            }
        }, function(error, response) {
            if (error) {
                logger.error(error);
            }
            logger.debug('Setting success for deleting key:', key);
            return deferred.resolve(key);
        });

        return deferred.promise;
    }
}

function create(options) {
    let deferred = Q.defer();

    let createOptions = {
        index: options.index,
        type: options.type,
        id: options.id,
        body: options.body
    };

    logger.debug('Creating with options:', JSON.stringify(createOptions));
    options.esClient.create(createOptions, function(error, response) {
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
            // log: 'trace'
        });
        let elasticClient = new ElasticClient(elasticClientC);

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
                logger.error(error);
            });
    }
})();
