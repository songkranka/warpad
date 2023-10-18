const linq = require('linq');
const config = require('../configs/app');
const messageConf = require('../configs/configMap');

function getResponse(statusCode) {

    let listMessage = messageConf.getConfig(config.message_config).Messages;
    let message = linq.from(listMessage).where(w => w.StatusCode == statusCode).select(s => s.Message).first();
    let res = {
        "StatusCode": statusCode,
        "Message": message
    };
    return res;
}

module.exports = {
    getResponse
}