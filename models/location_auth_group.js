const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const _localAuthGroup = sequelize.define('localAuthGroup', {
            authCode: {
                field: 'AUTH_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            authName: {
                field: 'AUTH_NAME',
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
            tableName: 'MAS_LOCAL_AUTH_GROUP',
            timestamps: false,
            charset: 'utf8'
        });

    return _localAuthGroup;
}