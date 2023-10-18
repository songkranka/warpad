const linq = require('linq');
const sql = require('mssql');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const exDb = require('../utilities/exceptionDb');
const respGetSla = require('../datamapper/responseGetSLA');
const respGetSlaSequelize = require('../datamapper/responseGetSLASequelize');
const respGetBatchSla = require('../datamapper/responseGetBatchSLA');
const respDefault = require('../datamapper/responseDefault');
const masSla = require('../datamapper/mas_sla_config_data');
const _ = require('lodash');
const common = require('../utilities/common');
const { QueryTypes } = require("sequelize");
const models = require('../models/index');
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

async function getSlaList(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const resultSql = await models.slaTime.findAll({
                attributes: [
                    ['SLA_CODE','SlaId'],
                    ['SLA_NAME','SlaName'],
                    ['ADD_TIME','SlaTime'],
                    ['ACTIVE','Status'],
                    [Sequelize.fn('FORMAT', Sequelize.col('CREATED_DATE'), 'yyyy/MM/dd'), 'CreateDate']
                ],
                offset: req.body.page, 
                limit: req.body.limit 
            })

            const resultSqlTotal = await models.slaTime.count()

            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal,
                    result: resultSql
                }
                ret = await respGetSlaSequelize.getResponse(200, data);
            }else{
                ret = await respGetSlaSequelize.getResponse(210, null);
            }
            // logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Slatime list" + JSON.stringify(ret));
            ret = await respGetSlaSequelize.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get SLA list have error : ' + err);
        console.log(err)
        ret = respGetSla.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get SLA list process")
        return ret;
    }
}

async function getSla(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Get SLA By Id process");
            logger.info("Request => " + JSON.stringify(req.body));

            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'GetSLA').select(s => s.Query).first().join(" ");

            conn = await mssqlConnPool.connect();
            let result = await conn.request()
                .input("SLA_CODE", sql.NVarChar, req.body.slaId)
                .query(query);

            if (result != null && (result.rowsAffected[0] > 0)) {
                let data = {
                    result: result.recordset
                }
                ret = respGetSla.getResponse(200, data);
            } else {
                ret = respGetSla.getResponse(210, null);
            }

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Slatime By Id" + JSON.stringify(ret));
            ret = await respGetSlaSequelize.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get SLA By Id have error : ' + err);
        ret = respGetSla.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get SLA By Id process")
        return ret;
    }
}

async function getBatchSla() {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Batch SLA process");

        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetBatchSLA').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        let result = await conn.request().query(query);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                result: result.recordset
            }
            ret = respGetBatchSla.getResponse(200, data);
        } else {
            ret = respGetBatchSla.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Batch SLA process have error : ' + err);
        ret = respGetBatchSla.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Batch SLA process process")
        return ret;
    }
}

async function searchSla(params) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = linq.from(listQuery).where(w => w.TopicName == 'SearchSLATotal').select(s => s.Query).first().join(" ");
            let query = linq.from(listQuery).where(w => w.TopicName == 'SearchSLA').select(s => s.Query).first().join(" ");

            let replaceMents = {
                SLA_SEARCH : `%%`,
                PAGE_NO : params.page, 
                LIMIT : params.limit
            }
            let replaceMentsTotal = {
                SLA_SEARCH : `%%`
            }
            
            if(params.hasOwnProperty('slaName')){
                replaceMents.SLA_SEARCH = `%${params.slaName}%`
                replaceMentsTotal.SLA_SEARCH = `%${params.slaName}%`
            }

            const resultSql = await models.sequelize.query(query, {
                replacements: replaceMents,
                type: QueryTypes.SELECT
            });

            const resultSqlTotal = await models.sequelize.query(queryTotal , {
                replacements: replaceMentsTotal,
                type: QueryTypes.SELECT
            });
            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(params.page),
                    limit: parseInt(params.limit),
                    total: resultSqlTotal[0].Total,
                    result: resultSql
                }
                ret = await respGetSla.getResponse(200, data);
            }else{
                ret = await respGetSla.getResponse(210, null);
            }
            // logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Search Slatime list" + JSON.stringify(ret));
            ret = await respGetSla.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Search Employee Position have error : ' + err);
        ret = respGetSla.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Search Employee Position process")
        return ret;
    }
}

