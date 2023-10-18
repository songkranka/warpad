const linq = require('linq');
const sql = require('mssql');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const respBrn = require('../datamapper/responseGetBranch');
const respBrnActive = require('../datamapper/responseGetBranchActive');
const respBrnBu = require('../datamapper/responseGetBranchBu');
const respBrnArea = require('../datamapper/responseGetBranchArea');
const respBrnProvince = require('../datamapper/responseGetBranchProvince');
const respBrnSom = require('../datamapper/responseGetBranchSom');
const resMapManager =  require('../datamapper/responseManagerAll');
const _ = require('lodash');
const common = require('../utilities/common');

const { QueryTypes } = require("sequelize");
const models = require('../models/index');
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

async function getBranchList(req) {
    var conn = null;
    var ret = {};
    try {
        // logger.info("Begin | Get Branch list process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const resultSql = await models.branchActive.findAll({
                attributes: [
                    ['BRN_CODE','BranchId'],
                    ['BRN_NAME','BranchName']
                ],
                where:{
                    brnName:{
                        [Op.ne]:'NEW'
                    }
                },
                offset: req.body.page, 
                limit: req.body.limit 
            })

            const resultSqlTotal = await models.branchActive.count({
                where:{
                    brnName:{
                        [Op.ne]:'NEW'
                    }
                },
            })

            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal,
                    result: resultSql
                }
                ret = await respBrnActive.getResponse(200, data);
            }else{
                ret = await respBrnActive.getResponse(210, null);
            } 
        } else {
            logger.error("Error Validate Token API Get Branch list " + JSON.stringify(ret));
            ret = await respBrnActive.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Branch list have error : ' + err);
        console.log(err);
        ret = response.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Branch list process");
        return ret;
    }
}

async function searchBranch(req) {
    var conn = null;
    var ret = {};
    try {
        // logger.info("Begin | Get Branch process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = await linq.from(listQuery).where(w => w.TopicName == 'SearchBranchTotal').select(s => s.Query).first().join(" ");
            let query = await linq.from(listQuery).where(w => w.TopicName == 'SearchBranch').select(s => s.Query).first().join(" ");

            let replaceMents = {
                BRANNAME_SEARCH : `%%`,
                PAGE_NO : req.body.page, 
                LIMIT : req.body.limit
            }
            let replaceMentsTotal = {
                BRANNAME_SEARCH : `%%`,
            }

            if(req.body.hasOwnProperty('brnName')){
                replaceMents.BRANNAME_SEARCH = `%${req.body.brnName}%`
                replaceMentsTotal.BRANNAME_SEARCH = `%${req.body.brnName}%`
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
                ret = await respBrn.getResponse(200, data);
            }else{
                ret = await respBrn.getResponse(210, null);
            }
        } else {
            logger.error("Error Validate Token API Search Branch " + JSON.stringify(ret));
            ret = await respBrn.getResponse(403, null);
        }
    }
    catch (err) {
        console.log(err);
        logger.error('Search Branch have error : ' + err);
        ret = respBrn.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Branch process");
        return ret;
    }
}

async function getBranchBuList(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch by BU list process");

        const listQuery = queryConf.QueryConfig;
        //let queryGetTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchBU').select(s => s.Query).first().join(" ");
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchBUList').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        // let total = await conn.request()
        //     .query(queryGetTotal);

        let searchKeyword = typeof params.keyWord != "undefined" ? params.keyWord : "";
        let result = await conn.request()
            // .input('PAGE_NO', sql.Int, params.page)
            // .input('LIMIT', sql.Int, params.limit)
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .query(queryGetData);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                // pageNo: parseInt(params.page),
                // limit: parseInt(params.limit),
                // total: total.recordset[0].Total,
                result: result.recordset
            }
            ret = respBrnBu.getResponse(200, data);
        } else {
            ret = respBrnBu.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch by BU list have error : ' + err);
        ret = respBrnBu.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch by BU list process")
        return ret;
    }
}

async function getBranchAreaList(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch by Area list process");

        const listQuery = queryConf.QueryConfig;
        //let queryGetTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchBU').select(s => s.Query).first().join(" ");
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchAreaList').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        // let total = await conn.request()
        //     .query(queryGetTotal);

        let searchKeyword = typeof params.keyWord != "undefined" ? params.keyWord : "";
        let result = await conn.request()
            // .input('PAGE_NO', sql.Int, params.page)
            // .input('LIMIT', sql.Int, params.limit)
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .query(queryGetData);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                // pageNo: parseInt(params.page),
                // limit: parseInt(params.limit),
                // total: total.recordset[0].Total,
                result: result.recordset
            }
            ret = respBrnArea.getResponse(200, data);
        } else {
            ret = respBrnArea.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch by Area list have error : ' + err);
        ret = respBrnArea.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch by Area list process")
        return ret;
    }
}

