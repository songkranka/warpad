const services = require("../services/dropdown");
const auth = require("../middleware/auth.middleware");
const baseRoute = "/api/Dropdown";
const { setupHeader } = require("../utilities/common");

module.exports = (app) => {
	app.get(`${baseRoute}/getDropdownGroupMenu`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpGroupMenu(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.get(`${baseRoute}/getDropdownEmpRole`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpEmpRole(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.get(`${baseRoute}/getDdTaskSubCatDashboard`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpTaskSubCatDashboard(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdBranchList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpBranchList(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdAllBranchList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpAllBranchList(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdBranchBUList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpBranchBUList(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdBranchAreaList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpBranchAreaList(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdBranchProvinceList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpBranchProvinceList(req);
		return res.status(dataObj.status).send(dataObj);
	});
	app.post(`${baseRoute}/getDdBranchTaxList`, auth, async (req, res) => {
		setupHeader(req, res);
		const dataObj = await services.dpBranchTaxList(req);
		return res.status(dataObj.status).send(dataObj);
	});
};
