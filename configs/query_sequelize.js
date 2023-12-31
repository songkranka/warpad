module.exports = {
    MAP_QUERY: {
        MANAGER_PROFILE: `SELECT ME.EMP_ID, ME.EMP_FULLNAME_TH, ME.POS_CODE, ME.POS_NAME_TH, MP.MINLVL, MP.MAXLVL FROM MAS_EMPLOYEE ME INNER JOIN MAS_EMPLOYEE_POS MP ON ME.POS_CODE = MP.POS_CODE WHERE EMP_ID = :empId`,
        ADD_MANAGER: `SELECT DISTINCT TOP (1) MM.ORG_CODEDEV AS BRN_CODE, CASE WHEN MP.BRN_NAME IS NULL THEN MM.ORG_NAME ELSE MP.BRN_NAME END AS BRN_NAME, MP.COMPANYCODE_LEVEL1, MP.COMPANYNAME_LEVEL1, MP.COMPANYCODE_LEVEL4, MP.COMPANYNAME_LEVEL4, MP.COMPANYCODE_LEVEL2, MP.COMPANYNAME_LEVEL2, SP.LEG_CODE, SP.PLANT, MP.LOC_CODE, MP.LOC_NAME FROM MAS_BRANCH_CODE_MAPPING MM LEFT JOIN MAS_BRANCH_PROFILE MP ON MM.ORG_CODEDEV = MP.BRN_CODE INNER JOIN MAS_SAP_PLANT SP ON MM.ORG_CODE = SP.LEG_CODE AND SP.SRC_NAME = 'PTC' WHERE MM.ORG_CODEDEV = :brnCode OR MP.COMPANYCODE_LEVEL7 = :brnCode ORDER BY MP.LOC_CODE ASC`
    }
}