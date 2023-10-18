const linq = require('linq');
const config = require('../configs/app');
const messageConf = require('../configs/configMap');

function getResponse(statusCode, data) {

    let listMessage = messageConf.getConfig(config.message_config).Messages;
    let message = linq.from(listMessage).where(w => w.StatusCode == statusCode).select(s => s.Message).first();
    let dataArray = [];
    if (data != null) {
        if (data.result.length > 0) {
            let groupData = [];
            let header = null;
            let countHeader = 0;
            let countDetail = 0;

            // Sort Data Header
            let sortResult = linq.from(data.result).toArray();

            for (let field of sortResult) {
                if (field.TypeData == 'H') {
                    countHeader = field.CountData;
                    header = {
                        "CardNo": field.CardNo,
                        "CusName": field.CustName || field.CardNo,
                        "CusTel": field.PhoneNo || field.CardNo,
                        "ShopName": field.TopShopName,
                        "Rank": field.RankCustomer,
                        "TopMonthly": []
                    }
                } else {
                    ++countDetail;
                    let detail = {
                        "Month": field.MonthKey,
                        "TopPointBensin": field.Bensin,
                        "TopPointDiesel": field.Diesel
                    }
                    header.TopMonthly.push(detail);
                }

                if (countHeader == countDetail) {

                    // Sort by month
                    let sortData = linq.from(header.TopMonthly).orderBy(k => k.Month).toArray();
                    header.TopMonthly = sortData;

                    groupData.push(header);
                    countDetail = 0;
                }
            }

            // Sort by Rank
            dataArray = linq.from(groupData).orderBy(k => k.Rank).toArray();
        }
    }

    let res = {};
    if (statusCode == 200) {
        res = {
            "StatusCode": statusCode,
            "Message": message,
            "APIVersion": data.api_version,
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