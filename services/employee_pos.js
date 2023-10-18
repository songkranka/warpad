const linq = require('linq');
const sql = require('mssql');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const respEmpPos = require('../datamapper/responseGetEmpPos');
const respEmpPosSequelize  = require('../datamapper/responseGetEmpPosSequelize');
const {QueryTypes} = require("sequelize");
const models = require('../models/index');
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash');
const common = require('../utilities/common');

async function getPosList(req) {
    var conn = null;
    var ret = {};
    try {
        // logger.info("Begin | Get Employee Position list process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const resultSql = await models.empPos.findAll({
                attributes: [
                    ['POS_CODE','PositionId'],
                    ['NAME_TH','PositionName'],
                ],
                offset: req.body.page, 
                limit: req.body.limit 
            })

            const resultSqlTotal = await models.empPos.count()
            
            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal,
                    result: resultSql
                }
                ret = await respEmpPosSequelize.getResponse(200, data);
            }else{
                ret = await respEmpPosSequelize.getResponse(210, null);
            }
        } else {
            logger.error("Error Validate Token API Get Employee Position list" + JSON.stringify(ret));
            ret = await respEmpPosSequelize.getResponse(403, null);
        }

        // logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Employee Position list have error : ' + err);
        ret = respEmpPos.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Employee Position list process")
        return ret;
    }
}

async function searchPos(req) {
    var conn = null;
    var ret = {};
    try {
        // logger.info("Begin | Get Employee Position process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = linq.from(listQuery).where(w => w.TopicName == 'SearchPosTotal').select(s => s.Query).first().join(" ");
            let query = linq.from(listQuery).where(w => w.TopicName == 'SearchPos').select(s => s.Query).first().join(" ");

            let replaceMents = {
                POS_SEARCH : `%%`, 
                PAGE_NO : req.body.page, 
                LIMIT : req.body.limit
            }
            let replaceMentsTotal = {
                POS_SEARCH : `%%`, 
            }
            
            if(req.body.hasOwnProperty('posName')){
                replaceMents.POS_SEARCH = `%${req.body.posName}%`
                replaceMentsTotal.POS_SEARCH = `%${req.body.posName}%`
            }

            const resultSql = await models.sequelize.query(query, {
                replacements: replaceMents,
                type: QueryTypes.SELECT,
            });

            const resultSqlTotal = await models.sequelize.query(queryTotal , {
                replacements: replaceMentsTotal,
                type: QueryTypes.SELECT
            });

            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal[0].Total,
                    result: resultSql
                }
                ret = await respEmpPos.getResponse(200, data);
            }else{
                ret = await respEmpPos.getResponse(210, null);
            }
        } else {
            logger.error("Error Validate Token API Search Employee Position" + JSON.stringify(ret));
            ret = await respEmpPos.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Search Employee Position have error : ' + err);
        console.log(err)
        ret = respEmpPos.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Employee Position process")
        return ret;
    }
}

module.exports = {
    getPosList, searchPos
}
