const express = require('express');

function eRoutes() {
    const router = express.Router();
    var branch_active = require('./controllers/branch_active.controller')(router);
    var branch = require('./controllers/branch.controller')(router);
    var employee_pos = require('./controllers/employee_pos.controller')(router);
    var employee_role = require('./controllers/employee_role.controller')(router);
    var employee = require('./controllers/employee.controller')(router);
    var healthcheck = require('./controllers/healthcheck.controller')(router);
    var menu_role = require('./controllers/menu_role.controller')(router);
    var menu = require('./controllers/menu.controller')(router);
    var taskcat = require('./controllers/task_cat.controller')(router);
    var taskSubcat = require('./controllers/task_sub_cat.controller')(router);
    var sla = require('./controllers/sla.controller')(router);
    var member = require('./controllers/member.controller')(router);
    var permission = require('./controllers/permission.controller')(router);
    var dropdown = require('./controllers/dropdown.controller')(router);
    var remark = require('./controllers/remark.controller')(router);
    var locationAuth = require('./controllers/location_auth.controller')(router);
    var perLicense = require('./controllers/per_license.controller')(router);
    var fueldispenser = require('./controllers/fuel_dispenser.controller')(router);

    return router;
}

module.exports = eRoutes;