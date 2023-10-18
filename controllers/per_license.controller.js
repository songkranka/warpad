const service = require('../services/per_license');
const auth = require('../middleware/auth.middleware')
const baseRoute = '/api/PerLicense/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.get(baseRoute + 'getPerLicense90Day', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getMasPerLicense90Day();
        return res.status(dataObj.status).send(dataObj)
    })

    app.get(baseRoute + 'getPDPAQuestion', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getPDPAQuestion();
        return res.status(dataObj.status).send(dataObj)
    })
}
