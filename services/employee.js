const linq = require('linq');
const sql = require('mssql');
const logger = require('../utilities/logger');
const queryConf = require('../configs/query.json');
const mssqlConnPool = require('../utilities/database');
const respEmp = require('../datamapper/responseGetEmp');
const respEmpSequelize = require('../datamapper/responseGetEmpSequelize');
const respBrnMgr = require('../datamapper/responseGetBranchMgr');
const respBrnEmp = require('../datamapper/responseGetBranchEmp');
const respDefault = require('../datamapper/responseDefault');
const empTokenData = require('../datamapper/mas_emp_token');
const empDeviceData = require('../datamapper/mas_emp_device');
const common = require('../utilities/common');
const models = require('../models/index');
const _ = require("lodash");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const dayjs = require("dayjs");
const { MAP_QUERY } = require('../configs/query_sequelize');
const { LOGS_POST } = require('../configs/mapping_logs');
const Op = Sequelize.Op;

async function getEmpList(req) {
    var conn = null;
    var ret = {};
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const resultSql = await models.emp.findAll({
                attributes: [
                    ['EMP_ID', 'UserId'],
                    ['EMP_FULLNAME_TH', 'Username'],
                    ['POS_NAME_TH', 'Position'],
                    ['DEPT_NAME_TH', 'Location'],
                ],
                offset: req.body.page,
                limit: req.body.limit
            })

            const resultSqlTotal = await models.emp.count()

            if (resultSql.length > 0) {
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal,
                    result: resultSql
                }
                ret = await respEmpSequelize.getResponse(200, data);
            } else {
                ret = await respEmpSequelize.getResponse(210, null);
            }
        } else {
            logger.error("Error Validate Token API Get Employee list" + JSON.stringify(ret));
            ret = await respEmpSequelize.getResponse(403, null);
        }
    }
    catch (err) {
        logger.error('Get Employee list have error : ' + err);
        console.log(err)
        ret = respEmp.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        return ret;
    }
}

async function employeeById(req) {
    logger.info(LOGS_POST.employeeById.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const mapBody = req.body;
            const sqlEmp = await models.emp.findOne({
                attributes: ['empId', 'empName', 'posName', 'deptName', 'jobTitle'],
                where: {
                    empId: mapBody.empId
                },
                include: [{
                    attributes: ['maxLvl'],
                    model: models.empPos,
                    required: true
                }],
            })
            if (sqlEmp) {
                let resData = {
                    userId: sqlEmp.empId,
                    username: sqlEmp.empName,
                    position: sqlEmp.posName,
                    location: sqlEmp.deptName,
                    jobTitle: sqlEmp.jobTitle,
                    level: sqlEmp.empPo.maxLvl,
                    branchList: []
                }
                const sqlSplitter = await models.empSplitter.findAll({
                    attributes: ['brnCode', 'brnName'],
                    where: {
                        empId: mapBody.empId
                    },
                    order: [
                        ['brnName', 'ASC']
                    ],
                });
                if (sqlSplitter.length > 0) {
                    resData.branchList = sqlSplitter;
                    logger.info(LOGS_POST.employeeById.logData.replace(':resultData', JSON.stringify(common.res200(resData))));
                    logger.info(LOGS_POST.employeeById.logEnd);
                    return common.res200(resData);
                } else {
                    logger.info(LOGS_POST.employeeById.logData.replace(':resultData', JSON.stringify(common.res200(resData))));
                    logger.info(LOGS_POST.employeeById.logEnd);
                    return common.res200(resData);
                }
            } else {
                logger.info(LOGS_POST.employeeById.logData.replace(':resultData', JSON.stringify(common.res404())));
                logger.info(LOGS_POST.employeeById.logEnd);
                return common.res404();
            }
        } else {
            logger.info(LOGS_POST.employeeById.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.employeeById.logEnd);
            return common.res403();
        }
    } catch (e) {
        console.log(e);
        logger.error(LOGS_POST.employeeById.logError.replace(':error', e));
        logger.info(LOGS_POST.employeeById.logEnd);
        return common.res500();
    }
}

