const service = require('../services/menu')
const auth = require('../middleware/auth.middleware')
const baseRoute = '/api/Menu/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    // /:keyword/:page/:limit
    app.post(baseRoute+'getMenuList', auth, async (req, res) => {
        setupHeader(req, res);;

        const dataObj = await service.apiMenuList(req);

        // if (!dataObj.status) {
        //     return res.status(404).send(dataObj.response)
        // }
        return res.status(dataObj.status).send(dataObj)
    })   
    app.get(baseRoute+'getMenu/:menuCode', async (req, res) => {
        setupHeader(req, res);

        const menuCode = req.params.menuCode;
        const dataObj = await service.getMenu(req.params);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
    app.post(baseRoute+'getMenuById', auth, async (req, res) => {
        setupHeader(req, res);

        const dataObj = await service.apiMenuById(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute+'actionMenu', auth, async (req, res) => {
        setupHeader(req, res);

        const dataObj = await service.actionMenu(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute+'updateMenu', async (req, res) => {
        setupHeader(req, res);
        
        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const dataObj = await service.updateMenu(req.body);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
    app.post(baseRoute+'getGroupMenuList', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.apiGroupMenuList(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute+'getGroupMenuById', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.apiGroupMenuById(req);
        return res.status(dataObj.status).send(dataObj)
    })
    app.post(baseRoute+'postGroupMenu', auth, async (req, res) => {
        setupHeader(req, res);
        const dataObj = await service.actionGroupMenu(req);

        return res.status(dataObj.status).send(dataObj)
    })
}
