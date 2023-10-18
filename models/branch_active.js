const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const BranchActive = sequelize.define('branchActive', {
            brnCode: {
                field: 'BRN_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            brnName: {
                field: 'BRN_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            active: {
                field: 'ACTIVE',
                type: DataTypes.TINYINT,
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
        },
        {
            tableName: 'MAS_BRANCH_ACTIVE',
            timestamps: false,
            charset: 'utf8'
        });

    return BranchActive;
}