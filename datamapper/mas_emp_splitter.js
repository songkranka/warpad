const sql = require('mssql');
function prepareData(req, action) {

    var parameters = null;
    switch (action) {
        case "INSERT":
            parameters = [
                { name: 'BRANCH_CODE', sqltype: sql.NVarChar, value: req.BRANCH_CODE },
                { name: 'BRANCH_NAME', sqltype: sql.NVarChar, value: req.BRANCH_NAME },
                { name: 'LEG_CODE', sqltype: sql.NVarChar, value: req.LEG_CODE },
                { name: 'PLANT_CODE', sqltype: sql.NVarChar, value: req.PLANT_CODE },
                { name: 'EMP_ID', sqltype: sql.NVarChar, value: req.EMP_ID },
                { name: 'EMP_FULLNAME_TH', sqltype: sql.NVarChar, value: req.EMP_FULLNAME_TH },
                { name: 'POS_CODE', sqltype: sql.NVarChar, value: req.POS_CODE },
                { name: 'POS_NAME_TH', sqltype: sql.NVarChar, value: req.POS_NAME_TH },
                { name: 'MINLVL', sqltype: sql.Int, value: req.MINLVL },
                { name: 'MAXLVL', sqltype: sql.Int, value: req.MAXLVL },
                { name: 'NUMLVL', sqltype: sql.Int, value: req.NUMLVL },
                { name: 'COMPANYCODE_LEVEL1', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL1 },
                { name: 'COMPANYNAME_LEVEL1', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL1 },
                { name: 'COMPANYCODE_LEVEL4', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL4 },
                { name: 'COMPANYNAME_LEVEL4', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL4 },
                { name: 'LOC_CODE', sqltype: sql.NVarChar, value: req.LOC_CODE },
                { name: 'LOC_NAME', sqltype: sql.NVarChar, value: req.LOC_NAME },
                { name: 'COMPANYCODE_LEVEL2', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL2 },
                { name: 'COMPANYNAME_LEVEL2', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL2 }
            ];
            return parameters;

        case "UPDATE":
            parameters = [
                { name: 'BRANCH_CODE', sqltype: sql.NVarChar, value: req.BRANCH_CODE },
                { name: 'BRANCH_NAME', sqltype: sql.NVarChar, value: req.BRANCH_NAME },
                { name: 'LEG_CODE', sqltype: sql.NVarChar, value: req.LEG_CODE },
                { name: 'PLANT_CODE', sqltype: sql.NVarChar, value: req.PLANT_CODE },
                { name: 'EMP_ID', sqltype: sql.NVarChar, value: req.EMP_ID },
                { name: 'EMP_FULLNAME_TH', sqltype: sql.NVarChar, value: req.EMP_FULLNAME_TH },
                { name: 'POS_CODE', sqltype: sql.NVarChar, value: req.POS_CODE },
                { name: 'POS_NAME_TH', sqltype: sql.NVarChar, value: req.POS_NAME_TH },
                { name: 'MINLVL', sqltype: sql.Int, value: req.MINLVL },
                { name: 'MAXLVL', sqltype: sql.Int, value: req.MAXLVL },
                { name: 'NUMLVL', sqltype: sql.Int, value: req.NUMLVL },
                { name: 'COMPANYCODE_LEVEL1', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL1 },
                { name: 'COMPANYNAME_LEVEL1', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL1 },
                { name: 'COMPANYCODE_LEVEL4', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL4 },
                { name: 'COMPANYNAME_LEVEL4', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL4 },
                { name: 'LOC_CODE', sqltype: sql.NVarChar, value: req.LOC_CODE },
                { name: 'LOC_NAME', sqltype: sql.NVarChar, value: req.LOC_NAME },
                { name: 'COMPANYCODE_LEVEL2', sqltype: sql.NVarChar, value: req.COMPANYCODE_LEVEL2 },
                { name: 'COMPANYNAME_LEVEL2', sqltype: sql.NVarChar, value: req.COMPANYNAME_LEVEL2 }
            ];
            return parameters;

        case "DELETE":
            parameters = [
                { name: 'BRANCH_CODE', sqltype: sql.NVarChar, value: req.BRANCH_CODE },
                { name: 'EMP_ID', sqltype: sql.NVarChar, value: req.EMP_ID }
            ];
            return parameters;
    }
}

module.exports = {
    prepareData
}