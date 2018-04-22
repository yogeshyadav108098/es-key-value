'use strict';

const Uuid = require('uuid');

class Utils {
    constructor() { }

    genError(message, status, code) {
        let error = new Error(message || 'Unexpected error occurred, Please report');
        error.status = status ? status : 500;
        error.code = code;
        return error;
    }

    generateUuid() {
        return Uuid.v4();
    }
}

let utilsInstance;
module.exports.getInstance = function() {
    if (!utilsInstance) {
        utilsInstance = new Utils();
    }

    return utilsInstance;
};
