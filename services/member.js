const linq = require('linq');
const sql = require('mssql');
const config = require('../configs/app')
const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const queryConf = require('../configs/query.json');
const respTopMember = require('../datamapper/responseGetTopMember');
const apiCaller = require('../utilities/apicaller');
const xml2js = require('xml2js');

async function getTopMember(params) {
    var conn = null;
    var ret = {};
    try {
        logger.info("Begin | Get Top Member process");
        logger.info("Request => " + JSON.stringify(params));

        let legCode = await getLegCode(params.BrnCode);
        let soapReq = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <GetTop20Customer xmlns="http://tempuri.org/">
                    <BrnCode>${legCode}</BrnCode>
                    <RankCustomer>${params.Rank}</RankCustomer>
                </GetTop20Customer>
            </soap:Body>
        </soap:Envelope>`

        var responseSoap = await apiCaller.postSoap(config.apiCrm.endpoint, config.apiCrm.soapAction, soapReq);

        let options = { explicitArray: false, tagNameProcessors: [xml2js.processors.stripPrefix] };
        xml2js.parseString(responseSoap, options, (err, result) => {
            if (err) {
                throw err;
            }

            let soapBody = result.Envelope.Body;
            if (soapBody.GetTop20CustomerResponse.$) {
                delete soapBody.GetTop20CustomerResponse.$;
            }

            let data = {
                result: JSON.parse(soapBody.GetTop20CustomerResponse.GetTop20CustomerResult).data
            }
            ret = respTopMember.getResponse(200, data);
        });

        logger.info("Response => " + JSON.stringify(ret));
    }
    catch (err) {
        logger.error('Get Top Member have error : ' + err);
        ret = respTopMember.getResponse(400, null);

    } finally {
        if (conn != null) {
            conn.release();
        }
        logger.info("End | Get Top Member process")
        return ret;
    }
}

async function getLegCode(brnCode) {
    var conn = null;
    var legCode = null;
    try {
        const listQuery = queryConf.QueryConfig;
        let queryGetLegCode = linq.from(listQuery).where(w => w.TopicName == 'GetLegCode').select(s => s.Query).first().join(" ");

        conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input('BRANCH_CODE', sql.NVarChar, brnCode)
            .query(queryGetLegCode);
        if (result != null && (result.rowsAffected[0] > 0)) {
            legCode = result.recordset[0].LEG_CODE;
        }
    }
    catch (err) {
        logger.error('Get New Branch Code have error : ' + err);
    } finally {
        if (conn != null) {
            conn.release();
        }
        return legCode;
    }
}

module.exports = {
    getTopMember
}