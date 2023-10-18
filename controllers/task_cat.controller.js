const service = require('../services/task_cat')
const baseRoute = '/api/TaskCat/';
const auth = require('../middleware/auth.middleware');
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getTaskCatList',auth, async (req, res) => {
        setupHeader(req, res);
        
        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getTaskCatList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })   
    app.post(baseRoute+'getTaskCat',auth, async (req, res) => {
        setupHeader(req, res);

        // const CategoryId = req.params.CategoryId;
        const dataObj = await service.getTaskCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'searchTaskCat', auth, async (req, res) => {
        setupHeader(req, res);

        // const categoryName = req.query.CategoryName;
        // const createDate = req.query.CreateDate;
        const dataObj = await service.searchTaskCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'addTaskCat', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.addTaskCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.put(baseRoute+'updateTaskCat', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.updateTaskCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.delete(baseRoute+'deleteTaskCat/:CategoryId', async (req, res) => {
        setupHeader(req, res);
        
        const CategoryId = req.params.CategoryId;
        const dataObj = await service.deleteTaskCat(req.params);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
