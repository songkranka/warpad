const CryptoJS = require("crypto-js");
const logger = require('../utilities/logger');
const _ = require("lodash");

const fnEncrypt = (data, secretKey) => {
    data = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypt = CryptoJS.AES.encrypt(data, secretKey);
    return encrypt.toString();
}

const fnDecrypt = (data, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const camelizeKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [_.camelCase(key)]: camelizeKeys(obj[key]),
            }),
            {},
        );
    }
    return obj;
};

const res200 = (data) => {
    let mapData = {
        status: 200,
        resultCode: 20000,
        resultMessage: 'Success'.toUpperCase()
    }
    if (data) {
        if (data.hasOwnProperty('data') || data.hasOwnProperty('count')) {
            mapData.count = data.count;
            mapData.resultData = data.data;
        }
        if (data.length > 0) {
            mapData.resultData = data;
        }
        if (!data.hasOwnProperty('data') && typeof data === 'object') {
            mapData.resultData = data;
        }
    }
    return mapData;
}

const res201 = () => {
    let mapData = {
        status: 201,
        resultCode: 20100,
        resultMessage: 'Created'.toUpperCase()
    }
    return mapData;
}

const res400 = () => {
    let mapData = {
        status: 400,
        resultCode: 40000,
        resultMessage: 'Bad Request'.toUpperCase()
    }
    return mapData;
}

const res404 = () => {
    let mapData = {
        status: 200,
        resultCode: 40401,
        resultMessage: 'Data not found.'.toUpperCase()
    }
    return mapData;
}

const res403 = () => {
    let mapData = {
        status: 403,
        resultCode: 40300,
        resultMessage: 'Forbidden'.toUpperCase()
    }
    return mapData;
}

const res500 = () => {
    let mapData = {
        status: 500,
        resultCode: 50000,
        resultMessage: 'System Error.'
    }
    return mapData;
}

const checkResponse = (statusCode, resultCode, msg, data, logMsg, logMethod) => {
    let mapData = {
        status: statusCode,
        resultCode: resultCode,
        resultMessage: msg.toUpperCase()
    }
    if (data) {
        if (data.hasOwnProperty('data') || data.hasOwnProperty('count')) {
            mapData.count = data.count;
            mapData.resultData = data.data;
        }
        if (data.length > 0) {
            mapData.resultData = data;
        }
        if (!data.hasOwnProperty('data') && typeof data === 'object') {
            mapData.resultData = data;
        }
    }
    logger.info("Response => " + JSON.stringify(mapData));
    logger.info(`End | ${logMethod} ${logMsg} process`);
    return mapData;
}

const checkResponseError = (statusCode, resultCode, msg, err, logMsg, logMethod) => {
    let mapData = {
        status: statusCode,
        resultCode: resultCode,
        resultMessage: msg.toUpperCase(),
        resultError: err
    }
    logger.error(`${logMethod} ${logMsg} process error : ${err}`);
    logger.error(`End | ${logMethod} ${logMsg} process`);
    return mapData;
}

const setupHeader = (request, repsonse) => {
    repsonse.setHeader('Content-Type', 'application/json');
    repsonse.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    repsonse.setHeader('Expires', '-1');
    repsonse.setHeader('Pragma', 'no-cache');
    if (request.headers['authorization']) {
        repsonse.setHeader('Authorization', request.headers['authorization']);
    }

    return repsonse;
}

module.exports = {
    fnEncrypt, fnDecrypt, camelizeKeys, checkResponse, checkResponseError, res200, res201, res403, res500,
    res400, res404, setupHeader
}