const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('taskSubCat', {
            subCatCode: {
                field: 'SUB_CAT_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            catCode: {
                field: 'CAT_CODE',
                type: DataTypes.STRING,
                allowNull: false
            },
            typeName: {
                field: 'TYPE_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                field: 'ACTIVE',
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: true
            },
            isSpecial: {
                field: 'IS_SPECIAL',
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            isCall: {
                field: 'IS_CAL',
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            taskType: {
                field: 'TASK_TYPE',
                type: DataTypes.STRING,
                allowNull: true
            },
            typeDesc: {
                field: 'TYPE_DESC',
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            tableName: 'MAS_TASK_SUB_CATEGORY',
            timestamps: false,
            charset: 'utf8'
        });
}