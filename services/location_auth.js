const logger = require('../utilities/logger');
const common = require('../utilities/common');
const models = require('../models/index');
const _ = require("lodash");

async function getLocation(req) {
    try {
        const secretKey = req.headers['x-transaction-id'] + req.currentUser.userId;
        const checkData = common.fnDecrypt(req.headers['authdata'], secretKey);
        if (_.isEqual(req.body, checkData)) {

            let body = req.body;
            let resLocAuth = await models.localAuth.findAll({
                where: { authCode: body.authCode }
            });

            if (resLocAuth.length > 0) {
                let data = [];
                resLocAuth.forEach(field => {
                    data.push({ locationId: field.locId, locationName: field.locName })
                });
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
        logger.error('Get Location authority have error : ' + err);
        logger.error("Request => " + JSON.stringify(req.body));
        return common.res500();
    }
}

async function getLocationGroup(req) {
    try {
        let resLocAuthGroup = await models.localAuthGroup.findAll();

        if (resLocAuthGroup.length > 0) {
            let data = [];
            resLocAuthGroup.forEach(field => {
                data.push({ authCode: field.authCode, authName: field.authName })
            });
            return common.res200(data);
        } else {
            return common.res404();
        }
    }
    catch (err) {
        logger.error('Get Location authority group have error : ' + err);
        logger.error("Request => " + JSON.stringify(req.body));
        return common.res500();
    }
}

module.exports = {
    getLocation, getLocationGroup
}