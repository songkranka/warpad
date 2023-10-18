const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const EmpSplitter = sequelize.define('empSplitter', {
            brnCode: {
                field: 'BRANCH_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            brnName: {
                field: 'BRANCH_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            legCode: {
                field: 'LEG_CODE',
                type: DataTypes.STRING,
                allowNull: false
            },
            plantCode: {
                field: 'PLANT_CODE',
                type: DataTypes.STRING,
                allowNull: true
            },
            empId: {
                field: 'EMP_ID',
                type: DataTypes.STRING,
                allowNull: true
            },
            empFullNameTh: {
                field: 'EMP_FULLNAME_TH',
                type: DataTypes.STRING,
                allowNull: true
            },
            posCode: {
                field: 'POS_CODE',
                type: DataTypes.STRING,
                allowNull: true
            },
            posNameTh: {
                field: 'POS_NAME_TH',
                type: DataTypes.STRING,
                allowNull: true
            },
            minLvl: {
                field: 'MINLVL',
                type: DataTypes.SMALLINT,
                allowNull: true
            },
            maxLvl: {
                field: 'MAXLVL',
                type: DataTypes.SMALLINT,
                allowNull: true
            },
            numLvl: {
                field: 'NUMLVL',
                type: DataTypes.INTEGER,
                allowNull: true
            },
            comCodeLV1: {
                field: 'COMPANYCODE_LEVEL1',
                type: DataTypes.STRING,
                allowNull: true
            },
            comNameLV1: {
                field: 'COMPANYNAME_LEVEL1',
                type: DataTypes.STRING,
                allowNull: true
            },
            comCodeLV4: {
                field: 'COMPANYCODE_LEVEL4',
                type: DataTypes.STRING,
                allowNull: true
            },
            comNameLV4: {
                field: 'COMPANYNAME_LEVEL4',
                type: DataTypes.STRING,
                allowNull: true
            },
            locCode: {
                field: 'LOC_CODE',
                type: DataTypes.STRING,
                allowNull: true
            },
            locName: {
                field: 'LOC_NAME',
                type: DataTypes.STRING,
                allowNull: true
            },
            comCodeLV2: {
                field: 'COMPANYCODE_LEVEL2',
                type: DataTypes.STRING,
                allowNull: true
            },
            comNameLV2: {
                field: 'COMPANYNAME_LEVEL2',
                type: DataTypes.STRING,
                allowNull: true
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: DataTypes.STRING,
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
        },
        {
            tableName: 'MAS_EMPLOYEE_SPLITTER',
            timestamps: false,
            charset: 'utf8'
        });

    return EmpSplitter;
}