async function addSla(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Add SLA process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'AddSLA').select(s => s.Query).first().join(" ");
            let parameters = masSla.prepareData(req.body, "INSERT");

            // #2 Insert Data
            conn = await mssqlConnPool.connect();
            const transaction = new sql.Transaction(conn);
            let insertData = new Promise(async function (resolve, reject) {
                transaction.begin(async function (err) {
                    if (err) {
                        return reject(err);
                    }

                    const request = new sql.Request(transaction);
                    parameters.forEach(function (p) {
                        request.input(p.name, p.sqltype, p.value);
                    });

                    request.query(query, async function (err) {
                        if (err) {
                            transaction.rollback();
                            logger.info("Transaction Rollback");

                            let exception = exDb.getException(err);
                            return reject(exception);
                        }

                        transaction.commit();
                        logger.info("Transaction Committed");
                        return resolve(200);
                    });
                });
            });

            await insertData.then(function (result) {
                ret = respDefault.getResponse(result, null);
            });

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Add Slatime" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Add SLA have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Add SLA have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add SLA process")
        return ret;
    }
}

async function updateSla(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Update SLA process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateSLA').select(s => s.Query).first().join(" ");
            let parameters = masSla.prepareData(req.body, "UPDATE");

            // #2 Update Data
            conn = await mssqlConnPool.connect();
            const transaction = new sql.Transaction(conn);
            let updateData = new Promise(async function (resolve, reject) {
                transaction.begin(async function (err) {
                    if (err) {
                        return reject(err);
                    }

                    const request = new sql.Request(transaction);
                    parameters.forEach(function (p) {
                        request.input(p.name, p.sqltype, p.value);
                    });

                    request.query(query, async function (err) {
                        if (err) {
                            transaction.rollback();
                            logger.info("Transaction Rollback")

                            let exception = exDb.getException(err);
                            return reject(exception);
                        }

                        transaction.commit();
                        logger.info("Transaction Committed");
                        return resolve(200);
                    });
                });
            });

            await updateData.then(function (result) {
                ret = respDefault.getResponse(result, null);
            });

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token Update Add Slatime" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Update SLA have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update SLA have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update SLA process")
        return ret;
    }
}

async function deleteSla(req) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Update SLA to Delete Status process");
        logger.info("Request => " + JSON.stringify(req));

        // #1 Prepare Data
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateSLAtoDeleteStatus').select(s => s.Query).first().join(" ");
        let parameters = masSla.prepareData(req, "UPDATE");

        // #2 Update Data
        conn = await mssqlConnPool.connect();
        const transaction = new sql.Transaction(conn);
        let updateData = new Promise(async function (resolve, reject) {
            transaction.begin(async function (err) {
                if (err) {
                    return reject(err);
                }

                const request = new sql.Request(transaction);
                parameters.forEach(function (p) {
                    request.input(p.name, p.sqltype, p.value);
                });

                request.query(query, async function (err) {
                    if (err) {
                        transaction.rollback();
                        logger.info("Transaction Rollback")

                        let exception = exDb.getException(err);
                        return reject(exception);
                    }

                    transaction.commit();
                    logger.info("Transaction Committed");
                    return resolve(200);
                });
            });
        });

        await updateData.then(function (result) {
            ret = respDefault.getResponse(result, null);
        });

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Update SLA to Delete Status have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update SLA to Delete Status have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update SLA to Delete Status process")
        return ret;
    }
}

module.exports = {
    getSlaList, getSla, getBatchSla, searchSla, addSla, updateSla, deleteSla
}
