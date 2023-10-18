const linq = require('linq');
const sql = require('mssql');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const exDb = require('../utilities/exceptionDb');
const respGetCat = require('../datamapper/responseGetTaskCat');
const respGetCatSequelize = require('../datamapper/responseGetTaskCatSequelize');
const respDefault = require('../datamapper/responseDefault');
const masTaskCat = require('../datamapper/mas_task_cat_data');
const {QueryTypes} = require("sequelize");
const models = require('../models/index');
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash');
const common = require('../utilities/common');

async function getTaskCatList(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = null
            let query = null
            let replaceMents = {}
            let replaceMentsTotal = {}
            if(req.body.hasOwnProperty('page') && req.body.hasOwnProperty('limit')){
                replaceMents.PAGE_NO = req.body.page
                replaceMents.LIMIT = req.body.limit
                queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskCatLimit').select(s => s.Query).first().join(" ");
                query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskCatListLimit').select(s => s.Query).first().join(" ");
            }else{
                if(req.body.hasOwnProperty('type')){
                    // type = academy
                    queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskCatAcademy').select(s => s.Query).first().join(" ");
                    query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskCatListAcademy').select(s => s.Query).first().join(" ");
                }else{
                    queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskCat').select(s => s.Query).first().join(" ");
                    query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskCatList').select(s => s.Query).first().join(" ");
                }
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
                ret = await respGetCat.getResponse(200, data);
            }else{
                ret = await respGetCat.getResponse(210, null);
            }
            // logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Task Cat list" + JSON.stringify(ret));
            ret = await respGetCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Task Category have error : ' + err);
        console.log(err)
        ret = respGetCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Task Category process")
        return ret;
    }
}

async function getTaskCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Get Task By Category Id process");
            logger.info("Request => " + JSON.stringify(req.body));
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskCat').select(s => s.Query).first().join(" ");

            conn = await mssqlConnPool.connect();
            let result = await conn.request()
                .input("CAT_CODE", sql.NVarChar, req.body.categoryId)
                .query(query);

            if (result != null && (result.rowsAffected[0] > 0)) {
                let data = {
                    result: result.recordset
                }
                ret = respGetCat.getResponse(200, data);
            } else {
                ret = respGetCat.getResponse(210, null);
            }

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Task Category By Id" + JSON.stringify(ret));
            ret = await respGetCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Task By Category Id have error : ' + err);
        ret = respGetCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Task By Category Id process")
        return ret;
    }
}

async function searchTaskCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = linq.from(listQuery).where(w => w.TopicName == 'SearchTaskCatTotal').select(s => s.Query).first().join(" ");
            let query = linq.from(listQuery).where(w => w.TopicName == 'SearchTaskCat').select(s => s.Query).first().join(" ");

            let replaceMents = {
                CAT_SEARCH : `%%`, 
                PAGE_NO : req.body.page, 
                LIMIT : req.body.limit
            }
            let replaceMentsTotal = {
                CAT_SEARCH : `%%`, 
            }

            if(req.body.hasOwnProperty('catName')){
                replaceMents.CAT_SEARCH = `%${req.body.catName}%`
                replaceMentsTotal.CAT_SEARCH = `%${req.body.catName}%`
            }

            const resultSql = await models.sequelize.query(query, {
                replacements: replaceMents,
                type: QueryTypes.SELECT,
                logging: true
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
                ret = await respGetCat.getResponse(200, data);
            }else{
                ret = await respGetCat.getResponse(210, null);
            }
            // logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Search Task Cat list" + JSON.stringify(ret));
            ret = await respGetCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Search Task Category have error : ' + err);
        console.log(err)
        ret = respGetCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Search Task Category process")
        return ret;
    }
}

async function addTaskCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Add Task Category process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'AddTaskCategory').select(s => s.Query).first().join(" ");
            let parameters = masTaskCat.prepareData(req.body, "INSERT");

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
                ret = respDefault.getResponse(result);
            });

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Add Task Category" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Add Task Category have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Add Task Category have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add Task Category process")
        return ret;
    }
}

async function updateTaskCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Update Task Category process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateTaskCategory').select(s => s.Query).first().join(" ");
            let parameters = masTaskCat.prepareData(req.body, "UPDATE");

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
            logger.error("Error Validate Token API Update Task Category" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Update Task Category have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update Task Category have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update Task Category process")
        return ret;
    }
}

async function deleteTaskCat(req) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Update Task Category to Delete Status process");
        logger.info("Request => " + JSON.stringify(req));

        // #1 Prepare Data
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateTaskCatToDeleteStatus').select(s => s.Query).first().join(" ");
        let parameters = masTaskCat.prepareData(req, "UPDATE");

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
            logger.error('Update Task Category to Delete Status have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update Task Category to Delete Status have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update Task Category to Delete Status process")
        return ret;
    }
}

module.exports = {
    getTaskCatList, getTaskCat, searchTaskCat, addTaskCat, updateTaskCat, deleteTaskCat
}
