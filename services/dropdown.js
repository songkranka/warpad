const logger = require("../utilities/logger");
const dayjs = require("dayjs");
const common = require("../utilities/common");
const models = require("../models/index");
const _ = require("lodash");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const { LOGS_GET } = require("../configs/mapping_logs");
const Op = Sequelize.Op;

const dpGroupMenu = async (req) => {
	logger.info(LOGS_GET.dpGroupMenu.logBegin);
	try {
		const result = await models.gMenu.findAll({
			attributes: ["gMenuCode", "gName"],
			order: [["gName", "ASC"]],
		});
		if (result.length !== 0) {
			logger.info(LOGS_GET.dpGroupMenu.logData.replace(":resultData", JSON.stringify(common.res200(result))));
			logger.info(LOGS_GET.dpGroupMenu.logEnd);
			return common.res200(result);
		} else {
			logger.info(LOGS_GET.dpGroupMenu.logData.replace(":resultData", JSON.stringify(common.res404())));
			logger.info(LOGS_GET.dpGroupMenu.logEnd);
			return common.res404();
		}
	} catch (e) {
		logger.info(LOGS_GET.dpGroupMenu.logError.replace(":error", e));
		logger.info(LOGS_GET.dpGroupMenu.logEnd);
		return common.res500();
	}
};

const dpEmpRole = async (req) => {
	logger.info(LOGS_GET.dpEmpRole.logBegin);
	try {
		const result = await models.empRole.findAll({
			attributes: ["roleCode", "roleName"],
			where: {
				status: true,
			},
			order: [["roleName", "ASC"]],
		});
		if (result.length !== 0) {
			logger.info(LOGS_GET.dpEmpRole.logData.replace(":resultData", JSON.stringify(common.res200(result))));
			logger.info(LOGS_GET.dpEmpRole.logEnd);
			return common.res200(result);
		} else {
			logger.info(LOGS_GET.dpEmpRole.logData.replace(":resultData", JSON.stringify(common.res404())));
			logger.info(LOGS_GET.dpEmpRole.logEnd);
			return common.res404();
		}
	} catch (e) {
		logger.info(LOGS_GET.dpEmpRole.logError.replace(":error", e));
		logger.info(LOGS_GET.dpEmpRole.logEnd);
		return common.res500();
	}
};

const dpTaskSubCatDashboard = async (req) => {
	logger.info(LOGS_GET.dpTaskSubCatDashboard.logBegin);
	try {
		const result = await models.sequelize.query(
			`SELECT CAT_CODE, SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY WHERE SUB_CAT_CODE IN ('TDL1001-01', 'FIN1001-03', 'WST1001-02', 'WST1001-04') UNION SELECT DISTINCT CAT_CODE, NULL AS SUB_CAT_CODE, TYPE_DESC FROM MAS_TASK_SUB_CATEGORY WHERE CAT_CODE = 'VRM1001'`,
			{ type: QueryTypes.SELECT }
		);
		if (result.length !== 0) {
			logger.info(LOGS_GET.dpTaskSubCatDashboard.logData.replace(":resultData", JSON.stringify(common.res200(common.camelizeKeys(result)))));
			logger.info(LOGS_GET.dpTaskSubCatDashboard.logEnd);
			return common.res200(common.camelizeKeys(result));
		} else {
			logger.info(LOGS_GET.dpTaskSubCatDashboard.logData.replace(":resultData", JSON.stringify(common.res404())));
			logger.info(LOGS_GET.dpTaskSubCatDashboard.logEnd);
			return common.res404();
		}
	} catch (e) {
		logger.info(LOGS_GET.dpTaskSubCatDashboard.logError.replace(":error", e));
		logger.info(LOGS_GET.dpTaskSubCatDashboard.logEnd);
		return common.res500();
	}
};

