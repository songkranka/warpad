const service = require('../services/member')
const baseRoute = '/api/Member/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getTopMember', async (req, res) => {
        setupHeader(req, res);

        const BrnCode = req.body.BrnCode;
        const Rank = req.body.Rank;
        const dataObj = await service.getTopMember(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
