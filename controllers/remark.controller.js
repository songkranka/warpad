const service = require('../services/remark');
const baseRoute = '/api/Remark/';

module.exports = function (app) {
    app.get(baseRoute + 'getRemarkAll', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const dataObj = await service.getRemarkList();

        return res.status(dataObj.status).send(dataObj);
    })
}