const dpAllBranchList = async (req) => {
	try {
		const secretKey = req.headers["x-transaction-id"] + req.currentUser.userId;
		const checkData = common.fnDecrypt(req.headers["authdata"], secretKey);
		if (_.isEqual(req.body, checkData)) {
			const result = await models.vBranch.findAll({
				where: {
					brnCode: req.body.brnCode
						? {
								[Op.ne]: null,
								[Op.like]: `%${req.body.brnCode}%`,
						  }
						: {
								[Op.ne]: null,
						  },
				},
			});
			if (result.length !== 0) {
				return common.checkResponse(200, 20000, "Success", result, "Branch List", "Post");
			} else {
				return common.checkResponse(404, 40400, "Data not found", result, "Branch List", "Post");
			}
		} else {
			return common.checkResponse(200, 40404, "ข้อมูลที่ส่งไม่ถูกต้อง", null, req.body.action + " Permission", "Post");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Branch List", "Post");
	}
};

const dpBranchList = async (req) => {
	try {
		const result = await models.empSplitter.findAll({
			attributes: ["brnCode", "brnName"],
			group: ["BRANCH_CODE", "BRANCH_NAME"],
			where: {
				brnCode: req.body.branchCode
					? {
							[Op.ne]: null,
							[Op.like]: `%${req.body.branchCode}%`,
					  }
					: {
							[Op.ne]: null,
					  },
				comCodeLV4: {
					[Op.ne]: null,
				},
				locCode: {
					[Op.not]: "0390",
				},
			},
		});
		if (result.length !== 0) {
			return common.checkResponse(200, 20000, "Success", common.camelizeKeys(result), "Sub Category for Dashboard", "Get");
		} else {
			return common.checkResponse(200, 20000, "Success", result, "Sub Category for Dashboard", "Get");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Sub Category for Dashboard", "Get");
	}
};

const dpBranchBUList = async (req) => {
	try {
		const result = await models.empSplitter.findAll({
			attributes: ["comCodeLV1", "comNameLV1"],
			group: ["COMPANYCODE_LEVEL1", "COMPANYNAME_LEVEL1"],
			where: {
				comCodeLV1: req.body.bu
					? {
							[Op.like]: `%${req.body.bu}%`,
							[Op.ne]: null,
					  }
					: {
							[Op.ne]: null,
					  },
			},
		});
		if (result.length !== 0) {
			return common.checkResponse(200, 20000, "Success", common.camelizeKeys(result), "Sub Category for Dashboard", "Get");
		} else {
			return common.checkResponse(200, 20000, "Success", result, "Sub Category for Dashboard", "Get");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Sub Category for Dashboard", "Get");
	}
};

const dpBranchAreaList = async (req) => {
	try {
		const result = await models.empSplitter.findAll({
			attributes: ["comCodeLV2", "comNameLV2"],
			group: ["COMPANYCODE_LEVEL2", "COMPANYNAME_LEVEL2"],
			where: {
				comCodeLV2: req.body.area
					? {
							[Op.like]: `%${req.body.area}%`,
					  }
					: {
							[Op.ne]: null,
					  },
			},
		});
		if (result.length !== 0) {
			return common.checkResponse(200, 20000, "Success", common.camelizeKeys(result), "Sub Category for Dashboard", "Get");
		} else {
			return common.checkResponse(200, 20000, "Success", result, "Sub Category for Dashboard", "Get");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Sub Category for Dashboard", "Get");
	}
};

const dpBranchProvinceList = async (req) => {
	try {
		const result = await models.empSplitter.findAll({
			attributes: ["comCodeLV4", "comNameLV4"],
			group: ["COMPANYCODE_LEVEL4", "COMPANYNAME_LEVEL4"],
			where: {
				comCodeLV4: req.body.province
					? {
							[Op.like]: `%${req.body.province}%`,
							[Op.not]: "0390",
							[Op.ne]: null,
					  }
					: {
							[Op.ne]: null,
							[Op.not]: "0390",
					  },
			},
		});
		if (result.length !== 0) {
			return common.checkResponse(200, 20000, "Success", common.camelizeKeys(result), "Sub Category for Dashboard", "Get");
		} else {
			return common.checkResponse(200, 20000, "Success", result, "Sub Category for Dashboard", "Get");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Sub Category for Dashboard", "Get");
	}
};

const dpBranchTaxList = async (req) => {
	try {
		const result = await models.sequelize.query(
			"SELECT * FROM V_EMP_BRANCH WHERE (LEG_CODE LIKE :KEY_SEARCH OR BRANCH_CODE LIKE :KEY_SEARCH OR BRANCH_NAME LIKE :KEY_SEARCH OR EMP_FULLNAME_TH LIKE :KEY_SEARCH) ORDER BY BRANCH_NAME, EMP_FULLNAME_TH ASC",
			{
				replacements: { KEY_SEARCH: req.body.keyword ? `%${req.body.keyword}%` : "%%" },
				type: QueryTypes.SELECT,
				logging: false,
			}
		);
		if (result.length !== 0) {
			return common.checkResponse(200, 20000, "Success", common.camelizeKeys(result), "Branch tax list", "POST");
		} else {
			return common.checkResponse(200, 20000, "Success", result, "Branch tax list", "POST");
		}
	} catch (e) {
		console.log(e);
		return common.checkResponseError(500, 50000, "Error", e, "Branch tax list", "POST");
	}
};

module.exports = {
	dpGroupMenu,
	dpEmpRole,
	dpAllBranchList,
	dpBranchList,
	dpTaskSubCatDashboard,
	dpBranchBUList,
	dpBranchAreaList,
	dpBranchProvinceList,
	dpBranchTaxList,
};
