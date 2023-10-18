const service = require('../services/branch_active')
const baseRoute = '/api/BranchActive/';

const auth = require('../middleware/auth.middleware');
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute + 'getBranchList', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getBranchList(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute + 'getBranchAll', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getBranchAll();

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute + 'addBranch', async (req, res) => {
        setupHeader(req, res);

        const BrnCode = req.body.BrnCode;
        const dataObj = await service.addBranch(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
