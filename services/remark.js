const logger = require('../utilities/logger');
const models = require('../models/index');
const common = require("../utilities/common");

async function getRemarkList() {
    try {
        let resRemark = await models.remark.findAll();
        if (resRemark.length > 0) {
            let listData = [];
            resRemark.forEach(field => {
                listData.push({ remarkCode: field.remarkCode, remarkDesc: field.remarkDesc })
            });

            let data = {
                count: resRemark.length,
                data: listData
            };
            return common.res200(data);

        } else {
            return common.res404();
        }
    }
    catch (err) {
        logger.error("Get Remark list have error : " + err);
        return common.res500();
    }
}

module.exports = {
    getRemarkList
}
