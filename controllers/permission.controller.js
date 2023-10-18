const service = require('../services/permission');
const auth = require('../middleware/auth.middleware');
const baseRoute = '/api/Permission/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) { 
    app.get(baseRoute + 'getPermissionMenu', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getPermission(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute + 'permissionMenuByUID', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.permissionMenuByUID(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.get(baseRoute + 'getPermissionMenuList', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.getPermissionMenuList(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute + 'postPermission', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.actionPermission(req);
        return res.status(dataObj.status).send(dataObj)
    })
}