async function getBranchProvinceList(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch by Province list process");

        const listQuery = queryConf.QueryConfig;
        //let queryGetTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchBU').select(s => s.Query).first().join(" ");
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchProvinceList').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        // let total = await conn.request()
        //     .query(queryGetTotal);

        let searchKeyword = typeof params.keyWord != "undefined" ? params.keyWord : "";
        let result = await conn.request()
            // .input('PAGE_NO', sql.Int, params.page)
            // .input('LIMIT', sql.Int, params.limit)
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .query(queryGetData);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                // pageNo: parseInt(params.page),
                // limit: parseInt(params.limit),
                // total: total.recordset[0].Total,
                result: result.recordset
            }
            ret = respBrnProvince.getResponse(200, data);
        } else {
            ret = respBrnProvince.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch by Province list have error : ' + err);
        ret = respBrnProvince.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch by Province list process")
        return ret;
    }
}

async function getBranchListSom(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch list process");

        const listQuery = queryConf.QueryConfig;
        //let queryGetTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchBU').select(s => s.Query).first().join(" ");
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchSOMList').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        // let total = await conn.request()
        //     .query(queryGetTotal);

        let searchKeyword = typeof params.keyWord != "undefined" ? params.keyWord : "";
        let result = await conn.request()
            // .input('PAGE_NO', sql.Int, params.page)
            // .input('LIMIT', sql.Int, params.limit)
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .query(queryGetData);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                // pageNo: parseInt(params.page),
                // limit: parseInt(params.limit),
                // total: total.recordset[0].Total,
                result: result.recordset
            }
            ret = respBrnSom.getResponse(200, data);
        } else {
            ret = respBrnSom.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch list have error : ' + err);
        ret = respBrnSom.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch list process")
        return ret;
    }
}

async function getBranchAreaManager(req, userId) {
    let conn = null;
    let resp = {};
    let resultTotal = null
    try {
        logger.info("Begin | Get Branch List Manager( process");
        conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        let admin = []
        let data = {};
        let roleSql = await models.sequelize.query(
            "SELECT EMP_ID FROM MAS_MENU_ROLE WHERE (ROLE_CODE = 'T9TMUZ') AND ACTIVE = 1",
            {
              type: QueryTypes.SELECT,
              logging: false,
            }
        );
        if (roleSql.length > 0) {
            for (const iterator of roleSql) {
              admin.push(iterator.EMP_ID);
            }
        }

        let queryTotal = null
        let searchKeyword = typeof req.body.keyword != "undefined" ? req.body.keyword : "";
        
        if(admin.includes(userId)){
            queryTotal = await linq.from(listQuery).where(w => w.TopicName == 'GetManagerAllM1M2Total').select(s => s.Query).first().join(" ");
            query = linq.from(listQuery).where(w => w.TopicName == 'GetManagerAllM1M2').select(s => s.Query).first().join(" ")
        }else{
            queryTotal = await linq.from(listQuery).where(w => w.TopicName == 'GetManagerAllTotal').select(s => s.Query).first().join(" ");
            query = linq.from(listQuery).where(w => w.TopicName == 'GetManagerAll').select(s => s.Query).first().join(" ")
            query = query.replaceAll('@USER_ID',`'${String(userId)}'`)
        }
        
        result = await conn.request()
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .input('PAGE_NO', sql.Int, req.body.page)
            .input('LIMIT', sql.Int, req.body.limit)
            .query(query);

        resultTotal = await conn.request()
            .input('KEYWORD', sql.NVarChar, "%" + searchKeyword + "%")
            .query(queryTotal)

        if (result !== null && (result.rowsAffected[0] > 0)) {
            data.result = result.recordset
            data.count = resultTotal.recordset[0].Total
        }

        Object.keys(data).length !== 0 ?  resp = resMapManager.getResponse(200, data) : resp = resMapManager.getResponse(210, null)
        logger.info("Response => " + JSON.stringify(resp));
    }
    catch (err) {
        console.log(err)
        logger.error('Get Branch List Have Manager error : ' + err);
        resp = resMapManager.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch List Manager process")
        return resp;
    }
}

module.exports = {
    getBranchList, getBranchListSom, getBranchBuList, getBranchAreaList, getBranchProvinceList, searchBranch, getBranchAreaManager
}
