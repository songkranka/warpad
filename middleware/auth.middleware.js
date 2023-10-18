const jwt = require('jsonwebtoken');
const config = require('../configs/app');
const models = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    const bearer = 'Bearer ';

    if (!token || !token.startsWith(bearer)) {
        return res.status(403).json({
            status: 403,
            resultCode: 40300,
            resultMessage: 'Forbidden'.toUpperCase(),
        });
    }

    try {
        const authToken = token.replace(bearer, "");

        const decoded = jwt.verify(authToken, config.secret);

        let result = await models.emp.findOne({
            where: {
                empId: decoded.userId
            }
        });
        // console.log('decoded :: ', decoded);
        if (!result) {
            return res.status(401).json({
                status: 401,
                resultCode: 40100,
                resultMessage: 'Unauthorized'.toUpperCase(),
            });
        }
        req.currentUser = decoded;
        next();
    } catch (error) {
        next(error);
        return res.status(401).json({
            status: 401,
            resultCode: 40100,
            resultMessage: 'Unauthorized'.toUpperCase(),
        });
    }
}

module.exports = verifyToken;
