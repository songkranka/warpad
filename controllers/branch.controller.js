const service = require('../services/branch')
const baseRoute = '/api/Branch/';
const auth = require('../middleware/auth.middleware');
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getBranchList', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getBranchList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getBranchBUList', async (req, res) => {
        setupHeader(req, res);
        
        const keyWord = req.query.keyWord;
        const dataObj = await service.getBranchBuList(req.query);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getBranchAreaList', async (req, res) => {
        setupHeader(req, res);
        
        const keyWord = req.query.keyWord;
        const dataObj = await service.getBranchAreaList(req.query);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getBranchProvinceList', async (req, res) => {
        setupHeader(req, res);
        
        const keyWord = req.query.keyWord;
        const dataObj = await service.getBranchProvinceList(req.query);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getBranchList', async (req, res) => {
        setupHeader(req, res);
        
        const keyWord = req.query.keyWord;
        const dataObj = await service.getBranchListSom(req.query);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'searchBranch', auth, async (req, res) => {
        setupHeader(req, res);

        // const brnName = req.query.brnName;
        // const openDate = req.query.openDate;
        const dataObj = await service.searchBranch(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'getBranchAreaManager', auth, async (req, res) => {
        setupHeader(req, res);

        // const brnName = req.query.brnName;
        // const openDate = req.query.openDate;
        const dataObj = await service.getBranchAreaManager(req, req.currentUser.userId);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
