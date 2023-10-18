const linq = require('linq');
const sql = require('mssql');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const exDb = require('../utilities/exceptionDb');
const respGetSubCat = require('../datamapper/responseGetTaskSubCat');
const respGetSubCatDashboard = require('../datamapper/responseGetTaskSubCatDashboard');
const respDefault = require('../datamapper/responseDefault');
const masTaskSubCat = require('../datamapper/mas_task_subcat_data');
const models = require('../models/index');
const _ = require("lodash");
const Sequelize = require("sequelize");
const common = require("../utilities/common");
const {QueryTypes} = require("sequelize");
const Op = Sequelize.Op;

async function getTaskSubCatList(req) {
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
                queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskSubCatLimit').select(s => s.Query).first().join(" ");
                query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskSubCatListLimit').select(s => s.Query).first().join(" ");
            }else{
                if(req.body.hasOwnProperty('type')){
                    // type = academy
                    queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskSubCatAcademy').select(s => s.Query).first().join(" ");
                    query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskSubCatListAcademy').select(s => s.Query).first().join(" ");
                }else{
                    queryTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalTaskSubCat').select(s => s.Query).first().join(" ");
                    query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskSubCatList').select(s => s.Query).first().join(" ");
                }
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
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal[0].Total,
                    result: resultSql
                }
                ret = await respGetSubCat.getResponse(200, data);
            }else{
                ret = await respGetSubCat.getResponse(210, null);
            }
            // logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Task Sub Cat list" + JSON.stringify(ret));
            ret = await respGetSubCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Task Sub Category  have error : ' + err);
        console.log(err)
        ret = respGetSubCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Get Task Sub Category  process")
        return ret;
    }
}

async function getTaskSubCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Get Task By Sub Category Id process");
            logger.info("Request => " + JSON.stringify(req.body));

            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskSubCat').select(s => s.Query).first().join(" ");

            conn = await mssqlConnPool.connect();
            let result = await conn.request()
                .input("SUB_CAT_CODE", sql.NVarChar, req.body.subCategoryId)
                .input("CAT_CODE", sql.NVarChar, req.body.categoryId)
                .query(query);

            if (result != null && (result.rowsAffected[0] > 0)) {
                let data = {
                    result: result.recordset
                }
                ret = respGetSubCat.getResponse(200, data);
            } else {
                ret = respGetSubCat.getResponse(210, null);
            }

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Get Task Sub Category By Id" + JSON.stringify(ret));
            ret = await respGetSubCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Task By Sub Category Id have error : ' + err);
        ret = respGetSubCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Task By Sub Category Id process")
        return ret;
    }
}

async function getTaskSubCatDashboard() {
    // var conn = null;
    // var ret = {};
    try {
        // const result = await models.sequelize.query('SELECT CAT_CODE, SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY WHERE SUB_CAT_CODE IN (\'TDL1001-01\', \'WST1001-02\', \'WST1001-04\', \'FIN1001-06\') UNION SELECT DISTINCT CAT_CODE, NULL AS SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY WHERE CAT_CODE = \'VRM1001\' UNION SELECT \'FIN1001\' AS CAT_CODE, NULL AS SUB_CAT_CODE, \'Pay In\' AS TYPE_DESC', {type: QueryTypes.SELECT});
        const result = await models.sequelize.query('SELECT CAT_CODE, SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY WHERE SUB_CAT_CODE IN (\'TDL1001-01\', \'WST1001-02\', \'WST1001-04\', \'FIN1001-06\')', {type: QueryTypes.SELECT});
        // const listQuery = queryConf.QueryConfig;
        // let query = linq.from(listQuery).where(w => w.TopicName == 'GetTaskSubCatForDashboard').select(s => s.Query).first().join(" ");
        //
        // conn = await mssqlConnPool.connect();
        // let result = await conn.request()
        //     .query(query);
// SELECT CAT_CODE, SUB_CAT_CODE, TYPE_DESC
// FROM MAS_TASK_SUB_CATEGORY
// WHERE SUB_CAT_CODE IN ('TDL1001-01', 'WST1001-02', 'WST1001-04', 'FIN1001-06')
// UNION SELECT DISTINCT CAT_CODE, NULL AS SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY
// WHERE CAT_CODE = 'VRM1001'
        if (result != null && (result.length > 0)) {
            return common.checkResponse(
                200,
                20000,
                'Success',
                common.camelizeKeys(result),
                'Sub Category for Dashboard',
                'Get'
            );
        } else {
            return common.checkResponse(
                200,
                20000,
                'Data not found',
                [],
                'Sub Category for Dashboard',
                'Get'
            );
        }
    }
    catch (err) {
        // logger.error('Get Task By Sub Category for Dashboard have error : ' + err);
        console.log(err);
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            'Sub Category for Dashboard',
            'Get'
        );

    }
    // finally {
    //     if (conn != null) {
    //         conn.release();
    //     }
    //     logger.info("End | Get Task By Sub Category for Dashboard process")
    //     return ret;
    // }
}

