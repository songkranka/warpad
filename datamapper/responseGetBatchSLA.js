const linq = require('linq');
const config = require('../configs/app');
const messageConf = require('../configs/configMap');

function getResponse(statusCode, data) {

    let listMessage = messageConf.getConfig(config.message_config).Messages;
    let message = linq.from(listMessage).where(w => w.StatusCode == statusCode).select(s => s.Message).first();
    let dataArray = [];
    if (data != null) {
        if (data.result.length > 0) {
            let resPPCA = [];
            let resMaxPos = [];
            let resMaxStation = [];
            let resSOM = [];
            let resVRM = [];
            let resLotusNote = [];
            data.result.forEach(field => {

                switch (field.BATCH_GROUP_NAME) {
                    case "PPCA":
                        resPPCA.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    case "MAX_POS":
                        resMaxPos.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    case "MAX_STATION":
                        resMaxStation.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    case "SOM":
                        resSOM.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    case "VRM":
                        resVRM.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    case "LOTUS_NOTE":
                        resLotusNote.push({
                            "batch_name": field.BATCH_NAME,
                            "category": field.CAT_CODE,
                            "sub_category": field.SUB_CAT_CODE,
                            "sla_Time": field.SLA_CODE
                        });
                        break;
                    default:
                        break;
                }
            });
            let res = {
                "maxstation": resMaxStation,
                "saleonmobile": resSOM,
                "lotusnote": resLotusNote,
                "ppca": resPPCA,
                "maxpos": resMaxPos,
                "vrm": resVRM
            }
            dataArray.push(res);
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