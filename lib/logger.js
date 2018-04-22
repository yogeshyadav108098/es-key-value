'use strict';

const Logger = new (require('uuid-logger'))();

Logger.addTransport({
    console: {
        name: 'Console Logger',
        level: 'debug',
        colorize: true
    }
});

module.exports = Logger.getLogger();
