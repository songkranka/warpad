const logger = require('../utilities/logger');
const mssqlConnPool = require('../utilities/database');
const sqlCommand = "SELECT getdate() as MASTERDATA_API";

async function getStatus() {
    const conn = await mssqlConnPool.connect();
    var ret;
    try {
        let result = await conn.request().query(sqlCommand);
        logger.info('getStatus - Effect record : ' + result.recordset.length);
        if (result !== null) {
            if (result.rowsAffected[0] > 0) {              
                ret = {SUCCESS: result.recordset };    
            }
          } else {
            ret =  {ERROR: 'Record = 0' };
          }   
    } catch (err) {
        logger.error('getStatus - Error : Failed to connect database');
        ret = {ERROR: 'Failed to connect database' };
    } finally {
        conn.release();
        return ret;
    }
}
module.exports = {
    getStatus
}