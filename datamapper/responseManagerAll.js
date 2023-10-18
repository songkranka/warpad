const linq = require('linq');
const configs = require('../configs/app');
const messageConf = require('../configs/configMap');
const dayjs = require('dayjs');

function getResponse(statusCode, data) {

    let listMessage = messageConf.getConfig(configs.message_config).Messages;
    let message = linq.from(listMessage).where(w => w.StatusCode == statusCode).select(s => s.Message).first();
    let dataArray = [];
    if (data != null) {
        if (data.result.length > 0) {
            data.result.forEach(field => {
                let res = {
                    "ManagerCode": field.COMP_CODE,
                    "ManagerName": field.COMP_NAME,
                    "BuType": field.BU_TYPE,
                }
                dataArray.push(res);
            });
        }
    }

    let res = {};
    if (statusCode == 200) {
        res = {
            "StatusCode": statusCode,
            "Message": message,
            "Data": dataArray,
            "ResultTime": dayjs().format('DD-MM-YYYY HH:mm:ss'),
            "count" : data.count
        };
    } else {
        res = {
            "StatusCode": statusCode,
            "Message": message,
            "ResultTime": dayjs().format('DD-MM-YYYY HH:mm:ss'),
        };
    }
    return res;
}

module.exports = {
    getResponse
}