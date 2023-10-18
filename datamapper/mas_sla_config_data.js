const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'SLA_CODE', sqltype: sql.NVarChar, value: req.SlaId },
                { name: 'SLA_NAME', sqltype: sql.NVarChar, value: req.SlaName },
                { name: 'ADD_TIME', sqltype: sql.Int, value: req.SlaTime },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' },
                { name: 'UPDATED_DATE', sqltype: sql.DateTime, value: null }, // Fix
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'SLA_CODE', sqltype: sql.NVarChar, value: req.SlaId },
                { name: 'SLA_NAME', sqltype: sql.NVarChar, value: req.SlaName },
                { name: 'ADD_TIME', sqltype: sql.Int, value: req.SlaTime },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'SLA_CODE', sqltype: sql.NVarChar, value: req.SlaId }
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}