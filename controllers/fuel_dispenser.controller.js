const service = require('../services/fuel_dispenser');
const baseRoute = '/api/FuelDispenser/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    
    app.post(baseRoute + 'getAlertFuelDispenser', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getMasFuelDispenser(req);
        return res.status(dataObj.status).send(dataObj)
    })
}
