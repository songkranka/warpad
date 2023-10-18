const linq = require('linq');
const sql = require('mssql');
const configs = require('../configs/app');
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const queryConf = require('../configs/query.json');
const configMap = require('../configs/configMap');
const qs = require('qs');
const axios = require('axios');

exports.sendLineNotifyAdmin = async (req) => {
    try {
        const listQuery = queryConf.QueryConfig; 
        const notiConf = configMap.getConfig(configs.notify_config).LineNotify;
        const url = notiConf.line_message_uri;

        // Get Token
        let getTokenQuery = linq.from(listQuery).where(w => w.TopicName == 'GetLineToken').select(s => s.Query).first().join(" ");

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input('EMP_ID', sql.NVarChar, req.uid)
            .input('SOURCE', sql.NVarChar, 'BE')
            .query(getTokenQuery);

        let token = null;
        if (result != null && (result.rowsAffected[0] > 0)) {
            token = result.recordset[0].TOKEN_ID;
            // Send Message Line Notify
            const jsonData = {
                message: `ไฟล์: ${req.fileName}\r\nอัพโหลดข้อมูลสำเร็จ`
            }

            const requestOption = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token },
                data: qs.stringify(jsonData),
                url,
            }
            await axios(requestOption)
                .then(async (lineRes) => {
                    if (lineRes.status === 200) {
                        logger.info("Send Message Completed");
                        logger.info(JSON.stringify(lineRes.data));
                    } else {
                        logger.info("Send Message Failed");
                        throw "Error : " + lineRes.error;
                    }
                })
        } else {
            logger.info("Not Found User Token");
        }
    } catch (error) {
        throw error;
    }
}

exports.getNotificationSocFile = async (req) => {
    try {
        const conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'listNotificationFile')
            .select(s => s.Query).first().join(' ');

        let result = await conn.request()
            .input('EMP_ID', sql.NVarChar, req)
            .query(query);
        if (result.recordset.length > 0) {
            return result.recordset
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

exports.updateNotificationSocFile = async (body) => {
    try {
        console.log(body);
        const conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'updateNotificationSocFile')
            .select(s => s.Query).first().join(' ');
        const res = await conn.request()
            .input('ID', sql.NVarChar, body.id)
            .input('IS_ACTIVE', sql.TinyInt, body.isActive)
            .input('EMP_ID', sql.NVarChar, body.userId)
            .query(query);
        return res;
    } catch (error) {
        throw error;
    }
}

exports.addVendingMachineFile = async (body) => {
    try {
        const conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        console.log(body);
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'addVendingMachineFile')
            .select(s => s.Query).first().join(' ');
        await conn.request()
            .input('ID', sql.NVarChar, body.uid)
            .input('FILE_NAME', sql.NVarChar, body.fileName)
            .input('FILE_TYPE', sql.NVarChar, body.fileType)
            .input('FILE_ROWS', sql.Int, body.countRows)
            .input('FILE_STATUS', sql.NVarChar, body.status)
            .input('EMP_ID', sql.NVarChar, body.userId)
            .query(query)
            .then(result => {
                return result
            }).catch(err => {
                throw err;
            });
    } catch (error) {
        throw error;
    }
}

exports.addVendingMachine = async (body) => {
    try {
        const conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'addVendingMachine')
            .select(s => s.Query).first();
        const res = await conn.request()
            .input('CODE_STATION', sql.NVarChar, body.codeStation)
            .input('STATION_NAME', sql.NVarChar, body.stationName)
            .input('DISPENSER_NO', sql.Int, parseInt(body.dispenserNo))
            .input('DISPENSER_BRAND', sql.NVarChar, body.dispenserBrand)
            .input('DISPENSER_MODEL', sql.NVarChar, body.dispenserModel)
            .input('DISPENSER_SERIAL', sql.NVarChar, body.dispenserSerial)
            .input('DISPENSER_TYPE', sql.NVarChar, body.dispenserType)
            .input('SYSTEM_PUMP', sql.NVarChar, body.systemPump)
            .input('HAND_PAY_SIDE', sql.NVarChar, body.handPaySide)
            .input('HAND_NUMBER', sql.NVarChar, body.handNumber)
            .input('OIL_TYPE', sql.NVarChar, body.oilType)
            .input('GARUDA_STAMP_DAY', sql.Date, body.garudaStampDay)
            .input('CERTIFICATION_EXP_DATE', sql.Date, body.certificationExpDate)
            .input('CERTIFICATION_EXP_YEAR', sql.Int, parseInt(body.certificationExpYear))
            .input('CERTIFICATION_EXP_MONTH', sql.Int, parseInt(body.certificationExpMonth))
            .input('HAND_BRAND', sql.NVarChar, body.handBrand)
            .input('WORK_TIME', sql.NVarChar, body.workTime)
            .input('SURGE_PROTECTOR', sql.NVarChar, body.surgeProtector)
            .input('REMARK', sql.NText, body.remark)
            .input('STATUS', sql.NVarChar, body.status)
            .input('CREATED_BY', sql.NVarChar, body.userId)
            .input('UUID_CODE', sql.NVarChar, body.uid)
            .query(query);
        return res;
    } catch (error) {
        throw error;
    }
}

exports.updateMachineFile = async (body) => {
    try {
        const conn = await mssqlConnPool.connect();
        const listQuery = queryConf.QueryConfig;
        let query = linq.from(listQuery)
            .where(w => w.TopicName === 'updateMachineFile')
            .select(s => s.Query).first().join(' ');
        const result = await conn.request()
            .input('ID', sql.NVarChar, body.uid)
            .input('FILE_STATUS', sql.NVarChar, body.status)
            .input('IS_NOTIFICATION', sql.TinyInt, 1)
            .input('EMP_ID', sql.NVarChar, body.userId)
            .query(query);
        return result;
    } catch (error) {
        throw error;
    }
}