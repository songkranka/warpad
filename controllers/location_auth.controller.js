const service = require('../services/location_auth');
const baseRoute = '/api/locationAuth/';
const { setupHeader } = require('../utilities/common');
const auth = require('../middleware/auth.middleware');

module.exports = function (app) {
    app.post(baseRoute + 'getLocation', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getLocation(req);
        return res.status(dataObj.status).send(dataObj)
    })

    app.get(baseRoute + 'getLocationGroup', async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getLocationGroup();
        return res.status(dataObj.status).send(dataObj);
    })
}
