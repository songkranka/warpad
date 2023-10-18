const service = require('../services/task_sub_cat')
const auth = require('../middleware/auth.middleware')
const baseRoute = '/api/TaskSubCat/';
const { setupHeader } = require('../utilities/common');

module.exports = function (app) {
    app.post(baseRoute+'getTaskSubCatList', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const page = req.params.page;
        // const limit = req.params.limit;
        const dataObj = await service.getTaskSubCatList(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })   
    app.post(baseRoute+'getTaskSubCat', auth, async (req, res) => {
        setupHeader(req, res);

        // const SubCategoryId = req.params.SubCategoryId;
        // const CategoryId = req.params.CategoryId;
        const dataObj = await service.getTaskSubCat(req);
        
        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.post(baseRoute+'searchTaskSubCat', auth, async (req, res) => {
        setupHeader(req, res);

        // const typeName = req.query.TypeName;
        // const createDate = req.query.CreateDate;
        const dataObj = await service.searchTaskSubCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.get(baseRoute+'getTaskSubCatDashboard', auth, async (req, res) => {
        setupHeader(req, res);

        const dataObj = await service.getTaskSubCatDashboard();

        return res.status(dataObj.status).send(dataObj);
    })
    app.post(baseRoute+'addTaskSubCat', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.addTaskSubCat(req);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.put(baseRoute+'updateTaskSubCat', auth, async (req, res) => {
        setupHeader(req, res);
        
        // const field1 = req.body.field1;
        // const field2 = req.body.field2;
        const dataObj = await service.updateTaskSubCat(req.body);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
    app.delete(baseRoute+'deleteTaskSubCat/:SubCategoryId/:CategoryId', async (req, res) => {
        setupHeader(req, res);
        
        const SubCategoryId = req.params.SubCategoryId;
        const CategoryId = req.params.CategoryId;
        const dataObj = await service.deleteTaskSubCat(req.params);

        return res.status(dataObj.StatusCode).send(dataObj);
    })
}
