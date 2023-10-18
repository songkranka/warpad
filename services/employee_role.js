const linq = require('linq');
const sql = require('mssql');
const logger = require('../utilities/logger');
const config = require('../configs/query.json');
const mssqlConnPool = require('../utilities/database');
const dayjs = require('dayjs');
const common = require("../utilities/common");
const models = require('../models/index');
const _ = require("lodash");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function getRoleList(params) {
    let ret = "";
    try {
        console.log(params.keyword);
        console.log(params.page);
        console.log(params.limit);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetRoleList').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input('PAGE_NO', sql.Int, params.page)
            .input('LIMIT', sql.Int, params.limit)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getRoleList Error => " + err);
    }
    return ret;
}
async function getDropdown() {
    try {
        logger.info("Begin | Get Dropdown Employee Role process");
        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query('SELECT * FROM MAS_EMPLOYEE_ROLE WHERE ACTIVE = 1');

        if (result.recordset.length > 0) {
            return common.checkResponse(
                200,
                20000,
                'Success',
                common.camelizeKeys(result.recordset),
                'Dropdown Employee Role',
                'Get'
            );
        } else {
            return common.checkResponse(
                200,
                20000,
                'Data not found',
                [],
                'Dropdown Employee Role',
                'Get'
            );
        }
    } catch (err) {
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            'Dropdown Employee Role',
            'Get'
        );
    }
}
async function getListRoles(req) {
    try {
        logger.info("Begin | Post Employee Role process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;
            let result = await models.empRole.findAll({
                attributes: ['roleCode', 'roleName', 'status', 'createdDate'],
                where: body.hasOwnProperty('keyword') ? {
                    roleName: { [Op.like]: `%${body.keyword}%` }
                } : null,
                offset: body.page,
                limit: body.limit,
                order: [
                    ['roleName', 'ASC'],
                    ['createdDate', 'DESC']
                ]
            });
            let total = await models.empRole.count({
                where: body.hasOwnProperty('keyword') ? {
                    roleName: { [Op.like]: `%${body.keyword}%` }
                } : null,
            });

            if (result.length !== 0) {
                let data = {
                    count: total,
                    data: result
                };
                return common.checkResponse(
                    200,
                    20000,
                    'Success',
                    data,
                    'Employee Role',
                    'Post'
                );
            } else {
                let data = {
                    count: total,
                    data: []
                };
                return common.checkResponse(
                    200,
                    40400,
                    'Data not found',
                    data,
                    'Employee Role',
                    'Post'
                );
            }
        } else {
            return common.checkResponse(
                200,
                40404,
                'ข้อมูลที่ส่งไม่ถูกต้อง',
                [],
                'Employee Role',
                'Post'
            );
        }
    } catch (err) {
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            'Employee Role',
            'Post'
        );
    }
}
async function getRoleById(req) {
    try {
        logger.info("Begin | Post Employee Role by id process");
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;
            const result = await models.empRole.findOne({
                attributes: ['roleCode', 'roleName', 'status', 'createdDate'],
                where: body.hasOwnProperty('code') ? {
                    roleCode: body.code
                } : null,
            });

            if (result) {
                return common.checkResponse(
                    200,
                    20000,
                    'Success',
                    result,
                    'Employee Role by id',
                    'Post'
                )

            } else {
                return common.checkResponse(
                    200,
                    20000,
                    'Data not found',
                    null,
                    'Employee Role by id',
                    'Post'
                );
            }
        } else {
            return common.checkResponse(
                200,
                40404,
                'ข้อมูลที่ส่งไม่ถูกต้อง',
                null,
                'Employee Role by id',
                'Post'
            );
        }
    } catch (err) {
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            'Employee Role',
            'Post'
        );
    }
}
async function getRole(params) {
    let ret = "";
    try {
        console.log(params.roleId);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetRole').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input("ROLE_CODE", sql.NVarChar, params.roleId)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getRole Error => " + err);
    }
    return ret;
}
async function actionEmpRole(req) {
    try {
        logger.info(`Begin | Post ${req.body.action} Employee Role process`);
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;

            if (req.body.action === 'add') {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let roleCode = dayjs().format('MMYYYY');
                let charactersLength = characters.length;
                for (var i = 0; i < 3; i++) {
                    roleCode += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                const result = await models.empRole.create({
                    roleCode: roleCode,
                    roleName: body.name,
                    status: body.active,
                    createdDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    createdBy: req.currentUser.userId,
                    updatedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updatedBy: req.currentUser.userId
                });
                if (result) {
                    return common.checkResponse(
                        201,
                        20000,
                        'Success',
                        null,
                        req.body.action + ' Employee Role',
                        'Post'
                    );
                }
            } else if (req.body.action === 'edit') {
                const result = await models.empRole.update({
                    roleName: body.name,
                    status: body.active,
                    updatedDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updatedBy: req.currentUser.userId
                }, { where: { roleCode: body.roleCode } });
                
                if (result) {
                    return common.checkResponse(
                        200,
                        20000,
                        'Success',
                        null,
                        req.body.action + ' Employee Role',
                        'Post'
                    );
                }
            }

        } else {
            return common.checkResponse(
                200,
                40404,
                'ข้อมูลที่ส่งไม่ถูกต้อง',
                null,
                req.body.action + ' Employee Role',
                'Post'
            );
        }
    } catch (err) {
        return common.checkResponseError(
            500,
            50000,
            'กรุณาติดต่อทีมพัฒนา Station Warpad',
            err,
            req.body.action + 'Employee Role',
            'Post'
        );
    }
}
async function updateEmpRole(params) {
    let ret = "";
    try {
        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateEmpRole').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("updateEmpRole Error => " + err);
    }
    return ret;
}
module.exports = {
    getRoleList, getRole, getDropdown, getListRoles, getRoleById, actionEmpRole, updateEmpRole
}
