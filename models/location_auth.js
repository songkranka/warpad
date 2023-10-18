const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const _localAuth = sequelize.define('localAuth', {
            locId: {
                field: 'LOC_ID',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            locName: {
                field: 'LOC_NAME',
                type: DataTypes.STRING,
                allowNull: false
            },
            authCode: {
                field: 'AUTH_CODE',
                type: DataTypes.STRING,
                allowNull: false
            },
            createdDate: {
                field: 'CREATED_DATE',
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdBy: {
                field: 'CREATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            },
            updatedDate: {
                field: 'UPDATED_DATE',
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedBy: {
                field: 'UPDATED_BY',
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'MAS_LOCAL_AUTH',
            timestamps: false,
            charset: 'utf8'
        });

    return _localAuth;
}