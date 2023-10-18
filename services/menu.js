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
const { LOGS_POST } = require('../configs/mapping_logs');
const Op = Sequelize.Op;

exports.apiMenuList = async (req) => {
    logger.info(LOGS_POST.apiMenuList.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;
            const result = await models.menu.findAll({
                attributes: ['menuCode', 'menuName', 'menuLink', 'menuIcon', 'status'],
                where: body.hasOwnProperty('keyword') ? {
                    menuName: { [Op.like]: `%${body.keyword}%` }
                } : null,
                order: [
                    ['menuName', 'ASC']
                ],
                offset: body.page,
                limit: body.limit,
            });
            const total = await models.menu.count({
                where: body.hasOwnProperty('keyword') ? {
                    menuName: { [Op.like]: `%${body.keyword}%` }
                } : null,
            });

            if (result.length !== 0) {

                let data = {
                    count: total,
                    data: result
                };
                logger.info(LOGS_POST.apiMenuList.logData.replace(':resultData', JSON.stringify(common.res200(data))));
                logger.info(LOGS_POST.apiMenuList.logEnd);
                return common.res200(data);
            } else {
                logger.info(LOGS_POST.apiMenuList.logData.replace(':resultData', JSON.stringify(common.res404())));
                logger.info(LOGS_POST.apiMenuList.logEnd);
                return common.res404();
            }
        } else {
            logger.info(LOGS_POST.apiMenuList.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.apiMenuList.logEnd);
            return common.res403();
        }
    } catch (err) {
        // ret = { status: false, response: err };
        logger.error(LOGS_POST.apiMenuList.logError.replace(':error', err));
        logger.info(LOGS_POST.apiMenuList.logEnd);
        return common.res500();
    }
}

exports.apiMenuById = async (req) => {
    logger.info(LOGS_POST.apiMenuById.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;
            const result = await models.menu.findOne({
                attributes: ['menuCode', 'menuName', 'menuLink', 'menuIcon', 'gMenuCode', 'status'],
                where: body,
            });

            if (result) {
                logger.info(LOGS_POST.apiMenuById.logData.replace(':resultData', JSON.stringify(common.res200(result))));
                logger.info(LOGS_POST.apiMenuById.logEnd);
                return common.res200(result);
            } else {
                logger.info(LOGS_POST.apiMenuById.logData.replace(':resultData', JSON.stringify(common.res404())));
                logger.info(LOGS_POST.apiMenuById.logEnd);
                return common.res404();
            }
        } else {
            logger.info(LOGS_POST.apiMenuById.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.apiMenuById.logEnd);
            return common.res403();
        }
    } catch (err) {
        logger.error(LOGS_POST.apiMenuById.logError.replace(':error', err));
        logger.info(LOGS_POST.apiMenuById.logEnd);
        return common.res500();
    }
}

exports.getMenu = async (params) => {
    let ret = "";
    try {
        console.log(params.menuCode);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetMenu').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input("MENU_CODE", sql.NVarChar, params.menuCode)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getMenu Error => " + err);
    }
    return ret;
}

exports.actionMenu = async (req) => {
    logger.info(LOGS_POST.actionMenu.logBegin.replace(':action', `${req.body.action === 'add' ? 'Create' : 'Update'}`));
    try {
        logger.info(`Begin | Post ${req.body.action} Menu process`);
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;

            if (body.action === 'add') {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let _menuCode = `${dayjs().format('MMYYYY')}`;
                let charactersLength = characters.length;
                for ( var i = 0; i < 3; i++ ) {
                    _menuCode += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                const result = await models.menu.create({
                    menuCode: _menuCode,
                    menuName: body.menuName,
                    menuLink: body.menuLink,
                    status: body.status,
                    menuIcon: body.menuIcon,
                    gMenuCode: body.groupMenuCode,
                    createdBy: req.currentUser.userId,
                    updatedBy: req.currentUser.userId
                });
                if (result) {
                    logger.info(LOGS_POST.actionMenu.logData.replace(':resultData', JSON.stringify(common.res201())));
                    logger.info(LOGS_POST.actionMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : 'Update'}`));
                    return common.res201();
                }
            }
            if (body.action === 'edit') {
                const result = await models.menu.update({
                    menuName: body.menuName,
                    menuLink: body.menuLink,
                    status: body.status,
                    menuIcon: body.menuIcon,
                    gMenuCode: body.groupMenuCode,
                    updatedBy: req.currentUser.userId
                }, { where: { menuCode: body.menuCode } });

                if (result) {
                    logger.info(LOGS_POST.actionMenu.logData.replace(':resultData', JSON.stringify(common.res200(null))));
                    logger.info(LOGS_POST.actionMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : 'Update'}`));
                    return common.res200(null);
                }
            }

        } else {
            logger.info(LOGS_POST.actionMenu.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.actionMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : 'Update'}`));
            return common.res403();
        }
    } catch (err) {
        logger.error(LOGS_POST.actionMenu.logError.replace(':error', err));
        logger.info(LOGS_POST.actionMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : 'Update'}`));
        return common.res500();
    }
}

