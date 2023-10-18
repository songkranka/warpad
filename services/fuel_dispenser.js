const linq = require('linq');
const logger = require('../utilities/logger');
const queryConf = require('../configs/query.json');
const common = require('../utilities/common');
const models = require('../models/index');
const { QueryTypes } = require("sequelize");

async function getMasFuelDispenser(req) {
    try {
        const listQuery = queryConf.QueryConfig;
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetMasFuelDispenser').select(s => s.Query).first().join(" ");

        const prepareParam = {
            DAY_DIFF: req.body.dayAdvance
        }

        const resPerlicense = await models.sequelize.query(queryGetData, {
            replacements: prepareParam,
            type: QueryTypes.SELECT
        });

        if (resPerlicense.length > 0) {
            let data = {
                count: resPerlicense.length,
                data: resPerlicense
            };
            return common.res200(data);
        } else {
            return common.res404();
        }
    }
    catch (err) {
        logger.error('Get Master fuel dispenser  have error : ' + err);
        return common.res500();
    }
}

module.exports = {
    getMasFuelDispenser
}