async function getEmp(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Employee Profile process");
        const listQuery = queryConf.QueryConfig;
        conn = await mssqlConnPool.connect();

        // Get Branch of Employee
        logger.info("Get Branch of User => " + params.empId);
        let getBranchQuery = linq.from(listQuery).where(w => w.TopicName == 'GetBranchEmployee').select(s => s.Query).first().join(" ");
        let branchData = await conn.request()
            .input('EMP_ID', sql.NVarChar, params.empId)
            .query(getBranchQuery);

        let branchList = [];
        if (branchData != null && (branchData.rowsAffected[0] > 0)) {
            logger.info("Found " + branchData.rowsAffected[0] + " Branch");
            branchData.recordset.forEach(field => {
                let result = {
                    "BranchCode": field.BranchCode,
                    "BranchName": field.BranchName,
                }
                branchList.push(result);
            });
        }

        // Get API Version
        let getVersionQuery = linq.from(listQuery).where(w => w.TopicName == 'GetVersion').select(s => s.Query).first().join(" ");
        let version = await conn.request()
            .query(getVersionQuery);

        // Get Profile Employee
        let getEmpQuery = linq.from(listQuery).where(w => w.TopicName == 'GetEmp').select(s => s.Query).first().join(" ");
        let result = await conn.request()
            .input('EMP_ID', sql.NVarChar, params.empId)
            .query(getEmpQuery);

        if (result != null && (result.rowsAffected[0] > 0)) {
            let data = {
                result: result.recordset,
                api_version: version.recordset[0].VERSION,
                branches: branchList
            }
            ret = respEmp.getResponse(200, data);
        } else {
            ret = respEmp.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Employee Profile have error : ' + err);
        ret = response.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Employee Profile process")
        return ret;
    }
}

async function searchEmp(req) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Search Employee process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let queryTotal = await linq.from(listQuery).where(w => w.TopicName == 'SearchEmployeeTotal').select(s => s.Query).first().join(" ");
            let query = await linq.from(listQuery).where(w => w.TopicName == 'SearchEmployee').select(s => s.Query).first().join(" ");
            let replaceMents = {
                EMP_SEARCH: `%%`,
                PAGE_NO: req.body.page,
                LIMIT: req.body.limit
            }
            let replaceMentsTotal = {
                EMP_SEARCH: `%%`,
            }

            if (req.body.hasOwnProperty('empName')) {
                replaceMents.EMP_SEARCH = `%${req.body.empName}%`
                replaceMentsTotal.EMP_SEARCH = `%${req.body.empName}%`
            }

            const resultSql = await models.sequelize.query(query, {
                replacements: replaceMents,
                type: QueryTypes.SELECT
            });

            const resultSqlTotal = await models.sequelize.query(queryTotal, {
                replacements: replaceMentsTotal,
                type: QueryTypes.SELECT
            });

            if (resultSql.length > 0) {
                let data = {
                    pageNo: parseInt(req.body.page),
                    limit: parseInt(req.body.limit),
                    total: resultSqlTotal[0].Total,
                    result: resultSql
                }
                ret = await respEmp.getResponse(200, data);
            } else {
                ret = await respEmp.getResponse(210, null);
            }
            logger.info("Response => " + JSON.stringify(ret));
        } else {
            logger.error("Error Validate Token API Search Employee" + JSON.stringify(ret));
            ret = await respEmp.getResponse(403, null);
        }
    }
    catch (err) {
        console.log(err)
        logger.error('Search Employee have error : ' + err);
        ret = respEmp.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Search Employee process");
        return ret;
    }
}

async function getBranchManager(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Branch Manager process");
        logger.info("Request => " + JSON.stringify(params));

        const listQuery = queryConf.QueryConfig;
        let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchManager').select(s => s.Query).first().join(" ");
        let keyList = params.KeySearchList.split(",");

        let listData = [];
        conn = await mssqlConnPool.connect();
        for (let index = 0; index < keyList.length; index++) {
            let key = keyList[index];
            let result = await conn.request()
                .input('KEY_SEARCH', sql.NVarChar, key)
                .query(queryGetData);

            if (result != null && (result.rowsAffected[0] > 0)) {
                let records = result.recordset;
                let object = {};
                records.forEach(field => {
                    object = {
                        "EmpId": field.EMP_ID,
                        "EmpName": field.EMP_FULLNAME_TH,
                        "BrnCode": field.DEPT_CODE,
                        "BrnName": field.DEPT_NAME_TH
                    }
                    listData.push(object);
                });
            }
        }

        if (listData.length > 0) {
            ret = respBrnMgr.getResponse(200, listData);
        } else {
            ret = respBrnMgr.getResponse(210, null);
        }

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Branch Manager have error : ' + err);
        ret = respBrnMgr.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Branch Manager process")
        return ret;
    }
}

