const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const SlaTime = sequelize.define('slaTime', {
            slaCode: {
                field: 'SLA_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            slaName: {
                field: 'SLA_NAME',
                type: DataTypes.STRING,
                allowNull: true
            },
            addTime: {
                field: 'ADD_TIME',
                type: DataTypes.INTEGER,
                allowNull: true
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
            isSpecial: {
                field: 'IS_SPECIAL',
                type: DataTypes.TINYINT,
                allowNull: true
            },
            startTime: {
                field: 'START_TIME',
                type: DataTypes.STRING,
                allowNull: true
            },
            endTime: {
                field: 'END_TIME',
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            tableName: 'MAS_SLA_CONFIG',
            timestamps: false,
            charset: 'utf8'
        });

    return SlaTime
}