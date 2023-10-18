const service = require('../services/sla');
const baseRoute = '/api/sla/';
const auth = require('../middleware/auth.middleware');
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getSlaList', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getSlaList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })   
    app.post(baseRoute+'getSla', auth, async (req, res) => {
        setupHeader(req, res);

        // const SlaId = req.params.SlaId;
        const dataObj = await service.getSla(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getBatchSla', async (req, res) => {
        setupHeader(req, res);

        const dataObj = await service.getBatchSla();

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'searchSla', auth, async (req, res) => {
        setupHeader(req, res);

        // const slaName = req.query.SlaName;
        // const createDate = req.query.CreateDate;
        const dataObj = await service.searchSla(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'addSla', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.addSla(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.put(baseRoute+'updateSla', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.updateSla(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.delete(baseRoute+'deleteSla/:SlaId', async (req, res) => {
        setupHeader(req, res);
        
        const SlaId = req.params.SlaId;
        const dataObj = await service.deleteSla(req.params);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
