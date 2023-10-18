const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'SUB_CAT_CODE', sqltype: sql.NVarChar, value: req.SubCategoryId },
                { name: 'CAT_CODE', sqltype: sql.NVarChar, value: req.CategoryId },
                { name: 'TYPE_NAME', sqltype: sql.NVarChar, value: req.TypeName },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' },
                { name: 'UPDATED_DATE', sqltype: sql.DateTime, value: null }, // Fix
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
                { name: 'IS_SPECIAL', sqltype: sql.TinyInt, value: req.IsSpecial },
                { name: 'IS_CAL', sqltype: sql.TinyInt, value: req.IsCal },
                { name: 'TASK_TYPE', sqltype: sql.NVarChar, value: req.TaskType }
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'SUB_CAT_CODE', sqltype: sql.NVarChar, value: req.SubCategoryId },
                { name: 'CAT_CODE', sqltype: sql.NVarChar, value: req.CategoryId },
                { name: 'TYPE_NAME', sqltype: sql.NVarChar, value: req.TypeName },
                { name: 'ACTIVE', sqltype: sql.TinyInt, value: req.Status },
                { name: 'CREATED_DATE', sqltype: sql.DateTime, value: null },
                { name: 'CREATED_BY', sqltype: sql.NVarChar, value: 'SYS' },
                { name: 'UPDATED_BY', sqltype: sql.NVarChar, value: null }, // Fix
                { name: 'IS_SPECIAL', sqltype: sql.TinyInt, value: req.IsSpecial },
                { name: 'IS_CAL', sqltype: sql.TinyInt, value: req.IsCal },
                { name: 'TASK_TYPE', sqltype: sql.NVarChar, value: req.TaskType }
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'SUB_CAT_CODE', sqltype: sql.NVarChar, value: req.SubCategoryId }
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}