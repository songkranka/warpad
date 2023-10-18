const linq = require('linq');
const logger = require('../utilities/logger');
const queryConf = require('../configs/query.json');
const common = require('../utilities/common');
const models = require('../models/index');
const { QueryTypes } = require("sequelize");

async function getMasPerLicense90Day() {
    try {
        const listQuery = queryConf.QueryConfig;
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetMasPerlicense90Day').select(s => s.Query).first().join(" ");

        const resPerlicense = await models.sequelize.query(queryGetData, {
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
        logger.error('Get Master Per-license  have error : ' + err);
        return common.res500();
    }
}

async function getPDPAQuestion() {
    try {
        const maxVersion = await models.pdpaQuestion.max("versionNo");
        const resPdpa = await models.pdpaQuestion.findAll({
            where: { versionNo: maxVersion }
        });
        if (resPdpa.length > 0) {
            let res = [];
            resPdpa.forEach(field => {
                res.push({
                    versionNo: field.versionNo,
                    questionNo: field.questionNo,
                    questionText: field.questionText
                })
            });
            let data = {
                count: resPdpa.length,
                data: res
            };
            return common.res200(data);
        } else {
            return common.res404();
        }
    }
    catch (err) {
        logger.error('Get Master PDPA Question  have error : ' + err);
        return common.res500();
    }
}

module.exports = {
    getMasPerLicense90Day, getPDPAQuestion
}