async function getBranchEmployee(req) {
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            let body = req.body;
            let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetBranchEmployee').select(s => s.Query).first().join(" ");

            let prepareParam = {
                "EMP_ID": body.EmpId,
            }
            const resBranchEmp = await models.sequelize.query(queryGetData, {
                replacements: prepareParam,
                type: QueryTypes.SELECT
            });

            if (resBranchEmp.length > 0) {
                let responseData = respBrnEmp.getResponse(resBranchEmp);
                let data = {
                    count: resBranchEmp.length,
                    data: responseData
                };
                return common.res200(data);
            } else {
                return common.res404();
            }
        }
        else {
            return common.res403();
        }
    }
    catch (err) {
        logger.error('Get Branch Employee have error : ' + err);
        logger.error("Request => " + JSON.stringify(req.body));
        return common.res500();
    }
}

async function addUserToken(params) {
    var conn = null;
    var transaction = null;
    var ret = {};
    try {
        logger.info("Begin | Add User Token process");
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
                    let insertUserToken = linq.from(listQuery).where(w => w.TopicName == 'AddUserToken').select(s => s.Query).first().join(" ");
                    let paramTask = empTokenData.prepareData(params, "INSERT");
                    paramTask.forEach(function (p) {
                        request.input(p.name, p.sqltype, p.value);
                    });

                    request.query(insertUserToken, async function (err) {
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
        logger.error('Add User Token have error : ' + err);
        ret = respDefault.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add User Token process")
        return ret;
    }
}

async function addUserDevice(params) {
    var conn = null;
    var transaction = null;
    var ret = {};
    try {
        logger.info("Begin | Add User Device process");
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
                    let insertUserToken = linq.from(listQuery).where(w => w.TopicName == 'AddUserDevice').select(s => s.Query).first().join(" ");
                    let paramTask = empDeviceData.prepareData(params, "INSERT");
                    paramTask.forEach(function (p) {
                        request.input(p.name, p.sqltype, p.value);
                    });

                    request.query(insertUserToken, async function (err) {
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
        logger.error('Add User Device have error : ' + err);
        ret = respDefault.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Add User Device process")
        return ret;
    }
}

async function addManager(req) {
    const t = await models.sequelize.transaction();
    logger.info(LOGS_POST.addManager.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            // #1 Get Manager Profile
            const payload = req.body;
            console.log(payload);
            const resEmp = await models.sequelize.query(MAP_QUERY.MANAGER_PROFILE, {
                replacements: {
                    empId: payload.empId.toString()
                },
                type: QueryTypes.SELECT,
                transaction: t,
            });
            if (resEmp.length > 0) {
                const employeeData = resEmp[0];
                let mapCreate = {
                    splitter: [],
                    tts: [],
                    destroy: []
                }
                for (const iBrn of payload.brnList) {
                    if (iBrn.action === 'add') {
                        const resSql = await models.sequelize.query(MAP_QUERY.ADD_MANAGER, {
                            replacements: {
                                brnCode: iBrn.brnCode
                            },
                            type: QueryTypes.SELECT,
                            transaction: t,
                        });
                        if (resSql.length > 0) {
                            for (const item of resSql) {
                                mapCreate.splitter.push({
                                    brnCode: item.BRN_CODE,
                                    brnName: item.BRN_NAME,
                                    legCode: item.LEG_CODE,
                                    plantCode: item.PLANT,
                                    empId: employeeData.EMP_ID,
                                    empFullNameTh: employeeData.EMP_FULLNAME_TH,
                                    posCode: employeeData.POS_CODE,
                                    posNameTh: employeeData.POS_NAME_TH,
                                    minLvl: employeeData.MINLVL,
                                    maxLvl: employeeData.MAXLVL,
                                    numLvl: 0,
                                    comCodeLV1: item.COMPANYCODE_LEVEL1,
                                    comNameLV1: item.COMPANYNAME_LEVEL1,
                                    comCodeLV4: item.COMPANYCODE_LEVEL4,
                                    comNameLV4: item.COMPANYNAME_LEVEL4,
                                    locCode: item.LOC_CODE,
                                    locName: item.LOC_NAME,
                                    comCodeLV2: item.COMPANYCODE_LEVEL2,
                                    comNameLV2: item.COMPANYNAME_LEVEL2,
                                    createdDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                    createdBy: req.currentUser.userId,
                                    updatedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                    updatedBy: req.currentUser.userId,
                                });
                            }
                        }
                    }
                    if (iBrn.action === 'delete') {
                        mapCreate.destroy.push(iBrn.brnCode)
                    }
                }
                if (mapCreate.splitter.length > 0) {
                    await models.empSplitter.bulkCreate(mapCreate.splitter, {
                        returning: true,
                        individualHooks: true,
                        transaction: t
                    });
                }
                if (mapCreate.destroy.length > 0) {
                    await models.empSplitter.destroy({
                        where: { empId: payload.empId, brnCode: mapCreate.destroy },
                        transaction: t,
                    })
                }

                await t.commit();

                logger.info(LOGS_POST.addManager.logData.replace(':resultData', JSON.stringify(common.res201())));
                logger.info(LOGS_POST.addManager.logEnd);
                return common.res201();
            }
        } else {
            logger.info(LOGS_POST.addManager.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.addManager.logEnd);
            return common.res403();
        }
    } catch (err) {
        console.log(err);
        // await t.rollback();
        logger.error(LOGS_POST.addManager.logError.replace(':error', err));
        logger.info(LOGS_POST.addManager.logEnd);
        return common.res500();
    }
}

async function updateEmpSplitter(body) {
    try {
        const listQuery = queryConf.QueryConfig;
        const conn = await mssqlConnPool.connect();
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'updateEmpSplitter')
            .select(s => s.Query).first().join(' ');
        let result = await conn.request()
            .input('SOCKET_ID', sql.NChar, body.socketId)
            .input('EMP_ID', sql.NChar, body.userId)
            .query(query, async (err, result) => {
                if (err) {
                    return err;
                }
                return result;
            });
        return result;
    } catch (error) {
        throw error;
    }


}

async function searchEmployee(req) {
    try {
        logger.info("Begin | Post Search Employee process");
        logger.info("Request => " + JSON.stringify(req.body));

        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const result = await models.emp.findAll({
                attributes: ['empId', 'empName', 'posName', 'deptName', 'jobTitle'],
                limit: 50,
                where: req.body.hasOwnProperty('keyword') ? {
                    [Op.or]: {
                        empId: { [Op.like]: `%${req.body.keyword}%` },
                        empName: { [Op.like]: `%${req.body.keyword}%` }
                    }
                } : {},
            });

            if (result.length !== 0) {
                return common.checkResponse(
                    200,
                    20000,
                    'Success',
                    result,
                    'Search Employee',
                    'Post'
                );
            } else {
                return common.checkResponse(
                    200,
                    20000,
                    'Data not found',
                    [],
                    'Search Employee',
                    'Post'
                );
            }
        } else {
            return common.checkResponse(
                200,
                40404,
                'ข้อมูลที่ส่งไม่ถูกต้อง',
                null,
                'Search Employee',
                'Post'
            );
        }
    } catch (err) {
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            'Search Employee',
            'Post'
        );
    }
}

async function getManagerEmail(req) {
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const listQuery = queryConf.QueryConfig;
            // let body = req.body;
            let queryGetData = linq.from(listQuery).where(w => w.TopicName == 'GetManagerEmail').select(s => s.Query).first().join(" ");

            // let prepareParam = {
            //     "EMP_ID": body.EmpId,
            // }
            const resManagerEmail = await models.sequelize.query(queryGetData, {
                // replacements: prepareParam,
                type: QueryTypes.SELECT
            });

            if (resManagerEmail.length > 0) {
                let data = {
                    count: resManagerEmail.length,
                    data: resManagerEmail
                };
                return common.res200(data);
            } else {
                return common.res404();
            }
        }
        else {
            return common.res403();
        }
    }
    catch (err) {
        logger.error('Get Branch Employee have error : ' + err);
        logger.error("Request => " + JSON.stringify(req.body));
        return common.res500();
    }
}

module.exports = {
    getEmpList, getEmp, searchEmp, getBranchManager, getBranchEmployee, addUserToken, updateEmpSplitter, addManager, addUserDevice, searchEmployee, employeeById, getManagerEmail
}