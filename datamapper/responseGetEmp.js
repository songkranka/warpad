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
                let result = {
                    "UserId": field.UserId,
                    "Username": field.Username,
                    "Position": field.Position,
                    "Location": field.Location,
                    "JobTitle": field.JobTitle,
                    "Level": field.Level,
                    "BranchList": data.branches
                }
                dataArray.push(result);
            });
        }
    }

    let res = {};
    if (statusCode == 200) {
        res = {
            "StatusCode": statusCode,
            "Message": message,
            "CurrentPage": data.pageNo,
            "Pages": data.limit,
            "CurrentCount": data.result.length,
            "TotalCount": data.total,
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