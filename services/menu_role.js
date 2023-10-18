const linq = require('linq');
const sql = require('mssql');
const logger = require('../utilities/logger');
const config = require('../configs/query.json');
const mssqlConnPool = require('../utilities/database');

async function getMenuRoleList(params) {
    let ret = "";
    try {
        console.log(params.keyword);
        console.log(params.page);
        console.log(params.limit);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetMenuRoleList').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input('PAGE_NO', sql.Int, params.page)
            .input('LIMIT', sql.Int, params.limit)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getMenuRoleList Error => " + err);
    }
    return ret;
}
async function getMenuRole(params) {
    let ret = "";
    try {
        console.log(params.menuId);

        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'GetMenuRole').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .input("MENU_CODE", sql.NVarChar, params.menuId)
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("getMenuRole Error => " + err);
    }
    return ret;
}
async function addMenuRole(params) {
    let ret = "";
    try {
        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'AddMenuRole').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("addMenuRole Error => " + err);
    }
    return ret;
}
async function updateMenuRole(params) {
    let ret = "";
    try {
        const listQuery = config.QueryConfig;
        let query = linq.from(listQuery).where(w => w.TopicName == 'UpdateMenuRole').select(s => s.Query).first();

        const conn = await mssqlConnPool.connect();
        let result = await conn.request()
            .query(query);

        ret = { status: true, response: JSON.stringify(result.recordset) };
    }
    catch (err) {
        ret = { status: false, response: err };
        console.log("updateMenuRole Error => " + err);
    }
    return ret;
}
module.exports = {
    getMenuRoleList, getMenuRole, addMenuRole, updateMenuRole
}