async function searchTaskSubCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = linq.from(listQuery).where(w => w.TopicName == 'SearchTaskSubCatTotal').select(s => s.Query).first().join(" ");
            let query = linq.from(listQuery).where(w => w.TopicName == 'SearchTaskSubCat').select(s => s.Query).first().join(" ");

            let replaceMents = {
                SUB_CAT_SEARCH : `%%`,
                PAGE_NO : req.body.page, 
                LIMIT : req.body.limit
            }
            let replaceMentsTotal = {
                SUB_CAT_SEARCH : `%%`,
            }
            
            if(req.body.hasOwnProperty('subcatName')){
                replaceMents.SUB_CAT_SEARCH = `%${req.body.subcatName}%`
                replaceMentsTotal.SUB_CAT_SEARCH = `%${req.body.subcatName}%`
            }

            const resultSql = await models.sequelize.query(query, {
                replacements: replaceMents,
                type: QueryTypes.SELECT
            });

            const resultSqlTotal = await models.sequelize.query(queryTotal , {
                replacements: replaceMentsTotal,
                type: QueryTypes.SELECT
            });
            console.log(resultSqlTotal)
            if(resultSql.length > 0){
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal[0].Total,
                    result: resultSql
                }
                ret = await respGetSubCat.getResponse(200, data);
            }else{
                ret = await respGetSubCat.getResponse(210, null);
            }

            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Search Task Sub Cat list" + JSON.stringify(ret));
            ret = await respGetSubCat.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Search Task Sub Category have error : ' + err);
        console.log(err)
        ret = respGetSubCat.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        // logger.info("End | Search Task Sub Category process")
        return ret;
    }
}

async function addTaskSubCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Add Task Sub Category process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'AddTaskSubCategory').select(s => s.Query).first().join(" ");
            let parameters = masTaskSubCat.prepareData(req.body, "INSERT");

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
            logger.error("Error Validate Token API Add Task Sub Category" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Add Task Sub Category have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Add Task Sub Category have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add Task Sub Category process")
        return ret;
    }
}

async function updateTaskSubCat(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            logger.info("Begin | Update Task Sub Category process");
            logger.info("Request => " + JSON.stringify(req.body));

            // #1 Prepare Data
            const listQuery = queryConf.QueryConfig;
            let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateTaskSubCategory').select(s => s.Query).first().join(" ");
            let parameters = masTaskSubCat.prepareData(req.body, "UPDATE");

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
            logger.error("Error Validate Token API Update Task Sub Category" + JSON.stringify(ret));
            ret = await respDefault.getResponse(403, null);
        }
    }
    catch (err) {
        if (typeof err.StatusCode == "undefined") {
            logger.error('Update Task Sub Category have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update Task Sub Category have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update Task Sub Category process")
        return ret;
    }
}

async function deleteTaskSubCat(req) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Update Task Sub Category to Delete Status process");
        logger.info("Request => " + JSON.stringify(req));

        // #1 Prepare Data
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateTaskSubCatToDeleteStatus').select(s => s.Query).first().join(" ");
        let parameters = masTaskSubCat.prepareData(req, "UPDATE");

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
            logger.error('Update Task Sub Category to Delete Status have error : ' + err);
            ret = respDefault.getResponse(400);
        }
        else {
            logger.error('Update Task Sub Category to Delete Status have error : ' + err.Message);
            ret = respDefault.getResponse(err.StatusCode);
        }

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Update Task Sub Category to Delete Status process")
        return ret;
    }
}

module.exports = {
    getTaskSubCatList, getTaskSubCat, getTaskSubCatDashboard, searchTaskSubCat, addTaskSubCat, updateTaskSubCat, deleteTaskSubCat
}
