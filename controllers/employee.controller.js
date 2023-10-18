const service = require('../services/employee');
const auth = require('../middleware/auth.middleware')
const baseRoute = '/api/Employee/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute + 'getEmpList', auth, async (req, res) => {
        setupHeader(req, res);

        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getEmpList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'getEmp/:empId', async (req, res) => {
        setupHeader(req, res);

        const empId = req.params.empId;
        const dataObj = await service.getEmp(req.params);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'employeeById', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.employeeById(req);

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute + 'searchEmp', auth, async (req, res) => {
        setupHeader(req, res);

        // const employeeName = req.query.empName;
        // const createDate = req.query.createDate;
        const dataObj = await service.searchEmp(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'getBranchManager', async (req, res) => {
        setupHeader(req, res);

        const KeySearchList = req.body.KeySearchList;
        const dataObj = await service.getBranchManager(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'getBranchEmployee', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getBranchEmployee(req);

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute + 'addUserToken', async (req, res) => {
        setupHeader(req, res);

        const EmpId = req.body.EmpId;
        const TokenId = req.body.TokenId;
        const Status = req.body.Status;
        const dataObj = await service.addUserToken(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'addUserDevice', async (req, res) => {
        setupHeader(req, res);

        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const dataObj = await service.addUserDevice(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute + 'addManager', auth, async (req, res) => {
        setupHeader(req, res);

        const dataObj = await service.addManager(req);
        console.log(dataObj);

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute + 'searchEmployee', auth, async (req, res) => {
        setupHeader(req, res);;
        const dataObj = await service.searchEmployee(req);

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute + 'getManagerEmail', auth, async (req, res) => {
        setupHeader(req, res);

        const KeySearchList = req.body.EmpId;
        const dataObj = await service.getManagerEmail(req);

        return res.status(dataObj.status).send(dataObj);
    })
}
