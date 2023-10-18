const service = require('../services/employee_pos')
const baseRoute = '/api/EmployeePos/';
const auth = require('../middleware/auth.middleware');
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getPosList', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getPosList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })   
    app.post(baseRoute+'searchPos', auth, async (req, res) => {
        setupHeader(req, res);

        // const posCode = req.query.posCode;
        // const openDate = req.query.openDate;
        const dataObj = await service.searchPos(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
