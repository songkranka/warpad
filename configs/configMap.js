const fs = require('fs');
const path = require('path');
const configs = require('../configs/app');
var apiMapConfObj = {};
var webUrlConfObj = {};
var messageConfObj = {};
var queryConfObj = {};

async function loadConfig(configName) {
    try {
        switch (configName) {
            case configs.api_mapper_Config:
                apiMapConfObj = await readFileConfig(configs.path_api_configmap, configs.api_mapper_Config);
                break;
            case configs.web_url_config:
                webUrlConfObj = await readFileConfig(configs.path_url_configmap, configs.web_url_config);
                break;
            case configs.message_config:
                messageConfObj = await readFileConfig(configs.path_message_configmap, configs.message_config);
                break;
            case configs.query_config:
                queryConfObj = await readFileConfig(configs.path_query_configmap, configs.query_config);
                break;
            default:
                throw "Not Found Configure";
        }
    }
    catch (err) {
        throw err;
    }
}

function getConfig(configName) {
    switch (configName) {
        case configs.api_mapper_Config:
            return apiMapConfObj;
        case configs.web_url_config:
            return webUrlConfObj;
        case configs.message_config:
            return messageConfObj;
        case configs.query_config:
            return queryConfObj;
        default:
            return ("Not Found Configure")
    }
}

function readFileConfig(pathConfig, configName) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(pathConfig, configName), 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(JSON.parse(data));
        });
    });
}

module.exports = {
    loadConfig, getConfig
}