exports.updateMenu = async (params) => {
    let ret = "";
    try {
        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateMenu').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("updateMenu Error => " + err);
    }
    return ret;
}

exports.apiGroupMenuById = async (req) => {
    logger.info(LOGS_POST.apiGroupMenuById.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;
            const result = await models.gMenu.findOne({
                where: body,
            });

            if (result) {
                logger.info(LOGS_POST.apiGroupMenuById.logData.replace(':resultData', JSON.stringify(common.res200(result))));
                logger.info(LOGS_POST.apiGroupMenuById.logEnd);
                return common.res200(result);
            } else {
                logger.info(LOGS_POST.apiGroupMenuById.logData.replace(':resultData', JSON.stringify(common.res404())));
                logger.info(LOGS_POST.apiGroupMenuById.logEnd);
                return common.res404();
            }
        } else {
            logger.info(LOGS_POST.apiGroupMenuById.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.apiGroupMenuById.logEnd);
            return common.res403();
        }
    } catch (err) {
        console.log(err);
        logger.error(LOGS_POST.apiGroupMenuById.logError.replace(':error', err));
        logger.info(LOGS_POST.apiGroupMenuById.logEnd);
        return common.res500();
    }
}

exports.apiGroupMenuList = async (req) => {
    logger.info(LOGS_POST.apiGroupMenuList.logBegin);
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const data = req.body;
            const result = await models.gMenu.findAll({
                where: data.hasOwnProperty('keyword') ? {
                    gName: { [Op.like]: `%${data.keyword}%` }
                } : null,
                offset: data.page,
                limit: data.limit,
                order: [
                    ['gName', 'ASC']
                ]
            });
            const total = await models.gMenu.count({
                where: data.hasOwnProperty('keyword') ? {
                    gName: { [Op.like]: `%${data.keyword}%` }
                } : null
            });

            if (result.length !== 0) {
                let data = {
                    count: total,
                    data: result
                };
                logger.info(LOGS_POST.apiGroupMenuList.logData.replace(':resultData', JSON.stringify(common.res200(data))));
                logger.info(LOGS_POST.apiGroupMenuList.logEnd);
                return common.res200(data);
            } else {
                logger.info(LOGS_POST.apiGroupMenuList.logData.replace(':resultData', JSON.stringify(common.res404())));
                logger.info(LOGS_POST.apiGroupMenuList.logEnd);
                return common.res404();
            }
        } else {
            logger.info(LOGS_POST.apiGroupMenuList.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.apiGroupMenuList.logEnd);
            return common.res403();
        }
    } catch (err) {
        console.log(err);
        logger.error(LOGS_POST.apiGroupMenuList.logError.replace(':error', err));
        logger.info(LOGS_POST.apiGroupMenuList.logEnd);
        return common.res500();
    }
}

exports.actionGroupMenu = async (req) => {
    logger.info(LOGS_POST.actionGroupMenu.logBegin.replace(':action', `${req.body.action === 'add' ? 'Create' : req.body.action === 'delete' ? 'Delete' : 'Update'}`));
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {
            const body = req.body;

            if (body.action === 'add') {
                const result = await models.gMenu.create({
                    gName: body.gName,
                    gMenuIcon: body.gMenuIcon
                });
                if (result) {
                    logger.info(LOGS_POST.actionGroupMenu.logData.replace(':resultData', JSON.stringify(common.res201())));
                    logger.info(LOGS_POST.actionGroupMenu.logEnd.replace(':action', 'Create'));
                    return common.res201();
                }
            }
            if (body.action === 'edit') {
                const result = await models.gMenu.update({
                    gName: body.gName,
                    gMenuIcon: body.gMenuIcon
                }, { where: { gMenuCode: body.gMenuCode } });

                if (result) {
                    logger.info(LOGS_POST.actionMenu.logData.replace(':resultData', JSON.stringify(common.res200(null))));
                    logger.info(LOGS_POST.actionMenu.logEnd.replace(':action', 'Update'));
                    return common.res200(null);
                }
            }
            if (body.action === 'delete') {
                await models.gMenu.destroy({
                    where: { gMenuCode: body.gMenuCode }
                });

                logger.info(LOGS_POST.actionMenu.logData.replace(':resultData', JSON.stringify(common.res200(null))));
                logger.info(LOGS_POST.actionGroupMenu.logEnd.replace(':action', 'Delete'));
                return common.res200(null);
            }

        } else {
            logger.info(LOGS_POST.actionGroupMenu.logData.replace(':resultData', JSON.stringify(common.res403())));
            logger.info(LOGS_POST.actionGroupMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : req.body.action === 'delete' ? 'Delete' : 'Update'}`));
            return common.res403();
        }
    }
    catch (err) {
        logger.error(LOGS_POST.actionGroupMenu.logError.replace(':error', err));
        logger.info(LOGS_POST.actionGroupMenu.logEnd.replace(':action', `${req.body.action === 'add' ? 'Create' : req.body.action === 'delete' ? 'Delete' : 'Update'}`));
        return common.res500();
    }
}
