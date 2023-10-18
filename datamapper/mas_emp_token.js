const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'EMP_ID', sqltype: sql.VarChar, value: req.EmpId },
                { name: 'TOKEN_ID', sqltype: sql.NVarChar, value: req.TokenId },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' },
                { name: 'UPDATED_DATE', sqltype: sql.DateTime, value: null },
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null },
                { name: 'SOURCE', sqltype: sql.NVarChar, value: req.Source }
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'TOKEN_ID', sqltype: sql.NVarChar, value: req.TokenId },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'UPDATED_DATE', sqltype: sql.DateTime, value: req.EmpId },
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'EMP_ID', sqltype: sql.VarChar, value: req.EmpId },
                { name: 'TOKEN_ID', sqltype: sql.NVarChar, value: req.TokenId },
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}