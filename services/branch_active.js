const linq = require('linq');
const sql = require('mssql');
const config = require('../configs/query.json');
const queryConf = require('../configs/query.json');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const respBrn = require('../datamapper/responseGetBranch');
const respDefault = require('../datamapper/responseDefault');
const common = require("../utilities/common");

const { QueryTypes } = require("sequelize");
const models = require('../models/index');

async function getBranchList(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch list process");
        console.log(params);
        let pageNo = params.page
        let limit = params.limit
        let dataSearch = params.keyword

        // const listQuery = queryConf.QueryConfig;
        // let queryGetTotal = await linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchActive').select(s => s.Query).first().join(" ");
        // let queryGetData = await linq.from(listQuery).where(w => w.TopicName == 'GetBranchActiveList').select(s => s.Query).first().join(" ");
        // conn = await mssqlConnPool.connect();

        // let total = await conn.request()
        //     .input('KEY_SEARCH', sql.NVarChar, "%" + dataSearch + "%")
        //     .query(queryGetTotal);

        // let result = await conn.request()
        //     .input('KEY_SEARCH', sql.NVarChar, "%" + dataSearch + "%")
        //     .input('PAGE_NO', sql.Int, pageNo)
        //     .input('LIMIT', sql.Int, limit)
        //     .query(queryGetData);

        // if (result != null && (result.rowsAffected[0] > 0)) {
        //     let data = {
        //         pageNo: parseInt(params.page),
        //         limit: parseInt(params.limit),
        //         total: total.recordset[0].Total,
        //         result: result.recordset
        //     }
        //     ret = await respBrn.getResponse(200, data);
        // } else {
        //     ret = await respBrn.getResponse(210, null);
        // }


        const listQuery = queryConf.QueryConfig;
        let queryGetTotal = linq.from(listQuery).where(w => w.TopicName == 'GetTotalBranchActive').select(s => s.Query).first().join(" ");
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchActiveList').select(s => s.Query).first().join(" ");

        const resultSql = await models.sequelize.query(queryGetData, {
            replacements: { KEY_SEARCH: "%" + dataSearch + "%", PAGE_NO: pageNo, LIMIT: limit },
            type: QueryTypes.SELECT
        });

        const resultSqlTotal = await models.sequelize.query(queryGetTotal, {
            replacements: { KEY_SEARCH: "%" + dataSearch + "%" },
            type: QueryTypes.SELECT
        });

        if (resultSql.length > 0) {
            let data = {
                pageNo: parseInt(pageNo),
                limit: parseInt(limit),
                total: resultSqlTotal[0].Total,
                result: resultSql
            }
            ret = await respBrn.getResponse(200, data);
        } else {
            ret = await respBrn.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch list have error : ' + err);
        console.error(err);
        ret = response.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch list process")
        return ret;
    }
}

async function getBranchAll() {
    try {
        let resBrnActive = await models.branchActive.findAll();
        if (resBrnActive.length > 0) {
            let response = [];
            resBrnActive.forEach(field => {
                response.push({ brnCode: field.brnCode, brnName: field.brnName })
            });

            let data = {
                count: resBrnActive.length,
                data: response
            };
            return common.res200(data);
        } else {
            return common.res404();
        }
    }
    catch (err) {
        logger.error("Get branch active all have error : " + err);
        return common.res500();
    }
}

async function getBranch(params) {
    let ret = "";
    try {
        console.log(params.btnCode);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetBranchActive').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input("BRN_CODE", sql.NVarChar, params.btnCode)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getBranch Error => " + err);
    }
    return ret;
}

async function addBranch(params) {
    var conn = null;
    var transaction = null;
    var ret = {};
    try {
        logger.info("Begin | Add Branch Active  process");
        logger.info("Request => " + JSON.stringify(params));

        const listQuery = queryConf.QueryConfig;
        conn = await mssqlConnPool.connect();
        transaction = new sql.Transaction(conn);
        let result = await new Promise(function (resolve, reject) {
            transaction.begin(async function (err) {
                if (err) {
                    return reject(err);
                }
                try {
                    const request = new sql.Request(transaction);

                    // #1 Check Branch Exist
                    let checkBrnActive = linq.from(listQuery).where(w => w.TopicName == 'GetBranchExist').select(s => s.Query).first().join(" ");
                    request.input("BRN_CODE", sql.NVarChar, params.BrnCode);
                    let brnCount = await new Promise(function (resolve, reject) {
                        request.query(checkBrnActive, async function (err, res) {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(res.recordset[0].BRANCH_EXIST);
                        });
                    });

                    if (brnCount > 0) {
                        return resolve(220);
                    }

                    // #2 Insert Branch Active
                    let insertBrnActive = linq.from(listQuery).where(w => w.TopicName == 'AddBranchActive').select(s => s.Query).first().join(" ");
                    request.query(insertBrnActive, async function (err) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(200);
                    });
                }
                catch (error) {
                    return reject(error);
                }
            });
        });

        transaction.commit();
        logger.info("Transaction Committed");

        ret = respDefault.getResponse(result, null);
        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Add Branch Active have error : ' + err);
        ret = respDefault.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add Branch Active process")
        return ret;
    }
}

async function updateBranch(params) {
    let ret = "";
    try {
        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateBranchActive').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query(query);

        ret = { status: true, response: JSON.stringify(result) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("updateBranch Error => " + err);
    }
    return ret;
}

module.exports = {
    getBranchList, getBranchAll, getBranch, addBranch, updateBranch
}
