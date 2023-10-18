const service = require('../services/employee_role')
const auth = require('../middleware/auth.middleware')
const baseRoute = '/api/EmployeeRole/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.get(baseRoute+'getRoleList/:keyword/:page/:limit', async (req, res) => {
        setupHeader(req, res);
        
        const keyword = req.params.keyword;
        const page = req.params.page;
        const limit = req.params.limit;
        const dataObj = await service.getRoleList(req.params);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })   
    app.get(baseRoute+'getRole/:roleId', async (req, res) => {
        setupHeader(req, res);

        const roleId = req.params.roleId;
        const dataObj = await service.getRole(req.params);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
    app.get(baseRoute+'getDropdownEmp', auth, async (req, res) => {
        setupHeader(req, res);;

        const dataObj = await service.getDropdown();

        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute + 'getListRoles', auth, async (req, res) => {
        setupHeader(req, res);;
        const dataObj = await service.getListRoles(req);

        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute + 'getEmpRole', auth, async (req, res) => {
        setupHeader(req, res);;
        const dataObj = await service.getRoleById(req);

        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute+'postEmpRole', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.actionEmpRole(req);
        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute+'updateEmpRole', async (req, res) => {
        setupHeader(req, res);
        
        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const dataObj = await service.updateEmpRole(req.body);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
}
