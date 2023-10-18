const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const TaskCategory = sequelize.define('taskCat', {
            catCode: {
                field: 'CAT_CODE',
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            catName: {
                field: 'CAT_NAME',
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
            }
        },
        {
            tableName: 'MAS_TASK_CATEGORY',
            timestamps: false,
            charset: 'utf8'
        });

    return TaskCategory
}