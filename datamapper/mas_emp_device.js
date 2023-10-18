const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'EMP_ID', sqltype: sql.VarChar, value: req.EmpId },
                { name: 'BROWSER', sqltype: sql.NVarChar, value: req.Browser },
                { name: 'BROWSER_VERSION', sqltype: sql.NVarChar, value: req.BrowserVersion },
                { name: 'DEVICE_NAME', sqltype: sql.NVarChar, value: req.DeviceName },
                { name: 'DEVICE_TYPE', sqltype: sql.NVarChar, value: req.DeviceType },
                { name: 'OS_NAME', sqltype: sql.NVarChar, value: req.OsName },
                { name: 'OS_VERSION', sqltype: sql.NVarChar, value: req.OsVersion },
                { name: 'SOURCE', sqltype: sql.NVarChar, value: req.Source },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' }
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'BROWSER', sqltype: sql.NVarChar, value: req.Browser },
                { name: 'BROWSER_VERSION', sqltype: sql.NVarChar, value: req.BrowserVersion },
                { name: 'DEVICE_NAME', sqltype: sql.NVarChar, value: req.DeviceName },
                { name: 'DEVICE_TYPE', sqltype: sql.NVarChar, value: req.DeviceType },
                { name: 'OS_NAME', sqltype: sql.NVarChar, value: req.OsName },
                { name: 'OS_VERSION', sqltype: sql.NVarChar, value: req.OsVersion },
                { name: 'SOURCE', sqltype: sql.NVarChar, value: req.Source }
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'EMP_ID', sqltype: sql.VarChar, value: req.EmpId },
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}