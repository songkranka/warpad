const logger = require('../utilities/logger');
const models = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _ = require('lodash');
const dayjs = require('dayjs');
const common = require('../utilities/common');
const {QueryTypes} = require("sequelize");
const {LOGS_GET, LOGS_POST} = require("../configs/mapping_logs");

const getPermission = async (req) => {
  logger.info(LOGS_GET.getPermission.logBegin);
  try {
    const result = await models.sequelize.query('WITH MENU_ROLE AS (SELECT MPM.MENU_CODE, MPM.MENU_ACTION FROM MAS_MENU_ROLE AS MMR INNER JOIN MAS_PERMISSION_MENU MPM on MMR.ID = MPM.MENU_ROLE_ID WHERE EMP_ID = :userId), ME AS (SELECT MGM.GROUP_MENU_CODE, MGM.GROUP_NAME, MGM.GROUP_MENU_ICON, MM.MENU_CODE, MM.MENU_NAME, MM.MENU_LINK, MM.MENU_ICON FROM MAS_GROUP_MENU MGM RIGHT JOIN MAS_MENU MM on MGM.GROUP_MENU_CODE = MM.GROUP_MENU_CODE) SELECT ME.GROUP_MENU_CODE AS gMenuCode, ME.GROUP_NAME AS gName, ME.GROUP_MENU_ICON AS gMenuIcon, ME.MENU_CODE AS menuCode, ME.MENU_NAME AS menuName, ME.MENU_ICON AS menuIcon, ME.MENU_LINK AS menuLink, MENU_ROLE.MENU_ACTION AS permission FROM MENU_ROLE INNER JOIN ME ON ME.MENU_CODE = MENU_ROLE.MENU_CODE ORDER BY ME.MENU_NAME, ME.GROUP_NAME ASC', {
      raw: false,
      replacements: { userId: req.currentUser.userId },
      type: QueryTypes.SELECT
    });
    if (result.length > 0) {
      const arrMap = [];
      let cloneNoGMenuCode = _.cloneDeep(result);
      let cloneGMenuCode = _.cloneDeep(result);
      for (const item of result) {
        if (!item.gMenuCode) {
          cloneNoGMenuCode.filter(e => {
            if (!e.gMenuCode) {
              delete e.gMenuCode;
              delete e.gName;
              delete e.gMenuIcon;
              arrMap.push(e);
            }
          })
        }
        if (item.gMenuCode) {
          let dsArr = cloneGMenuCode.filter(e => e.gMenuCode === item.gMenuCode);
          const ds = arrMap.filter(e => e.gMenuCode === item.gMenuCode);
          if (ds.length === 0) {
            dsArr = dsArr.map(e => {
              delete e.gMenuCode;
              delete e.gName;
              delete e.gMenuIcon;
              return e;
            });
            arrMap.push({
              gMenuCode: item.gMenuCode,
              gName: item.gName,
              gMenuIcon: item.gMenuIcon,
              menus: dsArr
            })
          }
        }
      }
      const myOrderedArray = _.orderBy(arrMap, ['menuName', 'gName'], ['asc', 'asc']);
      logger.info(LOGS_GET.getPermission.logData.replace(':resultData', JSON.stringify(common.res200(myOrderedArray))));
      logger.info(LOGS_GET.getPermission.logEnd);
      return common.res200(myOrderedArray);
    } else {
      logger.info(LOGS_GET.getPermission.logData.replace(':resultData', JSON.stringify(common.res404())));
      logger.info(LOGS_GET.getPermission.logEnd);
      return common.res404();
    }
  } catch (error) {
    logger.error(LOGS_GET.getPermission.logError.replace(':error', error));
    logger.info(LOGS_GET.getPermission.logEnd);
    return common.res500();
  }
}

const permissionMenuByUID = async (req) => {
  logger.info(LOGS_POST.permissionMenuByUID.logBegin);
  try {
    const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
    const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
    if (_.isEqual(req.body, checkData)) {
      const data = req.body;
      console.log(data);
      const result = await models.sequelize.query(`WITH MENU_ROLE AS (SELECT MPM.MENU_CODE, MPM.MENU_ACTION, ROLE_CODE FROM MAS_MENU_ROLE AS MMR INNER JOIN MAS_PERMISSION_MENU MPM on MMR.ID = MPM.MENU_ROLE_ID WHERE EMP_ID = :empId), ME AS (SELECT MGM.GROUP_MENU_CODE, MGM.GROUP_NAME, MGM.GROUP_MENU_ICON, MM.MENU_CODE, MM.MENU_NAME, MM.MENU_LINK, MM.MENU_ICON FROM MAS_GROUP_MENU MGM RIGHT JOIN MAS_MENU MM on MGM.GROUP_MENU_CODE = MM.GROUP_MENU_CODE) SELECT ME.GROUP_MENU_CODE AS gMenuCode, ME.GROUP_NAME AS gName, ME.GROUP_MENU_ICON AS gMenuIcon, ME.MENU_CODE AS menuCode, ME.MENU_NAME AS menuName, ME.MENU_ICON AS menuIcon, ME.MENU_LINK AS menuLink, MENU_ROLE.MENU_ACTION AS permission, ROLE_CODE AS roleCode FROM MENU_ROLE INNER JOIN ME ON ME.MENU_CODE = MENU_ROLE.MENU_CODE ORDER BY ME.MENU_NAME, ME.GROUP_NAME ASC`, {
        raw: false,
        logging: false,
        replacements: { empId: data.empId },
        type: QueryTypes.SELECT
      });
      if (result.length > 0) {
        const arrMap = [];
        for (const item of result) {
          let p = item.permission.split('');
          arrMap.push({
            groupId: item.gMenuCode,
            groupName: item.gName,
            gMenuIcon: item.gMenuIcon,
            menuCode: item.menuCode,
            menuName: item.menuName,
            add: !!parseInt(p[0]),
            view: !!parseInt(p[1]),
            edit: !!parseInt(p[2]),
            delete: !!parseInt(p[3]),
            exports: !!parseInt(p[4])
          });
        }
        const myOrderedArray = _.orderBy(arrMap, ['menuName', 'gName'], ['asc', 'asc']);
        logger.info(LOGS_POST.permissionMenuByUID.logData.replace(':resultData', JSON.stringify(common.res200({
          roleCode: result[0].roleCode,
          menuList: myOrderedArray
        }))));
        logger.info(LOGS_POST.permissionMenuByUID.logEnd);
        return common.res200({
          roleCode: result[0].roleCode,
          menuList: myOrderedArray
        });
      } else {
        logger.info(LOGS_POST.permissionMenuByUID.logData.replace(':resultData', JSON.stringify(common.res404())));
        logger.info(LOGS_POST.permissionMenuByUID.logEnd);
        return common.res404();
      }
    } else {
      logger.info(LOGS_POST.permissionMenuByUID.logData.replace(':resultData', JSON.stringify(common.res403())));
      logger.info(LOGS_POST.permissionMenuByUID.logEnd);
      return common.res403();
    }
  } catch (error) {
    console.log(error);
    logger.error(LOGS_POST.permissionMenuByUID.logError.replace(':error', error));
    logger.info(LOGS_POST.permissionMenuByUID.logEnd);
    return common.res500();
  }
}

