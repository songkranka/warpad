const service = require('../services/menu_role')
const baseRoute = '/api/MenuRole/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.get(baseRoute+'getMenuRoleList/:keyword/:page/:limit', async (req, res) => {
        setupHeader(req, res);
        
        const keyword = req.params.keyword;
        const page = req.params.page;
        const limit = req.params.limit;
        const dataObj = await service.getMenuRoleList(req.params);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })   
    app.get(baseRoute+'getMenuRole/:menuId', async (req, res) => {
        setupHeader(req, res);

        const menuId = req.params.menuId;
        const dataObj = await service.getMenuRole(req.params);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
    app.post(baseRoute+'addMenuRole', async (req, res) => {
        setupHeader(req, res);
        
        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const dataObj = await service.addMenuRole(req.body);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
    app.post(baseRoute+'updateMenuRole', async (req, res) => {
        setupHeader(req, res);
        
        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const dataObj = await service.updateMenuRole(req.body);

        if (!dataObj.status) {
            return res.status(404).send(dataObj.response)
        }
        return res.status(200).send(dataObj.response)
    })
}
