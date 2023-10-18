const linq = require('linq');
const config = require('../configs/app');
const messageConf = require('../configs/configMap');

function getResponse(statusCode, data) {

    let listMessage = messageConf.getConfig(config.message_config).Messages;
    let message = linq.from(listMessage).where(w => w.StatusCode == statusCode).select(s => s.Message).first();
    let dataArray = [];
    if (data != null) {
        if (data.result.length > 0) {
            data.result.forEach(field => {
                let res = {
                    "CategoryId": field.CAT_CODE,
                    "SubCategoryId": field.SUB_CAT_CODE,
                    "CategoryName": field.TYPE_DESC,
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
            "CurrentCount": data.result.length,
            "Data": dataArray
        };
    } else {
        res = {
            "StatusCode": statusCode,
            "Message": message
        };
    }
    return res;
}

module.exports = {
    getResponse
}