const getPermissionMenuList = async (req) => {
  logger.info(LOGS_GET.getPermissionMenuList.logBegin);
  try {
    const result = await models.gMenu.findAll({
      attributes: ['gMenuCode', 'gName', 'gMenuIcon'],
      include: [{
        attributes: ['menuCode', 'menuName'],
        model: models.menu,
        right: true,
        order: [
          ['menuName', 'ASC']
        ],
      }],
      subQuery: false,
      raw: true,
      logging: false,
      order: [
        ['gName', 'ASC']
      ],
    });

    if (result.length !== 0) {
      let arrayMap = [];
      let resultDs = JSON.parse(JSON.stringify(result));
      for (const key in resultDs) {
        let ds = resultDs[key];
        arrayMap.push({
          groupId: ds.gMenuCode,
          groupName: ds.gName,
          gMenuIcon: ds.gMenuIcon,
          menuCode: ds['menus.menuCode'],
          menuName: ds['menus.menuName'],
          add: false,
          view: false,
          edit: false,
          delete: false,
          exports: false
        });
      }
      logger.info(LOGS_GET.getPermissionMenuList.logData.replace(':resultData', JSON.stringify(common.res200(arrayMap))));
      logger.info(LOGS_GET.getPermissionMenuList.logEnd);
      return common.res200(arrayMap);
    } else {
      logger.info(LOGS_GET.getPermissionMenuList.logData.replace(':resultData', JSON.stringify(common.res404())));
      logger.info(LOGS_GET.getPermissionMenuList.logEnd);
      return common.res404();
    }
  } catch (error) {
    logger.error(LOGS_GET.getPermissionMenuList.logError.replace(':error', error));
    logger.info(LOGS_GET.getPermissionMenuList.logEnd);
    return common.res500();
  }
}

const actionPermission = async (req) => {
  logger.info(LOGS_POST.actionPermission.logBegin);
  try {
    const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
    const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
    if (_.isEqual(req.body, checkData)) {
      let data = req.body;
      if (data.action === 'add') {
        const resultMR = await models.menuRole.findOne({
          where: { empId: data.empId }
        });
        if (resultMR) {
          const mrDs = resultMR;
          await models.menuRole.destroy({where: { empId: mrDs.empId }});
          await models.permissionMenu.destroy({where: { menuRoleId: mrDs.id }});
          const menuRole1 = await models.menuRole.create({
            empId: data.empId,
            roleCode: data.roleCode,
            status: data.status,
            createdDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            createdBy: req.currentUser.userId
          });
          data.permissions.map(e => {
            e.menuRoleId = menuRole1.id;
          })
          await models.permissionMenu.bulkCreate(data.permissions);
          logger.info(LOGS_POST.actionPermission.logData.replace(':resultData', JSON.stringify(common.res201())));
          logger.info(LOGS_POST.actionPermission.logEnd);
          return common.res201();
        } else {
          const menuRole = await models.menuRole.create({
            empId: data.empId,
            roleCode: data.roleCode,
            status: data.status,
            createdDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            createdBy: req.currentUser.userId
          });
          data.permissions.map(e => {
            e.menuRoleId = menuRole.id;
          })
          await models.permissionMenu.bulkCreate(data.permissions);
          logger.info(LOGS_POST.actionPermission.logData.replace(':resultData', JSON.stringify(common.res201())));
          logger.info(LOGS_POST.actionPermission.logEnd);
          return common.res201();
        }
      }
    } else {
      logger.info(LOGS_POST.actionPermission.logData.replace(':resultData', JSON.stringify(common.res403())));
      logger.info(LOGS_POST.actionPermission.logEnd);
      return common.res403();
    }
  } catch (error) {
    console.log(error);
    logger.error(LOGS_POST.actionPermission.logError.replace(':error', error));
    logger.info(LOGS_POST.actionPermission.logEnd);
    return common.res500();
  }
}

module.exports = {
  getPermission, getPermissionMenuList, actionPermission, permissionMenuByUID
}