const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'CAT_CODE', sqltype: sql.NVarChar, value: req.CategoryId },
                { name: 'CAT_NAME', sqltype: sql.NVarChar, value: req.CategoryName },
                { name: 'ACTIVE', sqltype: sql.NVarChar, value: req.Status },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' },
                { name: 'UPDATED_DATE', sqltype: sql.DateTime, value: null }, // Fix
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'CAT_CODE', sqltype: sql.NVarChar, value: req.CategoryId },
                { name: 'CAT_NAME', sqltype: sql.NVarChar, value: req.CategoryName },
                { name: 'ACTIVE', sqltype: sql.NVarChar, value: req.Status },
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'CAT_CODE', sqltype: sql.NVarChar, value: req.CategoryId }
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}